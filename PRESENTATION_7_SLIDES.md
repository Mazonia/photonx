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

## SLIDE 2: The Problem: Why Is Planet X Still Missing?

- **Optical Faintness ($1/r^4$ Law):** Reflected solar flux drops off as the inverse fourth power: $\text{Flux} \propto 1/r^4$. At 400 AU, sunlight is 25 billion times dimmer than on Earth ($V > 23.5$).
- **Thermal Infrared Solution (35 K):** Cold giant planets retain primordial internal heat, glowing in the near-infrared ($1\text{ to }5\ \mu\text{m}$). NASA SPHEREx captures this emission across 102 continuous bands.
- **Time-Domain Data Scale:** SPHEREx scans the whole cosmos every 6 months across 102 channels. Without an automated comparator, slow-moving outer worlds remain buried in raw archives.
- **Solar System Distance and Reflected Flux Scale:**
  - **Earth (1 AU):** $1.0\times$ Flux ($1,361\ \text{W/m}^2$), 8.3 min light travel, $V = -26.7$ (Direct Sun), 100% visible reflection baseline.
  - **Neptune (30 AU):** $1.2 \times 10^{-6}\times$ Flux, 4.1 hours light travel, $V \approx 7.8$ (Binoculars), boundary of classical optical observability.
  - **Sedna (85 AU):** $1.9 \times 10^{-8}\times$ Flux, 11.8 hours light travel, $V \approx 21.1$ (8m Telescopes), extreme detached dwarf planet.
  - **Planet X (400 AU):** $3.9 \times 10^{-11}\times$ Flux (25 billion times dimmer), 55.4 hours light travel, $V > 23.5$ (Pitch Black), detectable only via $35\ \text{K}$ thermal NIR emission.
- **Observational Constraints:**
  - **Proper Motion Dilemma ($< 0.2''/\text{yr}$):** At 400 AU, orbital speed slows to $\approx 1.5\ \text{km/s}$. Single-epoch surveys cannot distinguish candidates from stationary Milky Way stars without 6-month baseline subtraction.
  - **102-Band Chemical Ice Discrimination:** Decouples thermal emission from reflected starlight, isolating diagnostic methane ($1.66, 2.30\ \mu\text{m}$) and water ice absorption features.
- **Core Objective:** Build an intuitive, visual bridge between raw NASA infrared telemetry and human perception to bring Planet X into view.

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
