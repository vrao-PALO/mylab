# User Story: 11 - Monitor and Measure AIMS Performance

**As a** AIMS performance owner,
**I want** to monitor and measure AIMS performance,
**so that** I can evaluate whether controls and objectives are effective.

## Acceptance Criteria

* Key measurements are defined for relevant objectives and controls.
* Monitoring results are recorded as evidence.
* Measurements support evaluation of effectiveness rather than arbitrary targets.
* Results are available for audit and management review.

## Clause Reference

| Clause | Requirement |
|--------|-------------|
| 9.1 | Monitor, measure, analyse and evaluate AIMS performance |
| 9.1 | Determine: what to monitor, methods, when, who analyses, when results evaluated |
| 9.3 | Management review inputs include monitoring results |
| 6.2 | Objectives must have defined measurement approach |

## Key Findings from Training (Day 3 — Core Session on Monitoring)

* The trainer stated: **"Monitoring is even more expensive than implementing the control itself."** Every measurement has direct cost (people, tools, time) and opportunity cost. This is why measurements must be strategically chosen.
* **Principle**: If the measurement does not help answer "Is my management system delivering the value it was set up to deliver?", remove it.
* The trainer explicitly rejected "zero incidents per month" as a valid AI objective-based measurement: it creates pressure to under-report rather than genuinely improve the system.
* **38 Annex A controls** — each one may need a measurement. Some are straightforward (e.g., number of trained personnel); others require business-context thinking (e.g., how do you measure "fairness" in an algorithm?). Involve top management to define what constitutes evidence of control effectiveness.
* The investment banking audit example: 250 people had access to a 50-person research facility. Nobody had set a measurement for "access list size vs. authorized user count." The control existed; the measurement did not.
* Monitoring must be **scheduled**: define frequency per measurement; some are daily (automated model performance logs), some monthly (access review), some annually (policy compliance survey).

## Risk Linkage (from 50 Sample AI Risks)

* Risk 22 — Lack of monitoring of model performance: the primary risk this story mitigates
* Risk 23 — Failure to detect declining accuracy: requires an accuracy monitoring measurement
* Risk 13/14 — Model drift / Concept drift: requires periodic performance benchmarking as a measurement
* Risk 34 — Unauthorized access to AI models: requires access monitoring measurement

## Implementation Notes

* For each objective (Story 9) and each selected control (Story 7), define: Measurement | Data Source | Method | Frequency | Responsible Role | Target | Threshold | Escalation Trigger.
* Use dashboards or automated reporting where feasible — manual measurement is unsustainable at scale.
* Feed monitoring results into: (a) management review, (b) internal audit inputs, (c) risk register update triggers.
* If a measurement consistently shows a control is ineffective, raise a nonconformity (Story 14) rather than adjusting the target.
