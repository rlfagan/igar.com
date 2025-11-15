import Anthropic from '@anthropic-ai/sdk';
import pool from '../db';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface SubmissionData {
  id: number;
  project_name: string;
  model_name: string;
  model_type: string;
  model_origin: string;
  vendor_name?: string;
  intended_purpose: string;
  business_impact_category: string;
  regulated_decisions: string[];
  human_in_loop: boolean;
  data_sources: string;
  contains_customer_data: string;
  modifications: string[];
  deployment_location: string;
  sees_sensitive_data: string;
  safety_features: string[];
  known_risks?: string;
}

interface ReviewResult {
  risk_score: number;
  risk_level: string;
  approval_recommendation: string;
  findings: any;
  regulatory_concerns: any;
  security_concerns: any;
  data_privacy_concerns: any;
  bias_concerns: any;
  recommendations: any;
  required_actions: any;
  pii_detected: boolean;
  pii_details: any;
  vendor_evaluation?: any;
  full_review: string;
}

export async function performAIReview(submission: SubmissionData): Promise<ReviewResult> {
  const prompt = buildReviewPrompt(submission);

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      temperature: 0,
      system: buildSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const reviewResult = parseAIReviewResponse(responseText, submission);

    // Save review to database
    await saveReviewToDatabase(submission.id, reviewResult);

    return reviewResult;
  } catch (error) {
    console.error('AI Review Error:', error);
    throw new Error('Failed to perform AI review');
  }
}

function buildSystemPrompt(): string {
  return `You are an expert AI governance and risk assessment system for financial services institutions. Your role is to evaluate AI/ML model intake requests and provide comprehensive risk assessments covering:

1. **Regulatory Compliance**: ECOA/Reg B (credit), FFIEC guidance, AML/BSA, KYC/CIP requirements, NIST standards, SR 11-7 (Model Risk Management)
2. **Security & Privacy**: PII/PHI detection, data protection, GLBA compliance, access controls
3. **Bias & Fairness**: Potential for discriminatory outcomes, protected class considerations
4. **Model Risk**: Inherent model limitations, data quality issues, validation requirements
5. **Vendor Risk**: For COTS products - vendor reputation, security posture, contract terms
6. **Operational Risk**: Deployment risks, monitoring capabilities, incident response

Your output must be structured JSON with the following fields:
- risk_score: Integer 0-100 (0=minimal risk, 100=critical risk)
- risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
- approval_recommendation: "APPROVED" | "APPROVED_WITH_CONDITIONS" | "REQUIRES_REVIEW" | "DENIED"
- findings: Array of specific findings with severity levels
- regulatory_concerns: Array of regulatory issues identified
- security_concerns: Array of security issues
- data_privacy_concerns: Array of data privacy issues including PII detection
- bias_concerns: Array of potential bias/fairness issues
- recommendations: Array of actionable recommendations
- required_actions: Array of mandatory actions before approval
- pii_detected: Boolean indicating if PII was found in data sources
- pii_details: Object with PII types and locations
- vendor_evaluation: Object with vendor-specific assessment (for COTS only)

Be thorough, specific, and cite relevant regulations. Focus on financial services compliance requirements.`;
}

function buildReviewPrompt(submission: SubmissionData): string {
  return `Please review the following AI/ML model intake request and provide a comprehensive risk assessment:

## SUBMISSION DETAILS

### Section 1: Project & Model Overview
- **Project Name**: ${submission.project_name}
- **Model Name**: ${submission.model_name}
- **Model Type**: ${submission.model_type}
- **Model Origin**: ${submission.model_origin}
${submission.vendor_name ? `- **Vendor**: ${submission.vendor_name}` : ''}

### Section 2: Intended Use & Scope
- **Purpose**: ${submission.intended_purpose}
- **Business Impact**: ${submission.business_impact_category}
- **Regulated Decisions**: ${submission.regulated_decisions.join(', ') || 'None'}
- **Human in the Loop**: ${submission.human_in_loop ? 'Yes' : 'No'}

### Section 3: Data Used
- **Data Sources**:
${submission.data_sources}
- **Contains Customer Data**: ${submission.contains_customer_data}

### Section 4: Model Modifications
- **Modifications**: ${submission.modifications.join(', ') || 'None'}

### Section 5: Deployment
- **Deployment Location**: ${submission.deployment_location}

### Section 6: Risk & Safety
- **Sees Sensitive Data**: ${submission.sees_sensitive_data}
- **Safety Features**: ${submission.safety_features.join(', ') || 'None'}
${submission.known_risks ? `- **Known Risks**: ${submission.known_risks}` : ''}

## REQUIRED ANALYSIS

Please provide your assessment in valid JSON format with all required fields. Consider:

1. Is this a COTS product or home-grown model? Evaluate accordingly.
2. What regulatory frameworks apply based on the use case?
3. Are there PII/sensitive data concerns in the data sources?
4. What is the inherent risk of the model type and use case?
5. Are adequate controls and safeguards in place?
6. What additional actions are required before deployment?

Provide your response as a JSON object matching the schema described in your system prompt.`;
}

function parseAIReviewResponse(response: string, submission: SubmissionData): ReviewResult {
  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = response;
    const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr);

    // Ensure all required fields exist
    return {
      risk_score: parsed.risk_score || 50,
      risk_level: parsed.risk_level || 'MEDIUM',
      approval_recommendation: parsed.approval_recommendation || 'REQUIRES_REVIEW',
      findings: parsed.findings || [],
      regulatory_concerns: parsed.regulatory_concerns || [],
      security_concerns: parsed.security_concerns || [],
      data_privacy_concerns: parsed.data_privacy_concerns || [],
      bias_concerns: parsed.bias_concerns || [],
      recommendations: parsed.recommendations || [],
      required_actions: parsed.required_actions || [],
      pii_detected: parsed.pii_detected || false,
      pii_details: parsed.pii_details || {},
      vendor_evaluation: submission.vendor_name ? parsed.vendor_evaluation : null,
      full_review: response,
    };
  } catch (error) {
    console.error('Failed to parse AI review response:', error);
    // Return a fallback review
    return {
      risk_score: 75,
      risk_level: 'HIGH',
      approval_recommendation: 'REQUIRES_REVIEW',
      findings: [
        {
          severity: 'HIGH',
          category: 'SYSTEM_ERROR',
          description: 'AI review parsing failed. Manual review required.',
        },
      ],
      regulatory_concerns: [],
      security_concerns: [],
      data_privacy_concerns: [],
      bias_concerns: [],
      recommendations: ['Manual review required due to automated review system error'],
      required_actions: ['Escalate to governance team for manual assessment'],
      pii_detected: false,
      pii_details: {},
      full_review: response,
    };
  }
}

async function saveReviewToDatabase(submissionId: number, review: ReviewResult): Promise<void> {
  const query = `
    INSERT INTO ai_reviews (
      submission_id, review_type, risk_score, risk_level, approval_recommendation,
      findings, regulatory_concerns, security_concerns, data_privacy_concerns,
      bias_concerns, recommendations, required_actions, pii_detected, pii_details,
      vendor_evaluation, full_review
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING id
  `;

  const values = [
    submissionId,
    'automated',
    review.risk_score,
    review.risk_level,
    review.approval_recommendation,
    JSON.stringify(review.findings),
    JSON.stringify(review.regulatory_concerns),
    JSON.stringify(review.security_concerns),
    JSON.stringify(review.data_privacy_concerns),
    JSON.stringify(review.bias_concerns),
    JSON.stringify(review.recommendations),
    JSON.stringify(review.required_actions),
    review.pii_detected,
    JSON.stringify(review.pii_details),
    review.vendor_evaluation ? JSON.stringify(review.vendor_evaluation) : null,
    review.full_review,
  ];

  await pool.query(query, values);
}

export async function getReviewBySubmissionId(submissionId: number) {
  const query = 'SELECT * FROM ai_reviews WHERE submission_id = $1 ORDER BY created_at DESC LIMIT 1';
  const result = await pool.query(query, [submissionId]);
  return result.rows[0] || null;
}
