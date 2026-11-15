import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import useStore from '../store/useStore';
import SpectrumPlot from './SpectrumPlot';
import ObservabilityWidget from './ObservabilityWidget';
import FeaturedTargets from './FeaturedTargets';
import HuntMode from './HuntMode';
import LoadingPulse from './LoadingPulse';
import NasaDashboard from './NasaDashboard';
import Tooltip from './Tooltip';
import { resolveCelestialTarget } from '../data/celestialCatalog';
import {
  Telescope,
  Sparkles,
  Target,
  Globe2,
  Rocket,
  Orbit,
} from 'lucide-react';

export default function DetailPanel() {
  const {
    ra,
    dec,
    targetName,
    activeEpoch,
    compareEpoch,
    setActiveEpoch,
    setCompareEpoch,
    setPosition,
    mode,
    showObservability,
    activeChannel,
    setActiveChannel,
    isBlinking,
    setIsBlinking,
    flagCandidate,
    epochs,
  } = useStore();

  const [activeTab, setActiveTab] = useState('spectrum'); // 'spectrum' | 'diff' | 'crossref' | 'nasa'
  const [diffThreshold, setDiffThreshold] = useState(3.0);
  const [diffChannel, setDiffChannel] = useState(activeChannel || 42);

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
    queryKey: ['diff', ra, dec, activeEpoch, compareEpoch, diffChannel, diffThreshold],
    queryFn: () => api.diff(ra, dec, activeEpoch, compareEpoch, diffChannel, diffThreshold),
    enabled: !!ra && !!dec,
  });

  const enrichQuery = useQuery({
    queryKey: ['enrich', ra, dec],
    queryFn: () => api.enrich(ra, dec),
    enabled: !!ra && !!dec,
  });

  // Check if current target matches a known solar system planet, exoplanet, or benchmark
  const celestialInfo = React.useMemo(() => {
    return resolveCelestialTarget(targetName);
  }, [targetName]);

  return (
    <div data-tour="detail-panel" className="flex flex-col h-full bg-sand-50/95 dark:bg-space-900/80 backdrop-blur-xl border-l border-sand-300 dark:border-ocean-900/60 overflow-y-auto transition-colors duration-200">
      {/* Target Header Banner */}
      <div className="p-4 border-b border-sand-200 dark:border-ocean-900/40 bg-sand-100/70 dark:bg-space-950/60">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-ocean-500 dark:bg-ocean-400 shadow-hud-glow animate-pulse" />
            <h2 className="text-base font-display font-bold text-slate-900 dark:text-sand-50 leading-tight">
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

          {/* Planetary & Exoworld Science Profile (when observing a planet, exoplanet, or benchmark) */}
          {celestialInfo && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-space-950/70 border border-sand-200 dark:border-ocean-900/60 shadow-sm dark:shadow-xl backdrop-blur-md animate-in fade-in">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Orbit className="w-4 h-4 text-amber-500 animate-spin-slow" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sand-900 dark:text-sand-100">
                    World Science Profile
                  </h3>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-ocean-500/15 text-ocean-700 dark:text-ocean-300 border border-ocean-500/30">
                  {celestialInfo.category || celestialInfo.type}
                </span>
              </div>

              <p className="text-xs text-sand-700 dark:text-sand-300 font-sans leading-relaxed mb-2.5">
                {celestialInfo.desc}
              </p>

              {/* Physical Telemetry Grid (Diameter, Temp, Gravity, Mass) */}
              {(celestialInfo.diameter_km || celestialInfo.surface_temp_c !== undefined || celestialInfo.gravity_g || celestialInfo.mass_earth) && (
                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                  {celestialInfo.diameter_km && (
                    <div className="p-2 rounded-xl bg-sand-100 dark:bg-space-900/80 border border-sand-200 dark:border-ocean-900/40">
                      <div className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400">Diameter</div>
                      <div className="text-xs font-mono font-bold text-ocean-700 dark:text-ocean-300">{celestialInfo.diameter_km.toLocaleString()} km</div>
                    </div>
                  )}
                  {celestialInfo.surface_temp_c !== undefined && (
                    <div className="p-2 rounded-xl bg-sand-100 dark:bg-space-900/80 border border-sand-200 dark:border-ocean-900/40">
                      <div className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400">Surface Temp</div>
                      <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {celestialInfo.surface_temp_c > 0 ? `+${celestialInfo.surface_temp_c}` : celestialInfo.surface_temp_c}°C
                      </div>
                    </div>
                  )}
                  {celestialInfo.gravity_g !== undefined && (
                    <div className="p-2 rounded-xl bg-sand-100 dark:bg-space-900/80 border border-sand-200 dark:border-ocean-900/40">
                      <div className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400">Surface Gravity</div>
                      <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{celestialInfo.gravity_g} g</div>
                    </div>
                  )}
                  {celestialInfo.mass_earth && (
                    <div className="p-2 rounded-xl bg-sand-100 dark:bg-space-900/80 border border-sand-200 dark:border-ocean-900/40">
                      <div className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400">Mass (Earths)</div>
                      <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{celestialInfo.mass_earth} M⊕</div>
                    </div>
                  )}
                </div>
              )}

              {/* Atmosphere & Spectroscopic Signature */}
              {celestialInfo.atmosphere && (
                <div className="p-2 rounded-xl bg-sand-100 dark:bg-space-900/80 border border-sand-200 dark:border-ocean-900/40 text-[11px] mb-2 font-mono">
                  <div className="text-[9px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-0.5">Atmosphere & Composition</div>
                  <div className="text-slate-700 dark:text-slate-300 leading-snug">{celestialInfo.atmosphere}</div>
                </div>
              )}

              {/* SPHEREx Science Diagnostic */}
              {celestialInfo.spherex_diag && (
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-[11px] mb-2 font-sans">
                  <div className="text-[9px] uppercase text-cyan-600 dark:text-cyan-400 font-mono font-bold mb-0.5">SPHEREx Infrared Diagnostics</div>
                  <div className="text-cyan-900 dark:text-cyan-200 leading-snug">{celestialInfo.spherex_diag}</div>
                </div>
              )}

              {celestialInfo.orbit && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-sand-100 dark:bg-space-900/90 border border-sand-200 dark:border-ocean-900/40 text-[11px] font-mono text-sand-800 dark:text-sand-200 mb-2">
                  <Orbit className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold text-ocean-700 dark:text-ocean-300">Orbit / Distance:</span>
                  <span className="truncate">{celestialInfo.orbit}</span>
                </div>
              )}

              {/* Moons System with clickable slew buttons */}
              {celestialInfo.moons && celestialInfo.moons.length > 0 && (
                <div className="mb-2 p-2 rounded-xl bg-sand-100 dark:bg-space-900/80 border border-sand-200 dark:border-ocean-900/40">
                  <div className="text-[9px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 flex items-center justify-between">
                    <span>Major Satellites & Moons ({celestialInfo.moons_count || celestialInfo.moons.length})</span>
                    <span className="text-[8px] text-ocean-600 dark:text-ocean-400">Click to Slew</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {celestialInfo.moons.map((moon) => (
                      <button
                        key={moon}
                        onClick={() => {
                          const mInfo = resolveCelestialTarget(moon);
                          if (mInfo) {
                            setPosition(mInfo.ra, mInfo.dec, mInfo.name);
                          }
                        }}
                        className="px-2 py-0.5 rounded-lg bg-white dark:bg-space-800 border border-sand-300 dark:border-ocean-800 text-[10px] font-mono text-ocean-800 dark:text-ocean-300 hover:bg-ocean-500 hover:text-white transition-all shadow-xs"
                      >
                        🌕 {moon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {celestialInfo.funFact && (
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-sans text-amber-900 dark:text-amber-200 leading-snug">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{celestialInfo.funFact}</span>
                </div>
              )}
            </div>
          )}

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
          <div data-tour="detail-tabs" className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10">
            {[
              { id: 'spectrum', label: '102-Band Spectrum', icon: Sparkles, desc: 'Extract full 102-channel spectrophotometric curve (0.75-5.0µm) with molecular ice diagnostic markers.' },
              { id: 'diff', label: 'Epoch Diff & Movers', icon: Target, desc: 'Compute image subtraction residuals (Epoch B - Epoch A) to detect moving anomalies.' },
              { id: 'crossref', label: 'Catalogs & Exoplanets', icon: Globe2, desc: 'Multi-mission cross-referencing with SIMBAD, NASA Exoplanet Archive, and Near-Earth Objects.' },
              { id: 'nasa', label: 'NASA Live', icon: Rocket, desc: 'Live feed from official NASA APIs: APOD, NeoWs Asteroid Radar, DONKI Space Weather, and EPIC Earth view.' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Tooltip key={tab.id} content={tab.desc} tag={tab.label} position="bottom">
                  <button
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
                </Tooltip>
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
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl backdrop-blur-md space-y-3">
              {/* Header & Controls */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                    Pixel Differencing Engine
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Matrix subtraction: ΔI = I_B - I_A (Cancels fixed stars)
                  </span>
                </div>
                <Tooltip content="Blink back and forth between Epochs" tag="BLINK">
                  <button
                    onClick={() => setIsBlinking(!isBlinking)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all ${
                      isBlinking
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm animate-pulse'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                    }`}
                  >
                    {isBlinking ? 'Pause Blink' : 'Auto Blink'}
                  </button>
                </Tooltip>
              </div>

              {/* Interactive Epoch Comparators */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">EPOCH A (Base):</span>
                  <div className="flex items-center gap-1">
                    {(epochs || ['2025-W18', '2025-W44', '2026-W18', '2026-W44']).map((ep) => (
                      <button
                        key={`a-${ep}`}
                        onClick={() => setActiveEpoch(ep)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          activeEpoch === ep
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-amber-400/40'
                        }`}
                      >
                        {ep.replace('202', "'2")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">EPOCH B (Compare):</span>
                  <div className="flex items-center gap-1">
                    {(epochs || ['2025-W18', '2025-W44', '2026-W18', '2026-W44']).map((ep) => (
                      <button
                        key={`b-${ep}`}
                        onClick={() => setCompareEpoch(ep)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          compareEpoch === ep
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-cyan-400/40'
                        }`}
                      >
                        {ep.replace('202', "'2")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Same Epoch Alert Warning */}
                {activeEpoch === compareEpoch && (
                  <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-[11px] text-amber-800 dark:text-amber-200">
                    <strong>Zero Baseline Notice:</strong> Comparing identical epochs produces a flat zero residual. Select different epochs (e.g. 2025-W18 vs 2025-W44) to reveal shifting objects!
                  </div>
                )}
              </div>

              {/* Differencing Channel & Sensitivity Controls */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Channel Selector */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mb-1">
                    SPECTRAL BAND:
                  </span>
                  <div className="flex items-center gap-1">
                    {[
                      { ch: 0, label: '0.75µm' },
                      { ch: 42, label: '2.3µm CH4' },
                      { ch: 60, label: '3.0µm H2O' },
                      { ch: 70, label: '4.3µm CO2' },
                    ].map((b) => (
                      <button
                        key={b.ch}
                        onClick={() => setDiffChannel(b.ch)}
                        className={`flex-1 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                          diffChannel === b.ch
                            ? 'bg-ocean-500 text-white'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sensitivity Slider */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      SENSITIVITY:
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      {diffThreshold.toFixed(1)}σ
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="6.0"
                    step="0.5"
                    value={diffThreshold}
                    onChange={(e) => setDiffThreshold(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>1.5σ (Sensitive)</span>
                    <span>6.0σ (Strict)</span>
                  </div>
                </div>
              </div>

              {diffQuery.isLoading ? (
                <LoadingPulse label="Computing Physical Difference Residuals..." />
              ) : diffQuery.data ? (
                <>
                  {/* Difference Image Canvas Display */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner bg-black">
                    <img
                      src={`data:image/png;base64,${diffQuery.data.diff_image_base64}`}
                      alt="Diff residuals between epochs"
                      className="w-full aspect-square object-contain mx-auto"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-slate-950/85 backdrop-blur-md font-mono text-[10px] text-amber-300 border border-white/10">
                      Residuals: {activeEpoch} vs {compareEpoch} ({diffQuery.data.baseline_months || 0} mo)
                    </div>
                  </div>

                  {/* Candidate List Header */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Detected Mover Candidates ({diffQuery.data.candidates?.length || 0})
                    </span>
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                      Ranked by Signal Significance
                    </span>
                  </div>

                  {/* Candidate Cards */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(!diffQuery.data.candidates || diffQuery.data.candidates.length === 0) ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-300 dark:border-white/10 text-center text-xs text-slate-500">
                        No movers detected above {diffThreshold.toFixed(1)}σ threshold. Try lowering the sensitivity slider or changing survey epochs!
                      </div>
                    ) : (
                      diffQuery.data.candidates.map((c, i) => (
                        <div
                          key={c.id || i}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 hover:border-amber-400/40 transition-colors flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 truncate">
                                {c.name || `Candidate #${i + 1}`}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[9px] font-bold">
                                {c.sigma ? `${c.sigma}σ` : 'Peak'}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                              RA {c.ra}° · DEC {c.dec}° · Δ {c.shift_arcsec}" ({c.shift_angle_deg || 0}°)
                            </span>
                            {c.classification && (
                              <span className="text-[9.5px] text-slate-600 dark:text-slate-300 italic truncate">
                                {c.classification}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <Tooltip content="Center sky engine on candidate's exact coordinates" tag="NAVIGATE">
                              <button
                                onClick={() => setPosition(c.ra, c.dec, c.name)}
                                className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-ocean-500/10 text-ocean-700 dark:text-ocean-300 border border-ocean-500/30 hover:bg-ocean-500/20"
                              >
                                Center
                              </button>
                            </Tooltip>

                            <Tooltip content="Flag candidate into Citizen Science Discovery Log" tag="FLAG">
                              <button
                                onClick={() =>
                                  flagCandidate({
                                    name: c.name || `Candidate #${i + 1} at RA ${c.ra}°`,
                                    ra: c.ra,
                                    dec: c.dec,
                                    epochA: activeEpoch,
                                    epochB: compareEpoch,
                                    shiftArcsec: c.shift_arcsec,
                                    tag: c.classification || 'Automated Mover Detection',
                                    notes: `Detected in CH ${diffChannel} with significance of ${c.sigma || 'High'}σ across ${diffQuery.data.baseline_months} months.`,
                                    confidence: c.sigma > 6 ? 'High' : 'Medium',
                                  })
                                }
                                className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                              >
                                + Flag
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      ))
                    )}
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

          {/* Tab Content 4: NASA Live Dashboard */}
          {activeTab === 'nasa' && <NasaDashboard />}
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
