import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#FAFAF8",
          elevated: "#F5F3EF",
        },
        border: {
          DEFAULT: "#E8E4DC",
          strong: "#D4CFC6",
        },
        text: {
          primary: "#1A1916",
          secondary: "#6B6560",
          muted: "#9E9891",
        },
        status: {
          blocked: "#DC2626",
          atrisk: "#D97706",
          ontrack: "#16A34A",
          stale: "#6B7280",
        },
        accent: "#1D4ED8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
