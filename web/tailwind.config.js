/** @type {import('tailwi      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'slide-in-from-right': 'slide-in-from-right 0.4s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.4s ease-out',
        'progress': 'progress linear',
      },.Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          900: '#0f172a',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'slide-in-from-right': 'slide-in-from-right 0.4s ease-out',
        'progress': 'progress linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'slide-in-from-right': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(100px) scale(0.95)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0) scale(1)',
          },
        },
        'slide-in-from-top': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-50px) scale(0.95)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
          },
        },
        progress: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
