/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0E6B5E',
        'primary-light': '#14A085',
        'primary-bg': '#E6F2EF',

        surface: '#FFFFFF',
        canvas: '#F5F6F7',

        border: '#E5E7EB',
        'border-strong': '#D1D5DB',

        ink: '#111827',
        'ink-secondary': '#374151',
        'ink-muted': '#6B7280',
        'ink-faint': '#9CA3AF',

        success: { bg: '#D1FAE5', text: '#047857', dot: '#059669' },
        warning: { bg: '#FEF3C7', text: '#92400E', dot: '#B45309' },

        zone: {
          purple: { bg: '#EDE7F6', text: '#5B21B6' },
          green: { bg: '#D1FAE5', text: '#047857' },
          blue: { bg: '#DBEAFE', text: '#1E40AF' },
          gray: { bg: '#E5E7EB', text: '#374151' },
        },
      },
      borderRadius: {
        sm: '8px',
        md: '10px',
        lg: '14px',
        xl: '24px',
      },
      boxShadow: {
        drawer: '4px 0 24px rgba(15, 23, 22, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
