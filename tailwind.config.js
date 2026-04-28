/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        // Al-Mostashar Brand Identity Colors
        primary: {
          DEFAULT: '#1A2B4A',
          light: '#2D4A6F',
          dark: '#0D1B2A',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C547',
          dark: '#B8960C',
        },
        success: '#2D6A4F',
        error: '#9B2C2C',
        warning: '#D4AF37',
        brand: {
          light: '#F8F6F0',
          page: '#FAF9F6',
          muted: '#5C6B7E',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        slideIn: 'slideIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
