import type { Config } from "tailwindcss";

/**
 * 4theculture design tokens.
 * Dark-mode dominant palette with vibrant neon accents:
 *   - neon.purple  (electric purple)  primary
 *   - neon.pink    (hot pink)         secondary
 *   - neon.cyan    (cyan)             tertiary / highlights
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pure grayscale surfaces — black-dominant.
        ink: {
          950: "#000000",
          900: "#0a0a0a",
          800: "#161616",
          700: "#222222",
          600: "#333333",
        },
        // Brand "accent" ramp is now monochrome (white → light grays) so every
        // component that references these tokens renders in black & white.
        neon: {
          purple: "#ffffff",
          violet: "#e5e5e5",
          pink: "#ffffff",
          cyan: "#cfcfcf",
          lime: "#ffffff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Soft white glow on black instead of coloured neon.
        neon: "0 0 24px -4px rgba(255,255,255,0.28)",
        "neon-pink": "0 0 28px -6px rgba(255,255,255,0.40)",
        "neon-cyan": "0 0 28px -6px rgba(255,255,255,0.22)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.10), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 45%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.06), transparent 50%)",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
