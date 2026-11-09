/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#202B45',
          dark: '#1a2338',
          light: '#2a3651',
        },
        terracotta: {
          DEFAULT: '#D97757',
          light: '#e49274',
          dark: '#c4603f',
        },
        lavender: {
          DEFAULT: '#E9E6F5',
          light: '#f3f1f9',
          dark: '#d4cfe8',
        },
        beige: {
          DEFAULT: '#F0E9DD',
          light: '#f7f2ea',
          dark: '#e3d9c6',
        },
        offwhite: '#F8F7F4',
        charcoal: '#252525',
        grey: {
          DEFAULT: '#737373',
          light: '#a3a3a3',
          dark: '#4a4a4a',
        },
        success: '#248A61',
        warning: '#D99A36',
        error: '#D9534F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
