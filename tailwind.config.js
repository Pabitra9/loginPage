/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
   
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

