# PhotonX — Official 7-Slide Presentation Deck
### NASA Space Apps Challenge 2026 | Planet X and SPHEREx
*Adheres strictly to the 7-slide limit requirement (including title and intro slides).*

---

## 🛰️ SLIDE 1: Title & Team Introduction

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

> *Speaker Note (0:00 - 0:04):*
> "Hello judges! I am Mazonia representing Team PhotonX, tackling NASA’s 'Planet X and SPHEREx' challenge with PhotonX: an interactive multi-spectral infrared sky browser and mover discovery engine."

---

## 🌌 SLIDE 2: The Problem — The Hidden Giants of the Outer Solar System

- **The Challenge:** In the outer reaches beyond Neptune, cold objects like hypothetical Planet X and sub-stellar brown dwarfs reflect virtually zero visible light, making them invisible to optical surveys.
- **The Data Flood:** NASA’s SPHEREx space telescope will observe the entire sky in 102 near-infrared bands every 6 months, generating billions of data points.
- **The Bottleneck:** Raw FITS files and complex astrometric catalogues create an impenetrable barrier for citizen scientists and students.
- **The Opportunity:** A cold body moving against background stars produces a unique time-domain signature detectable across 6-month survey epochs.

> *Speaker Note (0:04 - 0:08):*
> "Hypothetical Planet X and icy brown dwarfs hide in the darkest fringes of our solar system. NASA's SPHEREx is capturing billions of infrared pixels every six months, but raw data is locked behind specialized tools."

---

## 💡 SLIDE 3: The Solution — PhotonX

- **What Is PhotonX?** A zero-install, GPU-accelerated web platform that transforms raw SPHEREx time-series data into an intuitive, interactive celestial laboratory.
- **Core Value Proposition:**
  1. **Explore:** Freely navigate the near-infrared universe with 102-band spectral sensitivity.
  2. **Compare:** Scrub through 6-month survey cadences to detect minute positional shifts.
  3. **Discover:** Flag moving anomalies, verify spectral signatures, and export scientific briefs.
- **Dual Visual Modes:** Built with an infrared observatory dark theme and a cleanroom spec sheet mode.

> *Speaker Note (0:08 - 0:13):*
> "PhotonX bridges this divide. It is a high-performance web platform that turns massive SPHEREx datasets into an intuitive discovery engine where anyone can spot anomalies and track moving bodies."

---

## ⚙️ SLIDE 4: Interactive Architecture & The Blink Comparator

- **HTML5 Celestial Engine:** Renders hundreds of thousands of stars, coordinate gridlines, and diffraction spikes with real-time coordinate transformations.
- **Clyde Tombaugh Blink Engine:** Alternates between survey epochs (`2025-W18` and `2025-W44`) at tunable frequencies (200ms–1200ms), making high proper-motion stars and Kuiper Belt objects immediately apparent to human visual perception.
- **Multi-Survey Comparative Overlay:** Toggle between SPHEREx NIR (0.75–5.0 µm), WISE Mid-IR, 2MASS, and DSS Optical to cross-verify candidate detections.

> *Speaker Note (0:13 - 0:18):*
> "Inspired by Clyde Tombaugh’s discovery of Pluto, our blink engine rapidly alternates between 6-month survey epochs, highlighting moving objects with automated vector tracking and reticle zooming."

---

## 🔬 SLIDE 5: Scientific Validity & NASA Data Integration

- **102-Band Spectral Profiling:** Full spectrophotometric extraction across 0.75 µm to 5.00 µm with automated diagnostics for $\text{H}_2\text{O}$, $\text{CO}$, $\text{CO}_2$, and PAH ices.
- **Pixel-Differencing Engine:**
  $$\Delta I(x, y) = I_{\text{Epoch B}}(x, y) - I_{\text{Epoch A}}(x, y)$$
  Automated connected-component clustering detects $>3\sigma$ flux residuals and isolates candidate movers.
- **Live NASA Open APIs:**
  - **APOD & EPIC:** Daily imagery and planetary context.
  - **NeoWs:** Real-time asteroid close-approaches and hazardous classifications.
  - **DONKI:** Live space weather, Coronal Mass Ejections, and geomagnetic storms.
  - **Observability:** 3-tier seeing analysis (Meteomatics + OpenWeather + Open-Meteo).

> *Speaker Note (0:18 - 0:23):*
> "Under the hood, PhotonX computes pixel-difference residuals to extract candidates automatically, analyzes 102-channel spectral ice bands, and connects live to NASA APOD, NeoWs, and DONKI APIs."

---

## 🎯 SLIDE 6: Citizen Science & Measurable Impact

- **Democratizing Astrophysics:** Turns passive observation into active citizen science.
- **Gamified "Hunt Mode":**
  - Track anomalies with progressive ranks (*Infrared Tracker* $\rightarrow$ *Kuiper Belt Scout* $\rightarrow$ *Deep Space Pioneer*).
  - Annotate coordinates, confidence levels, and motion vectors.
- **One-Click Discovery Briefs:** Exports formal Markdown reports citing IRSA DOI provenance (10.26131/IRSA629) ready for submission to scientific databases.
- **Beginner Cosmic Tour:** Interactive educational voyage designed for students and educators.

> *Speaker Note (0:23 - 0:27):*
> "With 'Hunt Mode', students and citizen scientists can catalog candidates, level up their discovery rank, and export formal observation briefs directly citing NASA IRSA data."

---

## 🚀 SLIDE 7: Future Outlook & Global Vision

- **Global Scalability:** Fully containerized with Docker, lightweight REST API architecture, and sub-millisecond response caching.
- **Roadmap:**
  1. Direct integration with the upcoming full-sky SPHEREx public release.
  2. Machine-learning orbital fitting (Keplerian arc determination) directly in the browser.
  3. Ground-based automated observatory telescope targeting via ASCOM/INDI protocols.
- **Conclusion:** PhotonX makes NASA space exploration participatory, educational, and scientifically potent.

> *Speaker Note (0:27 - 0:30):*
> "Looking ahead, PhotonX will connect live telescope networks to follow up discoveries in real time. Thank you NASA Space Apps for inspiring our journey to the edge of the solar system!"
