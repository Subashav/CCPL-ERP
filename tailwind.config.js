/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      colors: {
        primary: {
          DEFAULT: '#1E40AF', // Dark Blue (Royal Blue)
          dark: '#1E3A8A',    // Darker Blue for hover
          light: '#3B82F6',   // Lighter Blue
          pale: '#DBEAFE',    // Very light blue for backgrounds
        },
        navy: {
          DEFAULT: '#1E293B', // Slate 800 (Neutral Dark Blue-Grey) - Less "Green"
          800: '#0F172A',     // Slate 900
          900: '#020617',     // Slate 950
        },
        background: '#F8FAFC',
        text: {
          main: '#111827',
          light: '#64748b',
        },
        success: '#22C55E', // Green
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}
