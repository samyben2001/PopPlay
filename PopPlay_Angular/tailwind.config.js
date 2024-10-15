/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      maxHeight: { // FIXME: tailwind custom theme not working
        '125': '125px',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ]
}