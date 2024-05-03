/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#080808",
        accent: "#cbc2d1",
        secondary: "#f8f5fa",
    },
    fontFamily: {
        
    },
    },
  },
  plugins: [],
}