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
    },
  },
  plugins: [],
}

