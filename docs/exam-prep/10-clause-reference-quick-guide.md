# ISO 42001 Clause Reference Quick-Guide
> Use this file as a fast lookup: given a risk, objective, or scenario, find the relevant clause(s) and control(s) instantly.

---

## PDCA Clause Map

| PDCA Phase | Clauses | Core Purpose |
|------------|---------|--------------|
| **PLAN** | 4, 5, 6, 7 | Set context, establish leadership, plan risks and objectives, secure support |
| **DO** | 8 | Operate AI systems under controlled conditions; execute risk treatments |
| **CHECK** | 9 | Monitor, measure, audit, and review |
| **ACT** | 10 | Address nonconformities, improve continually |

---

## Clause-by-Clause Reference

### Clause 4 — Context of the Organization
| Sub-clause | Title | Key Requirement | Evidence Required |
|-----------|-------|-----------------|-------------------|
| 4.1 | Understanding the organization and its context | Identify internal and external issues relevant to AIMS using SWOT (internal) and PESTIL (external) scoped to Effectiveness, Fairness, Transparency | Context analysis document |
| 4.2 | Understanding needs and expectations of interested parties | Identify relevant parties; determine their requirements; treat requirements as AIMS inputs | Interested parties register with needs/expectations columns |
| 4.3 | Determining the scope of the AIMS | Define boundaries: which AI systems, functions, lifecycle stages; document exclusions with justification | Approved scope statement |
| 4.4 | AI management system | Establish processes, policies, measurements for the AIMS; use PDCA iteratively | Process map or AIMS framework document |

### Clause 5 — Leadership
| Sub-clause | Title | Key Requirement | Evidence Required |
|-----------|-------|-----------------|-------------------|
| 5.1 | Leadership and commitment | Top management demonstrates leadership: integrates AIMS with business strategy, allocates resources, communicates importance, promotes continual improvement | Top management interview evidence, signed policy, management review participation |
| 5.2 | AI policy | Policy established by top management; includes commitments to fairness, effectiveness, transparency; provides framework for objectives | Signed AI policy with version control |
| 5.3 | Roles, responsibilities and authorities | Roles assigned and communicated; accountability for policy, risk, monitoring, improvement clearly documented | Roles and responsibilities document; org chart reference |

### Clause 6 — Planning
| Sub-clause | Title | Key Requirement | Evidence Required |
|-----------|-------|-----------------|-------------------|
| 6.1.1 | Risks and opportunities — general | Address risks and opportunities that affect AIMS outcomes; plan actions | Risk register; treatment plan |
| 6.1.2 | AI risk assessment | Define risk assessment process; identify, analyze, evaluate risks; record results | Documented risk assessment (process + results) |
| 6.1.3 | AI risk treatment and SoA | Select treatment options; select/exclude Annex A controls with justification; maintain SoA | SoA document (all 38 controls listed, selected/excluded, justified) |
| 6.2 | AI objectives | Objectives consistent with policy; measurable; monitored; communicated; resource-planned | Objectives register with method, target, frequency, owner, review forum |

### Clause 7 — Support
| Sub-clause | Title | Key Requirement | Evidence Required |
|-----------|-------|-----------------|-------------------|
| 7.1 | Resources | Provide resources necessary for AIMS operation | Budget allocation, staffing records |
| 7.2 | Competence | Ensure competence of roles affecting AIMS; address gaps via training or hiring | Training records, competency matrix |
| 7.3 | Awareness | Personnel aware of policy, their contribution, implications of non-conformance | Awareness programme records, induction logs |
| 7.4 | Documented information | Create, update, and control documents (current versions) and records (immutable evidence) | Document register; version history; access controls |

### Clause 8 — Operation
| Sub-clause | Title | Key Requirement | Evidence Required |
|-----------|-------|-----------------|-------------------|
| 8.1 | Operational planning and control | Plan and control processes meeting requirements; manage changes; review consequences | Operating procedures; change management records |
| 8.2 | AI system impact assessment | For each AI system: assess potential consequences on individuals, groups, society; document results | Completed impact assessments per system; process procedure |

### Clause 9 — Performance Evaluation
| Sub-clause | Title | Key Requirement | Evidence Required |
|-----------|-------|-----------------|-------------------|
| 9.1 | Monitoring and measurement | Define what, how, when, who for each measurement; analyse and evaluate results | Monitoring dashboard; measurement records; trend analysis |
| 9.2 | Internal audit | Plan and conduct objective, impartial audits at planned intervals; report findings; follow up | Audit schedule; audit reports; finding records |
| 9.3 | Management review | Top management reviews: suitability, adequacy, effectiveness; inputs and outputs documented | Management review agenda, minutes, action tracker |

### Clause 10 — Improvement
| Sub-clause | Title | Key Requirement | Evidence Required |
|-----------|-------|-----------------|-------------------|
| 10.1 | Continual improvement | Improve suitability, adequacy, effectiveness of AIMS proactively — not only through corrective action | Improvement log; management review outputs; trend reports |
| 10.2 | Nonconformity and corrective action | React to NC; evaluate cause; implement corrective action; review effectiveness; retain records | Nonconformity register; root cause analysis; corrective action tracker; effectiveness review records |

---

## Annex A — 38 Controls Quick Index (8 Domains)

| Domain | Controls | Key Focus |
|--------|----------|-----------|
| **A.1 Governance** | Policies, roles, objectives, resource management | Organizational accountability for responsible AI |
| **A.2 Internal Audit** | Internal audit of AI systems | Independent verification of AIMS controls |
| **A.3 Information for Interested Parties** | Communication to affected parties | Transparency to people affected by AI decisions |
| **A.4 AI Risk Assessment** | Systematic AI risk assessment process | Identifying and treating AI-specific risks |
| **A.5 AI System Life Cycle** | Design, development, deployment, operation, retirement | Controls across the full AI system lifecycle |
| **A.6 Transparency and Explainability** | Explainable AI outputs; documentation of decision logic | Enabling humans to understand and challenge AI decisions |
| **A.7 Data** | Data quality, provenance, fairness, security | Ensuring data used in AI is fit for purpose and lawfully obtained |
| **A.8 Third-Party** | Vendor management, supply chain transparency | Controls on externally-sourced AI components and models |

---

## Risk-to-Clause Quick Lookup (50 Sample AI Risks)

| Risk # | Risk Description | Primary Clause | Primary Control Domain |
|--------|-----------------|----------------|------------------------|
| 1 | Training data demographic bias | 6.1.2, 8.2 | A.7, A.6 |
| 2 | Incomplete datasets | 6.1.2 | A.7 |
| 3 | Outdated training data | 6.1.2, 9.1 | A.7, A.5 |
| 4 | Data labeling errors | 6.1.2 | A.7 |
| 5 | Lack of data provenance | 6.1.2, 8 | A.7 |
| 6 | Sensitive data without consent | 4.2, 6.1.2, 10.2 | A.7, A.1 |
| 7 | Unbalanced datasets / poor fairness | 6.1.2, 8.2 | A.7, A.6 |
| 8 | Data poisoning attacks | 6.1.2 | A.7, security |
| 9 | Inconsistent data formats | 6.1.2 | A.7 |
| 10 | Poor data quality | 6.1.2 | A.7 |
| 11 | Model overfitting | 6.1.2, 8 | A.5 |
| 12 | Model underfitting | 6.1.2, 8 | A.5 |
| 13 | Model drift | 9.1, 6.1.2 | A.5, A.6 |
| 14 | Concept drift | 9.1, 6.1.2 | A.5 |
| 15 | Black-box / no explainability | 5.2, 8.2, 6.2 | A.6 |
| 16 | Incorrect model assumptions | 6.1.2, 8 | A.5 |
| 17 | Improper feature selection | 6.1.2, 8 | A.5 |
| 18 | Insufficient model validation | 8, 6.1.2 | A.5 |
| 19 | Wrong algorithms for domain | 6.1.2, 8 | A.5 |
| 20 | Failure to retrain models | 9.1, 10.2 | A.5 |
| 21 | Wrong model version in production | 8.1, 10.2 | A.5 |
| 22 | No monitoring of model performance | 9.1, 6.2 | A.5 |
| 23 | Failure to detect declining accuracy | 9.1, 10.2 | A.5 |
| 24 | Poor documentation of AI lifecycle | 7.4, 8 | A.5, A.1 |
| 25 | Inadequate incident response | 10.2, 5.3 | A.1 |
| 26 | AI not integrated with IT systems | 8.1 | A.5 |
| 27 | Uncontrolled model updates | 8.1, 7.4 | A.5 |
| 28 | Insufficient change management | 8.1, 10.2 | A.5 |
| 29 | Inadequate testing before deployment | 8, 6.1.2 | A.5 |
| 30 | Lack of defined AI system ownership | 5.3, 4.3 | A.1 |
| 31 | Adversarial attacks | 6.1.2, 8 | Security |
| 32 | Model extraction via API | 6.1.2, 8 | Security |
| 33 | Model inversion attacks | 6.1.2, 8 | Security |
| 34 | Unauthorized access to AI models | 9.1, 8 | Security |
| 35 | Data leakage from training datasets | 6.1.2, 8 | A.7, Security |
| 36 | Weak API security | 8, 6.1.2 | Security |
| 37 | Malicious manipulation of AI outputs | 8, 9.1, 10.2 | Security |
| 38 | Algorithmic discrimination | 5.2, 6.1.2, 8.2 | A.6, A.7 |
| 39 | Lack of transparency | 5.2, 6.2, 8.2 | A.6 |
| 40 | Automation bias | 8.2, 8 | A.5, A.6 |
| 41 | Decisions without human oversight | 8.2, 5.2 | A.5, A.6 |
| 42 | High-risk decisions without impact assessment | 8.2, 6.1.2 | A.4, A.5 |
| 43 | AI-generated misinformation | 8.2, 6.1.2 | A.6 |
| 44 | No documented AI governance framework | 5.2, 4.3, 6.1.3 | A.1 |
| 45 | Absence of AI risk management process | 6.1.2, 6.1.3 | A.4 |
| 46 | Privacy regulation non-compliance | 4.2, 6.1.2, 10.2 | A.7 |
| 47 | No internal audit coverage for AI | 9.2 | A.2 |
| 48 | Failure to maintain documentation | 7.4, 9.2 | A.1 |
| 49 | Third-party AI with unknown data sources | 4.2, 6.1.2, 8 | A.8 |
| 50 | Vendor dependence without transparency | 4.2, 6.1.2, 8 | A.8 |

---

## Common Exam Traps — Clause Reference

| Trap | Correct Answer | Clause |
|------|----------------|--------|
| Policy established by AIMS lead, not top management | Policy must be established BY top management (drafting may be delegated; signature cannot) | 5.2 |
| SoA lists only selected controls | ALL 38 controls must appear; excluded controls must be justified | 6.1.3 |
| Department manager conducts management review | Must be conducted by TOP MANAGEMENT | 9.3 |
| Correction applied without root cause analysis | Correction fixes now; corrective action requires root cause analysis and recurrence prevention | 10.2 |
| Risk assessment done without context inputs | Risk assessment must trace to internal/external issues and interested party requirements | 4.1, 4.2, 6.1.2 |
| AI system impact assessment merged with risk assessment | These are distinct processes with different scope and purpose | 6.1.2, 8.2 |
| Scope defined before context understood | Sequence is: Context ? Interested Parties ? Scope | 4.1, 4.2, 4.3 |
| Objectives without measurement | Every objective must have a defined measurement method | 6.2 |
| Internal auditor audits own work | Auditors must be objective and impartial — no conflict of interest | 9.2 |
| Continual improvement = only corrective actions | Continual improvement is broader — includes proactive enhancement | 10.1 |
