import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        terracotta: "#C2552D",
        sunset: "#E8A33D",
        sand: "#F4E3C4",
        cream: "#FBF6EC",
        sage: "#6B8E5A",
        deep: "#2B2118",
        plum: "#5B3A52",
        sky: "#87B8D1",
        coral: "#F08070",
        muted: "#7A6C5D",
        line: "#E8DDC8"
      },
      boxShadow: {
        soft: "0 8px 30px rgba(43,33,24,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
