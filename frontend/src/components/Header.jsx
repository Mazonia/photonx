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
      <header className="relative z-30 flex items-center justify-between px-4 py-2 bg-sand-50/95 dark:bg-space-900/95 border-b border-sand-300 dark:border-ocean-900/60 backdrop-blur-xl shadow-sm select-none transition-colors duration-200">
        {/* Left: Branding & Status */}
        <div data-tour="brand-logo" className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-ocean-500/10 border border-ocean-500/30 text-ocean-600 dark:text-ocean-400">
              <Telescope className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-extrabold text-lg tracking-[0.12em] text-slate-900 dark:text-sand-50">
                PHOTON
              </span>
              <span className="font-display font-black text-lg tracking-[0.05em] text-amber-500 dark:text-amber-400">
                X
              </span>
            </div>
          </div>

          {/* Mission Badge */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-sand-300 dark:border-white/10">
            <Tooltip position="bottom" content="NASA Spectro-Photometer for the History of the Universe, Epoch of Reionization, and Ices Explorer" tag="MISSION">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-ocean-500/10 text-ocean-700 dark:text-ocean-300 border border-ocean-500/25">
                SPHEREx QR2
              </span>
            </Tooltip>
            <Tooltip position="bottom" content="Primary data DOI: 10.26131/IRSA629 (NASA/IPAC Infrared Science Archive)" tag="PROVENANCE">
              <span className="flex items-center gap-1 text-[10px] font-mono text-ocean-700 dark:text-ocean-400">
                <span className="w-1.5 h-1.5 rounded-full bg-ocean-500 dark:bg-ocean-400" />
                IRSA VERIFIED
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Middle: High-precision Search Bar */}
        <div data-tour="search-bar" className="flex-1 max-w-lg mx-4">
          <SearchBar />
        </div>

        {/* Right: Mode Selector, Tutorial, Deck, Observability, Help, & Theme */}
        <div className="flex items-center gap-2">
          {/* Navigation Mode Pill */}
          <div data-tour="mode-selector" className="flex items-center p-0.5 rounded-xl bg-sand-200/60 dark:bg-space-950/80 border border-sand-300 dark:border-white/10 shadow-inner">
            <Tooltip position="bottom" content="All-sky browser with multi-spectral NIR maps and curated catalog targets." tag="VIEW">
              <button
                onClick={() => setMode('explore')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                  mode === 'explore'
                    ? 'bg-ocean-500 text-white font-bold shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore</span>
              </button>
            </Tooltip>

            <Tooltip position="bottom" content="Detailed object inspection with 102-band NIR spectrum extraction and pixel differencing." tag="ANALYZE">
              <button
                onClick={() => setMode('investigate')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                  mode === 'investigate'
                    ? 'bg-ocean-500 text-white font-bold shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Investigate</span>
              </button>
            </Tooltip>

            <Tooltip position="bottom" content="Citizen Science console: flag candidate moving objects, track hunter rank, and export scientific briefs." tag="DISCOVER">
              <button
                onClick={() => setMode('hunt')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                  mode === 'hunt'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-amber-glow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Hunt Mode</span>
              </button>
            </Tooltip>
          </div>

          {/* Interactive Tutorial Button (Always available for both first-time and constant visitors) */}
          <Tooltip position="bottom" content="Take a step-by-step interactive tutorial explaining what every button and section shows" tag="HOW IT WORKS">
            <button
              data-tour="tutorial-btn"
              onClick={openTutorial}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-ocean-500/40 bg-ocean-500/10 hover:bg-ocean-500/20 text-xs font-mono font-bold text-ocean-700 dark:text-ocean-300 transition-all shadow-sm"
              aria-label="Open full site tutorial"
            >
              <GraduationCap className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
              <span className="hidden sm:inline">Tutorial</span>
            </button>
          </Tooltip>

          {/* Official Presentation Deck Button (7-Slide Official Submission) */}
          <Tooltip position="bottom" content="View the official 7-slide NASA Space Apps presentation deck (or download .pptx)" tag="PRESENTATION" shortcut="P">
            <a
              data-tour="slides-btn"
              href="presentation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-sand-300 dark:border-white/10 bg-white dark:bg-space-950/80 hover:bg-sand-100 dark:hover:bg-space-850 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Slides (7)</span>
            </a>
          </Tooltip>

          {/* Cosmic Discovery Tour Button */}
          <Tooltip position="bottom" content="Guided educational voyage across moving stars, icy brown dwarfs, and exoplanet systems." tag="TOUR">
            <button
              onClick={openTour}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono font-bold text-amber-700 dark:text-amber-300 transition-all shadow-sm"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">Space Tour</span>
            </button>
          </Tooltip>

          {/* Atmospheric Observability Button */}
          <Tooltip position="bottom" content="Evaluate tonight's atmospheric seeing (Meteomatics + OpenWeather), target airmass, and seeing disc." tag="ATMOSPHERE">
            <button
              data-tour="observability-btn"
              onClick={toggleObservability}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-sand-300 dark:border-white/10 bg-white dark:bg-space-950/80 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-ocean-400/40 hover:text-ocean-600 dark:hover:text-ocean-400 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xl:inline">Visible Tonight?</span>
            </button>
          </Tooltip>

          {/* Keyboard Shortcuts Dialog Trigger */}
          <Tooltip position="bottom" content="View all keyboard commands and mission guide" tag="SHORTCUTS" shortcut="?">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="p-2 rounded-xl border border-sand-300 dark:border-white/10 bg-white dark:bg-space-950/80 text-slate-600 dark:text-slate-400 hover:text-ocean-500 dark:hover:text-ocean-400 transition-colors shadow-sm"
              aria-label="View keyboard shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip position="bottom" content={theme === 'dark' ? 'Switch to Sunlit Beach Sand (Light Theme)' : 'Switch to Deep Ocean Waters (Dark Theme)'} tag="THEME" shortcut="T">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-sand-300 dark:border-white/10 bg-white dark:bg-space-950/80 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors shadow-sm"
              aria-label="Toggle visual theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-ocean-700" />}
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Keyboard Shortcuts Guide Dialog */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </>
  );
}
