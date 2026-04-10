# Practice Questions

## Short Answer

1. What is the purpose of using PDCA in an AI management system?
2. Why must context be understood before scope is finalized?
3. Who is responsible for establishing the AI policy?
4. What does it mean when the policy provides a framework for setting objectives?
5. Why are relevant interested parties more important than trying to capture every possible stakeholder?
6. How is context linked to AI risk assessment?
7. Why should AI objectives be set after risk and impact analysis?
8. What is the difference between AI risk assessment and AI system impact assessment?
9. Why is the statement of applicability significant?
10. What does documented information mean in practice under the AIMS?
11. What must be defined for monitoring and measurement to be effective?
12. Why must internal audit be objective and impartial?
13. What is the purpose of management review?
14. What is the difference between correction and corrective action?
15. Why is continual improvement broader than nonconformity response?

## Scenario Questions

1. An organization has written an AI policy before identifying its scope, context, or interested parties. What weakness would you highlight?
2. A team says it has AI objectives, but none of them have KPIs or measurement methods. What is the issue?
3. A company has one generic risk register but cannot show how risks were derived from context or interested party requirements. What concern would an auditor raise?
4. An organization performs privacy impact assessments and claims that no separate AI system impact assessment is needed. How would you respond?
5. A department manager runs a meeting and calls it management review, but top management is not involved. Why is that not enough?
6. A nonconformity is found and the team immediately applies a fix without analyzing the cause. What is missing?

## Quick Recall Answers

1. PDCA gives structure for planning, execution, evaluation, and improvement.
2. Scope must reflect the actual organizational and stakeholder context.
3. Top management.
4. It should guide how meaningful objectives are derived later.
5. Only relevant parties create requirements that matter to the AIMS.
6. Risks should reflect internal issues, external issues, and relevant party requirements.
7. Objectives should respond to what matters most after analysis.
8. Risk assessment evaluates organizational risks; impact assessment evaluates consequences of AI systems on individuals and society from specific systems.
9. It records selected controls and their justification as a control baseline — it is a planning document, not an operational checklist.
10. It means maintaining necessary, controlled, and usable documents and records — including both documents (current procedures and policies) and records (evidence of activities).
11. Method, timing, responsibility, and evaluation approach — and each measurement must link to an organizational objective.
12. To ensure trustworthy and unbiased audit results; an auditor cannot audit their own work.
13. To assess suitability, adequacy, and effectiveness of the AIMS — conducted by top management, not delegated to a department manager.
14. Correction fixes the issue now; corrective action addresses the root cause to prevent recurrence.
15. Improvement also comes from proactive enhancement, monitoring trends, and management review decisions — not only from responding to failures.

---

## Clause-Referenced Questions (New — from 50 Sample AI Risks and Training Analysis)

### Section A — Data Risks (Risks 1–10)

**Q1.** An AI hiring system was trained on historical data that over-represents male candidates in senior roles. What risk is this, and which clause and control apply?
- **Risk**: Risk 1 — Training data contains demographic bias leading to discriminatory outcomes
- **Clause**: 6.1.2 (risk assessment must identify this), 8.2 (impact assessment must evaluate societal consequence)
- **Control**: Annex A — Data quality and fairness controls; Transparency and explainability controls
- **Answer**: This is a fairness risk and an ethical/societal risk. The organization must assess this in both the risk assessment (Clause 6.1.2) and the AI system impact assessment (Clause 8.2). Controls must address data selection, validation, and fairness testing. The AI policy (Clause 5.2) must commit to fairness as a principle; objectives (Clause 6.2) must include a measurable fairness metric.

**Q2.** A company cannot trace where the training data for its customer churn model came from. What risk applies and what must the organization demonstrate?
- **Risk**: Risk 5 — Lack of data provenance (unknown data sources)
- **Clause**: 6.1.2 (must identify this risk), 8 (operational control of data management)
- **Control**: Annex A — Data provenance controls; referenced in training as Control B.7.5 (data provenance process)
- **Answer**: This is a data risk and governance risk. The organization must demonstrate a documented data provenance process (template: 9. Data Provenance Process v1.0.pdf). Lack of data provenance means the organization cannot validate that the data was lawfully obtained, is representative, or is fit for purpose — all of which are requirements of responsible AI.

**Q3.** The AIMS risk assessment identifies that personal health data is being used to train a diagnostic AI but no consent was obtained. What is the compliance concern and what response is required?
- **Risk**: Risk 6 — Sensitive personal data used without consent
- **Clause**: 4.2 (legal requirements are interested party requirements), 6.1.2 (legal compliance failure is a risk), 10.2 (nonconformity)
- **Answer**: This is simultaneously an AI risk, a privacy/legal risk, and a nonconformity under Clause 10.2 (non-fulfillment of legal requirement). Immediate correction: halt use of that dataset. Corrective action: establish consent procedures and review all data sources. The organization's interested parties register (Clause 4.2) must include regulators, whose legal requirements become AIMS requirements.

---

### Section B — Model Risks (Risks 11–20)

**Q4.** An AI model performs well during testing but degrades significantly in production after 6 months. What risk is this and how should it be managed?
- **Risk**: Risk 13 — Model drift due to changing data patterns
- **Clause**: 9.1 (monitoring must detect this), 6.1.2 (risk must be identified), 10.2 (nonconformity when threshold breached)
- **Control**: Annex A — Monitoring of AI system performance controls
- **Answer**: Model drift is a key AI-specific risk. Controls must include: defined performance thresholds (Clause 6.2 objective), automated monitoring (Clause 9.1), and a process for retraining or retiring the model when drift exceeds the threshold. If monitoring detects degraded performance below the defined threshold, a nonconformity must be raised (Clause 10.2), root cause analyzed, and corrective action implemented.

**Q5.** A credit scoring model cannot explain why a particular applicant was rejected. An applicant complains. What ISO 42001 provisions apply?
- **Risk**: Risk 15 — Black-box models lacking explainability; Risk 41 — AI decisions affecting individuals without human oversight
- **Clause**: 5.2 (policy must commit to transparency), 8.2 (impact assessment must evaluate this consequence), 6.2 (objective on explainability)
- **Control**: Annex A — Transparency and explainability controls
- **Answer**: Explainability is one of the three AIMS pillars (Transparency). The organization's AI policy must commit to transparency. The AI system impact assessment (Clause 8.2) must have flagged the inability to explain individual decisions as a consequence. Controls must include a human review mechanism for contested AI decisions. An objective with a measurable explainability rate must exist (Clause 6.2).

---

### Section C — Operational Risks (Risks 21–30)

**Q6.** An organization deployed the wrong version of an AI model to production because there was no change management process. What clauses are implicated?
- **Risk**: Risk 21 — Incorrect model version deployed in production; Risk 27 — Uncontrolled model updates; Risk 28 — Insufficient change management procedures
- **Clause**: 8.1 (operational planning and control), 10.2 (nonconformity), 7.4 (document and version control)
- **Control**: Annex A — Change management controls; Life cycle controls
- **Answer**: This implicates Clause 8.1 (plan, implement, control, and review processes), Clause 7.4 (version control of documented information), and triggers a nonconformity under Clause 10.2. The corrective action must include implementing a formal change management process for AI model versions, with documented approval, testing, and deployment procedures.

**Q7.** An AI system has been in production for 2 years and no one has reviewed its performance against its original objectives. What finding would an auditor raise?
- **Risk**: Risk 22 — Lack of monitoring of model performance; Risk 23 — Failure to detect declining accuracy
- **Clause**: 9.1 (monitoring and measurement), 6.2 (objectives must be monitored), 9.3 (management review inputs)
- **Answer**: The auditor would raise a nonconformity against Clause 9.1 — the organization has not monitored or measured performance as required. The finding would also implicate Clause 6.2 (no evidence objectives were tracked) and Clause 9.3 (management review was not informed by performance data). Corrective action: establish monitoring schedule, define thresholds, and include AI system performance in management review agenda.

---

### Section D — Security Risks (Risks 31–37)

**Q8.** A threat actor submits crafted inputs to an AI fraud detection model, causing it to approve fraudulent transactions. What risk category and AIMS response apply?
- **Risk**: Risk 31 — Adversarial attacks on ML models; Risk 37 — Malicious manipulation of AI outputs
- **Clause**: 6.1.2 (must be identified as risk), 8.1 (operational security controls), 9.1 (monitoring for anomalous behavior)
- **Control**: Annex A — Security controls for AI systems; adversarial robustness testing
- **Answer**: Adversarial attacks are a known AI-specific security risk. The risk assessment must explicitly include adversarial robustness. Controls include: adversarial robustness testing in development (Clause 8), anomaly detection in monitoring (Clause 9.1), and incident response procedures (Clause 10.2 nonconformity when an attack is detected). This also requires integration with the ISMS if one exists.

---

### Section E — Ethical and Societal Risks (Risks 38–43)

**Q9.** An HR department uses an AI tool for resume screening and accepts all AI recommendations without review. Staff raise concerns about fairness. What AIMS provisions apply?
- **Risk**: Risk 40 — Automation bias causing humans to trust AI blindly; Risk 41 — AI decisions affecting individuals without human oversight; Risk 38 — Algorithmic discrimination
- **Clause**: 8.2 (impact assessment must identify affected individuals — job applicants), 5.2 (policy must commit to fairness), 6.1.2 (risk must be identified and treated)
- **Control**: Annex A — Human oversight controls; Fairness and non-discrimination controls; Transparency controls
- **Answer**: This scenario combines automation bias, fairness, and human oversight concerns. The impact assessment (Clause 8.2) should have identified job applicants as significantly affected individuals. Controls must include a mandatory human review step for all AI-generated hiring recommendations. Objectives (Clause 6.2) must include a fairness metric (e.g., demographic parity or equal opportunity rate). The AI policy must explicitly prohibit unsupervised AI decisions in high-impact domains.

**Q10.** An organization deploys an AI chatbot that occasionally produces factually incorrect medical advice. What is the most critical AIMS response?
- **Risk**: Risk 43 — AI-generated misinformation or harmful outputs; Risk 42 — Use of AI in high-risk decisions without impact assessment
- **Clause**: 8.2 (impact assessment for a high-risk AI system), 6.1.2 (risk treatment), 10.2 (nonconformity if deployed without impact assessment)
- **Answer**: Deploying an AI system in a medical advice context without an impact assessment is a nonconformity under Clause 8.2. Immediate correction: add a disclaimer and escalation path to human medical professionals. Corrective action: perform a full AI system impact assessment, review risk treatment, implement output validation controls (e.g., factual grounding, confidence thresholds), and redefine the system's intended use to exclude unsupervised diagnosis.

---

### Section F — Governance and Compliance Risks (Risks 44–48)

**Q11.** An external auditor arrives at an organization and finds: no AI policy, no risk register, no defined scope, no internal audit records. How many potential nonconformities are present and against which clauses?
- **Risks**: Risk 44, 45, 47, 48 all present simultaneously
- **Clauses**: 4.3 (no scope), 5.2 (no policy), 6.1.2 (no risk register), 9.2 (no internal audit)
- **Answer**: A minimum of four nonconformities: (1) Clause 4.3 — no AIMS scope defined; (2) Clause 5.2 — no AI policy established; (3) Clause 6.1.2 — no AI risk assessment process or records; (4) Clause 9.2 — no internal audit programme or records. The external auditor would likely suspend the audit until these fundamentals are in place. This also calls into question top management commitment under Clause 5.1.

**Q12.** An organization handles personal data in its AI system but has not reviewed GDPR requirements as part of its interested parties analysis. What is missing and how should it be addressed?
- **Risk**: Risk 46 — Non-compliance with privacy regulations (GDPR, etc.)
- **Clause**: 4.2 (regulators are interested parties; their requirements — including GDPR — become AIMS requirements), 6.1.2 (regulatory non-compliance is a risk to be assessed and treated)
- **Answer**: GDPR requirements from the data protection authority are an interested party requirement under Clause 4.2. Failure to identify and address them means the risk assessment under Clause 6.1.2 is incomplete. Corrective action: update interested parties register to include the data protection authority; update risk assessment to include GDPR compliance risks; update internal policies and procedures accordingly; consider whether a DPIA (Data Protection Impact Assessment) is also required and can complement the AI system impact assessment.

---

### Section G — Third-Party and Supply Chain Risks (Risks 49–50)

**Q13.** An organization uses a third-party AI model via API and cannot obtain information about the training data used. What AIMS provisions apply?
- **Risk**: Risk 49 — Use of third-party AI models with unknown training data sources; Risk 50 — Dependence on external AI vendors without transparency or control
- **Clause**: 4.2 (third-party AI vendor is a relevant interested party), 6.1.2 (risk must be assessed), 8 (operational control over third-party AI must be defined)
- **Control**: Annex A — Third-party and supply chain controls
- **Answer**: Third-party AI models with unknown data provenance represent a data risk (Risk 5) and supply chain risk (Risk 49). The AIMS must require vendors to provide: data provenance information, fairness testing evidence, security certifications, and contractual commitments to transparency. Where this information cannot be obtained, the risk must be escalated in the risk register — acceptance of a high-risk must involve top management. Consider using the Supplier Assessment Questionnaire (template: 13. Supplier Assessment Questionnaire v1.0.pdf).

---

## True / False Questions (Exam Style)

| # | Statement | Answer | Clause |
|---|-----------|--------|--------|
| 1 | Top management may delegate the responsibility for establishing the AI policy to the AIMS lead. | FALSE — Top management must establish the policy; drafting may be delegated but accountability cannot | 5.2 |
| 2 | The statement of applicability must list only the controls that are selected; excluded controls do not need to appear. | FALSE — ALL Annex A controls must appear; excluded controls must be listed with justification | 6.1.3 |
| 3 | A management review conducted by a senior IT manager without top management present satisfies Clause 9.3. | FALSE — Management review must be conducted by top management | 9.3 |
| 4 | Corrective action addresses the root cause of a nonconformity to prevent recurrence. | TRUE | 10.2 |
| 5 | The AI system impact assessment is the same as the AI risk assessment and can be combined into one document. | FALSE — They are distinct: risk assessment evaluates organizational risks; impact assessment evaluates consequences on individuals and society | 6.1.2, 8.2 |
| 6 | An organization that has no AI of its own but purchases AI services from vendors has no AIMS obligations. | FALSE — Use of AI systems (including third-party) falls within AIMS scope; supply chain controls apply | 4.3, 8 |
| 7 | Continual improvement only occurs through corrective actions arising from nonconformities. | FALSE — Continual improvement includes proactive enhancements, not only reactions to failures | 10.1 |
| 8 | A performance metric of "zero AI-related incidents per month" is an acceptable AIMS objective. | FALSE — This creates incentive to under-report rather than genuinely improve; objectives must be meaningful and linked to business value | 6.2 |
