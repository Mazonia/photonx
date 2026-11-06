import React, { useEffect, useRef, useCallback } from 'react';
import useStore from '../store/useStore';

/**
 * SkyMap — Aladin Lite v3 interactive sky viewer.
 * Initialized with 2MASS survey, handles click events
 * for coordinate selection, and flies to search results.
 */
export default function SkyMap() {
  const containerRef = useRef(null);
  const aladinRef = useRef(null);
  const { ra, dec, setPosition, targetName } = useStore();

  // Initialize Aladin Lite
  useEffect(() => {
    if (!containerRef.current || aladinRef.current) return;

    // Wait for Aladin Lite to be available from CDN
    const initAladin = () => {
      if (typeof window.A === 'undefined') {
        setTimeout(initAladin, 200);
        return;
      }

      const aladin = window.A.aladin(containerRef.current, {
        survey: 'P/2MASS/color',
        fov: 1.0,
        target: `${ra} ${dec}`,
        cooFrame: 'J2000',
        showCooGridControl: true,
        showSimbadPointerControl: true,
        showCooGrid: false,
        showProjectionControl: false,
        showFullscreenControl: true,
        showLayersControl: true,
        showGotoControl: false,
        showFrame: false,
        showZoomControl: true,
        reticleColor: '#1EB8A0',
        reticleSize: 28,
        gridColor: 'rgba(26, 58, 107, 0.25)',
        backgroundColor: '#060B18',
      });

      aladinRef.current = aladin;

      // Click handler: set position to clicked coordinates
      aladin.on('click', (event) => {
        if (event && event.ra !== undefined && event.dec !== undefined) {
          setPosition(event.ra, event.dec, null);
        }
      });
    };

    initAladin();

    return () => {
      aladinRef.current = null;
    };
  }, []);

  // Fly to new position when ra/dec changes
  useEffect(() => {
    if (aladinRef.current) {
      aladinRef.current.gotoRaDec(ra, dec);
    }
  }, [ra, dec]);

  return (
    <div className="relative w-full h-full">
      {/* Aladin Lite container */}
      <div
        ref={containerRef}
        className="aladin-container w-full h-full"
        role="application"
        aria-label="Interactive sky map viewer"
      />

      {/* Coordinate overlay */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-deep-space/85 backdrop-blur-sm border border-nebula-blue/30 rounded-sm">
        <div className="data-readout flex items-center gap-3 text-[11px]">
          <span className="text-muted uppercase tracking-widest text-[9px]">Position</span>
          <span>RA {ra.toFixed(4)}°</span>
          <span>Dec {dec >= 0 ? '+' : ''}{dec.toFixed(4)}°</span>
        </div>
      </div>

      {/* Survey label */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-deep-space/70 backdrop-blur-sm border border-nebula-blue/20 rounded-sm">
        <span className="text-[9px] font-mono uppercase tracking-widest text-muted">
          SPHEREx QR2 · NIR 0.75–5µm · 102 Bands
        </span>
      </div>
    </div>
  );
}

