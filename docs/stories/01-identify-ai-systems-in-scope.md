# User Story: 1 - Identify AI Systems in Scope

**As a** AIMS implementation lead,
**I want** to identify the AI systems used, developed, or managed by the organization,
**so that** I can determine what must be governed under the AI management system.

## Acceptance Criteria

* A current list of AI systems is maintained.
* Each listed system includes its business purpose, owner, and lifecycle status.
* The list distinguishes systems that are inside scope from systems that are outside scope.
* The list can be used as an input to later risk assessment and impact assessment activities.

## Clause Reference

| Clause | Requirement |
|--------|-------------|
| 4.3 | Determine boundaries and applicability of AIMS |
| 4.4 | Establish, implement, maintain and improve the AIMS |
| 8.2 | AI system impact assessment requires a known system inventory |
| Annex A (A.5) | AI system life cycle controls require systems to be identified |

## Key Findings from Training (Day 3 & 5)

* The trainer emphasized that organizations use AI without realising it: web filtering, anti-malware, Office 365 Copilot insights, CCTV analytics, email spam detection all count.
* The question to ask for scoping: "Is any automated decision, classification, or recommendation being made?" — if yes, map it as a candidate AI system.
* Day 5 Activity 23 (AI System Impact Assessment) feeds directly from this inventory; without a known list, impact assessment cannot be performed.
* Scoping is not a one-time activity — it iterates as new AI tools are adopted.

## Risk Linkage (from 50 Sample AI Risks)

* Risk 21 — Incorrect model version deployed: cannot manage without a known system inventory
* Risk 30 — Lack of defined AI system ownership: directly mitigated by this story
* Risk 24 — Poor documentation of AI lifecycle: begins with identifying what systems exist

## Implementation Notes

* Start with a discovery workshop across IT, operations, HR, finance, and customer service.
* Use a simple register: System Name | Business Use | Department | AI Technique | Lifecycle Stage | In Scope (Y/N) | Owner.
* Apply the "relevance test" from Clause 4.3: only systems within the defined organizational boundaries are in scope.
* Connect findings to later activities: each system in scope will need a risk assessment entry (Story 6) and potentially an impact assessment (Story 8).
