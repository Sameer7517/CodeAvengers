/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nature-inspired brand colors
        exchange: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-elevated': 'var(--color-surface-elevated)',
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          secondary: 'var(--color-secondary)',
          sage: 'var(--color-sage)',
          text: 'var(--color-text)',
          'text-muted': 'var(--color-text-muted)',
          border: 'var(--color-border)',
        },
        forest: {
          50: '#f0f7f3',
          100: '#dcebdf',
          200: '#b8dec8',
          300: '#8ac5a6',
          400: '#5aa782',
          500: '#388b64',
          600: '#2a7050',
          700: '#176B4D', // Primary green light
          800: '#13543d',
          900: '#0f3f2e',
          950: '#0B110E', // Dark main bg
        },
        sage: {
          50: '#f4f7f5',
          100: '#dcebdf',
          200: '#cddfcf',
          300: '#a7c6ab',
          400: '#7ea883',
          500: '#4F8F70', // Secondary green light
          600: '#3d7259',
          700: '#2f5744',
          800: '#234133',
          900: '#19251E',
        },
        offwhite: {
          50: '#fcfcfb',
          100: '#F6F8F5', // Main light bg
          200: '#f0f4f1',
          300: '#e5ece6',
          400: '#d4ded6',
          500: '#b5c2b7',
        },
        darktheme: {
          bg: '#0B110E',
          surface: '#131C17',
          elevated: '#19251E',
          primary: '#72D6A2',
          secondary: '#A0CDB0',
          text: '#EDF6EF',
          'text-muted': '#A2B1A6',
          border: 'rgba(210, 245, 220, 0.12)',
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
      borderRadius: {
        'card': '18px',
        'btn': '12px',
        'hero': '28px'
      },
      boxShadow: {
        'eco': '0 4px 20px -2px rgba(23, 107, 77, 0.08), 0 2px 6px -1px rgba(23, 107, 77, 0.04)',
        'eco-lg': '0 10px 30px -4px rgba(23, 107, 77, 0.14), 0 4px 10px -2px rgba(23, 107, 77, 0.06)',
        'glass-light': '0 8px 32px 0 rgba(25, 55, 35, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
