# AI Intake & Automated Review System

A comprehensive, dockerized application for managing AI/ML model intake requests with automated AI-powered reviews for compliance, security, and risk assessment.

## Features

- **📋 Comprehensive Intake Forms**: Structured forms covering all aspects of AI/ML model deployment
- **🤖 AI-Powered Reviews**: Automated analysis using Claude for instant risk assessment
- **🛡️ Compliance Checks**: Regulatory review for ECOA, FFIEC, AML/BSA, KYC/CIP, and more
- **🔍 PII Detection**: Automated identification of personally identifiable information
- **⚠️ Risk Scoring**: Comprehensive risk assessment with scores and recommendations
- **📊 Vendor Evaluation**: Automated assessment of COTS AI products and vendors
- **📁 Artifact Management**: File upload and management for documentation, SBOM, AIBOM
- **🎨 Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **🐳 Fully Dockerized**: Easy deployment with Docker Compose

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express** for REST API
- **PostgreSQL** for data persistence
- **Anthropic Claude API** for AI reviews
- **Multer** for file uploads

### Frontend
- **Next.js 14** with **React 18**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Axios** for API calls

### Infrastructure
- **Docker** & **Docker Compose**
- **PostgreSQL 16**

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Anthropic API key (get one at https://console.anthropic.com/)

### Installation

1. **Clone the repository**
   ```bash
   cd intake
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` and add your Anthropic API key**
   ```bash
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Build and start the application**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## Development Setup

### Backend Development

```bash
cd backend
npm install
npm run dev
```

The backend will run on port 3001.

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on port 3000.

### Database Setup

```bash
cd backend
npm run migrate
```

## Architecture

```
┌─────────────────┐
│   Next.js UI    │  Port 3000
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express API    │  Port 3001
│   (Backend)     │
└────┬────┬───────┘
     │    │
     │    └─────────────┐
     │                  │
┌────▼────────┐  ┌──────▼──────┐
│ PostgreSQL  │  │ Claude API  │
│  Database   │  │   (Review)  │
└─────────────┘  └─────────────┘
```

## API Endpoints

### Submissions

- `POST /api/submissions` - Create new submission
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/:id` - Get specific submission
- `PATCH /api/submissions/:id/status` - Update submission status
- `GET /api/submissions/:id/review` - Get AI review for submission

### Uploads

- `POST /api/uploads/:submissionId` - Upload artifact
- `GET /api/uploads/:submissionId` - Get artifacts for submission
- `DELETE /api/uploads/:artifactId` - Delete artifact

## Intake Form Sections

### Section 1: Project & Model Overview
- Project name, model name, type
- Model origin (open-source, vendor, in-house)
- Version and source information

### Section 2: Intended Use & Scope
- Purpose and business impact
- Regulated decision types
- Human-in-the-loop status

### Section 3: Data Used
- Training data sources
- Customer data presence
- Label modifications

### Section 4: Model Modifications
- Fine-tuning details
- RAG, prompt engineering
- Configuration files

### Section 5: Operational Deployment
- Deployment location
- Access controls
- Input/output formats

### Section 6: Risk & Safety
- Sensitive data exposure
- Safety features
- Known risks and limitations

### Section 7: Artifacts (Optional)
- Architecture diagrams
- Training notebooks
- Evaluation results
- SBOM/AIBOM files

## AI Review Process

The system performs automated reviews covering:

1. **Regulatory Compliance**
   - ECOA/Reg B (credit decisions)
   - FFIEC guidance
   - AML/BSA requirements
   - KYC/CIP standards
   - NIST frameworks
   - SR 11-7 (Model Risk Management)

2. **Security & Privacy**
   - PII/PHI detection
   - Data protection measures
   - GLBA compliance
   - Access control evaluation

3. **Bias & Fairness**
   - Discriminatory outcome risks
   - Protected class considerations
   - Fairness metrics

4. **Model Risk**
   - Inherent limitations
   - Data quality concerns
   - Validation requirements

5. **Vendor Assessment** (for COTS)
   - Vendor reputation
   - Security posture
   - Contract terms

6. **Operational Risk**
   - Deployment risks
   - Monitoring capabilities
   - Incident response readiness

## Review Output

Each review provides:

- **Risk Score**: 0-100 scale
- **Risk Level**: LOW, MEDIUM, HIGH, CRITICAL
- **Approval Recommendation**: APPROVED, APPROVED_WITH_CONDITIONS, REQUIRES_REVIEW, DENIED
- **Detailed Findings**: Categorized by severity
- **Regulatory Concerns**: Specific compliance issues
- **Security Concerns**: Vulnerabilities and risks
- **Data Privacy Concerns**: PII and sensitive data issues
- **Bias Concerns**: Fairness and discrimination risks
- **Recommendations**: Actionable improvement suggestions
- **Required Actions**: Mandatory steps before approval

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://aiintake:aiintake_dev@localhost:5432/ai_intake

# API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this

# Application
NODE_ENV=development
BACKEND_PORT=3001
FRONTEND_PORT=3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User authentication and authorization
- `submissions` - AI/ML model intake requests
- `ai_reviews` - Automated review results
- `artifacts` - Uploaded files and documents
- `comments` - Discussion threads on submissions
- `audit_log` - Complete audit trail

## Security Features

- Helmet.js for security headers
- Rate limiting on API endpoints
- Input validation with Zod
- SQL injection protection with parameterized queries
- File type validation for uploads
- Size limits on uploads (50MB)

## Production Deployment

1. **Update environment variables** in `.env` for production
2. **Use strong passwords** for database and JWT secrets
3. **Configure SSL/TLS** for HTTPS
4. **Set up reverse proxy** (nginx/Caddy) for frontend and backend
5. **Configure persistent volumes** for database and uploads
6. **Set up monitoring** and logging
7. **Enable backups** for PostgreSQL
8. **Review security headers** and CORS settings

### Example Production Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
    volumes:
      - uploads:/app/uploads
    restart: always

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: https://api.yourdomain.com
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: always
```

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify ANTHROPIC_API_KEY is set

### Frontend can't connect to backend
- Check NEXT_PUBLIC_API_URL environment variable
- Verify backend is running on port 3001
- Check CORS settings in backend

### Database migration fails
- Ensure PostgreSQL is accessible
- Check connection string format
- Verify database user has proper permissions

### AI review not working
- Verify Anthropic API key is valid
- Check API rate limits
- Review backend logs for errors

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact: support@yourdomain.com

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

- [ ] User authentication and authorization
- [ ] Role-based access control (RBAC)
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Export to PDF/Excel
- [ ] Integration with ticketing systems
- [ ] Webhook support
- [ ] SSO/SAML integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app
