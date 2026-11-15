# PhotonX: Official 7-Slide Presentation Deck
### NASA Space Apps Challenge 2026 | Planet X and SPHEREx
*Adheres strictly to the 7-slide limit requirement (including title and intro slides).*

---

## SLIDE 1: Title and Team Credentials

```
================================================================================
                                   PHOTONX
        Interactive SPHEREx Infrared Sky Browser & Mover Discovery Engine
================================================================================
```

- **Project Name:** PhotonX
- **Team Name:** PhotonX
- **Team Member(s):** Mazonia (Solo Creator)
- **Challenge Selected:** Planet X and SPHEREx
- **Event:** NASA International Space Apps Challenge 2026
- **Project URL:** https://github.com/Mazonia/photonx
- **Data Provenance:** NASA/IPAC Infrared Science Archive (DOI: 10.26131/IRSA629)
- **Core Capabilities:** 102-Band NIR spectrophotometry, Keplerian solar system orrery, Clyde Tombaugh blink comparator, and live NASA open APIs.
- **Compliance:** Strict 7-slide adherence, zero-install web architecture, all English documentation, MIT open-source license.

---

## SLIDE 2: The Problem: The Hidden Giants of the Outer Solar System

- **Optical Darkness ($1/r^4$ Law):** Solar flux drops off as the inverse fourth power for reflected light: $\text{Flux} \propto 1/r^4$. At 400 AU, reflected sunlight is 25 billion times dimmer than on Earth. In optical telescopes like Hubble, Planet X is pitch black (mag $V > 23.5$).
- **Thermal Infrared Solution (35 K):** Distant cold bodies retain primordial heat, radiating in the near-infrared spectrum (1 to 5 µm). NASA SPHEREx captures this exact thermal emission across 102 distinct spectral channels.
- **The Data Flood Bottleneck:** SPHEREx maps the whole sky every 6 months across 102 infrared bands, producing massive data archives.
- **The Need:** Without an accessible visual comparison tool, slow-moving outer solar system bodies remain buried in raw technical archives.
- **Objective:** Create an intuitive bridge between raw NASA infrared data and human visual perception to bring Planet X candidates to light.

---

## SLIDE 3: The Proposed Solution: PhotonX Workstation

- **Platform Architecture:** A zero-install, GPU-accelerated web platform that transforms raw SPHEREx time-series data into an interactive celestial observatory.
- **Interactive Sky Engine:** Smooth panning and zooming across equatorial coordinates (RA/Dec) from 45° constellation views down to 0.05° deep-field resolution.
- **Keplerian Solar System Orrery:** Real-time 2D orbital simulator spanning 0 to 800 AU with procedurally rendered planets, Galilean moons, ring systems, and polar caps.
- **Clyde Tombaugh Blink Comparator:** Rapidly alternates between survey epochs (2025-W18 and 2025-W44) with spacebar controls, making moving candidates jump out to human eyes.
- **Instant Spectrophotometry:** Click any target to extract 102-band flux profiles diagnosing water ice (1.4 µm), carbon monoxide (2.3 µm), and carbon dioxide ice (4.27 µm).
- **Plain English Concept:** Acts like Google Earth for the infrared cosmos, enabling direct planetary exploration without downloading gigabytes of raw FITS files.

---

## SLIDE 4: Detection Pipeline: Automated Mover Differencing

- **Three-Step Subtraction Pipeline:**
  1. **Align and Normalize Flux:** Matches World Coordinate System (WCS) geometry and Point Spread Functions (PSFs) between Epoch A and Epoch B (separated by 6 months).
  2. **Subtract Image Matrices:**
     $$\Delta I(x, y) = I_{\text{Epoch B}}(x, y) - I_{\text{Epoch A}}(x, y)$$
     Fixed background stars cancel out completely. Moving objects leave a telltale positive-and-negative dipole.
  3. **Threshold and Centroid Extraction:** Connected-component clustering isolates peaks exceeding $3\sigma$ significance, calculates exact sub-pixel motion vectors in arcseconds, and logs candidates.
- **Plain English Concept:** Like comparing two photos of a plaza taken months apart and subtracting them; stationary buildings vanish into darkness, leaving only the person walking across visible on screen.

---

## SLIDE 5: NASA Data Assets and Space Agency Telemetry

- **Primary Mission Data:** NASA SPHEREx Quick Release 2 (QR2) via Caltech/IPAC Infrared Science Archive (IRSA), DOI: 10.26131/IRSA629, covering 102 spectral bands (0.75 to 5.00 µm) across 6-month survey cadences.
- **Live NASA Open APIs:**
  - **NASA NeoWs:** Real-time tracking of near-Earth asteroids, velocities, and approach distances.
  - **NASA DONKI:** Real-time space weather, coronal mass ejections, and geomagnetic activity.
  - **NASA APOD:** Daily astronomy imagery with verified astrophysics commentary.
- **Cross-Matching Observatories:**
  - **NASA Goddard SkyView:** Cross-matches targets against DSS2 (visible), 2MASS (near-IR), and WISE (mid-IR).
  - **CDS SIMBAD Database:** Validates whether infrared signals belong to known astronomical objects or new candidates.
- **Atmospheric Seeing Radar:** Calculates Pickering airmass ($X = 1/\sin(\text{alt})$) to inform ground astronomers if local seeing permits immediate telescope follow-up.

---

## SLIDE 6: Citizen Science and Educational Impact

- **Public Scientific Participation:** Replaces passive reading with interactive discovery for students, educators, and amateur astronomers.
- **Hunt Mode Console:**
  - Structured engagement ranks (*Infrared Tracker* $\rightarrow$ *Kuiper Belt Scout* $\rightarrow$ *Deep Space Pioneer*) guide users through scientific verification.
  - Interactive candidate tagging with celestial coordinates, confidence ratings, and motion vector tracking.
- **One-Click Observation Briefs:** Exports formal Markdown reports citing IRSA DOI provenance (10.26131/IRSA629) suitable for peer review and astronomical follow-up.
- **Universal Accessibility:** Runs inside any modern browser on school Chromebooks, laptops, tablets, and phones with no software installation or account creation.
- **Plain English Concept:** Equips classrooms and independent researchers with the same analytical workflows used by professional astrophysicists.

---

## SLIDE 7: Summary and Future Roadmap

- **Summary of Achievements:**
  - Built a zero-install interactive infrared observatory grounded in verified NASA SPHEREx data.
  - Developed real-time pixel differencing and blink comparison to surface moving candidates.
  - Passed all 12 backend verification checks and production build validations with zero errors.
- **Technical Roadmap:**
  1. **Multi-Year Survey Ingestion:** Expand ingestion to full-mission SPHEREx releases through 2027 to detect the slowest and most distant trans-Neptunian bodies.
  2. **In-Browser Orbit Determination:** Implement WebAssembly Gauss and Väisälä solvers to calculate orbital elements directly from multi-epoch detections.
  3. **Robotic Telescope Alerts:** Connect discovery briefs to ASCOM and INDI robotic telescope protocols for automated ground-based optical verification.
- **Closing Principle:** Deep space discoveries should be open to all curious minds exploring the infrared sky with open NASA data.
