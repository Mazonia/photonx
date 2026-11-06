import React, { useCallback } from 'react';
import useStore from '../store/useStore';
import Tooltip from './Tooltip';
import { Clock } from 'lucide-react';

export default function EpochScrubber() {
  const {
    epochs,
    activeEpoch,
    setActiveEpoch,
    compareEpoch,
    setCompareEpoch,
    activeChannel,
    setActiveChannel,
  } = useStore();

  const activeIndex = epochs.indexOf(activeEpoch);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowRight' && activeIndex < epochs.length - 1) {
        setActiveEpoch(epochs[activeIndex + 1]);
      } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveEpoch(epochs[activeIndex - 1]);
      } else if (e.key === 'Home') {
        setActiveEpoch(epochs[0]);
      } else if (e.key === 'End') {
        setActiveEpoch(epochs[epochs.length - 1]);
      }
    },
    [activeIndex, epochs, setActiveEpoch]
  );

  const CHANNEL_PRESETS = [
    { ch: 0, label: '0.75 µm', desc: 'Optical/NIR boundary' },
    { ch: 20, label: '1.25 µm', desc: 'J-band equivalent' },
    { ch: 42, label: '2.30 µm', desc: 'Carbon Monoxide absorption' },
    { ch: 54, label: '3.30 µm', desc: 'PAH / Organic emission' },
    { ch: 68, label: '4.27 µm', desc: 'CO₂ Ice feature' },
    { ch: 101, label: '5.00 µm', desc: 'Longest infrared cutoff' },
  ];

  return (
    <footer
      className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-white/95 dark:bg-slate-950/90 border-t border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg select-none transition-colors duration-200"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Observation timeline and channel controller"
    >
      {/* Left: Mission Cadence Label */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-cyan-500/20">
          <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>CADENCE: 6-MONTH ALL-SKY</span>
        </div>
      </div>

      {/* Center: Epoch Scrub Timeline */}
      <div className="flex-1 max-w-xl flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold hidden md:inline">
          EPOCHS:
        </span>

        <div className="relative flex-1 flex items-center justify-between py-1">
          {/* Track line */}
          <div className="absolute inset-x-2 h-0.5 bg-slate-200 dark:bg-slate-800" />

          {/* Epoch Milestones */}
          {epochs.map((ep, i) => {
            const isActive = ep === activeEpoch;
            const isCompare = ep === compareEpoch;

            return (
              <Tooltip
                key={ep}
                content={`Survey Scan ${ep}. Left-click to view epoch, right-click to compare.`}
                tag={`EPOCH ${i + 1}`}
              >
                <button
                  onClick={() => setActiveEpoch(ep)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setCompareEpoch(ep);
                  }}
                  className={`relative z-10 flex flex-col items-center gap-1 px-2.5 py-1 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-hud-glow scale-105'
                      : isCompare
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/40'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/80'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full border-2 transition-transform ${
                      isActive
                        ? 'bg-white border-slate-950 scale-125'
                        : isCompare
                        ? 'bg-amber-400 border-amber-500'
                        : 'bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-800'
                    }`}
                  />
                  <span className="font-mono text-[11px]">{ep}</span>
                  {isActive && (
                    <span className="absolute -top-1.5 px-1 py-0.2 rounded-full text-[8px] font-mono font-bold bg-slate-950 text-cyan-400 border border-cyan-400">
                      ACTIVE
                    </span>
                  )}
                  {isCompare && !isActive && (
                    <span className="absolute -top-1.5 px-1 py-0.2 rounded-full text-[8px] font-mono font-bold bg-slate-950 text-amber-400 border border-amber-400">
                      COMPARE
                    </span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Right: Quick Spectral Wavelength Channel presets */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mr-1 hidden lg:inline">
          BAND:
        </span>
        <div className="flex items-center gap-1">
          {CHANNEL_PRESETS.map((p) => (
            <Tooltip key={p.ch} content={p.desc} tag={`Channel ${p.ch}`}>
              <button
                onClick={() => setActiveChannel(p.ch)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  activeChannel === p.ch
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-white/5'
                }`}
              >
                {p.label}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </footer>
  );
}
