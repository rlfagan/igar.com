'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainNavigation } from '@/components/layout/main-navigation'
import { Settings, Plus, Edit, Eye, Copy, Trash2, Check } from 'lucide-react'

export default function PoliciesAdminPage() {
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
      <main className="min-h-screen bg-gray-50 py-8">
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
              <Button asChild>
                <Link href="/admin/policies/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create AI Policy
                </Link>
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
      </div>
    </main>
    </>
  )
}
