/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90A4',
          light: '#6BB5C9',
          dark: '#357286',
        },
        secondary: {
          DEFAULT: '#F5A623',
          light: '#FFBE4D',
          dark: '#D88D10',
        },
        accent: {
          pink: '#E91E63',
          green: '#4CAF50',
          blue: '#2196F3',
          yellow: '#FFC107',
        },
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'],
        display: ['Poppins', 'Noto Sans TC', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'count-up': 'countUp 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
