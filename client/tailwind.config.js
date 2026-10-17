/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f3',
          100: '#dbeee2',
          200: '#b8dec8',
          300: '#8ac5a6',
          400: '#5aa782',
          500: '#388b64',
          600: '#2a7050',
          700: '#225941',
          800: '#1b4634',
          900: '#15392b',
          950: '#0c2018',
        },
        sage: {
          50: '#f4f7f5',
          100: '#e5eee7',
          200: '#cddfcf',
          300: '#a7c6ab',
          400: '#7ea883',
          500: '#5e8c64',
          600: '#48704e',
          700: '#3b5a3f',
          800: '#314935',
          900: '#293d2c',
        },
        offwhite: {
          50: '#fcfcfb',
          100: '#f9f9f6',
          200: '#f3f2eb',
          300: '#eae7dd',
          400: '#ded9ca',
          500: '#c8c0ad',
        },
        earth: {
          light: '#e8ece6',
          sand: '#f6f4ee',
          amber: '#d97706',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'eco': '0 4px 20px -2px rgba(27, 70, 52, 0.08), 0 2px 6px -1px rgba(27, 70, 52, 0.04)',
        'eco-lg': '0 10px 30px -4px rgba(27, 70, 52, 0.12), 0 4px 10px -2px rgba(27, 70, 52, 0.06)',
      }
    },
  },
  plugins: [],
}
