/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#1e1e2e", // base
          80: "rgba(30,30,46,0.8)", // surface/80
        },
        bg: "#0f0f17",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.2)", // shadow-soft
      },
    },
  },
  plugins: [],
};
