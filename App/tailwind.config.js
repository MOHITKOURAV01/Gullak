/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700",
        "primary-dark": "#B8860B",
        secondary: "#10B981",
        accent: "#8B4513",
        background: "#0A0A0A",
        surface: "#171717",
        "surface-lighter": "#262626",
      },
      fontFamily: {
        sans: ["System"], // We'll stick to system font for now for reliability
      },
    },
  },
  plugins: [],
}
