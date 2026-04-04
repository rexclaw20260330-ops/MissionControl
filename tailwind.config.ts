import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        electric: "#0066ff",
        neon: "#00ffff",
        dark: "#0a0a0f",
        card: "#15151a",
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
      },
    },
  },
  plugins: [],
};

export default config;
