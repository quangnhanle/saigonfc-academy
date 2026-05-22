/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0C",
        surface: "#101014",
        ink: "#F4F4EE",
        brand: {
          DEFAULT: "#F6C945",
          50: "#FEF8E5",
          100: "#FDEFC2",
          200: "#FBE08A",
          300: "#F9D260",
          400: "#F6C945",
          500: "#E5B530",
          600: "#B5891E",
          700: "#7E5F12"
        },
        card: "#15151B",
        muted: "#8A8A93",
        border: "#26262E"
      },
      boxShadow: {
        glow: "0 8px 32px -8px rgba(246, 201, 69, 0.55)",
        soft: "0 6px 22px -8px rgba(0, 0, 0, 0.55)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        display: [
          "'Bebas Neue'",
          "Inter",
          "system-ui",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};
