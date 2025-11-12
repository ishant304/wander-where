/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{jsx,}",
  ],
  theme: {
      extend: {
        fontFamily: {
          sans: ["Momo Trust Display", "sans-serif"],
        },
      },
    },
    plugins: [],
  }