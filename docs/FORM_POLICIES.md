# Form Policy Configuration System

## Overview

The AI Intake system supports **fully customizable intake forms** through a database-driven policy system. This allows different organizations and customers to tailor the intake process to their specific industry, regulatory requirements, and internal processes.

## Key Concepts

### 1. **Form Policies**
A policy is a complete form template (collection of sections and fields) tailored for a specific industry or use case.

**Pre-built Policies:**
- **Financial Services** - ECOA, FFIEC, AML/BSA, KYC compliance focus
- **Healthcare** - HIPAA, PHI protection, clinical decision support
- **Retail & E-commerce** - GDPR, personalization, customer data privacy
- **General Enterprise** - Simplified intake for general business use cases

### 2. **Sections**
Each policy contains multiple sections (e.g., "Project Overview", "Data Privacy", "Deployment")

### 3. **Fields**
Each section contains configurable fields with:
- Field type (text, textarea, select, multiselect, checkbox, radio, file)
- Validation rules
- Conditional logic
- Help text and placeholders

### 4. **Organization Customizations**
Each organization can customize any field in their assigned policy:
- Change labels and help text
- Modify dropdown options
- Add/remove validation rules
- Enable/disable specific fields

## Database Schema

```sql
organizations            -- Your customers/tenants
form_policies            -- Reusable form templates
form_sections            -- Sections within each policy
form_fields              -- Individual fields with full config
organization_policies    -- Which policy each org uses
policy_customizations    -- Org-specific field overrides
policy_audit_log         -- Track all policy changes
```

## API Endpoints

### Get Available Policies
```bash
GET /api/policies
GET /api/policies?industry=fintech
```

**Response:**
```json
{
  "success": true,
  "policies": [
    {
      "id": 1,
      "name": "Financial Services AI Governance",
      "slug": "fintech-governance",
      "description": "Comprehensive intake for financial institutions",
      "industry": "fintech",
      "is_default": true
    }
  ]
}
```

### Get Form Configuration
```bash
GET /api/policies/:policyId/form
GET /api/policies/:policyId/form?organizationId=123
```

**Response:**
```json
{
  "success": true,
  "policy": { "id": 1, "name": "..." },
  "sections": [
    {
      "id": 1,
      "section_key": "section1",
      "title": "Project & Model Overview",
      "order_index": 1,
      "fields": [
        {
          "id": 1,
          "field_key": "project_name",
          "label": "Project Name",
          "field_type": "text",
          "is_required": true,
          "validation_rules": { "min": 1, "max": 255 },
          "order_index": 1
        }
      ]
    }
  ]
}
```

### Create New Policy (Admin)
```bash
POST /api/policies
Content-Type: application/json

{
  "name": "Insurance AI Compliance",
  "slug": "insurance-compliance",
  "description": "Insurance-specific intake form",
  "industry": "insurance",
  "is_default": false
}
```

### Add Section to Policy (Admin)
```bash
POST /api/policies/:policyId/sections
Content-Type: application/json

{
  "section_key": "section1",
  "title": "Model Overview",
  "description": "Basic model information",
  "order_index": 1,
  "is_required": true
}
```

### Add Field to Section (Admin)
```bash
POST /api/policies/sections/:sectionId/fields
Content-Type: application/json

{
  "field_key": "project_name",
  "label": "Project Name",
  "field_type": "text",
  "placeholder": "Enter project name",
  "help_text": "Internal project identifier",
  "order_index": 1,
  "is_required": true,
  "validation_rules": {
    "min": 1,
    "max": 255
  }
}
```

### Customize Field for Organization
```bash
PUT /api/policies/customizations/:organizationId/:fieldId
Content-Type: application/json

{
  "custom_label": "Initiative Name",
  "custom_help_text": "Name of the AI initiative",
  "is_enabled": true
}
```

## Use Cases

### Use Case 1: Financial Institution
**Scenario:** A bank needs comprehensive regulatory compliance tracking.

**Solution:**
1. Assign "Financial Services AI Governance" policy
2. Customize field labels to match internal terminology
3. Add bank-specific validation rules
4. Enable all regulatory compliance sections

**Example Customization:**
```json
{
  "organizationId": 1,
  "policyId": 1,
  "customizations": {
    "project_name": {
      "custom_label": "Initiative Code",
      "custom_help_text": "Use format: AI-YYYY-NNN"
    },
    "regulated_decisions": {
      "custom_options": [
        {"value": "credit", "label": "Credit Underwriting (ECOA)"},
        {"value": "fraud", "label": "Fraud Detection (BSA/AML)"},
        {"value": "sanctions", "label": "Sanctions Screening (OFAC)"}
      ]
    }
  }
}
```

### Use Case 2: Healthcare Provider
**Scenario:** Hospital needs HIPAA-focused intake with clinical decision support tracking.

**Solution:**
1. Assign "Healthcare AI Compliance" policy
2. Sections focus on PHI, clinical use cases, patient impact
3. Required fields for HIPAA safeguards
4. Custom fields for clinical validation protocols

**Key Sections:**
- Clinical Context (diagnosis support, treatment planning, monitoring)
- PHI & Data Privacy (types of PHI, HIPAA controls, BAA requirements)
- Clinical Validation (FDA approval status, clinical studies, performance metrics)
- Patient Safety (human oversight, escalation procedures, error handling)

### Use Case 3: Retail Company
**Scenario:** E-commerce company needs streamlined intake focused on customer experience and GDPR.

**Solution:**
1. Assign "Retail & E-commerce AI" policy
2. Simplified sections (fewer compliance requirements)
3. Focus on customer data usage and opt-out mechanisms
4. GDPR-specific fields

**Key Sections:**
- Customer Experience Use Case (personalization, search, pricing, support)
- Data & Privacy (GDPR compliance, customer opt-out, data retention)
- Performance & Testing (A/B testing, success metrics, rollback plan)

### Use Case 4: Multi-Industry Conglomerate
**Scenario:** Large company with different divisions in finance, healthcare, and retail.

**Solution:**
1. Create separate organizations for each division
2. Assign industry-appropriate policy to each
3. Maintain central governance team for review
4. Custom dashboards showing cross-division AI portfolio

## Setting Up a New Organization

### Step 1: Create Organization
```sql
INSERT INTO organizations (name, slug, industry)
VALUES ('Acme Bank', 'acme-bank', 'fintech');
```

### Step 2: Assign Policy
```sql
INSERT INTO organization_policies (organization_id, policy_id, is_active)
SELECT o.id, p.id, true
FROM organizations o, form_policies p
WHERE o.slug = 'acme-bank'
  AND p.slug = 'fintech-governance';
```

### Step 3: Customize Fields (Optional)
```sql
-- Change "Project Name" to "Initiative Code"
INSERT INTO policy_customizations (organization_id, field_id, custom_label, custom_help_text)
SELECT 1, f.id, 'Initiative Code', 'Use format: AI-YYYY-NNN'
FROM form_fields f
WHERE f.field_key = 'project_name';
```

## Migration Path

To migrate the current hardcoded form to the policy system:

### 1. Run Database Migration
```bash
docker compose exec backend psql -U postgres -d ai_intake -f /app/src/db/migrations/006_form_configuration.sql
```

### 2. Seed Policy Templates
```bash
docker compose exec backend npm run seed-policies
```

### 3. Update Frontend to Use Dynamic Forms
```typescript
// Fetch form configuration
const response = await fetch(`/api/policies/default/form`);
const { policy, sections } = await response.json();

// Render sections and fields dynamically
sections.forEach(section => {
  section.fields.forEach(field => {
    renderField(field); // Dynamic field renderer
  });
});
```

## Benefits

✅ **Multi-Tenancy Ready** - Each customer gets their own customized form
✅ **Industry Templates** - Pre-built best practices for fintech, healthcare, retail
✅ **Full Flexibility** - Add/remove/modify any field without code changes
✅ **Version Control** - Track all policy changes in audit log
✅ **Scalable** - Add new industries/policies without engineering effort
✅ **Compliance-Focused** - Tailor questions to specific regulatory requirements

## Best Practices

### 1. Start with Templates
Always start with a pre-built industry template rather than creating from scratch.

### 2. Incremental Customization
Make small, incremental changes rather than wholesale modifications.

### 3. Test with Pilot Organizations
Test new policies with 1-2 pilot customers before rolling out broadly.

### 4. Document Customizations
Always document why specific customizations were made for traceability.

### 5. Audit Trail
Review the `policy_audit_log` regularly to track configuration changes.

## Future Enhancements

**Planned Features:**
- [ ] Visual form builder UI for admins
- [ ] Policy versioning and rollback
- [ ] A/B testing different policy configurations
- [ ] Conditional logic builder (show Field B only if Field A = X)
- [ ] Policy templates marketplace
- [ ] Automated policy recommendations based on organization profile
- [ ] Multi-language support for internationalization

## Support

For questions about form policies:
- Technical: See API documentation above
- Business: Contact your account manager
- Custom policies: Submit request to governance team
