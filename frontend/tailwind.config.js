/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // YouTube Red 기반 Primary 색상
        primary: {
          DEFAULT: '#FF0000',
          dark: '#CC0000',
        },
        // Slate 기반 색상
        surface: '#FFFFFF',
        background: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
