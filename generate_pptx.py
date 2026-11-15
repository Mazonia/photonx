#!/usr/bin/env python3
"""
PhotonX Official Presentation Generator (.pptx)
================================================
Generates a polished, professional 16:9 widescreen PowerPoint presentation
designed for the NASA Space Apps Challenge 2026.
Strictly adheres to the 7-slide limit and judging rubric guidelines.
Features authentic app screenshots, visual pipelines, and natural presenter notes.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="PhotonX_Official_Presentation.pptx"):
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]  # Blank slide

    # Color Palette: Deep Space Observatory
    BG_COLOR = RGBColor(6, 11, 24)        # #060B18
    CARD_BG = RGBColor(15, 23, 42)        # #0F172A
    CARD_BORDER = RGBColor(30, 41, 59)    # #1E293B
    CYAN = RGBColor(56, 189, 248)         # #38BDF8
    AMBER = RGBColor(245, 158, 11)        # #F59E0B
    WHITE = RGBColor(248, 250, 252)       # #F8FAFC
    MUTED = RGBColor(148, 163, 184)       # #94A3B8
    EMERALD = RGBColor(16, 185, 129)      # #10B981
    DARK_CARD = RGBColor(11, 19, 36)      # #0B1324

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.color.rgb = BG_COLOR
        return bg

    def add_header(slide, slide_num, category, title, subtitle):
        # Category / Tracker line
        tb_cat = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.35))
        p_cat = tb_cat.text_frame.paragraphs[0]
        p_cat.text = f"SLIDE {slide_num:02d} / 07   •   {category.upper()}   •   NASA SPACE APPS 2026"
        p_cat.font.name = "Arial"
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = CYAN

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.733), Inches(0.65))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.name = "Arial"
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = WHITE

        # Subtitle
        if subtitle:
            tb_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.45))
            p_sub = tb_sub.text_frame.paragraphs[0]
            p_sub.text = subtitle
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(12)
            p_sub.font.color.rgb = MUTED

    def add_card(slide, left, top, width, height, title, body_bullets, accent_color=CYAN):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1)

        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p_title = tf.paragraphs[0]
        p_title.text = title
        p_title.font.name = "Arial"
        p_title.font.size = Pt(14)
        p_title.font.bold = True
        p_title.font.color.rgb = accent_color
        p_title.space_after = Pt(8)

        for b in body_bullets:
            p_b = tf.add_paragraph()
            p_b.text = f"•  {b}"
            p_b.font.name = "Arial"
            p_b.font.size = Pt(11)
            p_b.font.color.rgb = WHITE
            p_b.space_after = Pt(5)
        return card

    def add_image_card(slide, img_path, left, top, width, height, caption=""):
        # Border frame behind image
        frame = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left - Inches(0.04), top - Inches(0.04), width + Inches(0.08), height + Inches(0.08))
        frame.fill.solid()
        frame.fill.fore_color.rgb = CARD_BG
        frame.line.color.rgb = CYAN
        frame.line.width = Pt(1)

        if os.path.exists(img_path):
            slide.shapes.add_picture(img_path, left, top, width, height)

        if caption:
            tb = slide.shapes.add_textbox(left, top + height + Inches(0.05), width, Inches(0.3))
            p = tb.text_frame.paragraphs[0]
            p.text = caption
            p.font.name = "Arial"
            p.font.size = Pt(9)
            p.font.color.rgb = MUTED
            p.alignment = PP_ALIGN.CENTER

    def add_speaker_note(slide, note_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = note_text

    # =========================================================================
    # SLIDE 1: Title & Team Introduction (NASA Rule: Team, Members, Challenge)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Mission Tag
    tag_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.733), Inches(0.4))
    p_tag = tag_box.text_frame.paragraphs[0]
    p_tag.text = "NASA INTERNATIONAL SPACE APPS CHALLENGE 2026"
    p_tag.font.name = "Arial"
    p_tag.font.size = Pt(12)
    p_tag.font.bold = True
    p_tag.font.color.rgb = AMBER

    # Title
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.733), Inches(1.2))
    p_t = t_box.text_frame.paragraphs[0]
    p_t.text = "PHOTONX"
    p_t.font.name = "Arial"
    p_t.font.size = Pt(60)
    p_t.font.bold = True
    p_t.font.color.rgb = WHITE

    # Subtitle
    sub_box = s1.shapes.add_textbox(Inches(0.8), Inches(2.75), Inches(11.733), Inches(0.7))
    p_sub = sub_box.text_frame.paragraphs[0]
    p_sub.text = "SPHEREx Infrared Sky Browser & Outer Solar System Discovery Engine"
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(20)
    p_sub.font.color.rgb = CYAN

    # Official Submission Requirements Grid (Strict NASA Rule Compliance)
    c_w = Inches(3.7)
    c_h = Inches(2.4)
    c_y = Inches(3.8)

    add_card(s1, Inches(0.8), c_y, c_w, c_h, "👤 TEAM CREATOR", [
        "Team Name: PhotonX",
        "Participant: Mazonia (Solo Developer)",
        "Role: Full-Stack Engineer & Astrophysics Enthusiast",
        "Challenge: Planet X and SPHEREx",
        "Target: Outer Solar System Moving Objects"
    ], CYAN)

    add_card(s1, Inches(4.8), c_y, c_w, c_h, "🛰️ PRIMARY NASA DATASET", [
        "Mission: NASA SPHEREx Space Telescope",
        "Dataset: Quick Release 2 (QR2) All-Sky Survey",
        "DOI: 10.26131/IRSA629 (Caltech/IPAC)",
        "Wavelength: 102 Spectral Channels (0.75 - 5.0 µm)",
        "Survey Cadence: 6-Month Sky Iterations"
    ], AMBER)

    add_card(s1, Inches(8.8), c_y, c_w, c_h, "🔗 ACCESS & REPOSITORY", [
        "Source Code: github.com/Mazonia/photonx",
        "Live Web Observatory: mazonia.github.io/photonx",
        "NASA Open APIs: APOD, NeoWs, DONKI, EPIC",
        "License: MIT Open Source",
        "AI Disclosure: Super Intelligence assistance per NASA rules"
    ], EMERALD)

    # Footer note bar
    f_box = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.5), Inches(11.733), Inches(0.5))
    f_box.fill.solid()
    f_box.fill.fore_color.rgb = DARK_CARD
    f_box.line.color.rgb = CARD_BORDER
    p_f = f_box.text_frame.paragraphs[0]
    p_f.text = "Official Submission Package  •  Zero-Install Web Architecture  •  Section 508 / WCAG 2.1 Accessible"
    p_f.font.name = "Arial"
    p_f.font.size = Pt(10)
    p_f.font.color.rgb = MUTED
    p_f.alignment = PP_ALIGN.CENTER

    add_speaker_note(s1, (
        "Judges, welcome. My name is Mazonia, and this is PhotonX. "
        "Our team tackled the 'Planet X and SPHEREx' challenge. "
        "NASA's SPHEREx mission is mapping the entire celestial sphere in 102 infrared bands every six months. "
        "We built PhotonX to turn that massive flood of raw FITS files into an interactive, zero-install web observatory "
        "where both professional astronomers and citizen scientists can spot shifting centroids and discover the hidden giants of our outer solar system."
    ))

    # =========================================================================
    # SLIDE 2: The Physical Challenge — Why Optical Telescopes Fail
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, 2, "The Physical Challenge",
               "Why the Hidden Giants of the Outer Solar System Remain Undiscovered",
               "The physics of inverse-fourth-power optical illumination vs. thermal near-infrared emission.")

    c_w2 = Inches(5.6)
    c_h2 = Inches(5.0)
    c_y2 = Inches(1.9)

    add_card(s2, Inches(0.8), c_y2, c_w2, c_h2, "THE INVISIBLE SKY: OPTICAL ILLUMINATION COLLAPSE", [
        "The 1/r⁴ Solar Illumination Trap:",
        "Reflected sunlight dims with distance squared out, and distance squared back (Flux ∝ 1/r⁴).",
        "At 400 AU (the hypothesized orbit of Planet X), solar irradiance is 1/25,600,000,000th of Earth's.",
        "A 5-Earth-mass planet at 400 AU has an optical magnitude dimmer than V ≈ 23.5.",
        "Optical surveys like Hubble, Gaia, or Pan-STARRS see only empty black space.",
        "",
        "Thermal Infrared Radiance (Wien's Displacement Law):",
        "Even at 30 to 40 Kelvin, outer planets and cold brown dwarfs radiate their own internal primordial heat.",
        "Peak emission falls squarely between 1.0 µm and 5.0 µm.",
        "In the near-infrared, these pitch-black objects light up like beacons."
    ], CYAN)

    add_card(s2, Inches(6.9), c_y2, c_w2, c_h2, "THE SPHEREx REVOLUTION & THE DATA BOTTLENECK", [
        "NASA SPHEREx Wavelength Advantage:",
        "Observes from 0.75 µm to 5.00 µm continuously across 102 distinct spectral channels.",
        "Surveys the whole sky every 6 months, creating precise multi-epoch baselines.",
        "",
        "The Critical Bottleneck: Billions of Raw Spectral Pixels",
        "Hundreds of gigabytes of FITS image tables in IRSA archive collections.",
        "Astronomers lack intuitive tools to rapidly visually compare epochs and flag subtle shifts.",
        "Slow-moving outer solar system targets get lost in static single-epoch surveys.",
        "",
        "The Astronomical Signal:",
        "Objects inside the solar system display detectable parallax and orbital velocity shifts",
        "against the static background of distant stars over a 6-month baseline."
    ], AMBER)

    add_speaker_note(s2, (
        "Why is Planet X still undiscovered after decades of searching? Because out at 400 astronomical units, "
        "reflected sunlight drops off as one over distance to the fourth power. That is 25 billion times fainter than Earth! "
        "Visible light surveys simply cannot see it. But physics gives us an answer: thermal emission. "
        "At 35 Kelvin, these bodies radiate their own heat in the near-infrared. NASA's SPHEREx mission captures this exact spectrum across 102 bands. "
        "However, that introduces a brand new problem: millions of raw FITS files locked in complex archives. "
        "Without fast, interactive differencing tools, these subtle moving signals remain buried in the noise."
    ))

    # =========================================================================
    # SLIDE 3: The Solution — PhotonX Live Application Walkthrough
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, 3, "The Solution — PhotonX",
               "Transforming SPHEREx Infrared Telemetry into Real-Time Discovery",
               "A high-performance GPU-accelerated web observatory built for interactive exploration and blinking.")

    # High-res Screenshot on Left
    ss_path1 = os.path.join("docs", "screenshots", "photonx.png")
    add_image_card(s3, ss_path1, Inches(0.8), Inches(1.9), Inches(5.8), Inches(4.3),
                   "PhotonX Live Viewport: Interactive Sky Engine, 102-Band Spectrum Plot, and Clyde Tombaugh Blink Comparator")

    # Feature callouts on Right
    c_w3 = Inches(5.6)
    c_h3 = Inches(5.0)
    add_card(s3, Inches(6.9), Inches(1.9), c_w3, c_h3, "ENGINEERING HIGHLIGHTS", [
        "1. Real-Time HTML5 Canvas Celestial Engine:",
        "Fluid navigation from 45° constellations down to 0.05° deep sky fields.",
        "Dynamic limiting magnitude (6.2 mv down to 18.0 mv faint limit).",
        "Accurate diffraction spikes and stellar classification (O through M & Y).",
        "",
        "2. Clyde Tombaugh Optical Blink Comparator:",
        "Press Spacebar or click to rapidly alternate between 6-month survey epochs.",
        "Exploits human retinal motion sensitivity to spot shifting centroids instantly.",
        "",
        "3. Live 102-Band Spectrophotometric Curves:",
        "Continuous 0.75 to 5.0 µm flux extraction for any selected pixel.",
        "Diagnostic absorption bands: Water Ice (1.4, 1.9 µm), CO (2.3 µm), CO₂ (4.27 µm).",
        "Instantly separates cold moving bodies from background red giants."
    ], CYAN)

    add_speaker_note(s3, (
        "Here is PhotonX in action. On the left is our real-time sky engine, running entirely in the browser. "
        "You can pan and zoom smoothly from broad constellation vistas all the way down to a 0.05-degree deep-sky tile. "
        "Instead of staring at a static picture, our timeline scrubber lets you move across 6-month survey epochs. "
        "With one tap of the spacebar, our Clyde Tombaugh blink engine alternates between epochs, making moving objects leap out at your eyes. "
        "And on the right panel, you get an instant 102-band spectrophotometric curve that reveals the physical ice composition of whatever you click."
    ))

    # =========================================================================
    # SLIDE 4: Image Differencing Pipeline
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, 4, "Automated Detection Engine",
               "Sub-Pixel Image Differencing & Centroid Isolation Pipeline",
               "How PhotonX automatically identifies moving candidates from multi-epoch survey tiles.")

    # High-res Screenshot on Left
    ss_path2 = os.path.join("docs", "screenshots", "diff_tab_active.png")
    add_image_card(s4, ss_path2, Inches(0.8), Inches(1.9), Inches(5.8), Inches(4.3),
                   "Pixel Differencing Engine: Residual heatmap and automatic candidate detection list")

    # Mathematical Pipeline on Right
    c_w4 = Inches(5.6)
    c_h4 = Inches(5.0)
    add_card(s4, Inches(6.9), Inches(1.9), c_w4, c_h4, "THE IMAGE SUBTRACTION PIPELINE: ΔI = IB - IA", [
        "Step 1: Coordinate & PSF Normalization",
        "WCS alignment matches field geometries and normalizes Point-Spread Functions.",
        "",
        "Step 2: Flux-Normalized Differencing",
        "Computes ΔI(x, y) = IB(x, y) - IA(x, y). Stationary stars cancel to zero.",
        "",
        "Step 3: Background Noise Evaluation (σ)",
        "Calculates robust local median and standard deviation across the subtraction tile.",
        "",
        "Step 4: Significance Thresholding (> 3σ)",
        "Isolates dipole signatures: negative residual at Epoch A, positive at Epoch B.",
        "",
        "Step 5: Centroid Clustering & Shift Vector",
        "Connected-component labeling computes sub-pixel RA/Dec centers, total shift in arcseconds, and position angle (θ)."
    ], AMBER)

    add_speaker_note(s4, (
        "Under the hood, PhotonX does not rely purely on the human eye; it runs a mathematically rigorous image differencing pipeline. "
        "When comparing two epochs, the system normalizes the point-spread functions and subtracts Epoch A from Epoch B. "
        "Stationary background stars cancel out completely. A moving object leaves a classic dipole: a dark negative residual at its old position "
        "and a bright positive residual at its new position. "
        "Our algorithm flags all clusters exceeding three sigma, computes the centroid shift in arcseconds, and ranks them as candidate solar system movers."
    ))

    # =========================================================================
    # SLIDE 5: NASA Telemetry & Seeing Observability
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, 5, "Multi-Mission Ecosystem",
               "Integrating Official NASA APIs with 3-Tier Seeing Intelligence",
               "Fusing space telescope telemetry with live weather conditions for ground follow-up.")

    # High-res Screenshot on Left
    ss_path3 = os.path.join("docs", "screenshots", "observability_radar.png")
    add_image_card(s5, ss_path3, Inches(0.8), Inches(1.9), Inches(5.8), Inches(4.3),
                   "Astronomical Seeing Radar: Target altitude, Pickering airmass, and atmospheric seeing disc")

    # API Integrations on Right
    c_w5 = Inches(5.6)
    c_h5 = Inches(5.0)
    add_card(s5, Inches(6.9), Inches(1.9), c_w5, c_h5, "LIVE DATA STACK & TELEMETRY", [
        "1. Primary Dataset: SPHEREx QR2 Survey",
        "Caltech/IPAC IRSA collection (DOI: 10.26131/IRSA629) with SIA2 query service.",
        "",
        "2. Live Official NASA APIs (Active Key Integrated):",
        "• NASA NeoWs: Real-time tracking of near-Earth asteroids and close approaches.",
        "• NASA DONKI: Live space weather monitoring (Coronal Mass Ejections & geomagnetic storms).",
        "• NASA APOD & EPIC: Daily astronomy imagery and 1.5M km DSCOVR Earth observations.",
        "",
        "3. 3-Tier Weather Intelligence (Meteomatics MCP Architecture):",
        "Meteomatics MCP → OpenWeather API → Open-Meteo astronomical seeing fallback.",
        "Computes Pickering Airmass: X = 1 / sin(alt).",
        "Estimates ground seeing disc in arcseconds (e.g. 1.8\") to verify optical follow-up feasibility."
    ], EMERALD)

    add_speaker_note(s5, (
        "Space science does not exist in isolation. PhotonX integrates a multi-mission NASA ecosystem. "
        "We tap directly into the Caltech/IPAC SPHEREx QR2 archive, but we also connect live NASA APIs using our registered key: "
        "tracking near-Earth asteroids through NeoWs, monitoring solar flares through DONKI, and cross-matching optical fields with NASA Goddard's SkyView. "
        "Furthermore, we built a 3-tier meteorological seeing radar. If you detect a candidate mover, PhotonX calculates the target's altitude, "
        "Pickering airmass, and atmospheric seeing in arcseconds, telling you whether ground telescopes can confirm the object tonight."
    ))

    # =========================================================================
    # SLIDE 6: Citizen Science & Classroom Discovery
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, 6, "Citizen Science & Impact",
               "Democratizing Deep Space Discovery for Students and Amateurs",
               "Turning passive readers into active contributors to planetary astrophysics.")

    # High-res Screenshot on Left
    ss_path4 = os.path.join("docs", "screenshots", "hunt_mode_active.png")
    add_image_card(s6, ss_path4, Inches(0.8), Inches(1.9), Inches(5.8), Inches(4.3),
                   "Hunt Mode Console: Candidate verification, hunter rank progression, and scientific brief generator")

    # Citizen Science Features on Right
    c_w6 = Inches(5.6)
    c_h6 = Inches(5.0)
    add_card(s6, Inches(6.9), Inches(1.9), c_w6, c_h6, "HUMAN-CENTERED IMPACT", [
        "1. Gamified Discovery Progression:",
        "Engages students and the public through progressive ranks:",
        "Rank 1: Infrared Tracker → Rank 2: Kuiper Belt Scout → Rank 3: Deep Space Pioneer.",
        "Transforms intimidating FITS tables into an engaging celestial quest.",
        "",
        "2. Citable Scientific Discovery Briefs:",
        "One-click export of formal Markdown observation reports.",
        "Contains exact RA/Dec coordinates, epoch baselines, shift in arcseconds, and observer notes.",
        "Directly cites primary data provenance: SPHEREx QR2 (DOI: 10.26131/IRSA629).",
        "",
        "3. Universal Zero-Install Accessibility:",
        "Runs on Chromebooks, tablets, and phones with zero software to install.",
        "Full keyboard navigation (T, Space, +, -, G, C, M) and Section 508 / WCAG compliance.",
        "Includes interactive guided Cosmic Tour for classrooms and beginners."
    ], CYAN)

    add_speaker_note(s6, (
        "The greatest strength of PhotonX is that it democratizes science. "
        "You do not need a supercomputer or a PhD in astrophysics to make a discovery. "
        "With Hunt Mode, a high school student in a classroom or an amateur astronomer at home can inspect authentic NASA data, "
        "tag an anomaly, and export a formal scientific discovery brief citing the official IRSA DOI. "
        "By eliminating installation barriers and gamifying candidate verification, we turn passive spectators into active planetary investigators."
    ))

    # =========================================================================
    # SLIDE 7: Future Scalability & Conclusion
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, 7, "The Road to Planet X",
               "From Space Apps Prototype to an Open Global Discovery Clearinghouse",
               "Scaling PhotonX across the full 2025–2027 SPHEREx mission timeline.")

    c_w7 = Inches(3.7)
    c_h7 = Inches(3.3)
    c_y7 = Inches(1.9)

    add_card(s7, Inches(0.8), c_y7, c_w7, c_h7, "1. FULL MISSION INGESTION", [
        "Ingest future SPHEREx data releases as surveys progress across 2025–2027.",
        "Multi-year baselines will dramatically amplify sensitivity to slow, distant trans-Neptunian objects.",
        "Automated background indexing across 450+ million stars."
    ], CYAN)

    add_card(s7, Inches(4.8), c_y7, c_w7, c_h7, "2. IN-BROWSER ORBIT FITTING", [
        "Integrate Gauss and Väisälä initial orbit determination algorithms in WebAssembly.",
        "Calculate semi-major axis (a), eccentricity (e), and inclination (i) from 3-epoch detections.",
        "Immediately distinguish Kuiper Belt objects from distant Oort Cloud candidates."
    ], AMBER)

    add_card(s7, Inches(8.8), c_y7, c_w7, c_h7, "3. ROBOTIC TELESCOPE RELAY", [
        "Connect candidate flags to automated robotic ground observatories via standard INDI/ASCOM protocols.",
        "Trigger immediate optical and infrared follow-up within hours of candidate detection.",
        "From satellite pixel to ground telescope trigger in one continuous workflow."
    ], EMERALD)

    # Closing Callout Box
    close_box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.4), Inches(11.733), Inches(1.5))
    close_box.fill.solid()
    close_box.fill.fore_color.rgb = CARD_BG
    close_box.line.color.rgb = CYAN
    close_box.line.width = Pt(1.5)

    close_tf = close_box.text_frame
    close_tf.word_wrap = True
    p_c1 = close_tf.paragraphs[0]
    p_c1.text = "“The next great discovery in our solar system could come from anyone looking at the infrared sky.”"
    p_c1.font.name = "Arial"
    p_c1.font.size = Pt(17)
    p_c1.font.bold = True
    p_c1.font.color.rgb = WHITE
    p_c1.alignment = PP_ALIGN.CENTER
    p_c1.space_after = Pt(8)

    p_c2 = close_tf.add_paragraph()
    p_c2.text = "Explore the Open Source Code: github.com/Mazonia/photonx   •   Live Web Observatory: mazonia.github.io/photonx"
    p_c2.font.name = "Arial"
    p_c2.font.size = Pt(13)
    p_c2.font.bold = True
    p_c2.font.color.rgb = CYAN
    p_c2.alignment = PP_ALIGN.CENTER

    add_speaker_note(s7, (
        "To conclude: PhotonX is ready today, but it is architected for the future. "
        "As SPHEREx continues to scan the sky across 2025 through 2027, longer time baselines will let us detect "
        "even slower and farther bodies. We plan to implement in-browser orbital fitting using WebAssembly, and automated relays "
        "to robotic ground telescopes worldwide. "
        "Planet X may be hiding in the dark, but with NASA's open infrared data and PhotonX, we now have the vision to find it. "
        "Thank you, judges, for your time and dedication to open science."
    ))

    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
