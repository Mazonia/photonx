import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import useStore from '../store/useStore';
import Tooltip from './Tooltip';
import { api } from '../api/client';
import { CONSTELLATIONS } from '../data/constellations';
import { MASTER_CELESTIAL_TARGETS } from '../data/celestialCatalog';
import {
  drawJupiter,
  drawSaturn,
  drawMars,
  drawVenus,
  drawSun,
  drawEarth,
  drawMoon,
  drawUranus,
  drawNeptune,
  drawPluto,
  drawPlanetNine,
  drawAndromedaGalaxy,
  drawOrionNebula,
  drawPleiadesCluster,
  drawSagittariusA,
  drawTelescopeEyepieceMask,
  drawPrecisionReticle,
} from './CelestialRenderers';
import {
  ZoomIn,
  ZoomOut,
  Grid,
  Sparkles,
  Layers,
  Compass,
  Crosshair,
  Play,
  Pause,
  Scan,
  Eye,
  Camera,
  Orbit,
  Telescope,
} from 'lucide-react';

// Curated bright anchor stars & famous benchmarks with astrophysics metadata
const CATALOG_STARS = [
  // High proper motion / SPHEREx discovery benchmarks
  {
    name: "Barnard's Star",
    bayer: "V2500 Oph",
    ra: 269.4521,
    dec: 4.6933,
    mag: 9.54,
    type: 'M',
    mover: true,
    shiftRa: 0.0075,
    shiftDec: 0.0148,
    notes: 'Fastest-moving star in Earth sky (10.3"/yr). Red dwarf benchmark.',
  },
  {
    name: "WISE 0855-0714",
    bayer: "Cold Brown Dwarf",
    ra: 133.7933,
    dec: -7.2451,
    mag: 14.2,
    type: 'Y',
    mover: true,
    shiftRa: -0.0118,
    shiftDec: -0.0052,
    notes: 'Coldest known sub-stellar brown dwarf (~250 K). Planet X analog.',
  },
  {
    name: "Proxima Centauri",
    bayer: "α Cen C",
    ra: 217.4289,
    dec: -62.6795,
    mag: 11.13,
    type: 'M',
    mover: true,
    shiftRa: 0.0062,
    shiftDec: -0.0089,
    notes: 'Closest known stellar neighbor (4.24 ly). Flare star.',
  },
  // Solar System Worlds
  {
    name: "Mars",
    bayer: "Red Planet",
    ra: 75.4,
    dec: 24.1,
    mag: -1.2,
    type: 'Planet',
    isPlanet: true,
    notes: 'Terrestrial planet. Iron oxide regolith, Olympus Mons, seasonal polar frost.',
  },
  {
    name: "Jupiter",
    bayer: "Gas Giant",
    ra: 52.8,
    dec: 17.2,
    mag: -2.7,
    type: 'Planet',
    isPlanet: true,
    notes: 'Largest planet in Solar System. Great Red Spot & 95 known moons.',
  },
  {
    name: "Saturn",
    bayer: "Ringed World",
    ra: 347.1,
    dec: -8.4,
    mag: 0.6,
    type: 'Planet',
    isPlanet: true,
    notes: 'Jeweled gas giant with spectacular water-ice ring system & Titan.',
  },
  {
    name: "Neptune",
    bayer: "Ice Giant",
    ra: 358.5,
    dec: -2.3,
    mag: 7.8,
    type: 'Planet',
    isPlanet: true,
    notes: 'Outermost major planet with deep azure methane clouds & supersonic winds.',
  },
  {
    name: "Pluto",
    bayer: "Kuiper Belt",
    ra: 301.2,
    dec: -22.8,
    mag: 15.1,
    type: 'Planet',
    isPlanet: true,
    notes: 'Kuiper Belt dwarf planet with nitrogen-ice glaciers (Tombaugh Regio).',
  },
  {
    name: "Planet Nine (Hypothetical)",
    bayer: "Planet X Candidate",
    ra: 75.0,
    dec: 15.0,
    mag: 22.5,
    type: 'Planet',
    isPlanet: true,
    mover: true,
    shiftRa: 0.0035,
    shiftDec: 0.0021,
    notes: 'Hypothetical 5-10 M⊕ super-Earth in ~400-800 AU orbit. Prime SPHEREx mover target.',
  },
  {
    name: "Europa",
    bayer: "Jupiter II",
    ra: 52.8,
    dec: 17.2,
    mag: 5.3,
    type: 'Planet',
    isPlanet: true,
    notes: 'Global subsurface liquid water ocean (100 km deep) beneath 20-km ice shell.',
  },
  {
    name: "Titan",
    bayer: "Saturn VI",
    ra: 347.1,
    dec: -8.4,
    mag: 8.4,
    type: 'Planet',
    isPlanet: true,
    notes: '1.5-bar dense nitrogen atmosphere with liquid methane and ethane seas.',
  },
  {
    name: "Proxima b",
    bayer: "α Cen Cb",
    ra: 217.4289,
    dec: -62.6795,
    mag: 11.13,
    type: 'Exoplanet',
    isExoplanet: true,
    notes: 'Habitable-zone rocky exoplanet around closest star (4.25 ly).',
  },
  {
    name: "Kepler-186f",
    bayer: "KOI-571.05",
    ra: 298.6521,
    dec: 43.9550,
    mag: 14.6,
    type: 'Exoplanet',
    isExoplanet: true,
    notes: 'First validated Earth-sized planet in stellar habitable zone.',
  },
  {
    name: "Kepler-452b",
    bayer: "Earth 2.0",
    ra: 296.0250,
    dec: 44.2778,
    mag: 13.4,
    type: 'Exoplanet',
    isExoplanet: true,
    notes: "Earth's Older Cousin orbiting G2V solar twin star in 385-day orbit.",
  },
  {
    name: "TRAPPIST-1",
    bayer: "2MASS J23062928-0502285",
    ra: 346.6223,
    dec: -5.0413,
    mag: 18.8,
    type: 'M',
    mover: false,
    notes: 'Ultra-cool red dwarf with 7 temperate Earth-sized exoplanets.',
  },

  // Primary Navigational Anchor Stars (Diffraction Spike Standards)
  {
    name: "Sirius (Dog Star)",
    bayer: "α CMa",
    ra: 101.287,
    dec: -16.716,
    mag: -1.46,
    type: 'A',
    notes: 'Brightest star in night sky. Binary system with white dwarf companion.',
  },
  {
    name: "Canopus",
    bayer: "α Car",
    ra: 95.988,
    dec: -52.696,
    mag: -0.74,
    type: 'F',
    notes: 'Second-brightest star in sky. Bright F-type supergiant.',
  },
  {
    name: "Arcturus",
    bayer: "α Boo",
    ra: 213.915,
    dec: 19.182,
    mag: -0.05,
    type: 'K',
    notes: 'Orange giant star. Fastest-moving bright optical star.',
  },
  {
    name: "Vega",
    bayer: "α Lyr",
    ra: 279.234,
    dec: 38.784,
    mag: 0.03,
    type: 'A',
    notes: 'Photometric calibration standard (0.00 mag baseline). Pure white anchor.',
  },
  {
    name: "Capella",
    bayer: "α Aur",
    ra: 79.172,
    dec: 45.998,
    mag: 0.08,
    type: 'G',
    notes: 'Quadruple star system composed of two bright giant binary pairs.',
  },
  {
    name: "Rigel",
    bayer: "β Ori",
    ra: 78.634,
    dec: -8.202,
    mag: 0.13,
    type: 'B',
    notes: 'Luminous blue supergiant in Orion. 40,000x solar luminosity.',
  },
  {
    name: "Procyon",
    bayer: "α CMi",
    ra: 114.825,
    dec: 5.225,
    mag: 0.38,
    type: 'F',
    notes: 'Bright yellow-white subgiant star at 11.5 light-years.',
  },
  {
    name: "Betelgeuse",
    bayer: "α Ori",
    ra: 88.793,
    dec: 7.407,
    mag: 0.50,
    type: 'M',
    notes: 'Pulsating red supergiant. Near end-of-life supernova candidate.',
  },
  {
    name: "Altair",
    bayer: "α Aql",
    ra: 297.696,
    dec: 8.868,
    mag: 0.77,
    type: 'A',
    notes: 'Rapidly rotating white star flattened at poles by centrifugal force.',
  },
  {
    name: "Aldebaran",
    bayer: "α Tau",
    ra: 68.980,
    dec: 16.509,
    mag: 0.85,
    type: 'K',
    notes: 'Orange giant star, the fiery eye of Taurus the Bull.',
  },
  {
    name: "Spica",
    bayer: "α Vir",
    ra: 201.298,
    dec: -11.161,
    mag: 0.98,
    type: 'B',
    notes: 'Close spectroscopic binary star and rotating ellipsoidal variable.',
  },
  {
    name: "Antares",
    bayer: "α Sco",
    ra: 247.352,
    dec: -26.432,
    mag: 1.06,
    type: 'M',
    notes: 'Heart of the Scorpion. Huge red supergiant (700x solar radius).',
  },
  {
    name: "Pollux",
    bayer: "β Gem",
    ra: 116.329,
    dec: 28.026,
    mag: 1.14,
    type: 'K',
    notes: 'Evolved orange giant star in Gemini with confirmed exoplanet.',
  },
  {
    name: "Fomalhaut",
    bayer: "α PsA",
    ra: 344.413,
    dec: -29.622,
    mag: 1.16,
    type: 'A',
    notes: 'Young star with prominent circumstellar debris / dust ring.',
  },
  {
    name: "Deneb",
    bayer: "α Cyg",
    ra: 310.358,
    dec: 45.280,
    mag: 1.25,
    type: 'A',
    notes: 'Luminous blue-white supergiant at head of the Northern Cross.',
  },
  {
    name: "Polaris (North Star)",
    bayer: "α UMi",
    ra: 37.954,
    dec: 89.264,
    mag: 1.98,
    type: 'F',
    notes: 'Northern celestial pole anchor. Classical Cepheid variable star.',
  },

  // Deep Sky benchmark targets
  {
    name: "Messier 31 (Andromeda)",
    bayer: "NGC 224",
    ra: 10.6847,
    dec: 41.2687,
    mag: 3.44,
    type: 'Galaxy',
    notes: 'Nearest large spiral galaxy at 2.5 Mly. Pierced by SPHEREx infrared.',
  },
  {
    name: "Orion Nebula (M42)",
    bayer: "NGC 1976",
    ra: 83.8221,
    dec: -5.3911,
    mag: 4.0,
    type: 'Nebula',
    notes: 'Massive stellar nursery glowing in polycyclic aromatic hydrocarbons (PAH).',
  },
  {
    name: "Pleiades (M45)",
    bayer: "Seven Sisters",
    ra: 56.6011,
    dec: 24.1141,
    mag: 1.6,
    type: 'Cluster',
    notes: 'Open star cluster enveloped in reflective interstellar dust.',
  },
  {
    name: "Sagittarius A* (MW Core)",
    bayer: "Galactic Center",
    ra: 266.4168,
    dec: -29.0078,
    mag: 12.0,
    type: 'BlackHole',
    notes: 'Supermassive black hole at Milky Way core (4.3 million solar masses).',
  },
];

// Spectral type colors for authentic astrophysics
const SPECTRAL_COLORS = {
  O: { dark: '#93C5FD', light: '#1D4ED8', glow: 'rgba(147, 197, 253, 0.4)' },
  B: { dark: '#BAE6FD', light: '#0284C7', glow: 'rgba(186, 230, 253, 0.4)' },
  A: { dark: '#F8FAFC', light: '#0F172A', glow: 'rgba(248, 250, 252, 0.4)' },
  F: { dark: '#FEF9C3', light: '#854D0E', glow: 'rgba(254, 249, 195, 0.35)' },
  G: { dark: '#FDE047', light: '#CA8A04', glow: 'rgba(253, 224, 71, 0.4)' },
  K: { dark: '#FB923C', light: '#C2410C', glow: 'rgba(251, 146, 60, 0.45)' },
  M: { dark: '#F87171', light: '#B91C1C', glow: 'rgba(248, 113, 113, 0.45)' },
  Y: { dark: '#D97706', light: '#9A3412', glow: 'rgba(217, 119, 6, 0.5)' },
  Galaxy: { dark: '#C084FC', light: '#7E22CE', glow: 'rgba(192, 132, 252, 0.3)' },
  Nebula: { dark: '#2DD4BF', light: '#0F766E', glow: 'rgba(45, 212, 191, 0.3)' },
  Cluster: { dark: '#FDE047', light: '#B45309', glow: 'rgba(253, 224, 71, 0.3)' },
  BlackHole: { dark: '#E879F9', light: '#86198F', glow: 'rgba(232, 121, 249, 0.3)' },
  Planet: { dark: '#F59E0B', light: '#D97706', glow: 'rgba(245, 158, 11, 0.5)' },
  Exoplanet: { dark: '#2DD4BF', light: '#0D9488', glow: 'rgba(45, 212, 191, 0.5)' },
};

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function drawDiffractionSpikes(ctx, x, y, length, color, alpha) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x - length, y);
  ctx.lineTo(x + length, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - length);
  ctx.lineTo(x, y + length);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - length * 0.35, y);
  ctx.lineTo(x + length * 0.35, y);
  ctx.moveTo(x, y - length * 0.35);
  ctx.lineTo(x, y + length * 0.35);
  ctx.stroke();

  ctx.restore();
}

function getPlanetarySymbol(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('sun') || n.includes('sol')) return '☉';
  if (n.includes('mercury')) return '☿';
  if (n.includes('venus')) return '♀';
  if (n.includes('earth')) return '♁';
  if (n.includes('moon') || n.includes('luna')) return '☾';
  if (n.includes('mars')) return '♂';
  if (n.includes('ceres')) return '⚳';
  if (n.includes('vesta')) return '⚴';
  if (n.includes('jupiter')) return '♃';
  if (n.includes('saturn')) return '♄';
  if (n.includes('uranus')) return '♅';
  if (n.includes('neptune')) return '♆';
  if (n.includes('pluto')) return '♇';
  if (n.includes('planet nine') || n.includes('planet 9') || n.includes('planet x')) return '⯓';
  return '🪐';
}

function drawTargetBadge(ctx, x, y, radius, target, theme, isBlinking, blinkEpoch, activeEpoch) {
  ctx.save();
  const tx = Math.round(x + radius + 6);
  const ty1 = Math.round(y + 2);
  const ty2 = Math.round(y + 14);
  const ty3 = Math.round(y + 26);

  ctx.fillStyle = target.mover
    ? theme === 'dark' ? '#F59E0B' : '#D97706'
    : target.isPlanet
      ? theme === 'dark' ? '#38BDF8' : '#0284C7'
      : theme === 'dark' ? '#F8FAFC' : '#0F172A';
  ctx.font = '700 11.5px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(target.name, tx, ty1);

  ctx.fillStyle = theme === 'dark' ? '#94A3B8' : '#64748B';
  ctx.font = '500 10px "JetBrains Mono", monospace';
  const magText = target.mag !== undefined
    ? `Mag ${target.mag.toFixed(1)}${target.bayer ? ` · ${target.bayer}` : target.orbit ? ` · ${target.orbit}` : ''}`
    : target.type || 'Celestial Object';
  ctx.fillText(magText, tx, ty2);

  if (target.mover) {
    ctx.fillStyle = theme === 'dark' ? '#38BDF8' : '#0284C7';
    ctx.font = '600 9.5px "JetBrains Mono", monospace';
    const arcsecShift = (Math.hypot(target.shiftRa || 0, target.shiftDec || 0) * 3600).toFixed(1);
    ctx.fillText(
      `Δ ${arcsecShift}" · ${isBlinking ? `Epoch ${blinkEpoch}` : activeEpoch}`,
      tx,
      ty3
    );
  }
  ctx.restore();
}

export default function InteractiveSkyEngine() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const {
    ra,
    dec,
    setPosition,
    targetName,
    fov,
    setFov,
    showGrid,
    toggleGrid,
    showConstellations,
    toggleConstellations,
    surveyLayer,
    setSurveyLayer,
    isBlinking,
    setIsBlinking,
    activeEpoch,
    activeChannel,
    theme,
    showMoversOverlay,
    toggleMoversOverlay,
    setSelectedObject,
    openNavigator,
  } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, ra: 0, dec: 0 });
  const [blinkEpoch, setBlinkEpoch] = useState('A');
  const [cursorCoords, setCursorCoords] = useState({ ra: 0, dec: 0 });
  const [hoveredStar, setHoveredStar] = useState(null);
  const [showRealImagery, setShowRealImagery] = useState(false);
  const [nasaImage, setNasaImage] = useState(null);
  const [isImageryLoading, setIsImageryLoading] = useState(false);
  const [showEyepieceFrame, setShowEyepieceFrame] = useState(false);
  const dragInfoRef = useRef({ startX: 0, startY: 0, startTime: 0 });

  // Unified master celestial targets pool combining catalog anchors and solar system / deep space worlds
  const allCelestialTargets = useMemo(() => {
    const map = new Map();
    CATALOG_STARS.forEach((s) => map.set(s.name.toLowerCase(), s));
    MASTER_CELESTIAL_TARGETS.forEach((t) => {
      const key = t.name.toLowerCase();
      const existing = map.get(key);
      const isPlanet =
        (t.category && (t.category.includes('Planet') || t.category === 'Moon')) ||
        t.category === 'Solar System Star' ||
        t.category === 'Asteroid' ||
        t.category === 'Comet';
      const isExo = (t.category && t.category.includes('Exoplanet')) || (t.type && t.type.includes('Exoplanet'));
      map.set(key, {
        ...existing,
        ...t,
        isPlanet: existing?.isPlanet || isPlanet,
        isExoplanet: existing?.isExoplanet || isExo,
        type: t.category === 'Solar System Star' ? 'Sun' : existing?.type || t.type || 'Star',
      });
    });
    return Array.from(map.values());
  }, []);

  useEffect(() => {
    if (!isBlinking) return;
    const interval = setInterval(() => {
      setBlinkEpoch((prev) => (prev === 'A' ? 'B' : 'A'));
    }, 600);
    return () => clearInterval(interval);
  }, [isBlinking]);

  useEffect(() => {
    if (!showRealImagery) return;
    let isCurrent = true;
    setIsImageryLoading(true);

    const timer = setTimeout(async () => {
      try {
        const queryFov = Math.max(0.1, Math.min(2.5, fov));
        const res = await api.skyview(ra, dec, surveyLayer, 500, queryFov);
        if (isCurrent && res && res.image_base64) {
          const img = new Image();
          img.src = res.image_base64.startsWith('data:')
            ? res.image_base64
            : `data:image/png;base64,${res.image_base64}`;
          img.onload = () => {
            if (isCurrent) {
              setNasaImage(img);
              setIsImageryLoading(false);
            }
          };
          img.onerror = () => {
            if (isCurrent) {
              setNasaImage(null);
              setIsImageryLoading(false);
            }
          };
        } else if (isCurrent) {
          setNasaImage(null);
          setIsImageryLoading(false);
        }
      } catch (err) {
        if (isCurrent) {
          setNasaImage(null);
          setIsImageryLoading(false);
        }
      }
    }, 250);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [ra, dec, surveyLayer, fov, showRealImagery]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, []);

  useEffect(() => {
    resizeCanvas();
    const container = containerRef.current;
    let observer;
    if (container && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        resizeCanvas();
      });
      observer.observe(container);
    }
    window.addEventListener('resize', resizeCanvas);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.18 : 0.85;
      setFov(Math.max(0.05, Math.min(45.0, fov * factor)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [fov, setFov]);

  const limitingMag = useMemo(() => {
    return Math.min(18.0, 6.2 + Math.log2(35.0 / Math.max(0.05, fov)) * 1.9);
  }, [fov]);

  // Hierarchical Multi-Resolution Starfield (Regional Stars + Deep-Field Infrared Sources)
  const backgroundStars = useMemo(() => {
    const stars = [];
    const spectralTypes = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];

    // 1. Regional Stars
    const patchRadius = Math.max(1.5, fov * 1.4);
    const minRa = Math.floor(ra - patchRadius);
    const maxRa = Math.ceil(ra + patchRadius);
    const minDec = Math.max(-90, Math.floor(dec - patchRadius));
    const maxDec = Math.min(90, Math.ceil(dec + patchRadius));

    for (let r = minRa; r <= maxRa; r++) {
      for (let d = minDec; d <= maxDec; d++) {
        const cellSeed = ((((r % 360) + 360) % 360) * 1000 + (d + 90)) * 17;
        const count = 35 + Math.floor(pseudoRandom(cellSeed) * 20);

        for (let i = 0; i < count; i++) {
          const starSeed = cellSeed + i * 137.5;
          const sRa = (((r + pseudoRandom(starSeed)) % 360) + 360) % 360;
          const sDec = Math.max(-90, Math.min(90, d + pseudoRandom(starSeed + 1)));

          const p = pseudoRandom(starSeed + 2);
          const mag = 4.0 + Math.pow(p, 0.45) * 13.5;

          const typeIdx = Math.floor(pseudoRandom(starSeed + 3) * spectralTypes.length);
          const type = spectralTypes[typeIdx];

          stars.push({
            ra: sRa,
            dec: sDec,
            mag,
            type,
            id: `star-${r}-${d}-${i}`,
          });
        }
      }
    }

    // 2. High-Density Deep-Field Sub-Arcminute Infrared Point Sources (when FOV < 3.0°)
    // This solves "nothing really shows when you zoom in" by populating rich infrared cosmos
    if (fov < 3.0) {
      const deepCount = Math.floor(Math.min(130, 45 + (3.0 - fov) * 45));
      const deepSeed = (Math.floor(ra * 10) * 31337 + Math.floor(dec * 10) * 1337) % 100000;
      const fovRadius = fov * 0.92;
      const cosDec = Math.cos((dec * Math.PI) / 180);

      for (let j = 0; j < deepCount; j++) {
        const sSeed = deepSeed + j * 97.31;
        const angle = pseudoRandom(sSeed) * Math.PI * 2;
        const dist = Math.sqrt(pseudoRandom(sSeed + 1)) * fovRadius;

        const deltaRa = (Math.cos(angle) * dist) / Math.max(0.01, cosDec);
        const sRa = (((ra + deltaRa) % 360) + 360) % 360;
        const sDec = Math.max(-90, Math.min(90, dec + Math.sin(angle) * dist));

        const p = pseudoRandom(sSeed + 2);
        // Faint infrared sources: magnitudes 11.5 to 18.0
        const mag = 11.5 + Math.pow(p, 0.55) * 6.5;
        const isGalaxy = pseudoRandom(sSeed + 3) > 0.88;
        const typeIdx = Math.floor(pseudoRandom(sSeed + 4) * spectralTypes.length);

        stars.push({
          ra: sRa,
          dec: sDec,
          mag,
          type: isGalaxy ? 'Galaxy' : spectralTypes[typeIdx],
          isDeepField: true,
          id: `deep-${j}`,
        });
      }
    }

    return stars;
  }, [ra, dec, fov]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const dpr = window.devicePixelRatio || 1;

      // Cleanly clear full pixel buffer before scaling to prevent ghosting and accumulated antialiasing blur
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.scale(dpr, dpr);
      const w = width / dpr;
      const h = height / dpr;
      const centerX = Math.round(w / 2);
      const centerY = Math.round(h / 2);
      const pixelsPerDegree = Math.min(w, h) / fov;
      const decRad = (dec * Math.PI) / 180;
      const cosDec = Math.cos(decRad);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if ('textRendering' in ctx) {
        ctx.textRendering = 'geometricPrecision';
      }

      // 1. Background Void Fill
      if (theme === 'dark') {
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, Math.max(w, h) * 0.85);
        if (surveyLayer === 'spherex') {
          bgGrad.addColorStop(0, '#040916');
          bgGrad.addColorStop(0.5, '#020610');
          bgGrad.addColorStop(1, '#010206');
        } else if (surveyLayer === 'wise') {
          bgGrad.addColorStop(0, '#10061A');
          bgGrad.addColorStop(0.6, '#06020A');
          bgGrad.addColorStop(1, '#020104');
        } else if (surveyLayer === '2mass') {
          bgGrad.addColorStop(0, '#140A04');
          bgGrad.addColorStop(0.6, '#080402');
          bgGrad.addColorStop(1, '#020100');
        } else {
          bgGrad.addColorStop(0, '#03050C');
          bgGrad.addColorStop(1, '#010205');
        }
        ctx.fillStyle = bgGrad;
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#F8FAFC');
        bgGrad.addColorStop(1, '#EDF2F7');
        ctx.fillStyle = bgGrad;
      }
      ctx.fillRect(0, 0, w, h);

      // 2. Real NASA Survey Imagery Layer (Framed Circular Optical Lens)
      if (showRealImagery && nasaImage) {
        ctx.save();
        const imgSizePx = pixelsPerDegree * Math.max(0.1, Math.min(2.5, fov));
        const radius = imgSizePx * 0.48;

        // Circular aperture mask to prevent harsh rectangular edge noise
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();

        if (theme === 'dark') {
          ctx.globalAlpha = 0.65;
          ctx.globalCompositeOperation = 'screen';
        } else {
          ctx.globalAlpha = 0.35;
          ctx.globalCompositeOperation = 'multiply';
        }

        ctx.drawImage(nasaImage, centerX - imgSizePx / 2, centerY - imgSizePx / 2, imgSizePx, imgSizePx);
        ctx.restore();

        // Subtle glowing aperture ring
        ctx.save();
        ctx.strokeStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Coordinate Gridlines (Equatorial RA/Dec)
      if (showGrid) {
        ctx.save();
        ctx.strokeStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.14)' : 'rgba(15, 23, 42, 0.1)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);

        const raStep = fov > 20 ? 15 : fov > 5 ? 2 : fov > 1 ? 0.5 : 0.1;
        const decStep = fov > 20 ? 10 : fov > 5 ? 2 : fov > 1 ? 0.5 : 0.1;

        const minDec = Math.max(-90, dec - fov / 2);
        const maxDec = Math.min(90, dec + fov / 2);
        for (let d = Math.floor(minDec / decStep) * decStep; d <= maxDec; d += decStep) {
          const y = centerY - (d - dec) * pixelsPerDegree;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();

          ctx.fillStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.75)' : 'rgba(15, 23, 42, 0.65)';
          ctx.font = '600 10.5px "JetBrains Mono", monospace';
          ctx.fillText(`${d >= 0 ? '+' : ''}${d.toFixed(d < 1 && d > -1 ? 2 : 1)}°`, 8, Math.round(y - 4));
        }

        for (let r = 0; r < 360; r += raStep) {
          let deltaRa = r - ra;
          while (deltaRa > 180) deltaRa -= 360;
          while (deltaRa < -180) deltaRa -= 360;

          const x = centerX - deltaRa * pixelsPerDegree * cosDec;
          if (x >= 0 && x <= w) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();

            ctx.fillStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.75)' : 'rgba(15, 23, 42, 0.65)';
            ctx.font = '600 10.5px "JetBrains Mono", monospace';
            const hours = (r / 15).toFixed(1);
            ctx.fillText(`${hours}h`, Math.round(x + 4), Math.round(h - 8));
          }
        }
        ctx.restore();
      }

      // 3.5. Constellations & Asterisms (Ursa Major, Orion, Cassiopeia, Ophiuchus)
      // Only render constellation figures when FOV >= 5.0° (when zoomed in, hide to avoid single random lines cutting across deep fields)
      if (showConstellations && fov >= 5.0) {
        const constAlpha = Math.min(1.0, (fov - 5.0) / 2.5);
        ctx.save();
        ctx.globalAlpha = constAlpha * (theme === 'dark' ? 0.65 : 0.45);
        ctx.strokeStyle = theme === 'dark' ? '#38BDF8' : '#0284C7';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 4]);

        CONSTELLATIONS.forEach((c) => {
          let visibleLineCount = 0;
          let sumX = 0;
          let sumY = 0;

          c.lines.forEach((line) => {
            let deltaRa1 = line.from.ra - ra;
            while (deltaRa1 > 180) deltaRa1 -= 360;
            while (deltaRa1 < -180) deltaRa1 += 360;

            let deltaRa2 = line.to.ra - ra;
            while (deltaRa2 > 180) deltaRa2 -= 360;
            while (deltaRa2 < -180) deltaRa2 += 360;

            const x1 = centerX - deltaRa1 * pixelsPerDegree * cosDec;
            const y1 = centerY - (line.from.dec - dec) * pixelsPerDegree;

            const x2 = centerX - deltaRa2 * pixelsPerDegree * cosDec;
            const y2 = centerY - (line.to.dec - dec) * pixelsPerDegree;

            if (
              (x1 >= -80 && x1 <= w + 80 && y1 >= -80 && y1 <= h + 80) ||
              (x2 >= -80 && x2 <= w + 80 && y2 >= -80 && y2 <= h + 80)
            ) {
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();

              // Anchor nodes with star names
              ctx.beginPath();
              ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
              ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = theme === 'dark' ? '#38BDF8' : '#0284C7';
              ctx.fill();

              if (line.from.name && fov < 28) {
                ctx.fillStyle = theme === 'dark' ? 'rgba(224, 242, 254, 0.85)' : 'rgba(3, 105, 161, 0.85)';
                ctx.font = '600 9.5px "Plus Jakarta Sans", sans-serif';
                ctx.fillText(line.from.name, Math.round(x1 + 4), Math.round(y1 - 4));
              }

              sumX += (x1 + x2) / 2;
              sumY += (y1 + y2) / 2;
              visibleLineCount++;
            }
          });

          // Draw constellation title tag
          if (visibleLineCount > 0) {
            const labelX = sumX / visibleLineCount;
            const labelY = sumY / visibleLineCount;
            if (labelX >= 30 && labelX <= w - 30 && labelY >= 30 && labelY <= h - 30) {
              ctx.save();
              ctx.fillStyle = theme === 'dark' ? 'rgba(125, 211, 252, 0.95)' : 'rgba(3, 105, 161, 0.95)';
              ctx.font = '700 11.5px "Plus Jakarta Sans", sans-serif';
              ctx.textAlign = 'center';
              ctx.shadowColor = theme === 'dark' ? '#020617' : '#FFFFFF';
              ctx.shadowBlur = 6;
              ctx.fillText(c.name.toUpperCase(), Math.round(labelX), Math.round(labelY - 10));
              ctx.restore();
            }
          }
        });
        ctx.restore();
      }

      // 3.8. SPHEREx Infrared Detector Pixel Grid (When FOV < 0.4°)
      if (fov < 0.4) {
        ctx.save();
        ctx.strokeStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.08)';
        ctx.lineWidth = 0.8;
        const pixelPitchDeg = 6.2 / 3600; // 6.2 arcsec per pixel
        const pixelPx = pixelPitchDeg * pixelsPerDegree;
        if (pixelPx > 8) {
          const startX = (centerX % pixelPx);
          const startY = (centerY % pixelPx);
          for (let px = startX; px < w; px += pixelPx) {
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, h);
            ctx.stroke();
          }
          for (let py = startY; py < h; py += pixelPx) {
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(w, py);
            ctx.stroke();
          }
          ctx.fillStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.65)' : 'rgba(15, 23, 42, 0.6)';
          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.fillText(`SPHEREx FPA Detector Grid: 6.2″/px (${pixelPx.toFixed(0)}px/detector)`, 14, Math.round(h - 32));
        }
        ctx.restore();
      }

      // 4. Render Deterministic Astronomical Starfield
      backgroundStars.forEach((star) => {
        if (star.mag > limitingMag + 0.5) return;

        let deltaRa = star.ra - ra;
        while (deltaRa > 180) deltaRa -= 360;
        while (deltaRa < -180) deltaRa += 360;

        const sx = centerX - deltaRa * pixelsPerDegree * cosDec;
        const sy = centerY - (star.dec - dec) * pixelsPerDegree;

        if (sx >= -25 && sx <= w + 25 && sy >= -25 && sy <= h + 25) {
          const depthFade = Math.max(0.1, Math.min(1.0, limitingMag - star.mag));
          const colorDef = SPECTRAL_COLORS[star.type] || SPECTRAL_COLORS.A;
          const starColor = theme === 'dark' ? colorDef.dark : colorDef.light;

          const baseRadius = Math.max(0.8, Math.min(4.8, 5.0 - star.mag * 0.28));

          ctx.beginPath();
          ctx.arc(sx, sy, baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = starColor;
          ctx.globalAlpha = depthFade * (theme === 'dark' ? 0.95 : 0.85);
          ctx.fill();

          if (star.mag < 4.5) {
            const haloGrad = ctx.createRadialGradient(sx, sy, baseRadius, sx, sy, baseRadius * 4.5);
            haloGrad.addColorStop(0, colorDef.glow);
            haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = haloGrad;
            ctx.globalAlpha = depthFade * 0.7;
            ctx.beginPath();
            ctx.arc(sx, sy, baseRadius * 4.5, 0, Math.PI * 2);
            ctx.fill();

            const spikeLength = Math.max(6, (5.0 - star.mag) * 9 * (fov < 2 ? 1.4 : 1.0));
            drawDiffractionSpikes(ctx, sx, sy, spikeLength, starColor, depthFade * 0.75);
          }
        }
      });
      ctx.globalAlpha = 1.0;

      // 5. Render Curated Catalog Targets, Photorealistic Planets & Benchmark Sources
      let closestTargetToCenter = null;

      allCelestialTargets.forEach((target) => {
        let deltaRa = target.ra - ra;
        while (deltaRa > 180) deltaRa -= 360;
        while (deltaRa < -180) deltaRa += 360;

        let currentDeltaRa = deltaRa;
        let currentDec = target.dec;
        const isCurrentlyMover = target.mover && showMoversOverlay;

        if (isCurrentlyMover && isBlinking && blinkEpoch === 'B') {
          currentDeltaRa += target.shiftRa || 0;
          currentDec += target.shiftDec || 0;
        }

        const x = centerX - currentDeltaRa * pixelsPerDegree * cosDec;
        const y = centerY - (currentDec - dec) * pixelsPerDegree;

        if (x >= -120 && x <= w + 120 && y >= -120 && y <= h + 120) {
          // Check proximity to optical center for reticle target lock-on
          const distToCenter = Math.hypot(x - centerX, y - centerY);
          if (distToCenter < 40 && (!closestTargetToCenter || distToCenter < closestTargetToCenter.dist)) {
            closestTargetToCenter = { target, dist: distToCenter, x, y };
          }

          const lowerName = target.name.toLowerCase();
          const isSolar = target.isPlanet || (target.category && (target.category.includes('Solar') || target.category === 'Moon' || target.category === 'Dwarf Planet' || target.category === 'Asteroid' || target.category === 'Comet'));

          // HIGH-MAGNIFICATION TELESCOPIC RESOLVED DISK RENDERING (FOV < 1.8°)
          if (fov < 1.8) {
            if (lowerName.includes('jupiter')) {
              const jupR = Math.max(14, Math.min(110, 26 / fov));
              drawJupiter(ctx, x, y, jupR, fov, theme);
              drawTargetBadge(ctx, x, y, jupR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('saturn')) {
              const satR = Math.max(12, Math.min(90, 22 / fov));
              drawSaturn(ctx, x, y, satR, fov, theme);
              drawTargetBadge(ctx, x, y, satR * 1.6, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('mars')) {
              const marsR = Math.max(8, Math.min(75, 15 / fov));
              drawMars(ctx, x, y, marsR, fov, theme);
              drawTargetBadge(ctx, x, y, marsR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('venus')) {
              const venR = Math.max(9, Math.min(80, 16 / fov));
              drawVenus(ctx, x, y, venR, fov, theme);
              drawTargetBadge(ctx, x, y, venR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('sun') || lowerName.includes('sol')) {
              const sunR = Math.max(16, Math.min(125, 30 / fov));
              drawSun(ctx, x, y, sunR, fov, theme);
              drawTargetBadge(ctx, x, y, sunR * 1.2, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('earth') && !lowerName.includes('2.0') && !lowerName.includes('cousin')) {
              const earthR = Math.max(10, Math.min(85, 18 / fov));
              drawEarth(ctx, x, y, earthR, fov, theme);
              drawTargetBadge(ctx, x, y, earthR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('moon') || lowerName.includes('luna')) {
              const moonR = Math.max(12, Math.min(95, 24 / fov));
              drawMoon(ctx, x, y, moonR, fov, theme);
              drawTargetBadge(ctx, x, y, moonR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('uranus')) {
              const uraR = Math.max(8, Math.min(65, 14 / fov));
              drawUranus(ctx, x, y, uraR, fov, theme);
              drawTargetBadge(ctx, x, y, uraR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('neptune')) {
              const nepR = Math.max(8, Math.min(65, 14 / fov));
              drawNeptune(ctx, x, y, nepR, fov, theme);
              drawTargetBadge(ctx, x, y, nepR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('pluto')) {
              const pluR = Math.max(6, Math.min(48, 10 / fov));
              drawPluto(ctx, x, y, pluR, fov, theme);
              drawTargetBadge(ctx, x, y, pluR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('planet nine') || lowerName.includes('planet 9') || lowerName.includes('planet x')) {
              const p9R = Math.max(8, Math.min(60, 13 / fov));
              drawPlanetNine(ctx, x, y, p9R, fov, theme);
              drawTargetBadge(ctx, x, y, p9R, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('andromeda') || lowerName.includes('m31')) {
              const m31R = Math.max(18, Math.min(145, 36 / fov));
              drawAndromedaGalaxy(ctx, x, y, m31R, fov, theme);
              drawTargetBadge(ctx, x, y, m31R, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('orion nebula') || lowerName.includes('m42')) {
              const m42R = Math.max(18, Math.min(135, 34 / fov));
              drawOrionNebula(ctx, x, y, m42R, fov, theme);
              drawTargetBadge(ctx, x, y, m42R, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('pleiades') || lowerName.includes('m45')) {
              const pleiR = Math.max(18, Math.min(140, 35 / fov));
              drawPleiadesCluster(ctx, x, y, pleiR, fov, theme);
              drawTargetBadge(ctx, x, y, pleiR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
            if (lowerName.includes('sagittarius a*') || lowerName.includes('sgr a*')) {
              const sgrR = Math.max(12, Math.min(80, 20 / fov));
              drawSagittariusA(ctx, x, y, sgrR, fov, theme);
              drawTargetBadge(ctx, x, y, sgrR, target, theme, isBlinking, blinkEpoch, activeEpoch);
              return;
            }
          }

          // STANDARD OBSERVATORY ALL-SKY / INTERMEDIATE RENDERING
          const colorDef = SPECTRAL_COLORS[target.type] || (isSolar ? SPECTRAL_COLORS.Planet : SPECTRAL_COLORS.A);
          const targetColor = target.mover
            ? theme === 'dark' ? '#F59E0B' : '#D97706'
            : isSolar
              ? theme === 'dark' ? '#38BDF8' : '#0284C7'
              : theme === 'dark' ? colorDef.dark : colorDef.light;

          const baseSize = isSolar
            ? Math.max(4.5, Math.min(9.0, 7.5 - (target.mag || 5) * 0.2))
            : Math.max(2.5, Math.min(6.5, 6.0 - (target.mag || 9) * 0.3));

          // Draw object disk
          ctx.beginPath();
          ctx.arc(x, y, baseSize, 0, Math.PI * 2);
          ctx.fillStyle = targetColor;
          ctx.fill();

          // Planet steady indicator ring (planets do not twinkle)
          if (isSolar) {
            ctx.save();
            ctx.strokeStyle = targetColor;
            ctx.globalAlpha = 0.45;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, baseSize + 4, 0, Math.PI * 2);
            ctx.stroke();

            // Draw planetary symbol
            const sym = getPlanetarySymbol(target.name);
            ctx.fillStyle = targetColor;
            ctx.font = '700 10.5px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(sym, Math.round(x), Math.round(y - baseSize - 5));
            ctx.restore();
          } else if (target.mag < 3.5) {
            // Bright optical stars get diffraction spikes
            const spikeLen = Math.max(12, (4.5 - target.mag) * 16);
            drawDiffractionSpikes(ctx, x, y, spikeLen, targetColor, 0.85);
          }

          if (isCurrentlyMover) {
            ctx.save();
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 2]);

            const pulse = (Math.sin(Date.now() / 180) * 0.5 + 0.5) * 5;
            ctx.beginPath();
            ctx.arc(x, y, baseSize + 7 + pulse, 0, Math.PI * 2);
            ctx.stroke();

            if (target.shiftRa || target.shiftDec) {
              const vectorLengthMult = Math.min(250, pixelsPerDegree * 8);
              const vectorX = x - (target.shiftRa || 0) * vectorLengthMult;
              const vectorY = y - (target.shiftDec || 0) * vectorLengthMult;
              ctx.setLineDash([]);
              ctx.strokeStyle = '#F59E0B';
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(vectorX, vectorY);
              ctx.stroke();

              const angle = Math.atan2(vectorY - y, vectorX - x);
              ctx.fillStyle = '#F59E0B';
              ctx.beginPath();
              ctx.moveTo(vectorX, vectorY);
              ctx.lineTo(vectorX - 6 * Math.cos(angle - Math.PI / 6), vectorY - 6 * Math.sin(angle - Math.PI / 6));
              ctx.lineTo(vectorX - 6 * Math.cos(angle + Math.PI / 6), vectorY - 6 * Math.sin(angle + Math.PI / 6));
              ctx.closePath();
              ctx.fill();
            }
            ctx.restore();
          }

          // Target name and magnitude badge
          drawTargetBadge(ctx, x, y, baseSize, target, theme, isBlinking, blinkEpoch, activeEpoch);
        }
      });

      // 6. High-Precision Reticle with Celestial Compass & Target Lock
      const targetLockInfo = closestTargetToCenter
        ? {
          name: closestTargetToCenter.target.name,
          radius: closestTargetToCenter.target.isPlanet ? 26 : 16,
          angularDia:
            closestTargetToCenter.target.name.includes('Jupiter')
              ? '46.8″ (Giant Oblate Disk)'
              : closestTargetToCenter.target.name.includes('Saturn')
                ? '18.4″ (Rings 42.1″)'
                : closestTargetToCenter.target.name.includes('Mars')
                  ? '14.2″ (Terrestrial Disk)'
                  : closestTargetToCenter.target.name.includes('Venus')
                    ? '24.5″ (Cloud Deck)'
                    : closestTargetToCenter.target.name.includes('Sun')
                      ? '32.1′ (Solar Disk)'
                      : closestTargetToCenter.target.name.includes('Moon')
                        ? '31.2′ (Lunar Surface)'
                        : closestTargetToCenter.target.isPlanet
                          ? 'Resolved Disc'
                          : null,
        }
        : targetName && !targetName.startsWith('Target (')
          ? {
            name: targetName,
            radius: 20,
            angularDia: null,
          }
          : null;

      drawPrecisionReticle(ctx, centerX, centerY, w, h, fov, theme, targetLockInfo);

      // 7. Telescope Eyepiece Frame Vignette (if toggled)
      if (showEyepieceFrame) {
        const eyepieceRadius = Math.min(w, h) * 0.46;
        drawTelescopeEyepieceMask(ctx, w, h, centerX, centerY, eyepieceRadius, theme);
      }

      // 7. Physical Field Scale Bar (Bottom Left)
      ctx.save();
      const scaleArcsec = Math.max(1, fov * 3600 * 0.15); // 15% of viewport
      const scaleBarWidthPx = (scaleArcsec / 3600) * pixelsPerDegree;
      const barX = 14;
      const barY = h - 16;
      ctx.strokeStyle = theme === 'dark' ? '#38BDF8' : '#0284C7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(barX, barY);
      ctx.lineTo(barX + scaleBarWidthPx, barY);
      ctx.moveTo(barX, barY - 4);
      ctx.lineTo(barX, barY + 4);
      ctx.moveTo(barX + scaleBarWidthPx, barY - 4);
      ctx.lineTo(barX + scaleBarWidthPx, barY + 4);
      ctx.stroke();

      ctx.fillStyle = theme === 'dark' ? '#E2E8F0' : '#1E293B';
      ctx.font = '600 10.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      const scaleLabel = scaleArcsec >= 60 ? `${(scaleArcsec / 60).toFixed(1)}′ (${scaleArcsec.toFixed(0)}″)` : `${scaleArcsec.toFixed(1)}″ arcsec`;
      ctx.fillText(`Scale: ${scaleLabel}`, barX, Math.round(barY - 7));
      ctx.restore();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    ra,
    dec,
    fov,
    showGrid,
    showConstellations,
    surveyLayer,
    isBlinking,
    blinkEpoch,
    theme,
    showMoversOverlay,
    backgroundStars,
    limitingMag,
    activeEpoch,
    showRealImagery,
    nasaImage,
    allCelestialTargets,
    showEyepieceFrame,
  ]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragInfoRef.current = { startX: e.clientX, startY: e.clientY, startTime: Date.now() };
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      ra,
      dec,
    });
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const w = rect.width;
    const h = rect.height;
    const pixelsPerDegree = Math.min(w, h) / fov;
    const cosDec = Math.cos((dec * Math.PI) / 180);

    const hoverDec = dec - (y - h / 2) / pixelsPerDegree;
    const hoverRa = (ra - (x - w / 2) / (pixelsPerDegree * cosDec) + 360) % 360;

    setCursorCoords({ ra: hoverRa, dec: hoverDec });

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      const newDec = Math.max(-90, Math.min(90, dragStart.dec + dy / pixelsPerDegree));
      const newRa = (dragStart.ra + (dx / pixelsPerDegree) / cosDec + 360) % 360;

      setPosition(newRa, newDec, null);
      setHoveredStar(null);
      return;
    }

    // Hit-testing for celestial target hover tooltip
    let found = null;

    // 1. Check Primary Celestial Targets (Planets, Moons, Anchors, Deep Sky)
    for (const target of allCelestialTargets) {
      let deltaRa = target.ra - ra;
      while (deltaRa > 180) deltaRa -= 360;
      while (deltaRa < -180) deltaRa += 360;
      const sx = w / 2 - deltaRa * pixelsPerDegree * cosDec;
      const sy = h / 2 - (target.dec - dec) * pixelsPerDegree;
      const hitRadius = target.isPlanet ? 26 : 18;
      if (Math.hypot(x - sx, y - sy) < hitRadius) {
        found = {
          ...target,
          screenX: x,
          screenY: y,
          isBrightAnchor: target.mag < 4.5,
        };
        break;
      }
    }

    // 2. Check Background / Deep-Field Stars
    if (!found) {
      for (const star of backgroundStars) {
        if (star.mag > limitingMag + 0.5) continue;
        let deltaRa = star.ra - ra;
        while (deltaRa > 180) deltaRa -= 360;
        while (deltaRa < -180) deltaRa += 360;
        const sx = w / 2 - deltaRa * pixelsPerDegree * cosDec;
        const sy = h / 2 - (star.dec - dec) * pixelsPerDegree;
        if (Math.hypot(x - sx, y - sy) < 14) {
          found = {
            name: star.isDeepField ? `Infrared Source #J${star.ra.toFixed(2)}${star.dec >= 0 ? '+' : ''}${star.dec.toFixed(2)}` : `Star at (${star.ra.toFixed(2)}°, ${star.dec.toFixed(2)}°)`,
            ra: star.ra,
            dec: star.dec,
            mag: star.mag,
            type: star.type,
            notes: star.isDeepField ? 'SPHEREx deep-field near-infrared point source (0.75-5.0µm)' : 'General catalog stellar source',
            screenX: x,
            screenY: y,
            isBrightAnchor: (star.mag < 4.5),
          };
          break;
        }
      }
    }

    setHoveredStar(found);
  };

  const handleDoubleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    const pixelsPerDegree = Math.min(w, h) / fov;
    const cosDec = Math.cos((dec * Math.PI) / 180);
    const clickDec = dec - (y - h / 2) / pixelsPerDegree;
    const clickRa = (ra - (x - w / 2) / (pixelsPerDegree * cosDec) + 360) % 360;

    // Slew and zoom in to target
    setFov(Math.max(0.05, fov * 0.45));
    if (hoveredStar) {
      setPosition(hoveredStar.ra, hoveredStar.dec, hoveredStar.name);
      setSelectedObject(hoveredStar);
    } else {
      setPosition(clickRa, clickDec, `Target (${clickRa.toFixed(4)}°, ${clickDec >= 0 ? '+' : ''}${clickDec.toFixed(4)}°)`);
    }
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dragDist = Math.hypot(e.clientX - dragInfoRef.current.startX, e.clientY - dragInfoRef.current.startY);
    const elapsed = Date.now() - dragInfoRef.current.startTime;

    // Detect Click (not drag)
    if (dragDist < 6 && elapsed < 350) {
      if (hoveredStar) {
        setPosition(hoveredStar.ra, hoveredStar.dec, hoveredStar.name);
        setSelectedObject(hoveredStar);
      } else {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;
        const pixelsPerDegree = Math.min(w, h) / fov;
        const cosDec = Math.cos((dec * Math.PI) / 180);
        const clickDec = dec - (y - h / 2) / pixelsPerDegree;
        const clickRa = (ra - (x - w / 2) / (pixelsPerDegree * cosDec) + 360) % 360;
        setPosition(clickRa, clickDec, `Target (${clickRa.toFixed(4)}°, ${clickDec >= 0 ? '+' : ''}${clickDec.toFixed(4)}°)`);
      }
    }
  };

  return (
    <div
      data-tour="sky-canvas"
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden bg-lab-50 dark:bg-space-950 font-sans"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        onDoubleClick={handleDoubleClick}
        className="block w-full h-full cursor-crosshair touch-none"
      />

      {/* Interactive Star Hover HUD Card */}
      {hoveredStar && !isDragging && (
        <div
          style={{
            left: `${Math.min(window.innerWidth - 330, Math.max(10, hoveredStar.screenX + 16))}px`,
            top: `${Math.min(window.innerHeight - 200, Math.max(20, hoveredStar.screenY - 20))}px`,
          }}
          className="absolute pointer-events-none z-30 p-3 rounded-2xl bg-sand-50/98 dark:bg-space-900/98 border border-ocean-500/40 shadow-2xl backdrop-blur-xl max-w-xs text-xs select-none animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5 truncate">
              {hoveredStar.isPlanet ? '🪐' : '⭐'} {hoveredStar.name}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-ocean-500/10 text-ocean-700 dark:text-ocean-300 font-mono text-[9px] font-bold shrink-0">
              {hoveredStar.category || hoveredStar.type || 'Object'}
            </span>
          </div>
          <div className="space-y-1 font-mono text-[10px] text-slate-600 dark:text-sand-200">
            <div>Coordinates: RA {hoveredStar.ra.toFixed(4)}° · Dec {hoveredStar.dec.toFixed(4)}°</div>
            <div>
              Brightness: Mag {hoveredStar.mag !== undefined ? hoveredStar.mag.toFixed(2) : '—'} {hoveredStar.isPlanet ? '(Solar System Body)' : hoveredStar.mag < 3 ? '(Naked-Eye Optical Anchor)' : '(Infrared Source)'}
            </div>
            {hoveredStar.diameter_km && (
              <div className="text-cyan-700 dark:text-cyan-300">
                Diameter: {hoveredStar.diameter_km.toLocaleString()} km
              </div>
            )}
            {hoveredStar.surface_temp_c !== undefined && (
              <div className="text-amber-700 dark:text-amber-300">
                Temp: {hoveredStar.surface_temp_c > 0 ? `+${hoveredStar.surface_temp_c}` : hoveredStar.surface_temp_c}°C
              </div>
            )}
            {hoveredStar.notes && (
              <div className="text-slate-600 dark:text-slate-300 pt-0.5 border-t border-sand-200 dark:border-white/10">
                {hoveredStar.notes}
              </div>
            )}
            {hoveredStar.isBrightAnchor && !hoveredStar.isPlanet && (
              <div className="text-[9.5px] text-ocean-800 dark:text-ocean-200 bg-ocean-500/15 border border-ocean-500/30 p-1.5 rounded-lg mt-1 font-sans leading-tight">
                ✨ <strong>Why big spikes?</strong> These are optical diffraction spikes from light bending around the telescope's secondary mirror spider vanes.
              </div>
            )}
          </div>
          <div className="mt-2 text-[9.5px] font-sans text-ocean-600 dark:text-ocean-400 font-semibold flex items-center gap-1">
            <span>👉 Click to select & lock reticle</span>
          </div>
        </div>
      )}

      {/* Top Left: Mission HUD & Survey Switcher */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-auto">
        <div data-tour="survey-switcher" className="relative z-20 flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2 font-bold">
            SURVEY:
          </span>
          {[
            { id: 'spherex', label: 'SPHEREx NIR', desc: '102 Near-Infrared Bands (0.75-5.0µm)' },
            { id: 'wise', label: 'WISE Mid-IR', desc: 'Wide-field Infrared Survey Explorer (3.4-22µm)' },
            { id: '2mass', label: '2MASS', desc: 'Two Micron All Sky Survey (J, H, Ks)' },
            { id: 'dss', label: 'DSS Optical', desc: 'Digitized Sky Survey (Visible Spectrum)' },
          ].map((s) => (
            <Tooltip key={s.id} content={s.desc} tag={s.label} position="bottom">
              <button
                onClick={() => setSurveyLayer(s.id)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all duration-200 ${surveyLayer === s.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-hud-glow'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
              >
                {s.label}
              </button>
            </Tooltip>
          ))}
        </div>

        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 shadow-lg backdrop-blur-md text-[11px] font-mono text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
            LIVE ORBIT
          </span>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span>FOV: {fov.toFixed(2)}°</span>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span className="text-cyan-600 dark:text-cyan-300">LIMIT: {limitingMag.toFixed(1)}mᵥ</span>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span className="text-amber-600 dark:text-amber-400">CH {activeChannel} (2.3µm)</span>
          {showConstellations && fov < 5.0 && (
            <>
              <span className="text-slate-400 dark:text-slate-500">|</span>
              <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                Constellations: Zoom Out (&gt;5°)
              </span>
            </>
          )}
        </div>

        {/* Quick Cosmic Worlds & Systems Navigator Pill */}
        <button
          onClick={openNavigator}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 shadow-md backdrop-blur-md transition-all duration-200 pointer-events-auto w-fit"
        >
          <Orbit className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          <span>Explore Planets & Systems</span>
        </button>
      </div>

      {/* Top Right: Observatory Controls (Blink, Real Imagery, Grid, Zoom) */}
      <div data-tour="sky-controls" className="absolute top-3 right-3 flex items-center gap-1.5 p-1 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 shadow-xl backdrop-blur-md z-10 pointer-events-auto">
        <Tooltip
          content="Toggle authentic NASA Goddard SkyView deep-space survey imagery underlay."
          tag="REAL IMAGERY"
          position="bottom"
        >
          <button
            onClick={() => setShowRealImagery(!showRealImagery)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all duration-200 ${showRealImagery
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-hud-glow'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isImageryLoading ? 'LOADING...' : 'REAL SKY'}</span>
          </button>
        </Tooltip>

        <div className="w-px h-5 bg-slate-300 dark:bg-white/10" />

        <Tooltip
          content="Blink Comparator: Rapidly alternates between Epoch A & B to isolate moving objects (asteroids, brown dwarfs, Planet X candidates)."
          tag="BLINK ENGINE"
          shortcut="Space"
          position="bottom"
        >
          <button
            onClick={() => setIsBlinking(!isBlinking)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all duration-200 ${isBlinking
                ? 'bg-amber-500 text-slate-950 shadow-amber-glow animate-pulse'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            {isBlinking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>BLINK ({blinkEpoch})</span>
          </button>
        </Tooltip>

        <div className="w-px h-5 bg-slate-300 dark:bg-white/10" />

        <Tooltip content="Toggle candidate mover identification rings and proper-motion displacement vectors (arcsec shift between epochs)." tag="MOVERS" shortcut="M" position="bottom-left">
          <button
            onClick={toggleMoversOverlay}
            className={`p-1.5 rounded-lg transition-colors ${showMoversOverlay
                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            <Scan className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Toggle J2000 Equatorial coordinate gridlines with RA (hours/deg) and Declination (°)." tag="GRID" shortcut="G" position="bottom-left">
          <button
            onClick={toggleGrid}
            className={`p-1.5 rounded-lg transition-colors ${showGrid
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Toggle IAU constellation boundaries, asterism vectors, and celestial navigational lore (Orion, Ursa Major, Cassiopeia, Ophiuchus)." tag="CONSTELLATIONS" shortcut="C" position="bottom-left">
          <button
            onClick={toggleConstellations}
            className={`p-1.5 rounded-lg transition-colors ${showConstellations
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Magnify celestial reticle (narrow FOV down to 0.05° deep field). Increases limiting magnitude to 18.0 mv." tag="ZOOM IN" shortcut="+" position="bottom-left">
          <button
            onClick={() => setFov(fov * 0.75)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Widen observatory aperture (up to 45° all-sky constellation perspective)." tag="ZOOM OUT" shortcut="-" position="bottom-left">
          <button
            onClick={() => setFov(fov * 1.33)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Reset optical field of view to standard 1.20° observatory target framing." tag="RESET" position="bottom-left">
          <button
            onClick={() => setFov(1.2)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="w-px h-5 bg-slate-300 dark:bg-white/10" />

        <Tooltip content="Toggle realistic circular telescope eyepiece barrel mask & vignette frame." tag="EYEPIECE" position="bottom-left">
          <button
            onClick={() => setShowEyepieceFrame(!showEyepieceFrame)}
            className={`p-1.5 rounded-lg transition-colors ${showEyepieceFrame
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {/* Bottom Center: Magnification Presets Bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-slate-900/85 border border-slate-300 dark:border-white/10 shadow-2xl backdrop-blur-md z-10 pointer-events-auto">
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2 font-bold hidden sm:inline">
          FOV:
        </span>
        {[
          { label: '30° ALL-SKY', fovVal: 30.0, tip: 'Wide all-sky constellation & Milky Way view' },
          { label: '10° WIDE', fovVal: 10.0, tip: 'Constellation asterism & wide starfield' },
          { label: '1.2° DEEP SKY', fovVal: 1.2, tip: 'Standard deep-sky telescope framing' },
          { label: '0.25° PLANET', fovVal: 0.25, tip: 'Planetary disk magnification & moon systems' },
          { label: '0.05° ULTRA', fovVal: 0.05, tip: 'Ultra-high resolution surface & ring inspection' },
        ].map((p) => {
          const isActive = Math.abs(fov - p.fovVal) < 0.04;
          return (
            <Tooltip key={p.label} content={p.tip} position="top">
              <button
                onClick={() => setFov(p.fovVal)}
                className={`px-2 py-1 text-[10px] font-mono rounded-lg transition-all duration-200 whitespace-nowrap ${isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-hud-glow'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
              >
                {p.label}
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* Bottom Left: Reticle Center Coordinates Readout */}
      <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 shadow-xl backdrop-blur-md font-mono text-xs z-10 pointer-events-auto">
        <div className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-1">
          CENTER TARGET
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 dark:text-white">{targetName || 'Custom Field'}</span>
          <span className="text-slate-400">|</span>
          <span className="text-cyan-600 dark:text-cyan-400">RA: {ra.toFixed(4)}°</span>
          <span className="text-cyan-600 dark:text-cyan-400">DEC: {dec >= 0 ? '+' : ''}{dec.toFixed(4)}°</span>
        </div>
      </div>

      {/* Bottom Right: Cursor Coordinates Readout */}
      <div className="absolute bottom-3 right-3 px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 shadow-xl backdrop-blur-md font-mono text-[11px] text-slate-500 dark:text-slate-400 z-10 pointer-events-none">
        <span>CURSOR: RA {cursorCoords.ra.toFixed(4)}° · DEC {cursorCoords.dec >= 0 ? '+' : ''}{cursorCoords.dec.toFixed(4)}°</span>
      </div>
    </div>
  );
}
