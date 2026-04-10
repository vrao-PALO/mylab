# User Story: 14 - Manage Nonconformity and Corrective Actions

**As a** process owner,
**I want** to address nonconformities with corrective actions,
**so that** recurring AIMS failures are prevented and continual improvement is demonstrated.

## Acceptance Criteria

* Nonconformities are recorded when identified.
* The organization evaluates the cause of each nonconformity.
* Corrective actions are defined and tracked to completion.
* The effectiveness of the corrective action is reviewed.
* Records are retained as evidence of improvement.

## Clause Reference

| Clause | Requirement |
|--------|-------------|
| 10.2 | When a nonconformity occurs: react, evaluate cause, determine action, implement, review effectiveness |
| 10.2 | Retain documented information as evidence of NC and corrective action |
| 10.1 | Continual improvement of suitability, adequacy, effectiveness of AIMS |
| 9.2 | Internal audit identifies nonconformities that must be addressed under 10.2 |

## Key Findings from Training (Day 3 — Critical Distinctions Session)

* **Nonconformity sources (four types)**:
  1. Non-fulfillment of ISO 42001 standard requirements
  2. Non-fulfillment of legal, statutory, or regulatory requirements
  3. Non-fulfillment of customer or contractual requirements
  4. Non-fulfillment of internal objectives, policies, or procedures

* **Correction vs. Corrective Action — the most common exam trap**:
  - **Correction**: Action taken to contain or eliminate the detected nonconformity *now* (immediate fix). Does not require root cause analysis. Example: halting a biased model and manually reviewing affected decisions.
  - **Corrective Action**: Action to eliminate the *cause* of the nonconformity to prevent recurrence. Requires root cause analysis. Example: investigating why training data produced biased outputs, retraining the model, implementing fairness-testing step in the development process.
  - An organization that only applies corrections without corrective actions will see recurrence — which is itself a finding.

* **Continual improvement is broader than corrective action**: it includes proactive initiatives to enhance effectiveness — not just reactions to failures. This was confirmed by the trainer on Day 3.

* The trainer's audit perspective: organizations should welcome nonconformities as "gaps that could have cost them dearly if not found." A management system with zero nonconformities over time is not evidence of excellence — it is evidence of poor monitoring.

## Risk Linkage (from 50 Sample AI Risks)

* Risk 25 — Inadequate incident response for AI failures: nonconformity management is the formal incident response mechanism in AIMS
* Risk 27 — Uncontrolled model updates: if an unauthorized update causes degraded performance, raise a nonconformity and trace the cause
* Risk 20 — Failure to retrain models regularly: if detected, this becomes an internal nonconformity against an internal procedure
* Risk 48 — Failure to maintain documentation: detected in audit, becomes a documented nonconformity requiring corrective action

## Implementation Notes

* Use template: 26. Nonconformity and Corrective Actions Procedure v1.0.pdf and 21/22 Risk Treatment Plans as worked examples.
* For each nonconformity record: NC ID | Source | Description | Detected by | Date | Correction taken | Root Cause | Corrective Action Planned | Owner | Target Date | Effectiveness Review Date | Status.
* Apply root cause analysis tools: 5-Why, fishbone diagram, fault tree analysis — match method to complexity of the failure.
* Close nonconformities only after effectiveness has been confirmed — not after the corrective action has merely been implemented.
* Feed nonconformity trends into management review as a key input.
