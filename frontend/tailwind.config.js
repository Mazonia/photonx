/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Natural Beach Sand Palette
        sand: {
          50: '#FAF6F0',   // Warm morning beach sand
          100: '#F4ECE1',  // Sun-bleached coastal dune
          200: '#E8DCCF',  // Soft fine sand
          300: '#D9C8B5',  // Coastal sand border
          400: '#C2AB91',  // Wet shoreline
          500: '#A88E71',  // Sun-warmed sand
          600: '#8C7255',  // Driftwood
          700: '#6E563E',  // Coastal timber
          800: '#4D3B29',  // Deep driftwood
          900: '#2E2317',  // Beach stone
        },
        // Natural Ocean & Coastal Water Palette (NOT AI Neon!)
        ocean: {
          50: '#F0F9F8',   // Seafoam mist
          100: '#DBF1EE',  // Shallow lagoon
          200: '#B6E2DC',  // Tropical surf
          300: '#87CCC3',  // Clear sea water
          400: '#4DAEA2',  // Wave crest aquamarine
          500: '#2A8077',  // Deep tropical water
          600: '#20655E',  // Marine current
          700: '#194E4A',  // Ocean depths
          800: '#133B39',  // Deep sea
          900: '#0C2727',  // Abyssal marine
          950: '#07181A',  // Deep ocean floor
        },
        // Deep Coastal Ocean Floor for Dark Mode
        space: {
          950: '#0B1E26',  // Deep marine night waters
          900: '#102B37',  // Deep ocean reef
          850: '#153645',  // Mid-depth ocean tide
          800: '#1B4252',  // Coastal night water
          700: '#24566A',  // Surface ocean swell
          600: '#32738C',  // Coastal wave
        },
        // Laboratory Cleanroom maps to warm beach sand & seafoam
        lab: {
          50: '#FAF6F0',
          100: '#F4ECE1',
          200: '#E8DCCF',
          300: '#D9C8B5',
          400: '#A88E71',
          700: '#4D3B29',
          800: '#2E2317',
          900: '#1B140D',
        },
        // Map cyan to natural ocean water (kills AI neon blue)
        cyan: {
          DEFAULT: '#2A8077',
          50: '#F0F9F8',
          100: '#DBF1EE',
          200: '#B6E2DC',
          300: '#87CCC3',
          400: '#4DAEA2',
          500: '#2A8077',
          600: '#20655E',
          700: '#194E4A',
          800: '#133B39',
          900: '#0C2727',
          glow: '#4DAEA2',
          spectral: '#2A8077',
        },
        // Map amber to warm golden beach sand & sun
        amber: {
          DEFAULT: '#C58F58',
          50: '#FDF9F3',
          100: '#FBF2E4',
          200: '#F6E4C9',
          300: '#EED2A8',
          400: '#E2BD82',
          500: '#D4A359',
          600: '#B88746',
          700: '#946733',
          800: '#734E25',
          900: '#4F3316',
          mover: '#D4A359',
          pulse: '#B88746',
        },
        emerald: {
          confirmed: '#2E8B75',
        },
        infrared: {
          ch1: '#32738C',
          ch2: '#2A8077',
          ch3: '#389A84',
          ch4: '#D4A359',
          ch5: '#C86D51',
          ch6: '#B85272',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'hud-glow': '0 0 25px rgba(42, 128, 119, 0.25)',
        'amber-glow': '0 0 20px rgba(212, 163, 89, 0.3)',
        'ocean-glow': '0 0 25px rgba(77, 174, 162, 0.3)',
        'sand-card': '0 4px 20px rgba(77, 59, 41, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(7, 24, 26, 0.45)',
        'glass-light': '0 8px 32px 0 rgba(168, 142, 113, 0.12)',
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
