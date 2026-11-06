import React, { useEffect } from 'react';
import useStore from '../store/useStore';
import SearchBar from './SearchBar';
import Tooltip from './Tooltip';
import {
  Sun,
  Moon,
  Sparkles,
  Compass,
  Telescope,
  Crosshair,
  Target,
  Rocket,
} from 'lucide-react';

export default function Header() {
  const {
    mode,
    setMode,
    toggleObservability,
    theme,
    toggleTheme,
    openTour,
  } = useStore();

  // Sync theme with html class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <header className="relative z-30 flex items-center justify-between px-4 py-2.5 bg-white/95 dark:bg-slate-950/90 border-b border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm dark:shadow-lg select-none transition-colors duration-200">
      {/* Left: Branding & Status */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 dark:text-cyan-400">
            <Telescope className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-extrabold text-lg tracking-[0.18em] text-slate-900 dark:text-white">
              PHOTON
            </span>
            <span className="font-display font-black text-lg tracking-[0.05em] text-amber-500 dark:text-amber-400">
              X
            </span>
          </div>
        </div>

        {/* Mission Badge */}
        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-white/10">
          <Tooltip position="bottom" content="NASA Spectro-Photometer for the History of the Universe, Epoch of Reionization, and Ices Explorer" tag="MISSION">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              SPHEREx QR2
            </span>
          </Tooltip>
          <Tooltip position="bottom" content="Live query link to NASA/IPAC Infrared Science Archive (DOI: 10.26131/IRSA629)" tag="PROVENANCE">
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              IRSA VERIFIED
            </span>
          </Tooltip>
        </div>
      </div>

      {/* Middle: High-precision Search Bar */}
      <div className="flex-1 max-w-lg mx-4">
        <SearchBar />
      </div>

      {/* Right: Mode Selector, Observability & Theme Toggle */}
      <div className="flex items-center gap-2">
        {/* Navigation Mode Pill */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-inner">
          <Tooltip position="bottom" content="All-sky browser with multi-spectral NIR maps and curated catalog targets." tag="VIEW">
            <button
              onClick={() => setMode('explore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                mode === 'explore'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-hud-glow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-hud-glow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-amber-glow animate-pulse'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Hunt Mode</span>
            </button>
          </Tooltip>
        </div>

        {/* Cosmic Discovery Tour Button (Kid-Friendly & Beginner Interactive Voyage) */}
        <Tooltip position="bottom" content="Embark on an interactive guided voyage across moving stars, icy brown dwarfs, and alien worlds! Perfect for kids & beginners." tag="TOUR">
          <button
            onClick={openTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 hover:from-amber-500/25 hover:via-rose-500/25 hover:to-purple-500/25 border border-amber-500/40 text-xs font-mono font-bold text-amber-600 dark:text-amber-300 hover:border-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
          >
            <Rocket className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">Space Tour</span>
          </button>
        </Tooltip>

        {/* Observability Button */}
        <Tooltip position="bottom" content="Evaluate tonight's atmospheric observability using live OpenWeather telemetry and celestial altitude." tag="ATMOSPHERE">
          <button
            onClick={toggleObservability}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/80 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-cyan-400/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">Visible Tonight?</span>
          </button>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip position="bottom" content={theme === 'dark' ? 'Switch to Laboratory Cleanroom Light Theme' : 'Switch to Deep Space Observatory Dark Theme'} tag="THEME" shortcut="T">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors shadow-sm"
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </Tooltip>
      </div>
    </header>
  );
}
