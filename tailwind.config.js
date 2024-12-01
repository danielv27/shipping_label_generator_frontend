/** @type {import('tailwindcss').Config} */

import primeuiPlugin from 'tailwindcss-primeui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [primeuiPlugin]
}

