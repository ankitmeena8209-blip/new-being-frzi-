import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F5F3", // hero background white, matches uploaded photo
        paperDim: "#ECECE9",
        ink: "#0A0A0A", // near-black, poster cards / headline fill
        inkSoft: "#4A4A47",
        muted: "#6E6E6B",
        hairline: "#D9D9D6",
        signal: "#E4342F", // red accent lifted from the rim-light portrait
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.24em",
      },
      height: {
        dvh: "100dvh",
        svh: "100svh",
      },
      minHeight: {
        dvh: "100dvh",
        svh: "100svh",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(10,10,10,0.06) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: "22px 22px",
      },
    },
  },
  plugins: [],
};

export default config;
