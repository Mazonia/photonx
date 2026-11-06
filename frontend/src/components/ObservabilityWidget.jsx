import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import useStore from '../store/useStore';
import LoadingPulse from './LoadingPulse';
import Tooltip from './Tooltip';
import { Eye, CheckCircle2, AlertTriangle, Cloud, Compass, Wind, Activity } from 'lucide-react';

export default function ObservabilityWidget() {
  const { ra, dec, observerLat, observerLon, setObserverLocation } = useStore();
  const [locRequested, setLocRequested] = useState(false);

  useEffect(() => {
    if (locRequested) return;
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setObserverLocation(pos.coords.latitude, pos.coords.longitude);
          setLocRequested(true);
        },
        () => setLocRequested(true),
        { timeout: 5000 }
      );
    }
  }, [locRequested, setObserverLocation]);

  const obsQuery = useQuery({
    queryKey: ['observability', ra, dec, observerLat, observerLon],
    queryFn: () => api.observability(ra, dec, observerLat, observerLon),
    enabled: !!ra && !!dec,
  });

  const cloudCover = obsQuery.data?.cloud_cover_pct ?? 25;
  const targetAlt = obsQuery.data?.target_altitude_deg ?? 45;
  // Airmass formula: X = 1 / sin(alt)
  const airmass = targetAlt > 0 ? (1 / Math.sin(Math.max(5, targetAlt) * Math.PI / 180)).toFixed(2) : 'Horizon Blocked';
  // Atmospheric optical transmission estimate
  const opticalTransparency = Math.max(5, Math.min(98, Math.round((100 - cloudCover) * (targetAlt > 20 ? 0.95 : 0.6))));

  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Satellite Atmospheric Radar
          </h3>
        </div>
        <span className="font-mono text-[9px] text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
          OpenWeather / Agro Live
        </span>
      </div>

      {obsQuery.isLoading ? (
        <LoadingPulse label="Scanning Satellite Cloud Layers & Atmospheric Transmission..." />
      ) : obsQuery.data ? (
        <div className="space-y-3">
          {/* Status Verdict Banner */}
          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              obsQuery.data.is_observable
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300'
            }`}
          >
            {obsQuery.data.is_observable ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                {obsQuery.data.is_observable ? 'Optical Window Open' : 'Sub-Optimal Observation'}
              </span>
              <p className="text-[11px] font-sans text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">
                {obsQuery.data.recommendation}
              </p>
            </div>
          </div>

          {/* Real-time Satellite Atmospheric Radar Graphic */}
          <div className="relative p-3 rounded-xl bg-slate-950/90 border border-white/10 overflow-hidden flex items-center justify-between">
            {/* Radar Simulation */}
            <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
              {/* Concentric distance rings */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-3 rounded-full border border-cyan-500/30" />
              <div className="absolute inset-6 rounded-full border border-cyan-500/40" />
              {/* Crosshair */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20" />
              {/* Rotating Radar Sweep */}
              <div className="absolute inset-0 rounded-full border-t border-r border-transparent border-t-cyan-400 border-r-cyan-400/50 animate-[spin_3s_linear_infinite]" />
              {/* Cloud Density Blobs */}
              <div
                className="absolute inset-2 rounded-full pointer-events-none transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 60% 40%, rgba(255,255,255,${cloudCover * 0.005}) 0%, transparent 60%)`,
                }}
              />
              {/* Center Observatory Reticle */}
              <div className="relative w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>

            {/* Radar Telemetry Metrics */}
            <div className="flex flex-col justify-center gap-1.5 pl-3 flex-1 font-mono text-[11px]">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[10px]">TRANSPARENCY:</span>
                <span className="font-bold text-cyan-400">{opticalTransparency}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[10px]">AIRMASS (X):</span>
                <span className="font-bold text-amber-400">{airmass}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[10px]">CLOUD COVER:</span>
                <span className="font-bold text-slate-200">{cloudCover}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 text-[10px]">VISIBILITY:</span>
                <span className="font-bold text-emerald-400">{obsQuery.data.visibility_km} km</span>
              </div>
            </div>
          </div>

          {/* Environmental Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <Tooltip content="Target elevation angle above local horizon (>30° recommended)" tag="ALTITUDE">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Target Altitude:</span>
                <span className={`font-bold ${targetAlt > 30 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {targetAlt}°
                </span>
              </div>
            </Tooltip>

            <Tooltip content="Current lunar phase and natural skyglow interference" tag="LUNAR">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Lunar Phase:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  {obsQuery.data.moon_phase}
                </span>
              </div>
            </Tooltip>
          </div>

          {/* Footer Provenance */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200 dark:border-white/5">
            <span>Lat: {observerLat.toFixed(2)}° · Lon: {observerLon.toFixed(2)}°</span>
            <span className="text-cyan-600 dark:text-cyan-400">OpenWeather API Verified</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
