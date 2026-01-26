/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1C1917',     // Deep Loam (Основний темний фон)
          charcoal: '#292524', // Warm Charcoal (Фон карток)
          amber: '#B45309',    // Burnt Amber (Акцент)
          glow: '#F59E0B',     // Luminous Amber (Світіння)
          cream: '#FDFBF7',    // Warm Cream (Текст заголовків)
          stone: '#A8A29E',    // Stone Grey (Текст опису)
        }
      },
      borderRadius: {
        'squircle': '24px', 
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}