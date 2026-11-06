import React from 'react';
import { Telescope } from 'lucide-react';

export default function LoadingPulse({ label = 'Querying SPHEREx Deep Archive...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status">
      <div className="relative flex items-center justify-center w-12 h-12">
        {/* Pulsing radar rings */}
        <span className="absolute w-full h-full rounded-full border border-cyan-400/40 animate-ping opacity-75" />
        <span className="absolute w-8 h-8 rounded-full border border-cyan-400/60 animate-pulse" />
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400">
          <Telescope className="w-3.5 h-3.5" />
        </div>
      </div>
      <span className="font-mono text-xs text-cyan-400 tracking-wider uppercase">
        {label}
      </span>
    </div>
  );
}
