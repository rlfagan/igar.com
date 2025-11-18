'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MainNavigation } from '@/components/layout/main-navigation'
import { AdminNavigation } from '@/components/layout/admin-navigation'
import {
  ArrowLeft,
  Plus,
  GripVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  Info,
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

interface PolicyRule {
  id: number
  name: string
  description?: string
  action: 'approve' | 'deny' | 'review'
  priority: number
  is_active: boolean
  conditions: any[]
  department_ids: number[]
  department_names?: string[]
  stop_on_match: boolean
  custom_message?: string
  created_by_name?: string
  updated_by_name?: string
  created_at: string
  updated_at: string
}

interface Policy {
  id: number
  name: string
  description?: string
  industry: string
}

function PolicyRulesPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [rules, setRules] = useState<PolicyRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPolicy()
      fetchRules()
    }
  }, [params.id])

  const fetchPolicy = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/policies/${params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json()
      if (data.success) {
        setPolicy(data.policy)
      }
    } catch (error) {
      console.error('Failed to fetch policy:', error)
    }
  }

  const fetchRules = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/policies/${params.id}/rules`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json()
      if (data.success) {
        setRules(data.rules)
      }
    } catch (error) {
      console.error('Failed to fetch rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRule = async (ruleId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/policies/${params.id}/rules/${ruleId}/toggle`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        fetchRules()
      }
    } catch (error) {
      console.error('Failed to toggle rule:', error)
    }
  }

  const deleteRule = async (ruleId: number) => {
    if (!confirm('Are you sure you want to delete this rule?')) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/policies/${params.id}/rules/${ruleId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.ok) {
        fetchRules()
      }
    } catch (error) {
      console.error('Failed to delete rule:', error)
    }
  }

  const getActionBadge = (action: string) => {
    const badges = {
      approve: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        label: 'APPROVED',
      },
      deny: {
        icon: XCircle,
        color: 'bg-red-100 text-red-800',
        label: 'DENIED',
      },
      review: {
        icon: AlertCircle,
        color: 'bg-yellow-100 text-yellow-800',
        label: 'FLAGGED FOR REVIEW',
      },
    }

    const badge = badges[action as keyof typeof badges] || badges.review
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="flex">
          <AdminNavigation className="w-64 min-h-screen" />
          <main className="flex-1 bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
              <p className="text-center py-12">Loading rules...</p>
            </div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <MainNavigation />
      <div className="flex">
        <AdminNavigation className="w-64 min-h-screen" />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/admin/policies"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Policies
              </Link>

              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{policy?.name} - Rules</h1>
                  <p className="text-gray-600 mt-2">
                    Define automated approval, denial, and review rules for this policy
                  </p>
                </div>
                <Button onClick={() => router.push(`/admin/policies/${params.id}/rules/create`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            </div>

            {/* Info Card */}
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">How Rules Work</p>
                    <p>
                      Rules are evaluated in priority order (highest to lowest). When a submission matches
                      a rule's conditions, the rule's action is applied. Rules can automatically{' '}
                      <strong>approve</strong>, <strong>deny</strong>, or <strong>flag for review</strong>{' '}
                      submissions based on department, use case, data sensitivity, and other criteria.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rules List */}
            {rules.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No rules configured yet</p>
                  <Button onClick={() => router.push(`/admin/policies/${params.id}/rules/create`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Rule
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <Card
                    key={rule.id}
                    className={`${!rule.is_active ? 'opacity-60' : ''} hover:shadow-md transition-shadow`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Drag Handle */}
                          <div className="text-gray-400 cursor-move">
                            <GripVertical className="w-5 h-5" />
                          </div>

                          {/* Rule Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-mono text-gray-500">
                                Priority: {rule.priority}
                              </span>
                              {getActionBadge(rule.action)}
                              {!rule.is_active && (
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                                  Inactive
                                </span>
                              )}
                            </div>

                            <CardTitle className="text-lg mb-1">{rule.name}</CardTitle>

                            {rule.description && (
                              <CardDescription>{rule.description}</CardDescription>
                            )}

                            {/* Conditions Preview */}
                            <div className="mt-3 space-y-2">
                              <p className="text-sm font-medium text-gray-700">IF</p>
                              <div className="flex flex-wrap gap-2">
                                {rule.conditions.map((condition: any, i: number) => (
                                  <div key={i}>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-md border border-gray-300">
                                      <span className="font-medium">{condition.field}</span>
                                      <span className="text-gray-500">{condition.operator}</span>
                                      <span className="text-gray-900">
                                        {Array.isArray(condition.value)
                                          ? condition.value.join(', ')
                                          : condition.value}
                                      </span>
                                    </span>
                                    {i < rule.conditions.length - 1 && (
                                      <span className="mx-2 text-sm font-medium text-gray-500">
                                        {condition.logic || 'AND'}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {rule.department_names && rule.department_names.length > 0 && (
                                <p className="text-xs text-gray-600 mt-2">
                                  Applies to: {rule.department_names.join(', ')}
                                </p>
                              )}
                            </div>

                            {/* Custom Message */}
                            {rule.custom_message && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <p className="text-sm text-gray-700">{rule.custom_message}</p>
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="mt-3 text-xs text-gray-500">
                              Created by {rule.created_by_name || 'Unknown'} •{' '}
                              {new Date(rule.created_at).toLocaleDateString()}
                              {rule.updated_at !== rule.created_at && (
                                <> • Last updated {new Date(rule.updated_at).toLocaleDateString()}</>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRule(rule.id)}
                            title={rule.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {rule.is_active ? (
                              <Power className="w-4 h-4" />
                            ) : (
                              <PowerOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/policies/${params.id}/rules/${rule.id}/edit`)
                            }
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRule(rule.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute requireAdmin>
      <PolicyRulesPage />
    </ProtectedRoute>
  )
}
