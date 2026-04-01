"use client";
import Link from "next/link";
import { useState } from "react";
import { useFormPersistence } from "@/lib/use-form-persistence";
import type { RequirementIntake } from "@/types/domain";
import { stories } from "@/lib/knowledge-base";
import { frameworksByIndustry, frameworkPacks } from "@/lib/data/frameworks";

const story = stories.find((s) => s.id === "story-01")!;

const ENGAGEMENT_TYPES = ["RFP", "RFQ", "Assessment", "Internal Audit", "Advisory"] as const;
const INDUSTRIES = ["FI", "GovTech", "Education", "Real Estate", "Generic"] as const;

const FRAMEWORK_HINTS: Record<string, string> = {
  FI: "MAS TRM + ISO 27001 + OWASP ASVS + NIST 800-53 + CIS Controls",
  GovTech: "ISO 27001 + PDPA + OWASP ASVS + NIST 800-53 + MTCS Tier 3",
  Education: "PDPA + OWASP ASVS + OWASP MASVS + CIS Controls",
  "Real Estate": "PDPA + ISO 27001 + CIS Controls",
  Generic: "ISO 27001 + PDPA + OWASP ASVS + NIST 800-53 + CIS Controls",
};

// ── Action plan steps per engagement type ────────────────────────────────────

interface ActionStep {
  number: number;
  title: string;
  why: string;
  whatToPrepare: string[];
  route: string;
  linkLabel: string;
  keyEvidence?: string;
}

function getActionPlan(engagementType: string, industry: string): ActionStep[] {
  const isAudit = engagementType === "Internal Audit";
  const isRFP = engagementType === "RFP" || engagementType === "RFQ";
  const isFI = industry === "FI";
  const isGovTech = industry === "GovTech";

  if (isAudit) {
    return [
      {
        number: 1,
        title: "Define the audit scope",
        why: "An auditor must clearly state what systems, environments, data, and user roles are in scope — and what is explicitly excluded. Without this, audit findings have no boundaries and management cannot act on them.",
        whatToPrepare: [
          "List all systems and applications to be audited",
          "Identify which environments are in scope (dev / test / prod)",
          "Document data types handled (PII, financial, audit logs, etc.)",
          "List all user roles and their access levels",
          "Explicitly state what is out of scope and why",
        ],
        route: "/scope",
        linkLabel: "Define scope →",
        keyEvidence: "Scope statement signed by audit sponsor",
      },
      {
        number: 2,
        title: "Identify data flows and integrations",
        why: "Auditors need to know where sensitive data moves — which systems send it, which receive it, and over what protocols. Untracked data flows are a common audit finding.",
        whatToPrepare: [
          "Catalogue all inbound and outbound data flows",
          "Classify each data element (INTERNAL / CONFIDENTIAL / FINANCIAL / AUDIT / PII)",
          "Identify all third-party integrations and API connections",
          "Flag any AI components that process personal data",
          "Confirm encryption in transit and at rest for each flow",
        ],
        route: "/inputs",
        linkLabel: "Catalogue data inputs →",
        keyEvidence: "Data flow diagram and data classification register",
      },
      {
        number: 3,
        title: "Map controls to compliance frameworks",
        why: "Internal audit assesses whether your controls cover what the relevant frameworks require. Gaps between requirements and implemented controls are the core audit output.",
        whatToPrepare: [
          isFI ? "Map every control gap to MAS TRM or ISO 27001 clause" : "Map every control gap to ISO 27001, PDPA, and NIST 800-53",
          "Identify which controls are implemented, partially met, or missing",
          "Document evidence of implementation for each claimed control",
          "Flag any controls with expired evidence or untested status",
          isGovTech ? "Check IM8 and GovZTA baseline controls" : "Check OWASP ASVS for any internet-facing applications",
        ],
        route: "/control-mapping",
        linkLabel: "Map controls →",
        keyEvidence: "Control mapping matrix with gap analysis",
      },
      {
        number: 4,
        title: "Assess risks and record exceptions",
        why: "Every unmitigated gap becomes a risk finding. Audit readiness requires each finding to have a severity, an owner, a remediation plan or accepted exception, and a target date.",
        whatToPrepare: [
          "Rate each gap: Critical / High / Medium / Low",
          "Assign a named owner to every open risk",
          "Determine: remediate, mitigate, accept, or transfer",
          "For accepted risks: prepare a formal exception record with justification and expiry",
          "Identify which risks would block a go-live or regulatory submission",
        ],
        route: "/risk-exceptions",
        linkLabel: "Build risk register →",
        keyEvidence: "Risk register with severity, owner, status, and exception records",
      },
      {
        number: 5,
        title: "Complete the architecture review checklist",
        why: "Auditors check whether the technical architecture follows secure design principles — least privilege, segmentation, auditability, and defence in depth. The checklist produces structured findings.",
        whatToPrepare: [
          "Walk through the 7-stage architecture review checklist",
          "Evidence each control: pass, finding, or N/A",
          "Verify audit logging is active and tamper-evident",
          "Confirm access controls are enforced server-side (not just UI-level)",
          "Check CI/CD pipeline controls — branch protection, SAST, secret scanning",
        ],
        route: "/checklists",
        linkLabel: "Run architecture review →",
        keyEvidence: "Completed checklist with pass/finding status per control",
      },
      {
        number: 6,
        title: "Collect and organise audit evidence",
        why: "An audit without evidence is an opinion. Each control claim needs an artefact — a screenshot, log extract, policy document, or test result — tied to it.",
        whatToPrepare: [
          "Collect policy documents (access control policy, retention policy, incident response plan)",
          "Export log samples showing audit events (auth, access, privilege changes)",
          "Gather last VAPT report and evidence of finding remediation",
          "Compile last DR test report with RTO/RPO results",
          "Save MFA enforcement screenshots and RBAC configuration exports",
        ],
        route: "/audit-evidence",
        linkLabel: "Track audit evidence →",
        keyEvidence: "Evidence pack mapped to each control and risk finding",
      },
      {
        number: 7,
        title: "Produce plain-English summary for management",
        why: "Management and the audit committee need a clear, jargon-free summary of what was found, what risk it represents, and what decision they need to make. This is what turns an audit into action.",
        whatToPrepare: [
          "Summarise findings in business terms — no acronyms without explanation",
          "State the business impact of each Critical and High finding",
          "Show a simple chart: controls passed / findings / exceptions",
          "Present the remediation roadmap with owners, costs, and deadlines",
          "Identify the go / no-go decision for any planned production deployment",
        ],
        route: "/plain-english",
        linkLabel: "Generate plain-English brief →",
        keyEvidence: "Management summary signed off by audit sponsor",
      },
    ];
  }

  if (isRFP) {
    return [
      { number: 1, title: "Define scope of solution", why: "RFP/RFQ responses must clearly boundary what you are proposing. Ambiguous scope leads to scope creep, cost blowouts, and failed sign-off.", whatToPrepare: ["List systems and components in your proposal", "State what is out of scope", "Define assumptions"], route: "/scope", linkLabel: "Define scope →" },
      { number: 2, title: "Identify data and integration points", why: "Security assessors and clients will ask exactly which data flows between which systems. Document this before the response.", whatToPrepare: ["List all data exchanged", "Identify third-party integrations", "Classify data sensitivity"], route: "/inputs", linkLabel: "Catalogue inputs →" },
      { number: 3, title: "Map solution to framework controls", why: "Most RFPs require a control mapping table. MAS TRM, ISO 27001, or PDPA compliance must be demonstrated, not claimed.", whatToPrepare: ["Map each RFP security requirement to a framework clause", "Identify gaps and how you will address them"], route: "/control-mapping", linkLabel: "Map controls →" },
      { number: 4, title: "Prepare risk and exception disclosures", why: "Clients expect honest disclosure of residual risks and how they are managed. Hiding risks is a disqualifier.", whatToPrepare: ["List known residual risks", "Prepare exception justifications", "Define remediation timelines"], route: "/risk-exceptions", linkLabel: "Build risk register →" },
      { number: 5, title: "Run presales security briefing", why: "Before the bid submission, run through the presales guide to ensure your bid answers the questions clients always ask.", whatToPrepare: ["Review FI or GovTech industry overlay", "Prepare discovery questions for client meeting", "Check red flag list"], route: isFI ? "/industry/fi" : isGovTech ? "/industry/govtech" : "/industry/generic", linkLabel: "Open presales guide →" },
    ];
  }

  // Assessment / Advisory
  return [
    { number: 1, title: "Define assessment scope", why: "Without a clear scope, assessment findings are not actionable. Define system boundaries, environments, and data domains first.", whatToPrepare: ["List all in-scope systems", "State environments (dev/test/prod)", "Define data domains and user roles"], route: "/scope", linkLabel: "Define scope →" },
    { number: 2, title: "Catalogue data and integrations", why: "Data flows are the highest-risk attack surface. Map them before reviewing controls.", whatToPrepare: ["List all data flows and classify them", "Identify third-party integrations", "Flag AI or high-risk components"], route: "/inputs", linkLabel: "Catalogue inputs →" },
    { number: 3, title: "Map to relevant frameworks", why: "Control mapping shows where the organisation stands against the frameworks relevant to their industry and regulatory obligations.", whatToPrepare: ["Identify applicable frameworks", "Map each control: implemented / partial / gap", "Document evidence for each claimed control"], route: "/control-mapping", linkLabel: "Map controls →" },
    { number: 4, title: "Identify and rate risks", why: "Gaps without a severity and owner are useless. Rate and assign every finding.", whatToPrepare: ["Rate each gap Critical/High/Medium/Low", "Assign owners", "Define remediation plan or exception"], route: "/risk-exceptions", linkLabel: "Build risk register →" },
    { number: 5, title: "Complete architecture review", why: "Walk through the structured 7-stage checklist to validate the technical design against secure architecture principles.", whatToPrepare: ["Access architecture diagrams", "Confirm observability / logging stack", "Verify access control design"], route: "/checklists", linkLabel: "Run checklist →" },
    { number: 6, title: "Communicate findings clearly", why: "Translate findings into language that business owners and senior management can act on.", whatToPrepare: ["Prepare plain-English summary per stakeholder audience", "Map findings to business risk impact"], route: "/plain-english", linkLabel: "Generate plain-English brief →" },
  ];
}

const SEV_COLORS = ["bg-[#1f4f97]", "bg-[#2a6ab8]", "bg-[#3278c8]", "bg-[#4088d8]", "bg-[#4e98e0]", "bg-[#5aa8e8]", "bg-[#4e98e0]"];

export default function IntakePage() {
  const [form, setForm] = useFormPersistence<RequirementIntake>("intake-form", {
    engagementType: "" as RequirementIntake["engagementType"],
    industry: "" as RequirementIntake["industry"],
    businessObjective: "",
    expectedOutcome: "",
    successCriteria: "",
    constraints: "",
    timeline: "",
  });
  const { engagementType, industry, constraints, timeline } = form;
  const objective = form.businessObjective;
  const outcome = form.expectedOutcome;
  const success = form.successCriteria;
  const setEngagementType = (v: string) => setForm({ ...form, engagementType: v as RequirementIntake["engagementType"] });
  const setIndustry = (v: string) => setForm({ ...form, industry: v as RequirementIntake["industry"] });
  const setObjective = (v: string) => setForm({ ...form, businessObjective: v });
  const setOutcome = (v: string) => setForm({ ...form, expectedOutcome: v });
  const setSuccess = (v: string) => setForm({ ...form, successCriteria: v });
  const setConstraints = (v: string) => setForm({ ...form, constraints: v });
  const setTimeline = (v: string) => setForm({ ...form, timeline: v });
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const complete =
    engagementType && industry && objective.length >= 10 && outcome.length >= 10 && success.length >= 10 && constraints && timeline;

  const applicableFrameworks = industry ? (frameworksByIndustry[industry] ?? []) : [];
  const actionPlan = complete ? getActionPlan(engagementType, industry) : [];

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">01 Capture Engagement Requirement</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          {complete && (
            <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              ✓ Ready — see your action plan below
            </span>
          )}
        </div>
      </header>

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Engagement context</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Engagement type *</label>
              <select value={engagementType} onChange={(e) => setEngagementType(e.target.value)}
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                <option value="">Select type…</option>
                {ENGAGEMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Industry sector *</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]">
                <option value="">Select sector…</option>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Timeline / deadline *</label>
              <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. Go-live June 30, 2026"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Known constraints *</label>
              <input type="text" value={constraints} onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. No downtime, limited budget, legacy systems"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97]" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Business objectives</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Business objective * <span className="text-[#8fa3c2]">(min 10 chars)</span></label>
              <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={3}
                placeholder="What is the system and what business problem does it solve?"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Expected outcome * <span className="text-[#8fa3c2]">(min 10 chars)</span></label>
              <textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} rows={2}
                placeholder="What does successful delivery look like?"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#3a5480] mb-1">Success criteria * <span className="text-[#8fa3c2]">(min 10 chars)</span></label>
              <textarea value={success} onChange={(e) => setSuccess(e.target.value)} rows={2}
                placeholder="How will we know the engagement succeeded?"
                className="w-full rounded-md border border-[#c9d5e6] bg-[#f8fbff] px-3 py-2 text-sm text-[#1e3d6c] placeholder:text-[#8fa3c2] focus:outline-none focus:ring-2 focus:ring-[#1f4f97] resize-none" />
            </div>
          </div>
        </article>
      </div>

      {/* ── Framework overlay ─────────────────────────────────────────────── */}
      {industry && (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">
            Compliance frameworks for {industry}
          </h3>
          <p className="mb-3 text-xs text-[#33496f]"><strong>Applicable stack:</strong> {FRAMEWORK_HINTS[industry]}</p>
          <div className="flex flex-wrap gap-2">
            {applicableFrameworks.map((fwId) => {
              const fw = frameworkPacks.find((f) => f.id === fwId);
              return fw ? (
                <span key={fwId} className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-3 py-1 text-xs font-medium text-[#1e3d6c]">
                  {fw.shortName}
                </span>
              ) : null;
            })}
          </div>
        </article>
      )}

      {/* ── ACTION PLAN — appears once form is complete ───────────────────── */}
      {complete && actionPlan.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-[#1f4f97] bg-[#edf3fc] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#1f4f97] px-3 py-1 text-xs font-bold text-white">YOUR ACTION PLAN</div>
              <p className="text-sm font-semibold text-[#10203d]">
                {engagementType} — {industry} — {timeline}
              </p>
            </div>
            <p className="mt-2 text-xs text-[#2a4a80]">
              {engagementType === "Internal Audit"
                ? "Based on your inputs, here is the step-by-step path to assess and demonstrate audit readiness. Work through each step in order — each one produces evidence that feeds into the next."
                : "Based on your inputs, here is the recommended path to complete this engagement. Work through each step in order."}
            </p>
            <p className="mt-1 text-xs text-[#2a4a80]">
              <strong>Objective:</strong> {objective} &nbsp;|&nbsp; <strong>Outcome:</strong> {outcome}
            </p>
          </div>

          <div className="space-y-3">
            {actionPlan.map((step, idx) => {
              const isOpen = expandedStep === step.number;
              return (
                <article key={step.number} className="rounded-xl border border-[#c9d5e6] bg-white overflow-hidden">
                  <button
                    onClick={() => setExpandedStep(isOpen ? null : step.number)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#f8fbff] transition-colors"
                  >
                    <div className={`shrink-0 rounded-full ${SEV_COLORS[idx] ?? "bg-[#1f4f97]"} w-8 h-8 flex items-center justify-center text-white text-sm font-bold`}>
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#10203d]">{step.title}</p>
                      <p className="text-xs text-[#6a8ab0]">{step.whatToPrepare.length} preparation items · tap to expand</p>
                    </div>
                    <Link
                      href={step.route}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 rounded-md bg-[#1f4f97] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#183d7a] transition-colors"
                    >
                      {step.linkLabel}
                    </Link>
                    <span className="text-[#6a8ab0] text-sm shrink-0 ml-1">{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#e4eaf4] p-4 space-y-3">
                      <div className="rounded-md bg-[#edf3fc] border border-[#c9d5e6] p-3">
                        <p className="text-xs font-semibold text-[#2a4a80] mb-1">Why this step matters</p>
                        <p className="text-sm text-[#273f67]">{step.why}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#3a5480] mb-2">What to prepare</p>
                        <ul className="space-y-1">
                          {step.whatToPrepare.map((item, i) => (
                            <li key={i} className="flex gap-2 text-sm text-[#273f67]">
                              <span className="text-[#1f4f97] font-bold shrink-0">→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {step.keyEvidence && (
                        <div className="rounded-md bg-green-50 border border-green-200 p-3">
                          <p className="text-xs font-semibold text-green-700 mb-0.5">Key evidence to produce</p>
                          <p className="text-sm text-green-900">{step.keyEvidence}</p>
                        </div>
                      )}
                      <Link href={step.route}
                        className="inline-flex items-center rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183d7a] transition-colors">
                        Start: {step.title} →
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-700 mb-1">Tip: work through the steps in order</p>
            <p className="text-xs text-amber-800">Each step produces evidence and output that feeds into the next. Start at Step 1 (Scope) and do not jump to the risk register or architecture review before the scope and data catalogue are complete — otherwise your findings will have no boundary.</p>
          </div>
        </div>
      )}

      {/* ── Prompt to complete form ───────────────────────────────────────── */}
      {!complete && (
        <article className="rounded-xl border border-dashed border-[#c9d5e6] bg-[#f8fbff] p-5 text-center">
          <p className="text-sm font-semibold text-[#3a5480]">Complete the form above to generate your step-by-step action plan</p>
          <p className="mt-1 text-xs text-[#6a8ab0]">Once all fields are filled, a personalised plan tailored to your engagement type and industry will appear here.</p>
        </article>
      )}
    </section>
  );
}