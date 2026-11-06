import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api/client';
import useStore from '../store/useStore';
import Tooltip from './Tooltip';
import { Search, Loader2, Sparkles, X } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const { setPosition } = useStore();

  // Quick jump suggestions
  const QUICK_SUGGESTIONS = [
    { name: "Barnard's Star", desc: 'Fastest proper motion star (10.3"/yr)' },
    { name: 'WISE 0855', desc: 'Coldest brown dwarf (Planet X analog)' },
    { name: 'M31', desc: 'Andromeda Galaxy' },
    { name: 'Trappist-1', desc: '7 Earth-sized exoplanets' },
  ];

  // Hotkey '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim().replace(/[<>]/g, ''); // Basic sanitization
    if (!cleanQuery) return;

    setLoading(true);
    setError(null);

    try {
      const result = await api.resolve(cleanQuery);
      setPosition(result.ra, result.dec, result.name || cleanQuery);
      setQuery('');
      setIsFocused(false);
    } catch (err) {
      setError(err.message || 'Target not found in SIMBAD / NED catalog');
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetName) => {
    setQuery(presetName);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search celestial target, SIMBAD ID, or coordinates (e.g. M31, WISE 0855)..."
          className="w-full pl-9 pr-14 py-2 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
          disabled={loading}
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-9 text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="absolute right-2.5">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-slate-800 text-slate-400 border border-slate-700">
            /
          </kbd>
        </div>
      </form>

      {/* Quick Search Chips Dropdown */}
      {isFocused && (
        <div
          className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-white dark:bg-slate-900/95 border border-slate-300 dark:border-white/10 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
        >
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 py-1 mb-1">
            Quick Jump Presets
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {QUICK_SUGGESTIONS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setQuery(preset.name);
                  setPosition(
                    preset.name === "Barnard's Star" ? 269.4521 :
                    preset.name === "WISE 0855" ? 133.7933 :
                    preset.name === "M31" ? 10.6847 : 346.6222,
                    preset.name === "Barnard's Star" ? 4.6933 :
                    preset.name === "WISE 0855" ? -7.2451 :
                    preset.name === "M31" ? 41.2687 : -5.0413,
                    preset.name
                  );
                  setIsFocused(false);
                }}
                className="flex flex-col text-left p-2 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100 transition-colors border border-transparent hover:border-cyan-500/20"
              >
                <span className="font-mono text-xs font-semibold text-cyan-400">
                  {preset.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {preset.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-red-950/90 border border-red-500/40 text-red-200 text-xs font-mono z-50 animate-in fade-in">
          {error}
        </div>
      )}
    </div>
  );
}
