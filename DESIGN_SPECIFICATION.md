# AI Intake & Governance Platform
## UI/UX Design Specification v2.0

**Target Aesthetic**: Enterprise tech-legal platform
**Reference Inspirations**: Stripe, Vercel, Ironclad, Secureframe, LexisNexis
**Compliance Focus**: ISO/IEC 42001, EU AI Act, Enterprise Governance

---

## 1. HIGH-LEVEL UI/UX IMPROVEMENTS

### 1.1 Core Design Principles

**Professional Enterprise Identity**
- Remove all emoji-based iconography
- Replace with line-based vector icons from professional libraries
- Maintain serious, authoritative tone appropriate for legal/compliance context
- Visual hierarchy emphasizes risk, compliance status, and governance state

**Cognitive Load Reduction**
- Progressive disclosure: show complexity only when needed
- Collapsible sections with smart defaults
- Contextual help instead of overwhelming instructions
- Real-time validation feedback reduces form anxiety

**Intelligent Assistance**
- AI-powered autofill from model cards, URLs, SBOMs
- Contextual suggestions based on submission data
- Automated compliance checking with explanations
- Pre-written summaries with "write for me" capabilities

**Enterprise Workflow Optimization**
- Multi-role dashboard (submitter, reviewer, approver views)
- Bulk operations for administrators
- Audit trail visibility
- Export capabilities for compliance reporting

---

## 2. DESIGN SYSTEM SPECIFICATION

### 2.1 Color Palette

**Primary Colors** (Governance & Trust)
```
--primary-950: #0a0f1e    // Deep navy (headers, primary text)
--primary-900: #1e293b    // Dark slate (secondary headers)
--primary-800: #334155    // Slate (body text)
--primary-700: #475569    // Medium slate (labels)
--primary-600: #64748b    // Light slate (helper text)
```

**Accent Colors** (Actions & Intelligence)
```
--accent-600: #4f46e5    // Indigo (primary actions, links)
--accent-500: #6366f1    // Lighter indigo (hover states)
--accent-400: #818cf8    // Soft indigo (active states)
```

**Semantic Colors** (Risk & Compliance)
```
--risk-critical: #dc2626    // Red (Class 4, 6 modifications, critical incidents)
--risk-high: #ea580c        // Orange (Class 3, 5 modifications, high risk)
--risk-medium: #f59e0b      // Amber (Class 2 modifications, medium risk)
--risk-low: #10b981         // Green (Class 0, 1 modifications, approved)
--risk-minimal: #6ee7b7     // Light green (compliant, low risk)

--compliance-pass: #059669        // Emerald (compliant, approved)
--compliance-warning: #d97706     // Amber (needs attention)
--compliance-fail: #dc2626        // Red (non-compliant, rejected)
--compliance-pending: #6366f1     // Indigo (under review)
--compliance-info: #0284c7        // Sky blue (informational)
```

**Neutral Colors** (Backgrounds & Surfaces)
```
--neutral-50: #f8fafc     // Page background
--neutral-100: #f1f5f9    // Card backgrounds
--neutral-200: #e2e8f0    // Dividers, borders
--neutral-300: #cbd5e1    // Disabled states
--neutral-900: #0f172a    // High-contrast text
```

**Transparency Layers**
```
--overlay-dark: rgba(15, 23, 42, 0.75)    // Modal overlays
--overlay-light: rgba(248, 250, 252, 0.95) // Panels
--glass-effect: rgba(241, 245, 249, 0.8)   // Floating panels
```

### 2.2 Typography

**Font Stack**
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
--font-legal: 'Inter', 'SF Pro Text', system-ui, sans-serif;
```

**Type Scale**
```css
--text-xs: 0.75rem;      // 12px - Timestamps, footnotes
--text-sm: 0.875rem;     // 14px - Helper text, labels
--text-base: 1rem;       // 16px - Body text
--text-lg: 1.125rem;     // 18px - Subheadings
--text-xl: 1.25rem;      // 20px - Section titles
--text-2xl: 1.5rem;      // 24px - Page titles
--text-3xl: 1.875rem;    // 30px - Dashboard headers
--text-4xl: 2.25rem;     // 36px - Hero text
```

**Font Weights**
```css
--weight-normal: 400;     // Body text
--weight-medium: 500;     // Labels, emphasized text
--weight-semibold: 600;   // Headings, buttons
--weight-bold: 700;       // Key metrics, critical alerts
```

**Line Heights**
```css
--leading-tight: 1.25;    // Headings
--leading-normal: 1.5;    // Body text
--leading-relaxed: 1.75;  // Long-form content
```

### 2.3 Spacing & Layout System

**Spacing Scale** (8px base unit)
```css
--space-1: 0.25rem;   // 4px
--space-2: 0.5rem;    // 8px
--space-3: 0.75rem;   // 12px
--space-4: 1rem;      // 16px
--space-5: 1.25rem;   // 20px
--space-6: 1.5rem;    // 24px
--space-8: 2rem;      // 32px
--space-10: 2.5rem;   // 40px
--space-12: 3rem;     // 48px
--space-16: 4rem;     // 64px
--space-20: 5rem;     // 80px
```

**Layout Grid**
```
Container max-width: 1440px
Gutter: 24px
Columns: 12 (desktop), 8 (tablet), 4 (mobile)
```

**Layout Zones**
```
┌─────────────────────────────────────────────────────┐
│ Top Nav (64px fixed)                                 │
├────────┬────────────────────────────────────┬────────┤
│        │                                    │        │
│ Side   │ Main Content Area                  │ Right  │
│ Nav    │ (Primary workflow)                 │ Panel  │
│ 240px  │                                    │ 320px  │
│        │                                    │ (AI    │
│        │                                    │ Assist)│
│        │                                    │        │
├────────┴────────────────────────────────────┴────────┤
│ Footer (minimal, compliance links)                   │
└─────────────────────────────────────────────────────┘
```

### 2.4 Card Styles

**Base Card**
```css
background: var(--neutral-100);
border: 1px solid var(--neutral-200);
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
transition: all 0.2s ease;
```

**Elevated Card** (hover state, important elements)
```css
box-shadow:
  0 4px 6px rgba(15, 23, 42, 0.05),
  0 10px 15px rgba(15, 23, 42, 0.03);
transform: translateY(-2px);
```

**Risk-Scored Card**
```css
border-left: 4px solid var(--risk-color);
position: relative;
```

**Section Card** (form sections)
```css
background: white;
border: 1px solid var(--neutral-200);
border-radius: 8px;
margin-bottom: 16px;
```

**Compliance Badge Card**
```css
display: inline-flex;
align-items: center;
padding: 6px 12px;
border-radius: 6px;
font-size: 0.875rem;
font-weight: 500;
gap: 6px;
background: color with 10% opacity;
color: base color;
border: 1px solid color with 30% opacity;
```

### 2.5 Dividers & Containers

**Section Divider**
```css
height: 1px;
background: linear-gradient(
  90deg,
  transparent 0%,
  var(--neutral-200) 50%,
  transparent 100%
);
margin: 32px 0;
```

**Content Divider** (within cards)
```css
border-top: 1px solid var(--neutral-200);
margin: 16px -24px;
```

**Container Styles**
```css
.container-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}

.container-narrow {
  max-width: 960px;
  margin: 0 auto;
}

.container-wide {
  max-width: 1920px;
  margin: 0 auto;
}
```

### 2.6 Icon System

**Approved Icon Libraries**

**Primary: Phosphor Icons** (Main UI)
- Consistent line weight: 1.5px
- Size range: 16px, 20px, 24px, 32px
- Style: Regular weight for body, Bold for emphasis
- CDN: `@phosphor-icons/react`

**Secondary: Heroicons** (Actions & Navigation)
- Outline style for default states
- Solid style for active/selected states
- Size: 20px standard, 24px for headers
- CDN: `@heroicons/react`

**Tertiary: Radix Icons** (Form elements & micro-interactions)
- 15px standard size
- Perfect for inline labels
- CDN: `@radix-ui/react-icons`

**Icon Sizing Standards**
```css
--icon-xs: 12px;   // Inline text icons
--icon-sm: 16px;   // Form labels, small buttons
--icon-md: 20px;   // Standard UI elements
--icon-lg: 24px;   // Section headers
--icon-xl: 32px;   // Dashboard cards
--icon-2xl: 48px;  // Empty states, hero sections
```

**Icon Color Standards**
```css
--icon-default: var(--primary-700);
--icon-muted: var(--primary-600);
--icon-primary: var(--accent-600);
--icon-success: var(--compliance-pass);
--icon-warning: var(--compliance-warning);
--icon-danger: var(--risk-critical);
```

---

## 3. ICON RECOMMENDATIONS BY SECTION

### 3.1 Main Navigation Icons

**Library: Phosphor Icons**

```typescript
import {
  House,           // Dashboard/Home
  Stack,           // Submissions list
  ShieldCheck,     // Governance & Compliance
  Database,        // Model Catalog
  Users,           // Organizations/Teams
  Gear,            // Settings
  FileText,        // Policies
  ChartBar,        // Analytics
  Bell,            // Notifications
  User,            // Profile
} from '@phosphor-icons/react'
```

### 3.2 Intake Form Section Icons

**Library: Phosphor Icons (24px, Regular weight)**

```typescript
import {
  Cube,              // Section 1: Model Selection
  Target,            // Section 2: Use Case & Purpose
  Database,          // Section 3: Data Sources
  GitBranch,         // Section 4: Model Modifications
  CloudArrowUp,      // Section 5: Deployment
  ShieldWarning,     // Section 6: Safety & Risk
  FileText,          // Section 7: Artifacts & Documentation
} from '@phosphor-icons/react'
```

**Alternative options per section:**
- Model: `Cube`, `BracketsAngle`, `Cpu`
- Use: `Target`, `Crosshair`, `Flag`
- Data: `Database`, `Table`, `FileArrowDown`
- Modifications: `GitBranch`, `GitFork`, `Tree`
- Deployment: `CloudArrowUp`, `Rocket`, `Globe`
- Safety: `ShieldWarning`, `ShieldCheck`, `FirstAid`
- Files: `FileText`, `Stack`, `FolderOpen`

### 3.3 Compliance & Risk Icons

**Library: Phosphor Icons + Heroicons**

```typescript
// ISO 42001 Compliance
import { Certificate, ShieldCheck } from '@phosphor-icons/react'

// EU AI Act Annex IV
import { Scales, FileCheck } from '@phosphor-icons/react'

// Risk Levels
import {
  ShieldSlash,      // Critical risk
  WarningCircle,    // High risk
  Warning,          // Medium risk
  ShieldCheck,      // Low risk
  CheckCircle,      // Approved/Compliant
} from '@phosphor-icons/react'

// Modification Classes
import {
  Cube,             // Class 0: Pure base model
  ChatText,         // Class 1: Prompt engineering
  MagnifyingGlass,  // Class 2: RAG
  GitBranch,        // Class 3: LoRA/PEFT
  Lightning,        // Class 4: Full fine-tuning
  Shield,           // Class 5: Safety alignment
  Code,             // Class 6: Custom tokenizer
} from '@phosphor-icons/react'
```

### 3.4 Workflow & Action Icons

**Library: Heroicons (20px, Outline)**

```typescript
import {
  PlusIcon,              // Add new
  PencilIcon,            // Edit
  TrashIcon,             // Delete
  EyeIcon,               // View/Preview
  ArrowDownTrayIcon,     // Download
  ArrowUpTrayIcon,       // Upload
  CheckIcon,             // Approve/Complete
  XMarkIcon,             // Reject/Cancel
  ClockIcon,             // Pending
  ArrowPathIcon,         // Refresh/Retry
  FunnelIcon,            // Filter
  MagnifyingGlassIcon,   // Search
  DocumentDuplicateIcon, // Copy
  ShareIcon,             // Share
} from '@heroicons/react/24/outline'
```

### 3.5 AI Assistant & Intelligence Icons

**Library: Phosphor Icons (20px)**

```typescript
import {
  MagicWand,         // AI autofill
  Sparkle,           // AI suggestions
  Robot,             // AI assistant
  Brain,             // AI analysis
  Lightning,         // Quick action
  Lightbulb,         // Recommendation
  ChatsCircle,       // AI chat
  SealCheck,         // Verified suggestion
} from '@phosphor-icons/react'
```

### 3.6 Form Element Icons

**Library: Radix Icons (15px) + Phosphor (16px)**

```typescript
import {
  CaretDown,         // Dropdown indicator
  Cross2,            // Close/Remove
  Check,             // Checkbox checked
  Circle,            // Radio unselected
  CircleBackslash,   // Radio selected
  InfoCircled,       // Tooltip trigger
  QuestionMarkCircled, // Help
} from '@radix-ui/react-icons'

import {
  CalendarBlank,     // Date picker
  MapPin,            // Location
  Link,              // URL field
  Upload,            // File upload
  ListBullets,       // Multi-select
  ToggleLeft,        // Toggle off
  ToggleRight,       // Toggle on
} from '@phosphor-icons/react'
```

### 3.7 Status & State Icons

**Library: Phosphor Icons (20px)**

```typescript
import {
  CheckCircle,       // Success/Approved
  XCircle,           // Error/Rejected
  WarningCircle,     // Warning/Needs attention
  Info,              // Information
  Clock,             // Pending/In progress
  Hourglass,         // Waiting
  LockKey,           // Locked/Secured
  LockKeyOpen,       // Unlocked
  Eye,               // Visible
  EyeSlash,          // Hidden
} from '@phosphor-icons/react'
```

### 3.8 Data & Analytics Icons

**Library: Phosphor Icons (24px)**

```typescript
import {
  ChartBar,          // Bar chart
  ChartLine,         // Line chart
  ChartPie,          // Pie chart
  TrendUp,           // Positive trend
  TrendDown,         // Negative trend
  ArrowsClockwise,   // Sync/Refresh
  FileArrowDown,     // Export
  Table,             // Data table
  Funnel,            // Filter
  SortAscending,     // Sort
} from '@phosphor-icons/react'
```

### 3.9 Governance Role Icons

**Library: Phosphor Icons (20px)**

```typescript
import {
  User,              // Model Owner
  UserGear,          // Technical Reviewer
  ShieldStar,        // AI Safety Officer
  Database,          // Data Governance Officer
  LockKey,           // Security Reviewer
  Scales,            // Legal Counsel
  ShieldCheck,       // Data Protection Officer
  Crown,             // Chief AI Officer
  ShieldChevron,     // CISO
  Gear,              // CTO
  UsersThree,        // Ethics Board
} from '@phosphor-icons/react'
```

---

## 4. SCREEN-BY-SCREEN UI/UX IMPROVEMENTS

### 4.1 HOME DASHBOARD

**Current Issues:**
- Information density too high, overwhelming at first glance
- No clear visual hierarchy between urgent and non-urgent items
- Lack of at-a-glance compliance status
- No quick actions for common workflows
- Missing AI-powered insights and recommendations

**Redesign Structure:**

```
┌──────────────────────────────────────────────────────────────┐
│ Header: Welcome back, [User] + Search + Notifications        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─────────────────────── STATUS CARDS ──────────────────┐   │
│ │                                                         │   │
│ │ [Pending Approvals]  [At Risk]  [Compliant]  [Total]  │   │
│ │   8 need review      3 alerts    24 active    35      │   │
│ │   (Red badge)        (Orange)    (Green)              │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌─────────────────┬────────────────────────────────────┐   │
│ │                 │                                    │   │
│ │  AI ASSISTANT   │  RECENT SUBMISSIONS                │   │
│ │  INSIGHTS       │                                    │   │
│ │  ─────────────  │  [Table with status, risk, date]  │   │
│ │  • 3 high-risk  │                                    │   │
│ │    need review  │  Sortable, filterable, paginated   │   │
│ │  • EU AI Act    │                                    │   │
│ │    deadline     │  Quick actions: View, Edit, Clone │   │
│ │  • Recommend    │                                    │   │
│ │    training     │                                    │   │
│ │                 │                                    │   │
│ └─────────────────┴────────────────────────────────────┘   │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ COMPLIANCE OVERVIEW                                   │   │
│ │                                                       │   │
│ │ ISO 42001: ████████░░ 80%   EU AI Act: ████████░░ 85% │   │
│ │                                                       │   │
│ │ [Chart: Submissions by Mod Class] [Risk Distribution]│   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ [Quick Actions: + New Submission  |  View Policies  |...]  │
└──────────────────────────────────────────────────────────────┘
```

**Detailed Improvements:**

**Hero Section (Status Cards)**
- Four large metric cards in a row
- Each card shows: Icon, Number, Label, Trend indicator
- Color-coded borders: Red (urgent), Orange (warning), Green (good), Blue (neutral)
- Hover reveals quick breakdown (e.g., "5 pending legal, 3 pending security")
- Cards are clickable → filter submissions view

**AI Assistant Insights Panel** (NEW)
- Left sidebar panel, collapsible
- Shows 3-5 priority insights:
  - "3 high-risk submissions need review"
  - "EU AI Act conformity deadline in 12 days"
  - "Recommended: Schedule governance training"
- Each insight is clickable → deep link to relevant screen
- Powered by Claude analysis of submission data
- Dismissible items (learn from user behavior)

**Recent Submissions Table**
- Clean data table with visual status indicators
- Columns: Title, Type, Risk Score (colored badge), Status, Submitted, Assignee, Actions
- Risk score shows as colored pill: 0-30 (green), 31-60 (yellow), 61-85 (orange), 86-100 (red)
- Status icons: Pending (clock), In Review (eye), Approved (check), Rejected (X)
- Sortable by all columns
- Quick filter chips above table: "Show only: High Risk | Pending My Review | Submitted This Week"
- Inline actions menu (three dots): View, Edit, Clone, Export, Archive
- Bulk actions checkbox for admins

**Compliance Overview Section**
- Two progress bars for ISO 42001 and EU AI Act
- Click → detailed compliance report modal
- Two side-by-side charts:
  - Pie chart: Submissions by modification class (0-6)
  - Bar chart: Risk score distribution
- Export button for compliance report (PDF)

**Quick Actions Floating Button**
- Prominent "+ New Submission" button (accent color, slightly elevated)
- Secondary actions as button group: View Policies, Manage Roles, Analytics

**Role-Based Customization**
- **Submitter view**: Focus on "My Submissions" and "New Submission" CTA
- **Reviewer view**: "Pending My Review" prominently displayed
- **Admin view**: Full analytics and all submissions

---

### 4.2 MODEL INTAKE STEPPER - GLOBAL IMPROVEMENTS

**Current Issues:**
- Linear progression feels rigid, users want to jump around
- No sense of completion/progress for long forms
- Emoji icons feel unprofessional
- No contextual help
- Form fatigue after 3-4 sections

**New Stepper Layout:**

```
┌────────────────────────────────────────────────────────────────┐
│ STICKY HEADER: Progress Bar + Section Tabs + Save/Exit        │
├─────────┬──────────────────────────────────────────┬───────────┤
│         │                                          │           │
│ LEFT    │ MAIN CONTENT AREA                        │ RIGHT     │
│ PANEL   │ (Form section)                           │ PANEL     │
│         │                                          │           │
│ ✓ Model │ ┌──────────────────────────────────┐   │ AI        │
│ ✓ Use   │ │ Section Title                     │   │ ASSISTANT │
│ • Data  │ │ Description                       │   │ ─────────│
│   Mods  │ ├──────────────────────────────────┤   │ Suggestions│
│   Deploy│ │                                   │   │ • Auto-   │
│   Safety│ │ [Form Fields]                     │   │   fill    │
│   Files │ │                                   │   │ • Help    │
│         │ │ [Collapsible subsections]         │   │ • Context │
│ ─────── │ │                                   │   │           │
│         │ └──────────────────────────────────┘   │ Validation│
│ REAL-   │                                          │ ✓ Complete│
│ TIME    │ [Next Section] [Save Draft]             │ ✓ No errors│
│ CHECKS  │                                          │ ⚠ 2 warnings│
│         │                                          │           │
│ ✓ Model │                                          │ Risk Score│
│   vendor│                                          │ [Badge]   │
│ ✓ Use   │                                          │ 45/100    │
│   case  │                                          │ Medium    │
│ ⚠ Data  │                                          │           │
│   lineage│                                         │ [Help btn]│
└─────────┴──────────────────────────────────────────┴───────────┘
```

**Key Improvements:**

**1. Sticky Navigation Header**
- Always visible at top of screen
- Progress bar: "4/7 sections complete" with percentage bar
- Horizontal tab navigation: allows non-linear progression
- Each tab shows icon + label + status (✓ complete, • in progress, empty incomplete)
- Tabs are clickable if section has been visited (not strictly linear)
- Right side: "Save Draft" (auto-saves every 30s) + "Exit" buttons

**2. Left Sidebar: Real-Time Validation Checklist** (NEW)
- Fixed sidebar showing validation status per section
- Grouped by section: Model, Use, Data, etc.
- Each requirement shows icon:
  - ✓ Green check: Complete & valid
  - ⚠ Yellow warning: Complete but flagged
  - • Gray dot: Not yet completed
  - ✗ Red X: Error/required field missing
- Expandable: click section to see specific requirements
- Example:
  ```
  Model Selection
  ✓ Model vendor selected
  ✓ Model name provided
  ⚠ License not verified

  Use Case
  ✓ Primary use case
  ✗ System use classification (Required)
  ```
- Clicking an item scrolls to that field in the form
- Shows overall completion: "18/24 requirements met"

**3. Right Sidebar: AI Assistant Panel** (NEW)
- Collapsible panel (default open)
- Context-aware help based on current section
- Features:
  - **Autofill suggestions**: "We found a model card for GPT-4. Import metadata?"
  - **Contextual help**: Explains ISO 42001 / EU AI Act requirements
  - **Risk preview**: Live risk score as form is filled
  - **Compliance tips**: "High-risk AI requires conformity assessment"
  - **Smart recommendations**: "Similar submissions used Class 3 modification"
- Chat-style interface at bottom: "Ask AI Assistant"
- Can be minimized to just show risk score badge

**4. Progress Summary Bar** (Top of page)
- Thin horizontal bar showing:
  - Completion percentage (visual bar)
  - Current risk score badge (color-coded)
  - Time estimate: "~8 minutes remaining"
  - Last saved timestamp
- Subtle gradient background from left (complete) to right (remaining)

**5. Section Card Design**
- Each section is a white card with subtle shadow
- Section header: Icon + Title + Description + Expand/Collapse toggle
- Collapsible subsections with visual hierarchy:
  ```
  ▼ Primary Information (always open)
    [fields]

  ▼ Additional Details (collapsible, starts collapsed)
    [fields]

  ▼ Advanced Options (collapsible, starts collapsed)
    [fields]
  ```
- Smart defaults: Only show "Additional Details" if user is on high-risk path

**6. Field-Level Improvements**
- Labels with inline help icons (hover for tooltip)
- Required fields marked with red asterisk + "(Required)" text
- Helper text below fields in gray
- Validation feedback:
  - Real-time validation (debounced)
  - Green checkmark for valid fields
  - Red error message for invalid
  - Yellow warning for "valid but flagged" (e.g., PII detected)
- Conditional fields: Smooth animation when revealed/hidden

**7. Navigation Controls**
- Bottom of each section:
  - "← Previous Section" (secondary button, left)
  - "Save Draft" (tertiary button, center)
  - "Next Section →" (primary button, right)
- Keyboard shortcuts: Cmd+Enter to advance, Cmd+S to save

---

### 4.3 SECTION 1: MODEL SELECTION

**Visual Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ [Icon: Cube] Model Selection                            │
│ Select or describe the AI model for this submission     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌────────────── AUTOFILL OPTIONS ────────────────┐     │
│ │                                                 │     │
│ │ Import model metadata from:                     │     │
│ │ [Hugging Face URL] [Upload Model Card]         │     │
│ │ [OpenAI/Anthropic API] [SBOM/AIBOM File]      │     │
│ │                                                 │     │
│ │ Or search model catalog: [Search box]          │     │
│ └─────────────────────────────────────────────────┘     │
│                                                         │
│ ▼ Model Details                                         │
│                                                         │
│ Model Vendor*          [Dropdown with icons]            │
│ ◯ OpenAI  ◯ Anthropic  ◯ Google  ◯ Meta  ◯ Other      │
│                                                         │
│ Model Origin*          ◯ Commercial  ◯ Open Source      │
│                                                         │
│ Model Type*            [Cascading dropdown]             │
│                        [Shows: LLM, Vision, Audio...]   │
│                                                         │
│ Model Name*            [Autocomplete text input]        │
│                        [Shows filtered model list]      │
│                                                         │
│ Model Version          [Text input]                     │
│                        Helper: e.g., gpt-4-turbo-2024-04│
│                                                         │
│ Model Card URL         [URL input with validate btn]    │
│                                                         │
│ ▼ Model Preview Card (if found)                        │
│ ┌─────────────────────────────────────────────────┐    │
│ │ [Model icon] GPT-4 Turbo                         │    │
│ │ OpenAI • LLM • 128K context                      │    │
│ │                                                  │    │
│ │ [Import all metadata] [View details]            │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ ▼ Additional Model Information                          │
│                                                         │
│ Architecture           [Dropdown: Transformer, CNN...]  │
│ Parameters             [Text: e.g., 175B]               │
│ Training Data Cutoff   [Date picker]                    │
│ Context Window         [Number: tokens]                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specific Improvements:**

**Autofill Panel** (NEW)
- Prominent card at top of section
- Four input methods:
  1. **Hugging Face URL**: Paste URL → fetch model card → import metadata
  2. **Upload Model Card**: Drag & drop or browse for model card JSON/PDF
  3. **API Integration**: Connect to OpenAI/Anthropic account → list models
  4. **SBOM/AIBOM Upload**: Upload structured data file
- AI Assistant extracts: vendor, name, version, architecture, parameters, license, etc.
- User reviews and confirms imported data
- "Import selected fields" button

**Cascading Model Selection**
- Step 1: Select vendor (visual buttons with logos)
- Step 2: Select origin (commercial/open source) → filters model list
- Step 3: Select type (LLM, Vision, Audio, etc.) → further filters
- Step 4: Model name dropdown shows only matching models
- Each step reduces cognitive load by limiting choices

**Model Preview Card** (NEW)
- If model is in catalog or model card is found:
  - Shows card with model icon, name, vendor, key specs
  - "Import all metadata" button autofills form
  - "View full details" opens modal with complete model card
- If not found:
  - Shows "Model not in catalog" message
  - Offers to create catalog entry
  - Continues with manual entry

**Field Enhancements**
- Model Vendor: Radio buttons with vendor logos (not just text)
- Model Name: Autocomplete with fuzzy search, shows model type in dropdown
- Version: Placeholder text shows example formats
- Model Card URL: "Validate" button checks if URL is accessible, shows preview

---

### 4.4 SECTION 2: USE CASE & PURPOSE

**Visual Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ [Icon: Target] Use Case & Purpose                       │
│ Describe how and why you will use this AI model         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ▼ Primary Use Case                                      │
│                                                         │
│ Use Case Name*         [Text input with AI assist]     │
│                        [✨ Generate with AI]            │
│                                                         │
│ Detailed Description*  [Rich text editor, 500 words]   │
│                        [✨ Write for me] [Expand]       │
│                        ┌──────────────────────────┐    │
│                        │ AI SUGGESTION:            │    │
│                        │ "Customer support AI to   │    │
│                        │ answer product questions" │    │
│                        │ [Accept] [Edit]           │    │
│                        └──────────────────────────┘    │
│                                                         │
│ ▼ System Classification (EU AI Act)                    │
│                                                         │
│ This system is used for: (Select all that apply)       │
│                                                         │
│ ☐ Credit scoring / Financial underwriting              │
│ ☐ Employment decisions (hiring, evaluation)            │
│ ☐ Educational assessment                                │
│ ☐ Law enforcement / Justice system                      │
│ ☐ Border control / Migration                            │
│ ☐ Critical infrastructure                               │
│ ☐ Healthcare / Medical diagnosis                        │
│ ☐ Content moderation                                    │
│ ☐ Customer service / Support                            │
│ ☐ None of the above                                     │
│                                                         │
│ [ℹ️ Info badge: "Your selections determine EU AI Act   │
│  risk classification. High-risk uses require conformity│
│  assessment."]                                          │
│                                                         │
│ ▼ Expected Impact                                       │
│                                                         │
│ Expected Users/Day    [Number input]                    │
│ Affected Population   [Dropdown: <100, 100-1k, 1k-10k..]│
│ Decision Autonomy     [Slider: AI suggests → AI decides]│
│                       Human oversight: [Describe]       │
│                                                         │
│ ▼ Regulatory Context                                    │
│                                                         │
│ Regulated Industry?   ◯ Yes  ◯ No                       │
│                       └→ If yes: [Multi-select]         │
│                           ☐ Financial Services (FFIEC)  │
│                           ☐ Healthcare (HIPAA)          │
│                           ☐ Public Sector               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specific Improvements:**

**AI-Assisted Writing** (NEW)
- "Generate with AI" button next to Use Case Name
  - Opens modal: "Tell me about your use case in a few words"
  - User types: "customer support for billing questions"
  - AI generates professional use case name: "Customer Billing Support AI Assistant"
  - User can edit before accepting

- "Write for me" button in Description field
  - Uses form data so far to generate detailed description
  - Example output: "This AI assistant will be deployed in our customer support workflow to help customers with billing-related inquiries. It will analyze customer questions, retrieve relevant billing information, and provide accurate responses, escalating complex issues to human agents."
  - Expandable text editor with formatting toolbar
  - AI continuously offers to improve text as user edits

**System Classification with Smart Feedback** (NEW)
- Checkboxes for EU AI Act categories
- Real-time risk indicator appears based on selections:
  - If any high-risk category selected → Orange/Red badge appears: "HIGH-RISK AI SYSTEM"
  - Info tooltip explains implications
  - Right panel AI Assistant updates: "Based on your selection, this requires conformity assessment per EU AI Act Article 43"
- "None of the above" is mutually exclusive (checking it unchecks others)
- Conditional question appears if high-risk selected: "Describe planned conformity assessment approach"

**Impact Visualization**
- Decision Autonomy slider:
  ```
  AI Suggests ←─────●──────────→ AI Decides
               (Current: Mostly autonomous)
  ```
  - As slider moves right, risk score increases in real-time
  - Triggers conditional field: "Describe human oversight procedures"

**Regulatory Context with Conditional Forms** (NEW)
- If "Regulated Industry: Yes" selected:
  - Checkboxes appear for FFIEC, HIPAA, etc.
  - Each checked item adds required evidence to checklist
  - AI Assistant shows: "HIPAA compliance requires: BAA, data encryption documentation, access logs"

---

### 4.5 SECTION 3: DATA SOURCES

**Visual Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ [Icon: Database] Data Sources                           │
│ Define the data used for training, fine-tuning, or RAG  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Data Usage Type*       [Visual selection cards]         │
│                                                         │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│ │  📊  │  │  📚  │  │  🔍  │  │  ⛔  │                │
│ │Train │  │ RAG  │  │Test/ │  │ None │                │
│ │      │  │      │  │Eval  │  │      │                │
│ └──────┘  └──────┘  └──────┘  └──────┘                │
│ (Select all that apply)                                 │
│                                                         │
│ ▼ Data Sources (Dynamic list)                           │
│                                                         │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Data Source #1                           [Remove]│    │
│ │ ────────────────────────────────────────────── │    │
│ │ Source Name*        [Text input]                │    │
│ │ Data Type*          [Dropdown: Text, Image...]  │    │
│ │ Source Origin*      [Dropdown: Internal, Vendor]│    │
│ │                                                  │    │
│ │ ▼ Data Governance                                │    │
│ │                                                  │    │
│ │ Contains PII?       ◯ No  ◯ Yes                 │    │
│ │                     └→ If yes: [Checkboxes]     │    │
│ │                         ☐ Names                  │    │
│ │                         ☐ Email/Phone            │    │
│ │                         ☐ Financial data         │    │
│ │                         ☐ Health records         │    │
│ │                         ☐ Biometric data         │    │
│ │                                                  │    │
│ │ [⚠️ PII detected: Data governance review required]│   │
│ │                                                  │    │
│ │ Data Retention      [Dropdown: 30/60/90 days...]│    │
│ │ Consent Obtained?   ◯ Yes  ◯ No  ◯ N/A          │    │
│ │                                                  │    │
│ │ ▼ Lineage & Quality (Collapsible)               │    │
│ │                                                  │    │
│ │ Data Lineage Docs   [Upload or link]            │    │
│ │ Quality Assessment  [Text area]                  │    │
│ │ Data Bias Evaluation [Text area]                │    │
│ │                                                  │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ [+ Add Another Data Source]                             │
│                                                         │
│ ▼ Aggregate Data Summary (Auto-calculated)              │
│                                                         │
│ Total data sources: 3                                   │
│ PII-containing sources: 1 ⚠️                            │
│ Data governance risk: Medium                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specific Improvements:**

**Visual Data Type Selection** (REPLACE EMOJI)
- Instead of emoji icons, use proper icon library:
  ```typescript
  import { Database, Books, MagnifyingGlass, ProhibitSign } from '@phosphor-icons/react'
  ```
- Four card-style buttons with icons and labels
- Multi-select: can choose Training + RAG, or Testing + Evaluation
- Each card changes color when selected (accent blue border)

**Dynamic Data Source List with Deduplication** (NEW)
- "Add Another Data Source" button adds new card
- **Duplicate detection**: When user enters source name, check against existing sources
  - If similar name found: Show warning "Similar source already added: [Name]. Add anyway?"
  - Prevents accidental duplicates
- Drag-and-drop reordering of data sources
- Each source is collapsible card

**PII Detection & Governance** (NEW)
- PII checkbox triggers:
  1. Conditional checkboxes for PII types
  2. Warning badge appears: "Data governance review required"
  3. Increases data governance risk score in real-time
  4. AI Assistant suggests: "Consider data minimization per GDPR Article 5"
  5. Adds to checklist: "PII protection measures documented"
- If multiple PII types selected → triggers "High risk" classification

**Smart Defaults & Helpers**
- Data Type dropdown includes icons:
  - Text (document icon)
  - Images (image icon)
  - Audio (waveform icon)
  - Video (video icon)
  - Structured Data (table icon)
- Source Origin triggers conditional fields:
  - If "Vendor": Show "Vendor Name" and "DPA status" fields
  - If "Internal": Show "Data owner" and "Internal classification"
- Auto-calculated summary at bottom updates as sources are added/removed

**Collapsible Advanced Sections**
- "Lineage & Quality" starts collapsed
- Only required for Class 3+ modifications
- AI Assistant detects modification class and says: "Lineage documentation required for LoRA fine-tuning"

---

### 4.6 SECTION 4: MODEL MODIFICATIONS

**Visual Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ [Icon: GitBranch] Model Modifications                   │
│ Specify how you are modifying the base model            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌────────── ISO 42001 MODIFICATION CLASSIFICATION ───┐  │
│ │                                                     │  │
│ │ Select the modification approach:                  │  │
│ │                                                     │  │
│ │ ◯ Class 0: Pure Base Model                         │  │
│ │   Risk: Low | Evidence: Model card, license        │  │
│ │                                                     │  │
│ │ ◯ Class 1: Prompt Engineering Only                 │  │
│ │   Risk: Low | Evidence: Prompt templates           │  │
│ │                                                     │  │
│ │ ◯ Class 2: RAG (Retrieval-Augmented Generation)    │  │
│ │   Risk: Medium | Evidence: Data lineage, PII       │  │
│ │                                                     │  │
│ │ ◯ Class 3: LoRA / QLoRA / PEFT                     │  │
│ │   Risk: Medium-High | Evidence: Training data,     │  │
│ │   safety tests, bias eval                          │  │
│ │                                                     │  │
│ │ ◯ Class 4: Full Fine-Tuning                        │  │
│ │   Risk: High | Evidence: Full documentation,       │  │
│ │   conformity assessment, privacy impact            │  │
│ │   [⚠️ HIGH-RISK: EU AI Act compliance required]    │  │
│ │                                                     │  │
│ │ ◯ Class 5: Safety Alignment Tuning (RLHF/DPO)     │  │
│ │   Risk: Medium-High | Evidence: Alignment data,    │  │
│ │   safety metrics                                   │  │
│ │                                                     │  │
│ │ ◯ Class 6: Custom Tokenizer                        │  │
│ │   Risk: Very High | Evidence: Specification,       │  │
│ │   stability tests, conformity assessment           │  │
│ │   [🔴 CRITICAL: Substantial modification]          │  │
│ │                                                     │  │
│ │ [ℹ️ Learn more about modification classes]         │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                         │
│ ▼ Modification Details (Conditional based on class)    │
│                                                         │
│ [Dynamic form fields appear based on selected class]   │
│                                                         │
│ For Class 1 (Prompt Engineering):                      │
│   System Prompt        [Text area, 1000 chars]         │
│   Prompt Template      [Code editor with syntax]       │
│   Version Control      [Text: v1.2.3]                  │
│                                                         │
│ For Class 2 (RAG):                                      │
│   Knowledge Base       [Describe]                       │
│   Retrieval Method     [Dropdown: Vector, Keyword...]  │
│   Embedding Model      [Text input]                     │
│   See Section 3: Data Sources ↗                        │
│                                                         │
│ For Class 3 (LoRA/PEFT):                               │
│   Adapter Type         [Dropdown: LoRA, QLoRA, Prefix] │
│   Training Dataset     [Upload or describe]            │
│   Hyperparameters      [JSON editor]                   │
│   Training Duration    [Text]                          │
│   Evaluation Results   [Upload: bias, safety tests]    │
│                                                         │
│ For Class 4 (Full Fine-Tuning):                        │
│   Complete Dataset     [Upload or link]                │
│   Training Config      [JSON/YAML upload]              │
│   Safety Testing       [Upload reports]                │
│   Conformity Assessment [Link to Section 6]            │
│                                                         │
│ ▼ Evidence Upload (Based on class requirements)         │
│                                                         │
│ Required Evidence:                                      │
│ ✓ Model card                 [Uploaded: model-card.pdf]│
│ ⚠️ Safety test results       [Upload required]         │
│ ⚠️ Bias evaluation report    [Upload required]         │
│ ✗ Training dataset docs      [Not uploaded - Required] │
│                                                         │
│ [Upload documents] [Or link to Section 7: Artifacts]   │
│                                                         │
│ ▼ Impact Assessment                                     │
│                                                         │
│ How does this modification change model behavior?       │
│ [Text area with AI assistance]                         │
│ [✨ AI: Analyze modification impact]                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specific Improvements:**

**Modification Class Selection as Primary UI Element** (NEW)
- Each class is a radio card with:
  - Class number and name
  - Risk level badge (color-coded)
  - Required evidence preview (truncated)
  - Info icon → tooltip with full requirements
- Visual design:
  - Unselected: Gray border, muted text
  - Selected: Accent blue border, highlighted, expands to show details
  - High-risk classes (4, 6): Red/orange accent border
- Selection immediately updates:
  1. Right panel risk score
  2. Left sidebar checklist (adds requirements)
  3. Conditional form fields below
  4. AI Assistant context

**Dynamic Conditional Forms** (NEW)
- Form fields appear/disappear based on class selection
- Smooth animation (fade in/out)
- Each class has tailored fields:
  - Class 0: Minimal (just model verification)
  - Class 1: Prompt-specific fields
  - Class 2: RAG-specific (links to Data section)
  - Class 3-6: Progressively more comprehensive

**Evidence Checklist Integration**
- Shows required evidence based on class
- Status for each item:
  - ✓ Green: Uploaded
  - ⚠️ Yellow: Upload recommended
  - ✗ Red: Required but missing
- Click to upload directly or link to Section 7 (Artifacts)
- Real-time validation: Can't submit without required evidence

**Risk Score Impact Visualization** (NEW)
- As user selects higher classes, risk score in right panel updates:
  ```
  Risk Score: 35 → 68 (Class 3 selected)
  [Progress bar animates from green to orange]
  ```
- AI Assistant explains: "Class 3 modifications require AI Safety Officer approval per ISO 42001"

**Cross-Section Linking**
- Smart links between sections:
  - "See Section 3: Data Sources" opens Data section in same context
  - "Link to Section 6: Safety assessment" creates internal reference
  - "Continue to Artifacts upload" jumps to Section 7

**AI Impact Analysis** (NEW)
- "Analyze modification impact" button
- AI reads modification details and generates analysis:
  - "This LoRA fine-tuning will adapt the model's response style to medical terminology while preserving factual accuracy. Primary risk: potential for biased medical advice if training data is not representative."
- User can edit AI-generated text
- Saves time on documentation

---

### 4.7 SECTION 5: DEPLOYMENT & INFRASTRUCTURE

**Visual Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ [Icon: CloudArrowUp] Deployment & Infrastructure        │
│ Describe where and how the model will be deployed       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ▼ Deployment Architecture                               │
│                                                         │
│ Deployment Type*       [Visual cards]                   │
│                                                         │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│ │  Cloud   │  │ On-Prem  │  │  Hybrid  │              │
│ │ [Icon]   │  │ [Icon]   │  │ [Icon]   │              │
│ └──────────┘  └──────────┘  └──────────┘              │
│                                                         │
│ Cloud Provider*        [Dropdown with logos]            │
│ ◯ AWS  ◯ Azure  ◯ GCP  ◯ Anthropic  ◯ OpenAI  ◯ Other │
│                                                         │
│ ┌─────────── AUTO-FETCH DPA ──────────┐                │
│ │ [✓] Data Processing Agreement found │                │
│ │ Provider: AWS                        │                │
│ │ DPA URL: [link]                      │                │
│ │ GDPR Compliant: Yes                  │                │
│ │ [Review DPA] [Override]              │                │
│ └──────────────────────────────────────┘                │
│                                                         │
│ Region/Location*       [Dropdown: us-east-1, eu-west...]│
│                        [ℹ️ GDPR: EU data must stay in EU]│
│                                                         │
│ Deployment Model       ◯ API  ◯ Embedded  ◯ Batch       │
│                                                         │
│ ▼ Security & Access                                     │
│                                                         │
│ Authentication         [Multi-select]                   │
│ ☐ OAuth 2.0 / OIDC                                      │
│ ☐ API Keys                                              │
│ ☐ mTLS                                                  │
│ ☐ SAML / SSO                                            │
│                                                         │
│ Data Encryption                                         │
│ In Transit:  ◯ TLS 1.2  ◯ TLS 1.3  ◯ Other             │
│ At Rest:     ◯ AES-256  ◯ AES-128  ◯ Other             │
│                                                         │
│ Access Control         [Text area]                      │
│                        [✨ Generate access policy]      │
│                                                         │
│ ▼ Monitoring & Logging                                  │
│                                                         │
│ Logging Enabled?       ◯ Yes  ◯ No                      │
│   └→ If yes:                                            │
│       Log Retention:   [Dropdown: 30/60/90 days...]    │
│       PII in Logs?     ◯ Yes (requires anonymization)  │
│                        ◯ No                             │
│                                                         │
│ Monitoring Tools       [Multi-select]                   │
│ ☐ Application logs                                      │
│ ☐ Performance metrics                                   │
│ ☐ Drift detection                                       │
│ ☐ Bias monitoring                                       │
│ ☐ Security events                                       │
│                                                         │
│ ▼ Disaster Recovery                                     │
│                                                         │
│ Backup Strategy        [Text area]                      │
│ Rollback Plan          [Text area]                      │
│                        [✨ AI: Suggest DR plan]         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specific Improvements:**

**Visual Deployment Type Selection** (REPLACE EMOJI)
- Three large card buttons with proper icons from Phosphor:
  ```typescript
  import { Cloud, HardDrives, CloudCheck } from '@phosphor-icons/react'
  ```
- Each card shows icon, label, and brief description
- Selecting a card highlights it with accent border

**Auto-Fetch DPA** (NEW FEATURE - REQUESTED)
- When cloud provider is selected:
  1. System automatically checks database for DPA template
  2. If found: Displays DPA info card with:
     - Provider name
     - DPA URL (clickable)
     - GDPR compliance status
     - Last updated date
  3. User can review, accept, or override
  4. If not found: Shows "No DPA template found. Add manually?"
- Reduces manual work for common providers
- Database includes templates for: AWS, Azure, GCP, Anthropic, OpenAI

**Region Selection with Compliance Warnings** (NEW)
- Dropdown shows regions grouped by geography:
  ```
  🇺🇸 North America
    - us-east-1
    - us-west-2
  🇪🇺 Europe
    - eu-west-1
    - eu-central-1
  🇦🇸 Asia Pacific
    - ap-southeast-1
  ```
- If data contains PII from EU citizens and non-EU region selected:
  - ⚠️ Warning appears: "GDPR Article 44: EU personal data requires adequate safeguards for non-EU processing"
  - AI Assistant suggests: "Consider EU region or implement Standard Contractual Clauses"

**Authentication Multi-Select with Recommendations**
- User can select multiple auth methods
- AI Assistant evaluates security:
  - If only "API Keys" selected: "⚠️ Recommendation: Add OAuth for enhanced security"
  - If "mTLS" selected: "✓ High security: Mutual TLS recommended for sensitive data"

**AI-Assisted Policy Generation** (NEW)
- "Generate access policy" button creates role-based access control policy:
  ```
  Based on your use case (Customer Support AI) and deployment (AWS),
  recommended access policy:

  - Support Agents: Read-only API access
  - Team Leads: Read + limited write access
  - Admins: Full access + audit logs
  - External: No access (internal only)
  ```
- User can edit before accepting
- Saved as structured JSON for export

**Monitoring Integration**
- Checkboxes for monitoring types
- If "Drift detection" or "Bias monitoring" selected:
  - Triggers required post-market monitoring plan
  - AI Assistant: "ISO 42001 requires documented monitoring procedures"

---

### 4.8 SECTION 6: SAFETY, RISK & COMPLIANCE

**Visual Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ [Icon: ShieldWarning] Safety, Risk & Compliance         │
│ Assess risks and document safety measures               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌────────── LIVE RISK SCORE DASHBOARD ──────────┐      │
│ │                                                │      │
│ │ Overall Risk Score: [68/100] MEDIUM-HIGH       │      │
│ │ ████████████████████░░░░░░░░░░                 │      │
│ │                                                │      │
│ │ Risk Breakdown:                                │      │
│ │ • Licensing Risk:      [25] Low                │      │
│ │ • Data Governance:     [75] High ⚠️            │      │
│ │ • Safety Alignment:    [60] Medium             │      │
│ │ • Transparency:        [40] Low-Medium         │      │
│ │ • Security Risk:       [55] Medium             │      │
│ │ • Compliance Risk:     [80] High ⚠️            │      │
│ │                                                │      │
│ │ Required Approvals: 5 roles                    │      │
│ │ ✓ Model Owner                                  │      │
│ │ ⏳ AI Safety Officer                           │      │
│ │ ⏳ Data Governance Officer                     │      │
│ │ ⏳ Security Reviewer                           │      │
│ │ ⏳ Legal Counsel                               │      │
│ │                                                │      │
│ │ [Calculate Risk] [View Details]                │      │
│ └────────────────────────────────────────────────┘      │
│                                                         │
│ ▼ EU AI Act Classification (Auto-calculated)            │
│                                                         │
│ Based on your use case and modifications:               │
│                                                         │
│ [🔴 HIGH-RISK AI SYSTEM]                               │
│                                                         │
│ Triggers:                                               │
│ • Employment decisions (Section 2)                      │
│ • Class 4 modification (Section 4)                      │
│ • >1000 affected users/day (Section 2)                 │
│                                                         │
│ Requirements:                                           │
│ ☐ Conformity assessment (Annex IV)                     │
│ ☐ Risk management system                               │
│ ☐ Post-market monitoring plan                          │
│ ☐ Fundamental rights impact assessment                 │
│                                                         │
│ [Start Conformity Assessment Wizard →]                  │
│                                                         │
│ ▼ Risk Assessment                                       │
│                                                         │
│ Potential Harms       [Text area]                       │
│                       [✨ AI: Identify potential harms] │
│                                                         │
│ Mitigation Measures   [Text area]                       │
│                       [✨ AI: Suggest mitigations]      │
│                                                         │
│ Failure Modes         [Text area]                       │
│                                                         │
│ Human Oversight       [Text area]                       │
│                       [✨ AI: Design oversight plan]    │
│                                                         │
│ ▼ Safety Testing & Validation                           │
│                                                         │
│ Safety Tests Conducted [Multi-select]                   │
│ ☐ Adversarial robustness testing                       │
│ ☐ Bias and fairness evaluation                         │
│ ☐ Red-team testing                                      │
│ ☐ Toxicity testing                                      │
│ ☐ PII leakage testing                                   │
│ ☐ Out-of-distribution testing                          │
│                                                         │
│ Test Results         [Upload reports]                   │
│                      [Or link to Section 7]             │
│                                                         │
│ ▼ Compliance Checklist (Dynamic based on context)       │
│                                                         │
│ ISO/IEC 42001:                                          │
│ ☐ Risk management process (Clause 6.1)                 │
│ ☐ Objectives and planning (Clause 6.2)                 │
│ ☐ Competence and awareness (Clause 7.2)                │
│ ☐ Documented information (Clause 7.5)                  │
│                                                         │
│ EU AI Act (if high-risk):                               │
│ ☐ Technical documentation (Annex IV)                   │
│ ☐ Conformity assessment (Article 43)                   │
│ ☐ CE marking (Article 49)                              │
│ ☐ Registration in EU database (Article 71)             │
│                                                         │
│ [Generate Compliance Report]                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specific Improvements:**

**Live Risk Score Dashboard** (NEW - CRITICAL FEATURE)
- Prominent card at top showing real-time risk calculation
- Overall score: Large number with progress bar (color-coded)
- Breakdown of 6 risk dimensions (from governance risk scoring service)
- Each dimension shows:
  - Score (0-100)
  - Risk level (Low/Medium/High)
  - Visual indicator (color dot)
  - ⚠️ icon if high
- Required approvals list based on modification class
  - ✓ Already approved
  - ⏳ Pending
  - Empty circle: Not yet requested
- "Calculate Risk" button triggers backend risk calculation API
- "View Details" opens modal with full risk report

**Auto-Calculated EU AI Act Classification** (NEW)
- System automatically analyzes:
  1. Use case (Section 2: System Used For)
  2. Modification class (Section 4)
  3. Impact scope (Section 2: Affected users)
  4. Regulated industry (Section 2)
- Displays result as colored badge:
  - 🔴 High-Risk
  - 🟠 Limited Risk
  - 🟢 Minimal Risk
  - ⚪ Unclassified
- Lists specific triggers that led to classification
- Shows required compliance actions as checklist
- "Start Conformity Assessment Wizard" button launches guided flow

**AI-Assisted Risk Analysis** (NEW)
- Three "AI assist" buttons:

  1. **"Identify potential harms"**
     - Analyzes use case, data, deployment
     - Generates list of potential harms:
       ```
       Based on your employment decision use case:
       • Discriminatory outcomes against protected classes
       • Privacy violations through excessive data collection
       • Lack of transparency in decision-making
       • Reputational harm if model fails publicly
       ```

  2. **"Suggest mitigations"**
     - For each identified harm, suggests mitigation:
       ```
       Mitigation for discriminatory outcomes:
       • Implement fairness constraints in model training
       • Regular bias audits across demographic groups
       • Human review for all negative decisions
       • Adversarial debiasing techniques
       ```

  3. **"Design oversight plan"**
     - Creates human oversight procedures:
       ```
       Recommended oversight for high-risk employment AI:
       • Human-in-the-loop: All final decisions reviewed by HR
       • Audit frequency: Quarterly fairness audits
       • Escalation: Automated alerts for anomalous predictions
       • Documentation: Decision logs with explanations
       ```

**Dynamic Compliance Checklist** (NEW)
- Checklist items appear based on context:
  - If high-risk: EU AI Act items appear
  - If Class 3+: Additional ISO 42001 items
  - If regulated industry: Industry-specific items (FFIEC, HIPAA)
- User checks off items as completed
- Each item links to documentation requirements
- "Generate Compliance Report" creates PDF with:
  - All checked items
  - Evidence cross-references
  - Approval status
  - Export for auditors

**Safety Testing Integration**
- Multi-select checkboxes for test types
- Checking a box reveals "Upload results" field
- Can link to Section 7 artifacts or upload directly
- If high-risk and tests not checked: Red warning appears

---

### 4.9 SECTION 7: ARTIFACTS & DOCUMENTATION

**Visual Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ [Icon: FileText] Artifacts & Documentation               │
│ Upload supporting documents and evidence                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────── DOCUMENT MANAGEMENT ────────────┐        │
│ │                                              │        │
│ │ [Drag & Drop Area]                           │        │
│ │                                              │        │
│ │ Drop files here or [Browse]                  │        │
│ │                                              │        │
│ │ Supported: PDF, DOCX, TXT, JSON, YAML, MD   │        │
│ │ Max size: 50MB per file                      │        │
│ └──────────────────────────────────────────────┘        │
│                                                         │
│ ▼ Uploaded Documents                                    │
│                                                         │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 📄 model-card-gpt4.pdf              [Actions ⋮] │    │
│ │ Category: Model Documentation                   │    │
│ │ Uploaded: 2024-01-15 by J. Smith               │    │
│ │ Size: 2.4 MB                                    │    │
│ │                                                 │    │
│ │ [Preview] [Download] [Delete]                   │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 📊 safety-test-results.pdf          [Actions ⋮] │    │
│ │ Category: Safety Testing                        │    │
│ │ Uploaded: 2024-01-16 by J. Smith               │    │
│ │ Size: 5.1 MB                                    │    │
│ │ ✓ Linked to Section 6: Safety Assessment        │    │
│ │                                                 │    │
│ │ [Preview] [Download] [Delete]                   │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 📋 training-dataset-docs.md         [Actions ⋮] │    │
│ │ Category: Data Documentation                    │    │
│ │ Uploaded: 2024-01-16 by J. Smith               │    │
│ │ Size: 124 KB                                    │    │
│ │ ⚠️ Required for Class 3 modification            │    │
│ │                                                 │    │
│ │ [Preview] [Download] [Delete]                   │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ [+ Upload More Documents]                               │
│                                                         │
│ ▼ Document Categories (Filter view)                    │
│                                                         │
│ [All] [Model] [Data] [Safety] [Compliance] [Other]     │
│                                                         │
│ ▼ Required Documents Checklist                         │
│                                                         │
│ Based on your submission:                               │
│                                                         │
│ ✓ Model card                     [model-card-gpt4.pdf] │
│ ✓ Safety test results            [safety-test-resu...] │
│ ✓ Training dataset documentation [training-dataset...] │
│ ⚠️ Bias evaluation report        [Upload required]     │
│ ⚠️ DPA or vendor agreement       [Upload required]     │
│ ✗ Conformity assessment          [Not uploaded]        │
│                                                         │
│ ▼ Additional Documentation                              │
│                                                         │
│ Architecture Diagram     [Upload or link]               │
│ API Documentation        [URL input or upload]          │
│ User Guide               [Upload]                       │
│ Incident Response Plan   [Upload]                       │
│                                                         │
│ ▼ Metadata & Tagging                                    │
│                                                         │
│ For each document:                                      │
│ • Document type                                         │
│ • Version                                               │
│ • Author                                                │
│ • Linked sections                                       │
│ • Tags (free-form)                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specific Improvements:**

**Modern File Upload UI** (REPLACE EMOJI ICONS)
- Drag-and-drop zone with proper styling:
  - Dashed border that highlights on drag-over
  - File icon from Phosphor: `<UploadSimple />`
  - Clear instructions and file type list
- "Browse" button as alternative to drag-drop
- Multiple file upload support
- Progress bars for each uploading file

**Document Cards with Rich Metadata** (REPLACE EMOJI)
- Each uploaded document shown as card
- Icon based on file type (using Phosphor):
  ```typescript
  import { FilePdf, FileDoc, FileText, FileCode } from '@phosphor-icons/react'
  ```
- Card shows:
  - File name (truncated with tooltip for full name)
  - Category badge
  - Uploader and timestamp
  - File size
  - Linked sections (if applicable)
  - Warning if required
- Three-dot menu for actions:
  - Preview (opens modal or inline PDF viewer)
  - Download
  - Re-categorize
  - Add tags
  - Delete

**Smart Required Documents Checklist** (NEW)
- Dynamically generated based on:
  - Modification class (Section 4)
  - Risk level (Section 6)
  - Compliance requirements (Section 6)
  - Regulated industry (Section 2)
- Status indicators:
  - ✓ Green: Uploaded
  - ⚠️ Yellow: Required soon
  - ✗ Red: Required, not uploaded
- Clicking requirement opens upload modal
- Shows which uploaded document satisfies requirement

**Category Filtering**
- Chip-style filter buttons:
  - All (default)
  - Model Documentation
  - Data Documentation
  - Safety Testing
  - Compliance
  - Other
- Active filter highlighted in accent color
- Shows count: "Safety (3)"

**Document Preview** (NEW)
- PDF preview in modal without leaving page
- Markdown files rendered
- JSON/YAML syntax highlighted
- DOCX converted to HTML preview
- "Open in new tab" option for full view

**Version Control Hints** (NEW)
- If document with similar name already exists:
  - "Similar document found: model-card-gpt4-v1.pdf. Is this a new version?"
  - Option to link as versions or upload separately
- Track document versions for audit trail

**Cross-Section Linking**
- When uploading, option to link to sections:
  - "This safety test report relates to: [x] Section 6: Safety"
  - Creates bidirectional link
  - Section 6 shows linked documents inline

---

### 4.10 SUBMISSION SUMMARY & REVIEW

**New Screen: Final Review Before Submit**

```
┌─────────────────────────────────────────────────────────┐
│ Review & Submit                                          │
│ Verify all information before submitting for approval    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────── SUBMISSION SNAPSHOT ────────────┐        │
│ │                                              │        │
│ │ GPT-4 Turbo - Customer Support AI            │        │
│ │                                              │        │
│ │ Risk Score: [68] MEDIUM-HIGH                 │        │
│ │ Modification: Class 3 (LoRA)                 │        │
│ │ EU AI Act: Limited Risk                      │        │
│ │                                              │        │
│ │ Completion: 95% (1 warning)                  │        │
│ │ Required Approvals: 5 roles                  │        │
│ │ Estimated Review Time: 3-5 business days     │        │
│ └──────────────────────────────────────────────┘        │
│                                                         │
│ ▼ Validation Status                                     │
│                                                         │
│ ✓ All required fields completed                         │
│ ✓ 18 documents uploaded                                 │
│ ⚠️ Bias evaluation report recommended (not required)    │
│ ✓ Risk assessment complete                              │
│ ✓ Compliance checks passed                              │
│                                                         │
│ ▼ Section Summary                                       │
│                                                         │
│ [Accordion of all 7 sections with key info]            │
│                                                         │
│ ▶ 1. Model Selection                                    │
│   GPT-4 Turbo, OpenAI, LLM, 128K context               │
│   [Edit]                                                │
│                                                         │
│ ▶ 2. Use Case & Purpose                                 │
│   Customer Support AI - Billing inquiries               │
│   Expected users: 1,000-10,000/day                      │
│   [Edit]                                                │
│                                                         │
│ [... other sections ...]                                │
│                                                         │
│ ▼ Next Steps                                            │
│                                                         │
│ After submission:                                       │
│ 1. Assigned to AI Safety Officer for initial review    │
│ 2. Data Governance Officer review                       │
│ 3. Security Reviewer approval                           │
│ 4. Legal Counsel sign-off                               │
│ 5. Final decision (typically 3-5 days)                  │
│                                                         │
│ You will receive email notifications at each stage.     │
│                                                         │
│ ┌──────────────────────────────────────────────┐       │
│ │ ☐ I confirm all information is accurate      │       │
│ │ ☐ I have uploaded all required documentation │       │
│ │ ☐ I agree to monitoring and audit requirements│      │
│ └──────────────────────────────────────────────┘       │
│                                                         │
│ [← Back to Edit] [Save Draft] [Submit for Review →]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specific Features:**

**Submission Snapshot Card**
- Hero card with key information
- Visual risk score badge
- Modification class and EU AI Act classification
- Estimated review time based on complexity
- Required approver count

**Validation Summary**
- All validation checks listed
- Green ✓ for passed
- Yellow ⚠️ for warnings (non-blocking)
- Red ✗ for errors (blocks submission)
- Click to jump to issue

**Collapsible Section Summary**
- All 7 sections as accordion
- Collapsed by default
- Shows key information for each
- "Edit" button jumps back to that section
- Allows final verification without scrolling entire form

**Pre-Submission Checklist**
- Three checkboxes user must confirm
- Submit button disabled until all checked
- Legal confirmation pattern

**Clear Next Steps**
- Explains approval workflow
- Shows estimated timeline
- Sets expectations for submitter

---

## 5. ENHANCED FEATURES INTEGRATION

### 5.1 AI Assistant Side Panel (RIGHT SIDEBAR)

**Always-Visible Intelligent Assistant**

```
┌─────────────────────────┐
│ AI ASSISTANT            │
│ ─────────────────────── │
│                         │
│ Context: Section 3/7    │
│ Data Sources            │
│                         │
│ 💡 SUGGESTIONS          │
│ ─────────────────────── │
│ • Autofill from model   │
│   card URL detected     │
│   [Import]              │
│                         │
│ • PII detected in data  │
│   source. Add DPA?      │
│   [Yes] [No]            │
│                         │
│ • Similar submission:   │
│   "Customer AI v2"      │
│   [View]                │
│                         │
│ ℹ️ COMPLIANCE           │
│ ─────────────────────── │
│ ISO 42001 Clause 6.1:   │
│ Risk assessment         │
│ required for data with  │
│ PII.                    │
│ [Learn more]            │
│                         │
│ 📊 RISK PREVIEW         │
│ ─────────────────────── │
│ Current: 68/100         │
│ [████████░░] MEDIUM-HIGH│
│                         │
│ Top factors:            │
│ • PII in training       │
│ • High user impact      │
│ • Class 3 modification  │
│                         │
│ [Detailed breakdown]    │
│                         │
│ ❓ ASK AI               │
│ ─────────────────────── │
│ [Text input]            │
│ "What is LoRA fine-     │
│  tuning?"               │
│                         │
│ [Minimize ▼]            │
└─────────────────────────┘
```

**Behavior:**
- Fixed position on right side (320px width)
- Scrolls independently from main content
- Collapsible to icon bar (click to expand)
- Context-aware based on current section
- Updates in real-time as form is filled

**Suggestions Types:**
1. **Autofill opportunities**: Detected URLs, similar submissions
2. **Compliance tips**: Relevant ISO 42001 / EU AI Act articles
3. **Risk alerts**: "Adding this data source increases risk score"
4. **Best practices**: "Consider adding bias testing for fairness"

**Ask AI Feature:**
- Text input at bottom of panel
- User can ask questions:
  - "What is a conformity assessment?"
  - "Do I need DPA for AWS?"
  - "What's the difference between Class 3 and 4?"
- AI responds in chat format
- Responses include citations to ISO/EU AI Act
- Can insert AI's answer directly into form fields

---

### 5.2 Progress Summary Bar (TOP STICKY HEADER)

**Persistent Status Indicator**

```
┌──────────────────────────────────────────────────────────┐
│ [Logo] AI Intake Form                                     │
├──────────────────────────────────────────────────────────┤
│ Progress: 4/7 sections complete (57%)                     │
│ ████████████░░░░░░░░░░░░                                  │
│                                                           │
│ Risk: [68] MEDIUM-HIGH  |  Warnings: 2  |  Saved: 2m ago │
│                                                           │
│ [Model] [Use] [Data] • Mods  Deploy  Safety  Files       │
│  ✓      ✓      ✓      •      o      o       o            │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Sticky header (always visible)
- Progress bar with percentage
- Risk score badge (live updates)
- Warning/error count
- Auto-save indicator
- Section tabs with status icons:
  - ✓ Completed
  - • In progress
  - o Not started
  - ⚠️ Has warnings
  - ✗ Has errors

---

### 5.3 Autofill from External Sources

**Implemented in Multiple Sections:**

**1. Model Card URL Import**
- Section 1: Model Selection
- User pastes Hugging Face URL, OpenAI model page, or direct model card link
- "Import" button triggers:
  - AI extraction of model metadata
  - Populates fields: vendor, name, version, architecture, license
  - Shows preview before confirming
- Also extracts: training data info, capabilities, limitations

**2. SBOM/AIBOM Upload**
- Section 1 or Section 7
- User uploads structured file (JSON, XML)
- System parses:
  - Model components
  - Dependencies
  - Licenses
  - Security vulnerabilities
- Autofills relevant fields across multiple sections

**3. API Integration**
- For commercial models (OpenAI, Anthropic, Google)
- "Connect API" button
- OAuth flow to user's account
- Fetches list of available models
- User selects → autofills all metadata

**4. Copy from Previous Submission**
- Dashboard: "Clone submission" action
- User selects which sections to copy
- Creates new draft with pre-filled data
- User only updates differences

---

### 5.4 Collapsible Micro-Sections

**Reduces Form Fatigue**

Every section divided into:
- **Primary Information** (always visible)
- **Additional Details** (collapsible, starts collapsed)
- **Advanced Options** (collapsible, starts collapsed for low-risk)

Example (Section 3: Data Sources):
```
▼ Data Source #1
  ┌─────────────────────────────┐
  │ Primary Information         │ ← Always open
  │ • Source Name*               │
  │ • Data Type*                 │
  │ • Contains PII?*             │
  └─────────────────────────────┘

  ▶ Additional Details          ← Click to expand

  ▶ Advanced Options            ← Click to expand
```

**Smart Defaults:**
- High-risk submissions: Auto-expand "Advanced Options"
- Returning users: Remember their expansion preferences
- Validation errors: Auto-expand section with error

---

### 5.5 Inline Dynamic Risk Scoring Badges

**Real-Time Risk Indicators**

Throughout the form, show risk impact:

```
Data Contains PII?  ◯ Yes  ◯ No

[If Yes selected]
→ Risk Score: +15 points [Orange badge appears]
→ "Data governance review required"
```

**Locations:**
- After modification class selection (Section 4)
- After PII checkbox (Section 3)
- After use case classification (Section 2)
- After deployment region selection (Section 5)

**Visual Design:**
- Small badge animates in when relevant
- Color-coded: Green (no change), Yellow (+10-30), Orange (+31-60), Red (+61+)
- Can be hovered for explanation

---

### 5.6 Structured AI-Written Summaries

**"Write for Me" Buttons**

Available for text areas:
- Use case description (Section 2)
- Risk assessment (Section 6)
- Mitigation measures (Section 6)
- Access control policy (Section 5)
- Incident response plan (Section 5)

**Behavior:**
1. User clicks "✨ Write for me"
2. AI analyzes all form data entered so far
3. Generates contextually appropriate text
4. Shows in editable text box
5. User can accept, edit, or regenerate
6. "Improve" button to refine further

**Example Generation:**
```
User clicked "Write for me" on Use Case Description
Has entered: Model=GPT-4, Vendor=OpenAI, Purpose=Customer Support

AI generates:
"This AI system will be deployed as a customer support assistant
to handle billing-related inquiries. The system will analyze
customer questions, retrieve relevant account information, and
provide accurate responses. Complex cases will be escalated to
human agents. The system aims to reduce response time and improve
customer satisfaction while maintaining data privacy and accuracy."

[Accept] [Edit] [Regenerate]
```

---

### 5.7 Conditional Forms Based on Regulatory Triggers

**Dynamic Form Adaptation**

Examples:

**Trigger 1: High-Risk AI System Detected**
```
User selects in Section 2:
☑ Employment decisions

System responds:
→ Shows orange banner: "HIGH-RISK AI SYSTEM"
→ Reveals new fields in Section 6:
   • Fundamental Rights Impact Assessment
   • Conformity Assessment Plan
   • CE Marking Documentation
→ Updates checklist with EU AI Act requirements
→ AI Assistant: "Article 6: High-risk AI requires conformity assessment"
```

**Trigger 2: PII Detected**
```
User selects in Section 3:
☑ Contains PII: Yes

System responds:
→ Shows new fields:
   • Data Processing Agreement
   • Data Retention Policy
   • User Consent Mechanism
→ AI Assistant: "GDPR Article 5: Data minimization principle applies"
```

**Trigger 3: Regulated Industry**
```
User selects in Section 2:
☑ Financial Services

System responds:
→ Shows new section: "FFIEC Compliance"
→ Fields for:
   • Model validation documentation
   • Model risk management framework
   • Third-party vendor assessment
```

---

### 5.8 Left-Hand Real-Time Validation Checklist

**Live Requirement Tracking**

```
┌───────────────────────┐
│ VALIDATION CHECKLIST  │
│ ───────────────────── │
│                       │
│ Overall: 18/24 ✓      │
│                       │
│ ▼ Model Selection     │
│ ✓ Vendor selected     │
│ ✓ Model name          │
│ ⚠️ License unverified │
│ ✓ Version provided    │
│                       │
│ ▼ Use Case            │
│ ✓ Description         │
│ ✗ System use (Req)    │
│ ✓ Impact scope        │
│                       │
│ ▶ Data Sources        │
│ (Not yet visited)     │
│                       │
│ ▶ Modifications       │
│ (Not yet visited)     │
│                       │
│ [Show all 24 items]   │
└───────────────────────┘
```

**Features:**
- Sticky left sidebar (240px width)
- Shows all validation requirements
- Grouped by section (collapsible)
- Click item → scrolls to field
- Real-time updates as user fills form
- Shows overall completion percentage
- "Show all items" expands to full list

**Status Icons:**
- ✓ Green check: Complete & valid
- ⚠️ Yellow warning: Complete but flagged
- • Gray dot: Not yet completed
- ✗ Red X: Error/required field missing

---

### 5.9 Reviewer Mode Improvements

**Specialized View for Approvers**

```
┌─────────────────────────────────────────────────────────┐
│ Review: GPT-4 Customer Support AI (ID: 1234)            │
│ Submitted by: Jane Smith | 2024-01-16                   │
│ Your Role: AI Safety Officer                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌────────── REVIEWER DASHBOARD ──────────┐             │
│ │                                         │             │
│ │ Risk Score: [68] MEDIUM-HIGH            │             │
│ │ Modification: Class 3 (LoRA)            │             │
│ │ Your Review Status: Pending             │             │
│ │                                         │             │
│ │ Other Approvers:                        │             │
│ │ ✓ Model Owner (Approved 2024-01-16)    │             │
│ │ ⏳ Data Governance (Pending)            │             │
│ │ ⏳ Security Review (Pending)            │             │
│ │ ⏳ Legal Counsel (Pending)              │             │
│ └─────────────────────────────────────────┘             │
│                                                         │
│ ▼ Items Requiring Your Attention                       │
│                                                         │
│ [Flag icon] Safety Testing: Bias evaluation missing    │
│ [Flag icon] High user impact: 5,000 users/day          │
│ [Check icon] Model license: Verified                   │
│                                                         │
│ ▼ Submission Summary (Read-only view)                  │
│                                                         │
│ [All 7 sections displayed as read-only cards]          │
│ [Each section expandable]                              │
│                                                         │
│ ▼ Evidence Review                                       │
│                                                         │
│ Required for your role:                                │
│ ☐ Safety test results        [View PDF]               │
│ ☐ Bias evaluation report     [Missing - Flag]         │
│ ☐ Training dataset docs       [View]                   │
│                                                         │
│ ▼ Your Review                                           │
│                                                         │
│ Evidence Reviewed:    [Multi-select checklist]         │
│                       ☑ Safety tests                    │
│                       ☑ Model card                      │
│                       ☑ Dataset documentation           │
│                                                         │
│ Decision:             ◯ Approve                         │
│                       ◯ Reject                          │
│                       ◯ Request More Information        │
│                                                         │
│ Comments:             [Rich text editor]               │
│                       [Template: Insert standard review]│
│                                                         │
│ Conditions (if any):  [Text area]                      │
│                       Example: "Approved pending bias   │
│                       evaluation within 30 days"        │
│                                                         │
│ [Cancel] [Save Draft] [Submit Review]                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**

**1. Role-Specific Dashboard**
- Shows only information relevant to reviewer's role
- AI Safety Officer sees safety-related flags
- Data Governance sees PII, data lineage issues
- Legal sees compliance, licensing issues

**2. Evidence Checklist**
- Shows which documents reviewer should examine
- Based on their role and submission type
- Can mark as reviewed
- Flag missing/insufficient evidence

**3. Approval Workflow Visibility**
- See who else needs to review
- See who has already approved/rejected
- Timeline of review activity
- Can @mention other reviewers in comments

**4. Standard Review Templates**
- Pre-written templates for common scenarios
- Example: "Approved with standard conditions"
- Saves time for routine approvals
- Maintains consistency across reviews

**5. Compare Feature**
- "Compare to similar submissions" button
- Shows how this compares to past approvals
- Identifies outliers or anomalies

---

### 5.10 Sticky Stepper Navigation

**Always-Accessible Section Tabs**

```
┌─────────────────────────────────────────────────────────┐
│ [1 Model] [2 Use] [3 Data] [4 Mods] [5 Deploy] [...] │
│   ✓         ✓        •         o         o             │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Horizontal tab navigation
- Fixed to top of page (sticky)
- Click any visited section to jump
- Shows status: ✓ • o ⚠️ ✗
- Current section highlighted
- Responsive: collapses to dropdown on mobile
- Keyboard navigation: Tab through, Enter to select

---

### 5.11 Model Preview Cards (Hugging Face Style)

**Rich Model Display**

```
┌──────────────────────────────────────────────────────┐
│ [OpenAI Logo]  GPT-4 Turbo                           │
│                                                      │
│ ★★★★☆ 4.8/5 | 15.2K deployments | Updated Dec 2024 │
│                                                      │
│ Large language model optimized for chat, reasoning,  │
│ and complex tasks. 128K context window. Supports     │
│ function calling and JSON mode.                      │
│                                                      │
│ [LLM] [Chat] [Reasoning] [128K Context]              │
│                                                      │
│ Architecture: Transformer (GPT-4)                    │
│ Parameters: Not disclosed                            │
│ License: Commercial (OpenAI)                         │
│ Context: 128,000 tokens                              │
│                                                      │
│ [Select this model] [View details →]                │
└──────────────────────────────────────────────────────┘
```

**When to Show:**
- In Section 1 when model is found in catalog
- In model search/browse view
- As suggestion in AI Assistant panel

**Features:**
- Vendor logo
- Model name and version
- Rating/popularity indicators
- Quick-stat badges (128K, Chat, etc.)
- Brief description
- Key specs
- One-click select

---

### 5.12 Section Tooltips for Compliance Concepts

**Inline Education**

Throughout form, add (ℹ️) icons with rich tooltips:

```
Modification Class [ℹ️]

Hovering shows:
┌─────────────────────────────────────┐
│ ISO/IEC 42001 Modification Classes  │
│ ─────────────────────────────────── │
│ A framework for classifying AI      │
│ system changes by risk level:       │
│                                     │
│ • Class 0-1: Low risk, minimal      │
│   governance                        │
│ • Class 2-3: Medium risk, safety    │
│   testing required                  │
│ • Class 4-6: High risk, full        │
│   conformity assessment             │
│                                     │
│ [Learn more →]                      │
└─────────────────────────────────────┘
```

**Tooltip Content Includes:**
- Clear definition
- Why it matters
- What's required
- Link to full documentation
- Relevant standard citation (ISO clause, EU AI Act article)

**Common Tooltips:**
- Conformity Assessment
- Data Processing Agreement
- PII (with examples)
- LoRA / PEFT
- Bias evaluation
- Drift detection
- Adversarial testing

---

### 5.13 Submission Summary Snapshot

**Export-Ready Report**

At end of submission flow, generate:

```
┌─────────────────────────────────────────────────────────┐
│ AI System Intake Summary                                 │
│ Generated: 2024-01-16 14:35 PST                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ SYSTEM OVERVIEW                                          │
│ ─────────────────────────────────────────────────────   │
│ Model: GPT-4 Turbo (OpenAI)                              │
│ Use Case: Customer Support - Billing Inquiries           │
│ Modification: Class 3 (LoRA Fine-Tuning)                 │
│ Deployment: AWS us-east-1 (API)                          │
│                                                         │
│ RISK ASSESSMENT                                          │
│ ─────────────────────────────────────────────────────   │
│ Overall Risk: 68/100 (Medium-High)                       │
│ EU AI Act Classification: Limited Risk                   │
│ Required Approvals: 5 roles                              │
│                                                         │
│ Risk Dimensions:                                         │
│ • Data Governance: 75 (High) ⚠️                          │
│ • Compliance: 80 (High) ⚠️                               │
│ • Safety: 60 (Medium)                                    │
│ • Security: 55 (Medium)                                  │
│ • Licensing: 25 (Low)                                    │
│ • Transparency: 40 (Low-Medium)                          │
│                                                         │
│ COMPLIANCE STATUS                                        │
│ ─────────────────────────────────────────────────────   │
│ ISO/IEC 42001: In Progress                               │
│ • Risk assessment: Complete ✓                            │
│ • Documentation: 85% complete                            │
│ • Monitoring plan: Complete ✓                            │
│                                                         │
│ EU AI Act: Compliant (Limited Risk)                      │
│ • Transparency provisions: Met ✓                         │
│ • Technical documentation: Complete ✓                    │
│                                                         │
│ APPROVAL WORKFLOW                                        │
│ ─────────────────────────────────────────────────────   │
│ Required Approvers:                                      │
│ 1. AI Safety Officer - Pending                           │
│ 2. Data Governance Officer - Pending                     │
│ 3. Security Reviewer - Pending                           │
│ 4. Legal Counsel - Pending                               │
│ 5. Model Owner - Approved ✓                              │
│                                                         │
│ [Export as PDF] [Email to reviewers] [Print]            │
└─────────────────────────────────────────────────────────┘
```

**Available Actions:**
- Export as PDF (for records)
- Email to all approvers
- Print-friendly version
- Copy shareable link
- Download structured data (JSON)

---

### 5.14 Dashboard Alerts & Compliance Signals

**Home Dashboard Enhancements**

```
┌──────────────────────────────────────────────────────┐
│ 🔴 ALERTS & NOTIFICATIONS                             │
│ ─────────────────────────────────────────────────────│
│                                                      │
│ ⚠️ 3 high-risk submissions need review               │
│    [View pending reviews →]                          │
│                                                      │
│ 📅 EU AI Act conformity deadline in 12 days          │
│    Submission #1234 requires conformity assessment   │
│    [Start assessment →]                              │
│                                                      │
│ ⚠️ Model "GPT-4 Support Bot" drift detected          │
│    Performance degradation: -15% accuracy            │
│    [View monitoring report →]                        │
│                                                      │
│ ✓ Annual ISO 42001 audit: 95% compliant              │
│    [View compliance report →]                        │
│                                                      │
│ [Dismiss all] [View all 12 alerts]                   │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ 📊 COMPLIANCE SIGNALS                                 │
│ ─────────────────────────────────────────────────────│
│                                                      │
│ ISO/IEC 42001: ████████████████░░ 80%                │
│ [View details]                                       │
│                                                      │
│ EU AI Act: ████████████████░░░░ 75%                  │
│ [View details]                                       │
│                                                      │
│ Active AI Systems:                                   │
│ • High-Risk: 3 (all compliant ✓)                    │
│ • Limited-Risk: 12 (2 need attention ⚠️)            │
│ • Minimal-Risk: 18                                   │
│                                                      │
│ Upcoming Deadlines:                                  │
│ • 3 conformity assessments (due Jan 30)              │
│ • 5 post-market monitoring reports (due Feb 15)      │
│                                                      │
│ [Export compliance dashboard →]                      │
└──────────────────────────────────────────────────────┘
```

**Alert Types:**
- Critical: Red, requires immediate action
- Warning: Orange, needs attention soon
- Info: Blue, informational
- Success: Green, positive update

**Compliance Signals:**
- Overall compliance percentage
- Breakdown by standard
- Upcoming deadlines
- Systems needing attention
- Trend indicators (↑↓→)

---

## 6. IMPLEMENTATION GUIDELINES

### 6.1 Component Library (Tailwind CSS + Radix UI)

**Base Components:**

```typescript
// Button
<Button variant="primary" | "secondary" | "outline" | "ghost">
<Button size="sm" | "md" | "lg">
<Button leftIcon={<Icon />}>

// Card
<Card>
  <CardHeader>
  <CardContent>
  <CardFooter>
</Card>

// Badge
<Badge variant="success" | "warning" | "error" | "info">
<Badge size="sm" | "md">

// Input
<Input type="text" | "email" | "url" | "number">
<Input leftIcon={<Icon />} rightIcon={<Icon />}>

// Select
<Select>
  <SelectTrigger>
  <SelectContent>
  <SelectItem>
</Select>

// Tooltip
<Tooltip content="...">
  <TooltipTrigger>
</Tooltip>

// Modal
<Modal open={} onOpenChange={}>
  <ModalContent>
  <ModalHeader>
  <ModalBody>
  <ModalFooter>
</Modal>
```

### 6.2 Responsive Breakpoints

```css
/* Mobile-first approach */
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

**Layout Adaptations:**
- Mobile: Single column, side panels as bottom sheets
- Tablet: Side panels collapsible
- Desktop: Full three-column layout

### 6.3 Animation Standards

```css
/* Transitions */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Easing functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

**Use Cases:**
- Button hover: transition-fast
- Modal open/close: transition-base
- Accordion expand: transition-slow
- Page transitions: transition-slow

### 6.4 Accessibility Requirements

**WCAG 2.1 AA Compliance:**
- Color contrast ratio ≥ 4.5:1 for text
- Keyboard navigation for all interactive elements
- Focus indicators visible and clear
- ARIA labels for screen readers
- Alt text for all images/icons
- Form validation messages announced
- Skip navigation links
- Semantic HTML structure

**Focus Indicators:**
```css
:focus-visible {
  outline: 2px solid var(--accent-600);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### 6.5 Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

**Optimization Strategies:**
- Lazy load sections below fold
- Virtual scrolling for long lists
- Debounced form validation (300ms)
- Optimistic UI updates
- Progressive image loading

---

## 7. FINAL DELIVERABLES CHECKLIST

**For Engineers:**
- [x] Component specifications
- [x] Prop interfaces
- [x] API integration points
- [x] State management requirements
- [x] Responsive behavior

**For Designers:**
- [x] Color palette with hex codes
- [x] Typography scale
- [x] Spacing system
- [x] Icon library specifications
- [x] Component states (default, hover, active, disabled)
- [x] Layout grids

**For Governance Teams:**
- [x] ISO 42001 alignment mapping
- [x] EU AI Act compliance features
- [x] Modification class workflow
- [x] Approval routing logic
- [x] Evidence requirements tracking

**For Compliance Reviewers:**
- [x] Risk scoring methodology
- [x] Conformity assessment workflow
- [x] Post-market monitoring integration
- [x] Incident reporting procedures
- [x] Audit trail capabilities

---

## 8. CONCLUSION

This design specification transforms the AI Intake & Governance Platform from a functional form into an **enterprise-grade compliance tool** that:

✅ **Reduces cognitive load** through progressive disclosure and intelligent defaults
✅ **Accelerates submissions** with AI-powered autofill and suggestions
✅ **Ensures compliance** through dynamic checklists and real-time validation
✅ **Maintains professionalism** with a tech-legal aesthetic appropriate for enterprise governance
✅ **Scales governance** with role-based workflows and approval routing
✅ **Provides transparency** with live risk scoring and compliance signals
✅ **Supports audits** with comprehensive documentation and export capabilities

**Next Steps:**
1. Review and approve design specification
2. Create Figma mockups for key screens
3. Implement component library
4. Build section-by-section with iterative user testing
5. Launch with pilot group before full rollout

**Estimated Implementation Timeline:**
- Phase 1: Design system + base components (2 weeks)
- Phase 2: Core form sections 1-4 (3 weeks)
- Phase 3: Advanced features (AI assist, risk scoring) (2 weeks)
- Phase 4: Review workflows + dashboard (2 weeks)
- Phase 5: Testing, refinement, documentation (1 week)

**Total: ~10 weeks for complete implementation**

---

*Document Version: 2.0*
*Last Updated: 2024-01-16*
*Prepared for: AI Intake & Governance Platform Development Team*
