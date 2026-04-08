# User Story: 7 - Generate Plain English Explanations

**As a** security architect working across mixed audiences,
**I want** concise plain-English explanations for each technical or compliance topic,
**so that** non-technical stakeholders — sales, presales, management, business owners, and clients — can understand risk and priority without losing accuracy.

## Acceptance Criteria

* Each major control topic includes three views: Technical Summary, Plain-English Explanation, Business-Friendly Framing.
* Plain-English explanations state: what the control is, why it matters to the business, and what happens when it is missing.
* Guidance includes how to pitch the topic to: business owner/product owner, senior management, delivery teams, and audit/risk teams.
* Each explanation is tagged with relevant stakeholder type so the right framing is surfaced.
* Examples of business-friendly framing are included for each of the 10 core architecture principles.

## Notes

* Stakeholder communication is as important as technical knowledge. A Security Architect succeeds by working through people, not only by knowing controls.
* How different stakeholders frame the same issue:
  * **Business owner**: Focus on fraud exposure, financial loss, customer trust, service disruption, and go-live confidence.
  * **Project manager**: Focus on checkpoints, timelines, entry/exit criteria, testing dependencies, and what is a blocker vs. manageable.
  * **Engineering team**: Focus on practical patterns, why a control is needed, how to implement it, and priority by actual risk — not abstract policy.
  * **Audit/risk team**: Focus on traceability, evidence, control-to-requirement mapping, and residual risk documentation.
  * **Senior management**: Focus on the most material risks, decisions needed, and whether security is proportionate and under control.
* Example plain-English statements:
  * Least Privilege: "Each person or system only gets access to what they actually need. If a support agent doesn't need to see payment records, they simply don't have access."
  * Defense in Depth: "We don't rely on a single lock. If one control fails, others are still protecting the system — similar to a building with alarms, locked doors, cameras, and guards."
  * Zero Trust: "We don't automatically trust someone just because they're inside the building — every access request is verified, every time."
  * Auditability: "Every important action is logged with who did it, when, and what changed — so we can always answer questions in an investigation or audit."
