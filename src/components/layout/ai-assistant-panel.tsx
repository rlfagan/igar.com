'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiskBadge } from '@/components/ui/risk-badge'
import {
  Sparkle,
  Lightbulb,
  Info,
  ChatsCircle,
  X,
  CaretDown,
  CaretUp,
} from '@phosphor-icons/react'

interface Suggestion {
  id: string
  type: 'autofill' | 'compliance' | 'recommendation' | 'warning'
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface AIAssistantPanelProps {
  currentSection?: string
  suggestions?: Suggestion[]
  riskScore?: number
  complianceInfo?: {
    standard: string
    clause: string
    description: string
  }
  onAskAI?: (question: string) => void
  className?: string
}

export function AIAssistantPanel({
  currentSection,
  suggestions = [],
  riskScore,
  complianceInfo,
  onAskAI,
  className = '',
}: AIAssistantPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [showChat, setShowChat] = useState(false)

  const iconMap = {
    autofill: <Sparkle weight="fill" className="w-4 h-4 text-indigo-600" />,
    compliance: <Info weight="fill" className="w-4 h-4 text-sky-600" />,
    recommendation: <Lightbulb weight="fill" className="w-4 h-4 text-amber-600" />,
    warning: <Info weight="fill" className="w-4 h-4 text-orange-600" />,
  }

  if (isMinimized) {
    return (
      <div className={`fixed top-24 right-4 z-40 ${className}`}>
        <Button
          onClick={() => setIsMinimized(false)}
          variant="default"
          size="sm"
          className="shadow-lg"
        >
          <Sparkle weight="fill" className="w-4 h-4 mr-2" />
          AI Assistant
          <CaretUp className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`w-80 space-y-4 ${className}`}>
      {/* Header */}
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkle weight="fill" className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-base">AI Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0"
            >
              <CaretDown className="w-4 h-4" />
            </Button>
          </div>
          {currentSection && (
            <p className="text-xs text-primary-600 mt-1">
              Context: {currentSection}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb weight="fill" className="w-4 h-4 text-amber-600" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="text-sm">
                <div className="flex items-start gap-2">
                  {iconMap[suggestion.type]}
                  <div className="flex-1">
                    <p className="font-medium text-primary-900">{suggestion.title}</p>
                    <p className="text-xs text-primary-600 mt-0.5">
                      {suggestion.description}
                    </p>
                    {suggestion.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-7 text-xs"
                        onClick={suggestion.action.onClick}
                      >
                        {suggestion.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Compliance Info */}
      {complianceInfo && (
        <Card className="border-sky-200 bg-sky-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info weight="fill" className="w-4 h-4 text-sky-600" />
              Compliance Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium text-sky-900">
                {complianceInfo.standard} {complianceInfo.clause}
              </p>
              <p className="text-xs text-sky-700 mt-1">
                {complianceInfo.description}
              </p>
              <Button size="sm" variant="link" className="mt-2 h-auto p-0 text-xs">
                Learn more →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Preview */}
      {riskScore !== undefined && (
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Risk Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-primary-600 mb-2">Current Score</p>
                <RiskBadge score={riskScore} size="md" />
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    riskScore >= 86
                      ? 'bg-red-600'
                      : riskScore >= 61
                      ? 'bg-orange-600'
                      : riskScore >= 31
                      ? 'bg-amber-600'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs">
                Detailed breakdown →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ask AI */}
      <Card className="border-indigo-200">
        <CardHeader className="pb-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-full flex items-center justify-between text-left"
          >
            <CardTitle className="text-sm flex items-center gap-2">
              <ChatsCircle weight="fill" className="w-4 h-4 text-indigo-600" />
              Ask AI Assistant
            </CardTitle>
            {showChat ? <CaretUp className="w-4 h-4" /> : <CaretDown className="w-4 h-4" />}
          </button>
        </CardHeader>
        {showChat && (
          <CardContent>
            <div className="space-y-2">
              <textarea
                className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Ask about ISO 42001, EU AI Act, or any compliance question..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
              />
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  if (onAskAI && aiQuestion.trim()) {
                    onAskAI(aiQuestion)
                    setAiQuestion('')
                  }
                }}
                disabled={!aiQuestion.trim()}
              >
                <Sparkle weight="fill" className="w-4 h-4 mr-2" />
                Ask
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Help */}
      <div className="text-xs text-center text-primary-600">
        <button className="hover:text-primary-900 underline">
          Hide AI Assistant
        </button>
      </div>
    </div>
  )
}
