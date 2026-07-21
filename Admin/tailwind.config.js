/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#704F38',
          dark: '#1F2029',
          light: '#8C6244',
          accent: '#D4C4B7',
          surface: '#FDFBF9',
          border: '#EDEDED',
          gold: '#E8B84E',
          coral: '#FF6B6B',
        }
      }
    },
  },
  plugins: [],
}
