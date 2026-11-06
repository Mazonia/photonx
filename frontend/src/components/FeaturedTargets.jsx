import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import useStore from '../store/useStore';
import LoadingPulse from './LoadingPulse';
import Tooltip from './Tooltip';
import { Orbit, ArrowUpRight } from 'lucide-react';

export default function FeaturedTargets() {
  const { setPosition, ra: currentRa, dec: currentDec } = useStore();

  const { data, isLoading } = useQuery({
    queryKey: ['featured'],
    queryFn: api.featured,
    staleTime: Infinity,
  });

  if (isLoading) return <LoadingPulse label="Accessing Celestial Catalog..." />;

  const targets = data?.targets || [];

  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Orbit className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Curated Celestial Benchmarks
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
          {targets.length} Targets
        </span>
      </div>

      <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
        Key astronomical bodies demonstrating SPHEREx 102-band infrared capability, moving object detection, and molecular ices.
      </p>

      <div className="space-y-2">
        {targets.map((target, i) => {
          const isSelected =
            Math.abs(currentRa - target.ra) < 0.05 && Math.abs(currentDec - target.dec) < 0.05;

          return (
            <Tooltip
              key={i}
              content={target.why_interesting}
              tag={target.category}
              position="left"
            >
              <button
                onClick={() => setPosition(target.ra, target.dec, target.name)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 border group ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400/50 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-white/5 hover:border-cyan-400/30 hover:bg-slate-100 dark:hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {target.name}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/5">
                    {target.category}
                  </span>
                </div>

                <p className="text-[11px] font-sans text-slate-600 dark:text-slate-400 leading-snug mb-1.5 line-clamp-2">
                  {target.description}
                </p>

                <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-600 dark:text-cyan-400/80">
                  <span>RA {target.ra.toFixed(4)}°</span>
                  <span>•</span>
                  <span>DEC {target.dec >= 0 ? '+' : ''}{target.dec.toFixed(4)}°</span>
                </div>
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
