import React, { useState, useEffect } from 'react';
import { Telescope, Radio, CheckCircle2, ChevronRight, Activity, Disc } from 'lucide-react';

const BOOT_STEPS = [
  { id: 'cryo', label: 'NIR FOCAL PLANE CHILLDOWN', detail: 'Passive 80K → Active 21.4K Cryocooler Lock', duration: 400 },
  { id: 'irsa', label: 'IRSA SIA2/TAP HANDSHAKE', detail: 'Linking Caltech/IPAC SPHEREx QR2 (DOI: 10.26131/IRSA629)', duration: 450 },
  { id: 'cadence', label: 'TEMPORAL BASELINE SYNC', detail: 'Calibrating 6-Month Survey Epochs (2025-W18 ⇄ 2025-W44)', duration: 400 },
  { id: 'optics', label: 'PRISM SPECTROMETER LOCK', detail: '102 Spectral Channels (0.75µm → 5.00µm) Resolved', duration: 350 },
  { id: 'sky', label: 'CELESTIAL SPHERE ALIGNMENT', detail: 'Equatorial J2000 Coordinates & Motion Trackers Engaged', duration: 300 },
];

export default function InitializationScreen({ onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [temperature, setTemperature] = useState(82.4);

  useEffect(() => {
    let timer;
    if (currentStepIndex < BOOT_STEPS.length) {
      const step = BOOT_STEPS[currentStepIndex];
      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setProgress(Math.round(((currentStepIndex + 1) / BOOT_STEPS.length) * 100));
        setTemperature((prev) => Math.max(21.4, Number((prev - 12.2).toFixed(1))));
      }, step.duration);
    } else {
      timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(onComplete, 500);
      }, 400);
    }
    return () => clearTimeout(timer);
  }, [currentStepIndex, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#02040a] text-slate-100 font-mono select-none transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Tech Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Initialization Card */}
      <div className="relative z-10 w-full max-w-xl p-8 mx-4 rounded-3xl bg-slate-950/80 border border-cyan-500/20 shadow-[0_0_60px_rgba(6,182,212,0.15)] backdrop-blur-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Telescope className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 font-display text-xl font-black tracking-widest text-white">
                <span>PHOTON</span>
                <span className="text-amber-400">X</span>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-slate-400">
                NASA SPHEREx Infrared Sky Observatory
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end text-[10px]">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SYSTEM BOOT
            </span>
            <span className="text-slate-500 mt-0.5">V1.0.0 · REV 2026</span>
          </div>
        </div>

        {/* Central Graphic: Gyro Compass & Sensor Temperature */}
        <div className="flex items-center justify-center py-6">
          <div className="relative flex items-center justify-center w-40 h-40">
            {/* Outer Spinning Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-[spin_20s_linear_infinite]" />
            {/* Middle Counter-Rotating Ring */}
            <div className="absolute inset-3 rounded-full border border-white/10 border-t-amber-400/80 animate-[spin_12s_linear_infinite_reverse]" />
            {/* Sensor Reticle Center */}
            <div className="relative flex flex-col items-center justify-center text-center">
              <Activity className="w-6 h-6 text-cyan-400 mb-1 animate-pulse" />
              <span className="text-lg font-bold text-white font-mono">{temperature} K</span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400">NIR Sensor Temp</span>
            </div>
          </div>
        </div>

        {/* Boot Step Checklist */}
        <div className="space-y-2 mb-6">
          {BOOT_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-cyan-950/20 border-cyan-500/20 text-cyan-300'
                    : isCurrent
                    ? 'bg-slate-900 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-transparent border-transparent text-slate-600 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : isCurrent ? (
                    <Radio className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold tracking-wide">{step.label}</span>
                    <span className="text-[10px] text-slate-400">{step.detail}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono">
                  {isDone ? 'LOCKED' : isCurrent ? 'CALIBRATING...' : 'STANDBY'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Skip Action */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>CALIBRATION PROGRESS</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              setIsFadingOut(true);
              setTimeout(onComplete, 300);
            }}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors py-1 px-3 rounded-lg hover:bg-white/5"
          >
            <span>Skip Calibration</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

