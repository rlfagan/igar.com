'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  WarningCircle,
  XCircle,
  Circle,
  CaretDown,
  CaretRight,
} from '@phosphor-icons/react'

export interface ValidationItem {
  id: string
  label: string
  status: 'complete' | 'warning' | 'error' | 'pending'
  onClick?: () => void
}

export interface ValidationSection {
  id: string
  title: string
  items: ValidationItem[]
  isExpanded?: boolean
}

interface ValidationChecklistProps {
  sections: ValidationSection[]
  totalItems: number
  completedItems: number
  className?: string
}

export function ValidationChecklist({
  sections,
  totalItems,
  completedItems,
  className = '',
}: ValidationChecklistProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.filter((s) => s.isExpanded).map((s) => s.id))
  )

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const statusIcons = {
    complete: <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600" />,
    warning: <WarningCircle weight="fill" className="w-4 h-4 text-amber-600" />,
    error: <XCircle weight="fill" className="w-4 h-4 text-red-600" />,
    pending: <Circle weight="regular" className="w-4 h-4 text-neutral-400" />,
  }

  return (
    <div className={`w-60 space-y-4 ${className}`}>
      <Card className="border-neutral-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Validation Checklist</CardTitle>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-primary-600 mb-1">
              <span>Overall Progress</span>
              <span className="font-medium">
                {completedItems}/{totalItems}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-primary-600 mt-1">{completionPercentage}% complete</p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-200">
            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.id)
              const sectionComplete = section.items.filter((i) => i.status === 'complete').length
              const sectionTotal = section.items.length

              return (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <CaretDown weight="bold" className="w-3 h-3 text-primary-600" />
                      ) : (
                        <CaretRight weight="bold" className="w-3 h-3 text-primary-600" />
                      )}
                      <span className="text-sm font-medium text-primary-900">
                        {section.title}
                      </span>
                    </div>
                    <span className="text-xs text-primary-600">
                      {sectionComplete}/{sectionTotal}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-2 space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.onClick}
                          className="w-full flex items-start gap-2 py-1.5 px-2 hover:bg-neutral-50 rounded text-left transition-colors"
                        >
                          <span className="flex-shrink-0 mt-0.5">
                            {statusIcons[item.status]}
                          </span>
                          <span className="text-xs text-primary-700 flex-1">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-center text-primary-600">
        <button className="hover:text-primary-900 underline">
          Show all {totalItems} items
        </button>
      </div>
    </div>
  )
}
