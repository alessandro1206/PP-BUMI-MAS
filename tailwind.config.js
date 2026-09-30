/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        padi: {
          primary: '#0f3e2e',
          dark: '#08251b',
          surface: '#faf8ff',
          canvas: '#f2f3ff',
          accent: '#10b981',
          gold: '#f59e0b',
          reject: '#ef4444',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
