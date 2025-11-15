'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Target, Sparkle, WarningCircle } from '@phosphor-icons/react'

interface UseCaseSectionProps {
  data: any
  onChange: (data: any) => void
}

export function UseCaseSection({ data, onChange }: UseCaseSectionProps) {
  const [showHighRiskWarning, setShowHighRiskWarning] = useState(false)
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])

  const highRiskCategories = [
    'credit_scoring',
    'employment',
    'education',
    'law_enforcement',
    'healthcare',
  ]

  const handleUseCaseToggle = (useCase: string) => {
    const updated = selectedUseCases.includes(useCase)
      ? selectedUseCases.filter((u) => u !== useCase)
      : [...selectedUseCases, useCase]

    setSelectedUseCases(updated)
    setShowHighRiskWarning(updated.some((u) => highRiskCategories.includes(u)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
          <Target weight="fill" className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-primary-950">Use Case & Purpose</h2>
          <p className="text-sm text-primary-600 mt-1">
            Describe how and why you will use this AI model
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="useCaseName">Use Case Name *</Label>
        <div className="flex gap-2">
          <Input
            id="useCaseName"
            placeholder="e.g., Customer Support AI Assistant"
            className="flex-1"
          />
          <Button variant="outline" size="sm">
            <Sparkle weight="fill" className="w-4 h-4 mr-2" />
            AI Generate
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Detailed Description *</Label>
        <textarea
          id="description"
          rows={5}
          className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Describe the AI system's purpose, functionality, and expected outcomes..."
        />
        <Button variant="outline" size="sm">
          <Sparkle weight="fill" className="w-4 h-4 mr-2" />
          Write for me
        </Button>
      </div>

      <div className="space-y-3">
        <Label>System Used For (Select all that apply) *</Label>
        <p className="text-xs text-primary-600">
          This determines EU AI Act risk classification
        </p>
        <div className="space-y-2">
          {[
            { value: 'credit_scoring', label: 'Credit scoring / Financial underwriting' },
            { value: 'employment', label: 'Employment decisions (hiring, evaluation)' },
            { value: 'education', label: 'Educational assessment' },
            { value: 'law_enforcement', label: 'Law enforcement / Justice system' },
            { value: 'healthcare', label: 'Healthcare / Medical diagnosis' },
            { value: 'customer_service', label: 'Customer service / Support' },
            { value: 'content_moderation', label: 'Content moderation' },
            { value: 'none', label: 'None of the above' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded">
              <input
                type="checkbox"
                checked={selectedUseCases.includes(option.value)}
                onChange={() => handleUseCaseToggle(option.value)}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-sm text-primary-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {showHighRiskWarning && (
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <WarningCircle weight="fill" className="w-6 h-6 text-orange-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-orange-900 mb-1">HIGH-RISK AI SYSTEM</p>
                <p className="text-sm text-orange-800">
                  Your use case triggers EU AI Act high-risk requirements. This will require:
                </p>
                <ul className="text-sm text-orange-800 list-disc list-inside mt-2 space-y-1">
                  <li>Conformity assessment (Annex IV)</li>
                  <li>Risk management system</li>
                  <li>Fundamental rights impact assessment</li>
                  <li>Post-market monitoring plan</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expectedUsers">Expected Users per Day</Label>
          <Input
            id="expectedUsers"
            type="number"
            placeholder="e.g., 1000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="affectedPop">Affected Population</Label>
          <select
            id="affectedPop"
            className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select range...</option>
            <option value="<100">&lt;100 people</option>
            <option value="100-1k">100-1,000</option>
            <option value="1k-10k">1,000-10,000</option>
            <option value=">10k">&gt;10,000</option>
          </select>
        </div>
      </div>
    </div>
  )
}
