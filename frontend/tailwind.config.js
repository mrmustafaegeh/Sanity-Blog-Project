/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        serif: [
          '"Newsreader"',
          '"Merriweather"',
          "Georgia",
          '"Times New Roman"',
          "serif",
        ],
      },
      colors: {
        // Warm/Neutral Editorial Palette
        background: "#fafaf9", // stone-50
        surface: "#ffffff",
        primary: "#1c1917", // stone-900
        secondary: "#57534e", // stone-600
        tertiary: "#a8a29e", // stone-400
        border: "#e7e5e4", // stone-200
        accent: "#1c1917", // darker accent
        "accent-secondary": "#44403c",
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [],
};
