# User Story: 9 - Set Measurable AI Objectives

**As a** AIMS implementation lead,
**I want** to define measurable AI objectives after risk and impact analysis,
**so that** the organization can track whether its AI policy commitments are being achieved.

## Acceptance Criteria

* AI objectives are consistent with the AI policy.
* Objectives reflect outputs from risk assessment and impact assessment.
* Each objective has a measurement method or performance indicator.
* Responsibilities, resources, and review methods for each objective are defined.

## Clause Reference

| Clause | Requirement |
|--------|-------------|
| 6.2 | Establish AI objectives at relevant functions and levels |
| 6.2 | Objectives must be measurable, monitored, communicated, and updated as needed |
| 9.1 | Monitor and measure performance against objectives |
| 9.3 | Management review evaluates achievement of objectives |
| Annex C | 11 AI objectives listed — reference for objective derivation |

## Key Findings from Training (Day 3 — Deep Dive on Measurement)

* **The IBM case study (Day 3)**: After managing a 500-crore account for 6 years, the client asked: "What value did you add to my business?" Revenue alone was not an answer. The point: measurements that do not link to business value are insufficient — and management systems that do not demonstrate value are abandoned.
* **The investment banking case study (Day 3)**: A facility with 50 authorized researchers had 250 people with access. Nobody had set a measurement for "access to restricted areas should equal number of authorized researchers." The gap existed for years undetected.
* **Key rule from the trainer**: Every measurement has a cost — direct and opportunity. If a measurement does not link to an organizational objective and help answer "is my management system delivering value?", it becomes an elephant to carry and organizations will drop it.
* **Objectives must be SMART** — the trainer paraphrased this as: method defined, timeline defined, responsibility named, target stated, and reviewed on schedule.
* **Reference**: Annex C of ISO 42001 lists 11 AI system objectives that can be adopted, adapted, or used as inspiration — these translate into the AIMS objectives.
* Bad objective example (cited): "Reduce security incidents per month." The trainer said this "gives your people an agenda" (i.e., pressure to under-report) rather than a genuine measure.

## Risk Linkage (from 50 Sample AI Risks)

* Risk 22 — Lack of monitoring of model performance: an objective on model accuracy directly addresses this
* Risk 23 — Failure to detect declining accuracy: a measurable accuracy threshold objective addresses this
* Risk 13 — Model drift: an objective on periodic model evaluation cadence addresses this
* Risk 39 — Lack of transparency: an objective on explainability rate (e.g., % of decisions with rationale available) addresses this

## Implementation Notes

* Use template: 17. AI Objectives and Planning to Achieve Them v1.0.pdf.
* Set objectives at multiple levels: organizational level (aligned to policy) and operational level (aligned to specific AI system risks).
* For each objective record: Objective | Measurement Method | Target | Baseline | Frequency | Responsible Role | Data Source | Review Forum.
* Connect every objective back to a risk identified in the risk assessment (Story 6) or a pillar commitment in the policy (Story 4).
* Present objectives to top management for approval; include in management review agenda.
