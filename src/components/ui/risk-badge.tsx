import React from 'react'
import { Badge } from './badge'
import { ShieldSlash, WarningCircle, Warning, ShieldCheck, CheckCircle } from '@phosphor-icons/react'
import { getRiskLevel, getRiskLabel } from '@/lib/design-system/colors'

interface RiskBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showScore?: boolean
  className?: string
}

export function RiskBadge({ score, size = 'md', showIcon = true, showScore = true, className }: RiskBadgeProps) {
  const level = getRiskLevel(score)
  const label = getRiskLabel(score)

  const icons = {
    critical: <ShieldSlash weight="fill" className="w-4 h-4" />,
    high: <WarningCircle weight="fill" className="w-4 h-4" />,
    medium: <Warning weight="fill" className="w-4 h-4" />,
    low: <ShieldCheck weight="fill" className="w-4 h-4" />,
    minimal: <CheckCircle weight="fill" className="w-4 h-4" />,
  }

  const variants = {
    critical: 'risk-critical',
    high: 'risk-high',
    medium: 'risk-medium',
    low: 'risk-low',
    minimal: 'risk-minimal',
  } as const

  return (
    <Badge
      variant={variants[level]}
      size={size}
      icon={showIcon ? icons[level] : undefined}
      className={className}
    >
      {showScore && `${score}/100`} {label}
    </Badge>
  )
}

interface ComplianceBadgeProps {
  status: 'pass' | 'pending' | 'warning' | 'fail'
  label: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export function ComplianceBadge({ status, label, size = 'md', showIcon = true, className }: ComplianceBadgeProps) {
  const icons = {
    pass: <CheckCircle weight="fill" className="w-4 h-4" />,
    pending: <WarningCircle weight="regular" className="w-4 h-4" />,
    warning: <Warning weight="fill" className="w-4 h-4" />,
    fail: <ShieldSlash weight="fill" className="w-4 h-4" />,
  }

  const variants = {
    pass: 'compliance-pass',
    pending: 'compliance-pending',
    warning: 'compliance-warning',
    fail: 'compliance-fail',
  } as const

  return (
    <Badge
      variant={variants[status]}
      size={size}
      icon={showIcon ? icons[status] : undefined}
      className={className}
    >
      {label}
    </Badge>
  )
}
