import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#101B3A",
          50: "#F3F7FF",
          100: "#E7F0FF",
          200: "#CADCFA",
          300: "#9FBCEB",
          400: "#6E8FD1",
          500: "#4968B4",
          600: "#344B8A",
          700: "#243567",
          800: "#182348",
          900: "#0D1430"
        },
        paper: "#FFF9FE",
        surface: "#FFFFFF",
        muted: "#66708D",
        line: "#E9E7F7",
        brand: {
          pink: "#F51B87",
          blue: "#137AF0",
          green: "#58C900",
          yellow: "#FFD31A",
          orange: "#FF8A00",
          purple: "#7A2DD4",
          red: "#F0262F",
          sky: "#11A7E8"
        },
        accent: {
          DEFAULT: "#137AF0",
          50: "#EAF3FF",
          100: "#D6E9FF",
          200: "#A9D0FF",
          300: "#73B1FF",
          400: "#3E95FA",
          500: "#137AF0",
          600: "#075FD0",
          700: "#074BA6",
          800: "#073F87"
        },
        sky: "#11A7E8",
        sage: "#58C900",
        sunset: "#FF8A00",
        plum: "#7A2DD4",
        coral: "#F51B87",
        terracotta: "#F0262F",
        sand: "#FFF0B8"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "var(--font-sans)", "serif"]
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,27,58,0.05), 0 4px 16px rgba(19,122,240,0.08)",
        lift: "0 2px 4px rgba(16,27,58,0.06), 0 16px 40px rgba(19,122,240,0.14)",
        ring: "0 0 0 1px rgba(19,122,240,0.10)"
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.015em"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-slow": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }
        },
        "soft-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-8px) scale(1.04)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "fade-in-slow": "fade-in-slow 0.8s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 5s ease-in-out infinite",
        "soft-spin": "soft-spin 18s linear infinite",
        "bounce-soft": "bounce-soft 3.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
