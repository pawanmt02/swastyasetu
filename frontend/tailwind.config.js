/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        triage: {
          critical: {
            DEFAULT: '#DC2626',
            light: '#FEE2E2',
            dark: '#991B1B'
          },
          urgent: {
            DEFAULT: '#D97706',
            light: '#FEF3C7',
            dark: '#92400E'
          },
          standard: {
            DEFAULT: '#16A34A',
            light: '#DCFCE7',
            dark: '#166534'
          }
        }
      }
    },
  },
  plugins: [],
}
