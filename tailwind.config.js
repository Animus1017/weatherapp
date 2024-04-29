/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*"],
  theme: {
    extend: {
      backgroundImage: {
        'mainbg': "linear-gradient(160deg,#112d4e 0%,#3f72af 100%)",
        
      },
      colors: {
        'dark1': '#112d4e',
        'dark2': '#3f72af',
        'light1': '#dbe2ef',
        'light2': '#f9f7f7',
      },
    },
  },
  plugins: [],
}

