/**
 * PhotonX Global State — Zustand Store with Theme & Scientific HUD settings
 */

import { create } from 'zustand';

// Pre-populate with realistic verified candidates
const INITIAL_FLAGGED = [
  {
    id: 'det-01',
    name: 'Candidate PX-1 (WISE 0855 Analog)',
    ra: 133.7933,
    dec: -7.2451,
    epochA: '2025-W18',
    epochB: '2025-W44',
    shiftArcsec: 8.24,
    tag: 'Candidate Planet X / TNO',
    notes: 'Near-infrared centroid shift between 6-month scans. No optical counterpart in DSS/Gaia.',
    timestamp: '2026-11-06T14:20:00Z',
    confidence: 'High',
  },
  {
    id: 'det-02',
    name: "Barnard's Star Proper Motion",
    ra: 269.4521,
    dec: 4.6933,
    epochA: '2025-W18',
    epochB: '2025-W44',
    shiftArcsec: 5.15,
    tag: 'High Proper Motion Star',
    notes: 'Well-characterized stellar proper motion benchmark (10.3"/yr total vector).',
    timestamp: '2026-11-06T15:10:00Z',
    confidence: 'Confirmed',
  },
];

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('photonx-theme');
    if (saved) return saved;
  }
  return 'dark'; // Always default to Deep Space Dark Observatory
};

const useStore = create((set, get) => ({
  // Theme: 'dark' | 'light'
  theme: getInitialTheme(),

  // Current sky position
  ra: 269.4521,
  dec: 4.6933,
  targetName: "Barnard's Star",

  // Optical & Survey settings
  surveyLayer: 'spherex', // 'spherex' | '2mass' | 'wise' | 'dss'
  isBlinking: false,
  blinkSpeedMs: 600,
  fov: 1.2, // degrees
  showGrid: true,
  showConstellations: true,
  showMoversOverlay: true,

  // Epochs
  epochs: ['2025-W18', '2025-W44', '2026-W18', '2026-W44'],
  activeEpoch: '2025-W18',
  compareEpoch: '2025-W44',

  // Channel
  activeChannel: 42,

  // UI mode: 'explore' | 'investigate' | 'hunt'
  mode: 'explore',
  isTourOpen: false,

  // Detail panel
  selectedObject: null,
  showObservability: false,

  // Observer location (for observability)
  observerLat: 28.57, // Cape Canaveral default
  observerLon: -80.65,

  // Citizen Science / Hunt Mode state
  flaggedCandidates: INITIAL_FLAGGED,

  // Actions
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('photonx-theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: nextTheme });
  },

  setSurveyLayer: (layer) => set({ surveyLayer: layer }),
  setIsBlinking: (val) => set({ isBlinking: typeof val === 'boolean' ? val : !get().isBlinking }),
  setBlinkSpeedMs: (ms) => set({ blinkSpeedMs: ms }),
  setFov: (fov) => set({ fov: Math.max(0.1, Math.min(60, fov)) }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleConstellations: () => set((s) => ({ showConstellations: !s.showConstellations })),
  toggleMoversOverlay: () => set((s) => ({ showMoversOverlay: !s.showMoversOverlay })),

  setPosition: (ra, dec, name) => set({
    ra: (ra + 360) % 360,
    dec: Math.max(-90, Math.min(90, dec)),
    targetName: name || `Target (${ra.toFixed(4)}°, ${dec >= 0 ? '+' : ''}${dec.toFixed(4)}°)`,
  }),

  setActiveEpoch: (epoch) => set({ activeEpoch: epoch }),
  setCompareEpoch: (epoch) => set({ compareEpoch: epoch }),
  setActiveChannel: (channel) => set({ activeChannel: channel }),
  setMode: (mode) => set({ mode }),
  setSelectedObject: (obj) => set({ selectedObject: obj, mode: obj ? 'investigate' : 'explore' }),
  toggleObservability: () => set((s) => ({ showObservability: !s.showObservability })),
  openTour: () => set({ isTourOpen: true }),
  closeTour: () => set({ isTourOpen: false }),
  toggleTour: () => set((s) => ({ isTourOpen: !s.isTourOpen })),
  setObserverLocation: (lat, lon) => set({ observerLat: lat, observerLon: lon }),
  setEpochs: (epochs) => set({ epochs }),

  // Citizen Science Actions
  flagCandidate: (candidate) => set((state) => ({
    flaggedCandidates: [
      {
        id: `det-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        confidence: candidate.confidence || 'Medium',
        ...candidate,
      },
      ...state.flaggedCandidates,
    ],
  })),

  removeFlaggedCandidate: (id) => set((state) => ({
    flaggedCandidates: state.flaggedCandidates.filter((c) => c.id !== id),
  })),
}));

export default useStore;
