'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainNavigation } from '@/components/layout/main-navigation'
import { AdminNavigation } from '@/components/layout/admin-navigation'
import { Settings, Plus, Edit, Eye, Copy, Trash2, Check } from 'lucide-react'

export default function PoliciesAdminPage() {
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policies`)
      const data = await response.json()
      if (data.success) {
        setPolicies(data.policies)
      }
    } catch (error) {
      console.error('Failed to fetch policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIndustryBadgeColor = (industry: string) => {
    const colors: Record<string, string> = {
      fintech: 'bg-blue-100 text-blue-800',
      healthcare: 'bg-green-100 text-green-800',
      retail: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800',
    }
    return colors[industry] || colors.general
  }

  if (loading) {
    return (
      <>
        <MainNavigation />
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <p className="text-center py-12">Loading policies...</p>
          </div>
        </main>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Form Policy Management</h1>
              <p className="text-gray-600 mt-2">
                Manage intake form templates for different industries and organizations
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Policy
              </Button>
            </div>
          </div>
        </div>

        {/* Policies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{policy.name}</CardTitle>
                  {policy.is_default && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getIndustryBadgeColor(policy.industry)}`}>
                    {policy.industry || 'general'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${policy.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {policy.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <CardDescription>{policy.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/admin/policies/${policy.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/admin/policies/${policy.id}/preview`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </Link>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Created: {new Date(policy.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Policy Modal - Only render on client side to avoid hydration errors */}
        {mounted && showCreateModal && (
          <CreatePolicyModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false)
              fetchPolicies()
            }}
          />
        )}
      </div>
        </main>
      </div>
    </>
  )
}

function CreatePolicyModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    industry: 'general',
    is_default: false,
  })
  const [templatePolicies, setTemplatePolicies] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Fetch available template policies
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policies`)
        const data = await response.json()
        if (data.success && data.policies) {
          setTemplatePolicies(data.policies)
        } else {
          // No policies available yet - that's fine, user can create the first one
          setTemplatePolicies([])
        }
      } catch (error) {
        console.error('Failed to fetch template policies:', error)
        setTemplatePolicies([])
      }
    }
    fetchTemplates()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Create the policy with template_id if a template was selected
      const payload = {
        ...formData,
        template_id: selectedTemplate ? parseInt(selectedTemplate) : undefined,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onSuccess()
      } else {
        alert('Failed to create policy')
      }
    } catch (error) {
      console.error('Create policy error:', error)
      alert('Failed to create policy')
    } finally {
      setSaving(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Create New Policy</CardTitle>
          <CardDescription>
            Create a new form policy template for an industry or use case
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Template Selector */}
            <div>
              <Label htmlFor="template">Load from Template (Optional)</Label>
              <select
                id="template"
                className="w-full p-2 border rounded-md"
                value={selectedTemplate}
                onChange={async (e) => {
                  const templateId = e.target.value
                  setSelectedTemplate(templateId)

                  if (templateId) {
                    // Load template data
                    try {
                      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policies/${templateId}`)
                      const data = await response.json()
                      if (data.success && data.policy) {
                        const template = data.policy
                        setFormData({
                          name: template.name + ' (Copy)',
                          slug: generateSlug(template.name + '-copy'),
                          description: template.description || '',
                          industry: template.industry || 'general',
                          is_default: false,
                        })
                      }
                    } catch (error) {
                      console.error('Failed to load template:', error)
                    }
                  }
                }}
              >
                <option value="">Start from Scratch</option>
                {templatePolicies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.name} ({policy.industry})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select a template to copy its structure and fields
              </p>
            </div>

            <div>
              <Label htmlFor="name">Policy Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }}
                placeholder="e.g., Insurance AI Compliance"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., insurance-compliance"
              />
              <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                className="w-full p-2 border rounded-md"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this policy template"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <select
                id="industry"
                className="w-full p-2 border rounded-md"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                <option value="general">General Enterprise</option>
                <option value="fintech">Financial Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail & E-commerce</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="government">Government</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                className="mr-2"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              />
              <Label htmlFor="is_default" className="mb-0">Set as default policy</Label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Creating...' : 'Create Policy'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
