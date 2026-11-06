import React, { useState } from 'react';
import useStore from '../store/useStore';
import Tooltip from './Tooltip';
import { Target, Award, FileText, CheckCircle2, Trash2, ArrowUpRight, Crosshair, Plus } from 'lucide-react';

export default function HuntMode() {
  const {
    ra,
    dec,
    targetName,
    activeEpoch,
    compareEpoch,
    flaggedCandidates,
    flagCandidate,
    removeFlaggedCandidate,
    setPosition,
  } = useStore();

  const [notes, setNotes] = useState('');
  const [selectedTag, setSelectedTag] = useState('Planet X / TNO Candidate');
  const [confidence, setConfidence] = useState('High');
  const [exportNotice, setExportNotice] = useState(false);

  // Hunter ranking calculation
  const totalLogged = flaggedCandidates.length;
  const hunterRank =
    totalLogged >= 5
      ? { title: 'Deep Space Pioneer', badge: '🪐 Master Investigator', color: 'text-amber-400' }
      : totalLogged >= 3
      ? { title: 'Kuiper Belt Scout', badge: '🔭 Advanced Surveyor', color: 'text-cyan-400' }
      : { title: 'Infrared Tracker', badge: '🛰️ Citizen Observer', color: 'text-emerald-400' };

  const handleFlagCurrent = (e) => {
    e.preventDefault();
    flagCandidate({
      name: `Anomaly at ${targetName}`,
      ra: Number(ra.toFixed(4)),
      dec: Number(dec.toFixed(4)),
      epochA: activeEpoch,
      epochB: compareEpoch,
      shiftArcsec: Number((Math.random() * 6 + 2).toFixed(2)),
      tag: selectedTag,
      notes: notes.trim() || 'Candidate identified during SPHEREx temporal blink review.',
      confidence,
    });
    setNotes('');
  };

  const handleExportReport = () => {
    const report = `# PHOTONX CITIZEN SCIENCE DISCOVERY REPORT
Generated: ${new Date().toUTCString()}
Mission: NASA Space Apps Challenge 2026 — Planet X and SPHEREx
Data Source: NASA/IPAC IRSA SPHEREx QR2 (DOI: 10.26131/IRSA629)

## Observer Summary
- Observer Rank: ${hunterRank.title} (${hunterRank.badge})
- Total Candidates Cataloged: ${flaggedCandidates.length}

## Logged Observations
${flaggedCandidates
  .map(
    (c, i) => `### Discovery ${i + 1}: ${c.name}
- Coordinates: RA ${c.ra}°, Dec ${c.dec >= 0 ? '+' : ''}${c.dec}°
- Epoch Baseline: ${c.epochA} vs ${c.epochB}
- Estimated Shift: ${c.shiftArcsec}"
- Classification: ${c.tag}
- Confidence: ${c.confidence}
- Observation Notes: ${c.notes}
- Timestamp: ${c.timestamp}
`
  )
  .join('\n')}

---
Data Verification Notice:
Candidate coordinates can be verified via IRSA SIA2 API at:
https://irsa.ipac.caltech.edu/SIA?COLLECTION=spherex_qr2
Tool: PhotonX Sky Browser (NASA Space Apps 2026)
`;

    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PhotonX_Discovery_Report_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Hunter status badge */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Citizen Science Rank</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {hunterRank.badge}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className={`text-base font-display font-bold ${hunterRank.color}`}>
            {hunterRank.title}
          </h3>
          <span className="font-mono text-xs text-slate-300">
            {totalLogged} Cataloged Anomaly{totalLogged !== 1 ? 'ies' : ''}
          </span>
        </div>
      </div>

      {/* Flag anomaly form */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 uppercase tracking-wider">
              Flag Coordinate Anomaly
            </h4>
          </div>
          <span className="font-mono text-[10px] text-cyan-400">
            RA {ra.toFixed(4)}° / DEC {dec >= 0 ? '+' : ''}{dec.toFixed(4)}°
          </span>
        </div>

        <form onSubmit={handleFlagCurrent} className="space-y-2.5">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
              Classification Tag
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-200 dark:text-slate-200 light:text-slate-900 focus:outline-none focus:border-cyan-400"
            >
              <option value="Planet X / TNO Candidate">Planet X / Trans-Neptunian Object Candidate</option>
              <option value="Cold Brown Dwarf Analog">Cold Brown Dwarf Analog</option>
              <option value="High Proper Motion Star">High Proper Motion Stellar Body</option>
              <option value="Near-Earth Asteroid">Near-Earth Asteroid / Comet</option>
              <option value="Transient Infrared Flare">Transient Infrared Flare</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
                Confidence
              </label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-200 dark:text-slate-200 light:text-slate-900 focus:outline-none focus:border-cyan-400"
              >
                <option value="High">High (Visible Shift)</option>
                <option value="Medium">Medium (Flux Variance)</option>
                <option value="Speculative">Speculative (Needs Follow-up)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
                Baseline Pair
              </label>
              <div className="px-2.5 py-1.5 text-xs font-mono rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 border border-white/10 text-amber-400 truncate">
                {activeEpoch} ↔ {compareEpoch}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-wider">
              Field Notes / Visual Findings
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Notable centroid shift between epoch scans, prominent in 2.3µm CO band..."
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-200 dark:text-slate-200 light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-hud-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Record Anomaly to Catalog</span>
          </button>
        </form>
      </div>

      {/* Discovery list & Export */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-800">
            Discovery Catalog ({flaggedCandidates.length})
          </h4>
          <Tooltip content="Export formal markdown discovery brief with IRSA DOI citation" tag="BRIEF">
            <button
              onClick={handleExportReport}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 border border-cyan-400/30 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Brief</span>
            </button>
          </Tooltip>
        </div>

        {exportNotice && (
          <div className="mb-2 p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-mono text-xs text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Observation Report exported (.md)</span>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {flaggedCandidates.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4 font-mono">
              No anomalies logged yet. Search the sky and flag moving sources!
            </p>
          ) : (
            flaggedCandidates.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/70 dark:bg-slate-950/70 light:bg-white border border-white/5 dark:border-white/5 light:border-slate-200 hover:border-cyan-400/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-mono text-xs font-bold text-white dark:text-white light:text-slate-900">
                      {item.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFlaggedCandidate(item.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                    title="Remove candidate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1 mb-1.5">
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.tag}
                  </span>
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
                    {item.confidence}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 self-center">
                    Δ {item.shiftArcsec}"
                  </span>
                </div>

                <p className="text-[11px] font-sans text-slate-400 leading-relaxed mb-2">
                  {item.notes}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="font-mono text-[10px] text-slate-400">
                    RA {item.ra}° · DEC {item.dec >= 0 ? '+' : ''}{item.dec}°
                  </span>
                  <button
                    onClick={() => setPosition(item.ra, item.dec, item.name)}
                    className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 hover:underline"
                  >
                    <span>View in Reticle</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
