'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Eye, Trash, CheckCircle, WarningCircle } from '@phosphor-icons/react'

interface ArtifactsSectionProps {
  data: any
  onChange: (data: any) => void
}

export function ArtifactsSection({ data, onChange }: ArtifactsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
          <FileText weight="fill" className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-primary-950">Artifacts & Documentation</h2>
          <p className="text-sm text-primary-600 mt-1">
            Upload supporting documents and evidence
          </p>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <Card className="border-2 border-dashed border-neutral-300 bg-neutral-50 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer">
        <CardContent className="py-12">
          <div className="text-center">
            <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm text-primary-900 font-medium mb-1">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-primary-600">
              Supported: PDF, DOCX, TXT, JSON, YAML, MD • Max 50MB per file
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-primary-900">Uploaded Documents</h3>

        <Card className="border-neutral-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded flex items-center justify-center">
                  <FileText weight="fill" className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-900">model-card-gpt4.pdf</p>
                  <p className="text-xs text-primary-600">2.4 MB • Uploaded 2 mins ago</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Required Documents Checklist */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-amber-900 mb-3">Required Documents</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle weight="fill" className="w-4 h-4" />
              <span>Model card (uploaded)</span>
            </div>
            <div className="flex items-center gap-2 text-amber-700">
              <WarningCircle weight="fill" className="w-4 h-4" />
              <span>Safety test results (required)</span>
            </div>
            <div className="flex items-center gap-2 text-amber-700">
              <WarningCircle weight="fill" className="w-4 h-4" />
              <span>Training dataset documentation (required)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
