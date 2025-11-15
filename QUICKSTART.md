# Quick Start Guide

Get the AI Intake System running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Installation

### 1. Set up environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=your_api_key_here
nano .env  # or use your preferred editor
```

### 2. Start the application

**Option A: Use the quick start script**
```bash
./start.sh
```

**Option B: Manual start**
```bash
# Build and start all services
docker-compose up --build -d

# Check logs
docker-compose logs -f
```

### 3. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Usage

### Submit a New AI Model Request

1. Navigate to http://localhost:3000
2. Click "Submit New Request"
3. Fill out the 7-section intake form:
   - Project & Model Overview
   - Intended Use & Scope
   - Data Used
   - Model Modifications
   - Operational Deployment
   - Risk & Safety Considerations
   - Artifacts (optional)
4. Click "Submit for Review"

### View AI Review Results

1. After submission, you'll be redirected to the submission detail page
2. The AI review will process automatically (takes 10-30 seconds)
3. Review the comprehensive assessment:
   - Risk score and level
   - Approval recommendation
   - Key findings
   - Regulatory concerns
   - Security issues
   - PII detection results
   - Bias concerns
   - Recommendations
   - Required actions

### View All Submissions

1. Click "View Submissions" from the home page
2. Browse all intake requests
3. Filter by status and impact level
4. Click any submission to view details

## Example Use Cases

### Use Case 1: Evaluate a Vendor AI Product (COTS)

Submit an intake request with:
- Model Type: Large Language Model (LLM)
- Model Origin: Vendor-provided model
- Vendor Name: "OpenAI" or "Anthropic"
- Business Impact: High
- Purpose: Customer service automation

The AI will evaluate:
- Vendor security posture
- Compliance with financial regulations
- Data privacy concerns
- Integration risks

### Use Case 2: In-House Model Development

Submit an intake request with:
- Model Type: Fraud Detection Model
- Model Origin: In-house trained
- Training Data: Internal transaction data
- Business Impact: High
- Regulated Decisions: Fraud decisions (FFIEC, AML/BSA)

The AI will evaluate:
- Model risk management requirements
- Data quality concerns
- Bias and fairness issues
- Validation requirements
- Regulatory compliance gaps

### Use Case 3: Open Source Model Fine-Tuning

Submit an intake request with:
- Model Type: Large Language Model (LLM)
- Model Origin: Open-source (e.g., Llama 2)
- Modifications: Fine-tuning (LoRA), RAG added
- Data Sources: Internal support tickets
- Business Impact: Medium

The AI will evaluate:
- License compliance
- Data leakage risks
- Fine-tuning quality concerns
- Security vulnerabilities
- Deployment best practices

## Understanding Review Results

### Risk Levels

- **LOW**: Minimal risk, straightforward approval
- **MEDIUM**: Moderate risk, may need minor adjustments
- **HIGH**: Significant risk, requires careful review
- **CRITICAL**: Severe risk, major concerns to address

### Approval Recommendations

- **APPROVED**: Ready for deployment
- **APPROVED_WITH_CONDITIONS**: Can proceed with specific requirements
- **REQUIRES_REVIEW**: Needs human review before decision
- **DENIED**: Too risky, should not proceed

### Risk Score

- **0-25**: Low risk
- **26-50**: Medium-low risk
- **51-75**: Medium-high risk
- **76-100**: High-critical risk

## Common Scenarios

### PII Detected

If PII is detected in your data sources:
1. Review the PII details in the assessment
2. Implement data anonymization
3. Add privacy safeguards
4. Update your submission

### Regulatory Concerns

If regulatory issues are identified:
1. Review cited regulations (ECOA, FFIEC, etc.)
2. Implement required controls
3. Document compliance measures
4. Consider legal review

### High Risk Score

If you receive a high risk score:
1. Read all findings carefully
2. Address required actions first
3. Implement recommendations
4. Consider starting with a pilot
5. Resubmit after improvements

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart
```

### AI review stuck or failing

```bash
# Check backend logs
docker-compose logs backend

# Verify API key is set
docker-compose exec backend env | grep ANTHROPIC
```

### Can't access frontend

```bash
# Verify services are running
docker-compose ps

# Check frontend logs
docker-compose logs frontend
```

### Database connection issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres
```

## Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (data will be lost)
docker-compose down -v
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize the intake form for your organization
- Add authentication and authorization
- Set up monitoring and alerts
- Configure backups

## Getting Help

- Check logs: `docker-compose logs -f`
- Review documentation in README.md
- Check GitHub issues
- Contact support

## Key Features Demonstrated

✅ Automated AI-powered reviews
✅ Comprehensive risk assessment
✅ Regulatory compliance checking
✅ PII detection
✅ Vendor evaluation
✅ Security analysis
✅ Bias concern identification
✅ Actionable recommendations

Happy reviewing! 🚀
