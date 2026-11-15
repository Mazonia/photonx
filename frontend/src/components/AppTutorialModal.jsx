import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Compass,
  Crosshair,
  Target,
  Telescope,
  Clock,
  Sparkles,
  Layers,
  Rocket,
  Presentation,
  CheckCircle2,
  BookOpen,
  Waves,
  Sun,
  Eye,
} from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    badge: 'WELCOME TO PHOTONX',
    title: 'Your Gateway to the Infrared Cosmos',
    icon: Telescope,
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          <strong>PhotonX</strong> is an open-source, interactive celestial observatory engineered for the <strong>NASA Space Apps Challenge 2026</strong> (<em>Planet X and SPHEREx</em>).
        </p>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          NASA’s SPHEREx space telescope is mapping the entire celestial sphere across <strong>102 near-infrared spectral bands</strong> every six months. Because bodies at 400 AU reflect virtually zero sunlight, they are completely invisible to optical telescopes. But in the thermal infrared, they glow with their own heat.
        </p>
        <div className="p-3 rounded-xl bg-ocean-50 dark:bg-ocean-950/60 border border-ocean-200 dark:border-ocean-800 text-xs text-ocean-900 dark:text-ocean-200">
          <strong>Goal of this tour:</strong> In 60 seconds, you’ll learn how every button, scrubber, and telemetry panel works so you can hunt for moving outer-solar system objects.
        </div>
      </div>
    ),
  },
  {
    id: 'modes',
    badge: 'HEADER CONTROLS',
    title: 'Three Navigation Modes',
    icon: Compass,
    content: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          At the top right of the header, the <strong>Mode Selector</strong> controls your primary workflow:
        </p>
        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex items-start gap-2.5">
            <span className="p-1 rounded bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 font-bold shrink-0">1</span>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">🧭 Explore Mode</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">Free celestial browsing across constellations, deep sky targets, and catalog anchors.</div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex items-start gap-2.5">
            <span className="p-1 rounded bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 font-bold shrink-0">2</span>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">🎯 Investigate Mode</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">Detailed target analysis: extracts full 102-channel infrared spectra, pixel differencing, and SIMBAD cross-matching.</div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5">
            <span className="p-1 rounded bg-amber-500 text-slate-950 font-bold shrink-0">3</span>
            <div>
              <div className="font-bold text-xs text-amber-700 dark:text-amber-300">🎯 Hunt Mode (Citizen Science)</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">Tag candidate moving objects, earn progressive hunter ranks, and export formal observation briefs.</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'search',
    badge: 'TARGET RESOLVER',
    title: 'High-Precision Search & Coordinates',
    icon: Crosshair,
    content: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          The central search bar in the header lets you jump anywhere across the sky instantly:
        </p>
        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
          <li className="flex items-start gap-2">
            <span className="text-ocean-600 dark:text-ocean-400 font-bold">•</span>
            <span><strong>By Object Name:</strong> Type famous targets like <em>"Barnard's Star"</em>, <em>"WISE 0855"</em>, <em>"TRAPPIST-1"</em>, or <em>"M31"</em>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ocean-600 dark:text-ocean-400 font-bold">•</span>
            <span><strong>By Coordinate:</strong> Type decimal degrees (e.g. <code>269.4521, 4.6933</code>) or sexagesimal notation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ocean-600 dark:text-ocean-400 font-bold">•</span>
            <span><strong>Curated Quick List:</strong> Clicking the search input reveals a dropdown of benchmark moving stars and deep sky targets.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'sky-engine',
    badge: 'MAIN VIEWPORT',
    title: 'Interactive Sky Engine & Controls',
    icon: Layers,
    content: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          The main window is an ultra-fast HTML5 Canvas displaying real celestial coordinates with authentic astrophysical rendering:
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            <div className="font-bold text-ocean-600 dark:text-ocean-400">Mouse / Drag</div>
            <div>Click and drag to pan across RA and Dec.</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            <div className="font-bold text-ocean-600 dark:text-ocean-400">Scroll / Keys (+ / -)</div>
            <div>Zoom from 45° all-sky down to 0.05° deep field.</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            <div className="font-bold text-ocean-600 dark:text-ocean-400">Grid Overlay (G Key)</div>
            <div>Toggle Right Ascension &amp; Declination gridlines.</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            <div className="font-bold text-ocean-600 dark:text-ocean-400">Constellations (C Key)</div>
            <div>Toggle mythological constellation boundary lines.</div>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          <strong>Diffraction Spikes:</strong> Bright stars realistically flare based on optical aperture simulation. Star colors match true Harvard stellar classification (O through M and cold brown dwarfs).
        </p>
      </div>
    ),
  },
  {
    id: 'epochs',
    badge: 'TIME SCRUBBER',
    title: '6-Month Survey Timeline & Spectral Bands',
    icon: Clock,
    content: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          The bottom toolbar controls the temporal and wavelength dimensions of your observations:
        </p>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
          <div>
            <strong className="text-ocean-600 dark:text-ocean-400">6-Month Epoch Cadence:</strong> Click milestones like <code>2025-W18</code>, <code>2025-W44</code>, <code>2026-W18</code>, and <code>2026-W44</code>. Left-click to select active epoch; right-click or use Compare to set comparison epoch.
          </div>
          <div>
            <strong className="text-amber-600 dark:text-amber-400">Quick Wavelength Bands:</strong> Click the band buttons on the right to jump between diagnostic channels:
            <div className="flex flex-wrap gap-1 mt-1 text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">0.75 µm (Photosphere)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">1.25 µm (J-band)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">2.30 µm (CO)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">3.30 µm (PAH)</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">4.27 µm (CO₂ Ice)</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">5.00 µm (Thermal)</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'blink',
    badge: 'MOTION DETECTOR',
    title: 'Clyde Tombaugh Optical Blink Engine',
    icon: Eye,
    content: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          This feature brings Clyde Tombaugh’s 1930 Pluto discovery method directly into your browser:
        </p>
        <div className="p-3 rounded-xl bg-ocean-50 dark:bg-ocean-950/60 border border-ocean-200 dark:border-ocean-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-ocean-700 dark:text-ocean-300 font-bold">
            <span className="px-2 py-0.5 rounded bg-ocean-200 dark:bg-ocean-800 font-mono text-[11px]">SPACEBAR</span>
            <span>Press Spacebar to toggle Auto-Blink!</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
            The viewport rapidly alternates between Epoch A and Epoch B. Fixed background stars remain stationary, but any moving asteroid, planet, or high-proper motion star visibly jumps back and forth.
          </p>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          <strong>Tip:</strong> Press <strong>M</strong> to toggle motion vector highlight rings around verified mover candidates.
        </p>
      </div>
    ),
  },
  {
    id: 'spectra',
    badge: 'PHYSICAL COMPOSITION',
    title: '102-Band Infrared Spectra & Molecular Ices',
    icon: Sparkles,
    content: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          What makes SPHEREx revolutionary is that every pixel is a full 102-channel spectrum:
        </p>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
          <p className="text-slate-700 dark:text-slate-200">
            In the right-hand <strong>Detail Panel</strong> under the <strong>"102-Band Spectrum"</strong> tab, you can inspect the object’s flux curve from 0.75 µm to 5.00 µm.
          </p>
          <div className="space-y-1 text-[11px]">
            <div>• <strong className="text-ocean-600 dark:text-ocean-400">Water Ice (1.4 &amp; 1.9 µm):</strong> Diagnostic frost on outer planet surfaces.</div>
            <div>• <strong className="text-ocean-600 dark:text-ocean-400">Carbon Monoxide (2.3 µm):</strong> Strong absorption signature of cold brown dwarfs.</div>
            <div>• <strong className="text-amber-600 dark:text-amber-400">CO₂ Ice (4.27 µm):</strong> Key mantle component of distant trans-Neptunian bodies.</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'differencing',
    badge: 'IMAGE SUBTRACTION',
    title: 'Pixel Differencing & Mover Isolation',
    icon: Target,
    content: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Click the <strong>"Epoch Diff &amp; Movers"</strong> tab in the right panel to engage automated subtraction:
        </p>
        <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            <strong>1. Subtraction Matrix (ΔI = IB - IA):</strong> Fixed background stars cancel out completely.
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            <strong>2. Significance Filtering:</strong> Isolates clusters exceeding local 3σ noise.
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            <strong>3. Arcsecond Shift Vectors:</strong> Automatically computes the positional shift (e.g. 1.4 arcsec) and provides a <strong>"+ Flag"</strong> button to save candidates to your discovery log.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'observability',
    badge: 'LIVE DATA & SEEING',
    title: 'Atmospheric Seeing Radar & NASA Open APIs',
    icon: Waves,
    content: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          PhotonX connects space telescope telemetry with real-time ground observing conditions:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
            <strong className="text-amber-600 dark:text-amber-400">Visible Tonight?</strong>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
              Click in the header to run our 3-tier seeing radar (Meteomatics + OpenWeather). Computes Pickering airmass and seeing disc in arcseconds.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10">
            <strong className="text-ocean-600 dark:text-ocean-400">NASA Live Tab</strong>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
              Live NASA NeoWs asteroid feed, DONKI solar space weather flares, and Astronomy Picture of the Day (APOD).
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'presentation',
    badge: 'SUBMISSION PACKAGE',
    title: 'Slides, Shortcuts & Verification',
    icon: Presentation,
    content: (
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Everything you need for official presentation and judging review:
        </p>
        <div className="p-3 rounded-xl bg-ocean-50 dark:bg-ocean-950/60 border border-ocean-200 dark:border-ocean-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ocean-800 dark:text-ocean-200">Official 7-Slide Deck (Avocado Theme):</span>
            <span className="font-mono text-[10px] text-ocean-600 dark:text-ocean-400">Press P or click "Slides (7)"</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
            Adheres strictly to NASA's 7-slide rule. Viewable as interactive web slides, exportable as PDF, or downloadable as an official PowerPoint (.pptx).
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-xs">
          <strong className="text-slate-800 dark:text-slate-200">Keyboard Guide:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">?</kbd> anytime to open the full command sheet.
        </div>
      </div>
    ),
  },
];

export default function AppTutorialModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') {
        setCurrentStep((prev) => Math.min(prev + 1, TUTORIAL_STEPS.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;

  const handleFinish = () => {
    localStorage.setItem('photonx_tutorial_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-space-900 border border-sand-300 dark:border-ocean-800 shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="PhotonX Interactive Guided Tutorial"
      >
        {/* Coastal Ocean Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200 dark:border-ocean-800/80 bg-sand-50/80 dark:bg-space-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 border border-ocean-500/20">
              <Icon className="w-5 h-5 text-ocean-600 dark:text-ocean-400" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ocean-600 dark:text-ocean-400">
                {step.badge}
              </span>
              <h2 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
                {step.title}
              </h2>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-sand-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pill Indicators */}
        <div className="flex items-center justify-between px-6 py-2 bg-sand-100/50 dark:bg-space-950/40 border-b border-sand-200 dark:border-ocean-900/60">
          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-6 bg-ocean-500 dark:bg-ocean-400'
                    : idx < currentStep
                    ? 'w-2 bg-ocean-300 dark:bg-ocean-700'
                    : 'w-2 bg-sand-300 dark:bg-slate-800'
                }`}
                title={`Jump to step ${idx + 1}: ${s.title}`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </span>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto max-h-[55vh] min-h-[220px]">
          {step.content}
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-sand-200 dark:border-ocean-800/80 bg-sand-50/50 dark:bg-space-950/60">
          <button
            onClick={handleFinish}
            className="text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Skip Tutorial
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-sand-300 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:border-ocean-500 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStep < TUTORIAL_STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white text-xs font-mono font-bold shadow-md transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Start Exploring</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
