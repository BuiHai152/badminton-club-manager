/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Be Vietnam Pro", "system-ui", "sans-serif"],
        display: ["Be Vietnam Pro", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#07100c",
          900: "#0b1711",
          850: "#0f1f17",
          800: "#14271d",
          700: "#1d3528",
        },
        lime: {
          300: "#dcff8a",
          400: "#c9f45a",
          500: "#b6e93a",
          600: "#96c725",
        },
        mint: "#7ef0c0",
        cream: "#f4f7ed",
        clay: "#f07953",
      },
      boxShadow: {
        card: "0 18px 45px -24px rgba(7, 16, 12, 0.28)",
        glow: "0 0 40px -12px rgba(201, 244, 90, 0.55)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "80%, 100%": { transform: "scale(1.35)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slide-up 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
