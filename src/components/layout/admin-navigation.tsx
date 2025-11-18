'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Users, FileText, Database } from 'lucide-react'

interface AdminNavigationProps {
  className?: string
}

export function AdminNavigation({ className = '' }: AdminNavigationProps) {
  const pathname = usePathname()

  const adminLinks = [
    { href: '/admin/users', label: 'Users', icon: Users, description: 'Manage user accounts and roles' },
    { href: '/admin/roles', label: 'Roles & Permissions', icon: Shield, description: 'RBAC configuration' },
    { href: '/admin/policies', label: 'Policies', icon: FileText, description: 'Form templates and policies' },
    { href: '/admin/catalog', label: 'AI Catalog', icon: Database, description: 'AI model inventory' },
  ]

  const isActive = (href: string) => {
    return pathname.startsWith(href)
  }

  return (
    <aside className={`bg-white border-r border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Admin Panel
        </h2>
        <p className="text-sm text-gray-600 mt-1">System configuration</p>
      </div>
      <nav className="p-2">
        {adminLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive(link.href)
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isActive(link.href) ? 'text-indigo-600' : 'text-gray-500'
              }`} />
              <div>
                <div className="font-medium text-sm">{link.label}</div>
                <div className="text-xs text-gray-500">{link.description}</div>
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
