# User Story: 5 - Produce Risk And Exception Advisory

**As a** security advisor,
**I want** to document key risks, assumptions, exceptions, and compensating controls in a structured register,
**so that** decision makers can make informed, auditable risk acceptance decisions with clear visibility of exposure and residual risk.

## Acceptance Criteria

* Each risk entry includes: risk description, severity (Critical/High/Medium/Low), likelihood, business impact, affected asset or data class, and risk owner.
* Each risk is linked to a specific requirement, control, or framework clause.
* Exception entries include: justification, compensating controls, expiry/review date, and approver.
* Compensating controls are recorded where standard controls are not feasible, with rationale.
* The register distinguishes status: Open / Accepted / Mitigated / Closed.
* A go-live readiness view shows which open risks are blockers vs. manageable residual items.
* The advisory output is exportable for internal governance, audit, or client sign-off.
* Risk decisions are immutable once approved — changes create a new version.

## Notes

* A Security Architect determines whether risks are acceptable, need remediation, or require formal exception handling — and supports documentation of residual risks.
* In FI engagements (MAS TRM), be conservative with exceptions involving: authorization flaws, sensitive customer/card data exposure, privileged access weaknesses, suspicious logging gaps, or high-risk workflow abuse.
* Risk-Based and Proportionate Control Design: controls should match business criticality, data sensitivity, threat exposure, and regulatory expectations. Over-controls slow delivery; under-controls leave exposure.
* Residual risk examples from practice:
  * Weak object-level authorization in customer portal — unacceptable for production.
  * Broad internal document access for support staff — medium risk, compensating control: enhanced logging + quarterly access review.
  * Missing MFA on admin access — high risk, must remediate before go-live.
* Common exception pitfalls: poorly documented justification, no expiry date, no named approver, compensating controls that do not actually reduce risk.
