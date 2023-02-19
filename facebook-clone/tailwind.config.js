const { transferableAbortController } = require("util");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        popIn: {
          "0%": {
            translate: "0 -100%",
          },
          "100%": {
            translate: "0",
          },
        },
        blink: {
          "0%": {
            opacity: "100",
          },
          "90%": {
            opacity: 0,
          },
          "100%": {
            opacity: 0,
          },
        },
      },
      backgroundImage: {
        "blue-gradient":
          "linear-gradient(135deg, rgba(12,211,215,1) 0%, rgba(60,114,255,1) 100%);",
        "pink-gradient":
          "linear-gradient(0deg, rgba(251,55,12,1) 0%, rgba(114,60,125,1) 100%)",
        "yellow-gradient":
          "linear-gradient(0deg, rgba(195,34,34,1) 0%, rgba(253,187,45,1) 100%)",
        "wavy-gradient": 'url("/wavy-gradient.jpg")',
        "brown-gradient": "linear-gradient(#eb5757, #000000)",
        "repeating-sunset": "repeating-linear-gradient(#fc4a1a, #f7b733)",
        "circle-gradient": "url('/circle-gradient.jpg')",
        "mint-gradient": "linear-gradient(to bottom, #74ebd5, #acb6e5)",
        "blood-gradient": "url('/blood-gradient.jpg')",
        "hole-gradient": "url('/hole-gradient.jpg')",
        "purple-brick-gradient": "url('/purple-brick-gradient.jpg')",
        "leaf-gradient": "url('/leaf-gradient.jpg')",
        "arrow-gradient": "url('/arrow-gradient.jpg')",
      },
      colors: {
        dark: "#1c1e21",
        "fb-gray": "#444950",
        "fb-blue-100": "#3578E5",
        "fb-blue-200": "#1877F2",
      },
      boxShadow: {
        full: "0 0 0 1000px rgba(0, 0, 0, 0.5)",
        "full-dark": "0 0 0 1000px #1c1e21",
      },
    },
  },
  plugins: [],
};
