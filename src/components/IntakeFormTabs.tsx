'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, CheckCircle, Upload, FileText, X, Shield } from 'lucide-react'

interface IntakeFormTabsProps {
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
}

export default function IntakeFormTabs({ onSubmit, isSubmitting }: IntakeFormTabsProps) {
  const [currentTab, setCurrentTab] = useState('section1')
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [referenceData, setReferenceData] = useState<any>(null)

  const [formData, setFormData] = useState({
    // Section 1
    project_name: '',
    model_name: '',
    model_type: '',
    model_type_other: '',
    model_origin: '',
    model_origin_name: '',
    model_origin_version: '',
    model_origin_url: '',
    vendor_name: '',

    // Section 2
    intended_purpose: '',
    business_impact_category: '',
    regulated_decisions: [] as string[],
    human_in_loop: false,

    // Section 3
    data_sources: '',
    contains_customer_data: '',
    labels_modified: false,
    labels_description: '',

    // Section 4
    modifications: [] as string[],
    training_config_location: '',

    // Section 5
    deployment_location: '',
    deployment_location_other: '',
    cloud_provider: '',
    access_teams: '',
    input_format: '',
    output_format: '',

    // Section 6
    sees_sensitive_data: '',
    safety_features: [] as string[],
    known_risks: '',
  })

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  // Filtered models state (for cascading dropdown based on model_type)
  const [filteredModels, setFilteredModels] = useState<any[]>([])

  useEffect(() => {
    // Fetch reference data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reference/all`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReferenceData(data.data)
        }
      })
      .catch(err => console.error('Failed to fetch reference data:', err))
  }, [])

  // Fetch filtered models when model_type or model_origin changes
  useEffect(() => {
    const fetchFilteredModels = async () => {
      if (!formData.model_type || !formData.model_origin) {
        setFilteredModels([])
        return
      }

      const category = formData.model_origin === 'vendor' ? 'vendor' :
                      formData.model_origin === 'open_source' ? 'open_source' : null

      if (!category) {
        setFilteredModels([])
        return
      }

      try {
        const params = new URLSearchParams()
        params.append('type', formData.model_type)
        params.append('category', category)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reference/models?${params.toString()}`
        )
        const data = await response.json()

        if (data.success) {
          setFilteredModels(data.models)
        }
      } catch (error) {
        console.error('Failed to fetch filtered models:', error)
      }
    }

    fetchFilteredModels()
  }, [formData.model_type, formData.model_origin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Include uploaded file IDs in submission
    const submissionData = {
      ...formData,
      artifacts: uploadedFiles.map(f => f.id)
    }
    await onSubmit(submissionData)
  }

  const handleCheckboxChange = (field: 'regulated_decisions' | 'modifications' | 'safety_features', value: string) => {
    setFormData(prev => {
      let newArray: string[]

      // Special handling for "None of the above" - make it mutually exclusive
      if (field === 'regulated_decisions') {
        if (value === 'None of the above') {
          // If clicking "None of the above", clear all other selections
          newArray = prev[field].includes(value) ? [] : ['None of the above']
        } else {
          // If clicking any other option, remove "None of the above" if present
          newArray = prev[field].includes(value)
            ? prev[field].filter((item: string) => item !== value)
            : [...prev[field].filter((item: string) => item !== 'None of the above'), value]
        }
      } else {
        // Standard toggle for other fields
        newArray = prev[field].includes(value)
          ? prev[field].filter((item: string) => item !== value)
          : [...prev[field], value]
      }

      return {
        ...prev,
        [field]: newArray
      }
    })
  }

  const markSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section])
    }
  }

  const goToNextSection = (nextSection: string) => {
    setCurrentTab(nextSection)
  }

  const handleFileUpload = async (file: File, artifactType: string, description: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('artifactType', artifactType)
    formData.append('description', description)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()

      setUploadedFiles(prev => [...prev, {
        id: result.artifactId,
        file_name: file.name,
        file_path: result.filePath,
        file_type: file.type,
        artifact_type: artifactType,
        description: description,
      }])

      return result
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }

  const removeUploadedFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="section1" className="relative">
            {completedSections.includes('section1') && (
              <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-green-600" />
            )}
            1. Model
          </TabsTrigger>
          <TabsTrigger value="section2">
            {completedSections.includes('section2') && (
              <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-green-600" />
            )}
            2. Use
          </TabsTrigger>
          <TabsTrigger value="section3">
            {completedSections.includes('section3') && (
              <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-green-600" />
            )}
            3. Data
          </TabsTrigger>
          <TabsTrigger value="section4">
            {completedSections.includes('section4') && (
              <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-green-600" />
            )}
            4. Mods
          </TabsTrigger>
          <TabsTrigger value="section5">
            {completedSections.includes('section5') && (
              <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-green-600" />
            )}
            5. Deploy
          </TabsTrigger>
          <TabsTrigger value="section6">
            {completedSections.includes('section6') && (
              <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-green-600" />
            )}
            6. Safety
          </TabsTrigger>
          <TabsTrigger value="section7">
            {completedSections.includes('section7') && (
              <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-green-600" />
            )}
            7. Files
          </TabsTrigger>
        </TabsList>

        {/* Section 1: Project & Model Overview */}
        <TabsContent value="section1">
          <Card>
            <CardHeader>
              <CardTitle>Section 1 — Project & Model Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* FIRST QUESTION: Is this COTS, OSS, or Homegrown? */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <Label htmlFor="model_origin" className="text-lg font-semibold">
                  Is this a COTS tool, Open Source, or Homegrown? *
                </Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Please select how you're obtaining this AI/ML model
                </p>
                <select
                  id="model_origin"
                  required
                  className="w-full p-3 border-2 border-blue-300 rounded-md text-base"
                  value={formData.model_origin}
                  onChange={(e) => setFormData({ ...formData, model_origin: e.target.value })}
                >
                  <option value="">Select model origin...</option>
                  <option value="vendor">COTS - Vendor-provided model (e.g., OpenAI, Anthropic, AWS)</option>
                  <option value="open_source">Open Source - Using an open-source model (e.g., Llama, Mistral)</option>
                  <option value="in_house">Homegrown - In-house trained foundation model</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project_name">Project Name *</Label>
                  <Input
                    id="project_name"
                    required
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    placeholder="e.g., Customer Service Automation"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your internal project identifier</p>
                </div>

                <div>
                  <Label htmlFor="model_name">Your Internal System Name *</Label>
                  <Input
                    id="model_name"
                    required
                    value={formData.model_name}
                    onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                    placeholder="e.g., fraud-detector-prod, support-bot-v2"
                  />
                  <p className="text-xs text-gray-500 mt-1">What you call this deployment internally (not the base model name)</p>
                </div>
              </div>

              <div>
                <Label htmlFor="model_type">Model Type *</Label>
                <select
                  id="model_type"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.model_type}
                  onChange={(e) => setFormData({ ...formData, model_type: e.target.value })}
                >
                  <option value="">Select model type</option>
                  <option value="llm">Large Language Model (LLM)</option>
                  <option value="embedding">Embedding Model</option>
                  <option value="classification">Classification Model</option>
                  <option value="regression">Regression Model</option>
                  <option value="fraud_detection">Fraud Detection Model</option>
                  <option value="recommendation">Recommendation Model</option>
                  <option value="vision">Vision / Image Model</option>
                  <option value="multimodal">Multi-modal Model</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {formData.model_type === 'other' && (
                <div>
                  <Label htmlFor="model_type_other">Specify Model Type</Label>
                  <Input
                    id="model_type_other"
                    value={formData.model_type_other}
                    onChange={(e) => setFormData({ ...formData, model_type_other: e.target.value })}
                  />
                </div>
              )}

              {formData.model_origin === 'vendor' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="vendor_name">Vendor/Provider Name *</Label>
                    <Input
                      id="vendor_name"
                      value={formData.vendor_name}
                      onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                      placeholder="Start typing to see suggestions..."
                      list="vendor-suggestions"
                    />
                    {referenceData && (
                      <>
                        <datalist id="vendor-suggestions">
                          {referenceData.vendors.map((vendor: any) => (
                            <option key={vendor.id} value={vendor.name} />
                          ))}
                        </datalist>
                        <div className="mt-2 text-xs text-gray-600">
                          <p className="font-medium mb-1">Common vendors:</p>
                          <div className="flex flex-wrap gap-1">
                            {referenceData.vendors.slice(0, 8).map((vendor: any) => (
                              <button
                                key={vendor.id}
                                type="button"
                                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs"
                                onClick={() => setFormData({ ...formData, vendor_name: vendor.name })}
                              >
                                {vendor.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="model_origin_name">Base Model Name</Label>
                      <Input
                        id="model_origin_name"
                        value={formData.model_origin_name}
                        onChange={(e) => {
                          const selectedName = e.target.value
                          setFormData({ ...formData, model_origin_name: selectedName })
                        }}
                        onBlur={(e) => {
                          // Auto-fill version, URL, and Section 2 fields when field loses focus
                          const selectedName = e.target.value
                          if (referenceData && referenceData.models) {
                            const matchedModel = referenceData.models.find(
                              (m: any) => m.category === 'vendor' && m.name === selectedName
                            )
                            if (matchedModel) {
                              let docUrl = matchedModel.documentation_url || ''
                              if (!docUrl) {
                                if (matchedModel.vendor === 'OpenAI') {
                                  docUrl = 'https://platform.openai.com/docs/models'
                                } else if (matchedModel.vendor === 'Anthropic') {
                                  docUrl = 'https://docs.anthropic.com/en/docs/models-overview'
                                } else if (matchedModel.vendor === 'Google') {
                                  docUrl = 'https://ai.google.dev/models/gemini'
                                } else if (matchedModel.vendor === 'AWS') {
                                  docUrl = 'https://aws.amazon.com/bedrock/'
                                } else if (matchedModel.vendor === 'Microsoft Azure') {
                                  docUrl = 'https://azure.microsoft.com/en-us/products/ai-services/openai-service'
                                }
                              }

                              // Auto-populate Section 2 fields if available
                              const intendedPurpose = matchedModel.use_cases || formData.intended_purpose

                              // Infer business impact from model type
                              let businessImpact = formData.business_impact_category
                              if (!businessImpact) {
                                if (matchedModel.type === 'fraud_detection' || matchedModel.use_cases?.toLowerCase().includes('fraud')) {
                                  businessImpact = 'high'
                                } else if (matchedModel.type === 'llm' || matchedModel.type === 'multimodal') {
                                  businessImpact = 'medium'
                                } else if (matchedModel.type === 'embedding' || matchedModel.type === 'classification') {
                                  businessImpact = 'low'
                                } else {
                                  // Default to medium if we can't infer
                                  businessImpact = 'medium'
                                }
                              }

                              setFormData({
                                ...formData,
                                vendor_name: matchedModel.vendor,
                                model_origin_name: matchedModel.name,
                                model_origin_version: matchedModel.version,
                                model_origin_url: docUrl,
                                intended_purpose: intendedPurpose,
                                business_impact_category: businessImpact
                              })
                            }
                          }
                        }}
                        placeholder="e.g., GPT-4o, Claude 3.5"
                        list="vendor-model-suggestions"
                      />
                      {referenceData && (
                        <datalist id="vendor-model-suggestions">
                          {(filteredModels.length > 0 ? filteredModels : referenceData.models.filter((m: any) => m.category === 'vendor'))
                            .map((model: any) => (
                              <option key={model.id} value={model.name} />
                            ))}
                        </datalist>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="model_origin_version">Version/Model ID</Label>
                      <Input
                        id="model_origin_version"
                        value={formData.model_origin_version}
                        onChange={(e) => setFormData({ ...formData, model_origin_version: e.target.value })}
                        placeholder="e.g., gpt-4o, claude-3-5-sonnet"
                        list="vendor-version-suggestions"
                      />
                      {referenceData && (
                        <datalist id="vendor-version-suggestions">
                          {(filteredModels.length > 0 ? filteredModels : referenceData.models.filter((m: any) => m.category === 'vendor'))
                            .map((model: any) => (
                              <option key={model.id} value={model.version} />
                            ))}
                        </datalist>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="model_origin_url">Documentation URL</Label>
                      <Input
                        id="model_origin_url"
                        type="url"
                        value={formData.model_origin_url}
                        onChange={(e) => setFormData({ ...formData, model_origin_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {referenceData && referenceData.models && (
                    <div className="text-xs text-gray-600">
                      <p className="font-medium mb-1">
                        {filteredModels.length > 0
                          ? `Click to auto-fill ${formData.model_type.toUpperCase()} models:`
                          : 'Click to auto-fill popular COTS models:'}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(filteredModels.length > 0 ? filteredModels : referenceData.models.filter((m: any) => m.category === 'vendor'))
                          .slice(0, 12)
                          .map((model: any) => {
                            // Determine documentation URL based on vendor
                            let docUrl = ''
                            if (model.vendor === 'OpenAI') {
                              docUrl = 'https://platform.openai.com/docs/models'
                            } else if (model.vendor === 'Anthropic') {
                              docUrl = 'https://docs.anthropic.com/en/docs/models-overview'
                            } else if (model.vendor === 'Google') {
                              docUrl = 'https://ai.google.dev/models/gemini'
                            } else if (model.vendor === 'AWS') {
                              docUrl = 'https://aws.amazon.com/bedrock/'
                            } else if (model.vendor === 'Microsoft Azure') {
                              docUrl = 'https://azure.microsoft.com/en-us/products/ai-services/openai-service'
                            }

                            // Auto-populate Section 2 fields
                            const intendedPurpose = model.use_cases || formData.intended_purpose
                            let businessImpact = formData.business_impact_category
                            if (!businessImpact) {
                              if (model.type === 'fraud_detection' || model.use_cases?.toLowerCase().includes('fraud')) {
                                businessImpact = 'high'
                              } else if (model.type === 'llm' || model.type === 'multimodal') {
                                businessImpact = 'medium'
                              } else if (model.type === 'embedding' || model.type === 'classification') {
                                businessImpact = 'low'
                              } else {
                                // Default to medium if we can't infer
                                businessImpact = 'medium'
                              }
                            }

                            return (
                              <button
                                key={model.id}
                                type="button"
                                className="px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded text-xs text-left"
                                onClick={() => setFormData({
                                  ...formData,
                                  vendor_name: model.vendor,
                                  model_origin_name: model.name,
                                  model_origin_version: model.version,
                                  model_origin_url: docUrl,
                                  intended_purpose: intendedPurpose,
                                  business_impact_category: businessImpact
                                })}
                              >
                                <div className="font-semibold text-green-900">{model.name}</div>
                                <div className="text-green-600 text-[10px]">{model.vendor}</div>
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {formData.model_origin === 'open_source' && (
                <div className="space-y-3">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="model_origin_name">Base Model Name</Label>
                      <Input
                        id="model_origin_name"
                        value={formData.model_origin_name}
                        onChange={(e) => {
                          const selectedName = e.target.value
                          setFormData({ ...formData, model_origin_name: selectedName })
                        }}
                        onBlur={(e) => {
                          // Auto-fill version, URL, and Section 2 fields when field loses focus
                          const selectedName = e.target.value
                          if (referenceData && referenceData.models) {
                            const matchedModel = referenceData.models.find(
                              (m: any) => m.category === 'open_source' && m.name === selectedName
                            )
                            if (matchedModel) {
                              let sourceUrl = matchedModel.documentation_url || ''
                              if (!sourceUrl) {
                                if (matchedModel.vendor === 'Meta') {
                                  sourceUrl = `https://huggingface.co/meta-llama/${matchedModel.version}`
                                } else if (matchedModel.vendor === 'Mistral AI') {
                                  sourceUrl = `https://huggingface.co/mistralai/${matchedModel.version}`
                                } else if (matchedModel.vendor === 'Google') {
                                  sourceUrl = `https://huggingface.co/google/${matchedModel.version}`
                                } else if (matchedModel.vendor === 'Microsoft') {
                                  sourceUrl = `https://huggingface.co/microsoft/${matchedModel.version}`
                                } else if (matchedModel.vendor === 'Alibaba') {
                                  sourceUrl = `https://huggingface.co/Qwen/${matchedModel.version}`
                                } else if (matchedModel.vendor === 'Databricks') {
                                  sourceUrl = `https://huggingface.co/databricks/${matchedModel.version}`
                                } else {
                                  sourceUrl = `https://huggingface.co/${matchedModel.version}`
                                }
                              }

                              // Auto-populate Section 2 fields if available
                              const intendedPurpose = matchedModel.use_cases || formData.intended_purpose

                              // Infer business impact from model type
                              let businessImpact = formData.business_impact_category
                              if (!businessImpact) {
                                if (matchedModel.type === 'fraud_detection' || matchedModel.use_cases?.toLowerCase().includes('fraud')) {
                                  businessImpact = 'high'
                                } else if (matchedModel.type === 'llm' || matchedModel.type === 'multimodal') {
                                  businessImpact = 'medium'
                                } else if (matchedModel.type === 'embedding' || matchedModel.type === 'classification') {
                                  businessImpact = 'low'
                                } else {
                                  // Default to medium if we can't infer
                                  businessImpact = 'medium'
                                }
                              }

                              setFormData({
                                ...formData,
                                model_origin_name: matchedModel.name,
                                model_origin_version: matchedModel.version,
                                model_origin_url: sourceUrl,
                                intended_purpose: intendedPurpose,
                                business_impact_category: businessImpact
                              })
                            }
                          }
                        }}
                        placeholder="e.g., Llama 2, Mistral"
                        list="opensource-model-suggestions"
                      />
                      {referenceData && (
                        <datalist id="opensource-model-suggestions">
                          {(filteredModels.length > 0 ? filteredModels : referenceData.models.filter((m: any) => m.category === 'open_source'))
                            .map((model: any) => (
                              <option key={model.id} value={model.name} />
                            ))}
                        </datalist>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="model_origin_version">Version/Size</Label>
                      <Input
                        id="model_origin_version"
                        value={formData.model_origin_version}
                        onChange={(e) => setFormData({ ...formData, model_origin_version: e.target.value })}
                        placeholder="e.g., 70B, 7B-Instruct"
                        list="opensource-version-suggestions"
                      />
                      {referenceData && (
                        <datalist id="opensource-version-suggestions">
                          {(filteredModels.length > 0 ? filteredModels : referenceData.models.filter((m: any) => m.category === 'open_source'))
                            .map((model: any) => (
                              <option key={model.id} value={model.version} />
                            ))}
                        </datalist>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="model_origin_url">Source URL</Label>
                      <Input
                        id="model_origin_url"
                        type="url"
                        value={formData.model_origin_url}
                        onChange={(e) => setFormData({ ...formData, model_origin_url: e.target.value })}
                        placeholder="https://huggingface.co/..."
                      />
                    </div>
                  </div>
                  {referenceData && referenceData.models && (
                    <div className="text-xs text-gray-600">
                      <p className="font-medium mb-1">
                        {filteredModels.length > 0
                          ? `Click to auto-fill ${formData.model_type.toUpperCase()} open source models:`
                          : 'Click to auto-fill:'}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(filteredModels.length > 0 ? filteredModels : referenceData.models.filter((m: any) => m.category === 'open_source'))
                          .slice(0, 12)
                          .map((model: any) => {
                            // Determine source URL based on vendor/model
                            let sourceUrl = model.documentation_url || formData.model_origin_url
                            if (!sourceUrl) {
                              if (model.vendor === 'Meta') {
                                sourceUrl = `https://huggingface.co/meta-llama/${model.version}`
                              } else if (model.vendor === 'Mistral AI') {
                                sourceUrl = `https://huggingface.co/mistralai/${model.version}`
                              } else if (model.vendor === 'Hugging Face' || model.vendor === 'Open Source') {
                                sourceUrl = `https://huggingface.co/${model.version}`
                              }
                            }

                            // Auto-populate Section 2 fields
                            const intendedPurpose = model.use_cases || formData.intended_purpose
                            let businessImpact = formData.business_impact_category
                            if (!businessImpact) {
                              if (model.type === 'fraud_detection' || model.use_cases?.toLowerCase().includes('fraud')) {
                                businessImpact = 'high'
                              } else if (model.type === 'llm' || model.type === 'multimodal') {
                                businessImpact = 'medium'
                              } else if (model.type === 'embedding' || model.type === 'classification') {
                                businessImpact = 'low'
                              } else {
                                // Default to medium if we can't infer
                                businessImpact = 'medium'
                              }
                            }

                            return (
                              <button
                                key={model.id}
                                type="button"
                                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-xs text-left"
                                onClick={() => setFormData({
                                  ...formData,
                                  model_origin_name: model.name,
                                  model_origin_version: model.version,
                                  model_origin_url: sourceUrl,
                                  intended_purpose: intendedPurpose,
                                  business_impact_category: businessImpact
                                })}
                              >
                                <div className="font-semibold text-blue-900">{model.name}</div>
                                <div className="text-blue-600">{model.version}</div>
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {formData.model_origin === 'in_house' && (
                <div className="space-y-3">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="model_origin_name">Base Model/Architecture Name</Label>
                      <Input
                        id="model_origin_name"
                        value={formData.model_origin_name}
                        onChange={(e) => setFormData({ ...formData, model_origin_name: e.target.value })}
                        placeholder="e.g., Custom Transformer, BERT-based"
                      />
                      <p className="text-xs text-gray-500 mt-1">The base architecture or framework used</p>
                    </div>
                    <div>
                      <Label htmlFor="model_origin_version">Version/Size</Label>
                      <Input
                        id="model_origin_version"
                        value={formData.model_origin_version}
                        onChange={(e) => setFormData({ ...formData, model_origin_version: e.target.value })}
                        placeholder="e.g., v1.0, 124M parameters"
                      />
                    </div>
                    <div>
                      <Label htmlFor="model_origin_url">Repository/Documentation URL</Label>
                      <Input
                        id="model_origin_url"
                        type="url"
                        value={formData.model_origin_url}
                        onChange={(e) => setFormData({ ...formData, model_origin_url: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm text-gray-700">
                    <p className="font-medium mb-1">💡 For homegrown models, please provide:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>The base architecture (e.g., Transformer, CNN, RNN, or custom)</li>
                      <li>Model version and size/parameter count if applicable</li>
                      <li>Link to internal documentation, GitHub repo, or training specs</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="button" onClick={() => { markSectionComplete('section1'); goToNextSection('section2'); }}>
                  Next: Intended Use →
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 2: Intended Use */}
        <TabsContent value="section2">
          <Card>
            <CardHeader>
              <CardTitle>Section 2 — Intended Use & Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="intended_purpose">Intended Purpose *</Label>
                <textarea
                  id="intended_purpose"
                  required
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  value={formData.intended_purpose}
                  onChange={(e) => setFormData({ ...formData, intended_purpose: e.target.value })}
                  placeholder="Describe the intended use of this AI model..."
                />
                {referenceData && referenceData.useCases && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-medium mb-1">Common use cases:</p>
                    <div className="flex flex-wrap gap-1">
                      {referenceData.useCases.slice(0, 6).map((useCase: any) => (
                        <button
                          key={useCase.id}
                          type="button"
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                          onClick={() => setFormData({ ...formData, intended_purpose: useCase.name })}
                        >
                          {useCase.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_impact_category">Business Impact Category *</Label>
                  <select
                    id="business_impact_category"
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.business_impact_category}
                    onChange={(e) => setFormData({ ...formData, business_impact_category: e.target.value })}
                  >
                    <option value="">Select impact category</option>
                    <option value="low">Low (internal tooling)</option>
                    <option value="medium">Medium (customer-facing, non-deterministic)</option>
                    <option value="high">High (decisions, financial impact, regulated)</option>
                  </select>
                </div>

                <div>
                  <Label>Human in the Loop? *</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="human_in_loop"
                        required
                        className="mr-2"
                        checked={formData.human_in_loop === true}
                        onChange={() => setFormData({ ...formData, human_in_loop: true })}
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="human_in_loop"
                        required
                        className="mr-2"
                        checked={formData.human_in_loop === false}
                        onChange={() => setFormData({ ...formData, human_in_loop: false })}
                      />
                      No (Fully automated)
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>System Used For:</Label>
                  <button
                    type="button"
                    className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                    onClick={() => {
                      const allOptions = ['Regulated decisions', 'Credit decisions (ECOA/Reg B)', 'Fraud decisions (FFIEC, AML/BSA)',
                        'Identity verification (KYC, CIP)', 'Customer eligibility'];
                      setFormData({ ...formData, regulated_decisions: allOptions });
                    }}
                  >
                    Select All
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  {['Regulated decisions', 'Credit decisions (ECOA/Reg B)', 'Fraud decisions (FFIEC, AML/BSA)',
                    'Identity verification (KYC, CIP)', 'Customer eligibility', 'None of the above'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={formData.regulated_decisions.includes(option)}
                        onChange={() => handleCheckboxChange('regulated_decisions', option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentTab('section1')}>
                  ← Back
                </Button>
                <Button type="button" onClick={() => { markSectionComplete('section2'); goToNextSection('section3'); }}>
                  Next: Data Sources →
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 3: Data Used */}
        <TabsContent value="section3">
          <Card>
            <CardHeader>
              <CardTitle>Section 3 — Data Used</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="data_sources">Data Sources Used to Train or Fine-Tune *</Label>
                <textarea
                  id="data_sources"
                  required
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  value={formData.data_sources}
                  onChange={(e) => setFormData({ ...formData, data_sources: e.target.value })}
                  placeholder="Examples: Internal support tickets, transaction data, public datasets..."
                />
                {referenceData && referenceData.dataSources && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-medium mb-1">Common data sources:</p>
                    <div className="flex flex-wrap gap-1">
                      {referenceData.dataSources.slice(0, 8).map((source: any) => (
                        <button
                          key={source.id}
                          type="button"
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                          onClick={() => {
                            // Parse existing data sources (comma-separated)
                            const existing = formData.data_sources
                              .split(',')
                              .map(s => s.trim().toLowerCase())
                              .filter(s => s.length > 0)

                            // Check if this source already exists
                            if (!existing.includes(source.name.toLowerCase())) {
                              setFormData({
                                ...formData,
                                data_sources: formData.data_sources + (formData.data_sources ? ', ' : '') + source.name
                              })
                            }
                          }}
                        >
                          {source.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contains_customer_data">Contains Customer Data? *</Label>
                  <select
                    id="contains_customer_data"
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.contains_customer_data}
                    onChange={(e) => setFormData({ ...formData, contains_customer_data: e.target.value })}
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unsure">Unsure</option>
                  </select>
                </div>

                <div>
                  <Label>Labels Modified?</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="labels_modified"
                        className="mr-2"
                        checked={formData.labels_modified === true}
                        onChange={() => setFormData({ ...formData, labels_modified: true })}
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="labels_modified"
                        className="mr-2"
                        checked={formData.labels_modified === false}
                        onChange={() => setFormData({ ...formData, labels_modified: false })}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              {formData.labels_modified && (
                <div>
                  <Label htmlFor="labels_description">Describe Label Modifications</Label>
                  <textarea
                    id="labels_description"
                    rows={3}
                    className="w-full p-2 border rounded-md"
                    value={formData.labels_description}
                    onChange={(e) => setFormData({ ...formData, labels_description: e.target.value })}
                  />
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentTab('section2')}>
                  ← Back
                </Button>
                <Button type="button" onClick={() => { markSectionComplete('section3'); goToNextSection('section4'); }}>
                  Next: Modifications →
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 4: Model Modifications */}
        <TabsContent value="section4">
          <Card>
            <CardHeader>
              <CardTitle>Section 4 — Model Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>What did you modify?</Label>
                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  {['Fine-tuning (full)', 'Fine-tuning (LoRA / QLoRA / PEFT)', 'Prompt engineering only',
                    'RAG added', 'Safety alignment tuning', 'Custom tokenizer', 'No modifications (pure base model)'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={formData.modifications.includes(option)}
                        onChange={() => handleCheckboxChange('modifications', option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="training_config_location">Training / Fine-tuning Config File Location</Label>
                <Input
                  id="training_config_location"
                  value={formData.training_config_location}
                  onChange={(e) => setFormData({ ...formData, training_config_location: e.target.value })}
                  placeholder="Upload or repository link"
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentTab('section3')}>
                  ← Back
                </Button>
                <Button type="button" onClick={() => { markSectionComplete('section4'); goToNextSection('section5'); }}>
                  Next: Deployment →
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 5: Operational Deployment */}
        <TabsContent value="section5">
          <Card>
            <CardHeader>
              <CardTitle>Section 5 — Operational Deployment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deployment_location">Where will the model run? *</Label>
                <select
                  id="deployment_location"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.deployment_location}
                  onChange={(e) => setFormData({ ...formData, deployment_location: e.target.value })}
                >
                  <option value="">Select deployment location</option>
                  <option value="on_prem_gpu">On-prem GPU</option>
                  <option value="cloud_gpu">Cloud GPU (AWS/GCP/Azure)</option>
                  <option value="kubernetes">Kubernetes</option>
                  <option value="serverless_api">Serverless API</option>
                  <option value="vendor_hosted">Vendor-hosted endpoint</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {referenceData && referenceData.deploymentPlatforms && (
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Common platforms:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                    {referenceData.deploymentPlatforms.slice(0, 9).map((platform: any) => (
                      <div key={platform.id} className="text-xs">• {platform.name}</div>
                    ))}
                  </div>
                </div>
              )}

              {formData.deployment_location === 'cloud_gpu' && (
                <div>
                  <Label htmlFor="cloud_provider">Specific Cloud Provider *</Label>
                  <select
                    id="cloud_provider"
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.cloud_provider}
                    onChange={(e) => setFormData({ ...formData, cloud_provider: e.target.value })}
                  >
                    <option value="">Select cloud provider</option>
                    <option value="AWS">Amazon Web Services (AWS)</option>
                    <option value="GCP">Google Cloud Platform (GCP)</option>
                    <option value="Azure">Microsoft Azure</option>
                  </select>
                </div>
              )}

              {formData.cloud_provider && (
                <CloudProviderDPA provider={formData.cloud_provider} />
              )}

              {formData.deployment_location === 'other' && (
                <div>
                  <Label htmlFor="deployment_location_other">Specify Deployment Location</Label>
                  <Input
                    id="deployment_location_other"
                    value={formData.deployment_location_other}
                    onChange={(e) => setFormData({ ...formData, deployment_location_other: e.target.value })}
                  />
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="access_teams">Access Teams/Roles</Label>
                  <Input
                    id="access_teams"
                    value={formData.access_teams}
                    onChange={(e) => setFormData({ ...formData, access_teams: e.target.value })}
                    placeholder="Team names"
                  />
                </div>
                <div>
                  <Label htmlFor="input_format">Input Format</Label>
                  <Input
                    id="input_format"
                    value={formData.input_format}
                    onChange={(e) => setFormData({ ...formData, input_format: e.target.value })}
                    placeholder="e.g., JSON, text"
                  />
                </div>
                <div>
                  <Label htmlFor="output_format">Output Format</Label>
                  <Input
                    id="output_format"
                    value={formData.output_format}
                    onChange={(e) => setFormData({ ...formData, output_format: e.target.value })}
                    placeholder="e.g., JSON, scores"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentTab('section4')}>
                  ← Back
                </Button>
                <Button type="button" onClick={() => { markSectionComplete('section5'); goToNextSection('section6'); }}>
                  Next: Safety →
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 6: Risk & Safety */}
        <TabsContent value="section6">
          <Card>
            <CardHeader>
              <CardTitle>Section 6 — Risk & Safety Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sees_sensitive_data">Does the model see sensitive data? *</Label>
                <select
                  id="sees_sensitive_data"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.sees_sensitive_data}
                  onChange={(e) => setFormData({ ...formData, sees_sensitive_data: e.target.value })}
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unsure">Unsure</option>
                </select>
              </div>

              <div>
                <Label>Safety Features Implemented</Label>
                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  {['Input validation', 'Output filtering', 'Prompt guardrails', 'Safety classifier',
                    'Rate limiting', 'PII redaction', 'Audit logging', 'Human review queue', 'None'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={formData.safety_features.includes(option)}
                        onChange={() => handleCheckboxChange('safety_features', option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="known_risks">Known Risks or Limitations (Optional)</Label>
                <textarea
                  id="known_risks"
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  value={formData.known_risks}
                  onChange={(e) => setFormData({ ...formData, known_risks: e.target.value })}
                  placeholder="Describe any known risks or limitations..."
                />
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setCurrentTab('section5')}>
                  ← Back
                </Button>
                <Button type="button" onClick={() => { markSectionComplete('section6'); goToNextSection('section7'); }}>
                  Next: Files →
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 7: Artifacts & Documentation */}
        <TabsContent value="section7">
          <Card>
            <CardHeader>
              <CardTitle>Section 7 — Artifacts & Documentation (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  Upload supporting documentation such as architecture diagrams, data flow diagrams, model cards,
                  or other relevant documents. These help reviewers better understand your submission.
                </p>
              </div>

              {/* File Upload Area */}
              <FileUploadSection
                onUpload={handleFileUpload}
                uploadedFiles={uploadedFiles}
                onRemove={removeUploadedFile}
              />

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setCurrentTab('section6')}>
                  ← Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for AI Review'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

// File Upload Component
function FileUploadSection({ onUpload, uploadedFiles, onRemove }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [artifactType, setArtifactType] = useState('architecture_diagram')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      await onUpload(selectedFile, artifactType, description)
      // Reset form after successful upload
      setSelectedFile(null)
      setDescription('')
      setArtifactType('architecture_diagram')
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error) {
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop a file here, or click to select
        </p>
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.svg,.txt,.md"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          Select File
        </Button>
        {selectedFile && (
          <div className="mt-4 p-3 bg-gray-50 rounded border">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>

      {/* Artifact Type and Description */}
      {selectedFile && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="artifact_type">Document Type</Label>
            <select
              id="artifact_type"
              className="w-full p-2 border rounded-md"
              value={artifactType}
              onChange={(e) => setArtifactType(e.target.value)}
            >
              <option value="architecture_diagram">Architecture Diagram</option>
              <option value="data_flow_diagram">Data Flow Diagram</option>
              <option value="model_card">Model Card</option>
              <option value="technical_documentation">Technical Documentation</option>
              <option value="risk_assessment">Risk Assessment</option>
              <option value="compliance_documentation">Compliance Documentation</option>
              <option value="test_results">Test Results</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="file_description">Description (Optional)</Label>
            <textarea
              id="file_description"
              rows={2}
              className="w-full p-2 border rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this document..."
            />
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Uploaded Files ({uploadedFiles.length})</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{file.file_name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {file.artifact_type.replace(/_/g, ' ')}
                    </p>
                    {file.description && (
                      <p className="text-xs text-gray-600 mt-1">{file.description}</p>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(file.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Cloud Provider DPA Component
function CloudProviderDPA({ provider }: { provider: string }) {
  const dpaInfo: Record<string, { name: string; url: string; summary: string }> = {
    AWS: {
      name: 'AWS Data Processing Addendum',
      url: 'https://aws.amazon.com/service-terms/',
      summary: 'AWS processes customer data in accordance with the AWS Service Terms and AWS GDPR DPA. AWS provides strong data protection controls including encryption at rest and in transit, access controls, and audit logging.',
    },
    GCP: {
      name: 'Google Cloud Data Processing Addendum',
      url: 'https://cloud.google.com/terms/data-processing-addendum',
      summary: 'Google Cloud processes customer data in accordance with their Data Processing Addendum. GCP provides comprehensive security controls, encryption, access management, and compliance certifications including SOC 2, ISO 27001, and GDPR compliance.',
    },
    Azure: {
      name: 'Microsoft Azure Data Processing Addendum',
      url: 'https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA',
      summary: 'Microsoft Azure processes customer data according to their Data Protection Addendum. Azure provides enterprise-grade security including encryption, identity management, threat protection, and compliance with major regulatory frameworks.',
    },
  }

  const info = dpaInfo[provider]
  if (!info) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex items-start">
        <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-2">
            {info.name}
          </h4>
          <p className="text-sm text-blue-800 mb-3">
            {info.summary}
          </p>
          <a
            href={info.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
          >
            View Full {provider} Data Processing Addendum →
          </a>
        </div>
      </div>
    </div>
  )
}
