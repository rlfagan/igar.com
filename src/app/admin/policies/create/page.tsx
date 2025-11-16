'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { aiCatalog as aiCatalogFallback, CatalogItem, searchCatalog, fetchAICatalog, getUseCases } from '@/lib/ai-catalog'
import { Check, Plus, X, MagnifyingGlass, ArrowLeft } from '@phosphor-icons/react'
import Link from 'next/link'

interface PolicyLists {
  approved: CatalogItem[]
  denied: CatalogItem[]
  review: CatalogItem[]
}

interface UseCaseRestriction {
  itemId: string
  mode: 'all' | 'whitelist' | 'blacklist'
  allowedUseCases: string[]
  deniedUseCases: string[]
}

interface Department {
  id: number
  name: string
  slug: string
  description?: string
}

export default function CreatePolicyPage() {
  const [aiCatalog, setAiCatalog] = useState<CatalogItem[]>(aiCatalogFallback)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [policyName, setPolicyName] = useState('')
  const [policyDescription, setPolicyDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [policyLists, setPolicyLists] = useState<PolicyLists>({
    approved: [],
    denied: [],
    review: [],
  })

  const [useCaseRestrictions, setUseCaseRestrictions] = useState<UseCaseRestriction[]>([])
  const [showRestrictionModal, setShowRestrictionModal] = useState(false)
  const [pendingApproval, setPendingApproval] = useState<CatalogItem | null>(null)

  // Department selection
  const [departments, setDepartments] = useState<Department[]>([])
  const [isGlobal, setIsGlobal] = useState(true)
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([])

  // Fetch catalog from database on mount
  useEffect(() => {
    const loadCatalog = async () => {
      const catalog = await fetchAICatalog()
      setAiCatalog(catalog)
      setCatalogLoading(false)
    }
    loadCatalog()
  }, [])

  // Fetch departments on mount
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/departments`)
        const data = await response.json()
        if (data.success) {
          setDepartments(data.departments)
        }
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }
    loadDepartments()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Load default/template policy
  const loadDefaultPolicy = () => {
    const defaultItemIds = {
      approved: [
        "openai:gpt-4.1",
        "openai:gpt-4.1-mini",
        "anthropic:claude-3.5-sonnet",
        "anthropic:claude-3.5-haiku",
        "google:gemini-1.5-pro",
        "aws:bedrock-titan-text-premier",
        "github:copilot-enterprise",
        "openai:enterprise",
        "perplexity:enterprise",
        "microsoft:365-copilot-enterprise",
        "huggingface/transformers",
        "huggingface/diffusers",
        "langchain",
        "pytorch",
        "tensorflow",
        "hf:financial-sentiment-verified",
        "hf:ms-marco-v1",
        "hf:wiki-en-cleaned",
        "openclimate:climate-risk-dataset-v2",
      ],
      denied: [
        "llama-uncensored-*",
        "wizardlm-uncensored-*",
        "gpt4free-*",
        "stable-diffusion-raw-*",
        "characterai:*",
        "midjourney:*",
        "replika:*",
        "any:GPL-3.0",
        "hf:model:no-license",
        "hf:dataset:no-docs",
        "biometric-identification",
        "autonomous-medical-diagnosis",
        "political-profiling",
        "unexplainable-credit-decisions",
      ],
      review: [
        "mistral:mixtral-8x7b",
        "meta:llama-3-70b",
        "meta:llama-3-8b",
        "cohere:command",
        "huggingface:inference-api",
        "local-inference",
        "llama.cpp",
        "vllm",
        "customer-data-derived",
        "user-uploaded",
        "fraud-detection",
        "credit-eligibility",
        "aml-bsa",
        "hr-screening",
      ],
    }

    const newLists: PolicyLists = {
      approved: [],
      denied: [],
      review: [],
    }

    // Map IDs to catalog items
    Object.entries(defaultItemIds).forEach(([listName, ids]) => {
      ids.forEach((id) => {
        const item = aiCatalog.find((i) => i.id === id)
        if (item) {
          newLists[listName as keyof PolicyLists].push(item)
        }
      })
    })

    setPolicyLists(newLists)
    setPolicyName('Enterprise AI Usage Policy 2025')
    setPolicyDescription('Default governance policy for approved, denied, and review-required AI resources')
  }

  let filteredCatalog = searchQuery ? searchCatalog(aiCatalog, searchQuery) : aiCatalog

  // Apply category filter
  if (categoryFilter !== 'all') {
    filteredCatalog = filteredCatalog.filter(item => item.category === categoryFilter)
  }

  // Check if item is already in a list
  const isItemInPolicy = (itemId: string) => {
    return (
      policyLists.approved.some(i => i.id === itemId) ||
      policyLists.denied.some(i => i.id === itemId) ||
      policyLists.review.some(i => i.id === itemId)
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const itemId = active.id as string
    const targetList = over.id as keyof PolicyLists

    // Find the item from catalog
    const item = aiCatalog.find(i => i.id === itemId)
    if (!item) {
      setActiveId(null)
      return
    }

    // If dropping into "approved" and it's a model/tool/oss, show restriction modal
    if (targetList === 'approved' && (item.category === 'model' || item.category === 'tool' || item.category === 'oss')) {
      setPendingApproval(item)
      setShowRestrictionModal(true)
      setActiveId(null)
      return
    }

    // Remove from all lists first
    const newLists = {
      approved: policyLists.approved.filter(i => i.id !== itemId),
      denied: policyLists.denied.filter(i => i.id !== itemId),
      review: policyLists.review.filter(i => i.id !== itemId),
    }

    // Add to target list if it's a valid drop zone
    if (targetList === 'approved' || targetList === 'denied' || targetList === 'review') {
      newLists[targetList] = [...newLists[targetList], item]
    }

    setPolicyLists(newLists)
    setActiveId(null)
  }

  const handleApproveWithRestrictions = (mode: 'all' | 'whitelist' | 'blacklist', selectedUseCases: string[]) => {
    if (!pendingApproval) return

    // Remove from all lists first
    const newLists = {
      approved: policyLists.approved.filter(i => i.id !== pendingApproval.id),
      denied: policyLists.denied.filter(i => i.id !== pendingApproval.id),
      review: policyLists.review.filter(i => i.id !== pendingApproval.id),
    }

    // Add to approved
    newLists.approved = [...newLists.approved, pendingApproval]
    setPolicyLists(newLists)

    // Store use case restrictions
    const newRestrictions = useCaseRestrictions.filter(r => r.itemId !== pendingApproval.id)
    if (mode !== 'all') {
      newRestrictions.push({
        itemId: pendingApproval.id,
        mode,
        allowedUseCases: mode === 'whitelist' ? selectedUseCases : [],
        deniedUseCases: mode === 'blacklist' ? selectedUseCases : [],
      })
    }
    setUseCaseRestrictions(newRestrictions)

    setShowRestrictionModal(false)
    setPendingApproval(null)
  }

  const removeFromList = (listName: keyof PolicyLists, itemId: string) => {
    setPolicyLists({
      ...policyLists,
      [listName]: policyLists[listName].filter(i => i.id !== itemId),
    })
  }

  const handleSave = async () => {
    if (!policyName) {
      alert('Please enter a policy name')
      return
    }

    const policy = {
      name: policyName,
      description: policyDescription,
      approved: {
        models: policyLists.approved.filter(i => i.category === 'model').map(i => i.id),
        tools: policyLists.approved.filter(i => i.category === 'tool').map(i => i.id),
        oss: policyLists.approved.filter(i => i.category === 'oss').map(i => i.id),
        datasets: policyLists.approved.filter(i => i.category === 'dataset').map(i => i.id),
      },
      denied: {
        models: policyLists.denied.filter(i => i.category === 'model').map(i => i.id),
        tools: policyLists.denied.filter(i => i.category === 'tool').map(i => i.id),
        oss: policyLists.denied.filter(i => i.category === 'oss').map(i => i.id),
        datasets: policyLists.denied.filter(i => i.category === 'dataset').map(i => i.id),
        use_cases: policyLists.denied.filter(i => i.category === 'use_case').map(i => i.id),
      },
      review: {
        models: policyLists.review.filter(i => i.category === 'model').map(i => i.id),
        tools: policyLists.review.filter(i => i.category === 'tool').map(i => i.id),
        oss: policyLists.review.filter(i => i.category === 'oss').map(i => i.id),
        datasets: policyLists.review.filter(i => i.category === 'dataset').map(i => i.id),
        use_cases: policyLists.review.filter(i => i.category === 'use_case').map(i => i.id),
      },
      use_case_restrictions: useCaseRestrictions,
      is_global: isGlobal,
      department_ids: isGlobal ? [] : selectedDepartments,
    }

    console.log('Saving policy:', policy)
    setSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://igarcom-backend-production.up.railway.app'
      console.log('API URL:', apiUrl)

      const response = await fetch(`${apiUrl}/api/ai-policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      })

      console.log('Response status:', response.status)
      const responseText = await response.text()
      console.log('Response text:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse JSON:', e)
        alert(`Failed to save policy: Invalid response from server`)
        return
      }

      if (data.success) {
        alert('Policy saved successfully!')
        // Optionally redirect to policy list
        // router.push('/admin/policies')
      } else {
        alert(`Failed to save policy: ${data.message}`)
      }
    } catch (error) {
      console.error('Error saving policy:', error)
      alert(`Failed to save policy: ${error}`)
    } finally {
      setSaving(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      model: 'bg-blue-100 text-blue-700',
      tool: 'bg-green-100 text-green-700',
      oss: 'bg-purple-100 text-purple-700',
      dataset: 'bg-orange-100 text-orange-700',
      use_case: 'bg-pink-100 text-pink-700',
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const activeItem = activeId ? aiCatalog.find(i => i.id === activeId) : null

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/policies" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-900 mb-4">
            <ArrowLeft weight="bold" className="w-4 h-4" />
            Back to Policies
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-950">Create AI Governance Policy</h1>
              <p className="text-primary-600 mt-2">Drag and drop items from the catalog to build your policy</p>
            </div>
            <Button variant="outline" onClick={loadDefaultPolicy}>
              Load Default Policy
            </Button>
          </div>
        </div>

        {/* Policy Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Policy Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Policy Name</Label>
              <Input
                id="name"
                placeholder="e.g., Enterprise AI Usage Policy 2025"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of this policy"
                value={policyDescription}
                onChange={(e) => setPolicyDescription(e.target.value)}
              />
            </div>

            {/* Policy Scope */}
            <div className="space-y-3 pt-2">
              <Label>Policy Scope</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={isGlobal}
                    onChange={() => {
                      setIsGlobal(true)
                      setSelectedDepartments([])
                    }}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm text-primary-900">Global (All Departments)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isGlobal}
                    onChange={() => setIsGlobal(false)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm text-primary-900">Specific Departments</span>
                </label>
              </div>

              {/* Department selector - shown only when not global */}
              {!isGlobal && (
                <div className="mt-3 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                  <Label className="mb-2 block text-sm font-medium">Select Departments</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {departments.map((dept) => (
                      <label key={dept.id} className="flex items-start gap-2 p-2 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDepartments([...selectedDepartments, dept.id])
                            } else {
                              setSelectedDepartments(selectedDepartments.filter(id => id !== dept.id))
                            }
                          }}
                          className="mt-0.5 w-4 h-4 text-indigo-600"
                        />
                        <div>
                          <div className="text-sm font-medium text-primary-900">{dept.name}</div>
                          {dept.description && (
                            <div className="text-xs text-primary-600">{dept.description}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  {selectedDepartments.length > 0 && (
                    <p className="text-xs text-indigo-600 mt-2">
                      {selectedDepartments.length} department{selectedDepartments.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-4 gap-6">
            {/* Catalog Panel */}
            <div className="col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">AI Catalog</CardTitle>
                  <CardDescription>Drag items to policy lists</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-3">
                    <div className="relative">
                      <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search catalog..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setCategoryFilter('all')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          categoryFilter === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setCategoryFilter('model')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          categoryFilter === 'model'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        Models
                      </button>
                      <button
                        onClick={() => setCategoryFilter('tool')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          categoryFilter === 'tool'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Tools
                      </button>
                      <button
                        onClick={() => setCategoryFilter('oss')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          categoryFilter === 'oss'
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        OSS
                      </button>
                      <button
                        onClick={() => setCategoryFilter('dataset')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          categoryFilter === 'dataset'
                            ? 'bg-orange-600 text-white'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        Datasets
                      </button>
                      <button
                        onClick={() => setCategoryFilter('use_case')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          categoryFilter === 'use_case'
                            ? 'bg-pink-600 text-white'
                            : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                        }`}
                      >
                        Use Cases
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {filteredCatalog.map((item) => {
                      const inPolicy = isItemInPolicy(item.id)
                      return (
                        <DraggableCatalogItem
                          key={item.id}
                          item={item}
                          inPolicy={inPolicy}
                          getCategoryColor={getCategoryColor}
                        />
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Policy Lists */}
            <div className="col-span-3 space-y-6">
              {/* Approved List */}
              <DropZone
                id="approved"
                title="Approved"
                description="AI resources explicitly approved for use"
                items={policyLists.approved}
                onRemove={(id) => removeFromList('approved', id)}
                getCategoryColor={getCategoryColor}
                color="green"
              />

              {/* Review Required List */}
              <DropZone
                id="review"
                title="Review Required"
                description="AI resources requiring case-by-case approval"
                items={policyLists.review}
                onRemove={(id) => removeFromList('review', id)}
                getCategoryColor={getCategoryColor}
                color="yellow"
              />

              {/* Denied List */}
              <DropZone
                id="denied"
                title="Denied"
                description="AI resources prohibited from use"
                items={policyLists.denied}
                onRemove={(id) => removeFromList('denied', id)}
                getCategoryColor={getCategoryColor}
                color="red"
              />
            </div>
          </div>

          <DragOverlay>
            {activeItem ? (
              <div className="p-3 rounded-lg border border-indigo-400 bg-white shadow-lg">
                <p className="font-medium text-primary-900">{activeItem.name}</p>
                <Badge className={`mt-2 text-xs ${getCategoryColor(activeItem.category)}`}>
                  {activeItem.category}
                </Badge>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button onClick={handleSave} size="lg" disabled={!policyName || saving}>
            {saving ? 'Saving...' : 'Save Policy'}
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/admin/policies">Cancel</Link>
          </Button>
        </div>
      </div>

      {/* Use Case Restriction Modal */}
      {showRestrictionModal && pendingApproval && (
        <UseCaseRestrictionModal
          item={pendingApproval}
          useCases={getUseCases(aiCatalog)}
          onConfirm={handleApproveWithRestrictions}
          onCancel={() => {
            setShowRestrictionModal(false)
            setPendingApproval(null)
          }}
        />
      )}
    </div>
  )
}

// Use Case Restriction Modal Component
interface UseCaseRestrictionModalProps {
  item: CatalogItem
  useCases: CatalogItem[]
  onConfirm: (mode: 'all' | 'whitelist' | 'blacklist', selectedUseCases: string[]) => void
  onCancel: () => void
}

function UseCaseRestrictionModal({ item, useCases, onConfirm, onCancel }: UseCaseRestrictionModalProps) {
  const [mode, setMode] = useState<'all' | 'whitelist' | 'blacklist'>('all')
  const [selectedUseCases, setSelectedUseCases] = useState<Set<string>>(new Set())

  const toggleUseCase = (id: string) => {
    const newSelected = new Set(selectedUseCases)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedUseCases(newSelected)
  }

  const handleConfirm = () => {
    onConfirm(mode, Array.from(selectedUseCases))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Use Case Restrictions</h2>
          <p className="text-gray-600 mb-1">
            Approving: <span className="font-semibold">{item.name}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Set restrictions on which use cases this {item.category} can be used for
          </p>

          {/* Mode Selection */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setMode('all')}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                mode === 'all'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  mode === 'all' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                }`}>
                  {mode === 'all' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <div className="font-medium">All Use Cases</div>
                  <div className="text-sm text-gray-600">No restrictions - can be used for any purpose</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('whitelist')}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                mode === 'whitelist'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  mode === 'whitelist' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                }`}>
                  {mode === 'whitelist' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <div className="font-medium">Specific Use Cases Only (Whitelist)</div>
                  <div className="text-sm text-gray-600">Can only be used for selected use cases</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('blacklist')}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                mode === 'blacklist'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  mode === 'blacklist' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                }`}>
                  {mode === 'blacklist' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <div className="font-medium">All Except Selected (Blacklist)</div>
                  <div className="text-sm text-gray-600">Can be used for all use cases except selected ones</div>
                </div>
              </div>
            </button>
          </div>

          {/* Use Case Selection */}
          {mode !== 'all' && (
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {mode === 'whitelist' ? 'Select Allowed Use Cases' : 'Select Prohibited Use Cases'}
              </label>
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                {useCases.map((useCase) => (
                  <label
                    key={useCase.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUseCases.has(useCase.id)}
                      onChange={() => toggleUseCase(useCase.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{useCase.name}</div>
                      {useCase.tags && useCase.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {useCase.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={mode !== 'all' && selectedUseCases.size === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve with Restrictions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DraggableCatalogItemProps {
  item: CatalogItem
  inPolicy: boolean
  getCategoryColor: (category: string) => string
}

function DraggableCatalogItem({ item, inPolicy, getCategoryColor }: DraggableCatalogItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: inPolicy,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-lg border text-sm ${
        inPolicy
          ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
          : 'bg-white border-gray-300 cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-primary-900 truncate">{item.name}</p>
          {item.provider && (
            <p className="text-xs text-primary-600 truncate">{item.provider}</p>
          )}
        </div>
        {inPolicy && <Check weight="bold" className="w-4 h-4 text-green-600 flex-shrink-0" />}
      </div>
      <Badge className={`mt-2 text-xs ${getCategoryColor(item.category)}`}>
        {item.category}
      </Badge>
    </div>
  )
}

interface DropZoneProps {
  id: string
  title: string
  description: string
  items: CatalogItem[]
  onRemove: (id: string) => void
  getCategoryColor: (category: string) => string
  color: 'green' | 'yellow' | 'red'
  useCaseRestrictions?: UseCaseRestriction[]
  isGlobal?: boolean
  departmentCount?: number
}

function DropZone({ id, title, description, items, onRemove, getCategoryColor, color, useCaseRestrictions = [], isGlobal = true, departmentCount = 0 }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const colorClasses = {
    green: 'border-green-300 bg-green-50/50',
    yellow: 'border-yellow-300 bg-yellow-50/50',
    red: 'border-red-300 bg-red-50/50',
  }

  const headerColors = {
    green: 'bg-green-100 text-green-900',
    yellow: 'bg-yellow-100 text-yellow-900',
    red: 'bg-red-100 text-red-900',
  }

  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed rounded-lg p-6 min-h-[200px] transition-colors ${colorClasses[color]} ${
        isOver ? 'ring-2 ring-indigo-500 bg-indigo-50/30' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary-950">{title}</h3>
          <p className="text-sm text-primary-600">{description}</p>
        </div>
        <Badge className={headerColors[color]}>{items.length} items</Badge>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-primary-500">
          <Plus weight="bold" className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Drag items here from the catalog</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary-900 text-sm truncate">{item.name}</p>
                  {item.provider && (
                    <p className="text-xs text-primary-600 truncate">{item.provider}</p>
                  )}
                  <Badge className={`mt-2 text-xs ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </Badge>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-gray-400 hover:text-red-600 flex-shrink-0"
                >
                  <X weight="bold" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
