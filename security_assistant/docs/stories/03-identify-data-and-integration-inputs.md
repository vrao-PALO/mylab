# User Story: 3 - Identify Data And Integration Inputs

**As a** security architect,
**I want** to classify all data types and map every integration, API, and external dependency,
**so that** I can determine appropriate security controls, trust boundaries, and regulatory obligations before design decisions are locked.

## Acceptance Criteria

* Data catalog supports classification tiers: INTERNAL, CONFIDENTIAL, FINANCIAL, AUDIT/PII, and regulated data (e.g. card data, citizen records, health data).
* Each data class is mapped to its sensitivity level, retention requirement, and relevant regulation (PDPA, MAS TRM, HIPAA, etc.).
* Integrations catalog captures: source, destination, protocol, authentication method, data sensitivity, and third-party ownership.
* AI model inputs and outputs are flagged as a separate data category requiring governance review.
* The catalog output identifies where data protection controls apply: encryption in transit, encryption at rest, masking, tokenization, retention, disposal.
* High-risk data flows (e.g. PII traversing external APIs, card data in logs) are automatically highlighted.
* The catalog is available as a reusable input to the control mapping stage.

## Notes

* The "Protect Data Throughout Its Lifecycle" principle applies at collection, processing, storage, transfer, sharing, archival, and disposal.
* Data exposure often happens outside the main database: logs, exports, reports, email, test environments, support workflows, and backups.
* Integration trust boundaries are critical: internet user to application; application to API to data store; application to third-party service; production to non-production.
* For the NAPTA platform: data classes include INTERNAL (BI), CONFIDENTIAL (HR & Audit), FINANCIAL (Finance only), and AUDIT (Audit only) — each with enforced role-scoped access.
* For the AI Mock Interview platform: data includes resumes (PII), video recordings, AI scoring outputs, and session metadata — each requiring distinct retention and disposal controls.
