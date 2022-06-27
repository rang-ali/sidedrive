const { colors: defaultColors, cursor: defaultCursor } = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      md: '0.9375rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    colors: {
      transparent: defaultColors.transparent,
      black: defaultColors.black,
      white: defaultColors.white,
      red: defaultColors.red,
      green: {
        50: 'hsl(125, 39%, 94%)',
        100: 'hsl(122, 38%, 84%)',
        200: 'hsl(122, 37%, 74%)',
        300: 'hsl(123, 38%, 64%)',
        400: 'hsl(123, 38%, 57%)',
        500: 'hsl(122, 39%, 49%)',
        600: 'hsl(123, 41%, 45%)',
        700: 'hsl(123, 43%, 39%)',
        800: 'hsl(123, 46%, 34%)',
        900: 'hsl(124, 55%, 24%)',
      },
      primary: {
        DEFAULT: 'hsl(218, 88%, 56%)',
        50: 'hsl(218, 86%, 96%)',
        100: 'hsl(218, 85%, 92%)',
        200: 'hsl(218, 82%, 79%)',
        300: 'hsl(218, 81%, 69%)',
        400: 'hsl(218, 82%, 61%)',
        500: 'hsl(218, 88%, 56%)',
        600: 'hsl(219, 87%, 50%)',
        700: 'hsl(221, 88%, 46%)',
        800: 'hsl(223, 88%, 42%)',
        900: 'hsl(225, 89%, 36%)',
      },
      secondary: {
        200: '#E09CF1',
        400: 'hsl(298, 58%, 58%)',
      },
      gray: {
        DEFAULT: '#7C838D',
        '50': '#F7F7F8',
        '100': 'hsl(240, 11%, 96%)',
        150: 'hsl(240, 11%, 94%)',
        '200': '#CED0D4',
        '300': '#B3B7BC',
        '400': '#979DA5',
        '500': '#7C838D',
        '600': '#646A72',
        '700': '#4C5157',
        '800': '#34373C',
        '900': '#1C1E21'
      },
    },
    cursor: {
      ...defaultCursor,
      'col-resize': 'col-resize',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
