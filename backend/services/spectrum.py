"""
Spectrum Service — 102-Band Spectral Extraction
=================================================
Extracts and serves the full 102-channel near-infrared
spectrum for any sky position from SPHEREx data.
"""

from __future__ import annotations

import logging
import numpy as np

from services.irsa import SPHEREX_WAVELENGTHS

logger = logging.getLogger("photonx.spectrum")


async def extract_spectrum(
    ra: float, dec: float, epoch: str = "2025-W18"
) -> dict:
    """
    Extract a 102-band spectrum for a sky position and epoch.

    For real SPHEREx data, this would fetch the MEF FITS file
    and extract flux from each of the 102 channels.

    Currently generates realistic synthetic spectra seeded by
    position for demo purposes with proper astrophysical features.

    Args:
        ra: Right Ascension in degrees
        dec: Declination in degrees
        epoch: Observation epoch identifier

    Returns:
        Dictionary with spectrum data and metadata
    """
    try:
        spectrum = _generate_realistic_spectrum(ra, dec, epoch)
        return {
            "position": {"ra": ra, "dec": dec},
            "epoch": epoch,
            "spectrum": spectrum,
            "unit": "MJy/sr",
        }
    except Exception as e:
        logger.error(f"Spectrum extraction failed for ({ra}, {dec}): {e}")
        raise


def _generate_realistic_spectrum(
    ra: float, dec: float, epoch: str
) -> list[dict]:
    """
    Generate a physically-motivated synthetic NIR spectrum.

    Models different source types based on sky position:
    - Stars: blackbody continuum with absorption features
    - Galaxies: redshifted continuum with emission lines
    - Background: thermal + zodiacal light
    """
    rng = np.random.default_rng(seed=int(abs(ra * 1000 + dec * 777)))

    # Sort wavelengths for clean spectrum
    wavelengths = sorted(SPHEREX_WAVELENGTHS[:102])

    # Choose source type based on position hash
    source_type = rng.choice(["star_cool", "star_hot", "galaxy", "background"], p=[0.35, 0.25, 0.25, 0.15])

    wl = np.array(wavelengths)

    if source_type == "star_cool":
        # Cool star (M/K type): peaks in NIR, molecular absorption
        temp = rng.uniform(2800, 4500)
        flux = _blackbody(wl, temp)
        # Add molecular absorption bands (H2O, CO)
        flux *= 1.0 - 0.3 * np.exp(-((wl - 1.4) ** 2) / 0.01)  # H2O 1.4µm
        flux *= 1.0 - 0.2 * np.exp(-((wl - 1.9) ** 2) / 0.02)  # H2O 1.9µm
        flux *= 1.0 - 0.25 * np.exp(-((wl - 2.3) ** 2) / 0.01)  # CO 2.3µm
        flux *= 1.0 - 0.15 * np.exp(-((wl - 2.7) ** 2) / 0.02)  # H2O 2.7µm
        flux *= rng.uniform(0.5, 5.0)  # brightness scaling

    elif source_type == "star_hot":
        # Hot star (A/F type): blue continuum, Brackett lines
        temp = rng.uniform(6500, 12000)
        flux = _blackbody(wl, temp)
        # Add hydrogen Brackett series absorption
        brackett = [1.588, 1.736, 1.817, 1.875, 2.166, 4.05]
        for line_wl in brackett:
            flux *= 1.0 - 0.15 * np.exp(-((wl - line_wl) ** 2) / 0.003)
        flux *= rng.uniform(0.3, 3.0)

    elif source_type == "galaxy":
        # Galaxy: redshifted continuum + PAH emission
        z = rng.uniform(0.01, 0.5)
        temp = rng.uniform(3500, 6000)
        flux = _blackbody(wl / (1 + z), temp) * 0.5
        # PAH emission features
        pah_centers = np.array([3.3, 3.4]) * (1 + z)
        for pc in pah_centers:
            if 0.75 <= pc <= 5.0:
                flux += 0.3 * np.exp(-((wl - pc) ** 2) / 0.005)
        flux *= rng.uniform(0.2, 1.5)

    else:
        # Background: zodiacal + thermal
        flux = 0.1 * (wl / 2.5) ** 2 + rng.uniform(0.02, 0.08)
        flux = flux * np.ones_like(wl)

    # Add noise scaled to signal
    noise_level = np.maximum(flux * 0.03, 0.005)
    flux += rng.normal(0, noise_level)
    flux_err = noise_level

    # Epoch variation: slight flux changes between epochs
    epoch_seed = hash(epoch) % 1000
    epoch_rng = np.random.default_rng(seed=epoch_seed)
    flux *= 1.0 + epoch_rng.normal(0, 0.01, size=len(flux))

    flux = np.maximum(flux, 0)

    spectrum = []
    for i, (w, f, e) in enumerate(zip(wavelengths, flux, flux_err)):
        spectrum.append({
            "channel": i,
            "wavelength_um": round(w, 4),
            "flux": round(float(f), 6),
            "flux_err": round(float(e), 6),
        })

    return spectrum


def _blackbody(wavelength_um: np.ndarray, temp_k: float) -> np.ndarray:
    """
    Planck blackbody function.

    Args:
        wavelength_um: Wavelength in microns
        temp_k: Temperature in Kelvin

    Returns:
        Spectral radiance (arbitrary units, normalized)
    """
    h = 6.626e-34  # Planck constant
    c = 3.0e8  # Speed of light
    k = 1.381e-23  # Boltzmann constant

    wl_m = wavelength_um * 1e-6
    exponent = np.clip(h * c / (wl_m * k * temp_k), 0, 500)
    bb = (2 * h * c ** 2 / wl_m ** 5) / (np.exp(exponent) - 1)

    # Normalize to peak = 1
    bb_max = bb.max()
    if bb_max > 0:
        bb /= bb_max
    return bb

