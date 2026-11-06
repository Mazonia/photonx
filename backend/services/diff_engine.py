"""
Diff Engine — Epoch Differencing & Mover Detection
=====================================================
Computes pixel differences between SPHEREx epochs
and detects objects that shifted position.
"""

from __future__ import annotations

import base64
import io
import logging

import numpy as np
from PIL import Image

from services.fits_processor import _generate_synthetic_image, _channel_to_wavelength

logger = logging.getLogger("photonx.diff")


async def compute_diff(
    ra: float,
    dec: float,
    epoch_a: str = "2025-W18",
    epoch_b: str = "2025-W44",
    channel: int = 42,
    threshold: float = 3.0,
) -> dict:
    """
    Compute a difference image between two epochs and detect movers.

    Args:
        ra, dec: Sky position in degrees
        epoch_a, epoch_b: Epoch identifiers
        channel: Spectral channel
        threshold: Detection threshold in sigma

    Returns:
        Dictionary with diff image (base64 PNG) and candidate movers
    """
    # Generate epoch A and B images (seeded differently per epoch)
    img_a = _generate_synthetic_image(ra, dec, channel, size=128)

    # Epoch B: shift some sources to simulate motion
    rng_b = np.random.default_rng(seed=int(abs(ra * 1000 + dec * 100 + channel + hash(epoch_b) % 100)))
    img_b = _generate_synthetic_image(ra + 0.001, dec + 0.0005, channel, size=128)

    # Add a deliberate mover — an object that shifts between epochs
    _add_mover(img_a, img_b, ra, dec, rng_b)

    # Compute difference
    diff = img_b.astype(np.float64) - img_a.astype(np.float64)

    # Detect candidates
    candidates = _detect_movers(diff, ra, dec, threshold)

    # Generate false-color diff image
    diff_b64 = _diff_to_png(diff, channel)

    return {
        "position": {"ra": ra, "dec": dec},
        "epoch_a": epoch_a,
        "epoch_b": epoch_b,
        "channel": channel,
        "diff_image_base64": diff_b64,
        "candidates": candidates,
    }


def _add_mover(img_a: np.ndarray, img_b: np.ndarray, ra: float, dec: float, rng) -> None:
    """Add a synthetic moving object to demonstrate the diff feature."""
    size = img_a.shape[0]
    # Position in epoch A
    x_a = int(size * 0.4 + rng.uniform(-10, 10))
    y_a = int(size * 0.5 + rng.uniform(-10, 10))
    # Shifted position in epoch B (moved ~5 pixels = ~30 arcsec)
    shift_x = rng.integers(3, 7)
    shift_y = rng.integers(-3, 3)
    x_b = x_a + shift_x
    y_b = y_a + shift_y

    flux = rng.uniform(0.8, 2.0)
    sigma = 1.8

    y, x = np.mgrid[0:size, 0:size]
    psf_a = flux * np.exp(-((x - x_a) ** 2 + (y - y_a) ** 2) / (2 * sigma ** 2))
    psf_b = flux * np.exp(-((x - x_b) ** 2 + (y - y_b) ** 2) / (2 * sigma ** 2))

    img_a += psf_a
    img_b += psf_b


def _detect_movers(
    diff: np.ndarray, ra: float, dec: float, threshold: float
) -> list[dict]:
    """Detect candidate moving objects from a difference image."""
    sigma = np.std(diff)
    mean = np.mean(diff)

    if sigma == 0:
        return []

    # Find significant positive residuals (object appeared/brightened)
    detection_map = np.abs(diff) > (mean + threshold * sigma)

    # Simple connected-component centroiding
    candidates = []
    labeled = np.zeros_like(diff, dtype=int)
    label_id = 0

    coords = np.argwhere(detection_map)
    if len(coords) == 0:
        return []

    # Cluster nearby pixels (simple approach)
    visited = set()
    for py, px in coords:
        if (py, px) in visited:
            continue

        # BFS to find connected region
        cluster = []
        queue = [(py, px)]
        while queue:
            cy, cx = queue.pop(0)
            if (cy, cx) in visited:
                continue
            if not (0 <= cy < diff.shape[0] and 0 <= cx < diff.shape[1]):
                continue
            if not detection_map[cy, cx]:
                continue
            visited.add((cy, cx))
            cluster.append((cy, cx))
            for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                queue.append((cy + dy, cx + dx))

        if len(cluster) < 3:
            continue

        # Centroid
        cluster_arr = np.array(cluster)
        cy = float(np.mean(cluster_arr[:, 0]))
        cx = float(np.mean(cluster_arr[:, 1]))

        # Convert pixel to approximate sky offset
        pixel_scale = 6.15  # arcsec/pixel for SPHEREx
        shift = float(np.sqrt(len(cluster))) * pixel_scale * 0.3

        peak = float(np.max(np.abs(diff[cluster_arr[:, 0], cluster_arr[:, 1]])))

        # RA/Dec offset from image center
        size = diff.shape[0]
        ra_offset = (cx - size / 2) * pixel_scale / 3600.0
        dec_offset = (cy - size / 2) * pixel_scale / 3600.0

        label_id += 1
        candidates.append({
            "ra": round(ra + ra_offset, 6),
            "dec": round(dec + dec_offset, 6),
            "shift_arcsec": round(shift, 2),
            "shift_angle_deg": round(float(np.degrees(np.arctan2(dec_offset, ra_offset))), 1),
            "peak_flux": round(peak, 4),
            "channels_detected": 1,
            "simbad_match": None,
            "interestingness": round(min(1.0, peak / (5 * sigma)), 3),
        })

    # Sort by interestingness
    candidates.sort(key=lambda c: c["interestingness"], reverse=True)
    return candidates[:20]  # Top 20


def _diff_to_png(diff: np.ndarray, channel: int) -> str:
    """
    Convert diff array to false-color PNG.

    Positive residuals → teal (object appeared / brighter)
    Negative residuals → gold (object disappeared / dimmer)
    """
    h, w = diff.shape
    rgb = np.zeros((h, w, 3), dtype=np.uint8)

    # Background
    rgb[:, :, 0] = 6   # deep-space R
    rgb[:, :, 1] = 11   # deep-space G
    rgb[:, :, 2] = 24   # deep-space B

    sigma = np.std(diff)
    if sigma == 0:
        sigma = 1.0

    # Normalize
    norm = np.clip(diff / (5 * sigma), -1, 1)

    # Positive (teal): object appeared/brighter
    pos = np.clip(norm, 0, 1)
    rgb[:, :, 0] = np.clip(rgb[:, :, 0] + (pos * 30).astype(np.uint8), 0, 255)
    rgb[:, :, 1] = np.clip(rgb[:, :, 1] + (pos * 184).astype(np.uint8), 0, 255)
    rgb[:, :, 2] = np.clip(rgb[:, :, 2] + (pos * 160).astype(np.uint8), 0, 255)

    # Negative (gold): object disappeared/dimmer
    neg = np.clip(-norm, 0, 1)
    rgb[:, :, 0] = np.clip(rgb[:, :, 0] + (neg * 240).astype(np.uint8), 0, 255)
    rgb[:, :, 1] = np.clip(rgb[:, :, 1] + (neg * 192).astype(np.uint8), 0, 255)
    rgb[:, :, 2] = np.clip(rgb[:, :, 2] + (neg * 64).astype(np.uint8), 0, 255)

    img = Image.fromarray(rgb, mode="RGB")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("ascii")

