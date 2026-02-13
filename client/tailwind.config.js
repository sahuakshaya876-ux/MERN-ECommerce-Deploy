
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
  // Bright brand accents (baby pink)
  brandPink: '#ffd1e6',
  brandSky: '#38bdf8',
  // Add a complementary bright green for mixed gradients
  brandGreen: '#34d399',
        primary: {
          50: '#f0f9ff',
          100: '#e6f7ff',
          200: '#cfeefe',
          300: '#9fe6fb',
          400: '#60d8f4',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#066f8f',
          800: '#055a76',
          900: '#084c63'
        },
        accent: {
          50: '#fff5f7',
          100: '#ffe6ec',
          200: '#ffd1dc',
          300: '#ffabb7',
          400: '#ff7a95',
          500: '#ff4d6d',
          600: '#ff2d4a',
          700: '#e0243d',
          800: '#b42336',
          900: '#992132'
        },
        muted: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b'
        },
        card: '#ffffffcc'
      },
      boxShadow: {
        soft: '0 6px 18px rgba(15, 23, 42, 0.06)'
      }
    },
  },
  plugins: [],
};
