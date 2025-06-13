import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#901b20',
        secondary: '#203947',
        'accent-1': '#ad565a',
        'accent-2': '#cc9598',
        light: '#ebebeb',
      },
    },
  },
  plugins: [
    forms,
    typography,
  ],
  animation: {
    'fade-in': 'fadeIn 0.3s ease-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
}
}