import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import useStore from '../store/useStore';
import Tooltip from './Tooltip';
import { api } from '../api/client';
import { CONSTELLATIONS } from '../data/constellations';
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
} from 'lucide-react';

// Curated bright anchor stars & famous benchmarks
const CATALOG_STARS = [
  // High proper motion / SPHEREx discovery benchmarks
  { name: "Barnard's Star", ra: 269.4521, dec: 4.6933, mag: 9.54, type: 'M', mover: true, shiftRa: 0.0075, shiftDec: 0.0148, notes: 'Fastest proper motion (10.3"/yr)' },
  { name: "WISE 0855-0714", ra: 133.7933, dec: -7.2451, mag: 14.2, type: 'Y', mover: true, shiftRa: -0.0118, shiftDec: -0.0052, notes: 'Coldest known brown dwarf (250K)' },
  { name: "Proxima Centauri", ra: 217.4289, dec: -62.6795, mag: 11.13, type: 'M', mover: true, shiftRa: 0.0062, shiftDec: -0.0089, notes: 'Closest known stellar neighbor' },
  { name: "TRAPPIST-1", ra: 346.6223, dec: -5.0413, mag: 18.8, type: 'M', mover: false, notes: '7 Earth-sized exoplanets' },
  
  // Bright optical anchors (diffraction spike benchmarks)
  { name: "Sirius", ra: 101.287, dec: -16.716, mag: -1.46, type: 'A' },
  { name: "Canopus", ra: 95.988, dec: -52.696, mag: -0.74, type: 'F' },
  { name: "Arcturus", ra: 213.915, dec: 19.182, mag: -0.05, type: 'K' },
  { name: "Vega", ra: 279.234, dec: 38.784, mag: 0.03, type: 'A' },
  { name: "Capella", ra: 79.172, dec: 45.998, mag: 0.08, type: 'G' },
  { name: "Rigel", ra: 78.634, dec: -8.202, mag: 0.13, type: 'B' },
  { name: "Procyon", ra: 114.825, dec: 5.225, mag: 0.38, type: 'F' },
  { name: "Betelgeuse", ra: 88.793, dec: 7.407, mag: 0.50, type: 'M' },
  { name: "Altair", ra: 297.696, dec: 8.868, mag: 0.77, type: 'A' },
  { name: "Aldebaran", ra: 68.980, dec: 16.509, mag: 0.85, type: 'K' },
  { name: "Spica", ra: 201.298, dec: -11.161, mag: 0.98, type: 'B' },
  { name: "Antares", ra: 247.352, dec: -26.432, mag: 1.06, type: 'M' },
  { name: "Pollux", ra: 116.329, dec: 28.026, mag: 1.14, type: 'K' },
  { name: "Fomalhaut", ra: 344.413, dec: -29.622, mag: 1.16, type: 'A' },
  { name: "Deneb", ra: 310.358, dec: 45.280, mag: 1.25, type: 'A' },
  { name: "Polaris", ra: 37.954, dec: 89.264, mag: 1.98, type: 'F' },

  // Deep Sky benchmark targets
  { name: "Messier 31 (Andromeda)", ra: 10.6847, dec: 41.2687, mag: 3.44, type: 'Galaxy' },
  { name: "Orion Nebula (M42)", ra: 83.8221, dec: -5.3911, mag: 4.0, type: 'Nebula' },
  { name: "Pleiades (M45)", ra: 56.6011, dec: 24.1141, mag: 1.6, type: 'Cluster' },
  { name: "Sagittarius A* (MW Core)", ra: 266.4168, dec: -29.0078, mag: 12.0, type: 'BlackHole' },
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
  } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, ra: 0, dec: 0 });
  const [blinkEpoch, setBlinkEpoch] = useState('A');
  const [cursorCoords, setCursorCoords] = useState({ ra: 0, dec: 0 });
  const [showRealImagery, setShowRealImagery] = useState(false);
  const [nasaImage, setNasaImage] = useState(null);
  const [isImageryLoading, setIsImageryLoading] = useState(false);

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
          img.src = `data:image/jpeg;base64,${res.image_base64}`;
          img.onload = () => {
            if (isCurrent) {
              setNasaImage(img);
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

  const backgroundStars = useMemo(() => {
    const stars = [];
    const patchRadius = Math.max(1.5, fov * 1.4);
    const minRa = Math.floor(ra - patchRadius);
    const maxRa = Math.ceil(ra + patchRadius);
    const minDec = Math.max(-90, Math.floor(dec - patchRadius));
    const maxDec = Math.min(90, Math.ceil(dec + patchRadius));

    const spectralTypes = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];

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
          });
        }
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

      ctx.save();
      ctx.scale(dpr, dpr);
      const w = width / dpr;
      const h = height / dpr;
      const centerX = w / 2;
      const centerY = h / 2;
      const pixelsPerDegree = Math.min(w, h) / fov;
      const decRad = (dec * Math.PI) / 180;
      const cosDec = Math.cos(decRad);

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

          ctx.fillStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.55)' : 'rgba(15, 23, 42, 0.5)';
          ctx.font = '10px "IBM Plex Mono", monospace';
          ctx.fillText(`${d >= 0 ? '+' : ''}${d.toFixed(d < 1 && d > -1 ? 2 : 1)}°`, 8, y - 4);
        }

        for (let r = 0; r < 360; r += raStep) {
          let deltaRa = r - ra;
          while (deltaRa > 180) deltaRa -= 360;
          while (deltaRa < -180) deltaRa += 360;

          const x = centerX - deltaRa * pixelsPerDegree * cosDec;
          if (x >= 0 && x <= w) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();

            ctx.fillStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.55)' : 'rgba(15, 23, 42, 0.5)';
            ctx.font = '10px "IBM Plex Mono", monospace';
            const hours = (r / 15).toFixed(1);
            ctx.fillText(`${hours}h`, x + 4, h - 8);
          }
        }
        ctx.restore();
      }

      // 3.5. Constellations & Asterisms (Ursa Major, Orion, Cassiopeia, Ophiuchus)
      if (showConstellations) {
        ctx.save();
        ctx.strokeStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.45)';
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

              // Anchor nodes
              ctx.beginPath();
              ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
              ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = theme === 'dark' ? '#38BDF8' : '#0284C7';
              ctx.fill();

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
              ctx.fillStyle = theme === 'dark' ? 'rgba(125, 211, 252, 0.9)' : 'rgba(3, 105, 161, 0.9)';
              ctx.font = 'bold 11px "IBM Plex Sans", sans-serif';
              ctx.textAlign = 'center';
              ctx.shadowColor = theme === 'dark' ? '#020617' : '#FFFFFF';
              ctx.shadowBlur = 6;
              ctx.fillText(c.name.toUpperCase(), labelX, labelY - 10);
              ctx.restore();
            }
          }
        });
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

      // 5. Render Curated Catalog Targets & High Proper-Motion Benchmark Sources
      CATALOG_STARS.forEach((star) => {
        let deltaRa = star.ra - ra;
        while (deltaRa > 180) deltaRa -= 360;
        while (deltaRa < -180) deltaRa += 360;

        let currentDeltaRa = deltaRa;
        let currentDec = star.dec;
        const isCurrentlyMover = star.mover && showMoversOverlay;

        if (isCurrentlyMover && isBlinking && blinkEpoch === 'B') {
          currentDeltaRa += star.shiftRa;
          currentDec += star.shiftDec;
        }

        const x = centerX - currentDeltaRa * pixelsPerDegree * cosDec;
        const y = centerY - (currentDec - dec) * pixelsPerDegree;

        if (x >= -45 && x <= w + 45 && y >= -45 && y <= h + 45) {
          const colorDef = SPECTRAL_COLORS[star.type] || SPECTRAL_COLORS.A;
          const targetColor = star.mover
            ? theme === 'dark' ? '#F59E0B' : '#D97706'
            : theme === 'dark' ? colorDef.dark : colorDef.light;

          const baseSize = Math.max(2.5, Math.min(6.5, 6.0 - (star.mag || 9) * 0.3));

          ctx.beginPath();
          ctx.arc(x, y, baseSize, 0, Math.PI * 2);
          ctx.fillStyle = targetColor;
          ctx.fill();

          if (star.mag < 3.0) {
            const spikeLen = Math.max(12, (4.0 - star.mag) * 16);
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

            if (star.shiftRa || star.shiftDec) {
              const vectorLengthMult = Math.min(250, pixelsPerDegree * 8);
              const vectorX = x - (star.shiftRa || 0) * vectorLengthMult;
              const vectorY = y - (star.shiftDec || 0) * vectorLengthMult;
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

          ctx.fillStyle = star.mover
            ? theme === 'dark' ? '#F59E0B' : '#D97706'
            : theme === 'dark' ? '#F8FAFC' : '#0F172A';
          ctx.font = '11px "IBM Plex Sans", sans-serif';
          ctx.fillText(star.name, x + baseSize + 6, y + 4);

          if (star.mover) {
            ctx.fillStyle = theme === 'dark' ? '#38BDF8' : '#0284C7';
            ctx.font = '9px "IBM Plex Mono", monospace';
            const arcsecShift = (Math.hypot(star.shiftRa || 0, star.shiftDec || 0) * 3600).toFixed(1);
            ctx.fillText(
              `Δ ${arcsecShift}" · ${isBlinking ? `Epoch ${blinkEpoch}` : activeEpoch}`,
              x + baseSize + 6,
              y + 16
            );
          }
        }
      });

      // 6. Center Precision Optical Reticle
      ctx.save();
      ctx.strokeStyle = theme === 'dark' ? 'rgba(6, 182, 212, 0.85)' : 'rgba(2, 132, 199, 0.8)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(centerX - 8, centerY);
      ctx.lineTo(centerX + 8, centerY);
      ctx.moveTo(centerX, centerY - 8);
      ctx.lineTo(centerX, centerY + 8);
      ctx.stroke();

      const frameR = Math.min(w, h) * 0.28;
      const cornerLen = 14;

      ctx.beginPath();
      ctx.moveTo(centerX - frameR, centerY - frameR + cornerLen);
      ctx.lineTo(centerX - frameR, centerY - frameR);
      ctx.lineTo(centerX - frameR + cornerLen, centerY - frameR);
      ctx.moveTo(centerX + frameR - cornerLen, centerY - frameR);
      ctx.lineTo(centerX + frameR, centerY - frameR);
      ctx.lineTo(centerX + frameR, centerY - frameR + cornerLen);
      ctx.moveTo(centerX - frameR, centerY + frameR - cornerLen);
      ctx.lineTo(centerX - frameR, centerY + frameR);
      ctx.lineTo(centerX - frameR + cornerLen, centerY + frameR);
      ctx.moveTo(centerX + frameR - cornerLen, centerY + frameR);
      ctx.lineTo(centerX + frameR, centerY + frameR);
      ctx.lineTo(centerX + frameR, centerY + frameR - cornerLen);
      ctx.stroke();

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
  ]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
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

    const hoverDec = dec - (y - h / 2) / pixelsPerDegree;
    const hoverRa = (ra - (x - w / 2) / (pixelsPerDegree * Math.cos((dec * Math.PI) / 180)) + 360) % 360;

    setCursorCoords({ ra: hoverRa, dec: hoverDec });

    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const newDec = Math.max(-90, Math.min(90, dragStart.dec + dy / pixelsPerDegree));
    const newRa = (dragStart.ra + (dx / pixelsPerDegree) / Math.cos((dragStart.dec * Math.PI) / 180) + 360) % 360;

    setPosition(newRa, newDec, null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden bg-lab-50 dark:bg-space-950 font-sans"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair touch-none"
      />

      {/* Top Left: Mission HUD & Survey Switcher */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-auto">
        <div className="relative z-20 flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 shadow-xl backdrop-blur-md">
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
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all duration-200 ${
                  surveyLayer === s.id
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
        </div>
      </div>

      {/* Top Right: Observatory Controls (Blink, Real Imagery, Grid, Zoom) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 p-1 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 shadow-xl backdrop-blur-md z-10 pointer-events-auto">
        <Tooltip
          content="Toggle authentic NASA Goddard SkyView deep-space survey imagery underlay."
          tag="REAL IMAGERY"
          position="bottom"
        >
          <button
            onClick={() => setShowRealImagery(!showRealImagery)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all duration-200 ${
              showRealImagery
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
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all duration-200 ${
              isBlinking
                ? 'bg-amber-500 text-slate-950 shadow-amber-glow animate-pulse'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {isBlinking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>BLINK ({blinkEpoch})</span>
          </button>
        </Tooltip>

        <div className="w-px h-5 bg-slate-300 dark:bg-white/10" />

        <Tooltip content="Toggle Candidate Mover detection rings and proper-motion vectors." tag="MOVERS" position="bottom">
          <button
            onClick={toggleMoversOverlay}
            className={`p-1.5 rounded-lg transition-colors ${
              showMoversOverlay
                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Scan className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Toggle Equatorial Right Ascension & Declination coordinate gridlines." tag="GRID" position="bottom">
          <button
            onClick={toggleGrid}
            className={`p-1.5 rounded-lg transition-colors ${
              showGrid
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Toggle Constellation lines, lore, and famous star patterns (Ursa Major, Orion, Cassiopeia, Ophiuchus)." tag="CONSTELLATIONS" position="bottom">
          <button
            onClick={toggleConstellations}
            className={`p-1.5 rounded-lg transition-colors ${
              showConstellations
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Zoom in (narrow field of view)" tag="ZOOM IN" shortcut="+" position="bottom">
          <button
            onClick={() => setFov(fov * 0.75)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Zoom out (wide all-sky view)" tag="ZOOM OUT" shortcut="-" position="bottom">
          <button
            onClick={() => setFov(fov * 1.33)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Reset camera to 1.2° standard observatory framing." tag="RESET" position="bottom">
          <button
            onClick={() => setFov(1.2)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </Tooltip>
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
