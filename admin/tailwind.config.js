/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        bb: ["Open Sans"],
        rb: ["Roboto"],
        title: ["Playwrite CU"],
        titl: ["Libre Baskerville"],
      },
    },
  },
  plugins: [],
};
