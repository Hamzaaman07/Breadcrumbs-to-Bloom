import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: "#ACC098",
          light: "#BDD0A8",
          deep: "#64794F",
        },
        olive: {
          DEFAULT: "#3E4A22",
          ink: "#232B14",
        },
        cream: {
          DEFAULT: "#F5F3EA",
          warm: "#FAF8F2",
        },
        crust: {
          DEFAULT: "#B5742F",
          deep: "#8A5320",
        },
        bloom: "#D9A8A0",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-karla)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(2.75rem, 7vw, 6.5rem)", { lineHeight: "1.02" }],
        h2: ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.08" }],
        h3: ["clamp(1.35rem, 2vw, 1.75rem)", { lineHeight: "1.2" }],
        body: ["clamp(1rem, 1.1vw, 1.125rem)", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        eyebrow: ["0.8rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      borderRadius: {
        btn: "4px",
        card: "12px",
        pill: "999px",
      },
      boxShadow: {
        warm: "0 12px 40px -12px rgba(62,74,34,0.10)",
        "warm-sm": "0 4px 16px -6px rgba(62,74,34,0.10)",
      },
      spacing: {
        section: "clamp(6rem, 12vh, 10rem)",
      },
      maxWidth: {
        measure: "62ch",
        site: "1440px",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
