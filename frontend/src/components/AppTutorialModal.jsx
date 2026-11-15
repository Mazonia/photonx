import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Telescope,
  Search,
  Compass,
  Layers,
  Radio,
  Eye,
  Clock,
  Sparkles,
  Activity,
  CloudRain,
  Presentation,
  CheckCircle2,
  Sliders,
  Play,
  RotateCcw,
} from 'lucide-react';

const TOUR_STEPS = [
  {
    id: 'brand-logo',
    selector: '[data-tour="brand-logo"]',
    placement: 'bottom',
    badge: 'STEP 1 OF 12 • MISSION BRIEF',
    title: 'Welcome to PhotonX',
    icon: Telescope,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          <strong>PhotonX</strong> is an open-source, interactive celestial observatory built for the <strong>NASA Space Apps Challenge</strong>.
        </p>
        <p>
          NASA launched the <strong>SPHEREx</strong> space telescope to map the entire sky in <strong>102 infrared colors</strong> every six months. Because mysterious objects in the deep solar system (like the hypothesized Planet X or cold brown dwarfs) reflect virtually zero visible sunlight, normal cameras can't see them.
        </p>
        <div className="p-2.5 rounded-xl bg-ocean-500/10 border border-ocean-500/30 text-ocean-900 dark:text-ocean-200">
          <strong>Layman Analogy:</strong> Imagine looking for someone in a pitch-black cave. A regular flashlight won't reach them 400 football fields away. But with heat-vision goggles, their body heat shines like a bright beacon!
        </div>
      </div>
    ),
  },
  {
    id: 'search-bar',
    selector: '[data-tour="search-bar"]',
    placement: 'bottom',
    badge: 'STEP 2 OF 12 • TARGET FINDER',
    title: 'Instant Celestial Search',
    icon: Search,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          Need to jump to a specific star or coordinate? The <strong>Search Bar</strong> resolves targets instantly across the entire sky.
        </p>
        <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-sand-200">
          <li><strong>By Name:</strong> Type <em>"Barnard's Star"</em> (the fastest-moving star in our sky), <em>"WISE 0855"</em> (a frozen failed star just 7 light-years away), or <em>"TRAPPIST-1"</em>.</li>
          <li><strong>By Coordinates:</strong> Enter Right Ascension & Declination (e.g. <code>269.45, 4.69</code>).</li>
          <li><strong>Curated Quick List:</strong> Click inside the search box anytime to view a dropdown of benchmark solar system movers and targets.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'mode-selector',
    selector: '[data-tour="mode-selector"]',
    placement: 'bottom',
    badge: 'STEP 3 OF 12 • WORKFLOW MODES',
    title: 'Three Navigation Modes',
    icon: Compass,
    content: (
      <div className="space-y-2 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          These three buttons switch your working mode depending on what you want to do:
        </p>
        <div className="space-y-1.5">
          <div className="p-2 rounded-lg bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60">
            <span className="font-bold text-ocean-700 dark:text-ocean-300">🧭 Explore Mode:</span> Free-roam celestial browsing across stars, constellations, and celestial coordinates.
          </div>
          <div className="p-2 rounded-lg bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60">
            <span className="font-bold text-ocean-700 dark:text-ocean-300">🎯 Investigate Mode:</span> Detailed scientific dissection: extracts 102 infrared color channels, temperature, and distance telemetry.
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <span className="font-bold text-amber-700 dark:text-amber-300">🏆 Hunt Mode:</span> Citizen science! Spot moving candidate objects, tag them, earn hunter badges, and export verified discovery logs.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'sky-canvas',
    selector: '[data-tour="sky-canvas"]',
    placement: 'center-float',
    badge: 'STEP 4 OF 12 • CELESTIAL CANVAS',
    title: 'The Interactive Sky Engine',
    icon: Layers,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          This is your primary telescope viewport, rendering authentic astronomical coordinates with physical star colors and diffraction spikes.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60">
            <div className="font-bold text-ocean-700 dark:text-ocean-300">Mouse Drag</div>
            <div className="text-[11px] text-slate-600 dark:text-sand-300">Click and drag anywhere to pan around the sky.</div>
          </div>
          <div className="p-2 rounded-lg bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60">
            <div className="font-bold text-ocean-700 dark:text-ocean-300">Scroll / Keys (+ / -)</div>
            <div className="text-[11px] text-slate-600 dark:text-sand-300">Zoom from a wide 45° constellation view to a pin-point 0.05° deep field.</div>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-sand-300 italic">
          Try zooming in on a bright star to inspect its realistic optical diffraction spikes and Harvard spectral color classification!
        </p>
      </div>
    ),
  },
  {
    id: 'survey-switcher',
    selector: '[data-tour="survey-switcher"]',
    placement: 'bottom',
    badge: 'STEP 5 OF 12 • SURVEY TELESCOPES',
    title: 'Multi-Mission Survey Switcher',
    icon: Radio,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          Compare the exact same patch of sky across different famous NASA and international sky surveys:
        </p>
        <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-sand-200">
          <li><strong>SPHEREx NIR:</strong> 102 near-infrared channels (0.75 - 5.0µm) — where cold outer solar system bodies shine.</li>
          <li><strong>WISE Mid-IR:</strong> NASA's thermal infrared sky survey (3.4 - 22µm).</li>
          <li><strong>2MASS:</strong> Two Micron All-Sky Survey (J, H, Ks bands).</li>
          <li><strong>DSS Optical:</strong> Standard visible photographic sky. Notice how faint cold objects disappear completely here!</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'sky-controls',
    selector: '[data-tour="sky-controls"]',
    placement: 'bottom-left',
    badge: 'STEP 6 OF 12 • THE BLINK ENGINE',
    title: 'Blink Comparator & Sky Overlays',
    icon: Eye,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          This is the primary tool astronomers use to find new planets and asteroids!
        </p>
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 fill-current" /> The Blink Button (or Spacebar):
          </div>
          <p className="text-slate-600 dark:text-sand-200">
            Rapidly flips between two sky photos taken 6 months apart. Stationary background stars stay perfectly still, while any moving body (asteroid or Planet X candidate) jumps back and forth before your eyes!
          </p>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-sand-300">
          You can also toggle <strong>REAL SKY</strong> (NASA Goddard satellite photography), coordinate gridlines (<kbd className="px-1 py-0.5 rounded bg-sand-200 dark:bg-space-950 font-mono text-[10px]">G</kbd>), and constellation lines (<kbd className="px-1 py-0.5 rounded bg-sand-200 dark:bg-space-950 font-mono text-[10px]">C</kbd>).
        </p>
      </div>
    ),
  },
  {
    id: 'epoch-timeline',
    selector: '[data-tour="epoch-timeline"]',
    placement: 'top',
    badge: 'STEP 7 OF 12 • TIME SCRUBBER',
    title: '6-Month Survey Epoch Timeline',
    icon: Clock,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          NASA SPHEREx scans the entire sky once every six months, repeating for multiple complete passes:
        </p>
        <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-sand-200">
          <li><strong>Epoch 1 (Month 0-6):</strong> First baseline sky map.</li>
          <li><strong>Epoch 2 (Month 6-12):</strong> Second pass. The Earth has moved to the opposite side of the Sun, creating maximum parallax baseline.</li>
          <li><strong>Epochs 3-5:</strong> Successive passes tracking proper motion over 2+ full years.</li>
        </ul>
        <p className="text-[11px] text-slate-500 dark:text-sand-300 italic">
          Click the Epoch pills (1 through 5) or drag the slider to travel through time and observe how far candidates have moved!
        </p>
      </div>
    ),
  },
  {
    id: 'spectral-bands',
    selector: '[data-tour="spectral-bands"]',
    placement: 'top-left',
    badge: 'STEP 8 OF 12 • 102 INFRARED COLORS',
    title: 'Spectral Band Presets',
    icon: Sparkles,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          Human eyes only see three colors (red, green, blue). SPHEREx sees <strong>102 fine spectral slices</strong> from 0.75 to 5.0 micrometers.
        </p>
        <p className="text-slate-600 dark:text-sand-200">
          Clicking these quick presets tunes your telescope to specific wavelengths where distinct molecular ices absorb light:
        </p>
        <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
          <div className="p-1.5 rounded bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60 font-bold text-ocean-700 dark:text-ocean-300">
            CH4 (2.3µm)
            <div className="text-[9px] font-normal text-slate-500">Methane Ice</div>
          </div>
          <div className="p-1.5 rounded bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60 font-bold text-ocean-700 dark:text-ocean-300">
            H2O (3.0µm)
            <div className="text-[9px] font-normal text-slate-500">Water Frost</div>
          </div>
          <div className="p-1.5 rounded bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60 font-bold text-ocean-700 dark:text-ocean-300">
            CO2 (4.3µm)
            <div className="text-[9px] font-normal text-slate-500">Dry Ice</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'detail-panel',
    selector: '[data-tour="detail-panel"]',
    placement: 'left',
    badge: 'STEP 9 OF 12 • SCIENCE TELEMETRY',
    title: 'Target Telemetry & Physical Data',
    icon: Sliders,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          Whenever you click any object on the sky, this right-hand sidebar instantly calculates and displays its physical identity card:
        </p>
        <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-sand-200">
          <li><strong>Coordinates:</strong> Precise Right Ascension and Declination in J2000 equinox.</li>
          <li><strong>Distance:</strong> Calculated in Astronomical Units (AU) or Light-Years.</li>
          <li><strong>Effective Temperature:</strong> Surface heat measured in Kelvin (e.g. 250K vs 3,000K).</li>
          <li><strong>Apparent Magnitude & Proper Motion:</strong> How fast it is drifting across the background sky per year.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'detail-tabs',
    selector: '[data-tour="detail-tabs"]',
    placement: 'left',
    badge: 'STEP 10 OF 12 • DEEP SCIENCE TABS',
    title: 'Spectra, Differencing & NASA Live',
    icon: Activity,
    content: (
      <div className="space-y-2 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          Toggle between three deep analytical views:
        </p>
        <div className="space-y-1.5">
          <div className="p-2 rounded-lg bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60">
            <span className="font-bold text-ocean-700 dark:text-ocean-300">102-Band Spectrum:</span> The complete spectrophotometric curve. Look for dips at 2.3µm and 3.0µm revealing methane and water ice!
          </div>
          <div className="p-2 rounded-lg bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60">
            <span className="font-bold text-ocean-700 dark:text-ocean-300">Epoch Diff & Movers:</span> Mathematically subtracts Epoch A from Epoch B. Stationary stars vanish into 0, leaving ONLY moving objects as bright positive/negative pairs!
          </div>
          <div className="p-2 rounded-lg bg-sand-100 dark:bg-space-950/80 border border-sand-200 dark:border-ocean-900/60">
            <span className="font-bold text-ocean-700 dark:text-ocean-300">NASA Live & ADS:</span> Live cross-matches with NASA APOD imagery, academic research papers, and SIMBAD databases.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'observability-btn',
    selector: '[data-tour="observability-btn"]',
    placement: 'bottom-left',
    badge: 'STEP 11 OF 12 • GROUND RADAR',
    title: 'Atmospheric Seeing & Weather Radar',
    icon: CloudRain,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          Space telescopes discover candidates, but large ground observatories (like Keck or VLT) must confirm them!
        </p>
        <p className="text-slate-600 dark:text-sand-200">
          Clicking this button pulls live atmospheric metrics (via <strong>Meteomatics & OpenWeather</strong>) for your location:
        </p>
        <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-sand-200">
          <li><strong>Seeing Disc:</strong> Atmospheric turbulence measured in arcseconds (e.g. 0.8″ = excellent clear seeing).</li>
          <li><strong>Cloud Cover & Airmass:</strong> How much atmosphere the telescope must look through.</li>
          <li><strong>Tonight's Window:</strong> Exact hours when the target rises above the horizon.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'tutorial-btn',
    selector: '[data-tour="tutorial-btn"]',
    placement: 'bottom-left',
    badge: 'STEP 12 OF 12 • TOUR COMPLETE',
    title: "You're Ready to Hunt Planet X!",
    icon: CheckCircle2,
    content: (
      <div className="space-y-2.5 text-xs text-slate-700 dark:text-sand-100 leading-relaxed">
        <p>
          Congratulations! You now understand every button, scrubber, and telemetry panel in PhotonX.
        </p>
        <div className="p-2.5 rounded-xl bg-ocean-500/10 border border-ocean-500/30">
          <div className="font-bold text-ocean-800 dark:text-ocean-300 mb-1 flex items-center gap-1.5">
            <Presentation className="w-3.5 h-3.5" /> Official 7-Slide Presentation:
          </div>
          <p className="text-slate-600 dark:text-sand-200">
            Click the <strong>Slides</strong> button in the header anytime to view our official NASA Space Apps submission deck with audio-ready talking points!
          </p>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-sand-300">
          You can re-launch this interactive tour anytime by clicking the <strong>Tutorial</strong> button in the top navigation bar. Happy hunting!
        </p>
      </div>
    ),
  },
];

export default function AppTutorialModal({ isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const popoverRef = useRef(null);

  const step = TOUR_STEPS[currentStepIndex];

  // Update viewport size
  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update target element bounding rect
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || !step) return;

    if (step.placement === 'center-float') {
      // For general canvas overview, spotlight the center of screen or canvas
      const canvasEl = document.querySelector(step.selector);
      if (canvasEl) {
        const rect = canvasEl.getBoundingClientRect();
        setTargetRect({
          top: rect.top + 20,
          left: rect.left + 20,
          right: rect.right - 20,
          bottom: rect.bottom - 20,
          width: rect.width - 40,
          height: rect.height - 40,
        });
      } else {
        setTargetRect({
          top: window.innerHeight * 0.15,
          left: window.innerWidth * 0.1,
          width: window.innerWidth * 0.5,
          height: window.innerHeight * 0.7,
        });
      }
      return;
    }

    const el = document.querySelector(step.selector);
    if (el) {
      // Scroll into view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setTargetRect(null);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) return;

    updateTargetPosition();
    const handleScrollOrResize = () => {
      requestAnimationFrame(updateTargetPosition);
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    const timer = setTimeout(updateTargetPosition, 100);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      clearTimeout(timer);
    };
  }, [isOpen, currentStepIndex, updateTargetPosition]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleFinish();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('photonx_tutorial_completed', 'true');
    }
    setCurrentStepIndex(0);
    onClose();
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
  };

  if (!isOpen) return null;

  // Calculate Popover Position relative to target rect
  const cardWidth = Math.min(440, viewport.width - 32);
  let cardTop = viewport.height / 2 - 160;
  let cardLeft = viewport.width / 2 - cardWidth / 2;

  if (targetRect) {
    const pad = 8;
    const placement = step.placement;

    if (placement === 'bottom') {
      cardTop = targetRect.bottom + pad + 10;
      cardLeft = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    } else if (placement === 'bottom-left') {
      cardTop = targetRect.bottom + pad + 10;
      cardLeft = targetRect.right - cardWidth;
    } else if (placement === 'top') {
      cardTop = Math.max(16, targetRect.top - 360);
      cardLeft = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    } else if (placement === 'top-left') {
      cardTop = Math.max(16, targetRect.top - 360);
      cardLeft = targetRect.right - cardWidth;
    } else if (placement === 'left') {
      cardLeft = Math.max(16, targetRect.left - cardWidth - pad - 12);
      cardTop = Math.max(70, Math.min(viewport.height - 380, targetRect.top));
    } else if (placement === 'right') {
      cardLeft = targetRect.right + pad + 12;
      cardTop = Math.max(70, Math.min(viewport.height - 380, targetRect.top));
    } else if (placement === 'center-float') {
      // Inside sky canvas, place on left side overlay
      cardTop = 120;
      cardLeft = 24;
    }

    // Viewport edge clamps
    cardLeft = Math.max(16, Math.min(viewport.width - cardWidth - 16, cardLeft));
    cardTop = Math.max(16, Math.min(viewport.height - 420, cardTop));
  }

  // Target spotlight cutout dimensions
  const cutPad = 6;
  const cutX = targetRect ? Math.max(0, targetRect.left - cutPad) : 0;
  const cutY = targetRect ? Math.max(0, targetRect.top - cutPad) : 0;
  const cutW = targetRect ? targetRect.width + cutPad * 2 : 0;
  const cutH = targetRect ? targetRect.height + cutPad * 2 : 0;

  const IconComponent = step.icon || Telescope;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none font-sans pointer-events-auto">
      {/* Dynamic SVG Mask Spotlight Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300 ease-out"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White covers the entire screen (opaque backdrop) */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black cutout reveals the spotlighted element */}
            {targetRect && (
              <rect
                x={cutX}
                y={cutY}
                width={cutW}
                height={cutH}
                rx="14"
                ry="14"
                fill="black"
                className="transition-all duration-300 ease-out"
              />
            )}
          </mask>
        </defs>

        {/* Coastal Ocean/Marine Deep Tint Backdrop with Mask applied */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(11, 30, 38, 0.78)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* Target Element Glowing Spotlight Ring */}
      {targetRect && (
        <div
          style={{
            position: 'absolute',
            top: `${cutY}px`,
            left: `${cutX}px`,
            width: `${cutW}px`,
            height: `${cutH}px`,
            pointerEvents: 'none',
          }}
          className="rounded-2xl border-2 border-ocean-400 dark:border-ocean-300 shadow-[0_0_25px_rgba(42,128,119,0.7),inset_0_0_15px_rgba(212,163,89,0.3)] transition-all duration-300 ease-out animate-pulse"
        />
      )}

      {/* Backdrop Click Dismiss (optional, advances or closes) */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleNext}
        title="Click to go to next step"
      />

      {/* Floating Tutorial Guidance Card */}
      <div
        ref={popoverRef}
        style={{
          position: 'absolute',
          top: `${cardTop}px`,
          left: `${cardLeft}px`,
          width: `${cardWidth}px`,
        }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 rounded-2xl bg-sand-50/98 dark:bg-space-900/98 border-2 border-sand-300 dark:border-ocean-800/80 shadow-2xl shadow-ocean-950/50 backdrop-blur-2xl p-5 text-slate-800 dark:text-sand-50 transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
      >
        {/* Card Header with Step Badge and Close */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-ocean-500/15 border border-ocean-500/30 text-ocean-600 dark:text-ocean-400">
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ocean-700 dark:text-ocean-400">
                {step.badge}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {step.title}
              </h3>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-sand-100 hover:bg-sand-200 dark:hover:bg-space-800 transition-colors"
            aria-label="Close tutorial"
            title="Skip and close tutorial (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Explanation Body */}
        <div className="mb-5 max-h-[360px] overflow-y-auto pr-1">
          {step.content}
        </div>

        {/* Step Progress Dots Indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                idx === currentStepIndex
                  ? 'w-6 bg-ocean-500 dark:bg-ocean-400'
                  : 'w-1.5 bg-sand-300 dark:bg-space-800 hover:bg-ocean-400/50'
              }`}
              title={`Go to step ${idx + 1}: ${s.title}`}
              aria-label={`Step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Card Footer Navigation Controls */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-sand-200 dark:border-ocean-900/40">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border border-sand-300 dark:border-white/10 text-xs font-semibold transition-all ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-700 dark:text-sand-200 hover:bg-sand-200 dark:hover:bg-space-800'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStepIndex > 0 && (
              <button
                onClick={handleRestart}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-sand-200 hover:bg-sand-200 dark:hover:bg-space-800 transition-colors"
                title="Restart tutorial from beginning"
                aria-label="Restart tutorial"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinish}
              className="px-2.5 py-1.5 text-xs text-slate-500 dark:text-sand-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white font-bold text-xs shadow-md shadow-ocean-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
