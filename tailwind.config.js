/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'chrmpBlue':'#2960A1',
      'chrmpGreen':'#8DC162',
      'chrmpWhite':'#FFFFFF',
      'chrmpGray' : '#E5E7EB'
    },
    screens: {
      'mobile': '390px' && {max : '767px'},
      'desktop': '768px'
      // => @media (min-width: 640px) { ... }
    },
    extend: {
    },
  },
  plugins: [],
}

