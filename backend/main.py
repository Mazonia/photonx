"""
PhotonX Backend — Main FastAPI Application
=============================================
Interactive SPHEREx sky browser API for the
NASA Space Apps Challenge 2026.

Team: PhotonX (Mazonia) | Challenge: Planet X and SPHEREx
Data: NASA/IPAC IRSA SPHEREx QR2 (DOI: 10.26131/IRSA629)
"""

from __future__ import annotations

import logging
import sys

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from cache import sky_cache, cutout_cache, resolve_cache
from services.irsa import query_spherex_images
from services.fits_processor import fetch_cutout_png
from services.spectrum import extract_spectrum
from services.diff_engine import compute_diff
from services.resolver import resolve_name
from services.enrichment import enrich_position
from services.observability import check_observability
from services.skyview import fetch_survey_image

# ──────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(name)-24s  %(levelname)-5s  %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger("photonx")

# ──────────────────────────────────────────────
# App
# ──────────────────────────────────────────────
app = FastAPI(
    title="PhotonX API",
    description="Interactive SPHEREx infrared sky browser — NASA Space Apps 2026",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Featured Targets
# ──────────────────────────────────────────────
FEATURED_TARGETS = [
    {
        "name": "Barnard's Star",
        "ra": 269.4521,
        "dec": 4.6933,
        "description": "Second-closest star system. Fastest proper motion (10.3\"/yr) — a perfect SPHEREx mover test.",
        "category": "High Proper Motion",
        "why_interesting": "Guaranteed to show positional shift between SPHEREx epochs. The gold standard mover test target.",
    },
    {
        "name": "WISE 0855−0714",
        "ra": 133.7933,
        "dec": -7.2451,
        "description": "The coldest known brown dwarf (~250 K). Fast-moving, faint, and only detectable in infrared.",
        "category": "Brown Dwarf",
        "why_interesting": "A Planet X analog — cold, faint, and fast-moving. SPHEREx's 102 NIR bands are ideal for its characterization.",
    },
    {
        "name": "COSMOS Deep Field",
        "ra": 150.1192,
        "dec": 2.2058,
        "description": "The richest extragalactic survey field. Billions of galaxies, SPHEREx deep coverage.",
        "category": "Deep Field",
        "why_interesting": "SPHEREx has deep-field coverage here. Dense with objects — great for demonstrating spectral extraction.",
    },
    {
        "name": "Andromeda Galaxy (M31)",
        "ra": 10.6847,
        "dec": 41.2687,
        "description": "Our nearest large neighbor galaxy, 2.5 million light-years away. Stunning in near-infrared.",
        "category": "Galaxy",
        "why_interesting": "Iconic target. SPHEREx NIR data reveals old stellar populations invisible in optical light.",
    },
    {
        "name": "Orion Nebula (M42)",
        "ra": 83.8221,
        "dec": -5.3911,
        "description": "Nearest massive star-forming region. Rich in water ice and organic molecules that glow in NIR.",
        "category": "Nebula",
        "why_interesting": "SPHEREx maps biogenic ices (H₂O, CO₂, CO) in star-forming regions — this is science goal #3.",
    },
    {
        "name": "Epsilon Indi B",
        "ra": 330.8413,
        "dec": -56.7860,
        "description": "Nearby brown dwarf binary at 12 light-years. Detectable proper motion in SPHEREx.",
        "category": "Brown Dwarf",
        "why_interesting": "Another mover test. Binary brown dwarf system — two sources shifting together.",
    },
    {
        "name": "Trappist-1",
        "ra": 346.6222,
        "dec": -5.0413,
        "description": "Ultra-cool dwarf star with 7 rocky planets, 3 in the habitable zone. 40 light-years away.",
        "category": "Exoplanet Host",
        "why_interesting": "Most famous exoplanet system. SPHEREx NIR spectrum reveals the host star's composition.",
    },
    {
        "name": "Galactic Center (Sgr A*)",
        "ra": 266.4168,
        "dec": -29.0078,
        "description": "The supermassive black hole at the center of our galaxy. Visible only in infrared and radio.",
        "category": "Black Hole",
        "why_interesting": "Optical light is blocked by dust. SPHEREx near-infrared pierces through — revealing the hidden center.",
    },
    {
        "name": "Pleiades (M45)",
        "ra": 56.6011,
        "dec": 24.1141,
        "description": "The Seven Sisters — a young, bright open cluster at 444 light-years. Iconic in every culture.",
        "category": "Star Cluster",
        "why_interesting": "Bright, extended, and familiar. Perfect first target for any citizen scientist exploring SPHEREx data.",
    },
    {
        "name": "Eta Carinae",
        "ra": 161.2647,
        "dec": -59.6844,
        "description": "A massive hypergiant binary. One of the most luminous and unstable stars known. Pre-supernova.",
        "category": "Massive Star",
        "why_interesting": "Extreme NIR brightness and variability. SPHEREx may catch brightness changes between epochs.",
    },
]


# ──────────────────────────────────────────────
# Error handler
# ──────────────────────────────────────────────
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "detail": str(exc.detail), "status_code": exc.status_code},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    logger.exception("Unhandled error")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc), "status_code": 500},
    )


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "photonx-backend",
        "version": "1.0.0",
        "cache_size": sky_cache.size + cutout_cache.size + resolve_cache.size,
    }


@app.get("/api/sky")
async def get_sky_images(
    ra: float = Query(..., ge=0, le=360, description="Right Ascension in degrees"),
    dec: float = Query(..., ge=-90, le=90, description="Declination in degrees"),
    radius_arcsec: float = Query(60.0, ge=1, le=600, description="Search radius in arcseconds"),
    collection: str = Query("spherex", description="IRSA collection name"),
):
    """Query IRSA for SPHEREx images covering a sky position."""
    try:
        result = await query_spherex_images(ra, dec, radius_arcsec, collection)
        return result
    except Exception as e:
        logger.error(f"/api/sky failed: {e}")
        raise HTTPException(status_code=502, detail=f"IRSA query failed: {str(e)}")


@app.get("/api/cutout")
async def get_cutout(
    ra: float = Query(..., ge=0, le=360),
    dec: float = Query(..., ge=-90, le=90),
    size_arcsec: float = Query(120.0, ge=10, le=600),
    channel: int = Query(42, ge=0, le=101, description="SPHEREx spectral channel (0-101)"),
    image_url: str = Query("", description="IRSA image access URL"),
):
    """Fetch a FITS cutout and return as PNG image."""
    try:
        result = await fetch_cutout_png(image_url, ra, dec, size_arcsec, channel)
        return result
    except Exception as e:
        logger.error(f"/api/cutout failed: {e}")
        raise HTTPException(status_code=502, detail=f"Cutout fetch failed: {str(e)}")


@app.get("/api/spectra")
async def get_spectrum(
    ra: float = Query(..., ge=0, le=360),
    dec: float = Query(..., ge=-90, le=90),
    epoch: str = Query("2025-W18", description="Observation epoch"),
):
    """Extract the full 102-band spectrum for a sky position."""
    try:
        result = await extract_spectrum(ra, dec, epoch)
        return result
    except Exception as e:
        logger.error(f"/api/spectra failed: {e}")
        raise HTTPException(status_code=502, detail=f"Spectrum extraction failed: {str(e)}")


@app.get("/api/diff")
async def get_diff(
    ra: float = Query(..., ge=0, le=360),
    dec: float = Query(..., ge=-90, le=90),
    epoch_a: str = Query("2025-W18"),
    epoch_b: str = Query("2025-W44"),
    channel: int = Query(42, ge=0, le=101),
    threshold: float = Query(3.0, ge=1.0, le=10.0),
):
    """Compute epoch difference and detect moving objects."""
    try:
        result = await compute_diff(ra, dec, epoch_a, epoch_b, channel, threshold)
        return result
    except Exception as e:
        logger.error(f"/api/diff failed: {e}")
        raise HTTPException(status_code=502, detail=f"Diff computation failed: {str(e)}")


@app.get("/api/objects")
async def get_objects(
    ra: float = Query(..., ge=0, le=360),
    dec: float = Query(..., ge=-90, le=90),
    epoch_a: str = Query("2025-W18"),
    epoch_b: str = Query("2025-W44"),
    threshold: float = Query(3.0, ge=1.0, le=10.0),
):
    """Detect candidate moving objects between two epochs."""
    try:
        diff_result = await compute_diff(ra, dec, epoch_a, epoch_b, 42, threshold)
        return {
            "position": {"ra": ra, "dec": dec},
            "epoch_a": epoch_a,
            "epoch_b": epoch_b,
            "candidates": diff_result["candidates"],
            "total_candidates": len(diff_result["candidates"]),
        }
    except Exception as e:
        logger.error(f"/api/objects failed: {e}")
        raise HTTPException(status_code=502, detail=f"Object detection failed: {str(e)}")


@app.get("/api/resolve")
async def resolve(
    name: str = Query(..., min_length=1, description="Object name or coordinates"),
):
    """Resolve an astronomical object name to sky coordinates."""
    try:
        result = await resolve_name(name)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"/api/resolve failed: {e}")
        raise HTTPException(status_code=502, detail=f"Name resolution failed: {str(e)}")


@app.get("/api/enrich")
async def enrich(
    ra: float = Query(..., ge=0, le=360),
    dec: float = Query(..., ge=-90, le=90),
    radius_arcsec: float = Query(30.0, ge=1, le=300),
):
    """Get cross-reference enrichment data for a sky position."""
    try:
        result = await enrich_position(ra, dec, radius_arcsec)
        return result
    except Exception as e:
        logger.error(f"/api/enrich failed: {e}")
        raise HTTPException(status_code=502, detail=f"Enrichment failed: {str(e)}")


@app.get("/api/observability")
async def observability(
    ra: float = Query(..., ge=0, le=360),
    dec: float = Query(..., ge=-90, le=90),
    lat: float = Query(0.0, ge=-90, le=90, description="Observer latitude"),
    lon: float = Query(0.0, ge=-180, le=180, description="Observer longitude"),
):
    """Check if a sky position is observable tonight from a location."""
    try:
        result = await check_observability(ra, dec, lat, lon)
        return result
    except Exception as e:
        logger.error(f"/api/observability failed: {e}")
        raise HTTPException(status_code=502, detail=f"Observability check failed: {str(e)}")


@app.get("/api/featured")
async def featured_targets():
    """Get a curated list of interesting sky targets to explore."""
    return {
        "targets": FEATURED_TARGETS,
        "total": len(FEATURED_TARGETS),
    }


@app.get("/api/skyview")
async def skyview_cutout(
    ra: float = Query(..., ge=0, le=360),
    dec: float = Query(..., ge=-90, le=90),
    survey: str = Query("dss", description="Survey: dss, 2mass, wise, spherex"),
    pixels: int = Query(400, ge=100, le=800),
    size_deg: float = Query(0.5, ge=0.01, le=5.0),
):
    """Fetch authentic all-sky survey imagery from NASA Goddard SkyView."""
    try:
        result = await fetch_survey_image(ra, dec, survey, pixels, size_deg)
        return result
    except Exception as e:
        logger.error(f"/api/skyview failed: {e}")
        raise HTTPException(status_code=502, detail=f"SkyView query failed: {str(e)}")


# ──────────────────────────────────────────────
# Startup
# ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

