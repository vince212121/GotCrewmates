const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      darkblue: "#2a2d43",
      lightblue: "#6b75e8",
      lightlightblue: "#949beb",
      white: "#ffffff",
      black: "#000000",
      red: "#ff6666"
    },
    extend: {
      colors: {
        background: {
          50: "#5c5f75",
          100: "#52556b",
          200: "#484b61",
          300: "#3e4157",
          400: "#34374d",
          500: "#2a2d43",
          600: "#202339",
          700: "#16192f",
          800: "#0c0f25",
          900: "#02051b",
        },
        header: {
          50: "#b15efd",
          100: "#a754f3",
          200: "#9d4ae9",
          300: "#9340df",
          400: "#8936d5",
          500: "#7f2ccb",
          600: "#7522c1",
          700: "#6b18b7",
          800: "#610ead",
          900: "#5704a3",
        },
        text: {
          50: "#fbffff",
          100: "#f1f9ff",
          200: "#e7eff7",
          300: "#dde5ed",
          400: "#d3dbe3",
          500: "#c9d1d9",
          600: "#bfc7cf",
          700: "#b5bdc5",
          800: "#abb3bb",
          900: "#a1a9b1",
        },
        btn: {
          50: "#82bceb",
          100: "#78b2e1",
          200: "#6ea8d7",
          300: "#649ecd",
          400: "#5a94c3",
          500: "#508ab9",
          600: "#4680af",
          700: "#3c76a5",
          800: "#326c9b",
          900: "#286291",
        },
        company: {
          50: "#858bcc",
          100: "#7b81c2",
          200: "#7177b8",
          300: "#676dae",
          400: "#5d63a4",
          500: "#53599a",
          600: "#494f90",
          700: "#3f4586",
          800: "#353b7c",
          900: "#2b3172",
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
};
