import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0A0C08",
          low: "#1A1C18",
          high: "#2A2C28",
        },
        primary: {
          DEFAULT: "#A4C283",
          dark: "#466739",
          soft: "#8BA367",
        },
        outline: "#A4C283",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)"],
      },
      fontSize: {
        display: ["3.5rem", { letterSpacing: "-0.05em", lineHeight: "1.1" }],
        headline: ["2rem", { fontWeight: "700" }],
        label: ["0.75rem", { letterSpacing: "0.1em" }],
      },
      borderWidth: {
        "4": "4px",
      },
      spacing: {
        section: "2.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
