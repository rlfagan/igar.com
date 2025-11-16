'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { aiCatalog, CatalogItem, searchCatalog } from '@/lib/ai-catalog'
import { Check, Plus, X, MagnifyingGlass, ArrowLeft } from '@phosphor-icons/react'
import Link from 'next/link'

interface PolicyLists {
  approved: CatalogItem[]
  denied: CatalogItem[]
  review: CatalogItem[]
}

export default function CreatePolicyPage() {
  const [policyName, setPolicyName] = useState('')
  const [policyDescription, setPolicyDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const [policyLists, setPolicyLists] = useState<PolicyLists>({
    approved: [],
    denied: [],
    review: [],
  })

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

  const filteredCatalog = searchQuery
    ? searchCatalog(searchQuery)
    : aiCatalog

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

  const removeFromList = (listName: keyof PolicyLists, itemId: string) => {
    setPolicyLists({
      ...policyLists,
      [listName]: policyLists[listName].filter(i => i.id !== itemId),
    })
  }

  const handleSave = async () => {
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
    }

    console.log('Saving policy:', policy)
    // TODO: Send to API
    alert('Policy saved! (Check console for JSON)')
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
                  <div className="mb-4">
                    <div className="relative">
                      <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search catalog..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {filteredCatalog.map((item) => {
                      const inPolicy = isItemInPolicy(item.id)
                      return (
                        <div
                          key={item.id}
                          draggable={!inPolicy}
                          onDragStart={() => setActiveId(item.id)}
                          className={`p-3 rounded-lg border text-sm ${
                            inPolicy
                              ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                              : 'bg-white border-gray-300 cursor-move hover:border-indigo-400 hover:shadow-sm'
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
          <Button onClick={handleSave} size="lg" disabled={!policyName}>
            Save Policy
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/admin/policies">Cancel</Link>
          </Button>
        </div>
      </div>
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
}

function DropZone({ id, title, description, items, onRemove, getCategoryColor, color }: DropZoneProps) {
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
      id={id}
      className={`border-2 border-dashed rounded-lg p-6 min-h-[200px] ${colorClasses[color]}`}
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
