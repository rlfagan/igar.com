'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiskBadge, ComplianceBadge } from '@/components/ui/risk-badge'
import { MainNavigation } from '@/components/layout/main-navigation'
import {
  ShieldCheck,
  Cube,
  ChatText,
  MagnifyingGlass,
  GitBranch,
  Lightning,
  Shield,
  Code,
  Users,
  CheckCircle,
  Clock,
  Certificate,
  ChartBar,
} from '@phosphor-icons/react'

interface ModificationClass {
  id: number
  class_number: number
  class_name: string
  risk_level: string
  description: string
  required_evidence: string[]
}

export default function GovernancePage() {
  const [modClasses, setModClasses] = useState<ModificationClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModificationClasses()
  }, [])

  const fetchModificationClasses = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/governance/modification-classes`
      )
      const data = await response.json()

      if (data.success) {
        setModClasses(data.modification_classes || [])
      }
    } catch (error) {
      console.error('Failed to fetch modification classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const classIcons = [
    <Cube key="0" weight="fill" className="w-6 h-6" />,
    <ChatText key="1" weight="fill" className="w-6 h-6" />,
    <MagnifyingGlass key="2" weight="fill" className="w-6 h-6" />,
    <GitBranch key="3" weight="fill" className="w-6 h-6" />,
    <Lightning key="4" weight="fill" className="w-6 h-6" />,
    <Shield key="5" weight="fill" className="w-6 h-6" />,
    <Code key="6" weight="fill" className="w-6 h-6" />,
  ]

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Very High':
        return 'border-red-300 bg-red-50'
      case 'High':
        return 'border-orange-300 bg-orange-50'
      case 'Medium-High':
        return 'border-amber-300 bg-amber-50'
      case 'Medium':
        return 'border-yellow-200 bg-yellow-50'
      case 'Low':
        return 'border-emerald-200 bg-emerald-50'
      default:
        return 'border-neutral-200 bg-neutral-50'
    }
  }

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <p className="text-primary-600">Loading governance framework...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck weight="fill" className="w-6 h-6 text-primary-900" />
              <h1 className="text-2xl font-bold text-primary-950">AI Governance Framework</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Certificate className="w-4 h-4 mr-2" />
                ISO 42001
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                EU AI Act
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-indigo-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-primary-600 mb-1">Active Systems</p>
                  <p className="text-3xl font-bold text-primary-950">35</p>
                  <p className="text-xs text-indigo-600 mt-2">Across all classes</p>
                </div>
                <ShieldCheck weight="fill" className="w-10 h-10 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-primary-600 mb-1">Pending Approvals</p>
                  <p className="text-3xl font-bold text-primary-950">8</p>
                  <p className="text-xs text-amber-600 mt-2">Need review</p>
                </div>
                <Clock weight="fill" className="w-10 h-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-primary-600 mb-1">Compliant</p>
                  <p className="text-3xl font-bold text-primary-950">24</p>
                  <p className="text-xs text-emerald-600 mt-2">Fully approved</p>
                </div>
                <CheckCircle weight="fill" className="w-10 h-10 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-sky-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-primary-600 mb-1">Governance Roles</p>
                  <p className="text-3xl font-bold text-primary-950">11</p>
                  <p className="text-xs text-sky-600 mt-2">Active reviewers</p>
                </div>
                <Users weight="fill" className="w-10 h-10 text-sky-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modification Classes */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg mb-1">
                  ISO/IEC 42001 Model Modification Classes
                </CardTitle>
                <p className="text-sm text-primary-600">
                  Risk-based classification framework for AI system modifications
                </p>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ChartBar className="w-4 h-4 mr-2" />
                  View analytics
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modClasses.map((modClass, index) => (
                <Card
                  key={modClass.id}
                  className={`${getRiskColor(modClass.risk_level)} border-2 hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          modClass.risk_level === 'Very High' || modClass.risk_level === 'High'
                            ? 'bg-red-100 text-red-700'
                            : modClass.risk_level === 'Medium-High' ||
                              modClass.risk_level === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {classIcons[modClass.class_number]}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-primary-950">
                              Class {modClass.class_number}: {modClass.class_name}
                            </h3>
                            <p className="text-sm text-primary-700 mt-1">
                              {modClass.description}
                            </p>
                          </div>
                          <Badge
                            variant={
                              modClass.risk_level === 'Very High' || modClass.risk_level === 'High'
                                ? 'error'
                                : modClass.risk_level === 'Medium-High' ||
                                  modClass.risk_level === 'Medium'
                                ? 'warning'
                                : 'success'
                            }
                          >
                            {modClass.risk_level} Risk
                          </Badge>
                        </div>

                        {/* Required Evidence */}
                        <div className="mt-3">
                          <p className="text-xs font-medium text-primary-600 mb-2">
                            Required Evidence:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {modClass.required_evidence.slice(0, 3).map((evidence, idx) => (
                              <Badge key={idx} variant="secondary" size="sm">
                                {evidence}
                              </Badge>
                            ))}
                            {modClass.required_evidence.length > 3 && (
                              <Badge variant="secondary" size="sm">
                                +{modClass.required_evidence.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex gap-2">
                          <Link href="/governance">
                            <Button variant="outline" size="sm">
                              View details
                            </Button>
                          </Link>
                          <Link href="/submissions">
                            <Button variant="outline" size="sm">
                              View submissions
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Governance Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users weight="fill" className="w-5 h-5" />
              Governance Roles & Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Model Owner', required: [0, 1, 2, 3, 4, 5, 6] },
                { name: 'Technical Reviewer', required: [0, 1, 2] },
                { name: 'AI Safety Officer', required: [3, 4, 5, 6] },
                { name: 'Data Governance Officer', required: [2, 3, 4] },
                { name: 'Security Reviewer', required: [2, 3, 4, 5, 6] },
                { name: 'Legal Counsel', required: [4, 6] },
                { name: 'Data Protection Officer', required: [4] },
                { name: 'Chief AI Officer', required: [4, 6] },
                { name: 'CISO', required: [4, 6] },
                { name: 'CTO', required: [6] },
                { name: 'Ethics Board', required: [4, 5] },
              ].map((role) => (
                <Card key={role.name} className="border-neutral-200">
                  <CardContent className="pt-4">
                    <h4 className="font-medium text-primary-900 mb-2">{role.name}</h4>
                    <p className="text-xs text-primary-600 mb-2">Required for classes:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.required.map((classNum) => (
                        <Badge key={classNum} variant="secondary" size="sm">
                          {classNum}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      </div>
    </>
  )
}
