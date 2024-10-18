/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./packages/client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minWidth: {
        '300': '300px',
      },
      borderColor: (theme) => ({
        ...theme('colors'),
        DEFAULT: 'var(--border-color)',
      }),
    }
  },
  variants: {},
  plugins: [],
}

