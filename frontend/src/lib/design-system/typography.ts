/**
 * Design System: Typography
 * Inter font family with professional scale
 */

export const typography = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    legal: 'Inter, "SF Pro Text", system-ui, sans-serif',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

export const textStyles = {
  h1: 'text-3xl font-bold text-primary-950 leading-tight',
  h2: 'text-2xl font-semibold text-primary-900 leading-tight',
  h3: 'text-xl font-semibold text-primary-900 leading-tight',
  h4: 'text-lg font-medium text-primary-800 leading-normal',
  body: 'text-base font-normal text-primary-800 leading-normal',
  bodySmall: 'text-sm font-normal text-primary-700 leading-normal',
  caption: 'text-xs font-normal text-primary-600 leading-normal',
  label: 'text-sm font-medium text-primary-700 leading-normal',
  mono: 'font-mono text-sm',
} as const
