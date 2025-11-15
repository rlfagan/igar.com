'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, CheckCircle } from 'lucide-react'

interface DynamicFormProps {
  policyId?: number
  organizationId?: number
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
}

interface FormField {
  id: number
  field_key: string
  label: string
  field_type: string
  placeholder?: string
  help_text?: string
  is_required: boolean
  validation_rules?: any
  options?: any[]
  default_value?: string
  conditional_logic?: any
  order_index: number
  is_enabled: boolean
}

interface FormSection {
  id: number
  section_key: string
  title: string
  description?: string
  order_index: number
  is_required: boolean
  is_enabled: boolean
  fields: FormField[]
}

export default function DynamicForm({ policyId, organizationId, onSubmit, isSubmitting }: DynamicFormProps) {
  const [policy, setPolicy] = useState<any>(null)
  const [sections, setSections] = useState<FormSection[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [currentTab, setCurrentTab] = useState('')
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFormConfiguration()
  }, [policyId, organizationId])

  const fetchFormConfiguration = async () => {
    try {
      const endpoint = policyId
        ? `/api/policies/${policyId}/form${organizationId ? `?organizationId=${organizationId}` : ''}`
        : `/api/policies/default/form${organizationId ? `?organizationId=${organizationId}` : ''}`

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`)
      const data = await response.json()

      if (data.success) {
        setPolicy(data.policy)

        // Filter and sort sections
        const enabledSections = data.sections
          .filter((s: FormSection) => s.is_enabled)
          .sort((a: FormSection, b: FormSection) => a.order_index - b.order_index)

        setSections(enabledSections)

        // Set first section as current
        if (enabledSections.length > 0) {
          setCurrentTab(enabledSections[0].section_key)
        }

        // Initialize form data with default values
        const initialData: Record<string, any> = {}
        enabledSections.forEach((section: FormSection) => {
          section.fields.forEach((field: FormField) => {
            if (field.default_value) {
              initialData[field.field_key] = field.default_value
            } else if (field.field_type === 'multiselect' || field.field_type === 'checkbox') {
              initialData[field.field_key] = []
            } else if (field.field_type === 'radio') {
              initialData[field.field_key] = null
            } else {
              initialData[field.field_key] = ''
            }
          })
        })
        setFormData(initialData)
      } else {
        setError('Failed to load form configuration')
      }
    } catch (err) {
      console.error('Form configuration error:', err)
      setError('Failed to load form configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }))
  }

  const handleMultiSelectChange = (fieldKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: prev[fieldKey].includes(value)
        ? prev[fieldKey].filter((v: string) => v !== value)
        : [...prev[fieldKey], value]
    }))
  }

  const markSectionComplete = (sectionKey: string) => {
    if (!completedSections.includes(sectionKey)) {
      setCompletedSections([...completedSections, sectionKey])
    }
  }

  const goToNextSection = (nextSectionKey: string) => {
    setCurrentTab(nextSectionKey)
  }

  const checkConditionalLogic = (field: FormField): boolean => {
    if (!field.conditional_logic) return true

    const { field_key, operator, value } = field.conditional_logic
    const fieldValue = formData[field_key]

    switch (operator) {
      case 'equals':
        return fieldValue === value
      case 'not_equals':
        return fieldValue !== value
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(value)
      case 'not_contains':
        return Array.isArray(fieldValue) && !fieldValue.includes(value)
      default:
        return true
    }
  }

  const renderField = (field: FormField) => {
    if (!field.is_enabled || !checkConditionalLogic(field)) {
      return null
    }

    const commonProps = {
      id: field.field_key,
      required: field.is_required,
    }

    switch (field.field_type) {
      case 'text':
        return (
          <div key={field.id}>
            <Label htmlFor={field.field_key}>
              {field.label} {field.is_required && '*'}
            </Label>
            <Input
              {...commonProps}
              type="text"
              placeholder={field.placeholder}
              value={formData[field.field_key] || ''}
              onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            />
            {field.help_text && (
              <p className="text-xs text-gray-500 mt-1">{field.help_text}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id}>
            <Label htmlFor={field.field_key}>
              {field.label} {field.is_required && '*'}
            </Label>
            <textarea
              {...commonProps}
              rows={4}
              className="w-full p-2 border rounded-md"
              placeholder={field.placeholder}
              value={formData[field.field_key] || ''}
              onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            />
            {field.help_text && (
              <p className="text-xs text-gray-500 mt-1">{field.help_text}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.id}>
            <Label htmlFor={field.field_key}>
              {field.label} {field.is_required && '*'}
            </Label>
            <select
              {...commonProps}
              className="w-full p-2 border rounded-md"
              value={formData[field.field_key] || ''}
              onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            >
              <option value="">Select an option</option>
              {field.options?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.help_text && (
              <p className="text-xs text-gray-500 mt-1">{field.help_text}</p>
            )}
          </div>
        )

      case 'multiselect':
      case 'checkbox':
        return (
          <div key={field.id}>
            <Label>
              {field.label} {field.is_required && '*'}
            </Label>
            {field.help_text && (
              <p className="text-xs text-gray-500 mb-2">{field.help_text}</p>
            )}
            <div className="grid md:grid-cols-2 gap-2 mt-2">
              {field.options?.map((option: any) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={(formData[field.field_key] || []).includes(option.value)}
                    onChange={() => handleMultiSelectChange(field.field_key, option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        )

      case 'radio':
        return (
          <div key={field.id}>
            <Label>
              {field.label} {field.is_required && '*'}
            </Label>
            {field.help_text && (
              <p className="text-xs text-gray-500 mb-2">{field.help_text}</p>
            )}
            <div className="flex gap-4 mt-2">
              {field.options?.map((option: any) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name={field.field_key}
                    className="mr-2"
                    checked={formData[field.field_key] === option.value}
                    onChange={() => handleFieldChange(field.field_key, option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading form...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className={`grid w-full mb-6`} style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}>
          {sections.map((section, index) => (
            <TabsTrigger key={section.section_key} value={section.section_key} className="relative">
              {completedSections.includes(section.section_key) && (
                <CheckCircle className="w-4 h-4 absolute top-1 right-1 text-green-600" />
              )}
              {index + 1}. {section.title.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section, sectionIndex) => {
          const isLastSection = sectionIndex === sections.length - 1
          const nextSection = sections[sectionIndex + 1]

          return (
            <TabsContent key={section.section_key} value={section.section_key}>
              <Card>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  {section.description && (
                    <CardDescription>{section.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.fields
                    .filter(f => f.is_enabled)
                    .sort((a, b) => a.order_index - b.order_index)
                    .map(field => renderField(field))}

                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (sectionIndex > 0) {
                          setCurrentTab(sections[sectionIndex - 1].section_key)
                        }
                      }}
                      disabled={sectionIndex === 0}
                    >
                      ← Back
                    </Button>

                    {isLastSection ? (
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
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          markSectionComplete(section.section_key)
                          goToNextSection(nextSection.section_key)
                        }}
                      >
                        Next →
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </form>
  )
}
