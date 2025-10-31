/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37',
        navy: '#1E3A8A',
        accent: '#F59E0B',
      },
      fontFamily: {
        sans: ['"Roboto"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}