# User Story: 4 - Map Requirements To Framework Controls

**As a** compliance-focused security architect,
**I want** to map engagement requirements to controls from applicable frameworks and standards,
**so that** I can provide consistent, defensible compliance guidance across FI, GovTech, and general Singapore-regulated engagements.

## Acceptance Criteria

* The control mapping matrix links requirement statements to framework clauses from one or more of: ISO/IEC 27001, MAS TRM, PDPA, MTCS Tier 3, SOC 2, OWASP ASVS, NIST SP 800-53, CIS Controls v8.
* The matrix allows one requirement to map to multiple frameworks simultaneously.
* The framework selector defaults to the correct overlay based on industry sector:
  * FI/regulated: MAS TRM + OWASP ASVS + NIST 800-53 + CIS Controls.
  * GovTech/public sector: Singapore GovZTA + ICT&SS IM8 + PDPA + OWASP ASVS.
  * Generic (education, real estate, healthcare): OWASP ASVS + CIS Controls + NIST 800-53 + PDPA.
  * AWS-hosted workloads (any sector): AWS Well-Architected Security Pillar added automatically.
  * Mobile apps (any sector): OWASP MASVS/MASTG added automatically.
* Unmapped requirements are flagged as gaps requiring resolution before go-live.
* The mapping output can be exported for proposal, audit pack, or stakeholder review.
* The tool supports the requirement-to-control-to-verification chain: requirement → design control → how it is verified → residual risk.

## Notes

* Framework applicability quick guide:
  * **All sectors**: Threat modeling, VAPT, OWASP ASVS, NIST SP 800-53 Rev.5, CIS Controls v8, OWASP MASVS/MASTG (mobile).
  * **FI-specific**: MAS TRM (MAS-regulated FIs in Singapore — governance, third-party risk, security-by-design, SDLC, VAPT).
  * **GovTech**: Government ZTA, ICT&SS IM8, Singapore MDDI cybersecurity policy, whole-of-government security posture.
  * **Generic**: OWASP ASVS (primary requirements source), OWASP WSTG (testing), CIS Controls (safeguard prioritization), NIST 800-53 (deeper catalog).
* The mapping chain is: Understand the business function → Identify sensitive data → Determine threat exposure → Define security requirements → Translate to design controls → Define how controls are verified → Consider residual risk.
