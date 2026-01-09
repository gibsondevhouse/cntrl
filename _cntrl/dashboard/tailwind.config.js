/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505", // Deepest black/charcoal
        surface: {
            DEFAULT: "#121212",
            glass: "rgba(20, 20, 20, 0.7)",
            hover: "rgba(255, 255, 255, 0.03)"
        },
        primary: "#EAEAEA", // Softened white
        secondary: "#888888",
        accent: {
            DEFAULT: "#D4AF37", // Muted Gold
            dim: "rgba(212, 175, 55, 0.1)"
        },
        paper: "#e8e6e3", // Warm off-white for reading
        ink: "#1a1a1a",   // Soft black for text on paper
        glass: {
            light: "rgba(255, 255, 255, 0.05)",
            border: "rgba(255, 255, 255, 0.08)"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
