# User Story: 1 - Capture Engagement Requirement

## Story Control

- Version: 1.1
- Last Updated: 2026-04-02
- Status: Draft enhancement
- Change Summary: Expanded the story from static intake capture into guided engagement triage and high-level guidance generation.

**As a** security architect, solution architect, presales lead, or assessor,
**I want** to record the core client or stakeholder request with enough business, regulatory, and delivery context to derive the right security workflow,
**so that** I can guide the engagement correctly even when the responder is not a security specialist.

## Acceptance Criteria

* Requirement intake captures engagement type: RFP, RFQ, assessment, internal audit, architecture review, or advisory.
* Intake captures responder persona so guidance can be tuned for non-security vs security-heavy users.
* Business goals, expected outcomes, and success criteria are recorded.
* The engagement context identifies the industry sector so the correct framework overlay is selected.
* Intake captures known constraints, deadlines, and go-live timeline.
* Intake asks high-signal questions about delivery model, exposure, and data sensitivity.
* A rules-based guidance layer derives likely applicable frameworks such as PDPA, MAS TRM, HIPAA, ISO 27001, or other relevant overlays.
* The app produces a high-level structure of what needs to be considered before the user proceeds to later stages.
* The intake stage suggests which downstream stages need attention first, for example Scope, Inputs, or Control Mapping.
* A completion check prevents moving forward when required fields are missing.
* The captured requirement and derived guidance are saved and retrievable at every later stage of the engagement.
* A dated intake baseline is stored for audit traceability.
* Intake changes after baseline are versioned with timestamp and rationale.

## Notes

* A Security Architect acts as a risk-informed design authority who translates business needs, regulatory obligations, and threat exposure into practical security requirements.
* The intake stage should be a triage step, not a long-form compliance questionnaire.
* Success means security is addressed early and consistently, not added as a reactive control.
* Engagement type determines the broad starting path, but data sensitivity and hosting model often determine what must be checked next.
* Example RFP pattern: a solution architect enters requirement, scope, and sensitive data indicators, and the app returns the likely frameworks, proposal structure, assumptions, and clarification questions.
* Example assessment pattern: an assessor enters that an existing SaaS application hosted on a cloud provider handles confidential or highly confidential data, and the app returns review priorities, framework overlays, evidence requests, and workflow sequencing.
* Key intake questions should stay short and decisive:
  * What kind of engagement is this?
  * Who is filling this in?
  * What data does the application handle?
  * Is it SaaS, cloud-hosted, hybrid, or on-prem?
  * Is it internet-facing?
  * What integrations exist?
  * What are the deadlines and key constraints?
