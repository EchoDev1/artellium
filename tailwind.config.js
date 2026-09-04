/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        art: {
          gold: '#B58A2A',
          'gold-light': '#CDB169',
          'gold-bright': '#C99E38',
          'gold-dark': '#7A570E',
          black: '#07080A',
          'black-card': '#0F1117',
          'black-surface': '#161922',
          'black-border': '#252936',
          green: '#062319',
          'green-light': '#0F3D2E',
          'green-accent': '#10B981',
          red: '#8B0000',
          'red-bright': '#EF4444',
          'red-crimson': '#C0392B',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C99E38 0%, #B58A2A 50%, #7A570E 100%)',
        'dark-gradient': 'linear-gradient(180deg, #07080A 0%, #0F1117 100%)',
        'emerald-gradient': 'linear-gradient(135deg, #062319 0%, #0F3D2E 100%)',
        'crimson-gradient': 'linear-gradient(135deg, #8B0000 0%, #C0392B 100%)',
        'hero-overlay': 'radial-gradient(circle at center, rgba(181,138,42,0.10) 0%, rgba(7,8,10,0.92) 80%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(181, 138, 42, 0.25)',
        'emerald-glow': '0 0 25px -5px rgba(15, 61, 46, 0.4)',
        'crimson-glow': '0 0 25px -5px rgba(139, 0, 0, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
