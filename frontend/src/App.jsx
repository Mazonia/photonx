import React, { useState } from 'react';
import useStore from './store/useStore';
import Header from './components/Header';
import InteractiveSkyEngine from './components/InteractiveSkyEngine';
import DetailPanel from './components/DetailPanel';
import EpochScrubber from './components/EpochScrubber';
import StarField from './components/StarField';
import InitializationScreen from './components/InitializationScreen';
import CosmicExplorerTour from './components/CosmicExplorerTour';

export default function App() {
  const { isTourOpen, closeTour } = useStore();
  const [hasBooted, setHasBooted] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('photonx-booted') === 'true';
    }
    return false;
  });

  const handleBootComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('photonx-booted', 'true');
    }
    setHasBooted(true);
  };

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-space-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Initialization & Orbital Calibration Sequence */}
      {!hasBooted && <InitializationScreen onComplete={handleBootComplete} />}

      {/* Background Ambience */}
      <StarField />
      <div className="scan-lines" aria-hidden="true" />

      {/* Header Navigation */}
      <Header />

      {/* Main Workspace: 65% Interactive Sky Viewport | 35% Science Telemetry */}
      <main className="relative z-10 flex flex-1 min-h-0 overflow-hidden">
        {/* Sky Viewport */}
        <section
          className="flex-[65] min-w-0 h-full relative"
          aria-label="Interactive multi-spectral celestial viewport"
        >
          <InteractiveSkyEngine />
        </section>

        {/* Science Telemetry & Inspection Panel */}
        <aside
          className="flex-[35] min-w-[340px] max-w-[520px] h-full"
          aria-label="Observatory telemetry and data analysis panel"
        >
          <DetailPanel />
        </aside>
      </main>

      {/* Bottom Orbital Epoch Scrubber */}
      <EpochScrubber />

      {/* Interactive Guided Cosmic Tour for Kids & Beginners */}
      <CosmicExplorerTour isOpen={isTourOpen} onClose={closeTour} />
    </div>
  );
}
