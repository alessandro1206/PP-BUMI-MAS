/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mercury: {
          onyx: '#171721',
          graphite: '#1e1e2a',
          obsidian: '#272735',
          slate: '#70707d',
          mist: '#e2e3ed',
          ash: '#c3c3cc',
          ivory: '#ededf3',
          cobalt: '#5266eb',
          white: '#ffffff',
        },
        padi: {
          primary: '#0f3e2e',
          dark: '#08251b',
          surface: '#171721',
          canvas: '#171721',
          accent: '#5266eb',
          gold: '#d4af37',
          reject: '#ef4444',
          card: '#1e1e2a'
        }
      },
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Inter', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'pill': '32px',
        'pill-lg': '40px',
      }
    },
  },
  plugins: [],
}
