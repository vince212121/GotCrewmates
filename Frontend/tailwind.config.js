const colors = require('tailwindcss/colors')

module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            "colors": {
              "pink2": {
                "50": "#b15efd",
                "100": "#a754f3",
                "200": "#9d4ae9",
                "300": "#9340df",
                "400": "#8936d5",
                "500": "#7f2ccb",
                "600": "#7522c1",
                "700": "#6b18b7",
                "800": "#610ead",
                "900": "#5704a3"
              },
              "black2": {
                "50": "#ffb6ff",
                "100": "#ffacff",
                "200": "#ffa2ff",
                "300": "#ff98fc",
                "400": "#ff8ef2",
                "500": "#ff84e8",
                "600": "#f57ade",
                "700": "#eb70d4",
                "800": "#e166ca",
                "900": "#d75cc0"
              },
    },
    variants: {
        extend: {},
    },
    plugins: [],
        },
    },

};