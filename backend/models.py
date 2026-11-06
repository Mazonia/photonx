"""
PhotonX Pydantic Models
========================
Request/response schemas for every API endpoint.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


# ── Health ─────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    """GET /api/health response."""

    status: str = "ok"
    version: str
    cache_stats: dict[str, int] | None = None


# ── Sky / SIA2 Query ───────────────────────────────────────────────────

class SkyImageRecord(BaseModel):
    """A single image record returned by SIA2."""

    title: str | None = None
    access_url: str | None = None
    access_format: str | None = None
    ra: float | None = None
    dec: float | None = None
    band_min: float | None = None
    band_max: float | None = None
    obs_id: str | None = None
    instrument: str | None = None
    collection: str | None = None
    extra: dict[str, Any] = Field(default_factory=dict)


class SkyQueryResponse(BaseModel):
    """GET /api/sky response."""

    ra: float
    dec: float
    radius: float
    total: int
    records: list[SkyImageRecord]
    from_cache: bool = False


# ── Cutout ─────────────────────────────────────────────────────────────

class CutoutResponse(BaseModel):
    """GET /api/cutout response — base64-encoded PNG."""

    ra: float
    dec: float
    size: float
    width: int
    height: int
    image_base64: str
    fits_header: dict[str, Any] = Field(default_factory=dict)


# ── Spectra ────────────────────────────────────────────────────────────

class SpectrumPoint(BaseModel):
    """Single wavelength–flux pair."""

    wavelength_um: float = Field(description="Wavelength in microns")
    flux: float = Field(description="Flux value (arbitrary units)")
    band_index: int


class SpectrumResponse(BaseModel):
    """GET /api/spectra response."""

    ra: float
    dec: float
    n_bands: int
    spectrum: list[SpectrumPoint]
    source_name: str | None = None


# ── Diff / Epoch Comparison ────────────────────────────────────────────

class DiffResponse(BaseModel):
    """GET /api/diff response."""

    ra: float
    dec: float
    epoch_1: str
    epoch_2: str
    diff_image_base64: str
    max_residual: float
    mean_residual: float
    width: int
    height: int


# ── Object / Mover Detection ──────────────────────────────────────────

class DetectedObject(BaseModel):
    """A source detected in the difference image."""

    x_pixel: float
    y_pixel: float
    ra: float | None = None
    dec: float | None = None
    flux: float
    significance: float = Field(description="Signal-to-noise ratio")
    label: str | None = None


class ObjectsResponse(BaseModel):
    """GET /api/objects response."""

    ra: float
    dec: float
    n_detected: int
    objects: list[DetectedObject]


# ── SIMBAD Name Resolution ────────────────────────────────────────────

class ResolvedTarget(BaseModel):
    """GET /api/resolve response."""

    name: str
    ra: float
    dec: float
    object_type: str | None = None
    spectral_type: str | None = None
    redshift: float | None = None
    parallax: float | None = None
    distance_pc: float | None = None
    aliases: list[str] = Field(default_factory=list)


# ── Enrichment ─────────────────────────────────────────────────────────

class ExoplanetInfo(BaseModel):
    """Exoplanet data from NASA Exoplanet Archive."""

    name: str
    host_star: str | None = None
    discovery_method: str | None = None
    orbital_period_days: float | None = None
    planet_radius_earth: float | None = None
    planet_mass_earth: float | None = None
    equilibrium_temp_k: float | None = None
    distance_pc: float | None = None


class NeoInfo(BaseModel):
    """Near-Earth Object data from NeoWs."""

    name: str
    neo_id: str
    is_potentially_hazardous: bool = False
    estimated_diameter_km_min: float | None = None
    estimated_diameter_km_max: float | None = None
    close_approach_date: str | None = None
    miss_distance_km: float | None = None
    relative_velocity_kms: float | None = None


class EnrichmentResponse(BaseModel):
    """GET /api/enrich response."""

    ra: float
    dec: float
    search_radius_deg: float
    exoplanets: list[ExoplanetInfo] = Field(default_factory=list)
    neos: list[NeoInfo] = Field(default_factory=list)
    simbad_objects: list[ResolvedTarget] = Field(default_factory=list)


# ── Observability ──────────────────────────────────────────────────────

class ObservabilityResponse(BaseModel):
    """GET /api/observability response."""

    latitude: float
    longitude: float
    cloud_cover_pct: float
    humidity_pct: float
    temperature_c: float
    wind_speed_ms: float
    visibility_m: float
    weather_description: str
    is_night: bool
    sun_altitude_deg: float | None = None
    moon_phase: float | None = None
    observability_score: float = Field(
        description="0–100 score estimating sky quality for observation"
    )
    recommendation: str


# ── Featured Targets ──────────────────────────────────────────────────

class FeaturedTarget(BaseModel):
    """A curated interesting sky position."""

    name: str
    ra: float
    dec: float
    category: str
    description: str
    thumbnail_url: str | None = None
    tags: list[str] = Field(default_factory=list)


class FeaturedResponse(BaseModel):
    """GET /api/featured response."""

    targets: list[FeaturedTarget]
    total: int
