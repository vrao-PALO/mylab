# Training Coverage Map — ISO 42001 Lead Implementer Programme

> Maps all four available transcripts (Day 1 Sessions 3&4, Day 2, Day 3, Day 5) against the slide deck structure, activities, key takeaways, and important points not to be missed in the exam.

---

## Summary Statistics

| Item | Count |
|------|-------|
| Training days transcribed | 4 (Days 1, 2, 3, 5) |
| Total activities referenced | 33+ (Activity 23 confirmed key on Day 5) |
| Clauses covered across transcripts | Clauses 4–10 |
| Annex A controls referenced | 38 in total (discussed collectively) |
| Key case studies identified | 5 real-world examples |
| Instructor | Sabyasachi Mahanti (BSI) |
| Note on Day 4 | Transcript not available; Day 5 used in its place |

---

## Day 1 — Sessions 3 & 4

**Timestamp**: 18:03–18:31  
**Participants active**: Venugopal Rao, Shilpa Gethe, Anish Melbin, Naushir Miraz, Unnikrishnan G

### Slide Sections Covered
- PDCA concept introduction and application to all processes
- Clause 4: Context of the Organization
- Clause 5: Leadership and Commitment
- Clause 5.2: AI Policy requirements

### Key Activities Discussed
- Hands-on exercise: Defining "top management" and identifying responsibility
- Discussion: Policy vs. objectives distinction
- Discussion: Integration of management system with business strategy

### Critical Teaching Points
| Point | Clause |
|-------|--------|
| PDCA must be applied in ALL organizational processes, not just central management | 4.4, 9, 10 |
| Clause 4.4 initially establishes management system at high level; refined via PDCA iteration | 4.4 |
| Top management definition: "Person or group who directs and controls at highest level" — not a title | 5.1 |
| Policy must be established BY top management — accountability cannot be delegated, only drafting | 5.2 |
| Policy must be compatible with the strategic direction of the organization | 5.2 |
| Adding an AIMS manager 4 levels below IT head = non-compliant governance structure | 5.3 |
| AI management is everyone's responsibility (same as information security) | 5.1 |
| Top management interview question: "How do you demonstrate leadership and commitment?" | 5.1 |
| Policy is a framework for objectives — not a list of controls | 5.2, 6.2 |

### Case Studies Used
1. **IT department AIMS manager**: Assigned 4 levels below IT head — cited as non-compliant structure for governance
2. **Healthcare organization**: Patient data breach = facility closure; top management must connect AIMS to strategic survival

### Exam Traps Highlighted on This Day
- Policy cannot be written before context and scope are understood
- "Top management" is not the IT manager or AIMS lead — it is whoever actually controls the organization
- Policy drafting ? policy accountability

---

## Day 2

**Timestamp**: 09:32–09:46 (and extended session)  
**Participants active**: Venugopal Rao, Shilpa Gethe, Meghna Taneja, Unnikrishnan G, Rajesh R

### Slide Sections Covered
- ISMS vs AIMS comparison and why ISMS alone is insufficient
- AI Management System lifecycle recap
- Three AIMS pillars: Effectiveness, Fairness, Transparency
- Clause 4: Context analysis frameworks (SWOT, PESTIL)
- Clause 4.2: Interested parties — relevance and depth
- Clause 6: Risk assessment design

### Key Activities Discussed
- Exercise: Differentiating AIMS objectives from ISMS objectives
- Exercise: Identifying correct interested parties in a B2B scenario
- Recap: LLM accuracy limitation and AI-specific risk

### Critical Teaching Points
| Point | Clause |
|-------|--------|
| AIMS objective: to be RESPONSIBLE and ETHICAL with respect to AI use — not just to protect information | 4, 5.2 |
| Three AIMS pillars are INTERDEPENDENT: Transparency enables Fairness; Fairness links to Effectiveness | 5.2, 6.2, Annex C |
| Fairness = fair to individuals and society, NOT fair to profitability | 5.2, 8.2 |
| Internal issues: use SWOT — scoped to Effectiveness, Fairness, Transparency | 4.1 |
| External issues: use PESTIL — scoped to same three pillars | 4.1 |
| All issues must be "relevant to the purpose of AIMS" — not all issues on Earth | 4.1 |
| In B2B AI scenarios, the ultimate interested party is the end-user impacted by AI decisions | 4.2 |
| LLMs are ~60–70% accurate today — the remainder is risk that must be addressed | 6.1.2 |
| Annex C lists 11 AI objectives — use as reference for deriving organizational AI objectives | 6.2, Annex C |

### Case Studies Used
1. **Credit score denial AI**: Wrong model decision affects applicant's access to loan, housing, education — hence the applicant (not the bank) is the priority interested party for AIMS
2. **IT firm building banking app**: SBI pays for service; SBI end-customers are the true interested parties for fairness assessment

### Exam Traps Highlighted on This Day
- Issues must be relevant to AIMS three pillars — not identified generically
- "Protecting information" is ISMS; AIMS is about responsible and ethical AI usage
- All three pillars must be considered together — they are not isolated objectives

---

## Day 3

**Timestamp**: 12:03–12:28  
**Participants active**: Venugopal Rao, Shilpa Gethe, Unnikrishnan G (others present)

### Slide Sections Covered
- Clause 9.1: Monitoring and measurement — deep dive
- Clause 10.2: Nonconformity and corrective action — deep dive
- 38 Annex A controls — measurement discussion
- Internal audit perspective from certification body standpoint

### Key Activities Discussed
- Activity: Control measurement brainstorming across 38 Annex A controls
- Activity: Nonconformity scenario analysis
- Activity: Root cause analysis (data provenance B.7.5 example)
- Activity: Distinguishing correction from corrective action with worked examples

### Critical Teaching Points
| Point | Clause |
|-------|--------|
| Monitoring costs more than implementing the control — every measurement has direct and opportunity cost | 9.1 |
| Measurements must link to business objectives — not theoretical targets | 9.1, 6.2 |
| "Zero incidents per month" is NOT a valid objective — creates incentive to under-report | 6.2 |
| 38 Annex A controls — each may require a distinct measurement; some are straightforward, others require business context | 9.1, Annex A |
| Understand what value the management system adds — if management cannot articulate this, the system will be abandoned | 5.1, 9.3 |
| Nonconformity sources: ISO standard / Legal / Customer / Internal Objectives — four distinct types | 10.2 |
| Correction = immediate fix (no root cause required) | 10.2 |
| Corrective action = root cause analysis + prevention of recurrence | 10.2 |
| Correction without corrective action = recurrence of the same nonconformity — which is itself a finding | 10.2 |
| Continual improvement is broader than corrective action — includes proactive enhancement | 10.1 |
| Auditors welcome nonconformities — zero findings is suspicious, not evidence of excellence | 9.2 |

### Case Studies Used
1. **Investment banking research facility**: 50 authorized researchers; 250 people had access; nobody had set a measurement for this — key audit finding
2. **IBM 500-crore healthcare account**: After 6 years, client asked "what value did you add?" Revenue alone was insufficient — management system must demonstrate business value
3. **Small HR startup**: Got ISO 9001 certified; did not renew after 13 months — management system not visibly adding value; organizations abandon systems that feel like burdens

### Exam Traps Highlighted on This Day
- Applying only a correction without root cause analysis is a nonconformity finding in itself
- Measuring controls for the sake of compliance (not linked to business value) is unsustainable
- Zero nonconformities over time ? excellent management system; it may indicate poor monitoring

---

## Day 5 (Cited as Day 4 — Transcript Substitution)

**Timestamp**: 12:00–12:14  
**Participants active**: Venugopal Rao, Praneya Lalwani, Rajesh R, Anish Melbin, Unnikrishnan G

### Slide Sections Covered
- Activity 23: AI System Impact Assessment — highlighted as heart of management system
- Clause 9 and 10: Final coverage with remaining activities
- Common implementation challenges
- Problem solving approaches
- Exam preparation: 20-question bank review
- Exam protocol and proctoring rules

### Key Activities
| Activity | Description | Key Learning |
|----------|-------------|--------------|
| Activity 23 | AI System Impact Assessment full walkthrough | Impact assessment is distinct from risk assessment; it is the heart of the management system |
| Clauses 9–10 activities | Remaining clause coverage | Connects monitoring to nonconformity to improvement as a continuous loop |
| 20-question bank | Specimen exam questions | Exam practice under realistic conditions |

### Critical Teaching Points
| Point | Clause |
|-------|--------|
| AI system impact assessment = "heart of the management system" and direct input to risk assessment | 8.2, 6.1.2 |
| Impact assessment: consequences of a specific AI system on INDIVIDUALS and SOCIETY | 8.2 |
| Risk assessment: organizational risks affecting AIMS outcomes | 6.1.2 |
| Total programme includes 33+ activities — not all could be covered in the 5 days equally | — |
| Exam uses AI-based proctoring: isolated room, blank background, no mouth movement, no extra windows | Exam protocol |
| Adding annotations to MIMEOI PDF is permitted during exam — original is preserved | Exam protocol |
| 30-day exam window starts from receipt of exam link (link typically sent after training by UK office) | Exam protocol |
| ISO 42003 (guidance standard) available from BIS website at lower India-tier pricing | Reference |

### Exam Traps Highlighted on This Day
- Confusing impact assessment with risk assessment — these are separate, distinct processes
- Impact assessment is an OPERATIONAL activity — not only done once during planning
- Exam room must be physically isolated (not conference room, not glass-door office)

---

## Activities-to-Clauses Map (All Referenced Activities)

| Activity | Description | Clause(s) |
|----------|-------------|-----------|
| Activity 1 | Identifying AI systems in scope | 4.3, 4.4 |
| Activity 2 | Context analysis (SWOT/PESTIL) | 4.1 |
| Activity 3 | Interested parties (needs vs expectations) | 4.2 |
| Activity 4 | Writing and reviewing AIMS scope statement | 4.3 |
| Activity 5 | Leadership commitment evidence exercise | 5.1, 5.2 |
| Activity 6 | Policy drafting exercise | 5.2 |
| Activity 7 | Roles and responsibilities exercise | 5.3 |
| Activity 8 | Flashcards (WHITE and YELLOW versions) | All clauses |
| Activity 9 | Risk assessment process definition | 6.1.2 |
| Activity 10 | Risk identification (using SWOT/PESTIL outputs) | 6.1.2 |
| Activity 11 | Risk evaluation using criteria | 6.1.2 |
| Activity 12 | Statement of Applicability (SoA) exercise | 6.1.3 |
| Activity 13 | AI objectives setting exercise | 6.2 |
| Activity 14 | Support planning (resources, competence) | 7.1, 7.2 |
| Activity 15 | Communications plan exercise | 7.3, 7.4 |
| Activity 16 | Documented information control exercise | 7.4 |
| Activity 17 | Operational control walkthrough | 8.1 |
| Activity 18 | AI development process review | 8 |
| Activity 19 | Change management for AI systems | 8.1 |
| Activity 20 | Data management controls | 8, Annex A (A.7) |
| Activity 21 | Data provenance process | 8, Annex A (A.7) |
| Activity 22 | Monitoring and measurement design | 9.1 |
| Activity 23 | **AI System Impact Assessment** *(highlighted as critical — Day 5)* | 8.2, 6.1.2 |
| Activity 24 | Management review process | 9.3 |
| Activity 25 | Internal audit exercise | 9.2 |
| Activity 26 | Nonconformity identification exercise | 10.2 |
| Activity 27 | Root cause analysis exercise | 10.2 |
| Activity 28 | Corrective action planning | 10.2 |
| Activity 29 | Effectiveness review | 10.2 |
| Activity 30+ | Problem-solving and exam preparation | All |

---

## Gap Analysis — What Was NOT Covered in Transcripts

| Gap | Impact | Mitigation |
|-----|--------|------------|
| Day 4 transcript not available | Risk of missing specific teaching points not captured elsewhere | Day 5 content was mostly cross-cutting and exam prep; Day 3 covers the substantive remaining clauses |
| Complete list of all 33 activity outputs | Cannot confirm all activities were completed | Reference activity documents in docs/documents/ folder (Activity 3.docx, Activity 6.docx, Activity 8 flashcards) |
| Slide deck page-by-page reading (01 Slides PDF image-based) | Cannot verify exact learning objectives per slide | Inferred from transcripts and cross-referenced with existing study notes |
| 4k.pdf (ISO 42001 standard) text not extractable | Cannot quote exact normative clause text | Reference own copy of ISO 42001:2023; use this guide for key requirements |
| Day 1 Sessions 1 & 2 transcript not reviewed | May have missed initial context-setting content | Day1_Session 2.docx available in Transcript folder — review separately |

---

## How These Documents Improve Preparation

1. **Transcript analysis** confirms which clauses the trainer emphasized most (5, 9, 10, 8.2) — these are high-probability exam areas.
2. **Case studies** from transcripts are directly usable in scenario-based exam answers.
3. **50 Sample AI Risks** mapped to clauses means any exam question referencing a risk scenario can be answered with both risk identification and clause response.
4. **Updated stories** give an implementer view that maps directly to third-party audit expectations.
5. **Clause reference guide** reduces lookup time — given a scenario in the exam, you can trace it to the correct clause within 30 seconds.

## How to Use These Documents for Future Implementations

1. **Use the stories as a project plan** — each story is a discrete deliverable; stories can be converted to project tasks or sprints.
2. **Use the risk-to-clause table** when conducting a gap assessment for a new client — map client's known AI risks to the relevant controls immediately.
3. **Use this training map** as a briefing preparation guide when bringing new implementation team members up to speed.
4. **Use the case studies** to anchor implementation activities to business impact — helps secure top management buy-in.
5. **Leverage the 50 risks document** as a risk identification starter set for any AIMS risk assessment — reduces workshop time significantly.
