/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mistBlue: '#A8DADC',
        mistBlueDark: '#457B9D',
        softGray: '#F1FAEE',
        darkBlue: '#1D3557',
        success: '#4CAF7D',
        danger: '#E76F51'
      }
    }
  },
  plugins: []
};
