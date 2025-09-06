// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff", 
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7", // Main purple
          600: "#9333ea", // Primary brand color
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
          950: "#3b0764",
          DEFAULT: "#9333ea",
          light: "#c084fc",
          dark: "#7c3aed",
        },
        
        // Secondary Brand Colors (Pink/Rose)
        secondary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899", // Main pink
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
          DEFAULT: "#ec4899",
          light: "#f9a8d4",
          dark: "#be185d",
        },

        // Accent Colors
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Main amber
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
          DEFAULT: "#f59e0b",
          light: "#fcd34d",
          dark: "#d97706",
        },

        // Success Colors
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e", // Main green
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
          DEFAULT: "#22c55e",
        },

        // Warning Colors
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Main orange
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
          DEFAULT: "#f59e0b",
        },

        // Error Colors
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444", // Main red
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
          DEFAULT: "#ef4444",
        },

        // Info Colors
        info: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Main blue
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
          DEFAULT: "#3b82f6",
        },

        // Neutral Colors (Enhanced)
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },

        // Background Colors
        background: {
          primary: "#fafafa", // Light neutral
          secondary: "#f8fafc", // Slightly blue-tinted
          accent: "#fdf2f8", // Light pink
          dark: "#1f2937", // Dark mode background
        },

        // Text Colors
        text: {
          primary: "#1f2937", // Dark gray
          secondary: "#6b7280", // Medium gray
          muted: "#9ca3af", // Light gray
          inverse: "#ffffff", // White for dark backgrounds
          accent: "#9333ea", // Purple for links/accents
        },

        // Border Colors
        border: {
          light: "#f3f4f6",
          DEFAULT: "#e5e7eb",
          dark: "#d1d5db",
          accent: "#e9d5ff", // Light purple
        },

        // Special Purpose Colors
        special: {
          gradient: {
            start: "#9333ea", // Purple
            end: "#ec4899", // Pink
          },
          shadow: "rgba(147, 51, 234, 0.1)", // Purple shadow
          overlay: "rgba(0, 0, 0, 0.5)", // Dark overlay
        },
      },
      
      fontFamily: {
        "sans-en": ["'Poppins'", "system-ui", "-apple-system", "sans-serif"],
        "sans-ar": ["Tajawal", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
      
      animation: {
        float: "float 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        'brand': '0 4px 14px 0 rgba(147, 51, 234, 0.1)',
        'brand-lg': '0 10px 25px -3px rgba(147, 51, 234, 0.1), 0 4px 6px -2px rgba(147, 51, 234, 0.05)',
      },

      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
        'gradient-brand-reverse': 'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
      },
    },
  },
  plugins: [],
};