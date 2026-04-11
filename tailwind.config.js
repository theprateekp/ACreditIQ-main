/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light institutional palette
        page:    '#F0EFE9',
        surface: '#FAFAF7',
        'surface-alt': '#F4F3EE',
        hdr:     '#1E3A5F',
        'hdr-2': '#162D4A',
        'hdr-border': '#2A4A6E',
        border:  '#C8C5B8',
        'border-dk': '#A09D92',
        ink:     '#1A1A2E',
        'ink-2': '#4A4A5A',
        muted:   '#7A7A8A',
        'hdr-text': '#E8EDF5',
        'hdr-muted': '#94A3B8',
        accent:  '#1D4ED8',
        'accent-lt': '#DBEAFE',
        'accent-hover': '#1E40AF',
        ok:      '#15803D',
        'ok-bg': '#DCFCE7',
        warn:    '#B45309',
        'warn-bg': '#FEF3C7',
        danger:  '#B91C1C',
        'danger-bg': '#FEE2E2',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
        header: '0 2px 4px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        inst: '3px',
      },
    },
  },
  plugins: [],
}
