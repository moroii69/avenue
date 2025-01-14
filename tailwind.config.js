/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'],
      //   customFont: ['Inter', 'sans-serif']
      // },
      colors: {
        primary: {
          DEFAULT: "#0A0A0A",
        },
      },
    },
  },
  plugins: [],
}