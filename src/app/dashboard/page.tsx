'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiskBadge, ComplianceBadge } from '@/components/ui/risk-badge'
import { MainNavigation } from '@/components/layout/main-navigation'
import { AIChatAssistant } from '@/components/ai-chat-assistant'
import {
  ClockCounterClockwise,
  WarningCircle,
  CheckCircle,
  TrendUp,
  TrendDown,
  ShieldWarning,
  Lightning,
  Eye,
  Clock,
  Database,
  Users,
  Bell,
  ArrowRight,
  Sparkle,
  XCircle,
  CaretUp,
  CaretDown
} from '@phosphor-icons/react'

interface Submission {
  id: number
  title: string
  model_type: string
  risk_score: number
  status: string
  submitted_at: string
  submitter_name: string
}

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/submissions`)
      const data = await response.json()

      if (data.success) {
        setSubmissions(data.submissions || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <p className="text-primary-600">Loading dashboard...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-950 mb-2">AI Governance Command Center</h1>
            <p className="text-primary-600">Real-time visibility into enterprise AI risk, exposure, and compliance</p>
          </div>

          {/* Top KPIs - Emotionally Charged */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Org-wide Risk - RED, ALARMING */}
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <ShieldWarning weight="fill" className="w-7 h-7 text-red-600" />
                  </div>
                  <Badge className="bg-red-600 text-white">Critical</Badge>
                </div>
                <p className="text-sm text-primary-600 mb-1">Org-wide AI Risk</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-red-600">68</p>
                  <p className="text-2xl text-red-500">/100</p>
                </div>
                <p className="text-sm text-red-700 font-medium mt-2">High Risk</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                  <CaretUp weight="fill" className="w-4 h-4" />
                  <span>+3 pts this week</span>
                </div>
              </CardContent>
            </Card>

            {/* Exposure Surface */}
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Database weight="fill" className="w-7 h-7 text-orange-600" />
                  </div>
                  <Badge className="bg-orange-600 text-white">Exposure</Badge>
                </div>
                <p className="text-sm text-primary-600 mb-1">Active AI Systems</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-orange-600">41</p>
                  <p className="text-lg text-orange-500">systems</p>
                </div>
                <p className="text-sm text-orange-700 font-medium mt-2">12 High-Risk</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                  <CaretUp weight="fill" className="w-4 h-4" />
                  <span>+5 new this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Health - TRENDING */}
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <CheckCircle weight="fill" className="w-7 h-7 text-amber-600" />
                  </div>
                  <Badge className="bg-amber-600 text-white">Declining</Badge>
                </div>
                <p className="text-sm text-primary-600 mb-1">Compliance Health</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-amber-600">82</p>
                  <p className="text-2xl text-amber-500">%</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CaretDown weight="fill" className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-600 font-semibold">↓ 4% this week</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">3 controls failed</p>
              </CardContent>
            </Card>

            {/* Review Velocity - PROGRESS */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Lightning weight="fill" className="w-7 h-7 text-emerald-600" />
                  </div>
                  <Badge className="bg-emerald-600 text-white">Improving</Badge>
                </div>
                <p className="text-sm text-primary-600 mb-1">Review Velocity</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-emerald-600">1.8</p>
                  <p className="text-lg text-emerald-500">days</p>
                </div>
                <p className="text-sm text-emerald-700 font-medium mt-2">Avg time to review</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                  <TrendDown weight="bold" className="w-4 h-4" />
                  <span>Down from 2.4d (25% faster)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Risk Heatmap + Events */}
            <div className="col-span-8 space-y-6">
              {/* Risk Heatmap - CENTER STAGE */}
              <Card className="border-neutral-300">
                <CardHeader className="border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">AI System Risk Heatmap</CardTitle>
                      <p className="text-sm text-primary-600 mt-1">Real-time risk exposure across all active systems</p>
                    </div>
                    <Link href="/submissions">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 bg-slate-50">
                  {/* Heatmap Grid */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-6 gap-2 text-xs font-medium text-primary-600 mb-4">
                      <div></div>
                      <div className="text-center">Data Gov</div>
                      <div className="text-center">Safety</div>
                      <div className="text-center">Legal</div>
                      <div className="text-center">Security</div>
                      <div className="text-center">Model</div>
                    </div>

                    {[
                      { name: 'Credit Underwriting AI', scores: [85, 72, 78, 45, 68], total: 75 },
                      { name: 'HR Screening Tool', scores: [92, 88, 95, 52, 71], total: 84 },
                      { name: 'Customer Support Bot', scores: [35, 42, 28, 38, 45], total: 38 },
                      { name: 'Fraud Detection Model', scores: [68, 75, 71, 82, 78], total: 75 },
                      { name: 'Marketing Personalization', scores: [78, 35, 68, 42, 55], total: 56 },
                      { name: 'Medical Diagnosis Assistant', scores: [88, 95, 92, 68, 85], total: 86 },
                      { name: 'Document Classification', scores: [25, 32, 28, 35, 38], total: 32 }
                    ].map((system, idx) => (
                      <div key={idx} className="grid grid-cols-6 gap-2 items-center">
                        <div className="text-sm font-medium text-primary-900 truncate">{system.name}</div>
                        {system.scores.map((score, i) => (
                          <div
                            key={i}
                            className={`h-12 rounded flex items-center justify-center text-xs font-bold border ${
                              score >= 80
                                ? 'bg-red-100 text-red-900 border-red-300'
                                : score >= 60
                                ? 'bg-orange-100 text-orange-900 border-orange-300'
                                : score >= 40
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            {score}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-6 mt-6 pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                      <span className="text-xs text-primary-600">Critical (80+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                      <span className="text-xs text-primary-600">High (60-79)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
                      <span className="text-xs text-primary-600">Medium (40-59)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded"></div>
                      <span className="text-xs text-primary-600">Low (&lt;40)</span>
                    </div>                  </div>
                </CardContent>
              </Card>

              {/* This Week's Risk Events - TIMELINE */}
              <Card className="border-neutral-300">
                <CardHeader className="border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">This Week's Risk Events</CardTitle>
                      <p className="text-sm text-primary-600 mt-1">Time-sensitive governance alerts</p>
                    </div>
                    <Badge className="bg-red-100 text-red-700">8 Critical</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      {
                        time: '2 hours ago',
                        type: 'critical',
                        icon: <ShieldWarning weight="fill" />,
                        title: 'High-risk submission requires immediate review',
                        description: 'Credit Underwriting AI - Class 4 fine-tuning with PII exposure',
                        action: 'Review Now',
                        link: '/submissions'
                      },
                      {
                        time: '5 hours ago',
                        type: 'warning',
                        icon: <XCircle weight="fill" />,
                        title: 'Compliance control failed',
                        description: 'EU DPIA overdue for HR Screening Tool (14 days past deadline)',
                        action: 'View Details',
                        link: '/submissions'
                      },
                      {
                        time: 'Today, 9:30 AM',
                        type: 'alert',
                        icon: <Clock weight="fill" />,
                        title: 'Model drift detected',
                        description: 'Fraud Detection Model showing 12% accuracy degradation',
                        action: 'Investigate',
                        link: '/submissions'
                      },
                      {
                        time: 'Yesterday',
                        type: 'critical',
                        icon: <WarningCircle weight="fill" />,
                        title: 'Missing safety testing evidence',
                        description: 'Medical Diagnosis Assistant lacks adversarial robustness testing',
                        action: 'Upload Evidence',
                        link: '/intake'
                      },
                      {
                        time: 'Yesterday',
                        type: 'info',
                        icon: <Bell weight="fill" />,
                        title: 'New model added without approval',
                        description: 'Marketing team deployed sentiment analysis tool (shadow AI)',
                        action: 'Request Intake',
                        link: '/intake'
                      }
                    ].map((event, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-4 p-4 rounded-lg border-l-4 ${
                          event.type === 'critical'
                            ? 'bg-red-50 border-red-500'
                            : event.type === 'warning'
                            ? 'bg-orange-50 border-orange-500'
                            : event.type === 'alert'
                            ? 'bg-amber-50 border-amber-500'
                            : 'bg-sky-50 border-sky-500'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            event.type === 'critical'
                              ? 'bg-red-100 text-red-600'
                              : event.type === 'warning'
                              ? 'bg-orange-100 text-orange-600'
                              : event.type === 'alert'
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-sky-100 text-sky-600'
                          }`}
                        >
                          <div className="w-5 h-5">{event.icon}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-semibold text-primary-950">{event.title}</p>
                            <span className="text-xs text-primary-500">{event.time}</span>
                          </div>
                          <p className="text-sm text-primary-700 mb-3">{event.description}</p>
                          <Link href={event.link}>
                            <Button size="sm" variant="outline" className="text-xs">
                              {event.action}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Compliance + Trends */}
            <div className="col-span-4 space-y-6">
              {/* Actionable Compliance Section */}
              <Card className="border-red-300 bg-gradient-to-br from-red-50 to-white">
                <CardHeader className="border-b border-red-200">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <WarningCircle weight="fill" className="w-5 h-5 text-red-600" />
                    Compliance Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* ISO 42001 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-primary-950">ISO/IEC 42001</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-orange-600">82%</span>
                        <CaretDown weight="fill" className="w-5 h-5 text-red-500" />
                      </div>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 mb-3">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '82%' }} />
                    </div>
                    <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                      <p className="font-medium text-red-900 mb-2">3 controls failed this week:</p>
                      <div className="flex items-start gap-2 text-red-700">
                        <XCircle weight="fill" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Safety testing evidence missing (2 systems)</span>
                      </div>
                      <div className="flex items-start gap-2 text-red-700">
                        <XCircle weight="fill" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>EU DPIA overdue (HR Screening Tool)</span>
                      </div>
                      <div className="flex items-start gap-2 text-red-700">
                        <XCircle weight="fill" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Dataset documentation incomplete (3 systems)</span>
                      </div>
                    </div>
                  </div>

                  {/* EU AI Act */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-primary-950">EU AI Act</p>
                      <span className="text-2xl font-bold text-emerald-600">75%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 mb-3">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-primary-700">High-Risk Systems:</span>
                        <span className="font-bold text-primary-950">12</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle weight="fill" className="w-4 h-4" />
                          <span>9 fully compliant</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-700">
                          <WarningCircle weight="fill" className="w-4 h-4" />
                          <span>3 need conformity assessment</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <ShieldWarning weight="fill" className="w-4 h-4 mr-2" />
                    Address Critical Issues
                  </Button>
                </CardContent>
              </Card>

              {/* What's Changing - Trend Feed */}
              <Card className="border-neutral-300">
                <CardHeader className="border-b border-neutral-200">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendUp weight="bold" className="w-5 h-5 text-indigo-600" />
                    What's Changing?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      {
                        icon: <Database weight="fill" className="w-4 h-4 text-indigo-600" />,
                        title: 'AI adoption increased 12% this quarter',
                        trend: 'up'
                      },
                      {
                        icon: <ShieldWarning weight="fill" className="w-4 h-4 text-orange-600" />,
                        title: 'New high-risk use cases emerging: HR screening',
                        trend: 'warning'
                      },
                      {
                        icon: <Lightning weight="fill" className="w-4 h-4 text-amber-600" />,
                        title: 'Model modifications trending upward (LoRA +19%)',
                        trend: 'up'
                      },
                      {
                        icon: <Clock weight="fill" className="w-4 h-4 text-emerald-600" />,
                        title: 'Average review time decreased by 18%',
                        trend: 'down-good'
                      },
                      {
                        icon: <Users weight="fill" className="w-4 h-4 text-sky-600" />,
                        title: '3 new teams onboarded to governance process',
                        trend: 'up'
                      }
                    ].map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                        <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {insight.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-primary-900">{insight.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Predictive AI Assistant */}
              <Card className="border-indigo-300 bg-gradient-to-br from-indigo-50 to-white">
                <CardHeader className="border-b border-indigo-200">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkle weight="fill" className="w-5 h-5 text-indigo-600" />
                    AI Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-3 bg-white rounded-lg border border-indigo-200">
                      <p className="text-sm text-primary-900 mb-2">
                        <strong>Based on patterns:</strong> 2 more high-risk submissions expected this week
                      </p>
                      <p className="text-xs text-indigo-600">87% confidence</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-orange-200">
                      <p className="text-sm text-primary-900 mb-2">
                        <strong>Alert:</strong> Average review time increased by 18% — consider adding reviewers
                      </p>
                      <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                        View Reviewer Capacity
                      </Button>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-sky-200">
                      <p className="text-sm text-primary-900 mb-2">
                        <strong>Regulatory Update:</strong> New EU guidance released today — 4 systems may need reassessment
                      </p>
                      <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                        Review Guidance
                      </Button>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-amber-200">
                      <p className="text-sm text-primary-900 mb-2">
                        <strong>Drift Forecast:</strong> 3 systems likely to drift within 30 days
                      </p>
                      <p className="text-xs text-amber-700">Medical Diagnosis, Fraud Detection, Credit Underwriting</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Assistant */}
      <AIChatAssistant
        context={{
          page: 'Dashboard',
          warnings: [
            'Critical: High discrimination risk (ECOA violation) - Credit Underwriting Model',
            'Missing safety testing evidence - Medical Diagnosis Assistant',
            'New model added without approval - Sentiment Analysis Tool (shadow AI)',
            'Missing model card documentation'
          ],
          riskScores: {
            'Discrimination Risk': 85,
            'Data Privacy': 67,
            'Model Performance': 78,
            'Transparency': 92,
            'Compliance': 72
          },
          complianceIssues: [
            'ECOA compliance violation detected in Credit Underwriting Model',
            'Missing documentation for 3 AI models',
            'Adversarial robustness testing not completed for Medical Diagnosis Assistant'
          ]
        }}
      />
    </>
  )
}
