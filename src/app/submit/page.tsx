'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import IntakeFormTabs from '@/components/IntakeFormTabs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SubmitPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Validation errors:', errorData)

        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((err: any) =>
            `${err.path?.join('.') || 'Field'}: ${err.message}`
          ).join('\n')
          alert(`Validation failed:\n\n${errorMessages}`)
        } else {
          throw new Error('Submission failed')
        }
        return
      }

      const result = await response.json()

      // Redirect to submission detail page
      router.push(`/submissions/${result.submissionId}`)
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">AI/ML Model Intake Request</CardTitle>
            <CardDescription>
              Complete this form to request approval for a new AI/ML model deployment.
              Your submission will be automatically reviewed for compliance, security, and risk.
            </CardDescription>
          </CardHeader>
        </Card>

        <IntakeFormTabs onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </main>
  )
}
