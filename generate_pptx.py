#!/usr/bin/env python3
"""
PhotonX Official Presentation Generator (.pptx)
================================================
Generates a clean, modern, simplified 16:9 widescreen PowerPoint presentation
using a refined, natural Avocado & Cream palette.
Strictly adheres to NASA Space Apps Challenge 2026 7-slide rule.
Focuses on: The Problem, The Proposed Solution, and Data/APIs Used.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="PhotonX_Official_Presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Refined Avocado & Warm Cream Palette
    BG_CREAM = RGBColor(250, 248, 242)      # #FAF8F2 Clean warm cream background
    CARD_WHITE = RGBColor(255, 255, 255)    # #FFFFFF Crisp card background
    CARD_BORDER = RGBColor(217, 228, 206)   # #D9E4CE Soft organic green border
    DARK_PEEL = RGBColor(24, 40, 24)        # #182818 Deep avocado skin (main text)
    OLIVE_BODY = RGBColor(52, 72, 50)       # #344832 Readable olive text
    MUTED_SAGE = RGBColor(108, 128, 102)    # #6C8066 Muted secondary text
    AVOCADO_GREEN = RGBColor(74, 124, 59)   # #4A7C3B Fresh primary avocado green
    AVOCADO_LIGHT = RGBColor(118, 158, 80)  # #769E50 Light avocado accent
    SEED_OCHRE = RGBColor(184, 125, 25)     # #B87D19 Warm seed ochre accent
    TINT_GUAC = RGBColor(240, 246, 234)     # #F0F6EA Subtle soft guacamole tint

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_CREAM
        bg.line.color.rgb = BG_CREAM
        return bg

    def add_header(slide, slide_num, category, title, subtitle=""):
        # Category Tracker
        tb_cat = slide.shapes.add_textbox(Inches(0.9), Inches(0.4), Inches(11.5), Inches(0.35))
        p_cat = tb_cat.text_frame.paragraphs[0]
        p_cat.text = f"SLIDE {slide_num:02d} / 07   •   {category.upper()}   •   NASA SPACE APPS 2026"
        p_cat.font.name = "Arial"
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = AVOCADO_GREEN

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.9), Inches(0.72), Inches(11.5), Inches(0.65))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.name = "Arial"
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = DARK_PEEL

        # Subtitle
        if subtitle:
            tb_sub = slide.shapes.add_textbox(Inches(0.9), Inches(1.35), Inches(11.5), Inches(0.4))
            p_sub = tb_sub.text_frame.paragraphs[0]
            p_sub.text = subtitle
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(13)
            p_sub.font.color.rgb = MUTED_SAGE

    def add_card(slide, left, top, width, height, title, body_bullets, accent_color=AVOCADO_GREEN, bg_color=CARD_WHITE):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.2)

        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p_title = tf.paragraphs[0]
        p_title.text = title
        p_title.font.name = "Arial"
        p_title.font.size = Pt(15)
        p_title.font.bold = True
        p_title.font.color.rgb = accent_color
        p_title.space_after = Pt(10)

        for b in body_bullets:
            p_b = tf.add_paragraph()
            p_b.text = f"•  {b}"
            p_b.font.name = "Arial"
            p_b.font.size = Pt(12)
            p_b.font.color.rgb = OLIVE_BODY
            p_b.space_after = Pt(6)
        return card

    def add_image_card(slide, img_path, left, top, width, height, caption=""):
        frame = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left - Inches(0.04), top - Inches(0.04), width + Inches(0.08), height + Inches(0.08))
        frame.fill.solid()
        frame.fill.fore_color.rgb = CARD_WHITE
        frame.line.color.rgb = CARD_BORDER
        frame.line.width = Pt(1.5)

        if os.path.exists(img_path):
            slide.shapes.add_picture(img_path, left, top, width, height)

        if caption:
            tb = slide.shapes.add_textbox(left, top + height + Inches(0.05), width, Inches(0.3))
            p = tb.text_frame.paragraphs[0]
            p.text = caption
            p.font.name = "Arial"
            p.font.size = Pt(9.5)
            p.font.color.rgb = MUTED_SAGE
            p.alignment = PP_ALIGN.CENTER

    def add_speaker_note(slide, note_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = note_text

    # =========================================================================
    # SLIDE 1: Title & Mandatory NASA Metadata
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Mission Tag
    tag_box = s1.shapes.add_textbox(Inches(0.9), Inches(1.1), Inches(11.5), Inches(0.4))
    p_tag = tag_box.text_frame.paragraphs[0]
    p_tag.text = "NASA INTERNATIONAL SPACE APPS CHALLENGE 2026"
    p_tag.font.name = "Arial"
    p_tag.font.size = Pt(12)
    p_tag.font.bold = True
    p_tag.font.color.rgb = SEED_OCHRE

    # Title
    t_box = s1.shapes.add_textbox(Inches(0.9), Inches(1.5), Inches(11.5), Inches(1.2))
    p_t = t_box.text_frame.paragraphs[0]
    p_t.text = "PHOTONX"
    p_t.font.name = "Arial"
    p_t.font.size = Pt(62)
    p_t.font.bold = True
    p_t.font.color.rgb = DARK_PEEL

    # Subtitle
    sub_box = s1.shapes.add_textbox(Inches(0.9), Inches(2.75), Inches(11.5), Inches(0.6))
    p_sub = sub_box.text_frame.paragraphs[0]
    p_sub.text = "Interactive SPHEREx Infrared Sky Browser & Outer Solar System Discovery Engine"
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(19)
    p_sub.font.color.rgb = AVOCADO_GREEN

    # Simple 3-Card Metadata Grid (NASA Requirement Compliance)
    c_w = Inches(3.6)
    c_h = Inches(2.4)
    c_y = Inches(3.7)

    add_card(s1, Inches(0.9), c_y, c_w, c_h, "CREATOR & TEAM", [
        "Team: PhotonX",
        "Participant: Mazonia (Solo)",
        "Role: Full-Stack Developer",
        "Open Source: MIT License"
    ], AVOCADO_GREEN)

    add_card(s1, Inches(4.85), c_y, c_w, c_h, "CHALLENGE SELECTED", [
        "Challenge: Planet X and SPHEREx",
        "Target: Moving solar system bodies",
        "Wavelength: 0.75 to 5.0 µm Near-IR",
        "Cadence: 6-Month Survey Passes"
    ], SEED_OCHRE, TINT_GUAC)

    add_card(s1, Inches(8.8), c_y, c_w, c_h, "ACCESS & DATA", [
        "Primary Data: SPHEREx QR2",
        "DOI: 10.26131/IRSA629 (IPAC)",
        "Code: github.com/Mazonia/photonx",
        "Live App: mazonia.github.io/photonx"
    ], AVOCADO_GREEN)

    # Clean bottom note
    f_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(6.4), Inches(11.5), Inches(0.5))
    f_box.fill.solid()
    f_box.fill.fore_color.rgb = CARD_WHITE
    f_box.line.color.rgb = CARD_BORDER
    p_f = f_box.text_frame.paragraphs[0]
    p_f.text = "Strict 7-Slide Rule  •  Zero Installation Web Platform  •  All Content in English  •  Public & Free Access"
    p_f.font.name = "Arial"
    p_f.font.size = Pt(10)
    p_f.font.color.rgb = MUTED_SAGE
    p_f.alignment = PP_ALIGN.CENTER

    add_speaker_note(s1, (
        "Hello judges. My name is Mazonia representing Team PhotonX. Today I'm presenting our solution "
        "for the Planet X and SPHEREx challenge. PhotonX is an interactive, browser-based celestial observatory "
        "that turns NASA's massive 102-band SPHEREx infrared data into an intuitive tool for discovering "
        "moving outer solar system objects."
    ))

    # =========================================================================
    # SLIDE 2: The Problem
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, 2, "The Problem",
               "Why Are the Outer Solar System's Giants Still Missing?",
               "The physics of distant illumination and the challenge of massive raw spectral datasets.")

    c_w2 = Inches(5.6)
    c_h2 = Inches(4.9)
    c_y2 = Inches(1.9)

    add_card(s2, Inches(0.9), c_y2, c_w2, c_h2, "1. THE OPTICAL ILLUMINATION COLLAPSE", [
        "Sunlight drops off with distance squared out and back: Flux ∝ 1/r⁴.",
        "At 400 AU (Planet X distance), sunlight is 25 billion times dimmer than on Earth.",
        "A Neptune-mass planet is dimmer than magnitude V ≈ 23.5, completely black in optical surveys.",
        "However, even at 35 Kelvin, these bodies radiate thermal near-infrared light (1 to 5 µm)."
    ], AVOCADO_GREEN)

    add_card(s2, Inches(6.8), c_y2, c_w2, c_h2, "2. THE DATA FLOOD BOTTLENECK", [
        "NASA's SPHEREx mission is mapping the entire sky in 102 spectral bands every 6 months.",
        "This produces millions of complex, multi-extension FITS files locked in research archives.",
        "Astronomers and students have lacked fast, visual tools to compare epochs and spot motion.",
        "Subtle moving objects remain buried in static tables without interactive differencing."
    ], SEED_OCHRE, TINT_GUAC)

    add_speaker_note(s2, (
        "Why haven't we found Planet X yet? Because out at 400 AU, reflected sunlight is 25 billion times fainter than on Earth. "
        "Optical surveys like Hubble or Gaia only see dark space. But in the thermal infrared, these cold bodies glow. "
        "NASA's SPHEREx mission captures this exact light across 102 bands. However, that creates a new problem: "
        "billions of raw spectral pixels locked in complex FITS files that are nearly impossible for humans to visually explore."
    ))

    # =========================================================================
    # SLIDE 3: The Proposed Solution: PhotonX
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, 3, "Our Solution",
               "PhotonX: Interactive SPHEREx Sky Browser & Discovery Engine",
               "A fast, zero-install web observatory that turns raw FITS files into instant discoveries.")

    # High-res Screenshot on Left
    ss_path1 = os.path.join("docs", "screenshots", "photonx.png")
    add_image_card(s3, ss_path1, Inches(0.9), Inches(1.9), Inches(5.6), Inches(4.3),
                   "PhotonX UI: Interactive Celestial Engine, 102-Band Spectrum Graph, and Scrubber")

    # Features on Right
    add_card(s3, Inches(6.8), Inches(1.9), Inches(5.6), Inches(4.9), "WHAT PHOTONX PROVIDES", [
        "Interactive GPU Sky Engine:",
        "Pan and zoom smoothly across celestial coordinates (RA/Dec) from full constellations down to 0.05° deep sky fields.",
        "",
        "Cosmic Worlds Navigator:",
        "1-click navigation across Solar System planets (Mars, Jupiter, Saturn, Pluto), habitable exoworlds (TRAPPIST-1, Proxima b), and all 88 constellations.",
        "",
        "Clyde Tombaugh Blink Comparator:",
        "Press Spacebar to rapidly alternate between 6-month survey epochs. Moving bodies leap off the screen to the human eye.",
        "",
        "Instant 102-Band Spectrophotometry:",
        "Click any object to plot its full 0.75–5.0 µm curve, diagnosing water ice (1.4 µm), CO (2.3 µm), and CO₂ ice (4.27 µm)."
    ], AVOCADO_GREEN)

    add_speaker_note(s3, (
        "PhotonX is our solution. It runs directly in the browser with zero installation. "
        "Users can pan and zoom through the infrared cosmos, or use our Cosmic Worlds Navigator to jump to planets and exoworlds. "
        "With one tap of the spacebar, our Clyde Tombaugh blink engine alternates between 6-month survey passes, making moving objects stand out immediately. "
        "And clicking any point instantly plots a 102-channel spectrophotometric curve that reveals the body's ice composition."
    ))

    # =========================================================================
    # SLIDE 4: How We Spot Motion (Differencing Pipeline)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, 4, "How It Works",
               "Automated Mover Detection & Pixel Differencing",
               "Sub-pixel image differencing that cancels fixed stars to isolate moving centroids.")

    # Screenshot on Left
    ss_path2 = os.path.join("docs", "screenshots", "diff_tab_active.png")
    add_image_card(s4, ss_path2, Inches(0.9), Inches(1.9), Inches(5.6), Inches(4.3),
                   "Image Difference Engine: Subtraction residuals and automated mover candidate list")

    # Pipeline on Right
    add_card(s4, Inches(6.8), Inches(1.9), Inches(5.6), Inches(4.9), "THE 3-STEP DIFFERENCING PIPELINE", [
        "1. Align & Normalize Flux:",
        "Matches WCS coordinates and normalizes Point-Spread Functions (PSFs) between Epoch A and Epoch B (separated by 6 months).",
        "",
        "2. Subtract Matrices (ΔI = IB - IA):",
        "Stationary background stars cancel to zero. A moving object leaves a classic dipole: negative at old position, positive at new.",
        "",
        "3. Threshold (> 3σ) & Vector Calculation:",
        "Automated clustering isolates significant residuals, computes the exact centroid shift in arcseconds, and logs candidates."
    ], SEED_OCHRE, TINT_GUAC)

    add_speaker_note(s4, (
        "Under the hood, PhotonX runs a mathematical image subtraction pipeline. "
        "When comparing two survey epochs, the engine normalizes the fields and subtracts Epoch A from Epoch B. "
        "Stationary stars cancel out completely. Moving objects leave a distinct signature. "
        "Our algorithm flags all peaks exceeding three sigma, computes their positional shift in arcseconds, and ranks them for follow-up."
    ))

    # =========================================================================
    # SLIDE 5: NASA Data & APIs Used
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, 5, "Data & APIs Used",
               "Grounding Every Discovery in Verified NASA Telemetry",
               "Fusing space mission infrared datasets with live NASA APIs and atmospheric seeing.")

    c_w5 = Inches(5.6)
    c_h5 = Inches(2.35)

    add_card(s5, Inches(0.9), Inches(1.9), c_w5, c_h5, "1. NASA SPHEREx QR2 SURVEY", [
        "Caltech/IPAC Infrared Science Archive (IRSA)",
        "DOI: 10.26131/IRSA629 • IVOA SIA2 query interface",
        "102 continuous near-infrared bands (0.75–5.00 µm)",
        "6-month all-sky survey cadences (2025–2026)"
    ], AVOCADO_GREEN)

    add_card(s5, Inches(6.8), Inches(1.9), c_w5, c_h5, "2. LIVE NASA OPEN APIS (api.nasa.gov)", [
        "Integrated using verified NASA developer API key:",
        "• NASA NeoWs: Live tracking of near-Earth asteroids",
        "• NASA DONKI: Real-time space weather (CMEs & flares)",
        "• NASA APOD: Astronomy Picture of the Day"
    ], SEED_OCHRE, TINT_GUAC)

    add_card(s5, Inches(0.9), Inches(4.45), c_w5, c_h5, "3. NASA GODDARD SKYVIEW", [
        "NASA Goddard Space Flight Center Virtual Observatory",
        "Multi-mission optical & infrared cross-matching",
        "DSS2 (Optical), 2MASS (Near-IR), and WISE (Mid-IR)",
        "Validates infrared discoveries against visible surveys"
    ], AVOCADO_GREEN)

    add_card(s5, Inches(6.8), Inches(4.45), c_w5, c_h5, "4. ATMOSPHERIC OBSERVABILITY RADAR", [
        "3-Tier Weather Intelligence (Meteomatics + OpenWeather)",
        "Pickering Airmass calculation: X = 1 / sin(alt)",
        "Estimates ground atmospheric seeing disc (arcsec)",
        "Tells astronomers if conditions permit optical follow-up"
    ], AVOCADO_GREEN)

    add_speaker_note(s5, (
        "PhotonX is deeply rooted in NASA data. Our primary dataset is the Caltech/IPAC SPHEREx QR2 survey across 102 infrared bands. "
        "We also integrate live NASA APIs using our registered developer key: monitoring near-Earth asteroids through NeoWs and solar storms through DONKI. "
        "And we cross-reference NASA Goddard's SkyView optical surveys alongside a 3-tier seeing radar that tells astronomers if ground telescopes can follow up tonight."
    ))

    # =========================================================================
    # SLIDE 6: Citizen Science & Educational Impact
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, 6, "Citizen Science",
               "Democratizing Deep Space Discovery for Everyone",
               "Turning students and amateur astronomers into active contributors to NASA science.")

    # Screenshot on Left
    ss_path3 = os.path.join("docs", "screenshots", "hunt_mode_active.png")
    add_image_card(s6, ss_path3, Inches(0.9), Inches(1.9), Inches(5.6), Inches(4.3),
                   "Hunt Mode: Candidate tagging, hunter ranks, and scientific brief generator")

    # Highlights on Right
    add_card(s6, Inches(6.8), Inches(1.9), Inches(5.6), Inches(4.9), "HUMAN-CENTERED DISCOVERY", [
        "Gamified Hunter Ranks:",
        "Progression from Infrared Tracker → Kuiper Belt Scout → Deep Space Pioneer turns data exploration into an exciting quest.",
        "",
        "1-Click Scientific Observation Briefs:",
        "Exports clean Markdown reports with exact coordinates, epoch baselines, and arcsecond shift, directly citing IRSA DOI 10.26131/IRSA629.",
        "",
        "Universal Classroom Accessibility:",
        "Runs on Chromebooks, tablets, and phones with zero installation. Full keyboard navigation and WCAG AA accessible."
    ], AVOCADO_GREEN)

    add_speaker_note(s6, (
        "Great science should be accessible to everyone. With Hunt Mode, a student in a classroom or an amateur astronomer at home "
        "can examine authentic NASA data, tag a moving candidate, and export a formal scientific discovery brief citing the official IRSA DOI. "
        "By removing installation friction and gamifying candidate verification, we turn spectators into active planetary investigators."
    ))

    # =========================================================================
    # SLIDE 7: Summary & What's Next
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, 7, "Summary & Vision",
               "From Space Apps Prototype to Global Discovery Network",
               "Scaling PhotonX across the full 2025–2027 SPHEREx mission timeline.")

    c_w7 = Inches(3.6)
    c_h7 = Inches(3.3)
    c_y7 = Inches(1.9)

    add_card(s7, Inches(0.9), c_y7, c_w7, c_h7, "1. FULL SURVEY INGESTION", [
        "Ingest future SPHEREx public releases across 2025–2027.",
        "Multi-year baselines will dramatically boost sensitivity to ultra-slow, distant TNOs.",
        "Automated indexing across 450M cataloged stars."
    ], AVOCADO_GREEN)

    add_card(s7, Inches(4.85), c_y7, c_w7, c_h7, "2. IN-BROWSER ORBIT FITTING", [
        "Implement Gauss & Väisälä orbit determination in WebAssembly.",
        "Compute semi-major axis (a) and eccentricity (e) from 3 epochs.",
        "Instantly distinguish Kuiper Belt objects from Oort Cloud candidates."
    ], SEED_OCHRE, TINT_GUAC)

    add_card(s7, Inches(8.8), c_y7, c_w7, c_h7, "3. ROBOTIC TELESCOPE ALERTS", [
        "Connect candidate flags to automated robotic telescopes worldwide via INDI/ASCOM.",
        "Trigger immediate optical and infrared ground follow-up.",
        "From satellite pixel to ground telescope trigger."
    ], AVOCADO_GREEN)

    # Closing Callout Box
    close_box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(5.4), Inches(11.5), Inches(1.5))
    close_box.fill.solid()
    close_box.fill.fore_color.rgb = CARD_WHITE
    close_box.line.color.rgb = AVOCADO_GREEN
    close_box.line.width = Pt(1.5)

    close_tf = close_box.text_frame
    close_tf.word_wrap = True
    p_c1 = close_tf.paragraphs[0]
    p_c1.text = "“The next great discovery in our solar system could come from anyone looking at the infrared sky.”"
    p_c1.font.name = "Arial"
    p_c1.font.size = Pt(17)
    p_c1.font.bold = True
    p_c1.font.color.rgb = DARK_PEEL
    p_c1.alignment = PP_ALIGN.CENTER
    p_c1.space_after = Pt(8)

    p_c2 = close_tf.add_paragraph()
    p_c2.text = "Explore the Code: github.com/Mazonia/photonx   •   Live Web App: mazonia.github.io/photonx"
    p_c2.font.name = "Arial"
    p_c2.font.size = Pt(13)
    p_c2.font.bold = True
    p_c2.font.color.rgb = AVOCADO_GREEN
    p_c2.alignment = PP_ALIGN.CENTER

    add_speaker_note(s7, (
        "To conclude: PhotonX is ready today, but it is architected for the future. "
        "As SPHEREx continues its survey over 2025 through 2027, longer time baselines will let us detect "
        "even slower and farther bodies. Planet X may be hiding in the dark, but with NASA's open infrared data and PhotonX, "
        "we now have the light to find it. Thank you judges for your time and consideration."
    ))

    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
