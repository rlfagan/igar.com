'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CloudArrowUp, CheckCircle } from '@phosphor-icons/react'

interface DeploymentSectionProps {
  data: any
  onChange: (data: any) => void
}

export function DeploymentSection({ data, onChange }: DeploymentSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
          <CloudArrowUp weight="fill" className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-primary-950">Deployment & Infrastructure</h2>
          <p className="text-sm text-primary-600 mt-1">
            Describe where and how the model will be deployed
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Deployment Type *</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['Cloud', 'On-Premise', 'Hybrid'].map((type) => (
            <button
              key={type}
              className="p-4 border-2 border-neutral-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all"
            >
              <CloudArrowUp className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium text-sm">{type}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cloudProvider">Cloud Provider *</Label>
        <select
          id="cloudProvider"
          className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select provider...</option>
          <option value="aws">AWS</option>
          <option value="azure">Microsoft Azure</option>
          <option value="gcp">Google Cloud Platform</option>
          <option value="anthropic">Anthropic</option>
          <option value="openai">OpenAI</option>
        </select>
      </div>

      <Card className="border-emerald-300 bg-emerald-50">
        <CardContent className="pt-4">
          <div className="flex gap-2 items-start">
            <CheckCircle weight="fill" className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-emerald-900">DPA Auto-fetched</p>
              <p className="text-emerald-800 text-xs mt-1">
                AWS Data Processing Agreement found and verified. GDPR compliant.
              </p>
              <Button variant="link" className="h-auto p-0 text-xs mt-1">
                Review DPA →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="region">Region/Location *</Label>
        <select
          id="region"
          className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select region...</option>
          <option value="us-east-1">🇺🇸 US East (N. Virginia)</option>
          <option value="eu-west-1">🇪🇺 EU West (Ireland)</option>
          <option value="ap-southeast-1">🌏 AP Southeast (Singapore)</option>
        </select>
        <p className="text-xs text-primary-600">
          ℹ️ GDPR: EU personal data should be processed in EU regions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="encryption">Data Encryption at Rest *</Label>
          <select
            id="encryption"
            className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="aes-256">AES-256</option>
            <option value="aes-128">AES-128</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="transit">Encryption in Transit *</Label>
          <select
            id="transit"
            className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="tls-1.3">TLS 1.3</option>
            <option value="tls-1.2">TLS 1.2</option>
          </select>
        </div>
      </div>
    </div>
  )
}
