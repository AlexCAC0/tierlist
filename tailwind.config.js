/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wc-red': '#E61D25',
        'wc-blue': '#2A398D',
        'wc-green': '#3CAC3B',
        'wc-light-gray': '#D1D4D1',
        'wc-dark-gray': '#474A4A',
      },
      fontFamily: {
        'wc-font': ['"Inter"', 'sans-serif'], // Fallback while we don't have the specific FWC font
      }
    },
  },
  plugins: [],
}
