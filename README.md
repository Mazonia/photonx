# 🛰️ PhotonX — SPHEREx Sky Browser

> **One person. One mission. One shot at the sky.**

PhotonX is an interactive, public-facing infrared sky browser built on live NASA SPHEREx QR2/QR3 data. It lets anyone explore the near-infrared sky, compare observations across time, and discover objects that moved between scans — from asteroids to brown dwarfs to hypothetical Planet X candidates.

**NASA Space Apps Challenge 2026 | Planet X and SPHEREx | Solo Entry by PhotonX (Mazonia)**

---

## 🌌 What It Does

- **🔭 Interactive Celestial Engine** — Bespoke HTML5 Canvas astronomy engine featuring all-sky pan/zoom, coordinate gridlines, stellar magnitude scaling, and multi-survey overlays (SPHEREx NIR, WISE Mid-IR, 2MASS, DSS Optical).
- **⏱️ Temporal Epoch Scrubber** — Scrub through SPHEREx observation epochs (6-month survey cadence) to see how celestial bodies change position or brightness over time.
- **🔄 Interactive Blink Comparator** — Instantaneous optical blinking (Epoch A vs Epoch B) modeled after Clyde Tombaugh's historical discovery engine to detect shifting high-proper motion stars, brown dwarfs, and Planet X candidates.
- **🌈 102-Band Spectral Extraction** — Click any sky position to view its full 102-band near-infrared spectrum (0.75–5.0 µm) with biogenic ice band markers (H₂O, CO, CO₂, PAH) and one-click CSV export.
- **⚡ Difference Imaging & Mover Detection** — Automated pixel-differencing engine identifies moving objects, candidate Trans-Neptunian Objects (TNOs), and proper-motion stars.
- **🎯 Citizen Science "Hunt Mode"** — Gamified discovery console with hunter ranks (*Infrared Tracker*, *Kuiper Belt Scout*, *Deep Space Pioneer*), coordinate anomaly flagging, and one-click export of formal NASA discovery briefs (`.md`).
- **🔗 Cross-Reference Intelligence** — Enriches objects with data from SIMBAD, NASA Exoplanet Archive, and NASA NeoWs (Near-Earth Asteroids).
- **🌤️ Observability Engine ("Can I See This Tonight?")** — Uses OpenWeather satellite & atmospheric telemetry to compute real-time visibility, target altitude, and moon phase.
- **🌓 Dual High-Contrast Themes** — Switch seamlessly between **Deep Space Observatory** (Dark HUD) and **Laboratory Cleanroom Spec Sheet** (Light Technical Blueprint).
- **🛡️ Secure Web Practices** — Strict Content Security Policy, nosniff headers, referrer origin gating, sanitized query inputs, and synchronous TTL cache.

---

## 🔬 Data Sources & Provenance

| Source | DOI / Endpoint | Details |
|--------|----------------|---------|
| **SPHEREx QR2** (Primary) | DOI: [10.26131/IRSA629](https://doi.org/10.26131/IRSA629) | Weekly calibrated infrared multi-spectral data |
| **SPHEREx QR3** | IRSA TAP Service (`spherex.artifact`) | Advanced footprint metadata via ADQL |
| **SIMBAD** | `simbad.cds.unistra.fr` | Astronomical database coordinate & type resolution |
| **NASA Exoplanet Archive** | `exoplanetarchive.ipac.caltech.edu` | TAP ADQL queries on confirmed planetary systems |
| **NASA NeoWs** | `api.nasa.gov/neo/rest/v1` | Live feed of near-Earth objects and close approaches |
| **OpenWeather / Agro API** | `api.openweathermap.org` | Real-time atmospheric cloud cover & visibility |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│        BROWSER (React 18 + Aladin Lite + Tailwind)       │
│  Sky Map (HiPS) │ 102-Band Spectra │ Hunt Mode Console  │
└────────────────────────────┬────────────────────────────┘
                             │ REST API
┌────────────────────────────▼────────────────────────────┐
│              FastAPI BACKEND (Python 3.12+)             │
│  /sky        /cutout      /spectra     /diff            │
│  /objects    /resolve     /enrich      /observability   │
└────────┬───────────┬──────────────┬──────────────┬──────┘
         │           │              │              │
      IRSA SIA2    SIMBAD      Exoplanet      OpenWeather
      SPHEREx      CDS         Archive        Atmosphere
      QR2/QR3      TAP         (TAP/ADQL)     Telemetry
```

---

## 🚀 Quick Start

### Option 1: One-Click Launch (Windows)
Double-click `start_dev.bat` in the root folder, or run:
```powershell
.\start_dev.bat
```

### Option 2: Docker Compose
```bash
docker compose up --build
```
- **Frontend:** http://localhost:5173
- **Backend API Docs:** http://localhost:8000/docs

### Option 3: Manual Local Launch

**1. Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**2. Frontend (in another terminal):**
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Automated Verification Test Suite

To verify all 8 endpoints and scientific computation engines:
```bash
python test_suite.py
```
Expected output:
```
============================================================
🛰️  PHOTONX AUTOMATED VERIFICATION SUITE
    NASA Space Apps Challenge 2026 — Planet X & SPHEREx
============================================================
 [PASS] /api/health -> ok (v1.0.0)
 [PASS] /api/featured -> Loaded 10 curated sky targets
 [PASS] /api/resolve (Barnard's Star) -> RA 269.4521°, Dec 4.6933°
 [PASS] /api/resolve (M31) -> Galaxy: Andromeda Galaxy...
 [PASS] /api/sky -> Found 4 epoch records across ['2025-W18', '2025-W44', ...]
 [PASS] /api/spectra -> Extracted 102 spectral channels (0.75-5.0µm)
 [PASS] /api/cutout -> Generated 128x128 NIR false-color PNG tile
 [PASS] /api/diff -> Diff computed; 20 moving candidates identified
 [PASS] /api/observability -> Weather: clear sky, Moon: Waning Crescent 🌘
============================================================
 ALL 8 SYSTEM CHECKS PASSED WITH ZERO ERRORS.
============================================================
```

---

## ⚡ Automatic GitHub Sync

To automatically sync and push all local code edits to GitHub whenever files change:

- **Double-click** `autopush.bat` in Windows Explorer, OR
- **Run via PowerShell watcher:**
  ```powershell
  .\autopush.ps1
  ```
  *(Monitors for file changes every 5 seconds, auto-stages, creates timestamped commits, and pushes to `origin/main` & `origin/master`).*
- **One-shot quick push:**
  ```powershell
  .\autopush.ps1 -Once
  # OR using the git alias:
  git autopush
  ```

---

## 🎨 Design Philosophy

PhotonX adheres strictly to an **infrared observatory terminal aesthetic**:
- Custom false-color infrared colormap: Deep Space (`#060B18`) → Nebula Blue (`#1A3A6B`) → Stellar Teal (`#1EB8A0`) → Solar Gold (`#F0C040`).
- Pure CSS star field drift with subtle CRT coordinate gridlines.
- Typography: **IBM Plex Sans** for clean UI hierarchy and **IBM Plex Mono** for coordinates, wavelength readouts, and FITS telemetry (aligned with NASA Earth Information Center design systems).
- Fluid micro-interactions adhering to Emil Kowalski motion principles.
- Section 508 / WCAG 2.1 AA compliant with high-contrast text and accessible data tables.

---

## 📜 License & Credits

- **License:** MIT License (Open Source)
- **Challenge:** NASA Space Apps Challenge 2026 — "Planet X and SPHEREx"
- **Author:** Mazonia (PhotonX Solo Entry)
- **Data Citation:** NASA/IPAC Infrared Science Archive (IRSA), SPHEREx Team, DOI: 10.26131/IRSA629
