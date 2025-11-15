'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RiskBadge } from '@/components/ui/risk-badge'
import { ShieldWarning, Sparkle } from '@phosphor-icons/react'

interface SafetySectionProps {
  data: any
  onChange: (data: any) => void
}

export function SafetySection({ data, onChange }: SafetySectionProps) {
  const riskScore = 68

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
          <ShieldWarning weight="fill" className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-primary-950">Safety, Risk & Compliance</h2>
          <p className="text-sm text-primary-600 mt-1">
            Assess risks and document safety measures
          </p>
        </div>
      </div>

      {/* Live Risk Dashboard */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader>
          <CardTitle className="text-base">Live Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-600">Overall Risk</span>
              <RiskBadge score={riskScore} size="md" />
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div
                className="bg-orange-600 h-3 rounded-full transition-all"
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <div className="text-xs text-primary-600 space-y-1">
              <p>• Data Governance: <span className="font-medium">75 (High)</span></p>
              <p>• Safety Alignment: <span className="font-medium">60 (Medium)</span></p>
              <p>• Compliance: <span className="font-medium">80 (High)</span></p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Detailed Breakdown →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* EU AI Act Classification */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-red-600 text-white rounded flex items-center justify-center text-xs font-bold">
              !</div>
            <div className="flex-1">
              <p className="font-semibold text-red-900 mb-1">HIGH-RISK AI SYSTEM</p>
              <p className="text-xs text-red-800 mb-2">Based on: Employment decisions, Class 3 modification, 5,000+ users/day</p>
              <div className="text-xs text-red-800 space-y-1">
                <p>✓ Conformity assessment required</p>
                <p>✓ Risk management system required</p>
                <p>✓ Post-market monitoring plan required</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="potentialHarms">Potential Harms</Label>
        <textarea
          id="potentialHarms"
          rows={3}
          className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Describe potential negative outcomes or risks..."
        />
        <Button variant="outline" size="sm">
          <Sparkle weight="fill" className="w-4 h-4 mr-2" />
          AI: Identify potential harms
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mitigations">Mitigation Measures</Label>
        <textarea
          id="mitigations"
          rows={3}
          className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Describe how you will mitigate identified risks..."
        />
        <Button variant="outline" size="sm">
          <Sparkle weight="fill" className="w-4 h-4 mr-2" />
          AI: Suggest mitigations
        </Button>
      </div>

      <div className="space-y-3">
        <Label>Safety Tests Conducted</Label>
        <div className="space-y-2">
          {[
            'Adversarial robustness testing',
            'Bias and fairness evaluation',
            'Red-team testing',
            'PII leakage testing',
          ].map((test) => (
            <label key={test} className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">{test}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
