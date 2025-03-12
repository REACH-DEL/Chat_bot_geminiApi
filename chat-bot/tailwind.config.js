module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gray-900": "#111827",
        "gray-800": "#1f2937",
        "gray-700": "#374151",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
