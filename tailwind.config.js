/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-start': '#30cfd0',
        'primary-end': '#330867',
        'secondary-start': '#667eea',
        'secondary-end': '#764ba2',
        'accent-start': '#f093fb',
        'accent-end': '#f5576c',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite',
        'float-slow': 'float-slow 12s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'water-flow': 'waterFlow 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'waterRipple': 'waterRipple 1.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.2' },
          '50%': { transform: 'translateY(-30px) rotate(90deg)', opacity: '0.6' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: '0.1' },
          '33%': { transform: 'translateY(-15px) scale(1.1) rotate(120deg)', opacity: '0.4' },
          '66%': { transform: 'translateY(-25px) scale(0.9) rotate(240deg)', opacity: '0.3' },
        },
        waterFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        waterRipple: {
          '0%': { transform: 'scale(0)', opacity: '0.8' },
          '50%': { opacity: '0.4' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
} 