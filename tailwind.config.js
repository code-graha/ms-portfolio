/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './assets/js/**/*.js', './scripts/build.mjs'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#111111',
        coral: { DEFAULT: '#E8402A', dark: '#C9321E', soft: '#FDECE9' },
        mist: '#F4F3F1',
      },
    },
  },
  plugins: [],
};
