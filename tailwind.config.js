/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: 'rgba(32, 33, 39, 0.9)',
          background: 'rgba(32, 33, 39, 0.9)',
          text: '#f3f4f6',
        },
      },
    },
  },
  plugins: [],
};
