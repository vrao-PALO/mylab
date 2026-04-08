# User Story: 9 - Answer Financial Institution Compliance Queries

**As a** solution advisor for MAS-regulated clients and FI engagements,
**I want** quick-reference answers for common FI questions on MAS TRM, ISO 27001, SOC 2, and MTCS Tier 3,
**so that** I can respond confidently and accurately during client discussions, RFP responses, and presales meetings.

## Acceptance Criteria

* A dedicated FI compliance section covers MAS TRM question patterns including: governance, third-party risk, security-by-design, SDLC controls, access management, operational resilience, and technology risk.
* Each answer states the control intent, what evidence is expected, and what a typical implementation looks like.
* Responses clearly identify when additional specialist review or formal evidence gathering is required.
* The content maps MAS TRM themes to corresponding ISO 27001 domains and SOC 2 trust service criteria where they overlap.
* Questions can be filtered by: framework (MAS TRM / ISO 27001 / SOC 2 / MTCS), topic (identity, data protection, VAPT, logging, SDLC), or audience (client/FI, internal team, auditor).
* Common FI client questions are pre-loaded, e.g.:
  * "What access controls do you have on customer data?"
  * "How do you manage third-party and vendor security?"
  * "What is your secure SDLC maturity?"
  * "How do you handle security testing before go-live?"
  * "What logging and monitoring do you have in place?"

## Notes

* MAS TRM (Technology Risk Management Guidelines, Jan 2021) applies to MAS-regulated financial institutions in Singapore. Key areas: governance, third-party risk, IT asset management, risk treatment, security-by-design, secure SDLC, secure coding, source code review, application security testing, quality management.
* MAS TRM compliance is considered a supervisory risk assessment factor — it is not optional for regulated FIs.
* FI-specific architecture priorities: transaction integrity, payment/card/account data protection, stronger privileged access controls, fraud-sensitive workflows, deeper pre-production assurance, formal exception handling with sign-off.
* MTCS Tier 3 is relevant for cloud service providers targeting Singapore government and highly regulated sectors.
* SOC 2 Type II reports are often requested by FI clients to validate cloud service or SaaS vendor controls across security, availability, confidentiality, and processing integrity.
* Always distinguish between: control intent (what it is trying to achieve), control design (how it is implemented), and control effectiveness (whether it actually works in practice).
