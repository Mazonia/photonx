import React from 'react';
import { X, Keyboard, Telescope, Compass, Eye, Sparkles, ExternalLink } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'Space', desc: 'Toggle Clyde Tombaugh optical blink comparator across 6-month survey epochs' },
    { key: '+ / -', desc: 'Zoom in / Zoom out celestial field of view (0.05° deep field up to 45° all-sky)' },
    { key: 'G', desc: 'Toggle celestial equatorial Right Ascension & Declination coordinate gridlines' },
    { key: 'C', desc: 'Toggle constellation line asterisms and mythological boundary overlays' },
    { key: 'M', desc: 'Toggle candidate mover highlight rings and motion vector indicators' },
    { key: 'T', desc: 'Switch between Deep Space Observatory (dark) and Cleanroom (light) themes' },
    { key: 'P', desc: 'Open the official 7-slide NASA presentation deck in a new tab' },
    { key: '?', desc: 'Open / close this keyboard shortcuts guide' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 shadow-2xl text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard Shortcuts and Mission Guide"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm tracking-wide">
                PHOTONX COMMAND SHORTCUTS
              </h3>
              <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                NASA Space Apps 2026: Planet X &amp; SPHEREx
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs"
            >
              <span className="text-slate-700 dark:text-slate-300 font-sans leading-snug">
                {s.desc}
              </span>
              <kbd className="font-mono text-[11px] font-bold px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-cyan-400 border border-slate-300 dark:border-slate-700 shrink-0 shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Presentation & Links Footer */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <a
            href="presentation.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 hover:underline font-bold"
          >
            <span>Official 7-Slide Deck</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-[10px] text-slate-400">
            Press ESC or click anywhere to exit
          </span>
        </div>
      </div>
    </div>
  );
}
