import React, { useState, useRef, useEffect, useMemo } from 'react';
import { api } from '../api/client';
import useStore from '../store/useStore';
import { getSearchSuggestions, resolveCelestialTarget, MASTER_CELESTIAL_TARGETS } from '../data/celestialCatalog';
import { Search, Loader2, Sparkles, X, Compass, Star, Globe, Orbit, ArrowRight, Sun, Moon as MoonIcon } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'solar' | 'exoplanet' | 'star' | 'constellation'
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { setPosition, setSelectedObject } = useStore();

  // Compute live typeahead suggestions
  const rawSuggestions = useMemo(() => {
    return getSearchSuggestions(query, 16);
  }, [query]);

  // Apply category filtering if selected
  const suggestions = useMemo(() => {
    if (categoryFilter === 'all') return rawSuggestions.slice(0, 8);
    return rawSuggestions
      .filter((item) => {
        const cat = (item.category || '').toLowerCase();
        if (categoryFilter === 'solar') {
          return cat.includes('solar') || cat.includes('planet') || cat.includes('moon');
        }
        if (categoryFilter === 'exoplanet') {
          return cat.includes('exoplanet') || cat.includes('system');
        }
        if (categoryFilter === 'constellation') {
          return cat.includes('constellation');
        }
        if (categoryFilter === 'deep') {
          return cat.includes('galaxy') || cat.includes('nebula') || cat.includes('deep') || cat.includes('analog') || cat.includes('black hole');
        }
        return true;
      })
      .slice(0, 8);
  }, [rawSuggestions, categoryFilter]);

  // Hotkey '/' to focus search, and click outside to close dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset keyboard selection index when query or category changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, categoryFilter]);

  // Jump to specific celestial target
  const selectTarget = (target) => {
    if (!target) return;
    const name = target.name || 'Target';
    setPosition(target.ra, target.dec, name);
    setSelectedObject({
      name,
      ra: target.ra,
      dec: target.dec,
      object_type: target.category || target.type || 'Celestial Object',
      description: target.desc || `Celestial target at RA ${target.ra.toFixed(4)}°, Dec ${target.dec >= 0 ? '+' : ''}${target.dec.toFixed(4)}°`,
      orbit: target.orbit,
      funFact: target.funFact,
    });
    setQuery('');
    setIsFocused(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle Enter submission
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    // If an item was navigated to via keyboard arrows, select it
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      selectTarget(suggestions[selectedIndex]);
      return;
    }

    const cleanQuery = query.trim().replace(/[<>]/g, '');
    if (!cleanQuery) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Direct offline high-precision catalog check
      const localMatch = resolveCelestialTarget(cleanQuery);
      if (localMatch) {
        selectTarget(localMatch);
        return;
      }

      // 2. Fall back to api.resolve (handles coordinates, backend SIMBAD, etc.)
      const result = await api.resolve(cleanQuery);
      selectTarget({
        name: result.name || cleanQuery,
        ra: result.ra,
        dec: result.dec,
        category: result.object_type || 'Celestial Object',
        desc: result.description,
      });
    } catch (err) {
      setError(err.message || `Could not find "${cleanQuery}". Try "Mars", "Proxima b", "TRAPPIST-1", or "Orion".`);
      setTimeout(() => setError(null), 5500);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation inside dropdown
  const handleKeyDownInput = (e) => {
    if (!isFocused || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Category badge helper
  const getCategoryBadge = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('solar') || cat.includes('planet')) {
      return {
        label: 'Solar System',
        icon: Orbit,
        className: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/80 dark:border-amber-700/80',
      };
    }
    if (cat.includes('exoplanet') || cat.includes('world') || cat.includes('system')) {
      return {
        label: 'Exoplanet World',
        icon: Globe,
        className: 'bg-teal-100 text-teal-900 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300/80 dark:border-teal-700/80',
      };
    }
    if (cat.includes('moon') || cat.includes('satellite')) {
      return {
        label: 'Moon',
        icon: MoonIcon,
        className: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
      };
    }
    if (cat.includes('constellation')) {
      return {
        label: 'Constellation',
        icon: Compass,
        className: 'bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-300 border-sky-300/80 dark:border-sky-700/80',
      };
    }
    if (cat.includes('nearest') || cat.includes('bright') || cat.includes('star')) {
      return {
        label: category || 'Star',
        icon: Star,
        className: 'bg-ocean-100 text-ocean-900 dark:bg-ocean-950/80 dark:text-ocean-300 border-ocean-300/80 dark:border-ocean-700/80',
      };
    }
    if (cat.includes('galaxy') || cat.includes('nebula') || cat.includes('deep')) {
      return {
        label: category || 'Deep Sky',
        icon: Sparkles,
        className: 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300/80 dark:border-purple-700/80',
      };
    }
    return {
      label: category || 'Planet X Analog',
      icon: Orbit,
      className: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-700/80',
    };
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-3.5 text-sand-500 dark:text-ocean-300/70 pointer-events-none flex items-center">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-ocean-500 dark:text-ocean-400" />
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
          onKeyDown={handleKeyDownInput}
          placeholder="Search solar systems, exoplanets, stars & coordinates (e.g. Mars, TRAPPIST-1, Proxima b)..."
          className="w-full pl-10 pr-16 py-2.5 text-xs font-mono rounded-xl bg-sand-50/90 dark:bg-space-950/85 border border-sand-300 dark:border-ocean-800/70 text-sand-900 dark:text-sand-100 placeholder:text-sand-500 dark:placeholder:text-ocean-300/50 focus:outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/25 transition-all shadow-inner"
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-10 text-sand-500 dark:text-ocean-300/70 hover:text-sand-900 dark:hover:text-sand-100 p-1"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="absolute right-3 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-sand-200/80 dark:bg-space-850 text-sand-700 dark:text-sand-300 border border-sand-300 dark:border-ocean-800/80 shadow-sm">
            /
          </kbd>
        </div>
      </form>

      {/* Live Typeahead Autocomplete & Celestial Catalog Presets */}
      {isFocused && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 p-2.5 rounded-2xl bg-sand-50/98 dark:bg-space-900/98 border border-sand-300 dark:border-ocean-800/90 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-1"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur before clicking option
        >
          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1.5 mb-1.5 border-b border-sand-200 dark:border-ocean-900/60 custom-scrollbar">
            {[
              { id: 'all', label: 'All Targets' },
              { id: 'solar', label: 'Solar System' },
              { id: 'exoplanet', label: 'Exoplanets' },
              { id: 'constellation', label: 'Constellations' },
              { id: 'deep', label: 'Deep Space' },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setCategoryFilter(pill.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === pill.id
                    ? 'bg-ocean-500 text-white shadow-sm'
                    : 'bg-sand-200/60 dark:bg-space-950/80 text-sand-700 dark:text-sand-300 hover:bg-sand-300/60 dark:hover:bg-space-800'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between px-2 py-1 mb-1 text-[10px] font-mono text-sand-600 dark:text-ocean-300/80 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-ocean-500 dark:text-ocean-400" />
              {query.trim().length === 0 ? 'Featured Celestial Destinations' : `Matched Catalog Targets (${suggestions.length})`}
            </span>
            <span className="text-[9px] lowercase text-sand-400 dark:text-ocean-400/60 hidden sm:inline">
              ↑↓ to navigate • ↵ to jump
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {suggestions.map((target, idx) => {
              const isSelected = selectedIndex === idx;
              const badge = getCategoryBadge(target.category);
              const BadgeIcon = badge.icon;

              return (
                <button
                  key={`${target.name}-${target.ra}`}
                  type="button"
                  onClick={() => selectTarget(target)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-ocean-100/70 dark:bg-ocean-950/70 border-ocean-500/50 shadow-sm'
                      : 'border-transparent hover:bg-sand-100/70 dark:hover:bg-space-850/60 hover:border-sand-300 dark:hover:border-ocean-800/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 pr-2">
                    <div className="mt-0.5 p-1 rounded-lg bg-sand-200/80 dark:bg-space-800 text-ocean-600 dark:text-ocean-300">
                      <BadgeIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-sand-900 dark:text-sand-100 truncate">
                          {target.name}
                        </span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded border ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-sand-600 dark:text-sand-300/80 truncate mt-0.5">
                        {target.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span className="font-mono text-[10px] text-ocean-700 dark:text-ocean-300 font-medium">
                      RA {target.ra.toFixed(2)}°
                    </span>
                    <span className="font-mono text-[9px] text-sand-500 dark:text-ocean-400/70">
                      Dec {target.dec >= 0 ? '+' : ''}{target.dec.toFixed(2)}°
                    </span>
                  </div>
                </button>
              );
            })}

            {suggestions.length === 0 && (
              <div className="p-4 text-center text-xs text-sand-500 dark:text-sand-400 font-mono">
                No matching catalog objects for "{query}".
                <br />
                <span className="text-[10px] text-ocean-600 dark:text-ocean-400">
                  Press ↵ Enter to query live SIMBAD / NED or input custom coordinates.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Error Alert */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2.5 rounded-xl bg-red-950/95 border border-red-500/50 text-red-200 text-xs font-mono z-50 shadow-xl animate-in fade-in flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
