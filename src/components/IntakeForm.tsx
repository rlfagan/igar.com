'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface IntakeFormProps {
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
}

export default function IntakeForm({ onSubmit, isSubmitting }: IntakeFormProps) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Project & Model Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Section 1 — Project & Model Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Name *</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Model Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., credit-risk-llm-v3"
              className="w-full p-2 border rounded-md"
              value={formData.model_name}
              onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Model Type *</label>
            <select
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
              <label className="block text-sm font-medium mb-2">Specify Model Type</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.model_type_other}
                onChange={(e) => setFormData({ ...formData, model_type_other: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Model Origin *</label>
            <select
              required
              className="w-full p-2 border rounded-md"
              value={formData.model_origin}
              onChange={(e) => setFormData({ ...formData, model_origin: e.target.value })}
            >
              <option value="">Select origin</option>
              <option value="open_source">Open-source model</option>
              <option value="vendor">Vendor-provided model</option>
              <option value="in_house">In-house trained foundation model</option>
            </select>
          </div>

          {formData.model_origin === 'open_source' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Model Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.model_origin_name}
                  onChange={(e) => setFormData({ ...formData, model_origin_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Version</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.model_origin_version}
                  onChange={(e) => setFormData({ ...formData, model_origin_version: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Source URL / Registry</label>
                <input
                  type="url"
                  className="w-full p-2 border rounded-md"
                  value={formData.model_origin_url}
                  onChange={(e) => setFormData({ ...formData, model_origin_url: e.target.value })}
                />
              </div>
            </>
          )}

          {formData.model_origin === 'vendor' && (
            <div>
              <label className="block text-sm font-medium mb-2">Vendor Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Intended Use & Scope */}
      <Card>
        <CardHeader>
          <CardTitle>Section 2 — Intended Use & Scope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Intended Purpose *</label>
            <textarea
              required
              rows={4}
              className="w-full p-2 border rounded-md"
              value={formData.intended_purpose}
              onChange={(e) => setFormData({ ...formData, intended_purpose: e.target.value })}
              placeholder="Describe the intended use of this AI model..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Business Impact Category *</label>
            <select
              required
              className="w-full p-2 border rounded-md"
              value={formData.business_impact_category}
              onChange={(e) => setFormData({ ...formData, business_impact_category: e.target.value })}
            >
              <option value="">Select impact category</option>
              <option value="low">Low (internal tooling)</option>
              <option value="medium">Medium (customer-facing but non-deterministic outputs)</option>
              <option value="high">High (loan decisions, fraud detection, eligibility, financial impact, regulated flows)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Is this system used for: *</label>
            <div className="space-y-2">
              {['Regulated decisions', 'Credit decisions (ECOA/Reg B)', 'Fraud decisions (FFIEC, AML/BSA)',
                'Identity verification (KYC, CIP, NIST IAL2+)', 'Customer eligibility', 'None of the above'].map((option) => (
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

          <div>
            <label className="block text-sm font-medium mb-2">Are humans involved in the final decision? *</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="human_in_loop"
                  required
                  className="mr-2"
                  checked={formData.human_in_loop === true}
                  onChange={() => setFormData({ ...formData, human_in_loop: true })}
                />
                Yes (Human-in-the-loop)
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
        </CardContent>
      </Card>

      {/* Section 3: Data Used */}
      <Card>
        <CardHeader>
          <CardTitle>Section 3 — Data Used</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Data Sources Used to Train or Fine-Tune *</label>
            <textarea
              required
              rows={4}
              className="w-full p-2 border rounded-md"
              value={formData.data_sources}
              onChange={(e) => setFormData({ ...formData, data_sources: e.target.value })}
              placeholder="Examples: Internal support tickets, Private loan performance data, Public datasets, Synthetic datasets"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Does training data contain any customer data? *</label>
            <select
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
            <label className="block text-sm font-medium mb-2">Did you create or modify any labels?</label>
            <div className="space-y-2">
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

          {formData.labels_modified && (
            <div>
              <label className="block text-sm font-medium mb-2">Describe Label Modifications</label>
              <textarea
                rows={3}
                className="w-full p-2 border rounded-md"
                value={formData.labels_description}
                onChange={(e) => setFormData({ ...formData, labels_description: e.target.value })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 4: Model Modifications */}
      <Card>
        <CardHeader>
          <CardTitle>Section 4 — Model Modifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">What did you modify?</label>
            <div className="space-y-2">
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
            <label className="block text-sm font-medium mb-2">Training / Fine-tuning Config File Location</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.training_config_location}
              onChange={(e) => setFormData({ ...formData, training_config_location: e.target.value })}
              placeholder="Upload or repository link"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Operational Deployment */}
      <Card>
        <CardHeader>
          <CardTitle>Section 5 — Operational Deployment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Where will the model run? *</label>
            <select
              required
              className="w-full p-2 border rounded-md"
              value={formData.deployment_location}
              onChange={(e) => setFormData({ ...formData, deployment_location: e.target.value })}
            >
              <option value="">Select deployment location</option>
              <option value="on_prem_gpu">On-prem GPU</option>
              <option value="cloud_gpu">Cloud GPU</option>
              <option value="kubernetes">Kubernetes</option>
              <option value="serverless_api">Serverless API</option>
              <option value="vendor_hosted">Vendor-hosted endpoint</option>
              <option value="other">Other</option>
            </select>
          </div>

          {formData.deployment_location === 'other' && (
            <div>
              <label className="block text-sm font-medium mb-2">Specify Deployment Location</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.deployment_location_other}
                onChange={(e) => setFormData({ ...formData, deployment_location_other: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Who has access to the model?</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.access_teams}
              onChange={(e) => setFormData({ ...formData, access_teams: e.target.value })}
              placeholder="Team names or roles"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Input Format</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.input_format}
                onChange={(e) => setFormData({ ...formData, input_format: e.target.value })}
                placeholder="e.g., JSON, text, embeddings"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Output Format</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.output_format}
                onChange={(e) => setFormData({ ...formData, output_format: e.target.value })}
                placeholder="e.g., JSON, text, scores"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Risk & Safety */}
      <Card>
        <CardHeader>
          <CardTitle>Section 6 — Risk & Safety Considerations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Does the model ever see sensitive data? *</label>
            <select
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
            <label className="block text-sm font-medium mb-2">Safety Features Implemented</label>
            <div className="space-y-2">
              {['Input validation', 'Output filtering', 'Prompt guardrails', 'Safety classifier', 'None'].map((option) => (
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
            <label className="block text-sm font-medium mb-2">Known Risks or Limitations (Optional)</label>
            <textarea
              rows={4}
              className="w-full p-2 border rounded-md"
              value={formData.known_risks}
              onChange={(e) => setFormData({ ...formData, known_risks: e.target.value })}
              placeholder="Describe any known risks or limitations..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" disabled={isSubmitting}>
          Save Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit for Review'
          )}
        </Button>
      </div>
    </form>
  )
}
