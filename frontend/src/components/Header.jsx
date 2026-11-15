import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import SearchBar from './SearchBar';
import Tooltip from './Tooltip';
import ShortcutsModal from './ShortcutsModal';
import {
  Sun,
  Moon,
  Sparkles,
  Compass,
  Telescope,
  Crosshair,
  Target,
  Rocket,
  Presentation,
  Keyboard,
  GraduationCap,
  Orbit,
} from 'lucide-react';

export default function Header() {
  const {
    mode,
    setMode,
    toggleObservability,
    theme,
    toggleTheme,
    openTour,
    openTutorial,
  } = useStore();

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Sync theme with html class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Keyboard shortcut for shortcuts modal (?)
  useEffect(() => {
    const handleKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        window.open('presentation.html', '_blank');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <header className="relative z-30 flex items-center justify-between px-3.5 py-2 bg-sand-50/95 dark:bg-space-950/90 border-b border-sand-300 dark:border-white/10 backdrop-blur-2xl shadow-sm select-none transition-colors duration-200">
        {/* Left: Branding & Mission Status */}
        <div data-tour="brand-logo" className="flex items-center gap-2.5 shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-hud-glow">
              <Telescope className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-extrabold text-lg tracking-[0.14em] text-slate-900 dark:text-white">
                PHOTON
              </span>
              <span className="font-display font-black text-lg tracking-[0.05em] text-amber-500 dark:text-amber-400">
                X
              </span>
            </div>
          </div>

          {/* Mission Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-2.5 border-l border-sand-300 dark:border-white/10">
            <Tooltip position="bottom" content="NASA Spectro-Photometer for the History of the Universe, Epoch of Reionization, and Ices Explorer" tag="MISSION">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25">
                SPHEREx QR2
              </span>
            </Tooltip>
            <Tooltip position="bottom" content="Primary data DOI: 10.26131/IRSA629 (NASA/IPAC Infrared Science Archive)" tag="PROVENANCE">
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                IRSA VERIFIED
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Middle: High-precision Search Bar */}
        <div data-tour="search-bar" className="flex-1 max-w-md mx-3">
          <SearchBar />
        </div>

        {/* Right: Primary Navigation, Presentation & Grouped Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Navigation Mode Pill */}
          <div data-tour="mode-selector" className="flex items-center p-0.5 rounded-xl bg-sand-200/70 dark:bg-space-900/90 border border-sand-300 dark:border-white/10 shadow-inner">
            <Tooltip position="bottom" content="All-sky browser with multi-spectral NIR maps and curated catalog targets." tag="VIEW">
              <button
                onClick={() => setMode('explore')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
                  mode === 'explore'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-hud-glow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Explore</span>
              </button>
            </Tooltip>

            <Tooltip position="bottom" content="Detailed object inspection with 102-band NIR spectrum extraction and pixel differencing." tag="ANALYZE">
              <button
                onClick={() => setMode('investigate')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
                  mode === 'investigate'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-hud-glow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Inspect</span>
              </button>
            </Tooltip>

            <Tooltip position="bottom" content="Citizen Science console: flag candidate moving objects, track hunter rank, and export scientific briefs." tag="DISCOVER">
              <button
                onClick={() => setMode('hunt')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
                  mode === 'hunt'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-amber-glow animate-pulse'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Hunt</span>
              </button>
            </Tooltip>
          </div>

          {/* Official Presentation Deck Button (7-Slide Official Submission) */}
          <Tooltip position="bottom" content="View the official 7-slide NASA Space Apps presentation deck (or download .pptx)" tag="PRESENTATION" shortcut="P">
            <a
              data-tour="slides-btn"
              href="presentation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-sand-300 dark:border-white/10 bg-white dark:bg-space-900 hover:bg-sand-100 dark:hover:bg-space-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">Slides (7)</span>
            </a>
          </Tooltip>

          {/* Neatly Grouped Utility Cluster (Tour, Atmosphere, Tutorial, Shortcuts, Theme) */}
          <div className="flex items-center p-0.5 rounded-xl border border-sand-300 dark:border-white/10 bg-white/80 dark:bg-space-900/80 backdrop-blur-md shadow-sm">
            {/* Guided Cosmic Discovery Tour */}
            <Tooltip position="bottom" content="Guided educational voyage across moving stars, icy brown dwarfs, and exoplanet systems." tag="TOUR">
              <button
                onClick={openTour}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Open Space Tour"
              >
                <Rocket className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            {/* Atmospheric Observability Radar */}
            <Tooltip position="bottom" content="Evaluate tonight's atmospheric seeing (Meteomatics + OpenWeather), target airmass, and seeing disc." tag="ATMOSPHERE">
              <button
                data-tour="observability-btn"
                onClick={toggleObservability}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Toggle atmospheric seeing"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            {/* Interactive Spotlight Tutorial */}
            <Tooltip position="bottom" content="Interactive step-by-step tutorial explaining what every button and panel shows" tag="TUTORIAL">
              <button
                data-tour="tutorial-btn"
                onClick={openTutorial}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Open tutorial"
              >
                <GraduationCap className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            {/* Keyboard Shortcuts Dialog Trigger */}
            <Tooltip position="bottom" content="View all keyboard commands and mission guide" tag="SHORTCUTS" shortcut="?">
              <button
                onClick={() => setIsShortcutsOpen(true)}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                aria-label="View keyboard shortcuts"
              >
                <Keyboard className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            <div className="w-px h-4 bg-sand-300 dark:bg-white/10 mx-0.5" />

            {/* Dark / Light Theme Toggle */}
            <Tooltip position="bottom" content={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme (Recommended for Space)'} tag="THEME" shortcut="T">
              <button
                onClick={toggleTheme}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-amber-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Toggle visual theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-ocean-700" />}
              </button>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Keyboard Shortcuts Guide Dialog */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </>
  );
}
