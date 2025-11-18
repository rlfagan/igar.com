'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Search, Edit2, Trash2, Check, X } from 'lucide-react'
import Link from 'next/link'
import { MainNavigation } from '@/components/layout/main-navigation'
import { AdminNavigation } from '@/components/layout/admin-navigation'

interface CatalogItem {
  id: number
  catalog_id: string
  name: string
  provider?: string
  category: 'model' | 'tool' | 'oss' | 'dataset' | 'use_case'
  description?: string
  tags?: string[]
  version?: string
  license?: string
  homepage_url?: string
  documentation_url?: string
  is_active: boolean
  is_deprecated: boolean
  deprecation_note?: string
  created_at: string
  updated_at: string
}

export default function CatalogManagementPage() {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [filteredItems, setFilteredItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    catalog_id: '',
    name: '',
    provider: '',
    category: 'model' as CatalogItem['category'],
    description: '',
    tags: '',
    version: '',
    license: '',
    homepage_url: '',
    documentation_url: '',
  })

  useEffect(() => {
    fetchCatalogItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchQuery, categoryFilter])

  const fetchCatalogItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-catalog`)
      const data = await response.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching catalog items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.catalog_id.toLowerCase().includes(query) ||
          item.provider?.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    setFilteredItems(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
    }

    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/ai-catalog/${editingItem.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/ai-catalog`

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        alert(editingItem ? 'Item updated successfully!' : 'Item created successfully!')
        setShowAddModal(false)
        setEditingItem(null)
        resetForm()
        fetchCatalogItems()
      } else {
        alert(`Failed: ${data.message}`)
      }
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Failed to save item')
    }
  }

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item)
    setFormData({
      catalog_id: item.catalog_id,
      name: item.name,
      provider: item.provider || '',
      category: item.category,
      description: item.description || '',
      tags: item.tags?.join(', ') || '',
      version: item.version || '',
      license: item.license || '',
      homepage_url: item.homepage_url || '',
      documentation_url: item.documentation_url || '',
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-catalog/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        alert('Item deleted successfully!')
        fetchCatalogItems()
      } else {
        alert(`Failed to delete: ${data.message}`)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const resetForm = () => {
    setFormData({
      catalog_id: '',
      name: '',
      provider: '',
      category: 'model',
      description: '',
      tags: '',
      version: '',
      license: '',
      homepage_url: '',
      documentation_url: '',
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'model':
        return 'bg-blue-100 text-blue-800'
      case 'tool':
        return 'bg-green-100 text-green-800'
      case 'oss':
        return 'bg-purple-100 text-purple-800'
      case 'dataset':
        return 'bg-orange-100 text-orange-800'
      case 'use_case':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <MainNavigation />
      <div className="flex">
        <AdminNavigation className="w-64 min-h-screen" />
        <div className="flex-1 bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Catalog Management</h1>
              <p className="text-gray-600 mt-2">
                Manage models, tools, OSS, datasets, and use cases
              </p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setEditingItem(null)
                setShowAddModal(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, provider, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="model">Models</option>
              <option value="tool">Tools</option>
              <option value="oss">Open Source</option>
              <option value="dataset">Datasets</option>
              <option value="use_case">Use Cases</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </div>

        {/* Items List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading catalog...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">No items found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.catalog_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.provider || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags && item.tags.length > 0 ? (
                          item.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                        {item.tags && item.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_active ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Check className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <X className="w-4 h-4" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catalog ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.catalog_id}
                      onChange={(e) =>
                        setFormData({ ...formData, catalog_id: e.target.value })
                      }
                      placeholder="e.g., openai:gpt-4.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., GPT-4.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as CatalogItem['category'],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="model">Model</option>
                      <option value="tool">Tool</option>
                      <option value="oss">Open Source</option>
                      <option value="dataset">Dataset</option>
                      <option value="use_case">Use Case</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provider
                    </label>
                    <input
                      type="text"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="e.g., OpenAI"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., llm, commercial, cost-effective"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="e.g., 3.5, v2.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License (for OSS)
                    </label>
                    <input
                      type="text"
                      value={formData.license}
                      onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                      placeholder="e.g., MIT, Apache-2.0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Homepage URL
                  </label>
                  <input
                    type="url"
                    value={formData.homepage_url}
                    onChange={(e) =>
                      setFormData({ ...formData, homepage_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documentation URL
                  </label>
                  <input
                    type="url"
                    value={formData.documentation_url}
                    onChange={(e) =>
                      setFormData({ ...formData, documentation_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingItem(null)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingItem ? 'Update Item' : 'Create Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </>
  )
}
