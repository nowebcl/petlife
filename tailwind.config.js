/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pet-navy-950': 'var(--pet-navy-950)',
        'pet-orange-600': 'var(--pet-orange-600)',
        'pet-orange-500': 'var(--pet-orange-500)',
        'pet-cyan-500': 'var(--pet-cyan-500)',
        'pet-cyan-100': 'var(--pet-cyan-100)',
        'pet-text-soft': 'var(--pet-text-soft)',
        pet: {
          orange: {
            DEFAULT: '#FF5200',
            500: '#FF6508',
            600: '#FF5200',
            hover: '#E04700',
            light: '#FFF2EA',
            dark: '#D84500'
          },
          navy: {
            DEFAULT: '#061F3D',
            950: '#061F3D',
            dark: '#04152A',
            light: '#1B3A63',
            muted: '#637792'
          },
          cyan: {
            DEFAULT: '#37BFEA',
            100: '#EAF9FD',
            500: '#37BFEA',
            dark: '#0284C7',
            light: '#EAF9FD'
          },
          text: {
            soft: '#637792'
          },
          bg: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(8px) rotate(-3deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'float': 'float-slow 4s ease-in-out infinite',
        'float-reverse': 'float-reverse 5s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
