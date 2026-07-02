/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Trading-centric Obsidian color palette
        background: {
          DEFAULT: "#090A0F", // Deep space black
          card: "#12141C",       // Card background
          surface: "#181A24",    // Inner components / inputs
          hover: "#222533",      // Hover states
        },
        border: {
          DEFAULT: "#26293B",    // Subtle divider
          active: "#3B82F6",     // Focused inputs
        },
        // Semantic color tokens
        trade: {
          profit: {
            DEFAULT: "#10B981",  // Emerald 500
            soft: "rgba(16, 185, 129, 0.1)",
            glow: "rgba(16, 185, 129, 0.25)",
          },
          loss: {
            DEFAULT: "#F43F5E",    // Rose 500
            soft: "rgba(244, 63, 94, 0.1)",
            glow: "rgba(244, 63, 94, 0.25)",
          },
          long: {
            DEFAULT: "#3B82F6",    // Blue 500 (Alternative positive action)
            soft: "rgba(59, 130, 246, 0.1)",
          },
          short: {
            DEFAULT: "#F59E0B",   // Amber 500 (Alternative negative action)
            soft: "rgba(245, 158, 11, 0.1)",
          }
        },
        // Text/Foregound colors
        foreground: {
          DEFAULT: "#F3F4F6",    // Main text
          muted: "#9CA3AF",      // Labels and inactive tabs
          dim: "#6B7280",        // Low emphasis
        }
      },
      fontFamily: {
        sans: [
          "Inter", 
          "system-ui", 
          "-apple-system", 
          "BlinkMacSystemFont", 
          "Segoe UI", 
          "Roboto", 
          "Helvetica Neue", 
          "Arial", 
          "sans-serif"
        ],
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      boxShadow: {
        "glow-profit": "0 0 15px rgba(16, 185, 129, 0.15)",
        "glow-loss": "0 0 15px rgba(244, 63, 94, 0.15)",
        "card-shadow": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
      screens: {
        'xs': '375px', // For ultra-small mobile screens
      }
    },
  },
  plugins: [],
}