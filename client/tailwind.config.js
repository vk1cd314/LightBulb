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
        accent: "#5922CF",
        secondary: "#fff5fa",
    },
    fontFamily: {
        
    },
    },
  },
  //eslint-disable-next-line
  plugins: [require('@tailwindcss/typography'),],
}