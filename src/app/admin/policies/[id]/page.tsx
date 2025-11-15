'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function PolicyEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [policy, setPolicy] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())
  const [editingField, setEditingField] = useState<any>(null)

  useEffect(() => {
    if (params.id) {
      fetchPolicy()
    }
  }, [params.id])

  const fetchPolicy = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/policies/${params.id}/form`
      )
      const data = await response.json()

      if (data.success) {
        setPolicy(data.policy)
        setSections(data.sections)
        // Expand all sections by default
        setExpandedSections(new Set(data.sections.map((s: any) => s.id)))
      }
    } catch (error) {
      console.error('Failed to fetch policy:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getFieldTypeIcon = (fieldType: string) => {
    const icons: Record<string, string> = {
      text: '📝',
      textarea: '📄',
      select: '📋',
      multiselect: '☑️',
      checkbox: '✅',
      radio: '🔘',
      file: '📎',
    }
    return icons[fieldType] || '📝'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center py-12">Loading policy...</p>
        </div>
      </main>
    )
  }

  if (!policy) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-600">Policy not found</p>
              <Link href="/admin/policies">
                <Button className="mt-4">Back to Policies</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/policies">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Policies
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{policy.name}</h1>
            <p className="text-gray-600 mt-1">{policy.description}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {policy.industry}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                {sections.length} sections
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/policies/${params.id}/preview`}>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => (
            <Card key={section.id}>
              <CardHeader
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div>
                      <CardTitle className="text-lg">
                        Section {section.order_index}: {section.title}
                      </CardTitle>
                      {section.description && (
                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {section.fields.length} fields
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSection(section.id)
                      }}
                    >
                      {expandedSections.has(section.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedSections.has(section.id) && (
                <CardContent>
                  {/* Fields List */}
                  <div className="space-y-2">
                    {section.fields.map((field: any) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <span className="text-lg">{getFieldTypeIcon(field.field_type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{field.label}</span>
                              {field.is_required && (
                                <span className="text-red-600 text-sm">*</span>
                              )}
                              {!field.is_enabled && (
                                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {field.field_type}
                              </span>
                              {field.help_text && (
                                <span className="text-xs text-gray-500">
                                  • {field.help_text}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingField(field)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Toggle visibility
                              console.log('Toggle field visibility:', field.id)
                            }}
                          >
                            {field.is_enabled ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Field Button */}
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Add Section Button */}
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Field Editor Modal */}
        {editingField && (
          <FieldEditorModal
            field={editingField}
            onClose={() => setEditingField(null)}
            onSave={(updatedField: any) => {
              console.log('Save field:', updatedField)
              setEditingField(null)
              fetchPolicy()
            }}
          />
        )}
      </div>
    </main>
  )
}

function FieldEditorModal({ field, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    label: field.label,
    field_type: field.field_type,
    placeholder: field.placeholder || '',
    help_text: field.help_text || '',
    is_required: field.is_required,
    is_enabled: field.is_enabled,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...field, ...formData })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Edit Field: {field.field_key}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="help_text">Help Text</Label>
              <textarea
                id="help_text"
                rows={2}
                className="w-full p-2 border rounded-md"
                value={formData.help_text}
                onChange={(e) => setFormData({ ...formData, help_text: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={formData.placeholder}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_required"
                  className="mr-2"
                  checked={formData.is_required}
                  onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                />
                <Label htmlFor="is_required" className="mb-0">Required</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_enabled"
                  className="mr-2"
                  checked={formData.is_enabled}
                  onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
                />
                <Label htmlFor="is_enabled" className="mb-0">Enabled</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
