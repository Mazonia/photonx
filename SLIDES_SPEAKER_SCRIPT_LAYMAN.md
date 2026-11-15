# PhotonX — Official 7-Slide Presentation Speaker Script
## *Presented in 100% Layman's Terms for Judges, Students, and the General Public*

> **Event:** NASA International Space Apps Challenge 2026  
> **Challenge:** Planet X and SPHEREx  
> **Project:** PhotonX — Interactive Celestial Infrared Observatory  
> **Presenter:** Mazonia (Team PhotonX)  
> **Live Web App:** [https://mazonia.github.io/photonx/](https://mazonia.github.io/photonx/)  
> **Interactive Slides:** [https://mazonia.github.io/photonx/presentation.html](https://mazonia.github.io/photonx/presentation.html)  
> **PowerPoint File:** [PhotonX_Official_Presentation.pptx](https://mazonia.github.io/photonx/PhotonX_Official_Presentation.pptx)  
> **Code Repository:** [https://github.com/Mazonia/photonx](https://github.com/Mazonia/photonx)  
> **Total Target Presentation Time:** 4 Minutes (approx. 35–45 seconds per slide)

---

## Quick Speaking Tips Before You Begin
1. **Pace Yourself:** Speak at a calm, conversational speed. Do not rush.
2. **Make Eye Contact:** Look up at the judges, smile, and speak like you are telling an exciting detective story.
3. **Use the Analogies:** Whenever you explain something technical, use the everyday analogies provided below. Judges love when complex physics is explained with crystal clarity.
4. **Use Slide Navigation:** Press the **Right Arrow** (&rarr;) or **Spacebar** on your keyboard to advance slides, or click **Next &rarr;** on the top right.

---

```
================================================================================
SLIDE 1: TITLE & MANDATORY METADATA
================================================================================
```

### 📋 Slide Details
- **Slide Heading:** SLIDE 01 / 07 • TITLE & TEAM CREDENTIALS
- **Badge:** CHALLENGE: PLANET X & SPHEREx
- **Main Title:** PHOTONX — Interactive SPHEREx Infrared Sky Browser & Outer Solar System Discovery Engine
- **Visuals on Slide:** Team Creator card, Challenge badge, Data Provenance (SPHEREx QR2 DOI: 10.26131/IRSA629), Rule Compliance banner.

---

### 💡 Concept in Everyday Words
You are introducing yourself, stating the exact NASA challenge you chose, and making it immediately clear that you built a free, zero-install website that lets anyone look through NASA's newest space telescope without needing a degree in astrophysics.

### 🌟 The Everyday Analogy
> *"Think of NASA's new SPHEREx telescope like a super-powerful camera in orbit. Normally, you'd need specialized university software just to open its files. We built PhotonX as a digital window—like Google Maps for the infrared universe—so anyone can explore it directly from their browser."*

---

### 🎙️ Word-for-Word Spoken Script (Target: 35 Seconds)

> *"Hello judges and fellow space enthusiasts! My name is Mazonia, and I am the creator of **PhotonX**, built for the NASA Space Apps Challenge under the **'Planet X and SPHEREx'** challenge.*
>
> *Our project strictly follows all submission rules: it is fully in English, uses official NASA datasets under DOI 10.26131/IRSA629, requires zero installation, and is presented here in seven concise slides.*
>
> *Today, I am going to show you how PhotonX turns NASA's massive infrared sky survey into an intuitive, interactive tool that empowers anyone—from professional researchers to students in a classroom—to hunt for mysterious moving worlds at the edge of our solar system."*

---

### ❓ Possible Judge Questions & Quick Answers
- **Judge:** *"Is this web app live right now?"*  
  **You:** *"Yes! It is deployed live on GitHub Pages at mazonia.github.io/photonx, and anyone can open it on their laptop, tablet, or phone right now."*

---
\pagebreak

```
================================================================================
SLIDE 2: THE PROBLEM — WHY IS PLANET X STILL MISSING?
================================================================================
```

### 📋 Slide Details
- **Slide Heading:** SLIDE 02 / 07 • THE PROBLEM
- **Badge:** ASTRONOMICAL CHALLENGE
- **Main Title:** The Problem: Why Is Planet X Still Missing?
- **Visuals on Slide:** Two comparative cards: "1. Optical Illumination Collapse ($1/r^4$)" and "2. The Infrared Data Flood Bottleneck".

---

### 💡 Concept in Everyday Words
People always ask: *"If Planet X is as big as Neptune or Earth, why haven't our big telescopes like Hubble found it yet?"*  
The answer has two parts:
1. **It's too dark:** Out where Planet X lives, sunlight is almost nonexistent. Sunlight has to travel all the way out there and all the way back, becoming 25 billion times dimmer. Normal cameras see pure black.
2. **The data is overwhelming:** NASA's SPHEREx telescope *can* see its heat glow across 102 infrared colors, but that creates terabytes of raw computer files that normal people can't easily open or compare.

### 🌟 The Everyday Analogy
> *"Imagine standing on one side of a huge football stadium in the pitch dark, holding a tiny keychain flashlight. You're trying to spot a black bowling ball sitting on the opposite end zone 400 yards away. Your flashlight beam is too weak to bounce back—to your eyes, the ball is invisible!*
>
> *However, if you put on **night-vision heat goggles**, that bowling ball has its own internal warmth. It glows like a lantern! That's what infrared does. But right now, that heat-vision data is locked away in millions of complicated raw files."*

---

### 🎙️ Word-for-Word Spoken Script (Target: 45 Seconds)

> *"So why haven't we found Planet X yet?*
>
> *The first reason is basic physics: distance kills light. Out at 400 times Earth's distance from the Sun, sunlight drops off by the fourth power of distance ($1/r^4$). That means reflected sunlight is **25 billion times fainter** than on Earth. Even a planet the size of Neptune is completely pitch-black to visible light telescopes like Hubble or Gaia.*
>
> *However, even at 35 degrees above absolute zero, cold worlds still radiate their own internal thermal heat. That heat shines in the near-infrared spectrum between 1 and 5 micrometers.*
>
> *NASA's SPHEREx mission is currently scanning the whole sky in 102 infrared colors every 6 months to capture this faint glow. But that brings us to the second problem: billions of raw spectral pixels locked in complex FITS archive files that are nearly impossible for ordinary humans to visually inspect. That's the bottleneck we solved."*

---

### ❓ Possible Judge Questions & Quick Answers
- **Judge:** *"Why does sunlight drop off by $1/r^4$ instead of $1/r^2$?"*  
  **You:** *"Because the light has to make a round trip! The sunlight first gets dimmer as it travels 400 AU out to the planet ($1/r^2$), and then the tiny reflected light gets dimmer again as it travels 400 AU back to our telescopes ($1/r^2$). Multiplied together, that's $1/r^4$, or 25 billion times dimmer!"*

---
\pagebreak

```
================================================================================
SLIDE 3: THE PROPOSED SOLUTION — PHOTONX
================================================================================
```

### 📋 Slide Details
- **Slide Heading:** SLIDE 03 / 07 • THE PROPOSED SOLUTION
- **Badge:** PHOTONX PLATFORM
- **Main Title:** The Proposed Solution: PhotonX
- **Visuals on Slide:** Side-by-side layout with live screenshot of PhotonX UI (Sky Engine, 102-band spectrum plot, and Clyde Tombaugh blink engine) and four key deliverable pillars.

---

### 💡 Concept in Everyday Words
PhotonX is our free, interactive web app that takes this huge mountain of infrared space telescope data and turns it into a smooth, visual, fun experience right in your web browser.

### 🌟 The Everyday Analogy
> *"Remember the 'spot-the-difference' puzzles in the Sunday newspaper? You have two drawings side by side, and you look back and forth until your eyes spot what changed.*
>
> *In 1930, an astronomer named Clyde Tombaugh discovered Pluto by taking two glass photos of the sky taken months apart and clicking a lever back and forth to 'blink' them. We built that exact same super-power right into your keyboard—just press the Spacebar, and any moving planet jumps out at you!"*

---

### 🎙️ Word-for-Word Spoken Script (Target: 45 Seconds)

> *"Here is our solution: **PhotonX**.*
>
> *PhotonX is a high-speed, zero-install web observatory that runs smoothly in any modern browser—even on a classroom Chromebook.*
>
> *First, it features a fluid canvas engine that lets you pan and zoom across the infrared sky—from full 45-degree constellations down to tiny, deep-space patches.*
>
> *Second, we integrated the **Clyde Tombaugh Blink Comparator**. By tapping the Spacebar, you rapidly flip between two sky photos taken six months apart. Stationary stars stay locked in place, but any moving body—like an asteroid or Planet X—visibly jumps back and forth before your eyes.*
>
> *Third, clicking on any object instantly extracts its **102-channel infrared spectrum**, revealing chemical fingerprints like water frost, methane ice, or carbon dioxide ice in real time."*

---

### ❓ Possible Judge Questions & Quick Answers
- **Judge:** *"Does this require downloading or installing Python or specialized software?"*  
  **You:** *"Not at all! Everything is compiled into fast, modern web standards (HTML5 Canvas and WebAssembly). You just click a URL and start exploring in two seconds."*

---
\pagebreak

```
================================================================================
SLIDE 4: HOW IT WORKS — AUTOMATED MOVER DETECTION
================================================================================
```

### 📋 Slide Details
- **Slide Heading:** SLIDE 04 / 07 • DETECTION PIPELINE
- **Badge:** IMAGE DIFFERENCING ENGINE
- **Main Title:** How It Works: Automated Mover Detection
- **Visuals on Slide:** Screenshot of the Pixel Difference Residuals tab and the 3-step pipeline: Align & Normalize, Subtract Matrices ($\Delta I = I_B - I_A$), and Threshold ($> 3\sigma$) & Centroid.

---

### 💡 Concept in Everyday Words
Human eyes are great, but the sky is gigantic! To help humans find moving objects without getting tired, our software uses basic subtraction math to automatically erase all the stars that didn't move, leaving behind only the things that did move.

### 🌟 The Everyday Analogy
> *"Imagine taking a photo of your living room today, and another photo tomorrow. If you feed both photos into a computer and tell it to subtract yesterday's photo from today's photo, what happens?*
>
> *The couch, the TV, and the walls haven't moved at all, so (Couch minus Couch = Zero). They completely vanish into blackness! But if your cat walked across the rug, the cat is the ONLY thing left on the screen.*
>
> *Our difference engine does the exact same thing with the sky: it cancels out millions of fixed stars, leaving only moving planets and asteroids!"*

---

### 🎙️ Word-for-Word Spoken Script (Target: 45 Seconds)

> *"To find moving objects across millions of stars, we built an automated **Image Differencing Pipeline** that runs in three simple steps:*
>
> *Step 1: **Align & Normalize.** When comparing two sky passes taken six months apart, our engine lines up the celestial coordinates and adjusts the brightness so both images match perfectly.*
>
> *Step 2: **Subtract the Images.** We subtract Epoch A from Epoch B. Because stars stay fixed in the sky, their brightness cancels out to zero—they disappear completely! A moving object, however, leaves a signature 'dipole': a black hole where it used to be, and a bright white dot where it is now.*
>
> *Step 3: **Threshold and Vector Tracking.** The algorithm flags every bright spot that rises three standard deviations ($>3\sigma$) above the background noise, calculates how many arcseconds it moved, and hands it straight to the user as a verified candidate."*

---

### ❓ Possible Judge Questions & Quick Answers
- **Judge:** *"What is a dipole?"*  
  **You:** *"It simply means a 'positive and negative pair'. When you subtract photo 1 from photo 2, the old position becomes negative (a dark hollow), and the new position becomes positive (a bright spot). Seeing that pair is bulletproof proof that an object physically moved across space!"*

---
\pagebreak

```
================================================================================
SLIDE 5: NASA DATA & APIS USED
================================================================================
```

### 📋 Slide Details
- **Slide Heading:** SLIDE 05 / 07 • DATA & APIS USED
- **Badge:** OFFICIAL NASA TELEMETRY
- **Main Title:** NASA Data & APIs Used
- **Visuals on Slide:** 4-column card grid:
  1. NASA SPHEREx QR2 Survey (DOI: 10.26131/IRSA629)
  2. Live NASA Open APIs (api.nasa.gov key registered)
  3. NASA Goddard SkyView
  4. Atmospheric Seeing Radar (Meteomatics & OpenWeather)

---

### 💡 Concept in Everyday Words
Proving that our project isn't a toy or a fictional simulation. Every star, coordinate, and spectrum comes directly from authentic NASA databases and live government satellites.

### 🌟 The Everyday Analogy
> *"We didn't just paint pretty pictures of stars on a canvas. PhotonX is wired directly into NASA's digital pipeline. When you click an object, you are touching the exact same data that scientists at Caltech and NASA Jet Propulsion Laboratory analyze every day."*

---

### 🎙️ Word-for-Word Spoken Script (Target: 45 Seconds)

> *"Everything in PhotonX is grounded in verified, real-world space telemetry:*
>
> *First, our foundation is the **NASA SPHEREx Quick Release 2** survey from Caltech/IPAC, registered under official DOI **10.26131/IRSA629**. This provides the authentic 102 near-infrared color bands across multiple 6-month survey epochs.*
>
> *Second, we integrated **live NASA Open APIs** using our verified developer key. We track real-time near-Earth asteroids through NASA NeoWs and monitor solar storms through NASA DONKI.*
>
> *Third, we connect to **NASA Goddard's SkyView**, allowing users to compare infrared detections against historical optical photographs from the Digitized Sky Survey.*
>
> *And finally, because space discoveries must be confirmed from Earth, we built an **Atmospheric Seeing Radar** using Meteomatics and OpenWeather. It tells astronomers whether tonight's local clouds and air turbulence will allow ground telescopes to verify the candidate."*

---

### ❓ Possible Judge Questions & Quick Answers
- **Judge:** *"Why do we care about ground atmospheric seeing if SPHEREx is in space?"*  
  **You:** *"Because space telescopes have very limited time! Once a space telescope flags an interesting candidate, astronomers use large ground observatories like Keck in Hawaii or VLT in Chile to confirm it. Our weather radar tells them if tonight's sky conditions are clear enough to do that."*

---
\pagebreak

```
================================================================================
SLIDE 6: CITIZEN SCIENCE — DEMOCRATIZING DEEP SPACE DISCOVERY
================================================================================
```

### 📋 Slide Details
- **Slide Heading:** SLIDE 06 / 07 • CITIZEN SCIENCE
- **Badge:** COMMUNITY IMPACT
- **Main Title:** Citizen Science: Democratizing Deep Space Discovery
- **Visuals on Slide:** Split layout showing Hunt Mode screenshot (tagging candidates, hunter ranks, and Markdown observation report generator) alongside key educational benefits.

---

### 💡 Concept in Everyday Words
Astronomy shouldn't be locked behind closed doors. With Hunt Mode, students, teachers, and space fans can make real contributions to planetary science while having fun.

### 🌟 The Everyday Analogy
> *"Think of it like Pokémon Go meets real NASA astrophysics. Instead of catching fictional monsters, a student searches authentic space photos, spots a real moving asteroid or planet candidate, tags it, earns discovery ranks, and exports an official scientific report with their own name on it."*

---

### 🎙️ Word-for-Word Spoken Script (Target: 40 Seconds)

> *"Science works best when everyone can participate.*
>
> *With our built-in **Hunt Mode**, anyone can become a citizen scientist. As users inspect survey epochs and tag genuine candidate movers, they level up through progressive ranks—from *Infrared Tracker* to *Kuiper Belt Scout* to *Deep Space Pioneer*.*
>
> *With a single click, users can export a formal **Scientific Observation Brief** in Markdown format. This report automatically includes exact celestial coordinates, 6-month epoch timestamps, observed arcsecond shifts, and full citations to the official NASA IRSA dataset.*
>
> *Because it requires zero software installation and supports complete keyboard navigation, PhotonX is ready for any school classroom, science club, or amateur astronomy group in the world."*

---

### ❓ Possible Judge Questions & Quick Answers
- **Judge:** *"How do you prevent users from spamming fake detections?"*  
  **You:** *"Every exported report includes mathematical metrics: the exact signal-to-noise ratio ($>3\sigma$), positional shift in arcseconds, and the infrared spectral class. A professional astronomer can glance at the report in five seconds and verify if the detection is astrophysically valid."*

---
\pagebreak

```
================================================================================
SLIDE 7: SUMMARY & THE ROAD TO PLANET X
================================================================================
```

### 📋 Slide Details
- **Slide Heading:** SLIDE 07 / 07 • SUMMARY & ROADMAP
- **Badge:** LOOKING FORWARD
- **Main Title:** Summary & The Road to Planet X
- **Visuals on Slide:** 3 roadmap pillars:
  1. Full Survey Ingestion (2025–2027)
  2. In-Browser Orbit Fitting (Gauss & Väisälä methods)
  3. Robotic Telescope Alerts (INDI/ASCOM)
  - Bottom inspirational quote banner and links.

---

### 💡 Concept in Everyday Words
Summarize what we built, state the exciting future roadmap, and leave the judges with a memorable, inspiring final thought.

### 🌟 The Everyday Analogy
> *"When Clyde Tombaugh discovered Pluto nearly a century ago, he had to sit in a cold room for ten months manually squinting through a microscope. Today, with NASA's open data and modern web browsers, we are putting that search into the hands of millions of people across the globe."*

---

### 🎙️ Word-for-Word Spoken Script (Target: 40 Seconds)

> *"To summarize: PhotonX is ready and live today, but it is architected for the future.*
>
> *As SPHEREx continues its survey over 2025 through 2027, our roadmap includes:*
> *1. Ingesting future multi-year survey releases to dramatically boost sensitivity to ultra-slow distant movers.*
> *2. Running classical orbit calculations directly in the browser using WebAssembly to compute an object's distance and orbital shape in seconds.*
> *3. Connecting candidate alerts directly to robotic telescopes worldwide for instant automated follow-up.*
>
> *Planet X may be hiding in the dark, but with NASA's open infrared data and PhotonX, we now have the light to find it.*
>
> *Thank you very much, judges, for your time and dedication. I am now delighted to take any questions!"*

---

### ❓ Possible Judge Questions & Quick Answers
- **Judge:** *"What is your favorite feature in PhotonX?"*  
  **You:** *"The Blink Comparator combined with the interactive spotlight tutorial! In less than one minute, someone who has never studied astronomy can open the website, learn how every button works, press Spacebar, and experience the exact thrill of discovery that professional astronomers feel."*

---
\pagebreak

## 🎯 Master Cheat Sheet for the 4-Minute Presentation

| Slide # | Slide Title | Core Message | Everyday Analogy | Time |
| :---: | :--- | :--- | :--- | :---: |
| **01** | **Title & Team** | Team PhotonX, Planet X & SPHEREx challenge, official NASA data | A digital window into NASA's newest space telescope | **35s** |
| **02** | **The Problem** | Reflected sunlight is 25 billion times dimmer ($1/r^4$), raw FITS data is overwhelming | Trying to see a black bowling ball 400 yards away with a tiny flashlight | **45s** |
| **03** | **The Solution** | Zero-install web browser, GPU sky canvas, Clyde Tombaugh blink comparator | Spot-the-difference game where the planet jumps back and forth | **45s** |
| **04** | **How It Works** | Align, subtract images, cancel fixed stars, isolate $>3\sigma$ moving dipoles | Subtracting living room photos so only the moving cat remains | **45s** |
| **05** | **NASA Data & APIs** | Caltech/IPAC SPHEREx QR2 (DOI: 10.26131/IRSA629), live NASA APIs, seeing radar | Real rocket and satellite telemetry, not a video game simulation | **45s** |
| **06** | **Citizen Science** | Gamified hunter ranks, 1-click scientific reports, Chromebook & classroom ready | Pokémon Go meets authentic NASA astrophysics | **40s** |
| **07** | **Summary & Roadmap** | In-browser orbit calculations, robotic telescope alerts, open science future | Giving the tools that discovered Pluto to everyone on Earth | **40s** |
| **Total** | **All 7 Slides** | **Complete NASA Space Apps 2026 Presentation** | **Confident, Clear & Engaging** | **~4m 15s** |

---

## 🏆 Presentation Day Checklist
- [x] Web app tested live at: `https://mazonia.github.io/photonx/`
- [x] 7-Slide presentation tested at: `https://mazonia.github.io/photonx/presentation.html`
- [x] Offline PowerPoint backup downloaded: `PhotonX_Official_Presentation.pptx`
- [x] Spacebar and Arrow Keys tested for instant slide transitions
- [x] Interactive spotlight tutorial verified for judges exploring the app
- [x] Microphone and screen sharing checked

**Good luck with your presentation! You've built a stellar, world-class tool for NASA Space Apps! 🚀🪐**
