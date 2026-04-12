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
        ship: '#ff5b4f',
        preview: '#de1d8d',
        develop: '#0a72ef',
        'vercel-black': '#171717',
        'gray-v': {
          50: '#fafafa',
          100: '#ebebeb',
          400: '#808080',
          500: '#666666',
          600: '#4d4d4d',
          900: '#171717',
        },
      },
      letterSpacing: {
        'display': '-0.18em',
        'heading-lg': '-0.04em',
        'heading-md': '-0.03em',
        'heading-sm': '-0.02em',
        'body-sm': '-0.01em',
      },
      boxShadow: {
        'ring': '0px 0px 0px 1px rgba(0,0,0,0.08)',
        'ring-light': '0px 0px 0px 1px rgb(235,235,235)',
        'card': '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 2px rgba(0,0,0,0.04), 0px 8px 8px -8px rgba(0,0,0,0.04)',
        'card-dark': '0px 0px 0px 1px rgba(255,255,255,0.10), 0px 2px 2px rgba(0,0,0,0.40), 0px 8px 8px -8px rgba(0,0,0,0.40)',
      },
    },
  },
  plugins: [],
};
