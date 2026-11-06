import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import useStore from '../store/useStore';
import SpectrumPlot from './SpectrumPlot';
import ObservabilityWidget from './ObservabilityWidget';
import FeaturedTargets from './FeaturedTargets';
import HuntMode from './HuntMode';
import LoadingPulse from './LoadingPulse';
import Tooltip from './Tooltip';
import {
  Telescope,
  Sparkles,
  Target,
  Globe2,
} from 'lucide-react';

export default function DetailPanel() {
  const {
    ra,
    dec,
    targetName,
    activeEpoch,
    compareEpoch,
    mode,
    showObservability,
    activeChannel,
    isBlinking,
    setIsBlinking,
    flagCandidate,
  } = useStore();

  const [activeTab, setActiveTab] = useState('spectrum'); // 'spectrum' | 'diff' | 'crossref'

  // Queries
  const spectrumQuery = useQuery({
    queryKey: ['spectra', ra, dec, activeEpoch],
    queryFn: () => api.spectra(ra, dec, activeEpoch),
    enabled: !!ra && !!dec,
  });

  const compareQuery = useQuery({
    queryKey: ['spectra', ra, dec, compareEpoch],
    queryFn: () => api.spectra(ra, dec, compareEpoch),
    enabled: !!ra && !!dec,
  });

  const cutoutQuery = useQuery({
    queryKey: ['cutout', ra, dec, activeChannel],
    queryFn: () => api.cutout(ra, dec, activeChannel),
    enabled: !!ra && !!dec,
  });

  const diffQuery = useQuery({
    queryKey: ['diff', ra, dec, activeEpoch, compareEpoch],
    queryFn: () => api.diff(ra, dec, activeEpoch, compareEpoch, activeChannel),
    enabled: !!ra && !!dec,
  });

  const enrichQuery = useQuery({
    queryKey: ['enrich', ra, dec],
    queryFn: () => api.enrich(ra, dec),
    enabled: !!ra && !!dec,
  });

  return (
    <div className="flex flex-col h-full bg-white/95 dark:bg-slate-950/70 backdrop-blur-xl border-l border-slate-200 dark:border-white/10 overflow-y-auto transition-colors duration-200">
      {/* Target Header Banner */}
      <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-hud-glow animate-pulse" />
            <h2 className="text-base font-display font-bold text-slate-900 dark:text-white leading-tight">
              {targetName}
            </h2>
          </div>
          {enrichQuery.data?.object_type && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {enrichQuery.data.object_type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <span>RA {ra.toFixed(4)}°</span>
          <span>•</span>
          <span>DEC {dec >= 0 ? '+' : ''}{dec.toFixed(4)}°</span>
          <span>•</span>
          <span className="text-amber-600 dark:text-amber-400">EPOCH {activeEpoch}</span>
        </div>
      </div>

      {/* Main Mode View */}
      {mode === 'hunt' ? (
        <HuntMode />
      ) : (
        <div className="flex flex-col gap-4 p-4">
          {/* Real-time Atmospheric Observability Widget (when toggled via Header) */}
          {showObservability && <ObservabilityWidget />}

          {/* FITS Spectral Tile & Cutout Card */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Telescope className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                  Infrared Spectral Tile
                </h3>
              </div>
              <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                CH {activeChannel} · λ {cutoutQuery.data?.wavelength_um?.toFixed(2) || '2.30'} µm
              </span>
            </div>

            {cutoutQuery.isLoading ? (
              <LoadingPulse label="Retrieving FITS Cutout..." />
            ) : cutoutQuery.data ? (
              <div className="relative group overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                <img
                  src={`data:image/png;base64,${cutoutQuery.data.image_base64}`}
                  alt={`SPHEREx Near-Infrared Cutout at RA ${ra.toFixed(4)} Dec ${dec.toFixed(4)}`}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay false-color colorbar scale */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[9px] font-mono text-slate-300">
                  <span>LOW FLUX (0.01 MJy/sr)</span>
                  <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-blue-900 via-cyan-500 to-amber-400" />
                  <span>PEAK EMISSION</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Tab Selector: Spectra vs Epoch Diff vs CrossRef */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10">
            {[
              { id: 'spectrum', label: '102-Band Spectrum', icon: Sparkles },
              { id: 'diff', label: 'Epoch Diff & Movers', icon: Target },
              { id: 'crossref', label: 'Catalogs & Exoplanets', icon: Globe2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content 1: Spectrum */}
          {activeTab === 'spectrum' && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-200">
                  Spectrophotometric Profile
                </span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                  0.75 µm → 5.00 µm
                </span>
              </div>
              {spectrumQuery.isLoading ? (
                <LoadingPulse label="Extracting 102 Spectral Channels..." />
              ) : spectrumQuery.data ? (
                <SpectrumPlot
                  data={spectrumQuery.data.spectrum}
                  compareData={compareQuery.data?.spectrum}
                  epochA={activeEpoch}
                  epochB={compareEpoch}
                />
              ) : null}
            </div>
          )}

          {/* Tab Content 2: Epoch Diff & Movers */}
          {activeTab === 'diff' && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Pixel Differencing Engine
                  </span>
                </div>
                <Tooltip content="Blink back and forth between Epochs" tag="BLINK">
                  <button
                    onClick={() => setIsBlinking(!isBlinking)}
                    className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                  >
                    {isBlinking ? 'Pause Blink' : 'Auto Blink'}
                  </button>
                </Tooltip>
              </div>

              {diffQuery.isLoading ? (
                <LoadingPulse label="Computing Difference Residuals..." />
              ) : diffQuery.data ? (
                <>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 mb-3">
                    <img
                      src={`data:image/png;base64,${diffQuery.data.diff_image_base64}`}
                      alt="Diff residuals between epochs"
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md font-mono text-[10px] text-amber-300">
                      Residuals: {activeEpoch} vs {compareEpoch}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-300">
                      Detected Mover Candidates ({diffQuery.data.candidates?.length || 0})
                    </span>
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                      Filtered & Ranked by Signal
                    </span>
                  </div>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {diffQuery.data.candidates?.slice(0, 6).map((c, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 hover:border-amber-400/40 transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                            Candidate #{i + 1}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                            RA {c.ra}° · DEC {c.dec}° · Δ {c.shift_arcsec}"
                          </span>
                        </div>
                        <Tooltip content="Flag this candidate into Citizen Science Discovery Log" tag="FLAG">
                          <button
                            onClick={() =>
                              flagCandidate({
                                name: `Candidate #${i + 1} at RA ${c.ra}°`,
                                ra: c.ra,
                                dec: c.dec,
                                epochA: activeEpoch,
                                epochB: compareEpoch,
                                shiftArcsec: c.shift_arcsec,
                                tag: 'Automated Mover Detection',
                                notes: `Detected via pixel difference residual with significance peak of ${c.peak_flux}.`,
                                confidence: 'High',
                              })
                            }
                            className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                          >
                            + Flag
                          </button>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Tab Content 3: CrossRef Catalogs & Exoplanets */}
          {activeTab === 'crossref' && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl backdrop-blur-md">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                Multi-Mission Intelligence
              </h4>

              {enrichQuery.isLoading ? (
                <LoadingPulse label="Cross-referencing SIMBAD, Exoplanets & NeoWs..." />
              ) : (
                <div className="space-y-3">
                  {/* SIMBAD Object */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 font-mono text-xs">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                      SIMBAD Astronomical Database
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {enrichQuery.data?.simbad_name || 'No direct stellar identifier within 30"'}
                    </div>
                    {enrichQuery.data?.spectral_type && (
                      <div className="text-cyan-600 dark:text-cyan-400 text-[11px] mt-0.5">
                        Spectral Class: {enrichQuery.data.spectral_type}
                      </div>
                    )}
                  </div>

                  {/* NASA Exoplanet Archive */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 font-mono text-xs">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                      NASA Exoplanet Archive (Caltech/IPAC)
                    </div>
                    {enrichQuery.data?.exoplanets?.length > 0 ? (
                      <div className="space-y-1.5 mt-1">
                        {enrichQuery.data.exoplanets.map((exo, i) => (
                          <div key={i} className="text-[11px] text-amber-600 dark:text-amber-300">
                            🪐 {exo.name} (Period: {exo.orbital_period_days?.toFixed(1)}d)
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        No confirmed transiting exoplanets cataloged in this immediate arcminute field.
                      </div>
                    )}
                  </div>

                  {/* NASA NeoWs */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 font-mono text-xs">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                      NASA Asteroid NeoWs Feed
                    </div>
                    {enrichQuery.data?.nearby_neos?.length > 0 ? (
                      <div className="space-y-1 mt-1 text-[11px] text-slate-700 dark:text-slate-300">
                        {enrichQuery.data.nearby_neos.slice(0, 3).map((neo, i) => (
                          <div key={i}>
                            ☄️ {neo.name} (Approaching {neo.close_approach_date})
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        No hazardous close-approaches in this quadrant today.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Observability Widget */}
          {/* Featured Targets Carousel */}
          {mode === 'explore' && <FeaturedTargets />}
        </div>
      )}

      {/* Footer Provenance */}
      <div className="mt-auto p-3 text-center border-t border-slate-200 dark:border-white/10">
        <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          NASA SPHEREx MISSION DATA · DOI: 10.26131/IRSA629
        </span>
      </div>
    </div>
  );
}
