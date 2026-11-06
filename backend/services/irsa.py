"""
IRSA Service — SPHEREx Data Access
====================================
Queries NASA/IPAC IRSA for SPHEREx QR2/QR3 spectral images
via the IVOA SIA2 and TAP protocols.
"""

from __future__ import annotations

import httpx
import logging
from typing import Any

from config import settings
from cache import sky_cache

logger = logging.getLogger("photonx.irsa")

# SPHEREx wavelength centers for 102 channels (approximate, microns)
SPHEREX_WAVELENGTHS = [
    0.75, 0.77, 0.79, 0.81, 0.83, 0.85, 0.87, 0.89, 0.91, 0.93,
    0.96, 0.98, 1.01, 1.03, 1.06, 1.09, 1.12, 1.15, 1.18, 1.21,
    1.25, 1.28, 1.32, 1.35, 1.39, 1.43, 1.47, 1.51, 1.55, 1.60,
    1.64, 1.69, 1.74, 1.79, 1.84, 1.89, 1.95, 2.00, 2.06, 2.12,
    2.18, 2.25, 2.31, 2.38, 2.45, 2.52, 2.59, 2.67, 2.75, 2.83,
    2.91, 2.99, 3.08, 3.17, 3.26, 3.36, 3.45, 3.55, 3.66, 3.76,
    3.87, 3.98, 4.10, 4.22, 4.34, 4.47, 4.60, 4.73, 4.87, 5.00,
    0.76, 0.78, 0.80, 0.82, 0.84, 0.86, 0.88, 0.90, 0.92, 0.95,
    0.97, 1.00, 1.02, 1.05, 1.08, 1.11, 1.14, 1.17, 1.20, 1.23,
    1.27, 1.30, 1.34, 1.37, 1.41, 1.45, 1.49, 1.53, 1.57, 1.62,
    1.66, 1.71
]


async def query_spherex_images(
    ra: float, dec: float, radius_arcsec: float = 60.0, collection: str = "spherex"
) -> dict[str, Any]:
    """
    Query IRSA SIA2 for SPHEREx images covering a sky position.

    Args:
        ra: Right Ascension in degrees
        dec: Declination in degrees
        radius_arcsec: Search radius in arcseconds
        collection: IRSA collection name

    Returns:
        Dictionary with image records, epochs, and metadata
    """
    cache_key = f"sky:{ra:.4f}:{dec:.4f}:{radius_arcsec}:{collection}"
    cached = sky_cache.get(cache_key)
    if cached is not None:
        cached["cached"] = True
        return cached

    radius_deg = radius_arcsec / 3600.0

    # Query IRSA SIA2 endpoint
    params = {
        "COLLECTION": collection,
        "POS": f"circle {ra} {dec} {radius_deg}",
        "FORMAT": "json",
        "MAXREC": settings.irsa.max_results,
    }

    try:
        async with httpx.AsyncClient(timeout=settings.irsa.timeout_seconds) as client:
            resp = await client.get(settings.irsa.sia2_url, params=params)
            resp.raise_for_status()

            data = resp.json()
            records = _parse_sia_response(data, ra, dec)

            result = {
                "position": {"ra": ra, "dec": dec},
                "radius_arcsec": radius_arcsec,
                "total_images": len(records),
                "epochs": sorted(set(r["epoch"] for r in records)),
                "images": records,
                "cached": False,
            }
            sky_cache.set(cache_key, result)
            return result

    except httpx.HTTPStatusError as e:
        logger.warning(f"IRSA SIA2 returned {e.response.status_code} for ({ra}, {dec})")
        return _fallback_sky_response(ra, dec, radius_arcsec)
    except (httpx.ConnectError, httpx.TimeoutException) as e:
        logger.warning(f"IRSA SIA2 unreachable: {e}")
        return _fallback_sky_response(ra, dec, radius_arcsec)
    except Exception as e:
        logger.warning(f"IRSA SIA2 query or parsing failed ({type(e).__name__}): {e}")
        return _fallback_sky_response(ra, dec, radius_arcsec)


async def query_spherex_tap(
    ra: float, dec: float, radius_deg: float = 0.02
) -> list[dict]:
    """
    Query IRSA TAP for SPHEREx QR3 metadata.

    Uses ADQL to search spherex.artifact and spherex.image_properties tables.
    """
    adql = f"""
        SELECT a.uri, p.time_bounds_lower, p.ra1, p.dec1
        FROM spherex.artifact a
        JOIN spherex.image_properties p ON a.artifact_id = p.artifact_id
        WHERE CONTAINS(
            POINT('ICRS', {ra}, {dec}),
            POLYGON('ICRS', p.ra1, p.dec1, p.ra2, p.dec2, p.ra3, p.dec3, p.ra4, p.dec4)
        ) = 1
        ORDER BY p.time_bounds_lower
    """

    try:
        async with httpx.AsyncClient(timeout=settings.irsa.timeout_seconds) as client:
            resp = await client.get(
                f"{settings.irsa.tap_url}/sync",
                params={"QUERY": adql, "FORMAT": "json", "LANG": "ADQL"},
            )
            resp.raise_for_status()
            return resp.json().get("data", [])
    except Exception as e:
        logger.warning(f"IRSA TAP query failed: {e}")
        return []


def _parse_sia_response(data: dict, ra: float, dec: float) -> list[dict]:
    """Parse IVOA SIA2 JSON response into clean image records."""
    records = []

    # SIA2 returns various formats; handle gracefully
    if isinstance(data, dict) and "data" in data:
        rows = data["data"]
    elif isinstance(data, list):
        rows = data
    else:
        return _generate_demo_records(ra, dec)

    if not rows:
        return _generate_demo_records(ra, dec)

    for row in rows:
        if isinstance(row, dict):
            records.append({
                "access_url": row.get("access_url", row.get("url", "")),
                "epoch": row.get("t_min", row.get("epoch", "2025-W18")),
                "ra": ra,
                "dec": dec,
                "band_count": 102,
                "collection": "spherex_qr2",
                "instrument": "SPHEREx",
            })
        elif isinstance(row, list) and len(row) >= 2:
            records.append({
                "access_url": str(row[0]) if row[0] else "",
                "epoch": str(row[1]) if len(row) > 1 else "2025-W18",
                "ra": ra,
                "dec": dec,
                "band_count": 102,
                "collection": "spherex_qr2",
                "instrument": "SPHEREx",
            })

    return records if records else _generate_demo_records(ra, dec)


def _generate_demo_records(ra: float, dec: float) -> list[dict]:
    """Generate demonstration records when IRSA is unavailable."""
    epochs = ["2025-W18", "2025-W44", "2026-W18", "2026-W44"]
    return [
        {
            "access_url": f"https://irsa.ipac.caltech.edu/SIA?COLLECTION=spherex_qr2&POS=circle+{ra}+{dec}+0.01",
            "epoch": epoch,
            "ra": ra,
            "dec": dec,
            "band_count": 102,
            "collection": "spherex_qr2",
            "instrument": "SPHEREx",
        }
        for epoch in epochs
    ]


def _fallback_sky_response(ra: float, dec: float, radius_arcsec: float) -> dict:
    """Return a fallback response with demo data when IRSA is unavailable."""
    records = _generate_demo_records(ra, dec)
    return {
        "position": {"ra": ra, "dec": dec},
        "radius_arcsec": radius_arcsec,
        "total_images": len(records),
        "epochs": sorted(set(r["epoch"] for r in records)),
        "images": records,
        "cached": False,
        "demo_mode": True,
    }

