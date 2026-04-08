# User Story: 6 - Expand Stage Guided Checklists

**As a** practitioner running an assessment or architecture review,
**I want** each stage of the engagement framework to expand into structured tasks, key questions, pitfalls, and evidence requirements,
**so that** I can execute consistently and avoid missing critical steps regardless of project size or industry.

## Acceptance Criteria

* Each of the five engagement stages expands into four sections: Tasks, Key Questions to Ask, Common Pitfalls, Evidence/Documentation Required.
* The architecture review checklist covers all seven steps: Intake and Context Gathering; Trust Boundaries and High-Risk Components; Security Requirements Derivation; Design Control Review; Assurance Activities; Gap and Recommendations; Outcome Documentation and Closure.
* Checklist progress can be marked as complete to track coverage.
* The requirement-to-control template is embedded:  Business context → Data sensitivity → Threat exposure → Key users/roles → Security requirement → Design/architecture control → How to verify → Residual risk consideration → Industry-specific emphasis.
* Assurance activities are listed per stage: threat modeling, secure coding review, SAST/SCA, VAPT (web, API, mobile, cloud), access review, logging validation, remediation closure review, residual risk sign-off.
* Go-live criteria checklist is included as a final gate item.
* The checklist is filterable by industry (FI, GovTech, generic) so industry-specific items are surfaced automatically.

## Notes

* Key questions for architecture review (Step 4 — Design Control Review): Where is the sensitive data? Who can access it? How is access validated? Can one user access another user's data? Are admin and user functions clearly separated? What is logged? Are logs useful without leaking sensitive data? How are external vendors or support users controlled? What happens if one security layer fails?
* Common pitfalls: security requirements defined post-design; test coverage that misses business logic and authorization; logging that captures sensitive values; exceptions approved without review dates; insufficient assurance before go-live.
* Standards I would define or reuse: customer data protection standard, privileged access standard, security logging standard, secure coding standard, internet-facing application assurance standard, vendor testing quality standard.
