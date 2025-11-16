'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Cube,
  Upload,
  Link as LinkIcon,
  CloudArrowDown,
  Sparkle,
  CheckCircle,
} from '@phosphor-icons/react'

interface ModelSelectionProps {
  data: any
  onChange: (data: any) => void
}

export function ModelSelectionSection({ data, onChange }: ModelSelectionProps) {
  const [showAutofill, setShowAutofill] = useState(true)
  const modelOrigin = data?.model_origin || ''

  const handleModelOriginChange = (value: string) => {
    onChange({ ...data, model_origin: value })
  }

  const handleQuickImport = async (source: string) => {
    let url = ''
    let modelName = ''

    if (source === 'huggingface') {
      url = prompt('Enter HuggingFace model URL (e.g., https://huggingface.co/bert-base-uncased):') || ''
      if (!url) return
    } else if (source === 'openai') {
      modelName = prompt('Enter model name (e.g., gpt-4-turbo, gpt-3.5-turbo):') || ''
      if (!modelName) return
    } else if (source === 'anthropic') {
      modelName = prompt('Enter model name (e.g., claude-sonnet-4-5, claude-3-opus):') || ''
      if (!modelName) return
    }

    try {
      // Call backend API to fetch metadata
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9501'
      const response = await fetch(`${apiUrl}/api/models/fetch-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, source, modelName })
      })

      const result = await response.json()

      if (result.success) {
        // Merge fetched metadata with existing form data
        onChange({
          ...data,
          ...result.metadata
        })
        setShowAutofill(false)
        alert(`✅ Imported model: ${result.metadata.model_name}`)
      } else {
        alert(`❌ Failed to fetch metadata: ${result.error}`)
      }
    } catch (error) {
      console.error('Error fetching metadata:', error)
      alert('❌ Failed to fetch metadata. Please try again.')
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const handleAutofillFromURL = () => {
    const url = (document.getElementById('modelCard') as HTMLInputElement)?.value
    if (!url) {
      alert('Please enter a Model Card URL first')
      return
    }
    handleQuickImport('huggingface')
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Cube weight="fill" className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-primary-950">Model Selection</h2>
          <p className="text-sm text-primary-600 mt-1">
            Select or describe the AI model for this submission
          </p>
        </div>
      </div>

      {/* Autofill Panel */}
      {showAutofill && (
        <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkle weight="fill" className="w-4 h-4 text-indigo-600" />
              Quick Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-primary-600 mb-3">
              Import model metadata automatically from:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start" onClick={() => handleQuickImport('huggingface')}>
                <LinkIcon className="w-4 h-4 mr-2" />
                HuggingFace URL
              </Button>
              <Button variant="outline" size="sm" className="justify-start" onClick={() => alert('Upload model card file (coming soon)')}>
                <Upload className="w-4 h-4 mr-2" />
                Model Card File
              </Button>
              <Button variant="outline" size="sm" className="justify-start" onClick={() => {
                const provider = prompt('Enter provider (openai or anthropic):')?.toLowerCase()
                if (provider === 'openai' || provider === 'anthropic') {
                  handleQuickImport(provider)
                } else if (provider) {
                  alert('Please enter either "openai" or "anthropic"')
                }
              }}>
                <CloudArrowDown className="w-4 h-4 mr-2" />
                OpenAI/Anthropic API
              </Button>
              <Button variant="outline" size="sm" className="justify-start" onClick={() => alert('SBOM/AIBOM import (coming soon)')}>
                <Upload className="w-4 h-4 mr-2" />
                SBOM/AIBOM
              </Button>
            </div>
            <button
              onClick={() => setShowAutofill(false)}
              className="text-xs text-primary-600 hover:text-primary-900 mt-3 underline"
            >
              Skip and enter manually
            </button>
          </CardContent>
        </Card>
      )}

      {/* Model Origin Selection */}
      <div className="space-y-3">
        <Label>Model Origin *</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'commercial', label: 'Commercial API', desc: 'OpenAI, Anthropic, Google' },
            { value: 'opensource', label: 'Open Source', desc: 'Llama, Mistral, Falcon' },
            { value: 'cots', label: 'COTS Product', desc: 'Salesforce, Adobe, ServiceNow' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleModelOriginChange(option.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                modelOrigin === option.value
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="font-medium text-primary-900 mb-1">{option.label}</div>
              <div className="text-xs text-primary-600">{option.desc}</div>
              {modelOrigin === option.value && (
                <CheckCircle weight="fill" className="w-5 h-5 text-indigo-600 mt-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional: Commercial API */}
      {modelOrigin === 'commercial' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="vendor">Model Vendor *</Label>
            <select
              id="vendor"
              className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select vendor...</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
              <option value="meta">Meta</option>
              <option value="cohere">Cohere</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelType">Model Type *</Label>
            <select
              id="modelType"
              className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select type...</option>
              <option value="llm">Large Language Model (LLM)</option>
              <option value="vision">Vision Model</option>
              <option value="audio">Audio Model</option>
              <option value="multimodal">Multimodal</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelName">Model Name *</Label>
            <Input
              id="modelName"
              placeholder="e.g., gpt-4-turbo, claude-sonnet-4-5"
              className="w-full"
            />
            <p className="text-xs text-primary-600">
              The specific model identifier you'll be using
            </p>
          </div>
        </>
      )}

      {/* Conditional: Open Source */}
      {modelOrigin === 'opensource' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="ossVendor">OSS Provider *</Label>
            <select
              id="ossVendor"
              value={data?.vendor || ''}
              onChange={(e) => handleFieldChange('vendor', e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select provider...</option>
              <option value="meta">Meta</option>
              <option value="mistral">Mistral AI</option>
              <option value="huggingface">HuggingFace</option>
              <option value="stability">Stability AI</option>
              <option value="eleutherai">EleutherAI</option>
              <option value="databricks">Databricks (Mosaic)</option>
              <option value="tii">Technology Innovation Institute (Falcon)</option>
              <option value="bigscience">BigScience (BLOOM)</option>
              <option value="cerebras">Cerebras</option>
              <option value="community">Community/Independent</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ossModel">Model/Library Name *</Label>
            <Input
              id="ossModel"
              value={data?.model_name || ''}
              onChange={(e) => handleFieldChange('model_name', e.target.value)}
              placeholder="e.g., Llama 3, Mistral 7B, BERT, GPT-J"
              className="w-full"
            />
            <p className="text-xs text-primary-600">
              The name of the open source model or library
            </p>
          </div>
        </>
      )}

      {/* Conditional: COTS Product */}
      {modelOrigin === 'cots' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="cotsVendor">COTS Vendor *</Label>
            <select
              id="cotsVendor"
              value={data?.vendor || ''}
              onChange={(e) => handleFieldChange('vendor', e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select vendor...</option>
              <option value="salesforce">Salesforce Einstein</option>
              <option value="microsoft">Microsoft Copilot</option>
              <option value="oracle">Oracle AI</option>
              <option value="sap">SAP AI</option>
              <option value="workday">Workday AI</option>
              <option value="servicenow">ServiceNow Now Assist</option>
              <option value="adobe">Adobe Sensei</option>
              <option value="ibm">IBM Watson</option>
              <option value="aws">AWS SageMaker</option>
              <option value="google">Google Vertex AI</option>
              <option value="azure">Azure AI</option>
              <option value="databricks">Databricks AI</option>
              <option value="snowflake">Snowflake Cortex</option>
              <option value="hubspot">HubSpot AI</option>
              <option value="zendesk">Zendesk AI</option>
              <option value="intercom">Intercom AI</option>
              <option value="slack">Slack AI</option>
              <option value="zoom">Zoom AI Companion</option>
              <option value="notion">Notion AI</option>
              <option value="monday">Monday.com AI</option>
              <option value="atlassian">Atlassian Intelligence</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cotsProduct">Product Name *</Label>
            <Input
              id="cotsProduct"
              placeholder="e.g., Einstein Prediction Builder, Copilot for Sales"
              className="w-full"
            />
          </div>

          <Card className="border-sky-200 bg-sky-50">
            <CardContent className="pt-4">
              <div className="flex gap-2 text-xs text-sky-900">
                <span>ℹ️</span>
                <div>
                  <p className="font-medium mb-1">COTS Product Detected</p>
                  <p className="text-sky-700">
                    We'll simplify the form and focus on vendor evaluation, SLA terms, and data
                    processing agreements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Common Fields */}
      {modelOrigin && (
        <>
          <div className="space-y-2">
            <Label htmlFor="version">Version / Release</Label>
            <Input
              id="version"
              placeholder="e.g., v1.5, 2024-04-01, latest"
              className="w-full"
            />
          </div>

          {modelOrigin !== 'cots' && (
            <div className="space-y-2">
              <Label htmlFor="modelCard">Model Card URL</Label>
              <div className="flex gap-2">
                <Input
                  id="modelCard"
                  type="url"
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleAutofillFromURL}>
                  <CloudArrowDown className="w-4 h-4 mr-2" />
                  Validate
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="license">License Type</Label>
            <select
              id="license"
              className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select license...</option>
              <option value="commercial">Commercial (Proprietary)</option>
              <option value="apache-2.0">Apache 2.0</option>
              <option value="mit">MIT</option>
              <option value="gpl-3.0">GPL 3.0</option>
              <option value="cc-by-4.0">CC BY 4.0</option>
              <option value="other">Other</option>
            </select>
          </div>
        </>
      )}

      {/* Progress Indicator */}
      {modelOrigin && (
        <div className="pt-4">
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle weight="fill" className="w-5 h-5" />
            <span>Section 1 progress: 60% complete</span>
          </div>
        </div>
      )}
    </div>
  )
}
