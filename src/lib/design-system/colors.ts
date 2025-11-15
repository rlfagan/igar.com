/**
 * Design System: Color Palette
 * Professional tech-legal aesthetic
 */

export const colors = {
  // Primary (Navy to Slate)
  primary: {
    950: '#0a0f1e',
    900: '#1e293b',
    800: '#334155',
    700: '#475569',
    600: '#64748b',
  },

  // Accent (Indigo)
  accent: {
    600: '#4f46e5',
    500: '#6366f1',
    400: '#818cf8',
  },

  // Risk Levels
  risk: {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#f59e0b',
    low: '#10b981',
    minimal: '#6ee7b7',
  },

  // Compliance Status
  compliance: {
    pass: '#059669',
    warning: '#d97706',
    fail: '#dc2626',
    pending: '#6366f1',
    info: '#0284c7',
  },

  // Neutrals
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    900: '#0f172a',
  },
} as const

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal'
export type ComplianceStatus = 'pass' | 'warning' | 'fail' | 'pending' | 'info'

export function getRiskColor(score: number): string {
  if (score >= 86) return colors.risk.critical
  if (score >= 61) return colors.risk.high
  if (score >= 31) return colors.risk.medium
  if (score >= 1) return colors.risk.low
  return colors.risk.minimal
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 86) return 'critical'
  if (score >= 61) return 'high'
  if (score >= 31) return 'medium'
  if (score >= 1) return 'low'
  return 'minimal'
}

export function getRiskLabel(score: number): string {
  if (score >= 86) return 'CRITICAL'
  if (score >= 61) return 'HIGH'
  if (score >= 31) return 'MEDIUM'
  if (score >= 1) return 'LOW'
  return 'MINIMAL'
}
