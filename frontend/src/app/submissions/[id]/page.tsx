'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, AlertCircle, FileText, Shield } from 'lucide-react'
import { ModelCard } from '@/components/ModelCard'

export default function SubmissionDetailPage() {
  const params = useParams()
  const [submission, setSubmission] = useState<any>(null)
  const [review, setReview] = useState<any>(null)
  const [modelMetadata, setModelMetadata] = useState<any>(null)
  const [artifacts, setArtifacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchSubmission()
    }
  }, [params.id])

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setSubmission(data.submission)
        setReview(data.review)
        setModelMetadata(data.modelMetadata)
        setArtifacts(data.artifacts || [])
      }
    } catch (error) {
      console.error('Failed to fetch submission:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    const colors = {
      LOW: 'text-green-600 bg-green-50',
      MEDIUM: 'text-yellow-600 bg-yellow-50',
      HIGH: 'text-orange-600 bg-orange-50',
      CRITICAL: 'text-red-600 bg-red-50',
    }
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  const getRiskIcon = (level: string) => {
    if (level === 'LOW') return <CheckCircle className="w-6 h-6" />
    if (level === 'MEDIUM') return <AlertCircle className="w-6 h-6" />
    if (level === 'HIGH') return <AlertTriangle className="w-6 h-6" />
    return <XCircle className="w-6 h-6" />
  }

  const getApprovalColor = (recommendation: string) => {
    const colors = {
      APPROVED: 'text-green-600 bg-green-50 border-green-200',
      APPROVED_WITH_CONDITIONS: 'text-green-600 bg-green-50 border-green-200',
      REQUIRES_REVIEW: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      DENIED: 'text-red-600 bg-red-50 border-red-200',
    }
    return colors[recommendation as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center py-12">Loading submission...</p>
        </div>
      </main>
    )
  }

  if (!submission) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-600">Submission not found</p>
              <Link href="/submissions">
                <Button className="mt-4">Back to Submissions</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Link href="/submissions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Submissions
            </Button>
          </Link>
        </div>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl mb-2">{submission.project_name}</CardTitle>
                <p className="text-gray-600">Model: {submission.model_name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Submitted on {new Date(submission.submitted_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {submission.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Model Card */}
        {modelMetadata && (
          <div className="mb-6">
            <ModelCard modelMetadata={modelMetadata} />
          </div>
        )}

        {/* Artifacts & Diagrams */}
        {artifacts.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 w-5 h-5" />
                Uploaded Artifacts & Diagrams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {artifacts.map((artifact: any) => {
                  const isImage = artifact.file_type?.startsWith('image/');
                  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${artifact.file_path}`;

                  return (
                    <div key={artifact.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{artifact.file_name}</h4>
                          <p className="text-xs text-gray-500 capitalize">{artifact.artifact_type?.replace('_', ' ')}</p>
                        </div>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Download
                        </a>
                      </div>

                      {isImage ? (
                        <div className="mt-2">
                          <img
                            src={fileUrl}
                            alt={artifact.file_name}
                            className="w-full rounded border"
                          />
                        </div>
                      ) : (
                        <div className="mt-2 p-4 bg-gray-50 rounded text-center">
                          <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-600">{artifact.file_type}</p>
                        </div>
                      )}

                      {artifact.description && (
                        <p className="text-xs text-gray-600 mt-2">{artifact.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Review Results */}
        {review ? (
          <div className="space-y-6 mb-6">
            {/* Risk Score Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 w-6 h-6" />
                  AI Review Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-lg border-2 ${getRiskLevelColor(review.risk_level)}`}>
                    <div className="flex items-center mb-2">
                      {getRiskIcon(review.risk_level)}
                      <span className="ml-2 font-semibold">Risk Level</span>
                    </div>
                    <p className="text-3xl font-bold">{review.risk_level}</p>
                    <p className="text-sm mt-1">Score: {review.risk_score}/100</p>
                  </div>

                  <div className={`p-6 rounded-lg border-2 ${getApprovalColor(review.approval_recommendation)}`}>
                    <div className="flex items-center mb-2">
                      <FileText className="w-6 h-6" />
                      <span className="ml-2 font-semibold">Recommendation</span>
                    </div>
                    <p className="text-lg font-bold">
                      {review.approval_recommendation.replace(/_/g, ' ')}
                    </p>
                  </div>

                  <div className="p-6 rounded-lg border-2 bg-purple-50 text-purple-600 border-purple-200">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-6 h-6" />
                      <span className="ml-2 font-semibold">PII Detected</span>
                    </div>
                    <p className="text-3xl font-bold">{review.pii_detected ? 'YES' : 'NO'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Findings */}
            {review.findings && review.findings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {review.findings.map((finding: any, index: number) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          finding.severity === 'HIGH' || finding.severity === 'CRITICAL'
                            ? 'bg-red-50 border-red-200'
                            : finding.severity === 'MEDIUM'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start">
                          <span className={`px-2 py-1 rounded text-xs font-bold mr-3 ${
                            finding.severity === 'HIGH' || finding.severity === 'CRITICAL'
                              ? 'bg-red-600 text-white'
                              : finding.severity === 'MEDIUM'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}>
                            {finding.severity}
                          </span>
                          <div>
                            <p className="font-semibold">{finding.category}</p>
                            <p className="text-sm mt-1">{finding.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Regulatory Concerns */}
            {review.regulatory_concerns && review.regulatory_concerns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regulatory Concerns</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.regulatory_concerns.map((concern: any, index: number) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{typeof concern === 'string' ? concern : concern.description}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {review.recommendations && review.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.recommendations.map((rec: any, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{typeof rec === 'string' ? rec : rec.description}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Required Actions */}
            {review.required_actions && review.required_actions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {review.required_actions.map((action: any, index: number) => (
                      <li key={index} className="flex items-start">
                        <XCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{typeof action === 'string' ? action : action.description}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Vendor Evaluation */}
            {review.vendor_evaluation && (
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Evaluation</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(review.vendor_evaluation, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="mb-6">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <p className="text-gray-600">AI review in progress...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              <Button className="mt-4" onClick={fetchSubmission}>
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Project & Model Overview</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-600">Model Type</dt>
                    <dd className="font-medium">{submission.model_type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Model Origin</dt>
                    <dd className="font-medium">{submission.model_origin}</dd>
                  </div>
                  {submission.vendor_name && (
                    <div>
                      <dt className="text-sm text-gray-600">Vendor</dt>
                      <dd className="font-medium">{submission.vendor_name}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Intended Use</h3>
                <p className="text-gray-700">{submission.intended_purpose}</p>
                <div className="mt-3">
                  <span className="text-sm text-gray-600">Business Impact: </span>
                  <span className="font-medium">{submission.business_impact_category.toUpperCase()}</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Human in Loop: </span>
                  <span className="font-medium">{submission.human_in_loop ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Data Sources</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{submission.data_sources}</p>
                <div className="mt-3">
                  <span className="text-sm text-gray-600">Contains Customer Data: </span>
                  <span className="font-medium">{submission.contains_customer_data}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Deployment</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-600">Location</dt>
                    <dd className="font-medium">{submission.deployment_location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Sees Sensitive Data</dt>
                    <dd className="font-medium">{submission.sees_sensitive_data}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
