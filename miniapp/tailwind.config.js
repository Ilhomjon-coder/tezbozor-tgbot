/** @type {import('tailwindcss').Config} */
// Tezbozor design tokens translated into the Tailwind theme. Values are copied
// verbatim from tgbot/designs/design-system/tokens/*.css — the source of truth.
// Brandbook rule: orange ONLY on CTAs/badges, blue is forbidden.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1FA055', // green-500
          'green-dark': '#157A40', // green-700
          'green-light': '#E6F4EC', // green-050
          orange: '#FF7A00', // orange-500
          'orange-dark': '#E66E00', // orange-600
          'orange-light': '#FFF1E0', // orange-050
        },
        ink: {
          900: '#1E2A32',
          600: '#51616B',
          400: '#8A98A0',
          200: '#D8DEE2',
          100: '#ECEFF1',
        },
        paper: '#FAF7F2',
        card: '#FFFFFF',
        danger: '#D64545',
        'danger-light': '#FBEAEA',
      },
      fontFamily: {
        heading: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        h1: ['28px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        h2: ['20px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        h3: ['18px', { lineHeight: '1.15', fontWeight: '700' }],
        lg: ['17px', { lineHeight: '1.55' }],
        base: ['16px', { lineHeight: '1.55' }],
        sm: ['15px', { lineHeight: '1.5' }],
        xs: ['13px', { lineHeight: '1.35' }],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        pill: '999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(30, 42, 50, 0.06)',
        sm: '0 2px 8px rgba(30, 42, 50, 0.07)',
        md: '0 6px 18px rgba(30, 42, 50, 0.09)',
        lg: '0 12px 32px rgba(30, 42, 50, 0.12)',
        green: '0 6px 16px rgba(31, 160, 85, 0.22)',
        orange: '0 6px 16px rgba(255, 122, 0, 0.26)',
      },
      maxWidth: {
        content: '420px',
      },
      spacing: {
        gutter: '16px',
      },
    },
  },
  plugins: [],
};
