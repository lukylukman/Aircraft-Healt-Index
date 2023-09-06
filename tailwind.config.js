/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: ["./src/**/*.{html,ts}"],
  },
  content: [
    "./src/**/*.{css, scss}",
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "pattern-accent": "url('src/assets/images/drawer-accent3.svg')",
      },
      backgroundPosition: {
        "top-4": "left top 3.2rem",
      },
      spacing: {
        52: "13rem",
      },
      boxShadow: {
        "right-dark": "2px 0px 16px 0px rgba(0, 0, 0, 0.2)",
        "right-dark-md": "4px 0px 16px 0px rgba(0, 0, 0, 0.2)",
      },
      colors: {
        "tms-blue": {
          50: "#EAF1FB",
          100: "#D0E0F6",
          200: "#A6C5ED",
          300: "#77A6E4",
          400: "#4888DB",
          500: "#276BC5",
          600: "#1F569D",
          700: "#184177",
          800: "#102C51",
          900: "#081526"
        },
        "tms-neutral": {
          50: "#F5F5F5",
          100: "#EBEBEB",
          200: "#D9D9D9",
          300: "#C4C4C4",
          400: "#B3B3B3",
          500: "#9E9E9E",
          600: "#808080",
          700: "#5E5E5E",
          800: "#404040",
          900: "#1F1F1F"
        },
        "tms-green": {
          50: "#E6F9EE",
          100: "#CDF4DD",
          200: "#9FEABE",
          300: "#6DDE9C",
          400: "#3BD37A",
          500: "#27AE60",
          600: "#1F8A4B",
          700: "#176839",
          800: "#104727",
          900: "#072112"
        },
        "tms-warning": {
          50: "#FCF9ED",
          100: "#F9F1D7",
          200: "#F3E2AF",
          300: "#EED58C",
          400: "#E8C764",
          500: "#E2B93B",
          600: "#C89D1E",
          700: "#977716",
          800: "#624D0E",
          900: "#312607"
        },
        "tms-applegreen": {
          50: "#F6FFE0",
          100: "#EBFFBD",
          200: "#D9FF80",
          300: "#C5FF3D",
          400: "#B3FF00",
          500: "#84BD00",
          600: "#6B9900",
          700: "#4F7000",
          800: "#364D00",
          900: "#192400"
        },
        "tms-error": {
          50: "#FDEDED",
          100: "#FBDFDF",
          200: "#F7BBBB",
          300: "#F39B9B",
          400: "#EF7676",
          500: "#EB5757",
          600: "#E41B1B",
          700: "#AD1515",
          800: "#720E0E",
          900: "#3B0707"
        },
        "ahi-green": {
          50: "#FDEDED",
          100: "#FBDFDF",
          200: "#F7BBBB",
          300: "#F39B9B",
          400: "#E6FAB9",
          500: "#84BD00",
          600: "#E41B1B",
          700: "#AD1515",
          800: "#720E0E",
          900: "#3B0707"
        }
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
