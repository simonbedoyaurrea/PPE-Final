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
        accent: "#f9bd22",

        background: "#121414",
        surface: "#1e2020",
        surfaceDark: "#1a1c1c",

        text: "#e2e2e2",
        textMuted: "#bfc9c3",

        outline: "#404944",

        success: "#064e3b",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Lexend", "sans-serif"],
      },

      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },

      maxWidth: {
        container: "1280px",
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
