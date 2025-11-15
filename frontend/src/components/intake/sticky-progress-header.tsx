'use client'

import React from 'react'
import { RiskBadge } from '@/components/ui/risk-badge'
import { CheckCircle, Circle, Clock } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface Section {
  id: string
  number: number
  title: string
  status: 'complete' | 'in-progress' | 'pending'
}

interface StickyProgressHeaderProps {
  sections: Section[]
  currentSection: number
  onSectionClick: (sectionNumber: number) => void
  riskScore?: number
  completionPercentage: number
  lastSaved?: Date
  autoSaveEnabled?: boolean
  className?: string
}

export function StickyProgressHeader({
  sections,
  currentSection,
  onSectionClick,
  riskScore,
  completionPercentage,
  lastSaved,
  autoSaveEnabled = true,
  className,
}: StickyProgressHeaderProps) {
  const statusIcons = {
    complete: <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600" />,
    'in-progress': <Circle weight="fill" className="w-4 h-4 text-indigo-600" />,
    pending: <Circle weight="regular" className="w-4 h-4 text-neutral-400" />,
  }

  const completedCount = sections.filter((s) => s.status === 'complete').length

  return (
    <div className={cn('sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm', className)}>
      <div className="max-w-[1440px] mx-auto px-6 py-3">
        {/* Top Row: Progress Bar & Meta Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center justify-between text-xs text-primary-600 mb-1">
              <span className="font-medium">
                Progress: {completedCount}/{sections.length} sections
              </span>
              <span className="font-semibold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-6">
            {/* Risk Score */}
            {riskScore !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary-600">Risk:</span>
                <RiskBadge score={riskScore} size="sm" showScore={false} />
              </div>
            )}

            {/* Auto-save Status */}
            {autoSaveEnabled && (
              <div className="flex items-center gap-2 text-xs text-primary-600">
                <Clock className="w-3 h-3" />
                {lastSaved ? (
                  <span>Saved {formatTimeAgo(lastSaved)}</span>
                ) : (
                  <span>Saving...</span>
                )}
              </div>
            )}

            {/* Estimate */}
            <div className="text-xs text-primary-600">
              ~{Math.ceil((7 - completedCount) * 2)} min remaining
            </div>
          </div>
        </div>

        {/* Bottom Row: Section Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-2 px-2">
          {sections.map((section) => {
            const isActive = section.number === currentSection
            const isClickable = section.status !== 'pending' || section.number === currentSection

            return (
              <button
                key={section.id}
                onClick={() => isClickable && onSectionClick(section.number)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  'hover:bg-neutral-100',
                  isActive && 'bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200',
                  !isActive && section.status === 'complete' && 'text-emerald-700',
                  !isActive && section.status === 'in-progress' && 'text-primary-900',
                  !isActive && section.status === 'pending' && 'text-primary-400',
                  !isClickable && 'cursor-not-allowed opacity-50'
                )}
              >
                {statusIcons[section.status]}
                <span className="text-xs">{section.number}</span>
                <span className="hidden sm:inline">{section.title}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 120) return '1m ago'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return 'recently'
}
