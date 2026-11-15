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
    # Deep sky benchmarks
    "m31": {"ra": 10.6847, "dec": 41.2687, "type": "Galaxy", "desc": "Andromeda Galaxy — nearest large spiral galaxy, 2.5 Mly"},
    "andromeda": {"ra": 10.6847, "dec": 41.2687, "type": "Galaxy", "desc": "Andromeda Galaxy (M31)"},
    "m42": {"ra": 83.8221, "dec": -5.3911, "type": "HII Region", "desc": "Orion Nebula — nearest massive star-forming region"},
    "orion nebula": {"ra": 83.8221, "dec": -5.3911, "type": "HII Region", "desc": "Orion Nebula (M42)"},
    "m1": {"ra": 83.6331, "dec": 22.0145, "type": "SNR", "desc": "Crab Nebula — supernova remnant with pulsar"},
    "crab nebula": {"ra": 83.6331, "dec": 22.0145, "type": "SNR", "desc": "Crab Nebula (M1)"},
    "m87": {"ra": 187.7059, "dec": 12.3911, "type": "Galaxy", "desc": "Virgo A — giant elliptical galaxy with famous jet, first imaged black hole"},
    "cosmos field": {"ra": 150.1192, "dec": 2.2058, "type": "Field", "desc": "COSMOS survey deep field — richest extragalactic survey area"},
    "hubble deep field": {"ra": 189.2286, "dec": 62.2158, "type": "Field", "desc": "Hubble Deep Field — iconic deep sky survey region"},
    "sagittarius a*": {"ra": 266.4168, "dec": -29.0078, "type": "AGN", "desc": "Supermassive black hole at Milky Way center"},
    "pleiades": {"ra": 56.6011, "dec": 24.1141, "type": "Cluster", "desc": "Seven Sisters — young open star cluster, 444 ly"},

    # High proper motion & Planet X benchmarks
    "barnard's star": {"ra": 269.4521, "dec": 4.6933, "type": "Star", "desc": "Fastest proper motion star — 10.3 arcsec/yr, 6 ly away"},
    "proxima centauri": {"ra": 217.4289, "dec": -62.6795, "type": "Star", "desc": "Nearest star to the Sun — 4.246 ly, has confirmed exoplanet"},
    "proxima": {"ra": 217.4289, "dec": -62.6795, "type": "Star", "desc": "Nearest star to the Sun — 4.246 ly, has confirmed exoplanet"},
    "alpha centauri": {"ra": 219.9021, "dec": -60.8340, "type": "Star", "desc": "Alpha Centauri stellar system — closest system to Solar System (4.37 ly)"},
    "alpha centauri a": {"ra": 219.9021, "dec": -60.8340, "type": "Star", "desc": "Alpha Centauri A (Rigil Kentaurus) — solar twin at 4.37 ly"},
    "alpha centauri b": {"ra": 219.9021, "dec": -60.8375, "type": "Star", "desc": "Alpha Centauri B (Toliman) — orange K-dwarf at 4.37 ly"},
    "wise 0855": {"ra": 133.7933, "dec": -7.2451, "type": "Brown Dwarf", "desc": "Coldest known brown dwarf (~250K), high proper motion"},
    "wise 0855-0714": {"ra": 133.7933, "dec": -7.2451, "type": "Brown Dwarf", "desc": "Coldest known brown dwarf (~250K), high proper motion"},
    "epsilon indi b": {"ra": 330.8413, "dec": -56.7860, "type": "Brown Dwarf", "desc": "Nearby brown dwarf binary system, 12 ly"},
    "eta carinae": {"ra": 161.2647, "dec": -59.6844, "type": "Star", "desc": "Massive hypergiant binary, one of the most luminous stars known"},
    "trappist-1": {"ra": 346.6222, "dec": -5.0413, "type": "Star", "desc": "Ultra-cool dwarf star with 7 rocky planets, 3 in habitable zone"},
    "wolf 359": {"ra": 164.1203, "dec": 7.0147, "type": "Star", "desc": "Wolf 359 — nearby flare red dwarf (7.86 ly)"},
    "lalande 21185": {"ra": 165.8341, "dec": 35.9699, "type": "Star", "desc": "Lalande 21185 — bright northern red dwarf (8.31 ly)"},
    "ross 128": {"ra": 176.9351, "dec": 0.8045, "type": "Star", "desc": "Ross 128 — inactive red dwarf with temperate exoplanet (11 ly)"},
    "tau ceti": {"ra": 26.0170, "dec": -15.9375, "type": "Star", "desc": "Tau Ceti — nearby Sun-like G-dwarf with multiple exoplanets"},
    "epsilon eridani": {"ra": 53.2327, "dec": -9.4583, "type": "Star", "desc": "Epsilon Eridani — young nearby K-dwarf with debris ring (10.5 ly)"},

    # Primary Benchmark Stars
    "sirius": {"ra": 101.2872, "dec": -16.7161, "type": "Star", "desc": "Sirius (Alpha Canis Majoris) — brightest star in night sky (-1.46 mag)"},
    "vega": {"ra": 279.2347, "dec": 38.7837, "type": "Star", "desc": "Vega (Alpha Lyrae) — photometric zero calibration anchor"},
    "betelgeuse": {"ra": 88.7929, "dec": 7.4071, "type": "Star", "desc": "Betelgeuse (Alpha Orionis) — red supergiant variable star"},
    "rigel": {"ra": 78.6345, "dec": -8.2016, "type": "Star", "desc": "Rigel (Beta Orionis) — blue-white supergiant"},
    "arcturus": {"ra": 213.9153, "dec": 19.1824, "type": "Star", "desc": "Arcturus (Alpha Boötis) — bright orange giant star"},
    "capella": {"ra": 79.1723, "dec": 45.9980, "type": "Star", "desc": "Capella (Alpha Aurigae) — quadruple yellow star system"},
    "aldebaran": {"ra": 68.9802, "dec": 16.5093, "type": "Star", "desc": "Aldebaran (Alpha Tauri) — glowing red eye of Taurus"},
    "polaris": {"ra": 37.9546, "dec": 89.2641, "type": "Star", "desc": "Polaris (Alpha Ursae Minoris) — North Celestial Pole star"},
    "altair": {"ra": 297.6958, "dec": 8.8683, "type": "Star", "desc": "Altair (Alpha Aquilae) — rapidly rotating A-star of Summer Triangle"},
    "antares": {"ra": 247.3519, "dec": -26.4320, "type": "Star", "desc": "Antares (Alpha Scorpii) — red supergiant heart of Scorpius"},
    "spica": {"ra": 201.2982, "dec": -11.1613, "type": "Star", "desc": "Spica (Alpha Virginis) — spectroscopic binary star"},
    "fomalhaut": {"ra": 344.4127, "dec": -29.6222, "type": "Star", "desc": "Fomalhaut (Alpha Piscis Austrini) — eye of Sauron debris disk"},
    "deneb": {"ra": 310.0264, "dec": 45.2803, "type": "Star", "desc": "Deneb (Alpha Cygni) — luminous blue-white supergiant"},
    "achernar": {"ra": 24.4285, "dec": -57.2368, "type": "Star", "desc": "Achernar (Alpha Eridani) — rapid oblate rotator"},

    # All 88 IAU Constellations
    "andromeda": {"ra": 15.0, "dec": 38.0, "type": "Constellation", "desc": "Andromeda constellation, home of M31"},
    "antlia": {"ra": 151.0, "dec": -32.5, "type": "Constellation", "desc": "Antlia constellation (Air Pump)"},
    "apus": {"ra": 242.0, "dec": -75.3, "type": "Constellation", "desc": "Apus constellation (Bird of Paradise)"},
    "aquarius": {"ra": 334.0, "dec": -9.0, "type": "Constellation", "desc": "Aquarius constellation (Water Bearer)"},
    "aquila": {"ra": 296.5, "dec": 3.4, "type": "Constellation", "desc": "Aquila constellation (The Eagle)"},
    "ara": {"ra": 263.0, "dec": -53.6, "type": "Constellation", "desc": "Ara constellation (The Altar)"},
    "aries": {"ra": 40.0, "dec": 20.8, "type": "Constellation", "desc": "Aries constellation (The Ram)"},
    "auriga": {"ra": 84.0, "dec": 42.0, "type": "Constellation", "desc": "Auriga constellation (The Charioteer)"},
    "bootes": {"ra": 219.0, "dec": 31.0, "type": "Constellation", "desc": "Boötes constellation (The Herdsman)"},
    "boötes": {"ra": 219.0, "dec": 31.0, "type": "Constellation", "desc": "Boötes constellation (The Herdsman)"},
    "caelum": {"ra": 71.0, "dec": -37.8, "type": "Constellation", "desc": "Caelum constellation"},
    "camelopardalis": {"ra": 88.0, "dec": 69.4, "type": "Constellation", "desc": "Camelopardalis constellation"},
    "cancer": {"ra": 130.0, "dec": 19.8, "type": "Constellation", "desc": "Cancer constellation (The Crab)"},
    "canes venatici": {"ra": 196.0, "dec": 40.1, "type": "Constellation", "desc": "Canes Venatici constellation (Hunting Dogs)"},
    "canis major": {"ra": 104.0, "dec": -22.1, "type": "Constellation", "desc": "Canis Major constellation (Great Dog)"},
    "canis minor": {"ra": 115.0, "dec": 6.4, "type": "Constellation", "desc": "Canis Minor constellation (Lesser Dog)"},
    "capricornus": {"ra": 315.0, "dec": -18.0, "type": "Constellation", "desc": "Capricornus constellation (Sea Goat)"},
    "carina": {"ra": 132.0, "dec": -63.2, "type": "Constellation", "desc": "Carina constellation (The Keel)"},
    "cassiopeia": {"ra": 15.0, "dec": 60.0, "type": "Constellation", "desc": "Cassiopeia constellation (The Queen)"},
    "centaurus": {"ra": 196.0, "dec": -47.3, "type": "Constellation", "desc": "Centaurus constellation (The Centaur)"},
    "cepheus": {"ra": 338.0, "dec": 71.0, "type": "Constellation", "desc": "Cepheus constellation (The King)"},
    "cetus": {"ra": 25.0, "dec": -7.2, "type": "Constellation", "desc": "Cetus constellation (Sea Monster)"},
    "chamaeleon": {"ra": 165.0, "dec": -79.2, "type": "Constellation", "desc": "Chamaeleon constellation"},
    "circinus": {"ra": 228.0, "dec": -63.1, "type": "Constellation", "desc": "Circinus constellation"},
    "columba": {"ra": 85.0, "dec": -35.1, "type": "Constellation", "desc": "Columba constellation"},
    "coma berenices": {"ra": 192.0, "dec": 23.3, "type": "Constellation", "desc": "Coma Berenices constellation"},
    "corona australis": {"ra": 286.0, "dec": -40.0, "type": "Constellation", "desc": "Corona Australis constellation"},
    "corona borealis": {"ra": 237.0, "dec": 28.5, "type": "Constellation", "desc": "Corona Borealis constellation"},
    "corvus": {"ra": 186.0, "dec": -18.4, "type": "Constellation", "desc": "Corvus constellation"},
    "crater": {"ra": 171.0, "dec": -15.9, "type": "Constellation", "desc": "Crater constellation"},
    "crux": {"ra": 186.0, "dec": -60.2, "type": "Constellation", "desc": "Crux constellation (Southern Cross)"},
    "southern cross": {"ra": 186.0, "dec": -60.2, "type": "Constellation", "desc": "Crux constellation (Southern Cross)"},
    "cygnus": {"ra": 308.0, "dec": 42.1, "type": "Constellation", "desc": "Cygnus constellation (The Swan)"},
    "delphinus": {"ra": 310.0, "dec": 11.7, "type": "Constellation", "desc": "Delphinus constellation"},
    "dorado": {"ra": 78.0, "dec": -65.3, "type": "Constellation", "desc": "Dorado constellation"},
    "draco": {"ra": 257.0, "dec": 67.2, "type": "Constellation", "desc": "Draco constellation (The Dragon)"},
    "equuleus": {"ra": 318.0, "dec": 7.8, "type": "Constellation", "desc": "Equuleus constellation"},
    "eridanus": {"ra": 55.0, "dec": -29.0, "type": "Constellation", "desc": "Eridanus constellation (Celestial River)"},
    "fornax": {"ra": 38.0, "dec": -31.6, "type": "Constellation", "desc": "Fornax constellation"},
    "gemini": {"ra": 107.0, "dec": 22.5, "type": "Constellation", "desc": "Gemini constellation (The Twins)"},
    "grus": {"ra": 337.0, "dec": -46.4, "type": "Constellation", "desc": "Grus constellation (The Crane)"},
    "hercules": {"ra": 258.0, "dec": 27.5, "type": "Constellation", "desc": "Hercules constellation"},
    "horologium": {"ra": 48.0, "dec": -53.4, "type": "Constellation", "desc": "Horologium constellation"},
    "hydra": {"ra": 170.0, "dec": -14.5, "type": "Constellation", "desc": "Hydra constellation"},
    "hydrus": {"ra": 36.0, "dec": -70.0, "type": "Constellation", "desc": "Hydrus constellation"},
    "indus": {"ra": 318.0, "dec": -56.8, "type": "Constellation", "desc": "Indus constellation"},
    "lacerta": {"ra": 337.0, "dec": 46.0, "type": "Constellation", "desc": "Lacerta constellation"},
    "leo": {"ra": 161.0, "dec": 13.1, "type": "Constellation", "desc": "Leo constellation (The Lion)"},
    "leo minor": {"ra": 153.0, "dec": 33.5, "type": "Constellation", "desc": "Leo Minor constellation"},
    "lepus": {"ra": 83.0, "dec": -19.0, "type": "Constellation", "desc": "Lepus constellation (The Hare)"},
    "libra": {"ra": 228.0, "dec": -15.6, "type": "Constellation", "desc": "Libra constellation (The Scales)"},
    "lupus": {"ra": 231.0, "dec": -42.8, "type": "Constellation", "desc": "Lupus constellation (The Wolf)"},
    "lynx": {"ra": 119.0, "dec": 44.8, "type": "Constellation", "desc": "Lynx constellation"},
    "lyra": {"ra": 283.0, "dec": 36.0, "type": "Constellation", "desc": "Lyra constellation (The Harp)"},
    "mensa": {"ra": 84.0, "dec": -77.5, "type": "Constellation", "desc": "Mensa constellation"},
    "microscopium": {"ra": 312.0, "dec": -36.3, "type": "Constellation", "desc": "Microscopium constellation"},
    "monoceros": {"ra": 106.0, "dec": -5.7, "type": "Constellation", "desc": "Monoceros constellation (The Unicorn)"},
    "musca": {"ra": 189.0, "dec": -70.2, "type": "Constellation", "desc": "Musca constellation"},
    "norma": {"ra": 242.0, "dec": -52.0, "type": "Constellation", "desc": "Norma constellation"},
    "octans": {"ra": 315.0, "dec": -82.0, "type": "Constellation", "desc": "Octans constellation"},
    "ophiuchus": {"ra": 260.0, "dec": -4.3, "type": "Constellation", "desc": "Ophiuchus constellation (Serpent Bearer)"},
    "orion": {"ra": 84.0, "dec": 1.0, "type": "Constellation", "desc": "Orion constellation (The Hunter)"},
    "pavo": {"ra": 292.0, "dec": -65.7, "type": "Constellation", "desc": "Pavo constellation (The Peacock)"},
    "pegasus": {"ra": 340.0, "dec": 19.5, "type": "Constellation", "desc": "Pegasus constellation (Winged Horse)"},
    "perseus": {"ra": 48.0, "dec": 42.5, "type": "Constellation", "desc": "Perseus constellation"},
    "phoenix": {"ra": 10.0, "dec": -42.3, "type": "Constellation", "desc": "Phoenix constellation"},
    "pictor": {"ra": 86.0, "dec": -53.5, "type": "Constellation", "desc": "Pictor constellation"},
    "pisces": {"ra": 14.0, "dec": 13.7, "type": "Constellation", "desc": "Pisces constellation (The Fishes)"},
    "piscis austrinus": {"ra": 334.0, "dec": -30.6, "type": "Constellation", "desc": "Piscis Austrinus constellation"},
    "puppis": {"ra": 112.0, "dec": -31.2, "type": "Constellation", "desc": "Puppis constellation"},
    "pyxis": {"ra": 133.0, "dec": -27.3, "type": "Constellation", "desc": "Pyxis constellation"},
    "reticulum": {"ra": 59.0, "dec": -59.9, "type": "Constellation", "desc": "Reticulum constellation"},
    "sagitta": {"ra": 297.0, "dec": 18.9, "type": "Constellation", "desc": "Sagitta constellation"},
    "sagittarius": {"ra": 286.0, "dec": -25.5, "type": "Constellation", "desc": "Sagittarius constellation (The Archer)"},
    "scorpius": {"ra": 253.0, "dec": -27.0, "type": "Constellation", "desc": "Scorpius constellation (The Scorpion)"},
    "sculptor": {"ra": 0.0, "dec": -32.5, "type": "Constellation", "desc": "Sculptor constellation"},
    "scutum": {"ra": 281.0, "dec": -10.0, "type": "Constellation", "desc": "Scutum constellation"},
    "serpens": {"ra": 260.0, "dec": 6.0, "type": "Constellation", "desc": "Serpens constellation"},
    "sextans": {"ra": 153.0, "dec": -1.0, "type": "Constellation", "desc": "Sextans constellation"},
    "taurus": {"ra": 69.0, "dec": 16.0, "type": "Constellation", "desc": "Taurus constellation (The Bull)"},
    "telescopium": {"ra": 275.0, "dec": -51.0, "type": "Constellation", "desc": "Telescopium constellation"},
    "triangulum": {"ra": 33.0, "dec": 31.5, "type": "Constellation", "desc": "Triangulum constellation"},
    "triangulum australe": {"ra": 242.0, "dec": -65.4, "type": "Constellation", "desc": "Triangulum Australe constellation"},
    "tucana": {"ra": 359.0, "dec": -65.8, "type": "Constellation", "desc": "Tucana constellation"},
    "ursa major": {"ra": 160.0, "dec": 55.4, "type": "Constellation", "desc": "Ursa Major constellation (The Great Bear / Big Dipper)"},
    "ursa minor": {"ra": 225.0, "dec": 77.0, "type": "Constellation", "desc": "Ursa Minor constellation (Little Bear / Polaris)"},
    "vela": {"ra": 140.0, "dec": -47.0, "type": "Constellation", "desc": "Vela constellation (The Sails)"},
    "virgo": {"ra": 198.0, "dec": -4.2, "type": "Constellation", "desc": "Virgo constellation (The Maiden)"},
    "volans": {"ra": 112.0, "dec": -69.8, "type": "Constellation", "desc": "Volans constellation"},
    "vulpecula": {"ra": 304.0, "dec": 24.5, "type": "Constellation", "desc": "Vulpecula constellation (The Fox)"},
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

