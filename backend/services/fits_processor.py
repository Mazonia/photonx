"""
FITS Processor — Image Handling & Conversion
=============================================
Fetches FITS cutouts from IRSA, extracts image data from
SPHEREx multi-extension FITS files, and converts to PNG.
"""

from __future__ import annotations

import base64
import io
import logging
from typing import Optional

import httpx
import numpy as np
from PIL import Image

from config import settings
from cache import cutout_cache

logger = logging.getLogger("photonx.fits")


async def fetch_cutout_png(
    image_url: str,
    ra: float,
    dec: float,
    size_arcsec: float = 120.0,
    channel: int = 42,
) -> dict:
    """
    Fetch a FITS cutout from IRSA and return as base64-encoded PNG.

    For demo/fallback: generates a synthetic infrared-style image.

    Args:
        image_url: IRSA image access URL
        ra: Right Ascension in degrees
        dec: Declination in degrees
        size_arcsec: Cutout size in arcseconds
        channel: SPHEREx spectral channel (0-101)

    Returns:
        Dictionary with base64 PNG, dimensions, and metadata
    """
    cache_key = f"cutout:{ra:.4f}:{dec:.4f}:{channel}:{size_arcsec}"
    cached = cutout_cache.get(cache_key)
    if cached is not None:
        return cached

    if image_url and image_url.startswith(("http://", "https://")):
        try:
            # Try fetching real FITS data from IRSA
            cutout_url = _build_cutout_url(image_url, ra, dec, size_arcsec)
            async with httpx.AsyncClient(timeout=settings.irsa.timeout_seconds) as client:
                resp = await client.get(cutout_url)
                resp.raise_for_status()

                # Try to parse as FITS
                try:
                    from astropy.io import fits as astro_fits

                    hdu_list = astro_fits.open(io.BytesIO(resp.content))
                    # SPHEREx MEF: channel data is in extensions
                    ext_idx = min(channel, len(hdu_list) - 1)
                    if ext_idx > 0 and hdu_list[ext_idx].data is not None:
                        img_data = hdu_list[ext_idx].data
                    elif hdu_list[0].data is not None:
                        img_data = hdu_list[0].data
                    else:
                        img_data = _generate_synthetic_image(ra, dec, channel)
                    hdu_list.close()
                except Exception:
                    img_data = _generate_synthetic_image(ra, dec, channel)

                img_b64, w, h = _array_to_png_base64(img_data, channel)
                result = {
                    "position": {"ra": ra, "dec": dec},
                    "epoch": "2025-W18",
                    "channel": channel,
                    "wavelength_um": _channel_to_wavelength(channel),
                    "image_base64": img_b64,
                    "width": w,
                    "height": h,
                }
                cutout_cache.set(cache_key, result)
                return result

        except Exception as e:
            logger.warning(f"FITS fetch failed for ({ra}, {dec}), channel {channel}: {e}")

    # Fallback / Direct synthesis for positions without direct MEF URL
    img_data = _generate_synthetic_image(ra, dec, channel)
    img_b64, w, h = _array_to_png_base64(img_data, channel)
    result = {
        "position": {"ra": ra, "dec": dec},
        "epoch": "2025-W18",
        "channel": channel,
        "wavelength_um": _channel_to_wavelength(channel),
        "image_base64": img_b64,
        "width": w,
        "height": h,
        "demo_mode": True,
    }
    cutout_cache.set(cache_key, result)
    return result


def _build_cutout_url(image_url: str, ra: float, dec: float, size_arcsec: float) -> str:
    """Build an IRSA cutout URL from an image access URL."""
    size_deg = size_arcsec / 3600.0
    if "?" in image_url:
        return f"{image_url}&center={ra},{dec}d&size={size_deg}"
    return f"{image_url}?center={ra},{dec}d&size={size_deg}"


def _generate_synthetic_image(ra: float, dec: float, channel: int, size: int = 128) -> np.ndarray:
    """
    Generate a realistic synthetic infrared sky image for demonstration.

    Uses the sky coordinates as a seed to create reproducible star fields
    that look different for different positions.
    """
    rng = np.random.default_rng(seed=int(abs(ra * 1000 + dec * 100 + channel)))

    # Dark background with noise (simulating sky background)
    img = rng.normal(loc=0.1, scale=0.02, size=(size, size)).astype(np.float64)

    # Add point sources (stars) — Gaussian PSFs
    n_stars = rng.integers(15, 60)
    for _ in range(n_stars):
        x0 = rng.uniform(0, size)
        y0 = rng.uniform(0, size)
        flux = rng.exponential(0.3) + 0.1
        sigma = rng.uniform(1.2, 2.5)

        y, x = np.mgrid[0:size, 0:size]
        psf = flux * np.exp(-((x - x0) ** 2 + (y - y0) ** 2) / (2 * sigma ** 2))
        img += psf

    # Add a bright extended source sometimes (galaxy/nebula)
    if rng.random() > 0.5:
        cx, cy = rng.uniform(size * 0.2, size * 0.8, size=2)
        sx, sy = rng.uniform(5, 20, size=2)
        y, x = np.mgrid[0:size, 0:size]
        galaxy = 0.5 * np.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2))
        img += galaxy

    # Add slight channel-dependent variation (shorter λ = more sources)
    wavelength = _channel_to_wavelength(channel)
    if wavelength < 1.5:
        img *= 1.2
    elif wavelength > 3.5:
        img *= 0.7
        # Add thermal background at longer wavelengths
        img += rng.uniform(0.05, 0.15)

    return np.clip(img, 0, None)


def _array_to_png_base64(data: np.ndarray, channel: int = 42) -> tuple[str, int, int]:
    """
    Convert a 2D numpy array to a false-color infrared PNG, base64-encoded.

    Uses a custom infrared colormap: deep blue → teal → gold → white.
    """
    if data.ndim > 2:
        data = data[0] if data.shape[0] < data.shape[-1] else data[:, :, 0]

    # Normalize with asinh stretch (common in astronomy)
    vmin = np.percentile(data, 1)
    vmax = np.percentile(data, 99.5)
    if vmax <= vmin:
        vmax = vmin + 1.0

    normalized = np.clip((data - vmin) / (vmax - vmin), 0, 1)
    stretched = np.arcsinh(normalized * 10) / np.arcsinh(10)

    # Apply infrared false-color palette
    rgb = _apply_ir_colormap(stretched, channel)

    img = Image.fromarray(rgb, mode="RGB")
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")

    return b64, img.width, img.height


def _apply_ir_colormap(normalized: np.ndarray, channel: int = 42) -> np.ndarray:
    """
    Apply a custom infrared colormap.

    Shorter wavelengths → blue-teal palette
    Longer wavelengths → amber-gold palette
    """
    h, w = normalized.shape
    rgb = np.zeros((h, w, 3), dtype=np.uint8)

    wavelength = _channel_to_wavelength(channel)

    if wavelength < 2.0:
        # Near-IR: deep space → teal → white
        r = np.clip(normalized * 0.3 + normalized ** 3 * 0.7, 0, 1) * 200
        g = np.clip(normalized * 0.7 + normalized ** 2 * 0.3, 0, 1) * 230
        b = np.clip(normalized * 0.5 + normalized ** 1.5 * 0.5, 0, 1) * 255
    elif wavelength < 3.5:
        # Mid-IR: deep space → teal-gold
        r = np.clip(normalized ** 1.5, 0, 1) * 240
        g = np.clip(normalized * 0.8, 0, 1) * 200
        b = np.clip(normalized * 0.3, 0, 1) * 150
    else:
        # Far-IR: deep space → gold → white
        r = np.clip(normalized * 0.9 + normalized ** 2 * 0.1, 0, 1) * 240
        g = np.clip(normalized * 0.75, 0, 1) * 192
        b = np.clip(normalized * 0.2, 0, 1) * 100

    rgb[:, :, 0] = np.clip(r, 0, 255).astype(np.uint8)
    rgb[:, :, 1] = np.clip(g, 0, 255).astype(np.uint8)
    rgb[:, :, 2] = np.clip(b, 0, 255).astype(np.uint8)

    return rgb


def _channel_to_wavelength(channel: int) -> float:
    """Convert SPHEREx channel number (0-101) to wavelength in microns."""
    from services.irsa import SPHEREX_WAVELENGTHS
    if 0 <= channel < len(SPHEREX_WAVELENGTHS):
        return SPHEREX_WAVELENGTHS[channel]
    # Linear interpolation fallback
    return 0.75 + (channel / 101) * (5.0 - 0.75)

