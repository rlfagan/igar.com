'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Shield,
  House,
  FileText,
  ChartBar,
  Gear,
  User,
  SignOut,
  List,
  CaretDown,
  MagnifyingGlass
} from '@phosphor-icons/react'

interface MainNavigationProps {
  userName?: string
  userRole?: string
}

export function MainNavigation({ userName = 'User', userRole = 'admin' }: MainNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <House weight="fill" /> },
    { href: '/research', label: 'Research', icon: <MagnifyingGlass weight="fill" /> },
    { href: '/intake', label: 'New Intake', icon: <FileText weight="fill" /> },
    { href: '/submissions', label: 'Submissions', icon: <List weight="fill" /> },
    { href: '/governance', label: 'Governance', icon: <Shield weight="fill" /> },
  ]

  // Add admin link if user is admin
  if (userRole === 'admin' || user?.role === 'admin') {
    navItems.push({ href: '/admin/policies', label: 'Admin', icon: <Gear weight="fill" /> })
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="border-b border-neutral-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-sky-600 rounded-lg flex items-center justify-center">
              <Shield weight="fill" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent leading-none">
                IGAR.ai
              </h1>
              <p className="text-[9px] text-primary-600 leading-none">
                Intelligent Governance & Risk
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  className={`flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      : 'text-primary-600 hover:text-primary-900'
                  }`}
                >
                  <span className="w-4 h-4">{item.icon}</span>
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-sky-600 rounded-full flex items-center justify-center">
                <User weight="fill" className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-primary-900">{user?.name || userName}</p>
                <p className="text-xs text-primary-600">{user?.role || userRole}</p>
              </div>
              <CaretDown className="w-4 h-4 text-primary-600" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-20">
                  <div className="px-4 py-3 border-b border-neutral-200">
                    <p className="text-sm font-medium text-primary-900">{user?.email || 'user@company.com'}</p>
                    <p className="text-xs text-primary-600">{user?.role || userRole}</p>
                  </div>
                  <Link href="/profile" onClick={() => setShowUserMenu(false)}>
                    <button className="w-full px-4 py-2 text-left text-sm text-primary-700 hover:bg-neutral-50 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile Settings
                    </button>
                  </Link>
                  <Link href="/admin/policies" onClick={() => setShowUserMenu(false)}>
                    <button className="w-full px-4 py-2 text-left text-sm text-primary-700 hover:bg-neutral-50 flex items-center gap-2">
                      <Gear className="w-4 h-4" />
                      Admin Settings
                    </button>
                  </Link>
                  <div className="border-t border-neutral-200 my-2" />
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <SignOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
