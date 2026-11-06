/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#070D1F',
          850: '#0C142B',
          800: '#111B38',
          700: '#1B2A52',
          600: '#2A3F75',
        },
        lab: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        cyan: {
          glow: '#00F2FE',
          spectral: '#06B6D4',
        },
        amber: {
          mover: '#F59E0B',
          pulse: '#D97706',
        },
        emerald: {
          confirmed: '#10B981',
        },
        infrared: {
          ch1: '#3B82F6',
          ch2: '#06B6D4',
          ch3: '#10B981',
          ch4: '#F59E0B',
          ch5: '#EF4444',
          ch6: '#EC4899',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        display: ['"Space Grotesk"', '"IBM Plex Sans"', 'sans-serif'],
      },
      boxShadow: {
        'hud-glow': '0 0 25px rgba(6, 182, 212, 0.25)',
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(148, 163, 184, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'reticle-spin': 'reticleSpin 20s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        reticleSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
