/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tarbiyah: {
          50: '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d2',
          300: '#86efad',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          50: '#fffdf5',
          100: '#fef9e8',
          200: '#fdf0c5',
          300: '#fce396',
          400: '#f9cf58',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        islamic: {
          dark: '#081410',
          card: '#0e221b',
          border: '#1b3b30',
          lightBg: '#f8faf8',
          sand: '#fcfaf5',
        }
      },
      fontFamily: {
        arabic: ['"Amiri"', '"Traditional Arabic"', 'Scheherazade', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'islamic-pattern': "radial-gradient(#15803d15 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
