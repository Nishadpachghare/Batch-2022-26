/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matte-black': '#121212',
        'gold': '#D4AF37',
        'gold-light': '#F3E5AB',
        'off-white': '#EAEAEA',
      },
      fontFamily: {
        'heading': ['"Playfair Display"', 'serif'],
        'body': ['"Inter"', 'sans-serif'],
        'handwriting': ['"Dancing Script"', 'cursive'],
      }
    },
  },
  plugins: [],
}
