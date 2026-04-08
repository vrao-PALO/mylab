# User Story: 12 - Review Internal Platform Security Architecture

**As a** security architect supporting internal engineering on integration platforms,
**I want** a structured architecture review checklist tailored for data integration and consolidation platforms like NAPTA,
**so that** controls for data classification, access segregation, monitoring, environment separation, and audit logging are validated consistently before production deployment.

## Acceptance Criteria

* The review checklist uses the 7-step architecture review flow: Intake and Context Gathering; Trust Boundaries and High-Risk Components; Security Requirements Derivation; Design Control Review; Assurance Activities; Gap Identification and Recommendations; Outcome Documentation and Closure.
* Checklist covers: inbound data flows (source authentication, encryption in transit), data processing (classification, environment separation), storage (per-sensitivity access tiers), access control (Entra ID SSO, RBAC, least privilege), monitoring (logging, alerting, SIEM), and DR/recovery readiness.
* The review captures environment segregation: development vs. production must be clearly isolated with no direct access path between them.
* Data classification tiers are evaluated: INTERNAL (BI access), CONFIDENTIAL (HR and Audit), FINANCIAL (Finance only), AUDIT (Audit team only) — each tier must have enforced role-scoped access.
* Managed Identity and Key Vault configuration is reviewed for each Function App to ensure no shared or over-permissioned service identities.
* Findings are mapped to severity (Critical/High/Medium/Low) with specific remediation actions and suggested deadline.
* Review output is produced in two formats: a detailed technical findings record and a management-level summary.

## Notes

* NAPTA architecture key components: ETL Function App and Migration Function App (separate), single PostgreSQL per environment (not per data class), GitHub Actions with two paths (ARM for infrastructure, Entra bearer tokens for schema/data), Managed Identity scoped per Function App to Key Vault/Storage/Graph.
* Observability stack: Application Insights + Log Analytics + Azure Monitor + Action Groups; SIEM downstream of Log Analytics.
* Access paths: HR/Finance/Audit/BI access is via read-side role-scoped permissions, not direct backend access.
* Known open risks at time of design: no audit logging active (45-day fix), no data-layer RBAC (90-day fix), no branch protection in CI/CD (30-day fix).
* Architecture principles most critical for NAPTA: Least Privilege, Segmentation and Isolation, Auditability and Accountability, Zero Trust, Protect Data Throughout Its Lifecycle.
* The 10 architecture principles act as the review lens: check each principle against the actual design, not just the documentation.
