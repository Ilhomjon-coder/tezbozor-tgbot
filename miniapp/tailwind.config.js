/** @type {import('tailwindcss').Config} */
// Tezbozor Tailwind theme — references the design tokens defined in
// src/styles/tokens.css (the single source of truth, translated from
// designs/design-system/tokens/*.css). No literal token value is duplicated
// here: colours use the rgb-channel vars so opacity utilities (bg-brand-green/10)
// still work; radius/spacing/type/shadow point straight at the var().
// Brandbook rule: orange ONLY on CTAs/badges, blue is forbidden.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: 'rgb(var(--green-500-rgb) / <alpha-value>)',
          'green-dark': 'rgb(var(--green-700-rgb) / <alpha-value>)',
          'green-light': 'rgb(var(--green-050-rgb) / <alpha-value>)',
          orange: 'rgb(var(--orange-500-rgb) / <alpha-value>)',
          'orange-dark': 'rgb(var(--orange-600-rgb) / <alpha-value>)',
          'orange-light': 'rgb(var(--orange-050-rgb) / <alpha-value>)',
        },
        ink: {
          900: 'rgb(var(--ink-900-rgb) / <alpha-value>)',
          600: 'rgb(var(--ink-600-rgb) / <alpha-value>)',
          400: 'rgb(var(--ink-400-rgb) / <alpha-value>)',
          200: 'rgb(var(--ink-200-rgb) / <alpha-value>)',
          100: 'rgb(var(--ink-100-rgb) / <alpha-value>)',
        },
        paper: 'rgb(var(--paper-rgb) / <alpha-value>)',
        card: 'rgb(var(--card-rgb) / <alpha-value>)',
        danger: 'rgb(var(--danger-500-rgb) / <alpha-value>)',
        'danger-light': 'rgb(var(--danger-050-rgb) / <alpha-value>)',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
      fontSize: {
        h1: ['var(--text-h1)', { lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tight)', fontWeight: 'var(--weight-extrabold)' }],
        h2: ['var(--text-h2)', { lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-tight)', fontWeight: 'var(--weight-bold)' }],
        h3: ['var(--text-h3)', { lineHeight: 'var(--leading-tight)', fontWeight: 'var(--weight-bold)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-relaxed)' }],
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-snug)' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        green: 'var(--shadow-green)',
        orange: 'var(--shadow-orange)',
      },
      maxWidth: {
        content: 'var(--content-max)',
      },
      spacing: {
        gutter: 'var(--page-gutter)',
      },
    },
  },
  plugins: [],
};
