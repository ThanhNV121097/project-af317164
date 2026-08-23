import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        text: "var(--color-text)"
      },
      spacing: {
        "0": "var(--space-0)"
      },
      fontFamily: {
        sans: "var(--font-sans)"
      },
      fontSize: {
        title: ["var(--text-title-size)", { lineHeight: "var(--text-title-line-height)", fontWeight: "var(--text-title-weight)" }]
      },
      borderRadius: {
        none: "var(--radius-none)"
      },
      boxShadow: {
        none: "var(--shadow-none)"
      },
      transitionDuration: {
        none: "var(--duration-none)"
      },
      transitionTimingFunction: {
        linear: "var(--easing-linear)"
      }
    }
  },
  plugins: []
};

export default config;
