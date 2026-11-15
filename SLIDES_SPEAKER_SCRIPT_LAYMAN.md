# PhotonX: Official 7-Slide Presentation Speaker Script
## Presented in Plain Terms for Judges, Students, and the General Public

> **Event:** NASA International Space Apps Challenge 2026  
> **Challenge:** Planet X and SPHEREx  
> **Project:** PhotonX: Interactive Celestial Infrared Observatory  
> **Presenter:** Mazonia (Team PhotonX)  
> **Live Web App:** https://mazonia.github.io/photonx/  
> **Interactive Slides:** https://mazonia.github.io/photonx/presentation.html  
> **PowerPoint File:** PhotonX_Official_Presentation.pptx  
> **Code Repository:** https://github.com/Mazonia/photonx  
> **Total Target Presentation Time:** 4 Minutes (approximately 35 to 45 seconds per slide)

---

## Speaking Guidelines Before You Begin
1. **Pace Yourself:** Speak at a calm, conversational speed. Do not rush through the numbers.
2. **Engage the Judges:** Look up at the evaluators, speak clearly, and deliver the presentation with steady confidence.
3. **Use the Analogies:** When explaining technical mechanisms, use the direct everyday comparisons provided below to make complex physics instantly understandable.
4. **Slide Navigation:** Press the Right Arrow or Spacebar on your keyboard to advance slides, or click Next on the top navigation bar.

---

```
================================================================================
SLIDE 1: TITLE & MANDATORY METADATA
================================================================================
```

### Slide Details
- **Slide Heading:** SLIDE 01 / 07 • TITLE & TEAM CREDENTIALS
- **Badge:** CHALLENGE: PLANET X & SPHEREx
- **Main Title:** PHOTONX: Interactive SPHEREx Infrared Sky Browser & Outer Solar System Discovery Engine
- **Visuals on Slide:** Team Creator card, Challenge badge, Data Provenance (SPHEREx QR2 DOI: 10.26131/IRSA629), Rule Compliance banner.

---

### Concept in Everyday Words
You are introducing yourself, stating the exact NASA challenge you chose, and explaining that you built a free, zero-install website that lets anyone look through NASA's newest space telescope without needing specialized command-line tools.

### The Everyday Analogy
> *"Think of NASA's new SPHEREx telescope like a powerful multi-spectral camera in orbit. Normally, you would need university data reduction pipelines just to view its files. We built PhotonX as a direct digital window so anyone can explore it directly from their web browser."*

---

### Spoken Script (Target: 35 Seconds)

> *"Hello judges. My name is Mazonia, and I am the creator of PhotonX, developed for the NASA Space Apps Challenge under the 'Planet X and SPHEREx' category.*
>
> *Our project strictly follows all submission requirements: it is fully in English, uses official NASA datasets under DOI 10.26131/IRSA629, requires zero installation, and is presented in seven structured slides.*
>
> *Today, I will show you how PhotonX turns NASA's massive infrared sky survey into an intuitive tool that empowers anyone, from researchers to classroom students, to search for moving worlds at the edge of our solar system."*

---

### Possible Judge Questions & Quick Answers
- **Judge:** *"Is this web app live right now?"*  
  **You:** *"Yes. It is deployed live on GitHub Pages at mazonia.github.io/photonx, accessible immediately on laptops, tablets, or phones without an account."*

---

```
================================================================================
SLIDE 2: THE PROBLEM: WHY IS PLANET X STILL MISSING?
================================================================================
```

### Slide Details
- **Slide Heading:** SLIDE 02 / 07 • THE PROBLEM
- **Badge:** ASTRONOMICAL CHALLENGE
- **Main Title:** The Problem: Why Is Planet X Still Missing?
- **Visuals on Slide:** Three comparative cards: Optical Faintness (1/r^4), Thermal Infrared Emission (35 K), and Time-Domain Survey Archive.

---

### Concept in Everyday Words
Why haven't optical telescopes like Hubble found Planet X?
1. **Distance drops reflected sunlight severely:** Out at 400 AU, sunlight travels back and forth, becoming 25 billion times dimmer than on Earth. Optical sensors register pitch black.
2. **Infrared holds the signature:** Giant planets radiate their own internal heat at 35 Kelvin across 102 infrared wavelengths.
3. **Data volume:** NASA's SPHEREx captures this heat, but comparing multiple six-month sky passes requires automated visual tools.

### The Everyday Analogy
> *"Imagine standing on one side of a large stadium at night trying to spot a black bowling ball 400 yards away with a keychain flashlight. The beam cannot return sufficient light to your eyes. But if you put on thermal goggles, the ball radiates its own heat like a warm ember. SPHEREx captures that heat, and PhotonX makes that data instantly visible."*

---

### Spoken Script (Target: 45 Seconds)

> *"Why hasn't Planet X been found yet?*
>
> *First, optical physics works against us. Sunlight reflected from an object at 400 Astronomical Units drops off by the inverse fourth power of distance (1/r^4). That means reflected light is 25 billion times fainter than on Earth. Even a Neptune-sized world appears black in visible light.*
>
> *However, cold giant planets retain primordial internal heat, glowing in the near-infrared between 1 and 5 micrometers at roughly 35 Kelvin.*
>
> *NASA's SPHEREx mission is mapping the entire sky in 102 infrared bands every six months to record this glow. But this produces massive data volumes locked in technical archives. Without an interactive comparison tool, moving objects remain hidden in raw data. PhotonX addresses that exact bottleneck."*

---

### Possible Judge Questions & Quick Answers
- **Judge:** *"Why does reflected light follow an inverse fourth power law?"*  
  **You:** *"Because the light makes a complete round trip: it dims by 1/r^2 traveling from the Sun out to the planet, and dims by another 1/r^2 returning to Earth. Multiplied together, that gives 1/r^4, causing extreme optical dimming at large distances."*

---

```
================================================================================
SLIDE 3: THE PROPOSED SOLUTION: PHOTONX
================================================================================
```

### Slide Details
- **Slide Heading:** SLIDE 03 / 07 • THE PROPOSED SOLUTION
- **Badge:** PHOTONX WORKSTATION
- **Main Title:** The Proposed Solution: PhotonX Workstation
- **Visuals on Slide:** Side-by-side layout with live user interface screenshot and core workstation capabilities.

---

### Concept in Everyday Words
PhotonX provides a fast, interactive web observatory that lets anyone pan through infrared space, inspect spectra, and compare observation epochs without downloading gigabytes of data.

### The Everyday Analogy
> *"In 1930, Clyde Tombaugh discovered Pluto by taking glass plates photographed months apart and mechanically blinking back and forth to spot what moved. We built that exact comparator into the browser: pressing the Spacebar immediately reveals moving planets against stationary stars."*

---

### Spoken Script (Target: 45 Seconds)

> *"Our solution is PhotonX.*
>
> *PhotonX is a zero-install web observatory running directly in modern web browsers, including school Chromebooks.*
>
> *First, it provides a fluid celestial canvas that pans and zooms across infrared space, from 45-degree constellations down to deep-field resolutions.*
>
> *Second, we integrated a digital Clyde Tombaugh Blink Comparator. Pressing the Spacebar rapidly alternates between survey epochs taken six months apart. Fixed background stars remain stationary, while any moving body clearly shifts position.*
>
> *Third, selecting any source extracts its 102-channel infrared spectrum, revealing chemical fingerprints such as water ice, methane, and carbon dioxide in real time.*
>
> *We also include a Keplerian Solar System Orrery, allowing users to explore orbital paths from Mercury out to 800 AU."*

---

### Possible Judge Questions & Quick Answers
- **Judge:** *"Does this run entirely on the client or does it require a backend server?"*  
  **You:** *"The core interactive observatory runs entirely client-side on HTML5 Canvas. We also provide a Python FastAPI backend that interfaces directly with Caltech/IPAC IRSA and live NASA open APIs."*

---

```
================================================================================
SLIDE 4: HOW IT WORKS: AUTOMATED MOVER DETECTION
================================================================================
```

### Slide Details
- **Slide Heading:** SLIDE 04 / 07 • DETECTION PIPELINE
- **Badge:** IMAGE DIFFERENCING ENGINE
- **Main Title:** How It Works: Automated Mover Detection
- **Visuals on Slide:** Screenshot of the difference engine interface and the three-stage subtraction pipeline.

---

### Concept in Everyday Words
Our software uses image subtraction to eliminate stationary stars so that moving objects stand out clearly.

### The Everyday Analogy
> *"If you take two photos of a plaza months apart and subtract them, stationary buildings cancel out to zero and disappear. Only people who moved across the frame remain visible. That is how our pipeline isolates moving planets from billions of background stars."*

---

### Spoken Script (Target: 45 Seconds)

> *"To detect moving targets systematically, PhotonX implements a three-step image differencing pipeline:*
>
> *Step 1: Align and Normalize. The engine registers celestial coordinates and normalizes Point Spread Functions between survey epochs separated by six months.*
>
> *Step 2: Matrix Subtraction. We compute Delta I = Epoch B minus Epoch A. Because background stars do not change position, their flux cancels out to zero. A moving body leaves a distinct positive-and-negative dipole signature.*
>
> *Step 3: Threshold and Vector Extraction. Connected-component clustering isolates peaks exceeding three standard deviations above background noise, calculates angular motion in arcseconds, and logs candidates for verification."*

---

### Possible Judge Questions & Quick Answers
- **Judge:** *"What is a dipole in this context?"*  
  **You:** *"A dipole is a dark negative spot at the earlier epoch position paired with a bright positive spot at the later epoch position. This paired signature confirms real physical motion rather than random noise."*

---

```
================================================================================
SLIDE 5: NASA DATA ASSETS & SPACE AGENCY TELEMETRY
================================================================================
```

### Slide Details
- **Slide Heading:** SLIDE 05 / 07 • DATA & APIS USED
- **Badge:** OFFICIAL NASA TELEMETRY
- **Main Title:** NASA Data Assets & Space Agency Telemetry
- **Visuals on Slide:** Four data asset cards covering SPHEREx QR2, live NASA APIs, NASA Goddard SkyView, and Atmospheric Seeing Radar.

---

### Concept in Everyday Words
Every coordinate, pixel, and spectrum in PhotonX is tied directly to verified NASA data releases and live telemetry.

### The Everyday Analogy
> *"PhotonX is not a synthetic space game. When you interact with the viewport, you are querying the same Caltech and NASA archives that planetary scientists use."*

---

### Spoken Script (Target: 45 Seconds)

> *"PhotonX is grounded in verified NASA data assets:*
>
> *Our primary dataset is the NASA SPHEREx Quick Release 2 survey from Caltech/IPAC, catalogued under DOI 10.26131/IRSA629. This supplies the 102 near-infrared bands across multi-epoch cadences.*
>
> *We also stream live data from NASA Open APIs: near-Earth asteroid trajectories through NeoWs, and space weather through NASA DONKI.*
>
> *For cross-matching, we connect to NASA Goddard's SkyView service to compare infrared detections against optical surveys like DSS2 and infrared surveys like 2MASS.*
>
> *Finally, our Atmospheric Seeing Radar calculates local airmass to inform astronomers if local atmospheric conditions permit ground telescope follow-up tonight."*

---

### Possible Judge Questions & Quick Answers
- **Judge:** *"Why include ground seeing calculations if SPHEREx operates in space?"*  
  **You:** *"Space telescope discoveries require independent ground verification. Professional observatories like Keck or VLT need immediate confirmation of candidates, and our radar tells observers if tonight's seeing disk allows follow-up."*

---

```
================================================================================
SLIDE 6: CITIZEN SCIENCE: PUBLIC PARTICIPATION IN DEEP SPACE DISCOVERY
================================================================================
```

### Slide Details
- **Slide Heading:** SLIDE 06 / 07 • CITIZEN SCIENCE
- **Badge:** COMMUNITY IMPACT
- **Main Title:** Citizen Science: Public Participation in Deep Space Discovery
- **Visuals on Slide:** Hunt Mode interface screenshot with candidate tagging, progressive ranks, and observation brief generator.

---

### Concept in Everyday Words
Students and amateur astronomers can review real NASA data, tag potential candidates, and produce formal scientific briefs.

### The Everyday Analogy
> *"Instead of just reading about discoveries in textbooks, students can examine authentic space telescope passes, tag moving anomalies, and generate structured reports with formal NASA dataset citations."*

---

### Spoken Script (Target: 40 Seconds)

> *"Scientific research benefits from broad participation.*
>
> *With our built-in Hunt Mode, students and amateur astronomers can examine survey passes, tag candidate movers, and advance through structured engagement tiers from Infrared Tracker to Deep Space Pioneer.*
>
> *With one click, users can export a formal Scientific Observation Brief in Markdown format. The brief automatically compiles coordinates, epoch timestamps, motion vectors, and official DOI citations.*
>
> *Because it requires zero software installation and supports complete keyboard navigation, PhotonX is immediately accessible in classroom and independent research settings."*

---

### Possible Judge Questions & Quick Answers
- **Judge:** *"How do you filter false positive detections?"*  
  **You:** *"Exported briefs record signal-to-noise ratio, angular displacement, and multi-band spectral slopes, allowing astronomers to verify astrophysical plausibility in seconds."*

---

```
================================================================================
SLIDE 7: SUMMARY & THE ROAD TO PLANET X
================================================================================
```

### Slide Details
- **Slide Heading:** SLIDE 07 / 07 • SUMMARY & ROADMAP
- **Badge:** LOOKING FORWARD
- **Main Title:** Summary & The Road to Planet X
- **Visuals on Slide:** Three technical roadmap pillars and concluding vision statement.

---

### Concept in Everyday Words
Summarize the delivered platform, describe next engineering steps, and conclude with a clear scientific message.

### Spoken Script (Target: 40 Seconds)

> *"To summarize: PhotonX is fully operational today, with a clear engineering roadmap for future survey releases:*
>
> *1. Ingesting full-mission SPHEREx public releases through 2027 to extend the time baseline for ultra-distant trans-Neptunian objects.*
> *2. Implementing WebAssembly orbital solvers to determine orbital semi-major axis, eccentricity, and inclination directly in the browser.*
> *3. Connecting alerts directly to robotic telescope networks using ASCOM and INDI protocols for automated verification.*
>
> *Planet X may be faint in optical light, but with NASA's open infrared survey and PhotonX, we now have the tools to search for it.*
>
> *Thank you for your time and evaluation. I am happy to answer your questions."*

---

## Master Reference Table for Presentation Delivery

| Slide # | Slide Title | Core Message | Target Duration |
| :---: | :--- | :--- | :---: |
| **01** | **Title & Team** | Team PhotonX, Planet X & SPHEREx challenge, official NASA data | **35s** |
| **02** | **The Problem** | Inverse fourth power optical dimming (1/r^4), 35K thermal infrared solution | **45s** |
| **03** | **The Solution** | Zero-install web browser, GPU sky canvas, Clyde Tombaugh blink comparator | **45s** |
| **04** | **How It Works** | Align, subtract images, cancel fixed stars, isolate moving dipoles | **45s** |
| **05** | **NASA Data & APIs** | Caltech/IPAC SPHEREx QR2 (DOI: 10.26131/IRSA629), live NASA APIs, seeing radar | **45s** |
| **06** | **Citizen Science** | Structured research ranks, 1-click observation briefs, classroom ready | **40s** |
| **07** | **Summary & Roadmap** | In-browser orbit calculations, robotic telescope alerts, open science future | **40s** |
| **Total** | **All 7 Slides** | **NASA Space Apps Challenge 2026 Presentation** | **~4m 15s** |

---

## Presentation Checklist
- [x] Web app verified live at: https://mazonia.github.io/photonx/
- [x] 7-Slide presentation tested at: https://mazonia.github.io/photonx/presentation.html
- [x] Offline PowerPoint file available: PhotonX_Official_Presentation.pptx
- [x] Spacebar and Arrow Keys tested for slide progression
- [x] All 12 backend verification checks passing
