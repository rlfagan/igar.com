'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MainNavigation } from '@/components/layout/main-navigation'
import { AdminNavigation } from '@/components/layout/admin-navigation'
import { Shield, Users, FileText, Database, ArrowRight } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    policies: 0,
    models: 0,
    loading: true,
  })
  const { token } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch users count
      const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const usersData = await usersResponse.json()

      // Fetch policies count
      const policiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/policies`)
      const policiesData = await policiesResponse.json()

      // Fetch models count
      const modelsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-catalog/models`)
      const modelsData = await modelsResponse.json()

      setStats({
        users: usersData.success ? usersData.users.length : 0,
        policies: policiesData.success ? policiesData.policies.length : 0,
        models: modelsData.success ? modelsData.models.length : 0,
        loading: false,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStats({ ...stats, loading: false })
    }
  }

  const adminSections = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      stat: stats.users,
      statLabel: 'users',
    },
    {
      title: 'Roles & Permissions',
      description: 'Configure RBAC and view role definitions',
      icon: Shield,
      href: '/admin/roles',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      stat: '3',
      statLabel: 'roles',
    },
    {
      title: 'Policy Templates',
      description: 'Manage intake form templates and policies',
      icon: FileText,
      href: '/admin/policies',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      stat: stats.policies,
      statLabel: 'policies',
    },
    {
      title: 'AI Model Catalog',
      description: 'View and manage AI model inventory',
      icon: Database,
      href: '/admin/catalog',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      stat: stats.models,
      statLabel: 'models',
    },
  ]

  return (
    <>
      <MainNavigation />
      <div className="flex">
        <AdminNavigation className="w-64 min-h-screen" />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="w-8 h-8" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                System administration and configuration
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {adminSections.map((section) => (
                <Link key={section.href} href={section.href}>
                  <Card className={`border-2 ${section.color} hover:shadow-lg transition-shadow cursor-pointer h-full`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2 mb-2">
                            <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                            {section.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {section.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold">{stats.loading ? '...' : section.stat}</div>
                          <div className="text-sm text-gray-600">{section.statLabel}</div>
                        </div>
                        <ArrowRight className={`w-6 h-6 ${section.iconColor}`} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* System Overview */}
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Quick access to common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Recent Activity</h4>
                      <p className="text-sm text-gray-600">
                        View user activity, system logs, and audit trails
                      </p>
                      <Link href="/admin/activity" className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                        View Activity →
                      </Link>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">System Settings</h4>
                      <p className="text-sm text-gray-600">
                        Configure system-wide settings and preferences
                      </p>
                      <Link href="/admin/settings" className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                        Manage Settings →
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
