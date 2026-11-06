import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import Tooltip from './Tooltip';
import { Info, Download } from 'lucide-react';

// Key molecular lines mapped by SPHEREx
const MOLECULAR_LINES = [
  { wl: 1.4, name: 'H₂O Ice', desc: 'Water ice absorption band' },
  { wl: 2.3, name: 'CO', desc: 'Carbon Monoxide absorption' },
  { wl: 3.0, name: 'H₂O 3µm', desc: 'Major interstellar water ice feature' },
  { wl: 3.3, name: 'PAH / Organics', desc: 'Polycyclic Aromatic Hydrocarbons (Biogenic Precursors)' },
  { wl: 4.27, name: 'CO₂ Ice', desc: 'Solid carbon dioxide ice' },
  { wl: 4.67, name: 'CO Ice', desc: 'Interstellar carbon monoxide ice' },
];

export default function SpectrumPlot({ data, compareData, epochA, epochB }) {
  const [showDataTable, setShowDataTable] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  if (!data || data.length === 0) return null;

  const chartData = data.map((point, i) => ({
    wavelength: Number(point.wavelength_um.toFixed(3)),
    flux: Number(point.flux.toFixed(4)),
    fluxErr: point.flux_err ? Number(point.flux_err.toFixed(4)) : null,
    ...(compareData && compareData[i] ? { fluxB: Number(compareData[i].flux.toFixed(4)) } : {}),
  }));

  const exportCSV = () => {
    let csv = 'channel,wavelength_um,flux_mjy_sr,flux_err\n';
    data.forEach((p) => {
      csv += `${p.channel},${p.wavelength_um},${p.flux},${p.flux_err || 0}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPHEREx_Spectrum_102bands.csv`;
    a.click();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="p-2.5 rounded-xl bg-slate-950/95 dark:bg-slate-900/95 light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 border border-cyan-500/30 shadow-2xl backdrop-blur-md font-mono text-xs">
        <div className="text-cyan-400 font-bold mb-1">
          λ = {Number(label).toFixed(3)} µm
        </div>
        <div className="space-y-1">
          {payload.map((entry, i) => (
            <div key={i} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white dark:text-white light:text-slate-900">
                {entry.value} MJy/sr
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header with Molecular Features pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Key Ices & Bands:
          </span>
          {MOLECULAR_LINES.map((m) => (
            <Tooltip key={m.name} content={m.desc} tag={`${m.wl} µm`}>
              <button
                onClick={() => setSelectedFeature(selectedFeature === m.wl ? null : m.wl)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-colors ${
                  selectedFeature === m.wl
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-white/5 dark:bg-white/5 light:bg-slate-100 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                }`}
              >
                {m.name}
              </button>
            </Tooltip>
          ))}
        </div>

        <Tooltip content="Export raw 102-band calibrated spectral flux to CSV" tag="DATA EXPORT">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:underline"
          >
            <Download className="w-3 h-3" />
            <span>CSV</span>
          </button>
        </Tooltip>
      </div>

      {/* Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="spectrumGradientA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="spectrumGradientB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="wavelength"
              type="number"
              domain={[0.75, 5.0]}
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: '"IBM Plex Mono", monospace' }}
              tickFormatter={(v) => `${v.toFixed(1)}µm`}
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: '"IBM Plex Mono", monospace' }}
              tickFormatter={(v) => v.toFixed(2)}
              width={35}
            />
            <RechartsTooltip content={<CustomTooltip />} />

            {/* Reference Line for selected feature */}
            {selectedFeature && (
              <ReferenceLine
                x={selectedFeature}
                stroke="#F59E0B"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                label={{
                  value: `${selectedFeature}µm`,
                  fill: '#F59E0B',
                  fontSize: 9,
                  position: 'top',
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="flux"
              name={epochA || 'Epoch A'}
              stroke="#06B6D4"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#spectrumGradientA)"
              dot={false}
              activeDot={{ r: 4, fill: '#00F2FE', stroke: '#060B18', strokeWidth: 1.5 }}
            />
            {compareData && (
              <Area
                type="monotone"
                dataKey="fluxB"
                name={epochB || 'Epoch B'}
                stroke="#F59E0B"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                fillOpacity={1}
                fill="url(#spectrumGradientB)"
                dot={false}
                activeDot={{ r: 4, fill: '#F59E0B', stroke: '#060B18', strokeWidth: 1.5 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Accessibility Data Table */}
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pt-1 border-t border-white/5">
        <button
          onClick={() => setShowDataTable(!showDataTable)}
          className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 transition-colors text-left"
        >
          {showDataTable ? '▲ Hide raw data table' : '▼ View accessible data table'}
        </button>
        <span className="text-[9px] font-mono text-slate-500">
          SPHEREx 102-Channel Prism Grating
        </span>
      </div>

      {showDataTable && (
        <div className="max-h-36 overflow-y-auto mt-2 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
          <table className="w-full text-[10px] font-mono text-slate-300">
            <thead className="bg-slate-900/80 sticky top-0">
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-1 px-2 text-left">CH</th>
                <th className="py-1 px-2 text-left">Wavelength</th>
                <th className="py-1 px-2 text-left">Flux ({epochA})</th>
                {compareData && <th className="py-1 px-2 text-left">Flux ({epochB})</th>}
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-1 px-2 text-slate-400">{i}</td>
                  <td className="py-1 px-2 text-cyan-400">{row.wavelength} µm</td>
                  <td className="py-1 px-2">{row.flux}</td>
                  {compareData && <td className="py-1 px-2 text-amber-400">{row.fluxB}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
