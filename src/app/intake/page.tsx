'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MainNavigation } from '@/components/layout/main-navigation'
import { StickyProgressHeader } from '@/components/intake/sticky-progress-header'
import { AIAssistantPanel } from '@/components/layout/ai-assistant-panel'
import { ValidationChecklist } from '@/components/layout/validation-checklist'
import { AIChatAssistant } from '@/components/ai-chat-assistant'
import { ArrowLeft, ArrowRight, FloppyDisk } from '@phosphor-icons/react'

// Import section components (will create these next)
import { ModelSelectionSection } from '@/components/intake/sections/model-selection'
import { UseCaseSection } from '@/components/intake/sections/use-case'
import { DataSourcesSection } from '@/components/intake/sections/data-sources'
import { ModificationsSection } from '@/components/intake/sections/modifications'
import { DeploymentSection } from '@/components/intake/sections/deployment'
import { SafetySection } from '@/components/intake/sections/safety'
import { ArtifactsSection } from '@/components/intake/sections/artifacts'

export default function IntakeFormPage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(1)
  const [formData, setFormData] = useState<any>({})
  const [riskScore, setRiskScore] = useState<number>(0)
  const [lastSaved, setLastSaved] = useState<Date | undefined>()
  const [validationItems, setValidationItems] = useState<any[]>([])

  const sections = [
    { id: 'model', number: 1, title: 'Model Selection', status: 'in-progress' as const },
    { id: 'use-case', number: 2, title: 'Use Case', status: 'pending' as const },
    { id: 'data', number: 3, title: 'Data Sources', status: 'pending' as const },
    { id: 'modifications', number: 4, title: 'Modifications', status: 'pending' as const },
    { id: 'deployment', number: 5, title: 'Deployment', status: 'pending' as const },
    { id: 'safety', number: 6, title: 'Safety & Risk', status: 'pending' as const },
    { id: 'artifacts', number: 7, title: 'Artifacts', status: 'pending' as const },
  ]

  const validationSections = [
    {
      id: 'model',
      title: 'Model Selection',
      items: [
        { id: 'm1', label: 'Model vendor selected', status: 'pending' as const },
        { id: 'm2', label: 'Model name provided', status: 'pending' as const },
        { id: 'm3', label: 'License verified', status: 'pending' as const },
      ],
      isExpanded: true,
    },
    {
      id: 'use-case',
      title: 'Use Case',
      items: [
        { id: 'u1', label: 'Use case description', status: 'pending' as const },
        { id: 'u2', label: 'System classification', status: 'pending' as const },
      ],
      isExpanded: false,
    },
  ]

  // Load saved draft on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('intake_draft')
      if (savedDraft) {
        const draft = JSON.parse(savedDraft)
        setFormData(draft.formData || {})
        setCurrentSection(draft.currentSection || 1)
        if (draft.lastSaved) {
          setLastSaved(new Date(draft.lastSaved))
        }
        console.log('Draft loaded successfully')
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
  }, [])

  const handleImportFromModelCard = () => {
    const url = prompt('Enter HuggingFace model URL (e.g., https://huggingface.co/bert-base-uncased):')

    if (!url) return

    // Extract model name from URL
    const modelMatch = url.match(/huggingface\.co\/([^/?]+)/)
    const modelName = modelMatch ? modelMatch[1] : url

    // Auto-fill form with sample data
    const importedData = {
      model_vendor: 'HuggingFace',
      model_name: modelName,
      model_version: '1.0.0',
      model_type: 'Transformer',
      license_type: 'apache-2.0',
      use_case_description: `Using ${modelName} for natural language processing tasks`,
      system_classification: 'limited-risk',
      business_impact: 'medium',
    }

    setFormData({ ...formData, ...importedData })
    alert(`✅ Imported model: ${modelName}`)
  }

  const completionPercentage = Math.round((currentSection / sections.length) * 100)

  const aiSuggestions = [
    {
      id: '1',
      type: 'autofill' as const,
      title: 'Import from model card',
      description: 'We detected a HuggingFace URL. Import metadata?',
      action: {
        label: 'Import',
        onClick: handleImportFromModelCard,
      },
    },
  ]

  const handleSectionChange = (sectionNumber: number) => {
    setCurrentSection(sectionNumber)
  }

  const handleNext = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSave = async () => {
    try {
      // Save form data to localStorage as a draft
      localStorage.setItem('intake_draft', JSON.stringify({
        formData,
        currentSection,
        lastSaved: new Date().toISOString()
      }))
      setLastSaved(new Date())

      // Optional: Show success message
      console.log('Draft saved successfully')
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <ModelSelectionSection data={formData} onChange={setFormData} />
      case 2:
        return <UseCaseSection data={formData} onChange={setFormData} />
      case 3:
        return <DataSourcesSection data={formData} onChange={setFormData} />
      case 4:
        return <ModificationsSection data={formData} onChange={setFormData} />
      case 5:
        return <DeploymentSection data={formData} onChange={setFormData} />
      case 6:
        return <SafetySection data={formData} onChange={setFormData} />
      case 7:
        return <ArtifactsSection data={formData} onChange={setFormData} />
      default:
        return null
    }
  }

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen bg-neutral-50">
        {/* Sticky Progress Header */}
      <StickyProgressHeader
        sections={sections}
        currentSection={currentSection}
        onSectionClick={handleSectionChange}
        riskScore={riskScore}
        completionPercentage={completionPercentage}
        lastSaved={lastSaved}
      />

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar: Validation Checklist */}
          <aside className="hidden lg:block">
            <ValidationChecklist
              sections={validationSections}
              totalItems={5}
              completedItems={0}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            <Card className="mb-6">
              <CardContent className="pt-6">
                {renderSection()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentSection === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <Button variant="outline" onClick={handleSave}>
                    <FloppyDisk className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>

                  <Button onClick={handleNext} disabled={currentSection === sections.length}>
                    Next Section
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Right Sidebar: AI Assistant */}
          <aside className="hidden xl:block">
            <AIAssistantPanel
              currentSection={`Section ${currentSection}: ${sections[currentSection - 1].title}`}
              suggestions={aiSuggestions}
              riskScore={riskScore}
              complianceInfo={{
                standard: 'ISO/IEC 42001',
                clause: 'Clause 6.1',
                description: 'Risk assessment required for AI systems',
              }}
            />
          </aside>
        </div>
      </div>
      </div>

      {/* AI Chat Assistant */}
      <AIChatAssistant
        context={{
          page: 'Intake Form',
          warnings: validationItems
            .filter((item) => item.status === 'error')
            .map((item) => item.label),
          riskScores: {
            'Overall Risk': riskScore
          },
          complianceIssues: [
            'Ensure all required documentation is complete',
            'Model card and training data information required for compliance'
          ]
        }}
      />
    </>
  )
}
