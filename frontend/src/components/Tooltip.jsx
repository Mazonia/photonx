import React, { useState, useRef, useEffect } from 'react';

/**
 * Tooltip: Awwwards-style sleek, accessible micro-interaction tooltip.
 * Provides rich metadata, shortcuts, and scientific explanations.
 */
export default function Tooltip({
  children,
  content,
  shortcut,
  tag,
  position = 'top',
  delay = 50,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  const show = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Position classes with edge-alignment options to prevent viewport clipping
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    'bottom-left': 'top-full right-0 mt-2',
    'bottom-right': 'top-full left-0 mt-2',
    'top-left': 'bottom-full right-0 mb-2',
    'top-right': 'bottom-full left-0 mb-2',
  }[position] || 'bottom-full left-1/2 -translate-x-1/2 mb-2';

  return (
    <div
      className="relative inline-flex items-center"
      onPointerEnter={show}
      onPointerLeave={hide}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {children}

      {isVisible && content && (
        <div
          role="tooltip"
          className={`absolute z-[9999] pointer-events-none whitespace-normal min-w-[160px] max-w-[280px] p-2.5 rounded-xl text-xs leading-tight transition-all duration-150 animate-in fade-in zoom-in-95 ${positionClasses}
            bg-space-900/95 dark:bg-space-950/95 text-sand-50 border border-ocean-500/40 shadow-2xl shadow-ocean-950/50 backdrop-blur-xl`}
        >
          <div className="flex items-center justify-between gap-2 mb-0.5">
            {tag && (
              <span className="font-mono text-[9px] uppercase tracking-wider text-ocean-400 font-bold">
                {tag}
              </span>
            )}
            {shortcut && (
              <kbd className="font-mono text-[9px] px-1 py-0.5 rounded bg-space-850 text-sand-100 border border-ocean-800/80">
                {shortcut}
              </kbd>
            )}
          </div>
          <div className="text-[11px] font-sans text-sand-100 leading-snug">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
