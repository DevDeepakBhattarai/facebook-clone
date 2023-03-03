/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0F0E0E",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
