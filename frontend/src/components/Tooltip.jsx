import React, { useState, useRef, useEffect } from 'react';

/**
 * Tooltip — Awwwards-style sleek, accessible micro-interaction tooltip.
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

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
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
            bg-slate-900/95 text-slate-100 border border-cyan-500/30 dark:border-cyan-400/30 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl`}
        >
          <div className="flex items-center justify-between gap-2 mb-0.5">
            {tag && (
              <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 dark:text-cyan-300 font-semibold">
                {tag}
              </span>
            )}
            {shortcut && (
              <kbd className="font-mono text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {shortcut}
              </kbd>
            )}
          </div>
          <div className="text-[11px] font-sans text-slate-200 leading-snug">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
