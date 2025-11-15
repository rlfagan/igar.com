'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, CheckCircle } from 'lucide-react'

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
    access_teams: '',
    input_format: '',
    output_format: '',

    // Section 6
    sees_sensitive_data: '',
    safety_features: [] as string[],
    known_risks: '',
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleCheckboxChange = (field: 'regulated_decisions' | 'modifications' | 'safety_features', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }))
  }

  const markSectionComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section])
    }
  }

  const goToNextSection = (nextSection: string) => {
    setCurrentTab(nextSection)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
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
        </TabsList>

        {/* Section 1: Project & Model Overview */}
        <TabsContent value="section1">
          <Card>
            <CardHeader>
              <CardTitle>Section 1 — Project & Model Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Label htmlFor="model_name">Your Model/System Name *</Label>
                  <Input
                    id="model_name"
                    required
                    value={formData.model_name}
                    onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                    placeholder="e.g., credit-risk-scorer-v2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your internal model identifier (e.g., fraud-detector-prod, customer-chatbot-v1)</p>
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

              <div>
                <Label htmlFor="model_origin">Model Origin *</Label>
                <select
                  id="model_origin"
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.model_origin}
                  onChange={(e) => setFormData({ ...formData, model_origin: e.target.value })}
                >
                  <option value="">Select origin</option>
                  <option value="open_source">Open-source model</option>
                  <option value="vendor">Vendor-provided model (COTS)</option>
                  <option value="in_house">In-house trained foundation model</option>
                </select>
              </div>

              {formData.model_origin === 'vendor' && (
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
              )}

              {formData.model_origin === 'open_source' && (
                <div className="space-y-3">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="model_origin_name">Base Model Name</Label>
                      <Input
                        id="model_origin_name"
                        value={formData.model_origin_name}
                        onChange={(e) => setFormData({ ...formData, model_origin_name: e.target.value })}
                        placeholder="e.g., Llama 2, Mistral"
                        list="opensource-model-suggestions"
                      />
                      {referenceData && (
                        <datalist id="opensource-model-suggestions">
                          {referenceData.models
                            .filter((m: any) => m.category === 'open_source')
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
                      />
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
                      <p className="font-medium mb-1">Click to auto-fill:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {referenceData.models
                          .filter((m: any) => m.category === 'open_source')
                          .slice(0, 12)
                          .map((model: any) => {
                            // Determine source URL based on vendor/model
                            let sourceUrl = formData.model_origin_url
                            if (model.vendor === 'Meta') {
                              sourceUrl = `https://huggingface.co/meta-llama/${model.version}`
                            } else if (model.vendor === 'Mistral AI') {
                              sourceUrl = `https://huggingface.co/mistralai/${model.version}`
                            } else if (model.vendor === 'Hugging Face' || model.vendor === 'Open Source') {
                              sourceUrl = `https://huggingface.co/${model.version}`
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
                                  model_origin_url: sourceUrl
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
                <Label>System Used For:</Label>
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
                          onClick={() => setFormData({ ...formData, data_sources: formData.data_sources + (formData.data_sources ? ', ' : '') + source.name })}
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
