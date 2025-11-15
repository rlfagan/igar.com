'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Shield, Zap, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Intake & Review System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Automated governance and risk assessment for AI/ML implementations
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/submit">
              <Button size="lg" className="text-lg px-8">
                Submit New Request
              </Button>
            </Link>
            <Link href="/submissions">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Submissions
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Comprehensive Intake</CardTitle>
              <CardDescription>
                Structured forms covering all aspects of AI model deployment
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-yellow-600 mb-2" />
              <CardTitle>AI-Powered Review</CardTitle>
              <CardDescription>
                Automated analysis using Claude for instant risk assessment
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>Compliance Checks</CardTitle>
              <CardDescription>
                Regulatory review for ECOA, FFIEC, AML/BSA, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Vendor Evaluation</CardTitle>
              <CardDescription>
                Automated assessment of COTS AI products and vendors
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <span>Automated PII detection and data privacy analysis</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <span>Risk scoring and approval recommendations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <span>Bias and fairness concern identification</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <span>Security vulnerability assessment</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <span>Regulatory compliance verification</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <span>File artifact management and SBOM/AIBOM support</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
