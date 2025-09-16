import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50:  "#eff9ff",
          100: "#d8f1ff",
          200: "#b6e3ff",
          300: "#86ccff",
          400: "#55aeff",
          500: "#2a8df6",
          600: "#1f70d4",
          700: "#1a5ab0",
          800: "#184b8f",
          900: "#173f76",
          950: "#0d2648"
        }
      },
      keyframes: {
        wave: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-2%)" },
          "100%": { transform: "translateX(0)" }
        }
      },
      animation: {
        wave: "wave 12s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;