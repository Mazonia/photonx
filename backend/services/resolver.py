"""
Resolver — SIMBAD Name Resolution
====================================
Resolves astronomical object names to sky coordinates
using the SIMBAD astronomical database.
"""

from __future__ import annotations

import logging
import httpx

from config import settings
from cache import resolve_cache

logger = logging.getLogger("photonx.resolver")

# Pre-built catalog of well-known objects for instant resolution
KNOWN_OBJECTS = {
    "m31": {"ra": 10.6847, "dec": 41.2687, "type": "Galaxy", "desc": "Andromeda Galaxy — nearest large spiral galaxy, 2.5 Mly"},
    "andromeda": {"ra": 10.6847, "dec": 41.2687, "type": "Galaxy", "desc": "Andromeda Galaxy (M31)"},
    "m42": {"ra": 83.8221, "dec": -5.3911, "type": "HII Region", "desc": "Orion Nebula — nearest massive star-forming region"},
    "orion nebula": {"ra": 83.8221, "dec": -5.3911, "type": "HII Region", "desc": "Orion Nebula (M42)"},
    "m1": {"ra": 83.6331, "dec": 22.0145, "type": "SNR", "desc": "Crab Nebula — supernova remnant with pulsar"},
    "crab nebula": {"ra": 83.6331, "dec": 22.0145, "type": "SNR", "desc": "Crab Nebula (M1)"},
    "barnard's star": {"ra": 269.4521, "dec": 4.6933, "type": "Star", "desc": "Fastest proper motion star — 10.3 arcsec/yr, 6 ly away"},
    "proxima centauri": {"ra": 217.3942, "dec": -62.6795, "type": "Star", "desc": "Nearest star to the Sun — 4.24 ly, has confirmed exoplanet"},
    "wise 0855": {"ra": 133.7933, "dec": -7.2451, "type": "Brown Dwarf", "desc": "Coldest known brown dwarf (~250K), high proper motion"},
    "epsilon indi b": {"ra": 330.8413, "dec": -56.7860, "type": "Brown Dwarf", "desc": "Nearby brown dwarf binary system, 12 ly"},
    "sagittarius a*": {"ra": 266.4168, "dec": -29.0078, "type": "AGN", "desc": "Supermassive black hole at Milky Way center"},
    "pleiades": {"ra": 56.6011, "dec": 24.1141, "type": "Cluster", "desc": "Seven Sisters — young open star cluster, 444 ly"},
    "m87": {"ra": 187.7059, "dec": 12.3911, "type": "Galaxy", "desc": "Virgo A — giant elliptical galaxy with famous jet, first imaged black hole"},
    "eta carinae": {"ra": 161.2647, "dec": -59.6844, "type": "Star", "desc": "Massive hypergiant binary, one of the most luminous stars known"},
    "trappist-1": {"ra": 346.6222, "dec": -5.0413, "type": "Star", "desc": "Ultra-cool dwarf star with 7 rocky planets, 3 in habitable zone"},
    "cosmos field": {"ra": 150.1192, "dec": 2.2058, "type": "Field", "desc": "COSMOS survey deep field — richest extragalactic survey area"},
    "hubble deep field": {"ra": 189.2286, "dec": 62.2158, "type": "Field", "desc": "Hubble Deep Field — iconic deep sky survey region"},
}


async def resolve_name(name: str) -> dict:
    """
    Resolve an astronomical object name to sky coordinates.

    Tries local catalog first, then queries SIMBAD.

    Args:
        name: Object name (e.g., 'M31', 'Barnard's Star', 'RA Dec')

    Returns:
        Dictionary with ra, dec, object_type, description
    """
    # Check cache
    cache_key = f"resolve:{name.lower().strip()}"
    cached = resolve_cache.get(cache_key)
    if cached is not None:
        return cached

    # Try coordinate parsing first (e.g., "150.78 +03.35")
    coord_result = _try_parse_coordinates(name)
    if coord_result:
        resolve_cache.set(cache_key, coord_result)
        return coord_result

    # Try local catalog
    key = name.lower().strip()
    if key in KNOWN_OBJECTS:
        obj = KNOWN_OBJECTS[key]
        result = {
            "name": name,
            "ra": obj["ra"],
            "dec": obj["dec"],
            "object_type": obj["type"],
            "description": obj["desc"],
        }
        resolve_cache.set(cache_key, result)
        return result

    # Query SIMBAD
    return await _query_simbad(name)


async def _query_simbad(name: str) -> dict:
    """Query SIMBAD for object coordinates."""
    cache_key = f"resolve:{name.lower().strip()}"

    try:
        url = "https://simbad.u-strasbg.fr/simbad/sim-id"
        params = {
            "Ident": name,
            "output.format": "votable",
            "output.params": "main_id,ra,dec,otype_txt",
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, params=params)

            # Try simpler TAP query approach
            tap_url = "https://simbad.cds.unistra.fr/simbad/sim-tap/sync"
            adql = f"SELECT TOP 1 main_id, ra, dec, otype_longname FROM basic WHERE main_id = '{name}' OR ident.id = '{name}'"
            tap_resp = await client.get(
                tap_url,
                params={"request": "doQuery", "lang": "adql", "format": "json", "query": adql},
            )

            if tap_resp.status_code == 200:
                data = tap_resp.json()
                if "data" in data and data["data"]:
                    row = data["data"][0]
                    result = {
                        "name": str(row[0]) if row[0] else name,
                        "ra": float(row[1]) if row[1] else 0.0,
                        "dec": float(row[2]) if row[2] else 0.0,
                        "object_type": str(row[3]) if len(row) > 3 and row[3] else None,
                        "description": None,
                    }
                    resolve_cache.set(cache_key, result)
                    return result

    except Exception as e:
        logger.warning(f"SIMBAD query failed for '{name}': {e}")

    # Fallback: try to match partial names in local catalog
    key = name.lower().strip()
    for catalog_key, obj in KNOWN_OBJECTS.items():
        if key in catalog_key or catalog_key in key:
            result = {
                "name": name,
                "ra": obj["ra"],
                "dec": obj["dec"],
                "object_type": obj["type"],
                "description": obj["desc"],
            }
            resolve_cache.set(cache_key, result)
            return result

    raise ValueError(f"Could not resolve '{name}'. Try entering coordinates directly (e.g., '150.78 +3.35').")


def _try_parse_coordinates(text: str) -> dict | None:
    """Try to parse text as sky coordinates (RA Dec in degrees)."""
    import re

    text = text.strip()

    # Pattern: two numbers separated by space/comma
    pattern = r"^([+-]?\d+\.?\d*)\s*[,\s]\s*([+-]?\d+\.?\d*)$"
    match = re.match(pattern, text)
    if match:
        ra = float(match.group(1))
        dec = float(match.group(2))
        if 0 <= ra <= 360 and -90 <= dec <= 90:
            return {
                "name": f"({ra:.4f}, {dec:+.4f})",
                "ra": ra,
                "dec": dec,
                "object_type": "Coordinates",
                "description": f"RA={ra:.4f}° Dec={dec:+.4f}°",
            }
    return None

