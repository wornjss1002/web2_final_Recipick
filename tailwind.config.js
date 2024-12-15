/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700', // 밝은 노란색
        secondary: '#8B4513', // 브라운
        accent: '#FFA500', // 오렌지색
      },
    },
  },
  plugins: [],
}
