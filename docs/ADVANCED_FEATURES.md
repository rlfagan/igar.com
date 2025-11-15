# Advanced Features Implementation Guide

## Overview

This document describes the advanced features implemented for the AI Intake system, including dynamic forms, admin UI, policy versioning, conditional logic, and internationalization support.

---

## 1. Dynamic Form Renderer ✅

### What It Is
A React component that dynamically renders forms based on database-driven policy configurations. No hardcoded forms - everything comes from the API.

### Implementation
**Location:** `/frontend/src/components/DynamicForm.tsx`

**Key Features:**
- Fetches form configuration from `/api/policies/:id/form`
- Supports all field types: text, textarea, select, multiselect, checkbox, radio, file
- Conditional field rendering based on other field values
- Multi-section tabbed interface with progress tracking
- Form state management and validation

**Usage Example:**
```typescript
import DynamicForm from '@/components/DynamicForm'

<DynamicForm
  policyId={1}                    // Which policy to use
  organizationId={123}             // Optional: org-specific customizations
  onSubmit={handleSubmit}
  isSubmitting={isSubmitting}
/>
```

**Conditional Logic Example:**
```json
{
  "field_key": "cloud_region",
  "conditional_logic": {
    "field_key": "deployment_location",
    "operator": "equals",
    "value": "cloud_gpu"
  }
}
```
This field only shows when `deployment_location` = `cloud_gpu`.

**Supported Operators:**
- `equals` - Field value must equal specified value
- `not_equals` - Field value must not equal specified value
- `contains` - Array field must contain specified value
- `not_contains` - Array field must not contain specified value

---

## 2. Admin UI for Policy Management ✅

### What It Is
A complete admin interface for non-technical users to create and customize form policies without writing code.

### Implementation

**Policy List Page:** `/frontend/src/app/admin/policies/page.tsx`
- View all policies
- Create new policies
- Industry-specific badges
- Quick edit/preview links

**Policy Editor:** `/frontend/src/app/admin/policies/[id]/page.tsx`
- Visual section/field editor
- Drag-and-drop reordering (UI ready, backend needs implementation)
- Toggle field visibility
- Edit labels, help text, validation rules
- Add/remove sections and fields

**Features:**
- ✅ Visual policy browser with industry badges
- ✅ Create new policies with slug generation
- ✅ Section expand/collapse
- ✅ Field type icons
- ✅ Quick enable/disable fields
- ✅ Modal-based field editor
- 🚧 Drag-and-drop ordering (UI ready)
- 🚧 Bulk operations

**Access:**
Navigate to: `http://localhost:3001/admin/policies`

---

## 3. Policy Versioning & Rollback ✅

### What It Is
Complete version control for form policies - create snapshots, track changes, and rollback to previous versions.

### Implementation

**Database:** `/backend/src/db/migrations/007_policy_versioning.sql`

**Tables:**
- `policy_versions` - Complete snapshots of policies
- `version_change_log` - Detailed field-level change tracking
- `policy_active_versions` - Which version is currently live

**Functions:**
- `create_policy_version(policy_id, version_name, user_id)` - Create version snapshot
- `restore_policy_version(version_id, user_id)` - Restore to previous version

**API Endpoints:**

```bash
# Create a version snapshot
POST /api/policies/:policyId/versions
{
  "version_name": "Q4 2024 Release"
}

# Get version history
GET /api/policies/:policyId/versions

# Restore to a previous version
POST /api/policies/versions/:versionId/restore
```

**Use Cases:**
1. **Before Major Changes** - Create snapshot before modifying policy
2. **Quarterly Releases** - Version policies for compliance audits
3. **Rollback Bad Changes** - Instantly revert to previous working version
4. **A/B Testing** - Test different policy configurations

**Example Workflow:**
```bash
# 1. Create baseline version
curl -X POST http://localhost:3000/api/policies/1/versions \
  -H "Content-Type: application/json" \
  -d '{"version_name": "Baseline v1.0"}'

# 2. Make changes to policy...

# 3. Create new version
curl -X POST http://localhost:3000/api/policies/1/versions \
  -H "Content-Type: application/json" \
  -d '{"version_name": "Added GDPR fields"}'

# 4. If something breaks, rollback
curl -X POST http://localhost:3000/api/policies/versions/1/restore
```

---

## 4. Conditional Field Logic ✅

### What It Is
Show/hide fields dynamically based on other field values - create smart, context-aware forms.

### Implementation
Built into the `DynamicForm` component with `conditional_logic` field property.

**Database Schema:**
```sql
ALTER TABLE form_fields ADD COLUMN conditional_logic JSONB;
```

**Configuration Format:**
```json
{
  "field_key": "target_field",          // Field to check
  "operator": "equals",                 // Comparison operator
  "value": "expected_value"             // Value to compare against
}
```

**Examples:**

**Example 1: Cloud Provider Fields**
```sql
-- Show "AWS Region" only when deployment is AWS
UPDATE form_fields SET conditional_logic = '
{
  "field_key": "deployment_location",
  "operator": "equals",
  "value": "aws"
}'
WHERE field_key = 'aws_region';
```

**Example 2: Vendor Fields**
```sql
-- Show vendor fields only for COTS models
UPDATE form_fields SET conditional_logic = '
{
  "field_key": "model_origin",
  "operator": "equals",
  "value": "cots"
}'
WHERE field_key = 'vendor_name';
```

**Example 3: Regulatory Framework**
```sql
-- Show HIPAA fields only when healthcare selected
UPDATE form_fields SET conditional_logic = '
{
  "field_key": "regulated_frameworks",
  "operator": "contains",
  "value": "hipaa"
}'
WHERE field_key = 'hipaa_baa_signed';
```

**Complex Logic (Future Enhancement):**
```json
{
  "logic": "AND",
  "conditions": [
    {"field_key": "industry", "operator": "equals", "value": "healthcare"},
    {"field_key": "uses_customer_data", "operator": "equals", "value": "yes"}
  ]
}
```

---

## 5. Multi-Language Support (Internationalization)

### What It Is
Support for multiple languages in form policies - labels, help text, and options in any language.

### Implementation Plan

**Database Schema:**
```sql
-- Translations table
CREATE TABLE IF NOT EXISTS field_translations (
  id SERIAL PRIMARY KEY,
  field_id INTEGER REFERENCES form_fields(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL, -- 'en', 'es', 'fr', 'de', etc.
  label TEXT,
  help_text TEXT,
  placeholder TEXT,
  options JSONB, -- Translated options for select/multiselect
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(field_id, language_code)
);

-- Section translations
CREATE TABLE IF NOT EXISTS section_translations (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES form_sections(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(section_id, language_code)
);
```

**API Modification:**
```typescript
// Get form with language
GET /api/policies/1/form?language=es

// Response includes translations
{
  "policy": {...},
  "sections": [
    {
      "title": "Visión General del Proyecto",  // Spanish
      "title_en": "Project Overview",           // Fallback English
      "fields": [
        {
          "label": "Nombre del Proyecto",
          "help_text": "Identificador interno del proyecto"
        }
      ]
    }
  ]
}
```

**Frontend Integration:**
```typescript
import { useTranslation } from 'next-intl'

function DynamicForm({ policyId, language }) {
  const { t } = useTranslation()

  // Fetch with language parameter
  const url = `/api/policies/${policyId}/form?language=${language}`

  // Render with translated content
  return <div>{section.title}</div>  // Already translated from API
}
```

**Supported Languages (Planned):**
- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)
- Japanese (ja)
- Chinese Simplified (zh-CN)

**Translation Management:**
```bash
# Add Spanish translation for a field
curl -X POST http://localhost:3000/api/policies/fields/123/translations \
  -H "Content-Type: application/json" \
  -d '{
    "language_code": "es",
    "label": "Nombre del Proyecto",
    "help_text": "Identificador interno del proyecto",
    "placeholder": "Ingrese el nombre del proyecto"
  }'
```

---

## Quick Reference: All New Endpoints

### Policy Management
```bash
GET    /api/policies                              # List all policies
GET    /api/policies/:id/form                     # Get form configuration
POST   /api/policies                              # Create policy (admin)
POST   /api/policies/:id/sections                 # Add section (admin)
POST   /api/policies/sections/:id/fields          # Add field (admin)
PUT    /api/policies/customizations/:orgId/:fieldId  # Customize field
```

### Versioning
```bash
POST   /api/policies/:id/versions                 # Create version
GET    /api/policies/:id/versions                 # List versions
POST   /api/policies/versions/:id/restore         # Restore version
```

### Translations (Planned)
```bash
POST   /api/policies/fields/:id/translations      # Add translation
GET    /api/policies/:id/form?language=es         # Get translated form
```

---

## Implementation Checklist

### ✅ Completed
- [x] Dynamic form renderer component
- [x] Conditional field logic (show/hide based on values)
- [x] Admin policy list page
- [x] Admin policy editor page
- [x] Field editor modal
- [x] Policy versioning database schema
- [x] Version creation/restore API endpoints
- [x] Complete API documentation

### 🚧 In Progress
- [ ] Drag-and-drop field ordering
- [ ] Bulk field operations
- [ ] Version comparison UI
- [ ] Change tracking visualization

### 📋 Planned
- [ ] Multi-language database schema
- [ ] Translation management UI
- [ ] Language selector in forms
- [ ] Complex conditional logic (AND/OR)
- [ ] Field dependency graph visualization
- [ ] Policy templates marketplace
- [ ] Automated compliance recommendations

---

## Best Practices

### 1. Version Before Major Changes
Always create a version snapshot before making significant policy changes:
```bash
curl -X POST /api/policies/1/versions \
  -d '{"version_name": "Before adding GDPR fields"}'
```

### 2. Test with Organizations
Test policy changes with a pilot organization before rolling out to all customers:
```typescript
<DynamicForm
  policyId={1}
  organizationId={999}  // Pilot org
  onSubmit={handleSubmit}
/>
```

### 3. Use Conditional Logic Sparingly
Too many conditional fields make forms confusing. Aim for:
- ✅ 1-2 levels of conditional nesting
- ❌ Avoid 3+ levels of nested conditions

### 4. Document Custom Fields
Always add clear `help_text` to custom fields:
```json
{
  "label": "Internal Project Code",
  "help_text": "Format: AI-YYYY-NNN (e.g., AI-2024-001)"
}
```

### 5. Audit Trail
Review policy audit log regularly:
```sql
SELECT * FROM policy_audit_log
WHERE policy_id = 1
ORDER BY created_at DESC
LIMIT 20;
```

---

## Troubleshooting

### Issue: Form Not Loading
```bash
# Check policy exists and is active
SELECT * FROM form_policies WHERE id = 1;

# Check sections exist
SELECT * FROM form_sections WHERE policy_id = 1;

# Check fields exist
SELECT f.* FROM form_fields f
JOIN form_sections s ON f.section_id = s.id
WHERE s.policy_id = 1;
```

### Issue: Conditional Logic Not Working
```javascript
// Check field configuration
console.log(field.conditional_logic)

// Verify target field value
console.log(formData[field.conditional_logic.field_key])

// Test operator
const passes = checkConditionalLogic(field)
console.log('Condition passes:', passes)
```

### Issue: Version Restore Failed
```sql
-- Check version exists
SELECT * FROM policy_versions WHERE id = 123;

-- Check snapshot is valid JSON
SELECT snapshot FROM policy_versions WHERE id = 123;

-- Manual restore if needed
SELECT restore_policy_version(123, 1);
```

---

## Performance Considerations

### Caching
Consider caching form configurations:
```typescript
// Cache policy configuration for 5 minutes
const cachedConfig = useSWR(
  `/api/policies/${policyId}/form`,
  fetcher,
  { revalidateOnFocus: false, dedupingInterval: 300000 }
)
```

### Database Indexes
Ensure indexes exist for performance:
```sql
CREATE INDEX IF NOT EXISTS idx_form_sections_policy ON form_sections(policy_id);
CREATE INDEX IF NOT EXISTS idx_form_fields_section ON form_fields(section_id);
CREATE INDEX IF NOT EXISTS idx_policy_versions_policy ON policy_versions(policy_id);
```

### Large Policies
For policies with 50+ fields, consider:
- Pagination or virtual scrolling
- Lazy loading of sections
- Background field validation

---

## Security Notes

1. **Admin Endpoints**: All policy modification endpoints should require admin authentication
2. **Organization Isolation**: Ensure organization customizations don't leak between orgs
3. **Version Access**: Only show version history to authorized users
4. **Audit Logging**: All policy changes must be logged with user ID

---

## Future Enhancements

1. **Visual Form Builder** - Drag-and-drop UI for building forms
2. **Policy Marketplace** - Share/sell policy templates
3. **AI-Powered Recommendations** - Suggest fields based on industry
4. **Automated Compliance Mapping** - Map fields to regulatory requirements
5. **Form Analytics** - Track field completion rates, drop-off points
6. **Smart Defaults** - Learn from previous submissions to suggest values
7. **Conditional Sections** - Show/hide entire sections, not just fields
8. **Field Validation Rules Engine** - Complex validation logic builder

---

## Support

For questions or issues with these features:
- **Technical Documentation**: See `/docs` folder
- **API Reference**: `/docs/FORM_POLICIES.md`
- **GitHub Issues**: Submit bug reports or feature requests

---

**Last Updated:** 2025-11-15
**Version:** 2.0
