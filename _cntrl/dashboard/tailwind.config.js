/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#202023", // Soft Charcoal (Lighter than #141416)
        surface: {
            DEFAULT: "#2a2a2e", // Lighter Surface
            glass: "rgba(42, 42, 46, 0.7)",
            hover: "rgba(191, 166, 247, 0.08)"
        },
        primary: "#edecec", // Soft Grey-White
        secondary: "#a1a1aa", // Lighter Cool Grey
        accent: {
            DEFAULT: "#BFA6F7", // Editorial Lavender
            dim: "rgba(191, 166, 247, 0.15)"
        },
        paper: "#e8e6e3", 
        ink: "#1a1a1a",   
        glass: {
            light: "rgba(255, 255, 255, 0.03)",
            border: "rgba(255, 255, 255, 0.05)"
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
