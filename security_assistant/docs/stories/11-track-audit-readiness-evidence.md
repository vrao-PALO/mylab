# User Story: 11 - Track Audit Readiness Evidence

**As a** control owner or security architect supporting an internal or external audit,
**I want** a structured way to track required evidence against controls and frameworks,
**so that** I can demonstrate control operation with confidence, reduce audit friction, and maintain a clear traceability chain from requirement to control to test to evidence.

## Acceptance Criteria

* Evidence requirements can be linked to: framework clause (ISO 27001 domain, MAS TRM section, SOC 2 criterion), specific control, and engagement or project.
* Each evidence item records: control reference, evidence type, owner, due date, and status (Pending / Collected / Reviewed / Approved).
* Missing or expired evidence is flagged with visual emphasis.
* An audit-ready summary view is filterable by engagement, framework, or control domain.
* The traceability chain is navigable: requirement → control → assurance activity → evidence artifact.
* Templates are provided for common evidence types: architecture review record, VAPT report closure, access review sign-off, risk exception approval, SAST/SCA scan summary, logging validation record.
* SOP references are attached to evidence types so owners know what process to follow.

## Notes

* Audit and risk teams need: traceability, evidence, clear articulation of risks and decisions, and assurance that controls are implemented — not just documented.
* Common audit finding: "architecture decisions not documented clearly; technical teams assume a control is obvious but cannot evidence it."
* The traceability principle: every security requirement must be traceable to a design control, which must be traceable to an assurance activity or test, which must be traceable to a retained evidence artifact.
* SOPs I would require for audit readiness: SOP for external VAPT engagement and report closure; SOP for production support access approval; SOP for remediation and retest closure; SOP for risk exception and residual risk approval.
* In FI and public sector, audit evidence is especially important for: segregation of duties, sensitive financial or personal data protection, accountability for privileged actions, testing and control rigor, and compliance with MAS TRM / PDPA / GovTech policy.
* Policy vs. implementation gap is the most common compliance failure: a policy exists, but the control is not actually implemented or evidenced.
