import React, { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import { COSMIC_TOUR_DESTINATIONS, MASTER_CELESTIAL_TARGETS, ALL_CONSTELLATIONS } from '../data/celestialCatalog';
import {
  X,
  Orbit,
  Globe,
  Compass,
  Sparkles,
  Telescope,
  ArrowRight,
  Search,
  ExternalLink,
  Flame,
  Info,
} from 'lucide-react';

export default function CosmicNavigatorModal({ isOpen, onClose }) {
  const { setPosition, setSelectedObject, ra: currentRa, dec: currentDec } = useStore();
  const [activeTab, setActiveTab] = useState('Solar System Worlds');
  const [filterText, setFilterText] = useState('');

  // Tab definitions
  const TABS = [
    { id: 'Solar System Worlds', label: 'Solar System', icon: Orbit, color: 'text-amber-600 dark:text-amber-400' },
    { id: 'Exoplanetary Systems', label: 'Exoplanets', icon: Globe, color: 'text-ocean-600 dark:text-ocean-300' },
    { id: 'Stellar Anchors & Constellations', label: 'Constellations & Stars', icon: Compass, color: 'text-sky-600 dark:text-sky-400' },
    { id: 'Deep Cosmos & Planet X Analogs', label: 'Deep Cosmos & Planet X', icon: Sparkles, color: 'text-purple-600 dark:text-purple-400' },
  ];

  // Get items for current tab from COSMIC_TOUR_DESTINATIONS
  const currentCategoryData = useMemo(() => {
    const group = COSMIC_TOUR_DESTINATIONS.find((g) => g.category === activeTab);
    return group ? group.items : [];
  }, [activeTab]);

  // Enrich items with detailed metadata from MASTER_CELESTIAL_TARGETS
  const enrichedItems = useMemo(() => {
    return currentCategoryData.map((item) => {
      const match = MASTER_CELESTIAL_TARGETS.find(
        (t) => t.name.toLowerCase() === item.name.toLowerCase() || (t.aliases && t.aliases.some((a) => a.toLowerCase() === item.name.toLowerCase()))
      );
      return {
        ...item,
        type: match?.type || 'Celestial Body',
        orbit: match?.orbit || null,
        funFact: match?.funFact || null,
        category: match?.category || item.tag,
      };
    });
  }, [currentCategoryData]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!filterText.trim()) return enrichedItems;
    const q = filterText.toLowerCase();
    return enrichedItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        (item.type && item.type.toLowerCase().includes(q)) ||
        (item.tag && item.tag.toLowerCase().includes(q))
    );
  }, [enrichedItems, filterText]);

  if (!isOpen) return null;

  const handleSelect = (item) => {
    setPosition(item.ra, item.dec, item.name);
    setSelectedObject({
      name: item.name,
      ra: item.ra,
      dec: item.dec,
      object_type: item.type || item.category || 'Celestial Object',
      description: item.desc,
      orbit: item.orbit,
      funFact: item.funFact,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl bg-sand-50 dark:bg-space-900 border border-sand-300 dark:border-ocean-800/80 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200 dark:border-ocean-900/60 bg-sand-100/80 dark:bg-space-950/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-ocean-500/10 border border-ocean-500/30 text-ocean-600 dark:text-ocean-400">
              <Orbit className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-sand-900 dark:text-sand-50">
                  Cosmic World Navigator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Interactive Fleet Guide
                </span>
              </div>
              <p className="text-xs text-sand-600 dark:text-sand-400 font-sans mt-0.5">
                Explore solar systems, habitable exoplanets, stellar anchors, and trans-Neptunian Planet X search fields.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sand-500 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 hover:bg-sand-200/80 dark:hover:bg-space-800 transition-colors"
            title="Close Navigator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs & Search Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-3 border-b border-sand-200 dark:border-ocean-900/40 bg-sand-50/90 dark:bg-space-900/90">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setFilterText('');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-ocean-500 text-white shadow-md'
                      : 'bg-sand-200/70 dark:bg-space-950 text-sand-700 dark:text-sand-300 hover:bg-sand-300/60 dark:hover:bg-space-850'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search inside modal */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sand-500 dark:text-sand-400 pointer-events-none" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter worlds..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-xl bg-white dark:bg-space-950 border border-sand-300 dark:border-ocean-800/80 text-sand-900 dark:text-sand-100 placeholder:text-sand-500 dark:placeholder:text-sand-500 focus:outline-none focus:border-ocean-500 transition-all"
            />
          </div>
        </div>

        {/* Worlds Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredItems.map((item) => {
              const isCurrent =
                Math.abs(currentRa - item.ra) < 0.1 && Math.abs(currentDec - item.dec) < 0.1;

              return (
                <div
                  key={item.name}
                  onClick={() => handleSelect(item)}
                  className={`group relative flex flex-col justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-ocean-50 dark:bg-ocean-950/60 border-ocean-500 shadow-md ring-1 ring-ocean-500/40'
                      : 'bg-white dark:bg-space-950/70 border-sand-200 dark:border-ocean-900/60 hover:border-ocean-400/60 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    {/* Top Row: Name + Category Tag + Coordinates */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-sand-900 dark:text-sand-50 group-hover:text-ocean-600 dark:group-hover:text-ocean-300 transition-colors">
                            {item.name}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-ocean-500 text-white animate-pulse">
                              Observing
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono uppercase text-ocean-700 dark:text-ocean-400 font-semibold">
                          {item.type}
                        </span>
                      </div>

                      <div className="text-right font-mono text-[10px] text-sand-500 dark:text-sand-400 shrink-0">
                        <div>RA {item.ra.toFixed(2)}°</div>
                        <div>Dec {item.dec >= 0 ? '+' : ''}{item.dec.toFixed(2)}°</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-sand-600 dark:text-sand-300 font-sans leading-relaxed mb-2.5">
                      {item.desc}
                    </p>

                    {/* Orbit / Distance Badge (if available) */}
                    {item.orbit && (
                      <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-lg bg-sand-100 dark:bg-space-900 border border-sand-200 dark:border-ocean-900/40 text-[10.5px] font-mono text-sand-700 dark:text-sand-300">
                        <Orbit className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">{item.orbit}</span>
                      </div>
                    )}

                    {/* Fun Fact / SPHEREx Role */}
                    {item.funFact && (
                      <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10.5px] font-sans text-amber-800 dark:text-amber-300 leading-snug">
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        <span>{item.funFact}</span>
                      </div>
                    )}
                  </div>

                  {/* Slew Button Bar */}
                  <div className="mt-3 pt-2.5 border-t border-sand-100 dark:border-ocean-900/40 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-sand-400 dark:text-sand-500">
                      SPHEREx 102-Band Target
                    </span>
                    <div className="flex items-center gap-1 text-ocean-600 dark:text-ocean-300 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Slew Telescope</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-sm font-mono text-sand-500 dark:text-sand-400">
              No celestial targets matching "{filterText}" in this category.
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 border-t border-sand-200 dark:border-ocean-900/60 bg-sand-100/60 dark:bg-space-950/60 flex items-center justify-between text-[11px] font-mono text-sand-600 dark:text-sand-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-ocean-500 dark:text-ocean-400" />
            Clicking any world immediately updates telescope coordinates, centers canvas, and opens its 102-band infrared spectrum.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-sand-200/80 dark:bg-space-800 hover:bg-sand-300 dark:hover:bg-space-700 text-xs font-semibold text-sand-800 dark:text-sand-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
