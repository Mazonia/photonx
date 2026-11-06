import React from 'react';
import useStore from '../store/useStore';

/**
 * ObjectCard — Displays a candidate moving object detected in diff analysis.
 * Shows RA/Dec, shift, interestingness score, and action buttons.
 */
export default function ObjectCard({ candidate, index }) {
  const { setPosition } = useStore();

  const interestColor = candidate.interestingness > 0.7
    ? 'text-gold'
    : candidate.interestingness > 0.4
      ? 'text-stellar-teal'
      : 'text-muted';

  return (
    <div
      className="stagger-item panel-border p-2 hover:border-stellar-teal/30 transition-colors duration-150 cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => setPosition(candidate.ra, candidate.dec, `Candidate #${index + 1}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setPosition(candidate.ra, candidate.dec, `Candidate #${index + 1}`);
        }
      }}
      aria-label={`Candidate mover ${index + 1} at RA ${candidate.ra.toFixed(4)}, Dec ${candidate.dec.toFixed(4)}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold shadow-gold-glow" />
          <span className="text-[11px] font-semibold text-starlight">
            Candidate #{index + 1}
          </span>
        </div>
        <span className={`data-readout text-[10px] ${interestColor}`}>
          ★ {(candidate.interestingness * 100).toFixed(0)}%
        </span>
      </div>

      <div className="data-readout text-[10px] text-muted grid grid-cols-2 gap-x-3">
        <span>RA {candidate.ra.toFixed(4)}°</span>
        <span>Dec {candidate.dec >= 0 ? '+' : ''}{candidate.dec.toFixed(4)}°</span>
        <span>Shift {candidate.shift_arcsec}″</span>
        <span>PA {candidate.shift_angle_deg}°</span>
        <span>Peak {candidate.peak_flux.toFixed(3)}</span>
        <span>{candidate.simbad_match || 'No match'}</span>
      </div>
    </div>
  );
}

