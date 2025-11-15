'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Database, Plus, Trash, WarningCircle } from '@phosphor-icons/react'

interface DataSourcesSectionProps {
  data: any
  onChange: (data: any) => void
}

export function DataSourcesSection({ data, onChange }: DataSourcesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center">
          <Database weight="fill" className="w-6 h-6 text-sky-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-primary-950">Data Sources</h2>
          <p className="text-sm text-primary-600 mt-1">
            Define the data used for training, fine-tuning, or RAG
          </p>
        </div>
      </div>

      <Card className="border-neutral-300">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-primary-900">Data Source #1</h3>
              <Button variant="ghost" size="sm">
                <Trash className="w-4 h-4 text-red-600" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceName">Source Name *</Label>
              <Input id="sourceName" placeholder="e.g., Customer Support Transcripts" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type *</Label>
                <select
                  id="dataType"
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select type...</option>
                  <option value="text">Text</option>
                  <option value="images">Images</option>
                  <option value="audio">Audio</option>
                  <option value="structured">Structured Data</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceOrigin">Source Origin *</Label>
                <select
                  id="sourceOrigin"
                  className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select origin...</option>
                  <option value="internal">Internal</option>
                  <option value="vendor">Third-party vendor</option>
                  <option value="public">Public dataset</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Contains PII? *</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="pii" value="no" className="w-4 h-4" />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="pii" value="yes" className="w-4 h-4" />
                  <span className="text-sm">Yes</span>
                </label>
              </div>
            </div>

            <Card className="border-amber-300 bg-amber-50">
              <CardContent className="pt-4">
                <div className="flex gap-2 text-sm text-amber-900">
                  <WarningCircle weight="fill" className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">PII Detected</p>
                    <p className="text-xs text-amber-800 mt-1">
                      Data governance review required. Ensure GDPR compliance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Another Data Source
      </Button>
    </div>
  )
}
