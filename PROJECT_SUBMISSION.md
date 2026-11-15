# NASA Space Apps Challenge 2026: Project Submission Package
## Team PhotonX | Challenge: Planet X and SPHEREx

> Submission reference for the NASA Space Apps submission portal ("Submit for Judging").

---

### 1. Project Name
**PhotonX: SPHEREx Infrared Sky Observatory and Planet X Discovery Engine**

---

### 2. High-Level Project Summary
*Word Count: 139 words | Characters: 994 / 1500 limit*

Hypothetical Planet Nine and cold brown dwarfs emit minimal visible light, making them undetectable by optical surveys. They do, however, emit faint thermal radiation in the infrared. NASA's SPHEREx mission is mapping the entire sky in 102 near-infrared spectral bands every six months, producing extensive time-series datasets.

PhotonX is an open-source web application designed to process and visualize this data. It provides an interactive multi-spectral sky engine, a 2D Keplerian Solar System Orrery, procedural planetary optics, and an automated pixel-differencing engine inspired by Clyde Tombaugh's optical comparator.

Users can extract 102-channel spectral profiles, isolate moving objects between survey epochs, evaluate local atmospheric seeing conditions, and export structured observation logs. The platform operates directly in standard web browsers with zero installation requirements, helping students, amateur astronomers, and researchers analyze real NASA infrared telemetry.

---

### 3. Submission Links

- Link to Project Demo (7-Slide Deck):
  `https://mazonia.github.io/photonx/presentation.html`
  *(Backup repository link: `https://github.com/Mazonia/photonx/blob/main/presentation.html`)*
  *Meets all NASA requirements: exactly 7 slides, English, publicly hosted, no login or password required.*

- Link to Final Project:
  - Live Web Application: `https://mazonia.github.io/photonx/`
  - GitHub Code Repository: `https://github.com/Mazonia/photonx`
  *(Publicly accessible, open-source MIT License)*

---

### 4. Detailed Project Description

#### What It Does and How It Works

PhotonX is an astronomical data processing and visualization application that runs entirely in the browser:

1. Interactive Sky Engine: Renders celestial coordinates on a GPU-accelerated HTML5 Canvas with continuous coordinate projection (Right Ascension and Declination) and adaptive limiting magnitude scaling from 6.2 mv to 18.0 mv. Includes procedural renderers for Solar System bodies (Jupiter with cloud belts and Galilean moons, Saturn with 3D tilted rings and Cassini division, Mars with polar caps, Venus, Earth, Moon, and Sun) and deep-sky targets like M31, M42, and Sagittarius A*.
2. Keplerian Solar System Orrery: Interactive 2D orbital model calculating angular velocities across three scales: Inner System (0 to 2 AU), Full System (0 to 40 AU), and Outer System / Planet Nine search area (up to 800 AU). Supports simulation speeds from 1x to 365x and one-click telescope slew synchronization.
3. Clyde Tombaugh Blink Engine: Recreates the optical comparator technique used to discover Pluto in 1930, alternating between 6-month SPHEREx survey cadence scans (2025-W18, 2025-W44, 2026-W18, 2026-W44) to expose parallax displacement and proper motion.
4. 102-Band Spectrophotometric Profiler: Extracts calibrated 102-channel spectral energy distributions (0.75 to 5.00 µm) with diagnostic absorption markers for biogenic ices (H2O, CO2, CO, CH4) and polycyclic aromatic hydrocarbons (PAH).
5. 3-Sigma Pixel Differencing: Calculates image subtraction matrices between survey passes (Epoch B minus Epoch A), clusters connected components above a configurable sigma threshold, and calculates centroid displacement in arcseconds.
6. Atmospheric Seeing Radar: Evaluates local ground observation conditions using Pickering's airmass formula and seeing disc estimates based on meteorological model data.
7. Citizen Science Hunt Mode: Interface for cataloging candidate objects, tracking detection counts, and exporting Markdown observation logs citing official NASA IRSA DOIs.

#### Technical Implementation

- Frontend: React 18, Vite, Tailwind CSS, Zustand state management, TanStack React Query, and HTML5 Canvas 2D API.
- Backend: Python 3.12+, FastAPI, NumPy matrix calculations, Astropy coordinate transformations, and HTTPX asynchronous networking.
- Offline Fallback: Embedded client-side simulation algorithms and catalog data allow full operation on static hosts like GitHub Pages without a backend server.
- System Compatibility: Works in all standard modern browsers (Chrome, Edge, Firefox, Safari) without plugins or local installation.

#### Scientific Utility

Traditional astronomical reduction tools like IRAF or DS9 require local installations, command-line usage, and manual file management. PhotonX provides a visual interface for exploring multi-epoch space telescope data, helping users verify moving candidates and inspect spectral signatures without software setup hurdles.

---

### 5. NASA Data and Resources Used

1. NASA/IPAC Infrared Science Archive (IRSA): SPHEREx QR2 Survey
   - Link Text: `NASA/IPAC Infrared Science Archive (IRSA) - SPHEREx QR2 Data`
   - Link URL: `https://doi.org/10.26131/IRSA629`
2. NASA Goddard Space Flight Center SkyView Virtual Observatory
   - Link Text: `NASA GSFC SkyView Virtual Observatory`
   - Link URL: `https://skyview.gsfc.nasa.gov`
3. NASA Open Data Portal: Astronomy Picture of the Day (APOD)
   - Link Text: `NASA Astronomy Picture of the Day (APOD) API`
   - Link URL: `https://api.nasa.gov`
4. NASA Open Data Portal: Near-Earth Object Web Service (NeoWs)
   - Link Text: `NASA NeoWs Asteroid Tracking Service`
   - Link URL: `https://api.nasa.gov`
5. NASA Space Weather Database (DONKI)
   - Link Text: `NASA DONKI Space Weather Service`
   - Link URL: `https://kauai.ccmc.gsfc.nasa.gov/DONKI/`
6. NASA Exoplanet Archive (Caltech/IPAC)
   - Link Text: `NASA Exoplanet Archive Planetary Systems Table`
   - Link URL: `https://exoplanetarchive.ipac.caltech.edu`
7. NASA DSCOVR Earth Polychromatic Imaging Camera (EPIC)
   - Link Text: `NASA EPIC Earth Imagery API`
   - Link URL: `https://epic.gsfc.nasa.gov`

---

### 6. Space Agency Partner and Other Data

1. SIMBAD Astronomical Database (CDS Strasbourg / ESA Partner)
   - Link Text: `SIMBAD Astronomical Database (CDS Strasbourg)`
   - Link URL: `https://simbad.cds.unistra.fr/simbad/`
2. Open-Meteo Astronomical Meteorology
   - Link Text: `Open-Meteo Astronomical Seeing and Weather API`
   - Link URL: `https://open-meteo.com`
3. OpenWeatherMap API
   - Link Text: `OpenWeatherMap Atmospheric Conditions API`
   - Link URL: `https://openweathermap.org/api`
4. Meteomatics Weather API
   - Link Text: `Meteomatics Global Meteorological API`
   - Link URL: `https://www.meteomatics.com`

---

### 7. Use of Super Intelligence (SI) Disclosure

- Selected Options:
  - Code and data assistance
  - Text and documentation assistance
- Disclosure Text:
  Large language models (Gemini and Claude) were used via the Google Antigravity developer environment for code scaffolding, boilerplate generation, documentation structuring, and unit test generation. All system architectures, procedural canvas rendering logic, orbital calculation models, and image differencing pipelines were designed and implemented by the author. No copyrighted media or uncredited external code was used.
