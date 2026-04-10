# User Story: 6 - Assess AI Risks

**As a** risk owner,
**I want** to conduct AI risk assessments,
**so that** the organization can identify and evaluate risks that could prevent the AIMS from achieving its intended results.

## Acceptance Criteria

* A documented AI risk assessment process is defined and retained.
* Risks are identified using inputs from context, scope, interested party requirements, and AI system characteristics.
* Risk evaluation criteria are applied consistently.
* The results of the assessment are recorded and available for treatment planning.

## Clause Reference

| Clause | Requirement |
|--------|-------------|
| 6.1.1 | Address risks and opportunities; plan actions to address them |
| 6.1.2 | Define and apply an AI risk assessment process |
| 6.1.3 | Define and apply an AI risk treatment process |
| 8.1 | Implement processes to meet requirements; manage change |
| Annex A (A.6) | Controls for assessing AI system impact and risk |

## Key Findings from Training (Days 2 & 3)

* **Context-based, not asset-based**: The trainer explained a generational shift. Old ISO standards (2008) started with "identify all assets." Modern standards and ISO 42001 start with organizational context and work toward risks and opportunities. The risk assessment must trace back to issues from Clause 4, not to a standalone asset list.
* The trainer noted that the ISMS transition from 2008 to 2013 was still incomplete in many organizations — ISO 42001 implementers must not repeat that mistake.
* **Risk assessment criteria must be set first**: Define likelihood and impact scales, risk tolerance thresholds, and risk acceptance criteria before performing the assessment.
* **50 Sample AI Risks (reference document)** provides the risk taxonomy organized into five domains: Data Risks, Model Risks, Operational Risks, Security Risks, Ethical & Societal Risks, Governance & Compliance Risks, and Third-Party & Supply Chain Risks.
* The AI risk assessment and the AI system impact assessment are **distinct processes** (confirmed Day 5): the risk assessment focuses on organizational risks; the impact assessment focuses on consequences to individuals and society from specific AI systems.

## Risk Linkage — All 50 Sample Risks Apply Here

**Data Risks (1–10)**: Training data bias, incomplete data, outdated data, labeling errors, lack of provenance, sensitive data without consent, unbalanced datasets, data poisoning, inconsistent formats, poor data quality.
**Model Risks (11–20)**: Overfitting, underfitting, model drift, concept drift, black-box models, incorrect assumptions, improper feature selection, insufficient validation, wrong algorithms, failure to retrain.
**Operational Risks (21–30)**: Wrong version in production, no performance monitoring, failing to detect declining accuracy, poor lifecycle documentation, inadequate incident response, integration failures, uncontrolled updates, insufficient change management, inadequate testing, no ownership defined.
**Security Risks (31–37)**: Adversarial attacks, model extraction, model inversion, unauthorized access, data leakage, weak API security, malicious output manipulation.
**Ethical & Societal Risks (38–43)**: Algorithmic discrimination, lack of transparency, automation bias, decisions without human oversight, high-risk decisions without impact assessment, misinformation.
**Governance & Compliance Risks (44–48)**: No governance framework, no risk management process, privacy non-compliance, no internal audit coverage, failure to maintain documentation.
**Third-Party Risks (49–50)**: Unknown third-party training data, vendor dependence without transparency.

## Implementation Notes

* Use the template: 02.1 Risk Assessment & SoA.xlsx as the structured risk register.
* For each AI system in scope (Story 1), assess relevant risks across all seven domains.
* Record: Risk ID | Description | Source | Likelihood | Impact | Risk Score | Treatment Decision | Control Reference | Residual Risk.
* Perform risk assessment  before setting objectives (Story 9) and before selecting controls (Story 7).
* Review risk assessment at least annually and after any significant change to AI systems, context, or regulation.
