export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B0C',
        surface: '#141415',
        'surface-2': '#1C1C1E',
        grafite: '#2A2A2D',
        mid: '#9A9AA0',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
