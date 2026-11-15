# 🛰️ PhotonX — SPHEREx Near-Infrared Sky Observatory & Planet X Discovery Engine

> **NASA Space Apps Challenge 2026 | Challenge: "Planet X and SPHEREx" | Solo Entry by Mazonia**  
> *"One person. One mission. One shot at the sky."*

[![Live Demo](https://img.shields.io/badge/Live%20Observatory-mazonia.github.io%2Fphotonx-0D9488?style=for-the-badge&logo=nasa&logoColor=white)](https://mazonia.github.io/photonx/)
[![7-Slide Deck](https://img.shields.io/badge/Official%207--Slide%20Deck-Interactive%20Web-4A7C3B?style=for-the-badge&logo=slideshare&logoColor=white)](https://mazonia.github.io/photonx/presentation.html)
[![Download PPTX](https://img.shields.io/badge/PowerPoint-PhotonX__Presentation.pptx-B87D19?style=for-the-badge&logo=microsoftpowerpoint&logoColor=white)](https://mazonia.github.io/photonx/PhotonX_Official_Presentation.pptx)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

### 🌐 Instant Submission Links (Zero-Login / Public Access)
- 🚀 **Live Interactive Web Observatory:** [https://mazonia.github.io/photonx/](https://mazonia.github.io/photonx/)
- 📊 **Official 7-Slide Submission Deck (Web):** [https://mazonia.github.io/photonx/presentation.html](https://mazonia.github.io/photonx/presentation.html)
- 📑 **Official PowerPoint File (.pptx):** [https://mazonia.github.io/photonx/PhotonX_Official_Presentation.pptx](https://mazonia.github.io/photonx/PhotonX_Official_Presentation.pptx)
- 🎙️ **Layman Word-for-Word Speaker Script:** [SLIDES_SPEAKER_SCRIPT_LAYMAN.md](SLIDES_SPEAKER_SCRIPT_LAYMAN.md)
- 📄 **Project Submission Text (Copy-Paste Ready):** [PROJECT_SUBMISSION.md](PROJECT_SUBMISSION.md)
- 🧪 **Automated Test Suite (12/12 Passed):** `python test_suite.py`

---

## 🌌 What Is PhotonX?

**PhotonX** is a high-speed, zero-install interactive celestial web observatory designed for the **NASA Space Apps Challenge 2026** challenge *"Planet X and SPHEREx"*. 

NASA's **SPHEREx** (Spectro-Photometer for the History of the Universe, Epoch of Reionization, and Ices Explorer) space observatory maps the entire sky four times over two years across **102 continuous near-infrared bands (0.75–5.0 µm)**. While SPHEREx produces unprecedented multi-spectral data, raw FITS files are tens of gigabytes in size, require specialized command-line software, and are inaccessible to the public, students, and amateur astronomers.

**PhotonX solves this problem** by providing an accessible, browser-based discovery portal that turns raw 6-month survey cadences into interactive discoveries — enabling anyone to track moving asteroids, uncover ultra-cool brown dwarfs, inspect habitable exoplanets, and search for the hypothetical **Planet Nine / Planet X**.

---

## ⚡ Key Features

### 1. 🪐 Cosmic Worlds & Planetary Systems Navigator
- **Solar System Worlds:** Jump with one click to Mars, Jupiter, Saturn, Neptune, Pluto, Europa, Titan, Ceres, Sedna, and the Batygin & Brown (2016) predicted search field for **Planet Nine**.
- **Habitable Exoworlds:** Explore TRAPPIST-1 (7 Earth-sized worlds), Proxima Centauri b (closest exoplanet at 4.25 ly), Kepler-186f, Kepler-452b ("Earth's Older Cousin"), TOI-700 d, 51 Pegasi b, and candidate Hycean world K2-18 b.
- **All 88 IAU Constellations & Benchmark Stars:** Instant search and slewing across Orion, Ursa Major, Cassiopeia, Centaurus, Sirius, Vega, Betelgeuse, and Barnard's Star.
- **Orbital Telemetry:** Visual orbit distances, periods, and planetary chemical profiles.

### 2. 🔭 Interactive HTML5 Celestial Viewport
- **High-Performance Canvas Engine:** Smoothly pans and zooms across full 45° constellations down to 0.05° deep-space fields.
- **Astronomical Precision:** Accurate celestial coordinates (Right Ascension / Declination), equatorial gridlines, and optical diffraction spikes calibrated to stellar apparent magnitudes ($m_v < 4.5$).
- **Multi-Survey Overlays:** Toggle between SPHEREx NIR (0.75–5.0 µm), WISE Mid-IR (3.4–22 µm), 2MASS (Near-IR), and DSS Optical (Goddard SkyView).

### 3. 🔄 Clyde Tombaugh Blink Comparator
- Modeled after the mechanical blink comparator Clyde Tombaugh used to discover Pluto at Lowell Observatory in 1930.
- Tap **Spacebar** to rapidly alternate between 6-month survey epochs (`2025-W18` vs `2025-W44`).
- Fixed background stars remain stationary, while moving bodies (asteroids, brown dwarfs, Planet X candidates) visibly jump across the reticle.

### 4. 🌈 102-Band Near-Infrared Spectrophotometry
- Click any point in the sky to instantly plot its full 102-channel spectrophotometric curve (0.75–5.00 µm).
- Automated spectral line identification for biogenic ice signatures:
  - **$\text{H}_2\text{O}$ Water Ice:** 1.4 µm & 3.05 µm absorption
  - **$\text{CO}_2$ Carbon Dioxide Ice:** 4.27 µm diagnostic dip
  - **$\text{CO}$ Carbon Monoxide:** 2.3 µm & 4.67 µm bands
  - **$\text{CH}_4$ Methane Ice:** 1.66 µm & 3.3 µm markers
  - **PAH Organics:** 3.3 µm polycyclic aromatic hydrocarbons
- One-click CSV export for external astrophysical research.

### 5. 🔬 Automated Pixel Differencing Engine
- Mathematical matrix subtraction across survey epochs:
  $$\Delta I(x, y) = I_{\text{Epoch B}}(x, y) - I_{\text{Epoch A}}(x, y)$$
- Configurable $\sigma$-sensitivity threshold (1.5$\sigma$ to 6.0$\sigma$) and channel picker.
- Connected-component clustering isolates significant residual peaks, computes centroid shift in arcseconds, and logs moving candidates.

### 6. 🎯 Citizen Science "Hunt Mode"
- Gamified discovery interface for classrooms and amateur astronomers.
- Hunter ranks: *Infrared Tracker* $\rightarrow$ *Kuiper Belt Scout* $\rightarrow$ *Deep Space Pioneer*.
- One-click export of formal NASA discovery briefs (`.md`) citing official IRSA DOIs.

### 7. 🎓 Interactive Step-by-Step Spotlight Tutorial
- Dynamic SVG spotlight modal that highlights and explains every section and button for first-time visitors and judges.
- Accessible at any time via the **Tutorial** button in the header.

### 8. 🏖️ Natural Beach Sand & Ocean Water Aesthetic
- Warm, natural palette: Sunlit Beach Sand (Light Mode) and Deep Ocean Marine Waters (Dark Mode).
- Replaces generic, artificial AI neon cyan with authentic scientific and coastal tones.

### 9. 🚀 Live NASA Space Agency Dashboard
- **NASA APOD:** Daily Astronomy Picture of the Day with full scientific briefing.
- **NASA NeoWs:** Real-time tracking of near-Earth asteroids, velocities, and miss distances.
- **NASA DONKI:** Telemetry on Coronal Mass Ejections (CMEs) and Geomagnetic Storms.
- **NASA EPIC:** Full-disc imagery from DSCOVR at the L1 Lagrange point.
- **Atmospheric Seeing Radar:** 3-tier ground-based observation follow-up seeing calculator (Meteomatics, OpenWeather, Open-Meteo).

---

## 🔬 Space Agency Data Sources & Provenance

| Data Source | Agency / Organization | DOI / Service Endpoint | Role in PhotonX |
|-------------|-----------------------|------------------------|-----------------|
| **SPHEREx QR2 Survey** | NASA / Caltech / IPAC | DOI: [10.26131/IRSA629](https://doi.org/10.26131/IRSA629) | Primary 102-band calibrated NIR spectrophotometric data |
| **SPHEREx QR3 Footprints** | NASA / IPAC IRSA | TAP ADQL Interface (`spherex.artifact`) | All-sky multi-epoch coverage geometry |
| **NASA Open APIs** | NASA Goddard Space Flight Center | `https://api.nasa.gov` | Live feeds for APOD, NeoWs Asteroids, DONKI Space Weather, EPIC |
| **NASA SkyView** | NASA Goddard Space Flight Center | `https://skyview.gsfc.nasa.gov` | Multi-mission optical & IR cross-validation (DSS2, 2MASS, WISE) |
| **NASA Exoplanet Archive** | NASA / Caltech / IPAC | `https://exoplanetarchive.ipac.caltech.edu` | TAP ADQL planetary system parameters & orbital periods |
| **SIMBAD Astronomical Database** | CDS Strasbourg | `https://simbad.cds.unistra.fr` | High-precision astronomical name resolution & coordinate parsing |
| **Meteomatics & Open-Meteo** | Meteomatics AG / Open-Meteo | `https://api.meteomatics.com` | High-resolution astronomical seeing & atmospheric extinction |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, KaTeX (LaTeX mathematical rendering), HTML5 Canvas.
- **Backend:** FastAPI (Python 3.12+), NumPy, SciPy (astronomical image differencing), Astropy (WCS & FITS parsing), HTTPX (async networking).
- **Zero-Install Client Fallback:** In-browser astrophysical simulation engine with embedded NASA benchmark telemetry for seamless static hosting on GitHub Pages.
- **Deployment:** GitHub Pages (automated SPA deployment with `.nojekyll` routing).

---

## 🚀 Running Locally

### Option 1: Quick Launch (Windows)
Double-click `start_dev.bat` in the project root:
```powershell
.\start_dev.bat
```

### Option 2: Docker Compose
```bash
docker compose up --build
```
- **Web App:** `http://localhost:5173`
- **Backend API Docs:** `http://localhost:8000/docs`

### Option 3: Manual Startup
```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

---

## 🧪 Automated Verification Suite

Run the full system test suite to verify all 12 API endpoints and scientific calculators:
```bash
cd photonx
python test_suite.py
```
```
============================================================
🛰️  PHOTONX AUTOMATED VERIFICATION SUITE
    NASA Space Apps Challenge 2026 — Planet X & SPHEREx
============================================================
 [PASS] /api/health -> ok (v1.0.0)
 [PASS] /api/featured -> Loaded 10 curated sky targets
 [PASS] /api/resolve (Barnard's Star) -> RA 269.4521°, Dec 4.6933°
 [PASS] /api/resolve (Proxima Centauri) -> RA 217.4289°, Dec -62.6795° (Star)
 [PASS] /api/resolve (Orion Constellation) -> RA 84.0°, Dec 1.0° (Constellation)
 [PASS] /api/resolve (Sirius Star) -> RA 101.2872°, Dec -16.7161°
 [PASS] /api/resolve (M31) -> Galaxy: Andromeda Galaxy — nearest large spiral galaxy, 2.5 Mly
 [PASS] /api/sky -> Found 4 epoch records across ['2025-W18', '2025-W44', '2026-W18', '2026-W44']
 [PASS] /api/spectra -> Extracted 102 spectral channels (0.75-5.0µm)
 [PASS] /api/cutout -> Generated 128x128 NIR false-color PNG tile
 [PASS] /api/diff -> Diff computed; 20 moving candidates identified
 [PASS] /api/observability -> Weather: clear sky, Moon: Waxing Crescent 🌒
 [PASS] /api/skyview -> Provenance: NASA Goddard Space Flight Center (SkyView), Survey: dss
 [PASS] /api/apod -> NASA Astronomy Picture: 'NASA Science'
 [PASS] /api/neo -> NASA NeoWs Live Tracking: 18 asteroids monitored
 [PASS] /api/space-weather -> NASA DONKI Space Weather: 6 CMEs analyzed
============================================================
 ALL 12 SYSTEM CHECKS PASSED WITH ZERO ERRORS.
============================================================
```

---

## 📜 License & Acknowledgments

- **License:** Open Source under the [MIT License](LICENSE).
- **Challenge:** NASA Space Apps Challenge 2026 — *"Planet X and SPHEREx"*.
- **Author:** Mazonia (PhotonX Solo Project).
- **Primary Data Citation:** NASA/IPAC Infrared Science Archive (IRSA), SPHEREx Science Team, DOI: [10.26131/IRSA629](https://doi.org/10.26131/IRSA629).
