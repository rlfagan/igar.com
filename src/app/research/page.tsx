'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MainNavigation } from '@/components/layout/main-navigation'
import {
  MagnifyingGlass,
  Funnel,
  ShoppingCart,
  CheckCircle,
  Sparkle,
  Plus,
  Trash,
  ArrowRight,
  ShieldCheck,
  Clock,
  User,
} from '@phosphor-icons/react'

interface AITool {
  id: string
  name: string
  vendor: string
  category: string
  description: string
  risk_level: 'low' | 'medium' | 'high'
  previously_approved?: {
    date: string
    approver: string
    risk_score: number
    submission_id: number
  }
}

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedVendor, setSelectedVendor] = useState('all')
  const [selectedBasket, setSelectedBasket] = useState<AITool[]>([])
  const [showFilters, setShowFilters] = useState(true)

  // Sample AI tools data with previous approvals
  const allTools: AITool[] = [
    {
      id: '1',
      name: 'GPT-4 Turbo',
      vendor: 'OpenAI',
      category: 'Large Language Model',
      description: 'Most capable GPT-4 model with 128k context window',
      risk_level: 'high',
      previously_approved: {
        date: '2024-03-15',
        approver: 'Sarah Chen',
        risk_score: 72,
        submission_id: 42
      }
    },
    {
      id: '2',
      name: 'Claude Sonnet 4.5',
      vendor: 'Anthropic',
      category: 'Large Language Model',
      description: 'Latest Claude model with improved reasoning',
      risk_level: 'high',
      previously_approved: {
        date: '2024-04-20',
        approver: 'Michael Torres',
        risk_score: 68,
        submission_id: 58
      }
    },
    {
      id: '3',
      name: 'Llama 3.1 70B',
      vendor: 'Meta',
      category: 'Large Language Model',
      description: 'Open source LLM with 128k context',
      risk_level: 'medium',
    },
    {
      id: '4',
      name: 'DALL-E 3',
      vendor: 'OpenAI',
      category: 'Image Generation',
      description: 'Advanced text-to-image generation',
      risk_level: 'medium',
      previously_approved: {
        date: '2024-02-10',
        approver: 'Sarah Chen',
        risk_score: 45,
        submission_id: 31
      }
    },
    {
      id: '5',
      name: 'Whisper v3',
      vendor: 'OpenAI',
      category: 'Audio/Speech',
      description: 'Speech recognition and transcription',
      risk_level: 'low',
    },
    {
      id: '6',
      name: 'Mistral Large',
      vendor: 'Mistral AI',
      category: 'Large Language Model',
      description: 'European LLM with strong reasoning',
      risk_level: 'medium',
    },
    {
      id: '7',
      name: 'Salesforce Einstein GPT',
      vendor: 'Salesforce',
      category: 'CRM AI',
      description: 'CRM-integrated AI for sales and service',
      risk_level: 'high',
      previously_approved: {
        date: '2024-01-05',
        approver: 'David Kim',
        risk_score: 78,
        submission_id: 15
      }
    },
    {
      id: '8',
      name: 'Microsoft Copilot',
      vendor: 'Microsoft',
      category: 'Productivity AI',
      description: 'AI assistant for Microsoft 365',
      risk_level: 'high',
    },
    {
      id: '9',
      name: 'Stable Diffusion XL',
      vendor: 'Stability AI',
      category: 'Image Generation',
      description: 'Open source image generation',
      risk_level: 'low',
    },
    {
      id: '10',
      name: 'Gemini Pro 1.5',
      vendor: 'Google',
      category: 'Large Language Model',
      description: 'Multimodal LLM with 1M context',
      risk_level: 'high',
    }
  ]

  const categories = ['all', ...Array.from(new Set(allTools.map(t => t.category)))]
  const vendors = ['all', ...Array.from(new Set(allTools.map(t => t.vendor)))]

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesVendor = selectedVendor === 'all' || tool.vendor === selectedVendor
    return matchesSearch && matchesCategory && matchesVendor
  })

  const addToBasket = (tool: AITool) => {
    if (!selectedBasket.find(t => t.id === tool.id)) {
      setSelectedBasket([...selectedBasket, tool])
    }
  }

  const removeFromBasket = (toolId: string) => {
    setSelectedBasket(selectedBasket.filter(t => t.id !== toolId))
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200">
          <div className="max-w-[1600px] mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkle weight="fill" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary-950">AI Tools Research</h1>
                  <p className="text-sm text-primary-600">Browse, compare, and select AI tools for your project</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {selectedBasket.length} selected
              </Badge>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
              <Input
                type="text"
                placeholder="Search AI tools by name, vendor, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-base"
              />
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="flex gap-6">
            {/* Left Sidebar - Filters */}
            {showFilters && (
              <aside className="w-64 flex-shrink-0">
                <Card className="sticky top-24">
                  <CardHeader className="border-b border-neutral-200">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Funnel className="w-4 h-4" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-6">
                      {/* Category Filter */}
                      <div>
                        <label className="text-xs font-medium text-primary-600 mb-2 block">Category</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full p-2 border border-neutral-300 rounded-lg text-sm"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Vendor Filter */}
                      <div>
                        <label className="text-xs font-medium text-primary-600 mb-2 block">Vendor</label>
                        <select
                          value={selectedVendor}
                          onChange={(e) => setSelectedVendor(e.target.value)}
                          className="w-full p-2 border border-neutral-300 rounded-lg text-sm"
                        >
                          {vendors.map(vendor => (
                            <option key={vendor} value={vendor}>{vendor === 'all' ? 'All Vendors' : vendor}</option>
                          ))}
                        </select>
                      </div>

                      {/* Approval Status Filter */}
                      <div>
                        <label className="text-xs font-medium text-primary-600 mb-2 block">Approval Status</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded" defaultChecked />
                            Previously Approved
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded" defaultChecked />
                            New/Unapproved
                          </label>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        Reset Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            )}

            {/* Main Content - Tool Grid */}
            <main className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-primary-600">
                  Found {filteredTools.length} AI tools
                </p>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <Funnel className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map(tool => (
                  <Card key={tool.id} className="hover:shadow-lg transition-shadow relative overflow-hidden">
                    {tool.previously_approved && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-emerald-600 text-white px-3 py-1 text-xs font-medium flex items-center gap-1">
                        <CheckCircle weight="fill" className="w-3 h-3" />
                        Previously Approved
                      </div>
                    )}

                    <CardContent className="pt-6">
                      <div className="mb-3">
                        <h3 className="font-bold text-primary-950 mb-1">{tool.name}</h3>
                        <p className="text-xs text-primary-600">{tool.vendor}</p>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <Badge variant="secondary" size="sm">{tool.category}</Badge>
                        <Badge className={`${getRiskBadgeColor(tool.risk_level)} border`} size="sm">
                          {tool.risk_level} risk
                        </Badge>
                      </div>

                      <p className="text-sm text-primary-700 mb-4">{tool.description}</p>

                      {tool.previously_approved && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-xs">
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck weight="fill" className="w-4 h-4 text-emerald-600" />
                            <span className="font-medium text-emerald-900">Approval Details</span>
                          </div>
                          <div className="space-y-1 text-emerald-800">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {new Date(tool.previously_approved.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3" />
                              {tool.previously_approved.approver}
                            </div>
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3 h-3" />
                              Risk Score: {tool.previously_approved.risk_score}/100
                            </div>
                          </div>
                          <Link href={`/submissions/${tool.previously_approved.submission_id}`}>
                            <Button variant="ghost" size="sm" className="w-full mt-2 text-emerald-700">
                              View Original Submission
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      )}

                      <Button
                        onClick={() => addToBasket(tool)}
                        disabled={!!selectedBasket.find(t => t.id === tool.id)}
                        className="w-full"
                        size="sm"
                      >
                        {selectedBasket.find(t => t.id === tool.id) ? (
                          <>
                            <CheckCircle weight="fill" className="w-4 h-4 mr-2" />
                            Added to Basket
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Basket
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </main>

            {/* Right Sidebar - Selection Basket */}
            <aside className="w-80 flex-shrink-0">
              <Card className="sticky top-24">
                <CardHeader className="border-b border-neutral-200">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Selection Basket ({selectedBasket.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {selectedBasket.length === 0 ? (
                    <div className="text-center py-8 text-primary-600">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No tools selected yet</p>
                      <p className="text-xs mt-1">Add tools to start building your project</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                        {selectedBasket.map(tool => (
                          <div key={tool.id} className="flex items-start gap-2 p-2 bg-neutral-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary-900 truncate">{tool.name}</p>
                              <p className="text-xs text-primary-600">{tool.vendor}</p>
                              {tool.previously_approved && (
                                <Badge className="bg-emerald-100 text-emerald-700 mt-1" size="sm">
                                  <CheckCircle weight="fill" className="w-3 h-3 mr-1" />
                                  Pre-approved
                                </Badge>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromBasket(tool.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-neutral-200 pt-4 space-y-3">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-primary-600">Total tools:</span>
                            <span className="font-medium">{selectedBasket.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-primary-600">Pre-approved:</span>
                            <span className="font-medium text-emerald-600">
                              {selectedBasket.filter(t => t.previously_approved).length}
                            </span>
                          </div>
                        </div>

                        <Link href="/intake">
                          <Button className="w-full">
                            Submit for Review
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedBasket([])}
                        >
                          Clear Basket
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
