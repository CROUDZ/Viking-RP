import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{ts,tsx,js,jsx}", // Pages et layouts Next.js
    "./src/components/**/*.{ts,tsx,js,jsx}", // Composants React
  ],
  theme: {
    extend: {
      screens: {
        "2xs": "320px",
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",

        // Enhanced Dark Viking Theme Colors
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        text: {
          primary: "var(--text-primary, #f8fafc)",
          secondary: "var(--text-secondary, #cbd5e1)",
          muted: "var(--text-muted, #64748b)",
        },
        accent: {
          gold: "var(--accent-gold, #f59e0b)",
          bronze: "var(--accent-bronze, #d97706)",
          steel: "var(--accent-steel, #6b7280)",
        },
        hover: {
          dark: "var(--hover-dark)",
        },
        active: {
          dark: "var(--active-dark)",
        },
        border: {
          dark: "var(--border-dark)",
        },
        success: {
          dark: "var(--success-dark, #10b981)",
        },
        warning: {
          dark: "var(--warning-dark, #f59e0b)",
        },
        error: {
          dark: "var(--error-dark, #ef4444)",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backdropBlur: {
        "2xl": "40px",
      },
    },
  },
  plugins: [],
};

export default config;
