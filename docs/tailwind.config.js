/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./content/**/*.md', './templates/**/*.html'],
  theme: {
    extend: {
      colors: {
        paynegrey: '#4F5D75',
        coral: '#EF8354',
        silver: '#BFC0C0',
        gunmetal: '#2D3142',
      }
    },
  },
  plugins: [],
}

