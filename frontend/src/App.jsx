import React, { useState, useEffect } from 'react';
import useStore from './store/useStore';
import Header from './components/Header';
import InteractiveSkyEngine from './components/InteractiveSkyEngine';
import DetailPanel from './components/DetailPanel';
import EpochScrubber from './components/EpochScrubber';
import StarField from './components/StarField';
import InitializationScreen from './components/InitializationScreen';
import CosmicExplorerTour from './components/CosmicExplorerTour';
import AppTutorialModal from './components/AppTutorialModal';
import CosmicNavigatorModal from './components/CosmicNavigatorModal';

export default function App() {
  const {
    isTourOpen,
    closeTour,
    isTutorialOpen,
    openTutorial,
    closeTutorial,
    isNavigatorOpen,
    closeNavigator,
    toggleTheme,
    setIsBlinking,
    isBlinking,
    fov,
    setFov,
    toggleGrid,
    toggleConstellations,
    toggleMoversOverlay,
  } = useStore();

  // By default, launch directly into the observatory so visitors and judges experience zero delay or freeze
  const [hasBooted, setHasBooted] = useState(true);

  const handleBootComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('photonx-booted', 'true');
    }
    setHasBooted(true);
  };

  // Keyboard shortcuts and global interactions

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't fire if inside an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      switch (e.key) {
        case 't':
        case 'T':
          toggleTheme();
          break;
        case ' ':
          e.preventDefault();
          setIsBlinking(!isBlinking);
          break;
        case '+':
        case '=':
          setFov(Math.max(0.05, fov * 0.75));
          break;
        case '-':
          setFov(Math.min(95.0, fov * 1.33));
          break;
        case 'g':
        case 'G':
          toggleGrid();
          break;
        case 'c':
        case 'C':
          toggleConstellations();
          break;
        case 'm':
        case 'M':
          toggleMoversOverlay();
          break;
        case 'p':
        case 'P':
          window.open('presentation.html', '_blank');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme, setIsBlinking, isBlinking, fov, setFov, toggleGrid, toggleConstellations, toggleMoversOverlay]);

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-sand-50 dark:bg-space-950 text-slate-800 dark:text-sand-50 transition-colors duration-300 font-sans">
      {/* Initialization & Orbital Calibration Sequence */}
      {!hasBooted && <InitializationScreen onComplete={handleBootComplete} />}

      {/* Coastal Night Star Field Ambience */}
      <StarField />

      {/* Header Navigation with Tutorial Button */}
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

      {/* Full Site Interactive Tutorial (First-time auto & button trigger) */}
      <AppTutorialModal isOpen={isTutorialOpen} onClose={closeTutorial} />

      {/* Interactive Guided Cosmic Tour for Kids & Beginners */}
      <CosmicExplorerTour isOpen={isTourOpen} onClose={closeTour} />

      {/* Cosmic World Navigator: Solar Systems, Planets, Exoworlds & Deep Space */}
      <CosmicNavigatorModal isOpen={isNavigatorOpen} onClose={closeNavigator} />
    </div>
  );
}
