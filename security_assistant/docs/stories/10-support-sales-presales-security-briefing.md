# User Story: 10 - Support Sales And Presales Security Briefing

**As a** presales advisor or solution consultant,
**I want** guided prompts and quick-reference responses to support early-stage client security and compliance conversations,
**so that** opportunity discussions accurately reflect our security posture and compliance readiness from the first meeting.

## Acceptance Criteria

* A presales briefing guide includes discovery prompts: "What data does this system handle?", "What compliance obligations apply?", "Are there existing audits or certifications we need to respond to?", "Is this a regulated or public-sector engagement?"
* The briefing identifies the likely applicable frameworks based on client type (FI → MAS TRM; public sector → GovTech/IM8; education/generic → PDPA + ISO 27001 + OWASP ASVS).
* Common client "what do we need?" questions are pre-loaded with guidance on baseline security and compliance expectations, e.g.:
  * AI-powered platform: AI governance, bias controls, PDPA consent, data retention.
  * Integration platform: data classification, RBAC, audit logging, API security.
  * Customer portal: authentication, access control, secure document handling.
* A red flag indicator warns when specialist security architect involvement is mandatory (e.g. regulated FI, personal data of citizens, payment processing).
* A summary output can be captured and shared internally with delivery and solution teams.
* The guide distinguishes: what sales can answer, what needs a security architect, and what needs formal assessment.

## Notes

* Sales and presales need to articulate baseline security and compliance expectations without overcommitting to specific technical controls.
* Key framing for presales: security is about enabling trusted delivery and protecting the client's customers, operations, and reputation — not a compliance tick-box.
* For the AI Mock Interview RFQ (Singapore education sector, April 2026 deadline): key compliance discussion points are PDPA data handling, video retention and disposal, AI bias governance, SSO/institutional identity integration, and OWASP MASVS for the mobile browser experience.
* For NAPTA-type integration platforms: key presales discussion points are data classification, role-based access control for HR/Finance/Audit/BI, audit logging, environment segregation, and Entra ID SSO.
* The Security Architect supports business owners by engaging early, explaining security in business terms, distinguishing critical issues from lower-priority items, and providing decision options rather than only objections.
