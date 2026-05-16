/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#95d3ba",
        background: "#121414",

        "primary-fixed": "#b0f0d6",
        "primary-fixed-dim": "#95d3ba",
        "on-primary": "#003829",
        "on-primary-fixed": "#002117",

        "primary-container": "#064e3b",
        "on-primary-container": "#80bea6",

        surface: "#1e2020",
        "surface-dim": "#121414",
        "surface-container": "#1e2020",
        "surface-container-lowest": "#0c0f0f",
        "surface-container-high": "#282a2b",
        "surface-container-highest": "#333535",
        "surface-variant": "#333535",
        "surface-bright": "#37393a",

        text: "#e2e2e2",
        textMuted: "#bfc9c3",

        "on-surface": "#e2e2e2",
        "on-surface-variant": "#bfc9c3",

        accent: "#f9bd22",
        tertiary: "#f9bd22",
        "tertiary-fixed-dim": "#f9bd22",
        "tertiary-container": "#584000",
        "on-tertiary": "#402d00",
        "on-tertiary-fixed": "#261a00",
        "on-tertiary-container": "#e0a800",

        "inverse-primary": "#2b6954",

        secondary: "#c9c6c5",
        "on-secondary": "#313030",

        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",

        outline: "#89938d",
        "outline-variant": "#404944",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Lexend", "sans-serif"],

        "label-bold": ["Lexend", "sans-serif"],
        "headline-md": ["Lexend", "sans-serif"],
        "headline-lg": ["Lexend", "sans-serif"],
        "headline-xl": ["Lexend", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
      },

      fontSize: {
        "label-bold": ["14px", { lineHeight: "1", fontWeight: "700" }],

        "headline-md": ["24px", { lineHeight: "1.2", fontWeight: "600" }],

        "headline-lg": [
          "32px",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],

        "headline-xl": [
          "48px",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.04em",
            fontWeight: "800",
          },
        ],

        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],

        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
      },

      spacing: {
        unit: "4px",
        gutter: "16px",
        margin: "24px",
        "container-max": "1280px",
      },

      maxWidth: {
        container: "1280px",
        "container-max": "1280px",
      },

      boxShadow: {
        glow: "0 0 20px rgba(149, 211, 186, 0.15)",
      },

      backdropBlur: {
        xs: "2px",
      },

      backgroundImage: {
        stadium:
          "radial-gradient(circle at top center, rgba(255,255,255,0.08) 0%, rgba(18,20,20,1) 70%), linear-gradient(180deg, #064e3b 0%, #121414 100%)",
      },
    },
  },

  plugins: [],
};