'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainNavigation } from '@/components/layout/main-navigation'
import { AdminNavigation } from '@/components/layout/admin-navigation'
import {
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Save,
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

interface Condition {
  field: string
  operator: string
  value: any
  logic?: 'AND' | 'OR'
}

interface Department {
  id: number
  name: string
}

const OPERATORS = [
  { value: '==', label: 'Equals', types: ['string', 'number', 'boolean'] },
  { value: '!=', label: 'Not Equals', types: ['string', 'number', 'boolean'] },
  { value: '>', label: 'Greater Than', types: ['number'] },
  { value: '>=', label: 'Greater Than or Equal', types: ['number'] },
  { value: '<', label: 'Less Than', types: ['number'] },
  { value: '<=', label: 'Less Than or Equal', types: ['number'] },
  { value: 'contains', label: 'Contains', types: ['string', 'array'] },
  { value: 'not_contains', label: 'Does Not Contain', types: ['string', 'array'] },
  { value: 'starts_with', label: 'Starts With', types: ['string'] },
  { value: 'ends_with', label: 'Ends With', types: ['string'] },
  { value: 'in', label: 'In List', types: ['string', 'number'] },
  { value: 'not_in', label: 'Not In List', types: ['string', 'number'] },
  { value: 'is_empty', label: 'Is Empty', types: ['string', 'array'] },
  { value: 'is_not_empty', label: 'Is Not Empty', types: ['string', 'array'] },
]

const FIELD_OPTIONS = [
  { value: 'department', label: 'Department', type: 'string' },
  { value: 'use_case', label: 'Use Case', type: 'string' },
  { value: 'data_sensitivity', label: 'Data Sensitivity', type: 'string' },
  { value: 'data_type', label: 'Data Type', type: 'string' },
  { value: 'user_role', label: 'User Role', type: 'string' },
  { value: 'region', label: 'Region', type: 'string' },
  { value: 'model_risk_rating', label: 'Model Risk Rating', type: 'string' },
  { value: 'model_type', label: 'Model Type', type: 'string' },
  { value: 'model_deployment', label: 'Model Deployment', type: 'string' },
  { value: 'model_certification', label: 'Model Certification', type: 'string' },
  { value: 'model_trust_level', label: 'Model Trust Level', type: 'string' },
  { value: 'data_contains_pii', label: 'Contains PII', type: 'boolean' },
  { value: 'risk_score', label: 'Risk Score', type: 'number' },
  { value: 'budget', label: 'Budget', type: 'number' },
]

function RuleCreatePage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    action: 'review' as 'approve' | 'deny' | 'review',
    priority: 50,
    custom_message: '',
    stop_on_match: true,
  })

  const [conditions, setConditions] = useState<Condition[]>([
    { field: 'department', operator: '==', value: '', logic: 'AND' }
  ])

  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/departments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json()
      if (data.success) {
        setDepartments(data.departments)
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error)
    }
  }

  const addCondition = () => {
    setConditions([
      ...conditions,
      { field: 'department', operator: '==', value: '', logic: 'AND' }
    ])
  }

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const newConditions = [...conditions]
    newConditions[index] = { ...newConditions[index], ...updates }
    setConditions(newConditions)
  }

  const toggleLogic = (index: number) => {
    updateCondition(index, {
      logic: conditions[index].logic === 'AND' ? 'OR' : 'AND'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Clean up conditions - remove logic from last condition
      const cleanedConditions = conditions.map((c, i) => {
        if (i === conditions.length - 1) {
          const { logic, ...rest } = c
          return rest
        }
        return c
      })

      const payload = {
        ...formData,
        conditions: cleanedConditions,
        department_ids: selectedDepartments.length > 0 ? selectedDepartments : [],
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/policies/${params.id}/rules`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        router.push(`/admin/policies/${params.id}/rules`)
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to create rule')
      }
    } catch (error) {
      console.error('Failed to create rule:', error)
      alert('Failed to create rule')
    } finally {
      setSaving(false)
    }
  }

  const getActionBadge = (action: string) => {
    const badges = {
      approve: { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-300', label: 'APPROVED' },
      deny: { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-300', label: 'DENIED' },
      review: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'FLAGGED FOR REVIEW' },
    }
    return badges[action as keyof typeof badges] || badges.review
  }

  const selectedBadge = getActionBadge(formData.action)
  const ActionIcon = selectedBadge.icon

  return (
    <>
      <MainNavigation />
      <div className="flex">
        <AdminNavigation className="w-64 min-h-screen" />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
              <Link
                href={`/admin/policies/${params.id}/rules`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Rules
              </Link>
              <h1 className="text-3xl font-bold">Create New Rule</h1>
              <p className="text-gray-600 mt-2">
                Define conditions and actions for automated policy enforcement
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rule Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Rule Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Rule Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Marketing AI for Public Content"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="w-full p-2 border rounded-md"
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of what this rule does"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="action">Action *</Label>
                      <select
                        id="action"
                        className="w-full p-2 border rounded-md"
                        value={formData.action}
                        onChange={(e) => setFormData({ ...formData, action: e.target.value as any })}
                      >
                        <option value="approve">Approve</option>
                        <option value="deny">Deny</option>
                        <option value="review">Flag for Review</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Input
                        id="priority"
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                        placeholder="50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Higher = evaluated first</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conditions Builder */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Conditions</CardTitle>
                    <Button type="button" size="sm" onClick={addCondition}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Condition
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conditions.map((condition, index) => (
                      <div key={index}>
                        {index > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => toggleLogic(index - 1)}
                              className="text-xs font-mono"
                            >
                              {conditions[index - 1].logic || 'AND'}
                            </Button>
                            <span className="text-xs text-gray-500">Click to toggle AND/OR</span>
                          </div>
                        )}

                        <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          {/* Field */}
                          <div className="flex-1">
                            <select
                              className="w-full p-2 border rounded-md text-sm"
                              value={condition.field}
                              onChange={(e) => updateCondition(index, { field: e.target.value })}
                            >
                              {FIELD_OPTIONS.map((field) => (
                                <option key={field.value} value={field.value}>
                                  {field.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Operator */}
                          <div className="flex-1">
                            <select
                              className="w-full p-2 border rounded-md text-sm"
                              value={condition.operator}
                              onChange={(e) => updateCondition(index, { operator: e.target.value })}
                            >
                              {OPERATORS.map((op) => (
                                <option key={op.value} value={op.value}>
                                  {op.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Value */}
                          <div className="flex-1">
                            {['in', 'not_in'].includes(condition.operator) ? (
                              <Input
                                className="text-sm"
                                value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                                onChange={(e) => {
                                  const values = e.target.value.split(',').map(v => v.trim()).filter(v => v)
                                  updateCondition(index, { value: values })
                                }}
                                placeholder="Value1, Value2, Value3"
                              />
                            ) : (
                              <Input
                                className="text-sm"
                                value={condition.value}
                                onChange={(e) => updateCondition(index, { value: e.target.value })}
                                placeholder="Value"
                              />
                            )}
                          </div>

                          {/* Remove Button */}
                          {conditions.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeCondition(index)}
                              className="text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Department Scope */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Scope</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label>Apply to Departments (leave empty for all)</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {departments.map((dept) => (
                      <label key={dept.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDepartments([...selectedDepartments, dept.id])
                            } else {
                              setSelectedDepartments(selectedDepartments.filter(id => id !== dept.id))
                            }
                          }}
                        />
                        <span className="text-sm">{dept.name}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Action Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="custom_message">Custom Message</Label>
                    <textarea
                      id="custom_message"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      value={formData.custom_message}
                      onChange={(e) => setFormData({ ...formData, custom_message: e.target.value })}
                      placeholder="Message shown when this rule matches"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="stop_on_match"
                      checked={formData.stop_on_match}
                      onChange={(e) => setFormData({ ...formData, stop_on_match: e.target.checked })}
                    />
                    <Label htmlFor="stop_on_match" className="mb-0">
                      Stop evaluating other rules when this rule matches
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Rule Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">IF</span>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 ${selectedBadge.color}`}>
                        <ActionIcon className="w-4 h-4" />
                        <span className="font-medium">{selectedBadge.label}</span>
                      </div>
                    </div>
                    <div className="ml-4 space-y-2">
                      {conditions.map((condition, index) => (
                        <div key={index}>
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-sm">
                            <span className="font-medium">{condition.field}</span>
                            <span className="text-gray-500">{condition.operator}</span>
                            <span>{Array.isArray(condition.value) ? condition.value.join(', ') : condition.value || '...'}</span>
                          </span>
                          {index < conditions.length - 1 && (
                            <span className="mx-2 text-sm font-medium text-gray-600">
                              {condition.logic || 'AND'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">THEN →</span>
                      <span className="font-bold">{formData.action.toUpperCase()}</span>
                    </div>
                    {formData.custom_message && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-900">
                        💬 {formData.custom_message}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Creating...' : 'Create Rule'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute requireAdmin>
      <RuleCreatePage />
    </ProtectedRoute>
  )
}
