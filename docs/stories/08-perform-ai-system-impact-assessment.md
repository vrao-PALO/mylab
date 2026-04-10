# User Story: 8 - Perform AI System Impact Assessment

**As a** AI system owner,
**I want** to perform and document AI system impact assessments,
**so that** the organization understands the potential technical and societal consequences of its AI systems.

## Acceptance Criteria

* A defined process exists for assessing potential consequences of AI systems.
* The assessment considers the technical context and societal context of the system.
* The results of the impact assessment are documented.
* Relevant results can be shared with interested parties when appropriate.
* The impact assessment is treated as distinct from the AI risk assessment.

## Clause Reference

| Clause | Requirement |
|--------|-------------|
| 8.2 | Determine the AI system impact assessment process and perform it for in-scope systems |
| 6.1.2 | Impact assessment outputs feed AI risk assessment |
| 9.1 | Monitor effectiveness of impact assessment controls |
| Annex A (A.6) | Controls for AI system impact assessment |

## Key Findings from Training (Day 5 — Activity 23)

* The trainer described the AI system impact assessment as **"the heart of the management system"** and the basis for risk assessment.
* **Critical distinction confirmed**: The AI risk assessment (Clause 6.1.2) evaluates organizational risks — probability and impact within the management system context. The AI system impact assessment (Clause 8.2) evaluates the **consequences of a specific AI system on individuals, groups, society, and the environment**.
* Activity 23 structure: Review a sample impact assessment ? match the steps outlined in the template ? understand how each step inputs to the risk assessment.
* The trainer stated that impact assessment is an **operational activity** — performed as part of running the AI system, not just once during planning. It must feed back into the risk register continuously.
* A question from the session: "Can a DPIA (Data Protection Impact Assessment from GDPR) substitute for an AI system impact assessment?" — The answer is **no**: scope and focus differ; however, findings from a DPIA are relevant inputs.
* Reference template: 5. AI System Impact Assessment Process v1.0.pdf and 23. Healthcare AI System Impact Assessment v1.0.pdf provide a worked example.

## Risk Linkage (from 50 Sample AI Risks)

* Risk 42 — Use of AI in high-risk decisions without impact assessment: this story directly addresses this risk
* Risk 40 — Automation bias: impact assessment must explicitly evaluate human-AI interaction consequences
* Risk 41 — AI decisions affecting individuals without human oversight: impact assessment identifies this scenario
* Risk 43 — AI-generated misinformation: impact on society must be assessed before deployment

## Implementation Notes

* For each AI system in scope: complete an impact assessment before deployment and review it at each major change.
* Impact assessment inputs: system description, intended and unintended use cases, affected user populations, data used, decision types made, societal consequences, severity and reversibility of harm.
* Output feeds: risk register update, SoA review trigger, informed consent/communication decisions, senior management review.
* Use the worked healthcare example (23. Healthcare AI System Impact Assessment v1.0.pdf) as a template for your first assessment.
