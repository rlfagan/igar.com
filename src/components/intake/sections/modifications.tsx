'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { GitBranch, Cube, ChatText, MagnifyingGlass, Lightning, Shield, Code } from '@phosphor-icons/react'

interface ModificationsSectionProps {
  data: any
  onChange: (data: any) => void
}

export function ModificationsSection({ data, onChange }: ModificationsSectionProps) {
  const [selectedClass, setSelectedClass] = useState<number | null>(null)

  const modificationClasses = [
    { class: 0, name: 'Pure Base Model', risk: 'Low', icon: <Cube weight="fill" /> },
    { class: 1, name: 'Prompt Engineering', risk: 'Low', icon: <ChatText weight="fill" /> },
    { class: 2, name: 'RAG', risk: 'Medium', icon: <MagnifyingGlass weight="fill" /> },
    { class: 3, name: 'LoRA/PEFT', risk: 'Medium-High', icon: <GitBranch weight="fill" /> },
    { class: 4, name: 'Full Fine-Tuning', risk: 'High', icon: <Lightning weight="fill" /> },
    { class: 5, name: 'Safety Alignment', risk: 'Medium-High', icon: <Shield weight="fill" /> },
    { class: 6, name: 'Custom Tokenizer', risk: 'Very High', icon: <Code weight="fill" /> },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Very High':
      case 'High':
        return 'border-red-300 bg-red-50'
      case 'Medium-High':
      case 'Medium':
        return 'border-amber-300 bg-amber-50'
      default:
        return 'border-emerald-300 bg-emerald-50'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
          <GitBranch weight="fill" className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-primary-950">Model Modifications</h2>
          <p className="text-sm text-primary-600 mt-1">
            Specify how you are modifying the base model
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-primary-900">
          Select Modification Class (ISO/IEC 42001) *
        </p>
        {modificationClasses.map((modClass) => (
          <button
            key={modClass.class}
            onClick={() => setSelectedClass(modClass.class)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
              selectedClass === modClass.class
                ? `${getRiskColor(modClass.risk)} border-2`
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                {React.cloneElement(modClass.icon, { className: 'w-6 h-6' })}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-primary-950">
                    Class {modClass.class}: {modClass.name}
                  </h3>
                  <Badge
                    variant={
                      modClass.risk === 'Very High' || modClass.risk === 'High'
                        ? 'error'
                        : modClass.risk.includes('Medium')
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {modClass.risk} Risk
                  </Badge>
                </div>
                <p className="text-xs text-primary-600">
                  {modClass.class === 0 && 'Using pre-trained model without modifications'}
                  {modClass.class === 1 && 'System prompts or prompt templates only'}
                  {modClass.class === 2 && 'Retrieval-Augmented Generation'}
                  {modClass.class === 3 && 'Parameter-efficient fine-tuning (adapters)'}
                  {modClass.class === 4 && 'Complete model weight modification'}
                  {modClass.class === 5 && 'RLHF, DPO, Constitutional AI'}
                  {modClass.class === 6 && 'Fundamental model architecture change'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedClass !== null && selectedClass >= 4 && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-4">
            <p className="font-semibold text-red-900 mb-2">HIGH-RISK MODIFICATION</p>
            <p className="text-sm text-red-800">
              Class {selectedClass} requires extensive documentation, conformity assessment,
              and multiple levels of approval.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
