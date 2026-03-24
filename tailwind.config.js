/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface": "#121212",
        "on-surface": "#f5f5f5",
        "primary": "#6b0001",
        "outline": "#8c716d",
      },
      fontFamily: {
        "headline": ["Noto Serif", "serif"],
        "signature": ["Great Vibes", "cursive"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "display": ["Playfair Display", "serif"]
      },
    },
  },
  plugins: [],
}
