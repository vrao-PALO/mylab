# User Story: 2 - Define Assessment Scope

**As a** security architect,
**I want** to define a clear and bounded scope for each engagement — covering systems, environments, data, users, and integration paths,
**so that** effort, accountability, and control coverage are unambiguous and defensible.

## Acceptance Criteria

* Scope entries cover: systems, hosting model (cloud/on-prem/hybrid), environments (dev/test/prod), user roles, data domains, and integrations.
* Out-of-scope items are explicitly listed with rationale.
* Environment separation — especially production vs non-production — is captured as a scope dimension.
* Internet-facing vs internal exposure is flagged per system.
* Third-party and vendor boundary involvement is identified and noted.
* The scope view highlights dependencies that may pull in adjacent systems.
* A dated and version-controlled scope baseline is stored for audit traceability.
* Scope changes after baseline are tracked with a reason and approver.

## Notes

* Scope drives test planning: web application, mobile API, internal systems, cloud infrastructure, and admin interfaces each have different testing depths.
* Industry-specific scope considerations:
  * FI: transaction-sensitive functions, card/account data flows, fraud-related workflows, privileged operational systems.
  * GovTech: citizen personal data, public-facing portals, officer/admin workflows, inter-agency access boundaries.
  * Generic/real estate/education: customer portal, document workflows, SaaS integration exposure, vendor access paths.
* Segmentation and isolation is a core architecture principle: production must not be reachable from lower-trust systems, and admin paths must be separated from user paths.
