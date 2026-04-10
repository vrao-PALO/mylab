# User Story: 7 - Create Risk Treatment Plan and Statement of Applicability

**As a** risk owner,
**I want** to define risk treatments and maintain a statement of applicability,
**so that** selected controls are justified, traceable, and form the baseline for the AIMS.

## Acceptance Criteria

* Each treated risk has a planned response.
* Relevant controls are selected or excluded with justification.
* A statement of applicability is maintained as the control baseline.
* Changes affecting treatment decisions trigger review of the statement of applicability.

## Clause Reference

| Clause | Requirement |
|--------|-------------|
| 6.1.3 | Determine risk treatment options; select applicable controls from Annex A |
| 6.1.3 | Produce a Statement of Applicability (SoA) |
| 8.1 | Plan, implement, control and review processes to implement risk treatment |
| Annex A | 38 controls across eight domains — all must appear in the SoA |

## Key Findings from Training (Day 3)

* The trainer was direct: the **SoA is a planning document, not an operational document**. Organizations that use the SoA as a daily checklist are misusing it.
* The SoA records: (a) all 38 Annex A controls, (b) which are selected (applicable), (c) which are excluded, and (d) justification for each decision.
* Treatment options for each risk: Accept | Avoid | Transfer | Mitigate. Where mitigation is chosen, Annex A controls are the primary toolbox.
* When a control is **excluded**, the justification must demonstrate it is not applicable — not just that it is inconvenient to implement.
* The trainer emphasized traceability: Risk Assessment ? Risk Treatment ? SoA ? Implementation (Clause 8) ? Monitoring (Clause 9). An auditor traces this chain end-to-end.
* **Annex A has 38 controls organized across eight domains**: Governance, AI System Design and Development, AI System Life Cycle, Data, Human Factors, Transparency and Explainability, Security, Third-Party.

## Risk Linkage (from 50 Sample AI Risks)

* Risk 8 — Data poisoning: treated via data security and provenance controls (A.7 domain)
* Risk 15 — Black-box models: treated via transparency and explainability controls (A.6 domain)
* Risk 27 — Uncontrolled model updates: treated via change management controls (A.5 domain)
* Risk 49 — Third-party AI with unknown data: treated via third-party controls (A.8 domain)
* Risk 47 — No internal audit coverage: treated via governance and audit controls (A.2 domain)

## Implementation Notes

* Use template available: 02.1 Risk Assessment & SoA.xlsx — the SoA worksheet is pre-structured.
* Walk through all 38 Annex A controls systematically; do not skip controls on the assumption they are irrelevant without documenting reasoning.
* Review the SoA whenever: (a) a new AI system is added to scope, (b) a risk assessment is updated, (c) the regulatory environment changes, or (d) an audit finding identifies a control gap.
* Risk treatment plan and SoA should be approved by the AIMS Owner (top management representative).
