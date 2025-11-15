'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Shield,
  Sparkle,
  FileText,
  CheckCircle,
  Brain,
  Lock,
  TrendUp,
  Users,
  Eye,
  ChartBar,
  Gauge,
  Certificate,
  CloudCheck,
  Bell,
  Database,
  ArrowRight,
  ListChecks
} from '@phosphor-icons/react'

export default function LandingPage() {
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Replace with actual authentication
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        email: credentials.email,
        name: 'User',
        role: 'admin'
      }))
      setIsLoading(false)
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-sky-600 rounded-lg flex items-center justify-center">
                <Shield weight="fill" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-950">
                  IGAR
                </h1>
                <p className="text-[9px] text-primary-600 leading-none -mt-0.5">
                  Intelligent Governance, Assurance & Risk
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="#platform" className="text-sm text-primary-600 hover:text-primary-900">Platform</Link>
              <Link href="#who" className="text-sm text-primary-600 hover:text-primary-900">Solutions</Link>
              <Link href="#about" className="text-sm text-primary-600 hover:text-primary-900">About</Link>
              <Button variant="ghost" size="sm" onClick={() => setShowLogin(!showLogin)}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => setShowLogin(true)}>
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-indigo-50/20 to-sky-50/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-full text-sm font-medium mb-8 shadow-sm">
              <Certificate weight="fill" className="w-4 h-4" />
              ISO/IEC 42001 • EU AI Act • NIST AI RMF
            </div>
            <h2 className="text-6xl font-bold text-primary-950 mb-6 leading-[1.1] tracking-tight">
              The future of AI requires trust.
              <br />
              <span className="text-indigo-600">IGAR makes it possible.</span>
            </h2>
            <p className="text-xl text-primary-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              IGAR is the end-to-end AI Intake, Governance & Risk Management platform that gives enterprises
              the visibility, controls, and auditability they need to deploy AI responsibly—aligned with
              ISO/IEC 42001, the EU AI Act, and emerging AI regulatory frameworks worldwide.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="text-base px-8 py-6 h-auto shadow-lg"
                onClick={() => setShowLogin(true)}
              >
                Request a Demo
                <ArrowRight className="w-5 h-5 ml-2" weight="bold" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 h-auto"
                onClick={() => {
                  const section = document.getElementById('platform')
                  section?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h3 className="text-4xl font-bold text-primary-950 mb-6">
              A single system of record for every AI model, tool, dataset & workflow
            </h3>
            <p className="text-lg text-primary-700 mb-6 leading-relaxed">
              Enterprises are adopting AI faster than their governance teams can keep up.
              Shadow AI, unverified tools, unassessed risks, and untracked deployments expose organizations to:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                'Regulatory non-compliance',
                'Model drift',
                'Bias & discrimination claims',
                'Privacy failures',
                'Supply-chain vulnerabilities',
                'Legal exposure',
                'Reputational harm',
                'Audit failures'
              ].map((risk, idx) => (
                <div key={idx} className="flex items-center gap-3 text-primary-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
            <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
              <CardContent className="pt-6">
                <p className="text-lg font-semibold text-indigo-900">
                  IGAR solves this by creating a centralized intake-to-approval pipeline, backed by automated
                  risk scoring, compliance checks, and documentation generation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why IGAR Exists */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h3 className="text-4xl font-bold text-primary-950 mb-6">
              AI moves fast. Regulation is catching up.
              <br />
              <span className="text-indigo-600">Your governance program needs to do both.</span>
            </h3>
            <p className="text-lg text-primary-700 leading-relaxed">
              IGAR bridges the gap between innovation and compliance by giving enterprises the tools
              to scale AI governance without slowing down innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <ListChecks weight="fill" className="w-6 h-6" />,
                title: 'Scalable Approval Workflow',
                description: 'A repeatable process for any AI system, from prompt engineering to custom models'
              },
              {
                icon: <Gauge weight="fill" className="w-6 h-6" />,
                title: 'Automated Risk Evaluation',
                description: '6-dimensional risk scoring across model, data, safety, security, and compliance'
              },
              {
                icon: <FileText weight="fill" className="w-6 h-6" />,
                title: 'Documentation Generation',
                description: 'Structured evidence aligned with ISO 42001, EU AI Act, and NIST frameworks'
              },
              {
                icon: <Database weight="fill" className="w-6 h-6" />,
                title: 'Artifact Management',
                description: 'Centralized repository for model cards, SBOMs, test reports, and audit records'
              },
              {
                icon: <Bell weight="fill" className="w-6 h-6" />,
                title: 'Ongoing Monitoring',
                description: 'Track model performance, drift, safety degradation, and policy changes'
              },
              {
                icon: <Certificate weight="fill" className="w-6 h-6" />,
                title: 'Audit-Ready Evidence',
                description: 'Everything needed for regulators, auditors, and internal review teams'
              }
            ].map((feature, idx) => (
              <Card key={idx} className="border-neutral-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="platform" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary-950 mb-4">
              The AI Intake & Governance Platform
            </h3>
            <p className="text-lg text-primary-600">
              Six integrated modules that work together seamlessly
            </p>
          </div>

          <div className="space-y-16">
            {/* Module 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                  <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Unified AI Intake Form
                </div>
                <h4 className="text-2xl font-bold text-primary-950 mb-4">
                  A modern, intelligent form that walks users through everything needed for approvals
                </h4>
                <ul className="space-y-2 text-primary-700">
                  {[
                    'Model metadata (OpenAI, Anthropic, Hugging Face, internal models)',
                    'Use case classification (including EU AI Act categories)',
                    'Data sources, PII, lineage & quality',
                    'Model modifications (prompting → LoRA → full fine-tuning)',
                    'Deployment & security architecture',
                    'Safety testing & risk management',
                    'Required documentation & artifacts'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle weight="fill" className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-primary-600 italic">
                  Backed by autofill, real-time validation, and contextual AI assistance.
                </p>
              </div>
              <div className="flex-1">
                <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
                  <CardContent className="p-8">
                    <FileText weight="fill" className="w-16 h-16 text-indigo-600 mb-4" />
                    <p className="text-sm text-primary-700">
                      7-section comprehensive intake covering model selection, use case, data sources,
                      modifications, deployment, safety, and artifacts.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Module 2 */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-4">
                  <span className="w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Automated Risk Scoring
                </div>
                <h4 className="text-2xl font-bold text-primary-950 mb-4">
                  A proprietary scoring engine that evaluates risk in real-time
                </h4>
                <ul className="space-y-2 text-primary-700">
                  {[
                    'Modification class (0-6 scale)',
                    'Data governance risk',
                    'Use case sensitivity',
                    'Deployment architecture',
                    'Security posture',
                    'Safety testing completeness',
                    'Compliance gaps'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Gauge weight="fill" className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-primary-600 italic">
                  Risk score updates in real time as the form is completed.
                </p>
              </div>
              <div className="flex-1">
                <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-white">
                  <CardContent className="p-8">
                    <Gauge weight="fill" className="w-16 h-16 text-sky-600 mb-4" />
                    <p className="text-sm text-primary-700">
                      6-dimensional risk calculation with class-specific weights and automatic
                      approval routing based on thresholds.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Module 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                  <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Compliance Engine
                </div>
                <h4 className="text-2xl font-bold text-primary-950 mb-4">
                  Automatically maps submissions to regulatory requirements
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-primary-900 mb-2">Supported Frameworks:</p>
                    <div className="flex flex-wrap gap-2">
                      {['ISO/IEC 42001', 'EU AI Act', 'NIST AI RMF', 'GDPR', 'FFIEC', 'HIPAA', 'FDA'].map((framework) => (
                        <span key={framework} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          {framework}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-primary-900 mb-2">Dynamic Requirements:</p>
                    <ul className="space-y-1 text-sm text-primary-700">
                      {[
                        'Conformity assessment (EU AI Act Annex IV)',
                        'Fundamental rights impact assessment',
                        'Documentation bundle generation',
                        'Post-market monitoring plan',
                        'Audit logs and traceability'
                      ].map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
                  <CardContent className="p-8">
                    <Certificate weight="fill" className="w-16 h-16 text-emerald-600 mb-4" />
                    <p className="text-sm text-primary-700">
                      Compliance checks automatically trigger based on use case, model type,
                      data sources, and deployment context.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who IGAR Is For */}
      <section id="who" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary-950 mb-4">
              Who IGAR Is For
            </h3>
            <p className="text-lg text-primary-600">
              Built for every team that touches AI governance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield weight="fill" />,
                title: 'AI Governance Teams',
                description: 'Scale governance without slowing innovation'
              },
              {
                icon: <FileText weight="fill" />,
                title: 'Legal & Compliance',
                description: 'Automate documentation, DPAs, risk assessments, and regulatory readiness'
              },
              {
                icon: <Lock weight="fill" />,
                title: 'Security & Risk Leaders',
                description: 'Visibility into model behavior, data flows, supply-chain dependencies'
              },
              {
                icon: <Brain weight="fill" />,
                title: 'Engineering & Product Teams',
                description: 'Get fast approvals with clear expectations and no guesswork'
              },
              {
                icon: <ChartBar weight="fill" />,
                title: 'Executives & Boards',
                description: 'Confidence that AI is controlled, documented, and defensible'
              },
              {
                icon: <Eye weight="fill" />,
                title: 'Auditors & Regulators',
                description: 'Complete audit trail and evidence packages on demand'
              }
            ].map((role, idx) => (
              <Card key={idx} className="border-neutral-200 hover:border-indigo-300 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                    {role.icon}
                  </div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Companies Choose IGAR */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-primary-950 mb-4">
              Why Companies Choose IGAR
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Enterprise-grade by design',
                description: 'Secure, SOC2-friendly architecture with optional private/VPC deployments'
              },
              {
                title: 'Zero-friction UX',
                description: 'Designed for developers and governance professionals who value their time'
              },
              {
                title: 'Deep regulatory alignment',
                description: 'From ISO 42001 to EU AI Act Annex IV, IGAR speaks the language of regulators'
              },
              {
                title: 'Built for scale',
                description: 'From 20 AI systems to 20,000 — the platform grows with you'
              },
              {
                title: 'AI-assisted everything',
                description: 'Autofill, risk analysis, document generation, reviewer summaries, compliance explanations'
              },
              {
                title: 'Configurable governance workflows',
                description: 'Every enterprise is different — IGAR adapts to your processes'
              }
            ].map((reason, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle weight="fill" className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-950 mb-2">{reason.title}</h4>
                  <p className="text-sm text-primary-700">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Preview */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-sky-50 to-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-3xl font-bold text-primary-950 mb-4">
              What's Next
            </h3>
            <p className="text-primary-700">
              Our platform is constantly evolving to meet emerging regulatory requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'AI Supply Chain Mapping (SBOM/AIBOM ingestion)',
              'Red-team testing automation',
              'Auto-generated conformity assessment bundle (EU AI Act)',
              'Fine-tuning risk validator',
              'Post-market monitoring dashboards',
              'Model-to-model comparison for risk deltas'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200">
                <Sparkle weight="fill" className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-sm text-primary-900">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About IGAR */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-primary-950 mb-6">
            About IGAR, Inc.
          </h3>
          <p className="text-xl text-primary-700 mb-8 font-semibold">
            Mission: Help enterprises deploy AI safely, responsibly, and legally—without slowing down innovation.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What We Believe</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-primary-700">
                  {[
                    'AI governance should be enabling, not blocking',
                    'Compliance must be automated, not manual',
                    'Transparency shouldn\'t be optional',
                    'Governance should scale at the speed of AI adoption',
                    'Risk intelligence must be built in, not bolted on'
                  ].map((belief, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle weight="fill" className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      {belief}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Company Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-primary-700">
                <div>
                  <p className="font-semibold text-primary-900">Headquarters</p>
                  <p>Boston, MA</p>
                </div>
                <div>
                  <p className="font-semibold text-primary-900">Founded</p>
                  <p>2024</p>
                </div>
                <div>
                  <p className="font-semibold text-primary-900">Focus Areas</p>
                  <p>AI Governance, Risk, Compliance, Model Assurance, Regulatory Readiness</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-sky-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-5xl font-bold mb-6">
            Build trust in every AI decision.
            <br />
            Start with IGAR.
          </h3>
          <div className="flex gap-4 justify-center mt-8">
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 h-auto bg-white text-indigo-600 hover:bg-neutral-50 border-0"
              onClick={() => setShowLogin(true)}
            >
              Request a Demo
              <ArrowRight className="w-5 h-5 ml-2" weight="bold" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 h-auto border-white text-white hover:bg-white/10"
              onClick={() => {}}
            >
              Download the Framework
            </Button>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sign In to IGAR</CardTitle>
                  <CardDescription>Access your governance dashboard</CardDescription>
                </div>
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-primary-600">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-700">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <p className="text-center text-sm text-primary-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Contact Sales
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-sky-600 rounded-lg flex items-center justify-center">
                  <Shield weight="fill" className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-primary-950">IGAR</span>
              </div>
              <p className="text-sm text-primary-600">
                Enterprise AI Governance built for regulated industries.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-primary-600">
                <li><Link href="#platform" className="hover:text-indigo-600">Platform</Link></li>
                <li><Link href="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-indigo-600">Documentation</Link></li>
                <li><Link href="/roadmap" className="hover:text-indigo-600">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-primary-600">
                <li><Link href="/about" className="hover:text-indigo-600">About</Link></li>
                <li><Link href="/careers" className="hover:text-indigo-600">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-600">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-indigo-600">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-primary-600">
                <li><Link href="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-indigo-600">Security</Link></li>
                <li><Link href="/compliance" className="hover:text-indigo-600">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 pt-8 flex items-center justify-between text-sm text-primary-600">
            <p>© 2025 IGAR, Inc. All rights reserved.</p>
            <p>Built for enterprise AI governance.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
