/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        themeColor: "var(--theme-color)",
        themeMode: "var(--theme-mode)",
        oppositeThemeMode: "var(--opposite-theme-mode)",
        textColor: "var(--text-color)",
        bg5: "var(--background5)",
        bg10: "var(--background10)",
        bg15: "var(--background15)",
        bg20: "var(--background20)",
        bg30: "var(--background30)",
        bgHover: "var(--backgroundHover)",
      },
      keyframes: {
        scalein: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        scalein: "scalein 0.3s ease-in forwards",
        fadein: "fadein 0.3s ease-in forwards",
        slideDown: "slideDown 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
}
