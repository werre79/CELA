/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // ── New Palette: "Ivory & Ink" ──────────────────
        // Warm ivory base (like fine paper)
        ivory: {
          DEFAULT: '#F5F1EB',
          50:  '#FDFCFA',
          100: '#F5F1EB',
          200: '#EBE5DB',
          300: '#DDD5C7',
          400: '#C7BBA8',
        },

        // Deep ink (navy-tinged, never pure black)
        ink: {
          DEFAULT: '#1C1C28',
          light:   '#3A3A4A',
          muted:   '#5A5A68',
          faint:   '#8A8A96',
          dark:    '#141420',
        },

        // Terracotta accent — used sparingly, for CTAs and highlights
        terra: {
          100: '#FDF0E0',
          200: '#F9D8B0',
          300: '#F5C77E',
          400: '#EDAC61',
          500: '#E8945A',
          600: '#D97736',
          700: '#C4622D',
          800: '#9A4420',
          900: '#7A3318',
        },

        // Forest teal — secondary accent (unexpected, premium)
        forest: {
          DEFAULT: '#2B5F4E',
          light:   '#3D7A66',
          dark:    '#1D4639',
        },

        // Trust blue (kept for legal cues)
        trust: {
          DEFAULT: '#3b82f6',
          light:   '#60A5FA',
          dark:    '#1d4ed8',
        },

        // Legacy compat
        primary: {
          DEFAULT: '#2B5F4E',
          glow:    '#3D7A66',
        },
        accent: {
          DEFAULT: '#C4622D',
          glow:    '#E8945A',
        },
        stone: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },

      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },

      borderRadius: {
        'pill': '9999px',
        'glass': '24px',
        'squircle': '20px',
      },

      animation: {
        'fade-slide-up':    'fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-slide-up-d1': 'fadeSlideUp 0.8s 0.12s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-slide-up-d2': 'fadeSlideUp 0.8s 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-slide-up-d3': 'fadeSlideUp 0.8s 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':          'fadeIn 0.8s 0.5s ease-out forwards',
        'float':            'float 8s ease-in-out infinite',
      },

      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),

    function ({ addUtilities }) {
      addUtilities({
        // Navbar glass for light background
        '.glass-light': {
          'background':            'rgba(245, 241, 235, 0.75)',
          'backdrop-filter':       'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border':                '1px solid rgba(28, 28, 40, 0.08)',
          'box-shadow':            '0 4px 24px rgba(28, 28, 40, 0.06)',
        },
        // Navbar glass for dark sections
        '.glass-dark': {
          'background':            'rgba(20, 20, 32, 0.80)',
          'backdrop-filter':       'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border':                '1px solid rgba(255, 255, 255, 0.08)',
          'box-shadow':            '0 4px 24px rgba(0, 0, 0, 0.3)',
        },
        '.glass-panel': {
          'background':            'rgba(255, 255, 255, 0.06)',
          'backdrop-filter':       'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border':                '1px solid rgba(255, 255, 255, 0.10)',
          'box-shadow':            '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
        '.glass-card': {
          'background':            'rgba(255, 255, 255, 0.06)',
          'backdrop-filter':       'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border':                '1px solid rgba(255, 255, 255, 0.10)',
          'transition':            'all 0.35s ease',
        },
        // Terracotta accent gradient text
        '.terra-text': {
          'background':              'linear-gradient(135deg, #E8945A 0%, #C4622D 100%)',
          '-webkit-background-clip': 'text',
          'background-clip':         'text',
          '-webkit-text-fill-color': 'transparent',
          'color':                   'transparent',
        },
      });
    },
  ],
};