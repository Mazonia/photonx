import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import LoadingPulse from './LoadingPulse';
import Tooltip from './Tooltip';
import { Image, AlertCircle, ExternalLink, Shield, Zap } from 'lucide-react';

export default function NasaDashboard() {
  const [apodTab, setApodTab] = useState('today'); // 'today' | 'neo' | 'weather'

  const apodQuery = useQuery({
    queryKey: ['apod', 'today'],
    queryFn: () => api.apod(null, 1),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const neoQuery = useQuery({
    queryKey: ['neo'],
    queryFn: () => api.neo(),
    staleTime: 1000 * 60 * 30, // 30 min
  });

  const weatherQuery = useQuery({
    queryKey: ['space-weather'],
    queryFn: () => api.spaceWeather(),
    staleTime: 1000 * 60 * 15,
  });

  const apod = apodQuery.data?.apods?.[0];
  const neos = neoQuery.data?.neos || [];
  const hazardousNeos = neos.filter((n) => n.is_hazardous);

  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl backdrop-blur-md">
      {/* Sub-tab switcher */}
      <div className="flex items-center gap-1 mb-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10">
        {[
          { id: 'today', label: 'APOD', title: 'Astronomy Picture of the Day', desc: 'NASA Astronomy Picture of the Day with full scientific commentary.' },
          { id: 'neo', label: 'NEOs', title: 'Near-Earth Objects', desc: 'NASA NeoWs feed tracking asteroid close-approaches and hazardous classifications.' },
          { id: 'weather', label: 'Space Wx', title: 'Space Weather', desc: 'NASA DONKI real-time telemetry on Coronal Mass Ejections and geomagnetic storms.' },
        ].map((tab) => (
          <Tooltip key={tab.id} content={tab.desc} tag={tab.label} position="bottom">
            <button
              onClick={() => setApodTab(tab.id)}
              className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                apodTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          </Tooltip>
        ))}
      </div>

      {/* APOD Panel */}
      {apodTab === 'today' && (
        <div>
          {apodQuery.isLoading ? (
            <LoadingPulse label="Fetching Astronomy Picture of the Day..." />
          ) : apod ? (
            <div className="space-y-2">
              {apod.media_type === 'image' ? (
                <div className="relative group overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full object-cover max-h-48 transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-slate-950 to-transparent">
                    <span className="font-mono text-[9px] text-cyan-300 uppercase tracking-widest">NASA APOD · {apod.date}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5">
                  <Image className="w-5 h-5 text-cyan-500" />
                  <span className="text-xs font-mono text-slate-500">Video: {apod.title}</span>
                </div>
              )}
              <div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1">
                  {apod.title}
                </div>
                <p className="text-[11px] font-sans text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                  {apod.explanation}
                </p>
                {apod.copyright && (
                  <div className="mt-1 font-mono text-[9px] text-slate-400">© {apod.copyright}</div>
                )}
              </div>
              {apod.hdurl && (
                <a
                  href={apod.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  View HD Image
                </a>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-500 text-center py-3 font-mono">APOD unavailable</div>
          )}
        </div>
      )}

      {/* NEO Panel */}
      {apodTab === 'neo' && (
        <div>
          {neoQuery.isLoading ? (
            <LoadingPulse label="Fetching Near-Earth Object feed..." />
          ) : (
            <div className="space-y-2">
              {/* Stats Banner */}
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {[
                  { label: 'TOTAL', value: neoQuery.data?.element_count ?? 'N/A', color: 'text-slate-200' },
                  { label: 'HAZARDOUS', value: neoQuery.data?.hazardous_count ?? 'N/A', color: 'text-red-400' },
                  { label: 'TRACKED', value: neos.length, color: 'text-cyan-400' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-center"
                  >
                    <div className={`font-mono text-base font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              {hazardousNeos.length > 0 && (
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono text-[10px]">
                    {hazardousNeos.length} Potentially Hazardous Asteroid{hazardousNeos.length !== 1 ? 's' : ''} in 7-day window
                  </span>
                </div>
              )}

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {neos.slice(0, 8).map((neo, i) => (
                  <div
                    key={neo.id || i}
                    className={`p-2 rounded-xl border font-mono text-[10px] transition-colors ${
                      neo.is_hazardous
                        ? 'bg-red-950/20 border-red-500/30 dark:border-red-500/20'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`font-bold text-[11px] truncate ${neo.is_hazardous ? 'text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {neo.is_hazardous && <Shield className="inline w-3 h-3 mr-1 text-red-400" />}
                        {neo.name}
                      </span>
                      {neo.nasa_jpl_url && (
                        <a href={neo.nasa_jpl_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 text-cyan-400 hover:text-cyan-300" />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-3 text-slate-500 dark:text-slate-400">
                      <span>Date: {neo.close_approach_date}</span>
                      <span>Dist: {neo.miss_distance_lunar?.toFixed(1)} LD</span>
                      <span>Vel: {neo.velocity_km_s} km/s</span>
                    </div>
                    {neo.diameter_km_max && (
                      <div className="text-slate-500 dark:text-slate-500 mt-0.5">
                        Ø {neo.diameter_km_min?.toFixed(3)} - {neo.diameter_km_max?.toFixed(3)} km
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="font-mono text-[9px] text-slate-500 text-right">
                7-day window · {neoQuery.data?.period?.start} → {neoQuery.data?.period?.end}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Space Weather Panel */}
      {apodTab === 'weather' && (
        <div>
          {weatherQuery.isLoading ? (
            <LoadingPulse label="Fetching space weather data..." />
          ) : (
            <div className="space-y-2">
              {/* CMEs */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Coronal Mass Ejections
                </div>
                {(weatherQuery.data?.cmes || []).length === 0 ? (
                  <div className="text-[11px] font-mono text-slate-500 py-2 text-center">No significant CMEs in last 7 days</div>
                ) : (
                  <div className="space-y-1.5">
                    {(weatherQuery.data?.cmes || []).map((cme, i) => (
                      <div key={i} className="p-2 rounded-xl bg-amber-950/20 border border-amber-500/20 font-mono text-[10px]">
                        <div className="text-amber-300 font-bold">{cme.activity_id}</div>
                        <div className="text-slate-400">{cme.start_time?.replace('T', ' ').slice(0, 16)}</div>
                        {cme.speed_km_s && <div className="text-amber-400">Speed: {cme.speed_km_s} km/s</div>}
                        {cme.note && <div className="text-slate-500 mt-0.5 text-[9px] leading-tight line-clamp-2">{cme.note}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Geomagnetic Storms */}
              {(weatherQuery.data?.geomagnetic_storms || []).length > 0 && (
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-purple-400 mb-1.5">
                    Geomagnetic Storms
                  </div>
                  <div className="space-y-1.5">
                    {(weatherQuery.data?.geomagnetic_storms || []).map((gst, i) => (
                      <div key={i} className="p-2 rounded-xl bg-purple-950/20 border border-purple-500/20 font-mono text-[10px]">
                        <div className="text-purple-300">Kp Index: {gst.kp_index ?? 'N/A'}</div>
                        <div className="text-slate-400">{gst.start_time?.replace('T', ' ').slice(0, 16)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="font-mono text-[9px] text-slate-500 text-right">
                Source: NASA DONKI · {weatherQuery.data?.period?.start} → {weatherQuery.data?.period?.end}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
