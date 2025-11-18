'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MainNavigation } from '@/components/layout/main-navigation'
import { AdminNavigation } from '@/components/layout/admin-navigation'
import { Shield, Users, CheckCircle } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

interface RoleInfo {
  name: string
  displayName: string
  description: string
  permissions: string[]
  color: string
  icon: string
}

function RolesAdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const roles: RoleInfo[] = [
    {
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full system access with all privileges. Can manage users, policies, and system settings.',
      permissions: [
        'Manage all users',
        'Create and delete users',
        'Modify user roles',
        'Manage policies and templates',
        'Access admin dashboard',
        'View all submissions',
        'Configure system settings',
        'Manage AI catalog',
      ],
      color: 'bg-red-50 border-red-200',
      icon: 'Shield',
    },
    {
      name: 'reviewer',
      displayName: 'Reviewer',
      description: 'Can review and approve AI intake submissions. Limited administrative access.',
      permissions: [
        'Review AI submissions',
        'Approve or reject requests',
        'View submission history',
        'Access review dashboard',
        'Comment on submissions',
        'Request additional information',
      ],
      color: 'bg-blue-50 border-blue-200',
      icon: 'CheckCircle',
    },
    {
      name: 'user',
      displayName: 'User',
      description: 'Standard user with basic access. Can submit AI intake requests and view their own submissions.',
      permissions: [
        'Submit AI intake requests',
        'View own submissions',
        'Edit draft submissions',
        'Upload supporting documents',
        'Track request status',
      ],
      color: 'bg-gray-50 border-gray-200',
      icon: 'Users',
    },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleCount = (roleName: string) => {
    return users.filter(user => user.role === roleName).length
  }

  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-8 h-8" />
      case 'CheckCircle':
        return <CheckCircle className="w-8 h-8" />
      case 'Users':
        return <Users className="w-8 h-8" />
      default:
        return <Shield className="w-8 h-8" />
    }
  }

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="flex">
          <AdminNavigation className="w-64 min-h-screen" />
          <main className="flex-1 bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
              <p className="text-center py-12">Loading roles...</p>
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Role-Based Access Control (RBAC)</h1>
                <p className="text-gray-600 mt-2">
                  Manage roles and permissions for the AI Intake & Governance System
                </p>
              </div>
            </div>
          </div>

          {/* Roles Grid */}
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {roles.map((role) => (
              <Card key={role.name} className={`border-2 ${role.color}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getRoleIcon(role.icon)}
                        {role.displayName}
                      </CardTitle>
                      <CardDescription className="mt-2">{role.description}</CardDescription>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {getRoleCount(role.name)} {getRoleCount(role.name) === 1 ? 'user' : 'users'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Permissions:</h4>
                    <ul className="space-y-1">
                      {role.permissions.map((permission, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Role Assignment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Role Assignment</CardTitle>
              <CardDescription>
                How to manage user roles in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Assigning Roles</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    To assign or modify a user's role:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Navigate to the <span className="font-medium">User Management</span> page</li>
                    <li>Click the <span className="font-medium">Edit</span> button next to the user</li>
                    <li>Select the appropriate role from the dropdown</li>
                    <li>Click <span className="font-medium">Save Changes</span> to apply</li>
                  </ol>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Best Practices</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Limit admin access to only necessary personnel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Assign reviewer role to compliance and security team members</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Regular users should only have user role unless additional privileges are required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Periodically review user roles and adjust as needed</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Current Role Distribution</h4>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    {roles.map((role) => (
                      <div key={role.name} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold">{getRoleCount(role.name)}</div>
                        <div className="text-sm text-gray-600 mt-1">{role.displayName}s</div>
                      </div>
                    ))}
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
      <RolesAdminPage />
    </ProtectedRoute>
  )
}
