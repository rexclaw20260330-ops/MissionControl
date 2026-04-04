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
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'energy-pulse': 'energyPulse 1.5s ease-in-out infinite',
        'energy-pulse-reverse': 'energyPulseReverse 1.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'golden-pulse': 'goldenPulse 3s ease-in-out infinite',
        'halo-pulse': 'haloPulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        energyPulse: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        energyPulseReverse: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34,211,238,0.8), 0 0 40px rgba(34,211,238,0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(34,211,238,1), 0 0 60px rgba(34,211,238,0.6)' },
        },
        goldenPulse: {
          '0%, 100%': { boxShadow: '0 0 40px rgba(251,191,36,0.3), 0 0 80px rgba(251,191,36,0.1)' },
          '50%': { boxShadow: '0 0 60px rgba(251,191,36,0.5), 0 0 120px rgba(251,191,36,0.2)' },
        },
        haloPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
