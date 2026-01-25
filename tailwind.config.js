/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "hsl(var(--brand))",
        "brand-foreground": "hsl(var(--brand-foreground))",
        "brand-dark": "#2E1A12",
        "brand-cream": "#FDFBF7",
      },
      borderRadius: {
        'squircle': '18px',
      },
      keyframes: {
        "appear-zoom": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "appear-zoom": "appear-zoom 0.5s ease-out forwards",
      },
      fontFamily: {
        sans: ['Montserrat', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}