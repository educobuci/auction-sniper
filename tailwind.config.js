const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      objectPosition: {
        center88: '88% center'
      },
      boxShadow: {
        card: '0px 3px 100px #00000020'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      colors: {
        primary: colors.blue,
        gray: colors.gray,
        gridTemplateColumns: {
          'fill': 'repeat(auto-fill, minmax(0, 1fr))',
        },
      },
      fontSize: {
        'huge': '13rem'
      },
      lineHeight: {
        'full': '100%'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')]
}
