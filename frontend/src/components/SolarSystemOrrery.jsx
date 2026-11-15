import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import useStore from '../store/useStore';
import { MASTER_CELESTIAL_TARGETS } from '../data/celestialCatalog';
import {
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Orbit,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
  Compass,
} from 'lucide-react';

// Astronomical scale definitions
// In scaled AU units for visual clarity and mathematical harmony
const ORRERY_PLANETS = [
  {
    id: 'mercury',
    name: 'Mercury',
    semiMajorAU: 0.387,
    eccentricity: 0.2056,
    periodYears: 0.2408,
    color: '#94A3B8',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    radiusKm: 2440,
    sizePx: 4,
    speedKmS: 47.4,
    ra: 280.5,
    dec: -24.2,
    type: 'Terrestrial Planet',
  },
  {
    id: 'venus',
    name: 'Venus',
    semiMajorAU: 0.723,
    eccentricity: 0.0067,
    periodYears: 0.6152,
    color: '#FDE047',
    glowColor: 'rgba(253, 224, 71, 0.4)',
    radiusKm: 6052,
    sizePx: 6,
    speedKmS: 35.0,
    ra: 310.2,
    dec: -15.8,
    type: 'Terrestrial Planet',
  },
  {
    id: 'earth',
    name: 'Earth',
    semiMajorAU: 1.000,
    eccentricity: 0.0167,
    periodYears: 1.0000,
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    radiusKm: 6371,
    sizePx: 6.5,
    speedKmS: 29.8,
    ra: 180.0,
    dec: 0.0,
    type: 'Habitable Ocean World',
    hasMoon: true,
  },
  {
    id: 'mars',
    name: 'Mars',
    semiMajorAU: 1.524,
    eccentricity: 0.0934,
    periodYears: 1.8808,
    color: '#FB923C',
    glowColor: 'rgba(251, 146, 60, 0.45)',
    radiusKm: 3390,
    sizePx: 5,
    speedKmS: 24.1,
    ra: 75.4,
    dec: 24.1,
    type: 'Terrestrial Planet',
  },
  {
    id: 'ceres',
    name: 'Ceres',
    semiMajorAU: 2.767,
    eccentricity: 0.0758,
    periodYears: 4.60,
    color: '#E2E8F0',
    glowColor: 'rgba(226, 232, 240, 0.3)',
    radiusKm: 473,
    sizePx: 3,
    speedKmS: 17.9,
    ra: 142.1,
    dec: 16.4,
    type: 'Asteroid Belt Dwarf Planet',
    isDwarf: true,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    semiMajorAU: 5.204,
    eccentricity: 0.0485,
    periodYears: 11.862,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    radiusKm: 69911,
    sizePx: 12,
    speedKmS: 13.1,
    ra: 52.8,
    dec: 17.2,
    type: 'Gas Giant Planet',
    moons: ['Io', 'Europa', 'Ganymede', 'Callisto'],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    semiMajorAU: 9.582,
    eccentricity: 0.0555,
    periodYears: 29.457,
    color: '#FCD34D',
    glowColor: 'rgba(252, 211, 77, 0.45)',
    radiusKm: 58232,
    sizePx: 10,
    speedKmS: 9.7,
    ra: 347.1,
    dec: -8.4,
    type: 'Ringed Gas Giant',
    hasRings: true,
    moons: ['Titan', 'Enceladus', 'Rhea'],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    semiMajorAU: 19.22,
    eccentricity: 0.0463,
    periodYears: 84.011,
    color: '#67E8F9',
    glowColor: 'rgba(103, 232, 249, 0.4)',
    radiusKm: 25362,
    sizePx: 8,
    speedKmS: 6.8,
    ra: 50.1,
    dec: 17.4,
    type: 'Ice Giant Planet',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    semiMajorAU: 30.07,
    eccentricity: 0.0095,
    periodYears: 164.79,
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    radiusKm: 24622,
    sizePx: 8,
    speedKmS: 5.4,
    ra: 358.5,
    dec: -2.3,
    type: 'Ice Giant Planet',
    moons: ['Triton'],
  },
  {
    id: 'pluto',
    name: 'Pluto',
    semiMajorAU: 39.48,
    eccentricity: 0.2488,
    periodYears: 247.94,
    color: '#D4D4D8',
    glowColor: 'rgba(212, 212, 216, 0.3)',
    radiusKm: 1188,
    sizePx: 3.5,
    speedKmS: 4.7,
    ra: 301.2,
    dec: -22.8,
    type: 'Kuiper Belt Dwarf Planet',
    isDwarf: true,
  },
  {
    id: 'sedna',
    name: 'Sedna',
    semiMajorAU: 506.0,
    eccentricity: 0.85,
    periodYears: 11400,
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    radiusKm: 497,
    sizePx: 3,
    speedKmS: 1.3,
    ra: 55.8,
    dec: 7.9,
    type: 'Extreme Detached Sednoid',
    isPlanetXAnalog: true,
  },
  {
    id: 'planet-nine',
    name: 'Planet Nine (Hypothetical)',
    semiMajorAU: 500.0,
    eccentricity: 0.60,
    periodYears: 15000,
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    radiusKm: 13000,
    sizePx: 6.5,
    speedKmS: 1.5,
    ra: 75.0,
    dec: 15.0,
    type: 'Hypothetical Super-Earth / Planet X',
    isPlanetX: true,
  },
  {
    id: 'halley',
    name: "Halley's Comet (1P)",
    semiMajorAU: 17.83,
    eccentricity: 0.967,
    periodYears: 75.3,
    color: '#2DD4BF',
    glowColor: 'rgba(45, 212, 191, 0.5)',
    radiusKm: 5.5,
    sizePx: 3.5,
    speedKmS: 12.0,
    ra: 140.2,
    dec: -8.5,
    type: 'Periodic Retrograde Comet',
    isComet: true,
  },
];

// Helper to generate deterministic Asteroid and Kuiper belt particle rings
function generateBeltParticles(count, minAU, maxAU, seed) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const s = seed + i * 137.5;
    const angle = (s % 1000) * 0.00628318; // 0 to 2PI
    const dist = minAU + (Math.sin(s * 91.1) * 0.5 + 0.5) * (maxAU - minAU);
    particles.push({ angle, dist });
  }
  return particles;
}

export default function SolarSystemOrrery({ onSelectPlanet, onClose }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const { theme, setPosition, setSelectedObject, setFov } = useStore();

  // Scale mode: 'inner' (0-2.5 AU), 'system' (0-45 AU), 'deep' (0-800 AU)
  const [scaleMode, setScaleMode] = useState('system');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(15); // days per second
  const [simDays, setSimDays] = useState(0);
  const [selectedBody, setSelectedBody] = useState(ORRERY_PLANETS[2]); // Default Earth
  const [hoveredBody, setHoveredBody] = useState(null);

  // Pan & Zoom state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  // Belts: Asteroid Belt (2.1 to 3.3 AU) and Kuiper Belt (30 to 48 AU)
  const asteroidBelt = useMemo(() => generateBeltParticles(160, 2.1, 3.3, 101), []);
  const kuiperBelt = useMemo(() => generateBeltParticles(180, 30.0, 48.0, 503), []);

  // Compute AU-to-Pixel scaling factor based on scale mode
  const auScale = useMemo(() => {
    switch (scaleMode) {
      case 'inner':
        return 130; // 1 AU = 130px (great for Mercury to Mars)
      case 'deep':
        return 0.45; // 1 AU = 0.45px (shows Sedna & Planet Nine out to 600 AU)
      case 'system':
      default:
        return 7.2; // 1 AU = 7.2px (shows Sun to Neptune/Pluto comfortably)
    }
  }, [scaleMode]);

  // Animation frame loop
  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    let animId;

    const loop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setSimDays((prev) => prev + dt * speedMultiplier);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speedMultiplier]);

  // Main Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    const cx = width / 2 + panOffset.x;
    const cy = height / 2 + panOffset.y;

    // 1. Background Void
    if (theme === 'dark') {
      const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(width, height));
      bgGrad.addColorStop(0, '#040817');
      bgGrad.addColorStop(0.5, '#02050E');
      bgGrad.addColorStop(1, '#000104');
      ctx.fillStyle = bgGrad;
    } else {
      const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(width, height));
      bgGrad.addColorStop(0, '#FFFFFF');
      bgGrad.addColorStop(1, '#F1F5F9');
      ctx.fillStyle = bgGrad;
    }
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Coordinate Grid & Distance Ring Indicators (AU)
    const distanceMarkers =
      scaleMode === 'inner'
        ? [0.5, 1.0, 1.5, 2.0]
        : scaleMode === 'deep'
        ? [50, 100, 250, 500]
        : [1, 5, 10, 20, 30, 40];

    ctx.save();
    distanceMarkers.forEach((au) => {
      const r = au * auScale;
      if (r < 10 || r > Math.max(width, height) * 2) return;
      ctx.strokeStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 23, 42, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(15, 23, 42, 0.3)';
      ctx.font = '9px monospace';
      ctx.fillText(`${au} AU`, cx + r + 3, cy - 3);
    });
    ctx.restore();

    // 3. Render Asteroid Belt & Kuiper Belt (particles)
    if (scaleMode !== 'deep') {
      // Asteroid belt
      ctx.save();
      ctx.fillStyle = theme === 'dark' ? 'rgba(203, 213, 225, 0.22)' : 'rgba(100, 116, 139, 0.25)';
      asteroidBelt.forEach((p) => {
        const pr = p.dist * auScale;
        const px = cx + Math.cos(p.angle) * pr;
        const py = cy + Math.sin(p.angle) * pr;
        ctx.fillRect(px, py, 1.2, 1.2);
      });
      ctx.restore();
    }

    if (scaleMode === 'system' || scaleMode === 'deep') {
      // Kuiper belt
      ctx.save();
      ctx.fillStyle = theme === 'dark' ? 'rgba(147, 197, 253, 0.16)' : 'rgba(2, 132, 199, 0.18)';
      kuiperBelt.forEach((p) => {
        const pr = p.dist * auScale;
        const px = cx + Math.cos(p.angle) * pr;
        const py = cy + Math.sin(p.angle) * pr;
        ctx.fillRect(px, py, 1.2, 1.2);
      });
      ctx.restore();
    }

    // 4. Render Orbital Trajectories (Ellipses based on semi-major axis & eccentricity)
    ORRERY_PLANETS.forEach((planet) => {
      // Filter out deep objects if in 'inner' mode
      if (scaleMode === 'inner' && planet.semiMajorAU > 3.5) return;
      if (scaleMode === 'system' && planet.semiMajorAU > 50) return;

      const a = planet.semiMajorAU * auScale;
      const b = a * Math.sqrt(1 - planet.eccentricity * planet.eccentricity);
      const focusDist = a * planet.eccentricity; // Distance from center to Sun focus

      const isSelected = selectedBody?.id === planet.id;
      const isHovered = hoveredBody?.id === planet.id;

      ctx.save();
      ctx.beginPath();
      // Orbit ellipse: Sun at one focus, so ellipse center is offset by -focusDist along major axis
      ctx.ellipse(cx - focusDist, cy, a, b, 0, 0, Math.PI * 2);

      if (isSelected || isHovered) {
        ctx.strokeStyle = planet.color;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([]);
        ctx.shadowColor = planet.color;
        ctx.shadowBlur = 8;
      } else {
        ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
      }
      ctx.stroke();
      ctx.restore();
    });

    // 5. Render Central Sun (Sol)
    ctx.save();
    const sunRadius = scaleMode === 'inner' ? 18 : scaleMode === 'deep' ? 8 : 12;

    // Glowing solar corona
    const coronaGrad = ctx.createRadialGradient(cx, cy, sunRadius * 0.8, cx, cy, sunRadius * 3.5);
    coronaGrad.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
    coronaGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.45)');
    coronaGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius * 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Solid solar core
    const sunGrad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, sunRadius);
    sunGrad.addColorStop(0, '#FFFFFF');
    sunGrad.addColorStop(0.35, '#FEF08A');
    sunGrad.addColorStop(0.8, '#F59E0B');
    sunGrad.addColorStop(1, '#DC2626');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = theme === 'dark' ? '#FEF08A' : '#B45309';
    ctx.font = 'bold 10px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SUN (SOL)', cx, cy + sunRadius + 14);
    ctx.restore();

    // 6. Calculate & Render Each Planet Body at Current Time
    ORRERY_PLANETS.forEach((planet) => {
      if (scaleMode === 'inner' && planet.semiMajorAU > 3.5) return;
      if (scaleMode === 'system' && planet.semiMajorAU > 50) return;

      // True orbital position based on Keplerian mean motion
      // M = n * (t - T0)
      const meanMotion = (Math.PI * 2) / (planet.periodYears * 365.25);
      const M = (simDays * meanMotion) % (Math.PI * 2);

      // Approximate eccentric anomaly E ≈ M + e * sin(M)
      const E = M + planet.eccentricity * Math.sin(M);

      const a = planet.semiMajorAU * auScale;
      const b = a * Math.sqrt(1 - planet.eccentricity * planet.eccentricity);
      const focusDist = a * planet.eccentricity;

      // Position relative to Sun focus
      const px = cx - focusDist + a * Math.cos(E);
      const py = cy + b * Math.sin(E);

      // Store computed screen coords for hit testing
      planet._screenX = px;
      planet._screenY = py;

      const isSelected = selectedBody?.id === planet.id;
      const isHovered = hoveredBody?.id === planet.id;

      // Render Planet Glow & Disc
      ctx.save();
      const pRadius = Math.max(3.5, planet.sizePx * (scaleMode === 'inner' ? 1.4 : 1.0));

      if (isSelected || isHovered) {
        // Selection highlight ring
        ctx.strokeStyle = planet.color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(px, py, pRadius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Halley Comet Tail
      if (planet.isComet) {
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.hypot(dx, dy);
        const tailLen = Math.min(60, 450 / Math.max(10, dist / auScale));
        const tailX = px + (dx / dist) * tailLen;
        const tailY = py + (dy / dist) * tailLen;

        const tailGrad = ctx.createLinearGradient(px, py, tailX, tailY);
        tailGrad.addColorStop(0, 'rgba(45, 212, 191, 0.7)');
        tailGrad.addColorStop(1, 'rgba(45, 212, 191, 0)');
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      // Saturn Rings
      if (planet.hasRings) {
        ctx.save();
        ctx.strokeStyle = 'rgba(252, 211, 77, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(px, py, pRadius * 2.2, pRadius * 0.75, -Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3D Sphere lighting
      const grad = ctx.createRadialGradient(
        px - pRadius * 0.35,
        py - pRadius * 0.35,
        pRadius * 0.1,
        px,
        py,
        pRadius
      );
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, planet.color);
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, pRadius, 0, Math.PI * 2);
      ctx.fill();

      // Earth's Moon
      if (planet.hasMoon && scaleMode === 'inner') {
        const moonAngle = simDays * 0.23;
        const mx = px + Math.cos(moonAngle) * 16;
        const my = py + Math.sin(moonAngle) * 16;
        ctx.fillStyle = '#CBD5E1';
        ctx.beginPath();
        ctx.arc(mx, my, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Planet Label
      ctx.fillStyle = isSelected
        ? planet.color
        : theme === 'dark'
        ? '#E2E8F0'
        : '#1E293B';
      ctx.font = `${isSelected ? 'bold ' : ''}10px "IBM Plex Sans", sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(planet.name, px + pRadius + 5, py + 3);

      ctx.restore();
    });

    ctx.restore();
  }, [
    simDays,
    scaleMode,
    auScale,
    theme,
    selectedBody,
    hoveredBody,
    panOffset,
    asteroidBelt,
    kuiperBelt,
  ]);

  // Mouse interaction: Hover detection & Click Selection
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPanning) {
      setPanOffset({
        x: panStartRef.current.ox + (e.clientX - panStartRef.current.x),
        y: panStartRef.current.oy + (e.clientY - panStartRef.current.y),
      });
      return;
    }

    // Hit test planets
    let hit = null;
    for (const p of ORRERY_PLANETS) {
      if (p._screenX && p._screenY) {
        const dist = Math.hypot(x - p._screenX, y - p._screenY);
        if (dist < 18) {
          hit = p;
          break;
        }
      }
    }
    setHoveredBody(hit);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: panOffset.x,
      oy: panOffset.y,
    };
  };

  const handleMouseUp = (e) => {
    setIsPanning(false);
    // If it was a quick click, select hovered planet
    const dx = Math.abs(e.clientX - panStartRef.current.x);
    const dy = Math.abs(e.clientY - panStartRef.current.y);
    if (dx < 6 && dy < 6 && hoveredBody) {
      setSelectedBody(hoveredBody);
    }
  };

  // Enriched metadata for selected body from MASTER_CELESTIAL_TARGETS
  const selectedMeta = useMemo(() => {
    if (!selectedBody) return null;
    const match = MASTER_CELESTIAL_TARGETS.find(
      (t) =>
        t.name.toLowerCase() === selectedBody.name.toLowerCase() ||
        (t.aliases && t.aliases.some((a) => a.toLowerCase() === selectedBody.name.toLowerCase()))
    );
    return {
      ...selectedBody,
      ...match,
    };
  }, [selectedBody]);

  // Action: Slew Observatory Telescope to Selected Body
  const handleSlewToBody = () => {
    if (!selectedMeta) return;
    setPosition(selectedMeta.ra, selectedMeta.dec, selectedMeta.name);
    setSelectedObject({
      name: selectedMeta.name,
      ra: selectedMeta.ra,
      dec: selectedMeta.dec,
      object_type: selectedMeta.type || selectedMeta.category || 'Solar System Planet',
      description: selectedMeta.desc,
      orbit: selectedMeta.orbit,
      funFact: selectedMeta.funFact,
      diameter_km: selectedMeta.diameter_km,
      surface_temp_c: selectedMeta.surface_temp_c,
      gravity_g: selectedMeta.gravity_g,
      atmosphere: selectedMeta.atmosphere,
      spherex_diag: selectedMeta.spherex_diag,
      moons_count: selectedMeta.moons_count,
    });

    // Set optimal telescopic FOV for high resolution inspection
    if (selectedMeta.id === 'jupiter' || selectedMeta.id === 'saturn') {
      setFov(0.25);
    } else if (selectedMeta.id === 'mars' || selectedMeta.id === 'venus' || selectedMeta.id === 'earth') {
      setFov(0.18);
    } else {
      setFov(0.4);
    }

    if (onSelectPlanet) onSelectPlanet(selectedMeta);
    if (onClose) onClose();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-sand-50 dark:bg-space-950 font-sans select-none overflow-hidden"
    >
      {/* Top Orrery Controls Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 p-3 border-b border-sand-200 dark:border-ocean-900/60 bg-sand-100/90 dark:bg-space-900/90 backdrop-blur-md">
        {/* Scale Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-sand-200/70 dark:bg-space-950 border border-sand-300 dark:border-ocean-800/80 text-xs font-mono">
          <span className="px-2 text-[10px] text-sand-500 uppercase tracking-wider font-bold">
            SCALE:
          </span>
          {[
            { id: 'inner', label: 'Inner (0-2 AU)', desc: 'Sun, Mercury, Venus, Earth, Mars' },
            { id: 'system', label: 'Full System (0-40 AU)', desc: 'Sun through Neptune & Pluto' },
            { id: 'deep', label: 'Planet X & Sedna (800 AU)', desc: 'Trans-Neptunian realm' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setScaleMode(mode.id);
                setPanOffset({ x: 0, y: 0 });
              }}
              title={mode.desc}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                scaleMode === mode.id
                  ? 'bg-ocean-500 text-white font-bold shadow-sm'
                  : 'text-sand-700 dark:text-sand-300 hover:text-sand-900 dark:hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Time Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-sand-200 dark:bg-space-800 text-sand-800 dark:text-sand-200 hover:bg-sand-300'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-sand-700 dark:text-sand-300">
            {[
              { label: '1x', val: 1 },
              { label: '15x', val: 15 },
              { label: '60x', val: 60 },
              { label: '365x', val: 365 },
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => setSpeedMultiplier(s.val)}
                className={`px-2 py-1 rounded-lg ${
                  speedMultiplier === s.val
                    ? 'bg-ocean-500 text-white font-bold'
                    : 'bg-sand-200/60 dark:bg-space-950 hover:bg-sand-300/60'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setSimDays(0);
              setPanOffset({ x: 0, y: 0 });
            }}
            title="Reset Simulation to Epoch J2000"
            className="p-1.5 rounded-xl text-sand-600 dark:text-sand-400 hover:bg-sand-200 dark:hover:bg-space-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative flex-1 min-h-0 overflow-hidden cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="block w-full h-full touch-none"
        />

        {/* Floating Quick Selection Pill Bar at Canvas Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 p-1.5 rounded-2xl bg-sand-100/90 dark:bg-space-950/85 border border-sand-300 dark:border-ocean-900/60 shadow-xl backdrop-blur-md overflow-x-auto custom-scrollbar z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-sand-500 px-2 shrink-0 font-bold">
            WORLDS:
          </span>
          {ORRERY_PLANETS.map((planet) => {
            const isSelected = selectedBody?.id === planet.id;
            return (
              <button
                key={planet.id}
                onClick={() => setSelectedBody(planet)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-ocean-500 text-white font-bold shadow-md'
                    : 'text-sand-700 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-space-850'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: planet.color }}
                />
                <span>{planet.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Body Telemetry & Slew HUD Card (Top Right) */}
        {selectedMeta && (
          <div className="absolute top-3 right-3 z-20 w-80 max-w-[calc(100%-24px)] p-4 rounded-3xl bg-sand-50/98 dark:bg-space-900/98 border border-ocean-500/40 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 text-xs font-sans">
            {/* Header: Name + Badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: selectedMeta.color }}
                  />
                  <h3 className="font-display font-bold text-base text-sand-900 dark:text-sand-50 leading-tight">
                    {selectedMeta.name}
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-ocean-700 dark:text-ocean-400 font-semibold uppercase">
                  {selectedMeta.type || selectedMeta.category}
                </span>
              </div>

              <div className="text-right font-mono text-[10px] text-sand-500 shrink-0">
                <div>RA {selectedMeta.ra.toFixed(1)}°</div>
                <div>Dec {selectedMeta.dec >= 0 ? '+' : ''}{selectedMeta.dec.toFixed(1)}°</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11.5px] text-sand-700 dark:text-sand-300 leading-relaxed mb-3">
              {selectedMeta.desc}
            </p>

            {/* Scientific Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-sand-100/90 dark:bg-space-950/90 border border-sand-200 dark:border-ocean-900/60 font-mono text-[10px] mb-3">
              <div>
                <span className="text-sand-500 block">ORBIT DISTANCE:</span>
                <span className="font-bold text-sand-900 dark:text-sand-100">
                  {selectedMeta.semiMajorAU.toFixed(2)} AU ({(selectedMeta.semiMajorAU * 149.6).toFixed(0)}M km)
                </span>
              </div>
              <div>
                <span className="text-sand-500 block">ORBITAL PERIOD:</span>
                <span className="font-bold text-sand-900 dark:text-sand-100">
                  {selectedMeta.periodYears >= 1
                    ? `${selectedMeta.periodYears.toFixed(2)} yr`
                    : `${(selectedMeta.periodYears * 365.25).toFixed(0)} days`}
                </span>
              </div>
              <div>
                <span className="text-sand-500 block">DIAMETER:</span>
                <span className="font-bold text-sand-900 dark:text-sand-100">
                  {selectedMeta.diameter_km ? `${selectedMeta.diameter_km.toLocaleString()} km` : `${(selectedMeta.radiusKm * 2).toLocaleString()} km`}
                </span>
              </div>
              <div>
                <span className="text-sand-500 block">ORBIT SPEED:</span>
                <span className="font-bold text-sand-900 dark:text-sand-100">
                  {selectedMeta.speedKmS} km/s
                </span>
              </div>
              {selectedMeta.surface_temp_c && (
                <div className="col-span-2">
                  <span className="text-sand-500 block">SURFACE TEMP:</span>
                  <span className="font-bold text-sand-900 dark:text-sand-100">
                    {selectedMeta.surface_temp_c}
                  </span>
                </div>
              )}
              {selectedMeta.atmosphere && (
                <div className="col-span-2 border-t border-sand-200 dark:border-white/10 pt-1.5">
                  <span className="text-sand-500 block">ATMOSPHERE:</span>
                  <span className="text-ocean-700 dark:text-ocean-300">
                    {selectedMeta.atmosphere}
                  </span>
                </div>
              )}
            </div>

            {/* SPHEREx Infrared Science Fingerprint */}
            {selectedMeta.spherex_diag && (
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[10.5px] text-amber-900 dark:text-amber-200 mb-3 flex items-start gap-1.5 leading-snug">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block font-mono text-[9.5px] uppercase text-amber-700 dark:text-amber-300">
                    SPHEREx NIR Science
                  </strong>
                  <span>{selectedMeta.spherex_diag}</span>
                </div>
              </div>
            )}

            {/* Slew Button */}
            <button
              onClick={handleSlewToBody}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-ocean-500 hover:bg-ocean-600 text-white font-mono font-bold text-xs shadow-lg hover:shadow-ocean-500/30 transition-all group"
            >
              <span>Slew Telescope & Zoom In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
