"""
PhotonX Automated Verification Test Suite
==========================================
Verifies that all API endpoints, scientific calculators,
and external catalog resolvers are functioning properly.
"""

import sys
import os

# Add backend directory to sys.path
backend_dir = os.path.join(os.path.dirname(__file__), "backend")
sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("🛰️  PHOTONX AUTOMATED VERIFICATION SUITE")
    print("    NASA Space Apps Challenge 2026 — Planet X & SPHEREx")
    print("=" * 60)

    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print(f" [PASS] /api/health -> {res.json()['status']} (v{res.json()['version']})")

    # 2. Featured targets
    res = client.get("/api/featured")
    assert res.status_code == 200
    targets = res.json().get("targets", [])
    assert len(targets) >= 5, "Expected at least 5 featured targets"
    print(f" [PASS] /api/featured -> Loaded {len(targets)} curated sky targets")

    # 3. Object resolution (Barnard's Star & M31)
    res = client.get("/api/resolve?name=Barnard's Star")
    assert res.status_code == 200
    b_star = res.json()
    assert abs(b_star["ra"] - 269.4521) < 0.1
    print(f" [PASS] /api/resolve (Barnard's Star) -> RA {b_star['ra']}°, Dec {b_star['dec']}°")

    res = client.get("/api/resolve?name=M31")
    assert res.status_code == 200
    m31 = res.json()
    print(f" [PASS] /api/resolve (M31) -> {m31['object_type']}: {m31['description']}")

    # 4. SPHEREx sky image records
    res = client.get(f"/api/sky?ra={b_star['ra']}&dec={b_star['dec']}")
    assert res.status_code == 200
    sky_data = res.json()
    assert sky_data["total_images"] > 0
    print(f" [PASS] /api/sky -> Found {sky_data['total_images']} epoch records across {sky_data['epochs']}")

    # 5. 102-band spectrum extraction
    res = client.get(f"/api/spectra?ra={b_star['ra']}&dec={b_star['dec']}&epoch=2025-W18")
    assert res.status_code == 200
    spec_data = res.json()
    assert len(spec_data["spectrum"]) == 102
    print(f" [PASS] /api/spectra -> Extracted {len(spec_data['spectrum'])} spectral channels (0.75-5.0µm)")

    # 6. FITS Cutout image generation
    res = client.get(f"/api/cutout?ra={b_star['ra']}&dec={b_star['dec']}&channel=42")
    assert res.status_code == 200
    cutout = res.json()
    assert "image_base64" in cutout
    print(f" [PASS] /api/cutout -> Generated {cutout['width']}x{cutout['height']} NIR false-color PNG tile")

    # 7. Difference engine & moving object detection
    res = client.get(f"/api/diff?ra={b_star['ra']}&dec={b_star['dec']}&epoch_a=2025-W18&epoch_b=2025-W44")
    assert res.status_code == 200
    diff = res.json()
    assert "diff_image_base64" in diff
    candidates = diff.get("candidates", [])
    print(f" [PASS] /api/diff -> Diff computed; {len(candidates)} moving candidates identified")

    # 8. Observability check with OpenWeather
    res = client.get(f"/api/observability?ra={b_star['ra']}&dec={b_star['dec']}&lat=28.57&lon=-80.65")
    assert res.status_code == 200
    obs = res.json()
    print(f" [PASS] /api/observability -> Weather: {obs['weather'].get('description', 'N/A')}, Moon: {obs.get('moon_phase', 'N/A')}")
    print(f"        Recommendation: {obs.get('recommendation')}")

    # 9. NASA SkyView real survey imagery fetch
    res = client.get(f"/api/skyview?ra={b_star['ra']}&dec={b_star['dec']}&survey=dss&pixels=200&size_deg=0.3")
    assert res.status_code == 200
    skyview_data = res.json()
    print(f" [PASS] /api/skyview -> Provenance: {skyview_data['provenance']}, Survey: {skyview_data['survey']}")

    print("=" * 60)
    print(" ALL 9 SYSTEM CHECKS PASSED WITH ZERO ERRORS.")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()

