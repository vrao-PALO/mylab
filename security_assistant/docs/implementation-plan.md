# Unified Implementation Plan - Security Architect Refresher

## Document Control

- Version: 1.1
- Last Updated: 2026-04-02
- Status: Working Plan
- Owner: Security Architect Refresher project
- Change Summary: Added guided intake triage, decision-engine design, and version-control requirements for intake, scope, and downstream workflow baselines.

## Objective
Build a mobile-friendly, searchable security and compliance knowledge base that operationalizes the 13 user stories into a practical workflow for RFP or RFQ, audits, architecture reviews, and existing-application assessments.

## Delivery Strategy
Use a staged approach so value is delivered early without overbuilding:
1. Phase 1: Structured knowledge base with guided workflow and derived intake guidance
2. Phase 2: Interactive assistant, lightweight APIs, and engagement persistence
3. Phase 3: Full app hardening, analytics, governance, and enterprise readiness

## Scope Mapping to Stories
- Stage Intake and Context: Stories 01, 02, 03
- Control Mapping and Risk Advisory: Stories 04, 05
- Guided Execution and Communication: Stories 06, 07
- Mobile Access and Quick Retrieval: Story 08
- Industry or FI and Presales Support: Stories 09, 10
- Audit Traceability and Architecture Review: Stories 11, 12
- AI Governance and Compliance: Story 13

## Recommended Technical Approach
- Frontend: Next.js + TypeScript + Tailwind + shadcn/ui
- Content source of truth: Markdown in docs/stories and docs/knowledge
- Search: local full-text index first (client-side), optional API search later
- Persistence (Phase 2+): lightweight database for engagements, evidence, risks, workflow snapshots, and versioned baselines
- Mobile: PWA support with offline cache for core guidance
- Guidance engine: rules-based decision layer first, with optional AI assist later

## Information Architecture (Target)
- /app/intake
- /app/scope
- /app/inputs
- /app/control-mapping
- /app/risk-exceptions
- /app/checklists
- /app/plain-english
- /app/industry/fi
- /app/industry/govtech
- /app/industry/generic
- /app/audit-evidence
- /app/architecture-review
- /app/ai-governance
- /app/search
- /app/exports
- /app/engagement-package
- /app/pilot

## Design Direction For Guided Intake

The intake stage should act as a smart triage step, not as a detailed compliance questionnaire. It should capture a small number of decisive signals, derive the likely framework and risk context, and guide the user toward the right next stages.

### Why This Design Makes Sense
- Non-security solution architects need structured prompts, not clause-level guidance, at the start.
- Security architects need fast identification of applicable frameworks, sensitive data, and review priorities.
- Presales and RFP users benefit from high-level structure, assumptions, and clarification questions.
- Existing-application assessments need different intake prompts from new-solution proposals.

### New Intake Inputs
- Engagement mode.
  - RFP
  - RFQ
  - Existing application assessment
  - Internal audit
  - Architecture review
  - Advisory
- Responder persona.
  - Solution architect
  - Security architect
  - Presales lead
  - Auditor
  - Delivery or platform architect
- Delivery model.
  - SaaS
  - On-prem
  - Cloud-hosted
  - Hybrid
  - Internet-facing
  - Internal-only
  - Multi-tenant or single-tenant
- Data and regulation signals.
  - PII
  - Financial information
  - Health records
  - Audit records
  - Payment data
  - AI model inputs or outputs
- Commercial and stakeholder context.
  - Bid deadline
  - Go-live target
  - Known constraints
  - Client-mandated frameworks
  - Third-party dependencies

### New Intake Outputs
- Applicable framework preview
- Priority review themes
- Suggested workflow path
- Clarification questions
- Stakeholders to involve
- Evidence to request first
- High-level engagement structure for non-security users

## Phase 1 - Guided Intake and Workflow Foundation
Goal: Deliver an end-to-end working reference tool that guides users to the right security work based on engagement type, user persona, hosting model, and data sensitivity.

### 1) Foundation Setup
- [ ] Scaffold Next.js app with TypeScript and Tailwind
- [ ] Add PWA baseline (manifest + service worker)
- [ ] Define content schemas (zod) for stories, controls, checklists, evidence templates, and intake guidance packs
- [ ] Create shared type models for Requirement, Scope, DataInput, ControlMap, RiskItem, EvidenceItem, IntakeGuidance, and GuidanceDecision

### 2) Knowledge Base Ingestion
- [ ] Convert story files into normalized JSON or MDX payloads
- [ ] Create framework reference packs: ISO 27001, MTCS Tier 3, PDPA, MAS TRM, SOC 2, OWASP ASVS or MASVS, NIST, CIS, HIPAA baseline
- [ ] Add stakeholder communication snippets (business owner, PM, engineering, audit, management, presales)
- [ ] Build glossary with plain-English definitions
- [ ] Add decision hints that map industry, data sensitivity, and hosting patterns to framework overlays

### 3) Guided Intake Redesign
- [ ] Expand intake schema to include responder persona, engagement mode, hosting pattern, data-sensitivity signals, and delivery model
- [ ] Keep intake question count deliberately small and high-signal
- [ ] Build a rules-based guidance engine that derives applicable frameworks, next steps, and clarification questions
- [ ] Render a high-level guidance summary after intake completion
- [ ] Pre-fill later workflow stages with derived defaults where appropriate
- [ ] Preserve a dated intake baseline for audit traceability

### 4) Workflow Screens
- [ ] Intake screen redesign (Story 01)
- [ ] Scope screen enhancement (Story 02)
- [ ] Data or Integration Inputs screen enhancement (Story 03)
- [ ] Framework Mapping screen (Story 04)
- [ ] Risk or Exception register screen (Story 05)
- [ ] Expandable stage checklists (Story 06)
- [ ] Plain-English explainer generator (Story 07)
- [ ] Mobile-optimized quick-reference home (Story 08)

### 5) Industry and Use-Case Packs
- [ ] FI query assistant pages (Story 09)
- [ ] Sales or presales briefing guide (Story 10)
- [ ] Audit evidence tracker templates (Story 11)
- [ ] Architecture review checklist (Story 12)
- [ ] AI governance checklist for AI-enabled platforms (Story 13)
- [ ] Add use-case overlays for RFP response and existing SaaS assessment

### 6) Search and Retrieval
- [ ] Implement keyword and tag search across all content
- [ ] Add quick answers panel for recurring compliance questions
- [ ] Add recent topics and pinned topics for mobile speed
- [ ] Make guidance outputs searchable by engagement type and data sensitivity

### 7) Version Control and Baseline Management
- [ ] Add document control metadata to key design and planning docs
- [ ] Store dated intake baseline snapshots
- [ ] Store dated scope baseline snapshots with change reason and approver
- [ ] Track downstream workflow changes after baseline for audit defensibility
- [ ] Surface simple version history in engagement save or export views

### 8) Testing and Validation
- [ ] Unit tests for schema validation and workflow state transitions
- [ ] Unit tests for intake decision logic and guidance derivation
- [ ] Component tests for checklist, mapping, and risk register modules
- [ ] Mobile viewport tests (375x667, 768x1024, 1280x800)
- [ ] Content quality review against source workbook and stories
- [ ] Validate RFP and existing-SaaS assessment examples as reference scenarios

### 9) Phase 1 Exit Criteria
- [ ] Intake can distinguish RFP, assessment, audit, and advisory modes
- [ ] Intake can derive a framework preview and a high-level guidance pack
- [ ] Scope, inputs, and mapping stages can be pre-filled from intake guidance
- [ ] All 13 stories remain represented in a working UI flow
- [ ] Mobile usability validated end-to-end
- [ ] Search returns relevant framework content in under 2 seconds
- [ ] Risk, checklist, and evidence templates exportable as Markdown

## Phase 2 - API + Smart Assistant
Goal: Move from reference-only to decision-support.
- Add API routes for saving engagements, risk register items, evidence records, and versioned baselines
- Add role-based views (architect, presales, audit)
- Add Q and A assistant over curated knowledge base
- Add framework delta tracking (for example MAS TRM updates)
- Add guidance-pack persistence so the same intake decision can be resumed later

## Phase 3 - Operationalization
Goal: Multi-user readiness and governance.
- SSO integration
- Audit trail for edits and approvals
- Versioned control mappings
- Analytics dashboard for usage and common risk themes
- Backup, retention, and data lifecycle policies
- Governance reporting on recurring high-risk engagement patterns

## Risks and Mitigations
- Content drift risk: use source-controlled markdown and review cadence
- Over-complex MVP risk: keep intake high-signal and defer detail to later stages
- Compliance misinterpretation risk: mark advisory content vs authoritative source links
- Scope creep risk: enforce phase gates and acceptance criteria
- Decision-engine oversimplification risk: treat outputs as guidance, not automatic compliance conclusions

## Immediate Next Action
Proceed to the next stage only after design approval: implement the guided intake redesign first, then the rules-based guidance engine, then downstream prefill and baseline management.
