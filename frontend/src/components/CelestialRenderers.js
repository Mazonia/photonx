/**
 * PhotonX High-Fidelity Procedural Celestial Renderers
 * =====================================================
 * Photorealistic Canvas 2D renderers for:
 * - Solar System Worlds (Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Planet Nine)
 * - Galilean Moons (Io, Europa, Ganymede, Callisto) & Saturnian Moons (Titan)
 * - Deep Space Extended Benchmarks (Andromeda M31, Orion Nebula M42, Pleiades M45, Sagittarius A*)
 * - Observatory Telescope Optics (Eyepiece Vignette, Mil-Dot Crosshairs, PA Celestial Compass, Target Lock HUD)
 */

// Draw 3D Shaded Sphere base helper with limb darkening
function drawShadedSphere(ctx, x, y, r, baseColor, highlightColor, darkColor, lightAngle = -Math.PI / 4) {
  const lx = x + Math.cos(lightAngle) * r * 0.35;
  const ly = y + Math.sin(lightAngle) * r * 0.35;

  const grad = ctx.createRadialGradient(lx, ly, r * 0.08, x, y, r);
  grad.addColorStop(0, highlightColor || '#FFFFFF');
  grad.addColorStop(0.35, baseColor);
  grad.addColorStop(0.85, darkColor);
  grad.addColorStop(1, '#020617');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Subtle limb glow
  ctx.save();
  ctx.strokeStyle = highlightColor || baseColor;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = Math.max(1, r * 0.06);
  ctx.stroke();
  ctx.restore();
}

/**
 * Jupiter: Oblate gas giant with North/South Equatorial Belts, Great Red Spot, and 4 Galilean Moons
 */
export function drawJupiter(ctx, x, y, r, fov, theme) {
  ctx.save();

  // 1. Oblate spheroidal flattening (1.065 equatorial to polar ratio)
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1.065, 0.98);

  // Base 3D Shading
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#FEF3C7');
  grad.addColorStop(0.35, '#F59E0B');
  grad.addColorStop(0.75, '#B45309');
  grad.addColorStop(1, '#1C1917');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Atmospheric Bands (Equatorial & Temperate Belts)
  if (r > 8) {
    ctx.save();
    ctx.clip(); // Clip inside planet sphere

    const belts = [
      { yRel: -0.65, hRel: 0.15, color: 'rgba(180, 83, 9, 0.45)' }, // North Polar Hood
      { yRel: -0.38, hRel: 0.12, color: 'rgba(146, 64, 14, 0.65)' }, // North Temperate Belt
      { yRel: -0.18, hRel: 0.18, color: 'rgba(120, 53, 15, 0.85)' }, // North Equatorial Belt
      { yRel: 0.00, hRel: 0.14, color: 'rgba(254, 243, 199, 0.55)' }, // Equatorial Zone
      { yRel: 0.16, hRel: 0.20, color: 'rgba(120, 53, 15, 0.90)' }, // South Equatorial Belt (deep)
      { yRel: 0.40, hRel: 0.12, color: 'rgba(146, 64, 14, 0.65)' }, // South Temperate Belt
      { yRel: 0.65, hRel: 0.15, color: 'rgba(180, 83, 9, 0.45)' }, // South Polar Hood
    ];

    belts.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      const by = b.yRel * r;
      const bh = b.hRel * r;
      // Wavy boundary shear
      ctx.moveTo(-r * 1.2, by);
      for (let px = -r * 1.2; px <= r * 1.2; px += 8) {
        const wave = Math.sin(px * 0.12 + b.yRel * 5) * (r * 0.035);
        ctx.lineTo(px, by + wave);
      }
      ctx.lineTo(r * 1.2, by + bh);
      for (let px = r * 1.2; px >= -r * 1.2; px -= 8) {
        const wave = Math.sin(px * 0.12 + b.yRel * 5 + 1) * (r * 0.035);
        ctx.lineTo(px, by + bh + wave);
      }
      ctx.closePath();
      ctx.fill();
    });

    // Great Red Spot (GRS) at ~22° South Latitude
    const grsX = r * 0.22;
    const grsY = r * 0.26;
    const grsW = r * 0.28;
    const grsH = r * 0.17;

    const grsGrad = ctx.createRadialGradient(grsX, grsY, grsH * 0.2, grsX, grsY, grsW * 0.6);
    grsGrad.addColorStop(0, '#DC2626');
    grsGrad.addColorStop(0.65, '#991B1B');
    grsGrad.addColorStop(1, 'rgba(120, 53, 15, 0.7)');
    ctx.fillStyle = grsGrad;
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, grsW, grsH, 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Pale ring inside GRS
    ctx.strokeStyle = 'rgba(254, 202, 202, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  // Limb darkening stroke
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore(); // Restore oblate scale

  // 2. Galilean Moons (Io, Europa, Ganymede, Callisto) arrayed along equatorial tilt plane
  if (r > 12) {
    const moons = [
      { name: 'Io', distRel: 2.2, r: Math.max(2, r * 0.07), color: '#FACC15', type: 'Volcanic' },
      { name: 'Europa', distRel: 3.4, r: Math.max(1.8, r * 0.065), color: '#E0F2FE', type: 'Subsurface Ocean' },
      { name: 'Ganymede', distRel: 5.2, r: Math.max(2.6, r * 0.095), color: '#94A3B8', type: 'Magnetic Moon' },
      { name: 'Callisto', distRel: 8.5, r: Math.max(2.4, r * 0.085), color: '#64748B', type: 'Ancient Cratered' },
    ];

    // Orbital plane guide line
    ctx.save();
    ctx.strokeStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x - r * 9.5, y);
    ctx.lineTo(x + r * 9.5, y);
    ctx.stroke();
    ctx.restore();

    moons.forEach((m) => {
      // Deterministic left/right distribution
      const sign = (m.name === 'Io' || m.name === 'Ganymede') ? -1 : 1;
      const mx = x + sign * m.distRel * r;
      const my = y;

      ctx.save();
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(mx, my, m.r, 0, Math.PI * 2);
      ctx.fill();

      // Moon glow
      ctx.strokeStyle = m.color;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Moon name label
      if (fov < 0.6) {
        ctx.fillStyle = theme === 'dark' ? '#E2E8F0' : '#1E293B';
        ctx.font = '9px "IBM Plex Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m.name, mx, my - m.r - 3);
      }
      ctx.restore();
    });
  }

  ctx.restore();
}

/**
 * Saturn: 3D Tilted Ring System (Cassini division, shadow on globe, globe shadow on rings) & Moons
 */
export function drawSaturn(ctx, x, y, r, fov, theme) {
  ctx.save();
  ctx.translate(x, y);

  // Saturn ring tilt (-26.7 degrees)
  const tilt = -26.7 * (Math.PI / 180);
  ctx.rotate(tilt);

  const ringInnerR = r * 1.25;
  const ringMidR1 = r * 1.55;
  const ringMidR2 = r * 1.95;
  const ringOuterR = r * 2.30;
  const ringAspect = 0.38; // Elliptical foreshortening

  // 1. Draw BACK Rings (behind the planet globe, y < 0)
  ctx.save();
  ctx.beginPath();
  ctx.rect(-ringOuterR * 1.2, -ringOuterR * 1.2, ringOuterR * 2.4, ringOuterR * 1.2);
  ctx.clip();

  // Ring C (Crepe ring)
  ctx.beginPath();
  ctx.ellipse(0, 0, ringMidR1, ringMidR1 * ringAspect, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
  ctx.lineWidth = (ringMidR1 - ringInnerR);
  ctx.stroke();

  // Ring B (Bright dense ring)
  ctx.beginPath();
  ctx.ellipse(0, 0, (ringMidR1 + ringMidR2) / 2, ((ringMidR1 + ringMidR2) / 2) * ringAspect, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
  ctx.lineWidth = (ringMidR2 - ringMidR1);
  ctx.stroke();

  // Cassini Division (Dark gap)
  ctx.beginPath();
  ctx.ellipse(0, 0, ringMidR2, ringMidR2 * ringAspect, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(2, 6, 23, 0.95)';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();

  // Ring A (Outer ring)
  ctx.beginPath();
  ctx.ellipse(0, 0, (ringMidR2 + ringOuterR) / 2, ((ringMidR2 + ringOuterR) / 2) * ringAspect, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(252, 211, 77, 0.65)';
  ctx.lineWidth = (ringOuterR - ringMidR2);
  ctx.stroke();

  // Shadow of planet globe cast across back ring (dark wedge)
  ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
  ctx.beginPath();
  ctx.ellipse(r * 0.45, -r * 0.65, r * 0.65, r * 0.35, Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 2. Draw Planet Globe (Butterscotch sphere with subtle banding)
  const globGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  globGrad.addColorStop(0, '#FEF9C3');
  globGrad.addColorStop(0.35, '#FDE047');
  globGrad.addColorStop(0.7, '#D97706');
  globGrad.addColorStop(1, '#451A03');

  ctx.fillStyle = globGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Shadow of front rings cast across the planet's equator
  if (r > 8) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.15, r * 1.1, r * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3. Draw FRONT Rings (in front of planet globe, y > 0)
  ctx.save();
  ctx.beginPath();
  ctx.rect(-ringOuterR * 1.2, 0, ringOuterR * 2.4, ringOuterR * 1.2);
  ctx.clip();

  // Ring C
  ctx.beginPath();
  ctx.ellipse(0, 0, ringMidR1, ringMidR1 * ringAspect, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
  ctx.lineWidth = (ringMidR1 - ringInnerR);
  ctx.stroke();

  // Ring B
  ctx.beginPath();
  ctx.ellipse(0, 0, (ringMidR1 + ringMidR2) / 2, ((ringMidR1 + ringMidR2) / 2) * ringAspect, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
  ctx.lineWidth = (ringMidR2 - ringMidR1);
  ctx.stroke();

  // Cassini Division
  ctx.beginPath();
  ctx.ellipse(0, 0, ringMidR2, ringMidR2 * ringAspect, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(2, 6, 23, 0.95)';
  ctx.lineWidth = r * 0.08;
  ctx.stroke();

  // Ring A
  ctx.beginPath();
  ctx.ellipse(0, 0, (ringMidR2 + ringOuterR) / 2, ((ringMidR2 + ringOuterR) / 2) * ringAspect, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(252, 211, 77, 0.65)';
  ctx.lineWidth = (ringOuterR - ringMidR2);
  ctx.stroke();

  ctx.restore();

  // Limb darkening stroke around globe
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.lineWidth = Math.max(1, r * 0.06);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Titan Moon
  if (r > 12) {
    ctx.rotate(-tilt); // Unrotate for moon label
    const titanX = r * 3.8;
    const titanY = -r * 1.2;

    ctx.fillStyle = '#FB923C';
    ctx.beginPath();
    ctx.arc(titanX, titanY, Math.max(2.5, r * 0.08), 0, Math.PI * 2);
    ctx.fill();

    // Haze glow
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (fov < 0.6) {
      ctx.fillStyle = theme === 'dark' ? '#E2E8F0' : '#1E293B';
      ctx.font = '9px "IBM Plex Sans", sans-serif';
      ctx.fillText('Titan', titanX + 6, titanY + 3);
    }
  }

  ctx.restore();
}

/**
 * Mars: Rust-red globe with North Polar Ice Cap and dark basaltic albedo features (Syrtis Major)
 */
export function drawMars(ctx, x, y, r, fov, theme) {
  ctx.save();

  // Base 3D Terracotta Sphere
  drawShadedSphere(ctx, x, y, r, '#EA580C', '#FDBA74', '#7C2D12');

  // Albedo Features & Polar Cap
  if (r > 8) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    // Dark Basaltic Albedo Features (Syrtis Major & Sinus Sabaeus)
    ctx.fillStyle = 'rgba(67, 20, 7, 0.65)';
    ctx.beginPath();
    // Triangular Syrtis Major patch
    ctx.moveTo(x - r * 0.1, y - r * 0.1);
    ctx.lineTo(x + r * 0.35, y + r * 0.15);
    ctx.lineTo(x - r * 0.25, y + r * 0.45);
    ctx.closePath();
    ctx.fill();

    // Sinus Sabaeus dark band across southern hemisphere
    ctx.beginPath();
    ctx.ellipse(x - r * 0.15, y + r * 0.25, r * 0.55, r * 0.14, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Brilliant White North Polar Ice Cap (CO2 and H2O ice frost)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.82, r * 0.38, r * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ragged ice melt boundary
    ctx.strokeStyle = 'rgba(254, 205, 211, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // Thin atmospheric limb haze
  ctx.save();
  ctx.strokeStyle = 'rgba(254, 215, 170, 0.35)';
  ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.beginPath();
  ctx.arc(x, y, r + 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Phobos & Deimos (at high magnification)
  if (r > 20 && fov < 0.4) {
    ctx.fillStyle = '#A8A29E';
    ctx.beginPath();
    ctx.arc(x + r * 1.6, y - r * 0.4, 1.5, 0, Math.PI * 2);
    ctx.arc(x - r * 2.8, y + r * 0.7, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = theme === 'dark' ? '#94A3B8' : '#64748B';
    ctx.font = '8px monospace';
    ctx.fillText('Phobos', x + r * 1.6 + 4, y - r * 0.4 + 3);
    ctx.fillText('Deimos', x - r * 2.8 + 4, y + r * 0.7 + 3);
  }

  ctx.restore();
}

/**
 * Venus: Pearlescent creamy-yellow planetary cloud sphere with realistic crescent/gibbous phase
 */
export function drawVenus(ctx, x, y, r, fov, theme) {
  ctx.save();

  // Venus shows phases! Draw illuminated crescent/gibbous disk
  const phaseAngle = 0.65; // Gibbous phase typical of superior/inferior elongation

  // Dark unilluminated nightside base
  ctx.fillStyle = '#1E1B18';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Dayside illuminated hemisphere with creamy sulfuric acid gradient
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, false);
  ctx.ellipse(x, y, r * phaseAngle, r, 0, Math.PI / 2, -Math.PI / 2, phaseAngle < 0);
  ctx.clip();

  const vGrad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r);
  vGrad.addColorStop(0, '#FFFFFF');
  vGrad.addColorStop(0.35, '#FEF08A');
  vGrad.addColorStop(0.8, '#F59E0B');
  vGrad.addColorStop(1, '#78350F');
  ctx.fillStyle = vGrad;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  ctx.restore();

  // Subtle atmospheric scattering limb glow
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * The Sun (Sol): Dazzling golden core with limb darkening, pulsing corona flares, and dark sunspot umbrae
 */
export function drawSun(ctx, x, y, r, fov, theme) {
  ctx.save();

  // 1. Dynamic Pulsing Solar Corona Flares
  const time = Date.now() / 800;
  const coronaRadius = r * 2.8;

  const coronaGrad = ctx.createRadialGradient(x, y, r * 0.7, x, y, coronaRadius);
  coronaGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
  coronaGrad.addColorStop(0.25, 'rgba(245, 158, 11, 0.55)');
  coronaGrad.addColorStop(0.65, 'rgba(239, 68, 68, 0.25)');
  coronaGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

  ctx.fillStyle = coronaGrad;
  ctx.beginPath();
  ctx.arc(x, y, coronaRadius, 0, Math.PI * 2);
  ctx.fill();

  // Coronal Prominence Streamers
  if (r > 12) {
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.45)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.sin(time + i) * 0.15;
      const flareLen = r * 1.3 + Math.sin(time * 2 + i * 1.7) * (r * 0.4);
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
      ctx.quadraticCurveTo(
        x + Math.cos(angle + 0.2) * (r * 1.2),
        y + Math.sin(angle + 0.2) * (r * 1.2),
        x + Math.cos(angle) * flareLen,
        y + Math.sin(angle) * flareLen
      );
      ctx.stroke();
    }
  }

  // 2. Photosphere Solid Core with True Astrophysical Limb Darkening
  const sunGrad = ctx.createRadialGradient(x - r * 0.15, y - r * 0.15, r * 0.1, x, y, r);
  sunGrad.addColorStop(0, '#FFFFFF');
  sunGrad.addColorStop(0.25, '#FEF08A');
  sunGrad.addColorStop(0.7, '#F59E0B');
  sunGrad.addColorStop(1, '#DC2626');

  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // 3. Sunspot Groups (Umbra & Penumbra)
  if (r > 14) {
    const spots = [
      { rx: 0.18, ry: -0.22, size: r * 0.08 },
      { rx: 0.26, ry: -0.18, size: r * 0.05 },
      { rx: -0.32, ry: 0.24, size: r * 0.09 },
      { rx: -0.22, ry: 0.28, size: r * 0.06 },
    ];

    spots.forEach((sp) => {
      const sx = x + sp.rx * r;
      const sy = y + sp.ry * r;

      // Penumbra (brownish halo)
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.arc(sx, sy, sp.size * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Umbra (dark core)
      ctx.fillStyle = '#18181B';
      ctx.beginPath();
      ctx.arc(sx, sy, sp.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.restore();
}

/**
 * Earth: Vibrant blue oceans, green/ochre continents, swirling white clouds & atmospheric limb haze
 */
export function drawEarth(ctx, x, y, r, fov, theme) {
  ctx.save();

  // 1. Deep Ocean Sphere
  drawShadedSphere(ctx, x, y, r, '#1E40AF', '#60A5FA', '#0F172A');

  if (r > 8) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    // 2. Continents (Africa, Europe, Americas curved landmasses)
    ctx.fillStyle = '#15803D'; // Green vegetation
    ctx.beginPath();
    // Africa/Europe approximation
    ctx.ellipse(x - r * 0.1, y - r * 0.1, r * 0.35, r * 0.55, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#B45309'; // Sahara / Desert ochre
    ctx.beginPath();
    ctx.ellipse(x - r * 0.08, y - r * 0.2, r * 0.24, r * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Swirling White Cloud Systems & Cyclone
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.beginPath();
    ctx.ellipse(x + r * 0.25, y - r * 0.35, r * 0.45, r * 0.12, -0.3, 0, Math.PI * 2);
    ctx.ellipse(x - r * 0.2, y + r * 0.4, r * 0.5, r * 0.14, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Tropical Cyclone spiral
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + r * 0.3, y + r * 0.15, r * 0.15, 0, Math.PI * 1.5);
    ctx.stroke();

    ctx.restore();
  }

  // 4. Vibrant Blue Atmospheric Limb Glow (Rayleigh scattering)
  ctx.save();
  ctx.strokeStyle = '#38BDF8';
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = Math.max(1.2, r * 0.08);
  ctx.beginPath();
  ctx.arc(x, y, r + 0.8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/**
 * The Moon (Luna): Silvery-gray cratered sphere with dark basaltic maria & Tycho crater rays
 */
export function drawMoon(ctx, x, y, r, fov, theme) {
  ctx.save();

  // Base 3D Gray Rocky Sphere
  drawShadedSphere(ctx, x, y, r, '#64748B', '#E2E8F0', '#1E293B');

  if (r > 8) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    // Dark Basaltic Maria (Sea of Tranquility, Ocean of Storms, Sea of Serenity)
    ctx.fillStyle = 'rgba(30, 41, 59, 0.65)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.3, y - r * 0.15, r * 0.35, r * 0.28, 0.2, 0, Math.PI * 2); // Oceanus Procellarum
    ctx.ellipse(x + r * 0.22, y - r * 0.2, r * 0.25, r * 0.22, 0, 0, Math.PI * 2); // Mare Tranquillitatis
    ctx.ellipse(x + r * 0.15, y - r * 0.45, r * 0.2, r * 0.18, 0, 0, Math.PI * 2); // Mare Serenitatis
    ctx.fill();

    // Tycho Crater with radiating white ejecta rays in southern highlands
    const tychoX = x + r * 0.12;
    const tychoY = y + r * 0.55;

    ctx.strokeStyle = 'rgba(241, 245, 249, 0.55)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 7; i++) {
      const angle = (i * Math.PI) / 3.5;
      ctx.beginPath();
      ctx.moveTo(tychoX, tychoY);
      ctx.lineTo(tychoX + Math.cos(angle) * r * 0.6, tychoY + Math.sin(angle) * r * 0.6);
      ctx.stroke();
    }

    // Tycho central peak crater
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.arc(tychoX, tychoY, r * 0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Uranus: Aquamarine tilted ice giant with 98° axial tilt indicator and faint vertical rings
 */
export function drawUranus(ctx, x, y, r, fov, theme) {
  ctx.save();

  // Cyan-Aquamarine sphere
  drawShadedSphere(ctx, x, y, r, '#06B6D4', '#A5F3FC', '#083344');

  // Vertical faint ring system (97.8° axial tilt)
  if (r > 10) {
    ctx.save();
    ctx.strokeStyle = 'rgba(165, 243, 252, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.35, r * 1.85, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Neptune: Deep cobalt azure ice giant with white high-altitude methane cirrus clouds and Great Dark Spot
 */
export function drawNeptune(ctx, x, y, r, fov, theme) {
  ctx.save();

  // Deep Azure Sphere
  drawShadedSphere(ctx, x, y, r, '#2563EB', '#93C5FD', '#0B1E4D');

  if (r > 8) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    // Great Dark Spot (oval anticyclone)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.25, y - r * 0.15, r * 0.3, r * 0.16, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // High-altitude bright white methane cirrus cloud streaks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.5, y - r * 0.25);
    ctx.lineTo(x + r * 0.2, y - r * 0.28);
    ctx.moveTo(x - r * 0.1, y + r * 0.25);
    ctx.lineTo(x + r * 0.6, y + r * 0.22);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Pluto: Reddish-tan dwarf planet with bright heart-shaped Tombaugh Regio nitrogen ice plain & Charon
 */
export function drawPluto(ctx, x, y, r, fov, theme) {
  ctx.save();

  // Reddish-tan sphere
  drawShadedSphere(ctx, x, y, r, '#D97706', '#FDE68A', '#451A03');

  if (r > 8) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    // Heart-shaped Tombaugh Regio bright nitrogen ice glacier
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.beginPath();
    // Heart shape approximation on eastern limb
    const hx = x + r * 0.15;
    const hy = y + r * 0.05;
    ctx.ellipse(hx - r * 0.1, hy - r * 0.08, r * 0.22, r * 0.26, -0.2, 0, Math.PI * 2);
    ctx.ellipse(hx + r * 0.12, hy - r * 0.08, r * 0.20, r * 0.26, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Dark equatorial tholin band (Cthulhu Macula)
    ctx.fillStyle = 'rgba(69, 26, 3, 0.75)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.35, y + r * 0.35, r * 0.45, r * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Binary companion Charon
  if (r > 12) {
    const charonX = x - r * 2.5;
    const charonY = y - r * 1.1;
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.arc(charonX, charonY, Math.max(2, r * 0.45), 0, Math.PI * 2);
    ctx.fill();

    // Reddish polar hood on Charon (Mordor Macula)
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.arc(charonX, charonY - r * 0.2, r * 0.16, 0, Math.PI * 2);
    ctx.fill();

    if (fov < 0.6) {
      ctx.fillStyle = theme === 'dark' ? '#CBD5E1' : '#475569';
      ctx.font = '8px monospace';
      ctx.fillText('Charon', charonX - 12, charonY - 6);
    }
  }

  ctx.restore();
}

/**
 * Planet Nine (Hypothetical): Cold dark super-Earth with thermal infrared emission glow (3.5-5.0µm)
 */
export function drawPlanetNine(ctx, x, y, r, fov, theme) {
  ctx.save();

  // SPHEREx Thermal Infrared Halo Glow (radiating internal heat)
  const glowGrad = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 2.5);
  glowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.65)');
  glowGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.3)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Dark mysterious icy super-Earth globe
  drawShadedSphere(ctx, x, y, r, '#3B0764', '#C084FC', '#030712');

  ctx.restore();
}

/**
 * Messier 31 (Andromeda Galaxy): Tilted spiral galaxy with bright golden-white core, spiral dust lanes, M32/M110
 */
export function drawAndromedaGalaxy(ctx, x, y, r, fov, theme) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.65); // Tilted orientation

  const w = Math.max(35, r * 4.5);
  const h = w * 0.38;

  // Luminous Outer Spiral Disk
  const diskGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, w);
  diskGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
  diskGrad.addColorStop(0.18, 'rgba(192, 132, 252, 0.55)');
  diskGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.3)');
  diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = diskGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spiral Dust Absorption Lanes
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.lineWidth = Math.max(1.2, h * 0.12);
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.65, h * 0.65, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Brilliant Dense Galactic Nucleus
  const coreGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, Math.max(6, w * 0.15));
  coreGrad.addColorStop(0, '#FFFFFF');
  coreGrad.addColorStop(0.4, '#FEF08A');
  coreGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(6, w * 0.15), 0, Math.PI * 2);
  ctx.fill();

  // Dwarf companion galaxies M32 and M110
  ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
  ctx.beginPath();
  ctx.ellipse(w * 0.35, h * 1.5, 4, 3, 0.3, 0, Math.PI * 2); // M32
  ctx.ellipse(-w * 0.55, -h * 1.7, 7, 4, -0.4, 0, Math.PI * 2); // M110
  ctx.fill();

  ctx.restore();
}

/**
 * Orion Nebula (M42): Multi-spectral ionized emission cloud (OIII teal + H-alpha magenta) & Trapezium stars
 */
export function drawOrionNebula(ctx, x, y, r, fov, theme) {
  ctx.save();
  const nebR = Math.max(30, r * 3.5);

  // Outer Hydrogen-Alpha (H-alpha) Magenta ionization wings
  const hAlphaGrad = ctx.createRadialGradient(x, y, nebR * 0.2, x, y, nebR);
  hAlphaGrad.addColorStop(0, 'rgba(236, 72, 153, 0.65)');
  hAlphaGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.35)');
  hAlphaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = hAlphaGrad;
  ctx.beginPath();
  ctx.ellipse(x, y, nebR * 1.2, nebR * 0.85, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Inner [O III] Doubly Ionized Oxygen Emerald-Teal Core
  const oiiiGrad = ctx.createRadialGradient(x - 5, y - 5, 2, x, y, nebR * 0.45);
  oiiiGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  oiiiGrad.addColorStop(0.35, 'rgba(45, 212, 191, 0.75)');
  oiiiGrad.addColorStop(0.75, 'rgba(6, 182, 212, 0.45)');
  oiiiGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = oiiiGrad;
  ctx.beginPath();
  ctx.arc(x, y, nebR * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Dark Dust Silhouette ("Fish's Mouth")
  ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
  ctx.beginPath();
  ctx.ellipse(x + nebR * 0.18, y - nebR * 0.1, nebR * 0.35, nebR * 0.2, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Central Trapezium Cluster Stars (Theta1 Orionis A, B, C, D)
  const trapStars = [
    { dx: 0, dy: 0, r: 2.2 },
    { dx: 3.5, dy: 2.5, r: 1.8 },
    { dx: -2.8, dy: 3.2, r: 1.6 },
    { dx: 4.2, dy: -2.8, r: 1.5 },
  ];

  ctx.fillStyle = '#FFFFFF';
  trapStars.forEach((ts) => {
    ctx.beginPath();
    ctx.arc(x + ts.dx, y + ts.dy, ts.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Pleiades (M45): Seven Sisters anchor stars with ethereal blue reflection nebulosity filaments
 */
export function drawPleiadesCluster(ctx, x, y, r, fov, theme) {
  ctx.save();
  const nebR = Math.max(35, r * 3.8);

  // Ethereal Blue Reflection Nebulosity Filament Clouds
  const nebGrad = ctx.createRadialGradient(x, y, 10, x, y, nebR);
  nebGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
  nebGrad.addColorStop(0.4, 'rgba(2, 132, 199, 0.3)');
  nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = nebGrad;
  ctx.beginPath();
  ctx.arc(x, y, nebR, 0, Math.PI * 2);
  ctx.fill();

  // Seven Sisters Stars (Alcyone, Maia, Electra, Merope, Taygeta, Celaeno, Atlas)
  const stars = [
    { dx: 0, dy: 0, mag: 2.8, name: 'Alcyone' },
    { dx: -18, dy: -12, mag: 3.8, name: 'Maia' },
    { dx: -28, dy: 8, mag: 3.7, name: 'Electra' },
    { dx: -8, dy: 16, mag: 4.1, name: 'Merope' },
    { dx: -24, dy: -22, mag: 4.3, name: 'Taygeta' },
    { dx: 18, dy: 10, mag: 3.6, name: 'Atlas' },
    { dx: 22, dy: 18, mag: 5.0, name: 'Pleione' },
  ];

  stars.forEach((s) => {
    const sx = x + s.dx;
    const sy = y + s.dy;

    // Star disk
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(2, 4.5 - s.mag * 0.5), 0, Math.PI * 2);
    ctx.fill();

    // Reflection halo
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(6, 16 - s.mag * 2), 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Sagittarius A*: Supermassive black hole with relativistic glowing accretion disk & photon sphere shadow
 */
export function drawSagittariusA(ctx, x, y, r, fov, theme) {
  ctx.save();
  const diskR = Math.max(25, r * 3.0);

  // Relativistic glowing golden-orange accretion disk (tilted)
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.35);

  const diskGrad = ctx.createRadialGradient(0, 0, diskR * 0.35, 0, 0, diskR);
  diskGrad.addColorStop(0, '#FFFFFF');
  diskGrad.addColorStop(0.25, '#F59E0B');
  diskGrad.addColorStop(0.65, '#DC2626');
  diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = diskGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, diskR, diskR * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Relativistic Doppler Beaming (plasma swirling towards observer on left is brighter)
  const beamGrad = ctx.createRadialGradient(-diskR * 0.35, 0, 2, -diskR * 0.35, 0, diskR * 0.5);
  beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
  beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.ellipse(-diskR * 0.35, 0, diskR * 0.5, diskR * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Black Hole Event Horizon Shadow (pitch black central core)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(0, 0, diskR * 0.36, 0, Math.PI * 2);
  ctx.fill();

  // Gravitationally lensed photon ring
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, diskR * 0.37, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}

/**
 * Telescope Eyepiece Optical Vignette Mask: Circular field stop with realistic optical lens falloff
 */
export function drawTelescopeEyepieceMask(ctx, w, h, centerX, centerY, radius, theme) {
  ctx.save();

  // Dark matte border outside circular aperture
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fillStyle = theme === 'dark' ? '#010206' : '#E2E8F0';
  ctx.fill();

  // Optical field stop barrel rim (brushed metallic / anodized aluminum)
  ctx.strokeStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.5)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle radial lens vignette inside aperture perimeter
  const vigGrad = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.88,
    centerX,
    centerY,
    radius
  );
  vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = vigGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Precision Astronomical Reticle: Mil-dot crosshairs, concentric angular rings, and Position Angle compass
 */
export function drawPrecisionReticle(ctx, cx, cy, w, h, fov, theme, targetLockInfo) {
  ctx.save();
  ctx.strokeStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.75)' : 'rgba(2, 132, 199, 0.7)';
  ctx.lineWidth = 1.2;

  // 1. Center Mil-Dot Crosshairs
  const armLen = 28;
  const gap = 6;

  ctx.beginPath();
  // Horizontal
  ctx.moveTo(cx - armLen, cy);
  ctx.lineTo(cx - gap, cy);
  ctx.moveTo(cx + gap, cy);
  ctx.lineTo(cx + armLen, cy);
  // Vertical
  ctx.moveTo(cx, cy - armLen);
  ctx.lineTo(cx, cy - gap);
  ctx.moveTo(cx, cy + gap);
  ctx.lineTo(cx, cy + armLen);
  ctx.stroke();

  // Mil-dots
  const dotOffsets = [12, 20];
  ctx.fillStyle = theme === 'dark' ? '#22D3EE' : '#0284C7';
  dotOffsets.forEach((d) => {
    ctx.fillRect(cx + d - 1, cy - 1, 2, 2);
    ctx.fillRect(cx - d - 1, cy - 1, 2, 2);
    ctx.fillRect(cx - 1, cy + d - 1, 2, 2);
    ctx.fillRect(cx - 1, cy - d - 1, 2, 2);
  });

  // 2. Concentric Angular Rings (Outer 40px, Middle 22px, Inner 14px)
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 3. Dynamic Position Angle (PA) North/East Celestial Compass Arrows
  const compassR = 48;
  // North arrow (upwards along Declination)
  ctx.strokeStyle = '#38BDF8';
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.moveTo(cx, cy - compassR);
  ctx.lineTo(cx - 4, cy - compassR + 8);
  ctx.lineTo(cx + 4, cy - compassR + 8);
  ctx.closePath();
  ctx.fill();

  ctx.font = 'bold 9px "IBM Plex Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('N', cx, cy - compassR - 4);

  // East arrow (to the left in astronomical standard view where East is left)
  ctx.beginPath();
  ctx.moveTo(cx - compassR, cy);
  ctx.lineTo(cx - compassR + 8, cy - 4);
  ctx.lineTo(cx - compassR + 8, cy + 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillText('E', cx - compassR - 7, cy + 3);

  // 4. Target Lock-On HUD Bracket (if an object is centered or locked)
  if (targetLockInfo) {
    const boxSize = Math.max(24, (targetLockInfo.radius || 16) + 12);
    const corner = 8;
    const bx = cx - boxSize;
    const by = cy - boxSize;
    const bw = boxSize * 2;
    const bh = boxSize * 2;

    ctx.save();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.8;

    // Corner brackets
    ctx.beginPath();
    // Top-left
    ctx.moveTo(bx, by + corner);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + corner, by);
    // Top-right
    ctx.moveTo(bx + bw - corner, by);
    ctx.lineTo(bx + bw, by);
    ctx.lineTo(bx + bw, by + corner);
    // Bottom-left
    ctx.moveTo(bx, by + bh - corner);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx + corner, by + bh);
    // Bottom-right
    ctx.moveTo(bx + bw - corner, by + bh);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw, by + bh - corner);
    ctx.stroke();

    // Lock Tag
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 9.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`[ TRACKING: ${targetLockInfo.name.toUpperCase()} ]`, cx, by - 8);

    if (targetLockInfo.angularDia) {
      ctx.fillStyle = theme === 'dark' ? '#94A3B8' : '#64748B';
      ctx.font = '8.5px monospace';
      ctx.fillText(`Apparent Ø: ${targetLockInfo.angularDia}`, cx, by + bh + 14);
    }
    ctx.restore();
  }

  ctx.restore();
}
