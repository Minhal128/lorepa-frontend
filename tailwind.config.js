/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      screens: {
        xs: '475px',
      },
      boxShadow: {
        mobileCard: '0 8px 24px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
};