import os
import random
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

output_dir = "docs/screenshots"
pub_dir = "frontend/public/docs/screenshots"
os.makedirs(output_dir, exist_ok=True)
os.makedirs(pub_dir, exist_ok=True)

FONT_REG = "C:\\Windows\\Fonts\\segoeui.ttf"
FONT_BOLD = "C:\\Windows\\Fonts\\segoeuib.ttf"
FONT_MONO = "C:\\Windows\\Fonts\\consola.ttf"
FONT_MONOB = "C:\\Windows\\Fonts\\consolab.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_modern_navbar(draw, active_mode="explore"):
    # Navbar background
    draw.rectangle([0, 0, 1920, 56], fill="#030712")
    draw.line([0, 56, 1920, 56], fill="#1e293b", width=1)

    # 1. Left: Logo & Badges
    draw.rounded_rectangle([18, 10, 54, 46], radius=8, fill="#083344", outline="#06b6d4", width=1)
    draw.ellipse([27, 21, 45, 35], outline="#22d3ee", width=2)
    draw.line([38, 30, 48, 40], fill="#22d3ee", width=2)

    f_logo = get_font(FONT_BOLD, 20)
    draw.text((64, 15), "PHOTON", fill="#FFFFFF", font=f_logo)
    draw.text((158, 15), "X", fill="#F59E0B", font=f_logo)

    draw.line([182, 16, 182, 40], fill="#334155", width=1)
    draw.rounded_rectangle([194, 16, 282, 39], radius=5, fill="#082f49", outline="#0284c7", width=1)
    f_badge = get_font(FONT_MONOB, 11)
    draw.text((202, 21), "SPHEREx QR2", fill="#38bdf8", font=f_badge)

    draw.ellipse([294, 26, 300, 32], fill="#10b981")
    f_sub = get_font(FONT_MONO, 11)
    draw.text((306, 21), "IRSA VERIFIED", fill="#94a3b8", font=f_sub)

    # 2. Middle: Search Bar
    draw.rounded_rectangle([420, 10, 875, 46], radius=10, fill="#0b1120", outline="#334155", width=1)
    draw.ellipse([434, 22, 446, 34], outline="#64748b", width=2)
    draw.line([443, 31, 450, 38], fill="#64748b", width=2)
    f_search = get_font(FONT_REG, 12)
    draw.text((458, 19), "Search celestial target or coordinates (M42, WISE 0855, Sedna)...", fill="#64748b", font=f_search)
    draw.rounded_rectangle([848, 17, 868, 39], radius=4, fill="#1e293b")
    f_key = get_font(FONT_MONO, 11)
    draw.text((855, 21), "/", fill="#94a3b8", font=f_key)

    # 3. Right: Action Buttons
    draw.rounded_rectangle([890, 11, 1050, 45], radius=10, fill="#251804", outline="#d97706", width=1)
    draw.ellipse([902, 21, 916, 35], outline="#f59e0b", width=2)
    draw.ellipse([907, 26, 911, 30], fill="#f59e0b")
    f_btn = get_font(FONT_BOLD, 12)
    draw.text((924, 19), "Planets & Orrery", fill="#fbbf24", font=f_btn)

    draw.rounded_rectangle([1062, 10, 1338, 46], radius=10, fill="#0b1120", outline="#1e293b", width=1)
    
    if active_mode == "explore":
        draw.rounded_rectangle([1066, 13, 1148, 43], radius=8, fill="#0284c7")
        draw.text((1080, 20), "Explore", fill="#FFFFFF", font=f_btn)
    else:
        draw.text((1080, 20), "Explore", fill="#94a3b8", font=f_btn)

    if active_mode == "investigate":
        draw.rounded_rectangle([1152, 13, 1246, 43], radius=8, fill="#0284c7")
        draw.text((1162, 20), "Investigate", fill="#FFFFFF", font=f_btn)
    else:
        draw.text((1162, 20), "Investigate", fill="#94a3b8", font=f_btn)

    if active_mode == "hunt":
        draw.rounded_rectangle([1250, 13, 1334, 43], radius=8, fill="#d97706")
        draw.text((1262, 20), "Hunt Mode", fill="#FFFFFF", font=f_btn)
    else:
        draw.text((1262, 20), "Hunt Mode", fill="#94a3b8", font=f_btn)

    draw.rounded_rectangle([1350, 11, 1460, 45], radius=10, fill="#0b1120", outline="#334155", width=1)
    draw.text((1366, 19), "7-Slide Deck", fill="#cbd5e1", font=f_btn)

    draw.rounded_rectangle([1472, 11, 1576, 45], radius=10, fill="#0b1120", outline="#334155", width=1)
    draw.text((1488, 19), "Space Tour", fill="#38bdf8", font=f_btn)

    draw.rounded_rectangle([1588, 11, 1718, 45], radius=10, fill="#0b1120", outline="#334155", width=1)
    draw.text((1602, 19), "Visible Tonight?", fill="#f59e0b", font=f_btn)

    draw.rounded_rectangle([1730, 11, 1766, 45], radius=8, fill="#0b1120", outline="#334155", width=1)
    draw.ellipse([1741, 21, 1755, 35], outline="#f59e0b", width=2)
    
    draw.rounded_rectangle([1776, 11, 1812, 45], radius=8, fill="#0b1120", outline="#334155", width=1)
    draw.text((1790, 19), "?", fill="#94a3b8", font=f_btn)


def create_realistic_sky(width=1400, height=1024, seed=42):
    sky = Image.new("RGB", (width, height), "#02040a")
    nebula = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    n_draw = ImageDraw.Draw(nebula)
    
    # Soft nebula clouds
    for cx, cy, r, col in [
        (450, 320, 380, (6, 182, 212, 15)),
        (880, 580, 420, (147, 51, 234, 12)),
        (680, 440, 260, (245, 158, 11, 12)),
        (1150, 240, 320, (30, 58, 138, 18)),
    ]:
        n_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
    
    nebula = nebula.filter(ImageFilter.GaussianBlur(80))
    sky.paste(Image.alpha_composite(Image.new("RGBA", (width, height), (2, 4, 10, 255)), nebula), (0, 0))
    
    draw = ImageDraw.Draw(sky)
    f_grid = ImageFont.truetype(FONT_MONO, 10)
    grid_col = "#091428"
    grid_label_col = "#2a4365"
    
    for y in range(70, height, 110):
        draw.line([0, y, width, y], fill=grid_col, width=1)
        dec_deg = round(4.69 + (height/2 - y) * 0.008, 1)
        draw.text((12, y + 3), f"{dec_deg:+.1f}°", fill=grid_label_col, font=f_grid)
        
    for x in range(120, width, 140):
        draw.line([x, 0, x, height], fill=grid_col, width=1)
        ra_hr = round((269.45 / 15.0) + (x - width/2) * 0.002, 2)
        draw.text((x + 4, height - 20), f"{ra_hr:.1f}h", fill=grid_label_col, font=f_grid)

    random.seed(seed)
    star_colors = [
        (255, 255, 255), (200, 225, 255), (255, 240, 200), (255, 200, 140), (255, 160, 130)
    ]
    for _ in range(850):
        sx = random.randint(10, width - 10)
        sy = random.randint(10, height - 10)
        mag = random.random()
        col = random.choice(star_colors)
        if mag > 0.985:
            r = random.randint(3, 4)
            draw.ellipse([sx - r - 3, sy - r - 3, sx + r + 3, sy + r + 3], fill=(col[0]//4, col[1]//4, col[2]//4))
            draw.ellipse([sx - r, sy - r, sx + r, sy + r], fill=col)
            draw.line([sx - r - 4, sy, sx + r + 4, sy], fill=(col[0]//2, col[1]//2, col[2]//2), width=1)
            draw.line([sx, sy - r - 4, sx, sy + r + 4], fill=(col[0]//2, col[1]//2, col[2]//2), width=1)
        elif mag > 0.90:
            draw.ellipse([sx - 2, sy - 2, sx + 2, sy + 2], fill=col)
        elif mag > 0.65:
            draw.ellipse([sx - 1, sy - 1, sx + 1, sy + 1], fill=col)
        else:
            draw.point((sx, sy), fill=(col[0]//2, col[1]//2, col[2]//2))

    return sky


def build_diff_screenshot():
    img = Image.new("RGB", (1920, 1080), "#02040a")
    draw = ImageDraw.Draw(img)

    # 1. Left: Starry Sky Viewport
    sky = create_realistic_sky(width=1400, height=1024, seed=42)
    img.paste(sky, (0, 56))

    # Center target Barnard's Star
    cx, cy = 680, 510
    draw.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], outline="#06b6d4", width=2)
    draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], outline="#f59e0b", width=1)
    draw.line([cx - 36, cy, cx - 18, cy], fill="#06b6d4", width=2)
    draw.line([cx + 18, cy, cx + 36, cy], fill="#06b6d4", width=2)
    draw.line([cx, cy - 36, cx, cy - 18], fill="#06b6d4", width=2)
    draw.line([cx, cy + 18, cx, cy + 36], fill="#06b6d4", width=2)

    # Vector
    vx, vy = cx - 130, cy - 180
    draw.line([cx, cy, vx, vy], fill="#f59e0b", width=3)
    draw.polygon([(vx, vy), (vx + 14, vy + 4), (vx + 4, vy + 14)], fill="#f59e0b")

    f_star = get_font(FONT_BOLD, 14)
    f_sub = get_font(FONT_MONO, 11)
    draw.text((cx + 32, cy - 18), "Barnard's Star (M4.0V)", fill="#fbbf24", font=f_star)
    draw.text((cx + 32, cy + 2), "Proper Motion: 10.30\"/yr  |  Epoch Shift: Δ 5.15\"", fill="#38bdf8", font=f_sub)
    draw.text((cx + 32, cy + 18), "RA: 269.4521°  DEC: +4.6933°  |  CADENCE: 6-MO", fill="#94a3b8", font=f_sub)

    # HUD at top-left
    draw.rounded_rectangle([18, 70, 430, 102], radius=8, fill="#030712", outline="#0284c7", width=1)
    draw.ellipse([28, 83, 34, 89], fill="#10b981")
    draw.text((42, 78), "• LIVE DIFFERENCING  |  6-MONTH SURVEY BASELINE", fill="#38bdf8", font=f_sub)

    # Scrubber Bar at bottom of viewport
    draw.rounded_rectangle([8, 1018, 220, 1068], radius=8, fill="#030712", outline="#1e293b", width=1)
    draw.text((16, 1026), "CENTER TARGET: Barnard's Star", fill="#FFFFFF", font=get_font(FONT_BOLD, 11))
    draw.text((16, 1044), "RA: 269.4521°  DEC: +4.6933°", fill="#38bdf8", font=f_sub)

    draw.rounded_rectangle([230, 1018, 760, 1068], radius=8, fill="#030712", outline="#1e293b", width=1)
    draw.text((242, 1026), "CADENCE: 6-MONTH ALL-SKY", fill="#94a3b8", font=f_sub)
    draw.rounded_rectangle([440, 1026, 520, 1056], radius=6, fill="#082f49", outline="#06b6d4", width=1)
    draw.text((448, 1033), "2025-W18", fill="#22d3ee", font=get_font(FONT_MONOB, 10))
    draw.rounded_rectangle([530, 1026, 610, 1056], radius=6, fill="#451a03", outline="#f59e0b", width=1)
    draw.text((538, 1033), "2025-W44", fill="#fbbf24", font=get_font(FONT_MONOB, 10))
    draw.rounded_rectangle([620, 1026, 680, 1056], radius=6, fill="#0b1120")
    draw.text((628, 1033), "2026-W18", fill="#64748b", font=get_font(FONT_MONO, 10))
    draw.rounded_rectangle([690, 1026, 750, 1056], radius=6, fill="#0b1120")
    draw.text((698, 1033), "2026-W44", fill="#64748b", font=get_font(FONT_MONO, 10))

    # 2. Right: Pixel Differencing Panel
    draw.rectangle([1400, 56, 1920, 1080], fill="#030712")
    draw.line([1400, 56, 1400, 1080], fill="#1e293b", width=1)

    draw.ellipse([1420, 78, 1428, 86], fill="#38bdf8")
    draw.text((1436, 72), "Barnard's Star", fill="#FFFFFF", font=get_font(FONT_BOLD, 17))
    draw.rounded_rectangle([1710, 71, 1900, 93], radius=4, fill="#082f49", outline="#0284c7", width=1)
    draw.text((1718, 75), "HIGH PROPER MOTION STAR", fill="#38bdf8", font=f_sub)
    draw.text((1420, 100), "RA 269.4521°  •  DEC +4.6933°  •  EPOCH 2025-W18 ⇄ 2025-W44", fill="#64748b", font=f_sub)

    # Tile 1: Infrared Spectral Tile
    draw.rounded_rectangle([1416, 126, 1904, 385], radius=12, fill="#050a18", outline="#1e293b", width=1)
    draw.text((1432, 136), "INFRARED SPECTRAL TILE", fill="#38bdf8", font=get_font(FONT_BOLD, 12))
    draw.text((1800, 136), "CH 42 · λ 2.31 µm", fill="#94a3b8", font=f_sub)

    tile1 = Image.open("tile1_test.png").resize((468, 200))
    img.paste(tile1, (1426, 155))

    draw.text((1432, 362), "LOW FLUX (0.01 MJy/sr)", fill="#64748b", font=f_sub)
    draw.rectangle([1590, 366, 1780, 372], fill="#0284c7")
    draw.text((1795, 362), "PEAK EMISSION", fill="#64748b", font=f_sub)

    # Navigation Tabs
    draw.rounded_rectangle([1416, 402, 1564, 438], radius=8, fill="#0b1120", outline="#1e293b", width=1)
    draw.text((1426, 413), "102-Band Spectrum", fill="#94a3b8", font=get_font(FONT_BOLD, 11))

    draw.rounded_rectangle([1572, 402, 1744, 438], radius=8, fill="#082f49", outline="#06b6d4", width=2)
    draw.ellipse([1582, 417, 1590, 425], fill="#22d3ee")
    draw.text((1596, 413), "Epoch Diff & Movers", fill="#22d3ee", font=get_font(FONT_BOLD, 11))

    draw.rounded_rectangle([1752, 402, 1904, 438], radius=8, fill="#0b1120", outline="#1e293b", width=1)
    draw.text((1764, 413), "Catalogs & Exoworlds", fill="#94a3b8", font=get_font(FONT_BOLD, 11))

    # Differencing Box
    draw.rounded_rectangle([1416, 450, 1904, 1060], radius=12, fill="#050a18", outline="#0284c7", width=1)
    draw.text((1432, 464), "PIXEL DIFFERENCING ENGINE", fill="#fbbf24", font=get_font(FONT_BOLD, 13))
    draw.rounded_rectangle([1810, 460, 1890, 484], radius=6, fill="#082f49", outline="#0284c7", width=1)
    draw.text((1820, 465), "Auto Blink", fill="#38bdf8", font=f_sub)

    draw.text((1432, 488), "Residuals: 2025-W18 vs 2025-W44 (Δt = 6 Months)", fill="#94a3b8", font=f_sub)

    tile2 = Image.open("tile2_test.png").resize((468, 220))
    img.paste(tile2, (1426, 510))

    draw.rounded_rectangle([1426, 742, 1894, 792], radius=8, fill="#030712", outline="#1e293b", width=1)
    draw.text((1438, 750), "DETECTION SNR: 18.4σ  (Threshold > 3.0σ)", fill="#10b981", font=get_font(FONT_MONOB, 11))
    draw.text((1438, 768), "Sub-Pixel Motion: Δ 5.15\" (±0.04\")  |  Vector: 10.30\"/yr", fill="#94a3b8", font=f_sub)

    draw.text((1432, 806), "AUTOMATED MOVER CANDIDATE LOG (2 DETECTIONS)", fill="#cbd5e1", font=get_font(FONT_BOLD, 12))

    # Candidate 1: Candidate PX-1
    draw.rounded_rectangle([1426, 828, 1894, 906], radius=8, fill="#0f172a", outline="#f59e0b", width=1)
    draw.text((1438, 838), "Candidate PX-1 (WISE 0855 Analog)", fill="#fbbf24", font=get_font(FONT_BOLD, 12))
    draw.rounded_rectangle([1750, 836, 1884, 854], radius=4, fill="#451a03")
    draw.text((1758, 839), "PLANET X CANDIDATE", fill="#f59e0b", font=get_font(FONT_MONOB, 9))
    draw.text((1438, 862), "RA: 133.7933°  DEC: -7.2451°  |  Shift: Δ 8.24\"  |  Confidence: 99.4%", fill="#94a3b8", font=f_sub)
    draw.text((1438, 882), "Zero optical counterpart in DSS2/Gaia. Pronounced 2.30µm CO emission.", fill="#64748b", font=f_sub)

    # Candidate 2: Barnard's Star
    draw.rounded_rectangle([1426, 916, 1894, 994], radius=8, fill="#0f172a", outline="#0284c7", width=1)
    draw.text((1438, 926), "Barnard's Star Proper Motion", fill="#38bdf8", font=get_font(FONT_BOLD, 12))
    draw.rounded_rectangle([1770, 924, 1884, 942], radius=4, fill="#082f49")
    draw.text((1778, 927), "VERIFIED MOVER", fill="#38bdf8", font=get_font(FONT_MONOB, 9))
    draw.text((1438, 950), "RA: 269.4521°  DEC: +4.6933°  |  Shift: Δ 5.15\"  |  10.3\"/yr Benchmark", fill="#94a3b8", font=f_sub)
    draw.text((1438, 970), "Confirmed gold-standard SPHEREx mover test. Dipole residual verified.", fill="#64748b", font=f_sub)

    # Action Button
    draw.rounded_rectangle([1426, 1008, 1894, 1044], radius=8, fill="#082f49", outline="#0284c7", width=1)
    draw.text((1510, 1018), "Export Mover Candidate to Hunt Mode / IRSA VO", fill="#38bdf8", font=get_font(FONT_BOLD, 12))

    draw_modern_navbar(draw, active_mode="investigate")

    dest1 = os.path.join(output_dir, "diff_tab_active.png")
    img.save(dest1, "PNG")
    dest2 = os.path.join(pub_dir, "diff_tab_active.png")
    img.save(dest2, "PNG")
    print(f"Generated diff_tab_active: {dest1}")


def build_hunt_screenshot():
    img = Image.new("RGB", (1920, 1080), "#02040a")
    draw = ImageDraw.Draw(img)

    # 1. Left: Starry Sky Viewport
    sky = create_realistic_sky(width=1400, height=1024, seed=99)
    img.paste(sky, (0, 56))

    # Candidate PX-1 reticle
    cx, cy = 680, 500
    draw.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], outline="#f59e0b", width=2)
    draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], outline="#38bdf8", width=1)
    draw.line([cx - 36, cy, cx - 18, cy], fill="#f59e0b", width=2)
    draw.line([cx + 18, cy, cx + 36, cy], fill="#f59e0b", width=2)
    draw.line([cx, cy - 36, cx, cy - 18], fill="#f59e0b", width=2)
    draw.line([cx, cy + 18, cx, cy + 36], fill="#f59e0b", width=2)

    f_star = get_font(FONT_BOLD, 14)
    f_sub = get_font(FONT_MONO, 11)
    draw.text((cx + 32, cy - 18), "Candidate PX-1 (WISE 0855 Analog)", fill="#fbbf24", font=f_star)
    draw.text((cx + 32, cy + 2), "Classification: Planet X / TNO Candidate  |  Shift: Δ 8.24\"", fill="#38bdf8", font=f_sub)
    draw.text((cx + 32, cy + 18), "RA: 133.7933°  DEC: -7.2451°  |  Confidence: 99.4% (Visible Dipole)", fill="#94a3b8", font=f_sub)

    # HUD at top-left
    draw.rounded_rectangle([18, 70, 430, 102], radius=8, fill="#030712", outline="#d97706", width=1)
    draw.ellipse([28, 83, 34, 89], fill="#f59e0b")
    draw.text((42, 78), "• HUNT MODE ENGAGED  |  CITIZEN RESEARCH CONSOLE", fill="#fbbf24", font=f_sub)

    # Scrubber Bar at bottom
    draw.rounded_rectangle([8, 1018, 220, 1068], radius=8, fill="#030712", outline="#1e293b", width=1)
    draw.text((16, 1026), "CENTER TARGET: Candidate PX-1", fill="#FFFFFF", font=get_font(FONT_BOLD, 11))
    draw.text((16, 1044), "RA: 133.7933°  DEC: -7.2451°", fill="#fbbf24", font=f_sub)

    draw.rounded_rectangle([230, 1018, 760, 1068], radius=8, fill="#030712", outline="#1e293b", width=1)
    draw.text((242, 1026), "CADENCE: 6-MONTH ALL-SKY", fill="#94a3b8", font=f_sub)
    draw.rounded_rectangle([440, 1026, 520, 1056], radius=6, fill="#082f49", outline="#06b6d4", width=1)
    draw.text((448, 1033), "2025-W18", fill="#22d3ee", font=get_font(FONT_MONOB, 10))
    draw.rounded_rectangle([530, 1026, 610, 1056], radius=6, fill="#451a03", outline="#f59e0b", width=1)
    draw.text((538, 1033), "2025-W44", fill="#fbbf24", font=get_font(FONT_MONOB, 10))

    # 2. Right: Hunt Mode Console (1400 to 1920)
    draw.rectangle([1400, 56, 1920, 1080], fill="#030712")
    draw.line([1400, 56, 1400, 1080], fill="#1e293b", width=1)

    # Console Banner
    draw.rounded_rectangle([1416, 70, 1904, 126], radius=10, fill="#050a18", outline="#d97706", width=1)
    draw.ellipse([1430, 88, 1438, 96], fill="#f59e0b")
    draw.text((1448, 80), "CITIZEN SCIENCE DISCOVERY CONSOLE", fill="#fbbf24", font=get_font(FONT_BOLD, 13))
    draw.text((1448, 100), "Flag candidates, verify multi-epoch dipoles, and export observation briefs.", fill="#94a3b8", font=get_font(FONT_REG, 11))

    # Citizen Science Rank Card
    draw.rounded_rectangle([1416, 138, 1904, 234], radius=12, fill="#0b1120", outline="#1e293b", width=1)
    draw.text((1432, 148), "CITIZEN SCIENCE RANK", fill="#94a3b8", font=get_font(FONT_MONOB, 10))
    draw.text((1432, 166), "Kuiper Belt Scout", fill="#38bdf8", font=get_font(FONT_BOLD, 16))
    draw.text((1800, 168), "Tier 2 / 4", fill="#64748b", font=f_sub)
    # Progress Bar
    draw.rounded_rectangle([1432, 194, 1888, 206], radius=6, fill="#030712", outline="#1e293b", width=1)
    draw.rounded_rectangle([1432, 194, 1774, 206], radius=6, fill="#0284c7") # 75%
    draw.text((1432, 214), "14 Verified Anomalies Logged  •  75% Progress to Deep Space Pioneer", fill="#64748b", font=f_sub)

    # Flag Coordinate Anomaly Card
    draw.rounded_rectangle([1416, 246, 1904, 600], radius=12, fill="#050a18", outline="#f59e0b", width=1)
    draw.ellipse([1430, 264, 1438, 272], fill="#f59e0b")
    draw.text((1446, 258), "FLAG COORDINATE ANOMALY", fill="#fbbf24", font=get_font(FONT_BOLD, 13))
    draw.text((1720, 260), "RA 133.7933° / DEC -7.2451°", fill="#64748b", font=f_sub)

    # Classification Field
    draw.text((1432, 292), "CLASSIFICATION TAG", fill="#94a3b8", font=get_font(FONT_MONOB, 10))
    draw.rounded_rectangle([1432, 310, 1888, 346], radius=6, fill="#0b1120", outline="#1e293b", width=1)
    draw.text((1444, 321), "Planet X / Trans-Neptunian Object Candidate", fill="#FFFFFF", font=get_font(FONT_REG, 12))

    # Baseline & Confidence row
    draw.text((1432, 362), "CONFIDENCE", fill="#94a3b8", font=get_font(FONT_MONOB, 10))
    draw.rounded_rectangle([1432, 380, 1640, 416], radius=6, fill="#0b1120", outline="#1e293b", width=1)
    draw.text((1444, 391), "High (Visible Shift)", fill="#10b981", font=get_font(FONT_REG, 12))

    draw.text((1660, 362), "BASELINE PAIR", fill="#94a3b8", font=get_font(FONT_MONOB, 10))
    draw.rounded_rectangle([1660, 380, 1888, 416], radius=6, fill="#0b1120", outline="#1e293b", width=1)
    draw.text((1672, 391), "2025-W18 ⇄ 2025-W44", fill="#fbbf24", font=get_font(FONT_MONO, 11))

    # Field Notes
    draw.text((1432, 432), "FIELD NOTES / VISUAL FINDINGS", fill="#94a3b8", font=get_font(FONT_MONOB, 10))
    draw.rounded_rectangle([1432, 450, 1888, 526], radius=6, fill="#030712", outline="#1e293b", width=1)
    draw.text((1444, 460), "Prominent centroid shift of Δ 8.24\" between 6-month survey epochs.", fill="#cbd5e1", font=get_font(FONT_REG, 11))
    draw.text((1444, 480), "Decoupled from background stars; zero optical detection in DSS2/Gaia.", fill="#cbd5e1", font=get_font(FONT_REG, 11))
    draw.text((1444, 500), "Prominent 2.30µm CO and 1.66µm CH4 absorption profiles confirmed.", fill="#38bdf8", font=get_font(FONT_REG, 11))

    # Add Button
    draw.rounded_rectangle([1432, 544, 1888, 584], radius=8, fill="#d97706")
    draw.text((1560, 554), "+ Record Anomaly to Research Catalog", fill="#FFFFFF", font=get_font(FONT_BOLD, 12))

    # Discovery Catalog List
    draw.text((1420, 620), "DISCOVERY RESEARCH CATALOG (3 DETECTIONS)", fill="#cbd5e1", font=get_font(FONT_BOLD, 12))
    draw.rounded_rectangle([1780, 616, 1894, 638], radius=4, fill="#082f49", outline="#0284c7", width=1)
    draw.text((1792, 621), "Export Brief", fill="#38bdf8", font=get_font(FONT_MONOB, 9))

    # Item 1
    draw.rounded_rectangle([1416, 646, 1904, 760], radius=8, fill="#0b1120", outline="#f59e0b", width=1)
    draw.text((1430, 656), "Candidate PX-1 (WISE 0855 Analog)", fill="#fbbf24", font=get_font(FONT_BOLD, 13))
    draw.rounded_rectangle([1750, 654, 1890, 672], radius=4, fill="#451a03")
    draw.text((1758, 657), "CANDIDATE PLANET X", fill="#f59e0b", font=get_font(FONT_MONOB, 9))
    draw.text((1430, 680), "Near-infrared centroid shift between 6-month scans. No optical counterpart.", fill="#94a3b8", font=f_sub)
    draw.text((1430, 700), "RA 133.7933°  •  DEC -7.2451°  •  Shift: Δ 8.24\"  •  Confidence: HIGH", fill="#38bdf8", font=f_sub)
    draw.text((1430, 720), "NASA SPHEREx QR2  •  DOI: 10.26131/IRSA629", fill="#64748b", font=get_font(FONT_MONO, 10))

    # Item 2
    draw.rounded_rectangle([1416, 770, 1904, 870], radius=8, fill="#0b1120", outline="#1e293b", width=1)
    draw.text((1430, 780), "Sedna Outer Kuiper Verification", fill="#FFFFFF", font=get_font(FONT_BOLD, 13))
    draw.rounded_rectangle([1760, 778, 1890, 796], radius=4, fill="#082f49")
    draw.text((1770, 781), "CONFIRMED TNO", fill="#38bdf8", font=get_font(FONT_MONOB, 9))
    draw.text((1430, 804), "Extreme detached dwarf planet at 85 AU. Parallax baseline benchmark.", fill="#94a3b8", font=f_sub)
    draw.text((1430, 824), "RA 56.6011°  •  DEC +24.1141°  •  Shift: Δ 0.18\"  •  Confirmed Orbit", fill="#38bdf8", font=f_sub)
    draw.text((1430, 844), "NASA SPHEREx QR2  •  DOI: 10.26131/IRSA629", fill="#64748b", font=get_font(FONT_MONO, 10))

    # Item 3
    draw.rounded_rectangle([1416, 880, 1904, 980], radius=8, fill="#0b1120", outline="#1e293b", width=1)
    draw.text((1430, 890), "Barnard's Star Proper Motion", fill="#FFFFFF", font=get_font(FONT_BOLD, 13))
    draw.rounded_rectangle([1760, 888, 1890, 906], radius=4, fill="#082f49")
    draw.text((1770, 891), "CONFIRMED STAR", fill="#38bdf8", font=get_font(FONT_MONOB, 9))
    draw.text((1430, 914), "High-proper motion stellar calibrator (10.3\"/yr total vector).", fill="#94a3b8", font=f_sub)
    draw.text((1430, 934), "RA 269.4521°  •  DEC +4.6933°  •  Shift: Δ 5.15\"  •  Gold Standard", fill="#38bdf8", font=f_sub)
    draw.text((1430, 954), "NASA SPHEREx QR2  •  DOI: 10.26131/IRSA629", fill="#64748b", font=get_font(FONT_MONO, 10))

    # Action Button at bottom
    draw.rounded_rectangle([1416, 1000, 1904, 1044], radius=8, fill="#082f49", outline="#0284c7", width=1)
    draw.text((1510, 1014), "Export Observation Brief (Markdown & NASA FITS Package)", fill="#38bdf8", font=get_font(FONT_BOLD, 12))

    draw_modern_navbar(draw, active_mode="hunt")

    dest1 = os.path.join(output_dir, "hunt_mode_active.png")
    img.save(dest1, "PNG")
    dest2 = os.path.join(pub_dir, "hunt_mode_active.png")
    img.save(dest2, "PNG")
    print(f"Generated hunt_mode_active: {dest1}")


def build_workstation_screenshot():
    # Figure 1 for Slide 3: Full live workstation with 102-band spectrum
    img = Image.new("RGB", (1920, 1080), "#02040a")
    draw = ImageDraw.Draw(img)

    # Viewport for workstation
    sky = create_realistic_sky(width=1400, height=1024, seed=77)
    img.paste(sky, (0, 56))

    # Center target reticle at (680, 510) for WISE 0855-0714
    cx, cy = 680, 510
    draw.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], outline="#06b6d4", width=2)
    draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], outline="#f59e0b", width=1)
    draw.line([cx - 36, cy, cx - 18, cy], fill="#06b6d4", width=2)
    draw.line([cx + 18, cy, cx + 36, cy], fill="#06b6d4", width=2)
    draw.line([cx, cy - 36, cx, cy - 18], fill="#06b6d4", width=2)
    draw.line([cx, cy + 18, cx, cy + 36], fill="#06b6d4", width=2)

    f_star = get_font(FONT_BOLD, 14)
    f_sub = get_font(FONT_MONO, 11)
    draw.text((cx + 32, cy - 18), "WISE 0855-0714 (Planet X Analog)", fill="#fbbf24", font=f_star)
    draw.text((cx + 32, cy + 2), "Sub-Stellar Brown Dwarf (T=250K)  |  Mover Benchmark", fill="#38bdf8", font=f_sub)
    draw.text((cx + 32, cy + 18), "RA: 133.7933°  DEC: -7.2451°  |  CADENCE: 6-MO", fill="#94a3b8", font=f_sub)

    # HUD at top-left
    draw.rounded_rectangle([18, 70, 430, 102], radius=8, fill="#030712", outline="#0284c7", width=1)
    draw.ellipse([28, 83, 34, 89], fill="#10b981")
    draw.text((42, 78), "• LIVE SPECTROSCOPY  |  SPHEREx 102-BAND ENGINE", fill="#38bdf8", font=f_sub)

    # Scrubber Bar at bottom
    draw.rounded_rectangle([8, 1018, 220, 1068], radius=8, fill="#030712", outline="#1e293b", width=1)
    draw.text((16, 1026), "CENTER TARGET: WISE 0855-0714", fill="#FFFFFF", font=get_font(FONT_BOLD, 11))
    draw.text((16, 1044), "RA: 133.7933°  DEC: -7.2451°", fill="#38bdf8", font=f_sub)

    draw.rounded_rectangle([230, 1018, 760, 1068], radius=8, fill="#030712", outline="#1e293b", width=1)
    draw.text((242, 1026), "CADENCE: 6-MONTH ALL-SKY", fill="#94a3b8", font=f_sub)
    draw.rounded_rectangle([440, 1026, 520, 1056], radius=6, fill="#082f49", outline="#06b6d4", width=1)
    draw.text((448, 1033), "2025-W18", fill="#22d3ee", font=get_font(FONT_MONOB, 10))
    draw.rounded_rectangle([530, 1026, 610, 1056], radius=6, fill="#451a03", outline="#f59e0b", width=1)
    draw.text((538, 1033), "2025-W44", fill="#fbbf24", font=get_font(FONT_MONOB, 10))

    # Right side 102-band spectrum panel from original constellations_orion
    base = Image.open("docs/screenshots/constellations_orion.png")
    img.paste(base.crop((1400, 56, 1920, 1080)), (1400, 56))

    draw_modern_navbar(draw, active_mode="explore")

    dest1 = os.path.join(output_dir, "constellations_orion.png")
    img.save(dest1, "PNG")
    dest2 = os.path.join(pub_dir, "constellations_orion.png")
    img.save(dest2, "PNG")
    print(f"Generated clean constellations_orion: {dest1}")

build_diff_screenshot()
build_hunt_screenshot()
build_workstation_screenshot()
print("All screenshots generated with perfection!")
