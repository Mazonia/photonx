# PhotonX: SPHEREx Infrared Sky Observatory and Planet X Discovery Engine

> NASA Space Apps Challenge 2026 | Challenge: "Planet X and SPHEREx" | Developed by Mazonia

[![Live Demo](https://img.shields.io/badge/Live%20Observatory-mazonia.github.io%2Fphotonx-0D9488?style=for-the-badge&logo=nasa&logoColor=white)](https://mazonia.github.io/photonx/)
[![7-Slide Deck](https://img.shields.io/badge/Official%207--Slide%20Deck-Interactive%20Web-4A7C3B?style=for-the-badge&logo=slideshare&logoColor=white)](https://mazonia.github.io/photonx/presentation.html)
[![Download PPTX](https://img.shields.io/badge/PowerPoint-PhotonX__Presentation.pptx-B87D19?style=for-the-badge&logo=microsoftpowerpoint&logoColor=white)](https://mazonia.github.io/photonx/PhotonX_Official_Presentation.pptx)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

### Project Links
- Live Web App: [https://mazonia.github.io/photonx/](https://mazonia.github.io/photonx/)
- Official 7-Slide Pitch Deck: [https://mazonia.github.io/photonx/presentation.html](https://mazonia.github.io/photonx/presentation.html)
- PowerPoint Slides (.pptx): [https://mazonia.github.io/photonx/PhotonX_Official_Presentation.pptx](https://mazonia.github.io/photonx/PhotonX_Official_Presentation.pptx)
- Layman Speaker Script: [SLIDES_SPEAKER_SCRIPT_LAYMAN.md](SLIDES_SPEAKER_SCRIPT_LAYMAN.md)
- Submission Text: [PROJECT_SUBMISSION.md](PROJECT_SUBMISSION.md)
- Automated Test Suite (12/12 Passed): `python test_suite.py`

---

## Overview

PhotonX is an open-source astronomical web application built for the NASA Space Apps Challenge 2026 challenge "Planet X and SPHEREx".

NASA's SPHEREx mission maps the entire sky in 102 near-infrared spectral bands (0.75 to 5.0 µm) every six months. Standard data releases consist of multi-gigabyte FITS image files that require command-line utilities like DS9 or custom Python scripts. 

PhotonX provides an interactive web-based interface for this data. Users can compare survey epochs, isolate moving celestial bodies, inspect spectrophotometric curves, and test whether candidate signals represent asteroids, brown dwarfs, or trans-Neptunian objects like the hypothesized Planet Nine.

---

## Core Features

### 1. Solar System Orrery and World Navigator
- 2D Keplerian Orrery: Real-time orbital mechanics simulating true angular velocities across three scale modes:
  - Inner Solar System (0 to 2 AU)
  - Full Planetary System (0 to 40 AU)
  - Outer Solar System and Planet Nine search area (up to 800 AU)
- Time Simulation: Control simulation speed from paused up to 365 days per second.
- Planetary Telemetry: Displays physical metrics (diameter, mass, surface gravity, mean temperature, atmospheric composition, and SPHEREx infrared diagnostics).
- Target Autocomplete: Direct coordinate navigation to planets, major moons (Galilean satellites, Titan, Triton, Charon), asteroids (Ceres, Vesta), and all 88 IAU constellations.

### 2. High-Resolution Telescope Canvas Engine
- Procedural Planetary Rendering: Replaces static dots with realistic canvas optics:
  - Jupiter: Oblate atmospheric disk, equatorial cloud belts, Great Red Spot, and orbiting Galilean moons.
  - Saturn: 3D tilted ring system with Cassini division, C-ring transparency, and globe shadows.
  - Mars: Rust-colored disk with polar ice caps and dark maria surface markings.
  - Venus: Crescent and gibbous phases with dense cloud veil.
  - Earth and Moon: Earth with continents and cloud cover; Moon with lunar maria and Tycho crater rays.
  - Sun: Limb darkening, surface granulation, sunspot clusters, and dynamic corona rays.
  - Deep Space Targets: Andromeda Galaxy (M31) spiral structure, Orion Nebula (M42) trapezoid emission core, Pleiades (M45) reflection veil, and Sagittarius A* accretion disk.
- Precision Reticle and HUD: Mil-dot crosshairs, position-angle compass bearings (N, S, E, W), target lock indicators, and field-of-view scale bar.
- Eyepiece Mask: Optional circular barrel vignette simulating direct telescope viewing.
- Magnification Presets: Quick-jump bar for 30° All-Sky, 10° Wide, 1.2° Deep Sky, 0.25° Planetary, and 0.05° Ultra-high resolution.
- Double-Click Slew: Double-clicking anywhere on the sky canvas centers and zooms in on that coordinate.

### 3. Clyde Tombaugh Blink Comparator
- Recreates the optical comparator technique used to discover Pluto in 1930.
- Alternates between 6-month survey epochs (`2025-W18` and `2025-W44`) at the press of the Spacebar.
- Stationary stars remain fixed while moving targets jump between frames, making parallax shifts visible to the eye.

### 4. 102-Band Spectrophotometric Profiling
- Extracts calibrated flux values across all 102 SPHEREx channels (0.75 to 5.0 µm).
- Detects absorption markers for common planetary and interstellar ices:
  - Water Ice (H2O): 1.4 µm and 3.05 µm
  - Carbon Dioxide Ice (CO2): 4.27 µm
  - Carbon Monoxide (CO): 2.3 µm and 4.67 µm
  - Methane Ice (CH4): 1.66 µm and 3.3 µm
  - Polycyclic Aromatic Hydrocarbons (PAH): 3.3 µm
- Supports CSV export for external analysis.

### 5. Pixel Differencing Engine
- Calculates image subtraction residuals between survey passes:
  $$\Delta I(x, y) = I_{\text{Epoch B}}(x, y) - I_{\text{Epoch A}}(x, y)$$
- Configurable sigma threshold (1.5 to 6.0 sigma) to isolate flux variations from noise.
- Connected-component clustering calculates centroid coordinates, displacement in arcseconds, and logs candidates.

### 6. Citizen Science Hunt Mode
- Workspace for tagging moving candidates and tracking progress through rank tiers.
- Generates Markdown observation briefs formatted with coordinates, epoch delta, and official IRSA DOI citations.

### 7. NASA Live Mission Telemetry
- NASA APOD: Daily Astronomy Picture of the Day with scientific caption.
- NASA NeoWs: Near-Earth asteroid monitoring with close-approach distance and velocity metrics.
- NASA DONKI: Solar weather tracking for coronal mass ejections and geomagnetic storms.
- Atmospheric Seeing Radar: Evaluates local ground observation conditions using airmass and seeing disc estimates.

---

## Data Sources and Provenance

| Resource | Agency / Partner | Access Method | Function |
|---|---|---|---|
| SPHEREx QR2 Survey | NASA / Caltech / IPAC | DOI: [10.26131/IRSA629](https://doi.org/10.26131/IRSA629) | Primary 102-band calibrated NIR spectral data |
| SPHEREx Footprints | NASA / IPAC IRSA | TAP ADQL Interface | All-sky survey geometry and coverage |
| NASA Open APIs | NASA Goddard Space Flight Center | api.nasa.gov | Live feeds for APOD, NeoWs, and DONKI |
| NASA SkyView | NASA Goddard Space Flight Center | skyview.gsfc.nasa.gov | Cross-validation with DSS2, 2MASS, and WISE |
| NASA Exoplanet Archive | NASA / Caltech / IPAC | exoplanetarchive.ipac.caltech.edu | Confirmed exoplanet parameters and orbital periods |
| SIMBAD Database | CDS Strasbourg / ESA | simbad.cds.unistra.fr | Celestial name resolution and coordinate lookups |
| Meteorological Models | Open-Meteo / Meteomatics | API Endpoints | Atmospheric seeing and transparency calculations |

---

## Technical Architecture

- Frontend: React 18, Vite, Tailwind CSS, Lucide React, HTML5 Canvas 2D API.
- Backend: Python 3.12+, FastAPI, NumPy, Astropy, HTTPX async client.
- Client-Side Fallback: Standalone simulation algorithms and offline catalog data allow full operation on static hosts like GitHub Pages without a backend server.
- Default Theme: Deep Space Dark Observatory theme with light theme toggle option.

---

## Local Development

### Option 1: Startup Script (Windows)
```cmd
start_dev.bat
```

### Option 2: Docker Compose
```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/docs`

### Option 3: Manual Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

---

## Automated Verification

Run the verification script to test all 12 API endpoints and calculation models:
```bash
python test_suite.py
```

Test Results:
- Health check: OK (v1.0.0)
- Curated targets: Loaded (10 targets)
- Name resolver: Verified (Barnard's Star, Proxima Centauri, Orion, Sirius, M31)
- Epoch retrieval: 4 survey epochs loaded
- Spectral extraction: 102 channels extracted
- Cutout generation: 128x128 NIR tile generated
- Differencing engine: 20 candidate movers detected
- Observability calculator: Verified with weather and airmass formulas
- SkyView proxy: DSS2 Goddard tile retrieved
- APOD API: Live payload validated
- NeoWs API: Asteroid tracking operational
- DONKI API: Solar CME analysis verified
- Status: 12 of 12 tests passed (0 errors)

---

## License

MIT License. Open source for academic, research, and educational use.
Challenge: NASA Space Apps Challenge 2026, "Planet X and SPHEREx".
Author: Mazonia.
Dataset Citation: NASA/IPAC Infrared Science Archive (IRSA), SPHEREx Science Team, DOI: 10.26131/IRSA629.
