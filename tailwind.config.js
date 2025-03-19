/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      "white": "#FFFFFF",
      "violet": "#AA2AE8",
      "black": '#23272D',
      "brand-color": '#C8FB51',
      "border-color": '#707070',
      "accent-font-color": "#5E6672",
      "bg-grey": '#F5F5F5',
      "black-2": "#222222",
      "grey-out": "#DDDDDC",
      "red": '#FB5151',
      "yellow": '#FBE751',
      "blue": "#2A9FE8",
      "dark-yellow": '#F7CC1F',
      "blue-2": "#13CDF8",
      "orange": "#FE972C",
      "peach": '#FFEFE0',
      "light-green": "#ECFEEF",
      "light-blue": "#E3F6FA",
      "light-violet": '#F0D1FF',
      "divider": '#D1D1D1',
      'static-black': '#1C1B20',
      "light-green-2": '#F7FFF6'
    },
    fontFamily: {
      quickSand: ['Quicksand', 'sans-serif'],
      lato: ['Lato', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
