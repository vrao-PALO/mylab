"use client";
import { useState } from "react";
import { stories } from "@/lib/knowledge-base";

const story = stories.find((s) => s.id === "story-06")!;

type Industry = "All" | "FI" | "GovTech" | "Generic";

interface CheckItem {
  id: string;
  text: string;
  industries: Industry[];
  pitfall?: string;
  evidence?: string;
}

interface Stage {
  id: string;
  step: number;
  title: string;
  description: string;
  tasks: CheckItem[];
  questions: string[];
  assurance: string[];
}

const STAGES: Stage[] = [
  {
    id: "s1", step: 1, title: "Intake and Context Gathering",
    description: "Understand the system, business context, stakeholders, data handled, and regulatory obligations before any controls are defined.",
    tasks: [
      { id: "s1-t1", text: "Record engagement type (RFP, RFQ, assessment, audit, advisory)", industries: ["All"] },
      { id: "s1-t2", text: "Identify industry sector and applicable framework overlay (FI → MAS TRM; GovTech → IM8/PDPA; Generic → OWASP+CIS)", industries: ["All"] },
      { id: "s1-t3", text: "Capture key intake questions: What is the system? Who uses it? What data does it handle? Is it internet-facing?", industries: ["All"] },
      { id: "s1-t4", text: "Identify business criticality, go-live timeline, and known constraints", industries: ["All"] },
      { id: "s1-t5", text: "Confirm MAS-regulated status and whether MAS TRM supervisory obligations apply", industries: ["FI"] },
      { id: "s1-t6", text: "Confirm citizen data handling and GovTech/IM8 obligations", industries: ["GovTech"] },
    ],
    questions: ["What is the business purpose of the system?", "Who are the users and what do they access?", "What data does this system collect, process, and store?", "What are the go-live timeline and key milestones?"],
    assurance: ["Intake document stored and dated", "Framework overlay confirmed in writing"],
  },
  {
    id: "s2", step: 2, title: "Identify Trust Boundaries and High-Risk Components",
    description: "Map where trust changes — internet to app, app to data, app to third party — and flag components that warrant deeper scrutiny.",
    tasks: [
      { id: "s2-t1", text: "Draw or review system architecture and data flow diagram", industries: ["All"] },
      { id: "s2-t2", text: "Identify all trust boundaries: external to internal, user to admin, app to data store", industries: ["All"] },
      { id: "s2-t3", text: "Flag internet-facing entry points (APIs, portals, webhooks)", industries: ["All"] },
      { id: "s2-t4", text: "Identify third-party integrations and their data sensitivity exposure", industries: ["All"] },
      { id: "s2-t5", text: "Confirm production is isolated from dev/test with no direct access path", industries: ["All"], pitfall: "Shared credentials or network paths between prod and non-prod is a critical finding." },
      { id: "s2-t6", text: "Identify privileged operations: admin paths, config management, deployment pipelines", industries: ["All"] },
      { id: "s2-t7", text: "Flag card/account data flows and fraud-sensitive workflows", industries: ["FI"], evidence: "Data flow diagram with PCI scope boundary marked" },
    ],
    questions: ["Where does trust change in this system?", "What happens if one external API is compromised?", "Is production reachable from non-production?", "Where do privileged actions happen?"],
    assurance: ["Architecture diagram reviewed and current", "Trust boundary list documented", "Prod/non-prod isolation confirmed"],
  },
  {
    id: "s3", step: 3, title: "Derive Security Requirements",
    description: "Translate business context, data sensitivity, and threat exposure into concrete, testable security requirements before any design is locked.",
    tasks: [
      { id: "s3-t1", text: "Apply the requirement derivation chain: business function → sensitive data → threat exposure → security requirement → design control → how to verify → residual risk", industries: ["All"] },
      { id: "s3-t2", text: "Classify all data types and map to protection obligations", industries: ["All"] },
      { id: "s3-t3", text: "Define authentication and authorisation requirements per user role and data tier", industries: ["All"] },
      { id: "s3-t4", text: "Define logging and monitoring requirements — which events, what detail, retention period", industries: ["All"] },
      { id: "s3-t5", text: "Define VAPT scope and depth (web, API, mobile, cloud, infrastructure)", industries: ["All"] },
      { id: "s3-t6", text: "Add MAS TRM-specific requirements: SDLC evidence, source code review, privileged access controls", industries: ["FI"], evidence: "Requirements document linked to MAS TRM clauses" },
    ],
    questions: ["What are the most sensitive data flows?", "What is the minimum access any user role needs?", "Which events must be logged for forensic and compliance purposes?", "What is the scope and depth of assurance testing required?"],
    assurance: ["Requirements document produced", "Framework clause traceability confirmed", "Requirements signed off by engagement lead"],
  },
  {
    id: "s4", step: 4, title: "Review Design Controls",
    description: "Assess whether the proposed or existing design implements controls that match the requirements — and identify gaps before build or deployment.",
    tasks: [
      { id: "s4-t1", text: "Verify: where is the sensitive data and who can access it?", industries: ["All"], pitfall: "Teams often assume access is restricted but have not verified it technically." },
      { id: "s4-t2", text: "Verify: how is access validated — server-side, not client-side only?", industries: ["All"] },
      { id: "s4-t3", text: "Verify: can one user access another user's data (object-level authorization)?", industries: ["All"], pitfall: "IDOR vulnerabilities are consistently in OWASP Top 10 and commonly missed in design review." },
      { id: "s4-t4", text: "Verify: are admin and user functions clearly separated at the API and UI level?", industries: ["All"] },
      { id: "s4-t5", text: "Verify: what is logged — are sensitive data values excluded from log payloads?", industries: ["All"], pitfall: "Logging PII, tokens, or card data is a frequent finding discovered in VAPT, not design review." },
      { id: "s4-t6", text: "Verify: how are external vendors and support users controlled?", industries: ["All"] },
      { id: "s4-t7", text: "Verify: what happens if one security layer fails — is there a fallback?", industries: ["All"] },
      { id: "s4-t8", text: "Verify: Managed Identity scoped per service, no shared identities, Key Vault used for secrets", industries: ["FI", "GovTech"], evidence: "Managed Identity config review, Key Vault policy evidence" },
    ],
    questions: ["Where is the sensitive data?", "Who can access it and how is that validated?", "Can one user access another user's data?", "Are admin and user paths clearly separated?", "What is logged, and does it avoid capturing sensitive values?"],
    assurance: ["Design control review completed and documented", "Gaps listed with severity and owner", "Open gaps tracked to resolution before go-live"],
  },
  {
    id: "s5", step: 5, title: "Assurance Activities",
    description: "Define and execute the testing and review activities needed to verify that controls work in practice, not just in documentation.",
    tasks: [
      { id: "s5-t1", text: "Threat modelling completed for the system architecture (STRIDE or equivalent)", industries: ["All"] },
      { id: "s5-t2", text: "SAST / SCA scans integrated into CI/CD and baseline established", industries: ["All"] },
      { id: "s5-t3", text: "VAPT scoped and executed — web, API, mobile (if applicable), cloud config", industries: ["All"] },
      { id: "s5-t4", text: "VAPT findings triaged: Critical and High findings remediated and retested before go-live", industries: ["All"], pitfall: "Open critical/high findings at go-live is a production blocker — MAS TRM is explicit on this." },
      { id: "s5-t5", text: "Access review completed: confirm no orphaned accounts, no over-privileged roles", industries: ["All"] },
      { id: "s5-t6", text: "Logging validation: confirm security events captured with correct detail and retention", industries: ["All"] },
      { id: "s5-t7", text: "Conduct formal source code review (manual or tool-assisted) — required for MAS TRM", industries: ["FI"], evidence: "Source code review report, signed by reviewer" },
    ],
    questions: ["Has threat modelling been done and documented?", "Are SAST/SCA scans passing in CI/CD?", "Have all VAPT critical/high findings been remediated and retested?", "Have logs been reviewed and validated?"],
    assurance: ["Threat model documented", "VAPT report produced and remediation tracked", "SAST/SCA baseline in CI/CD", "Logging validation record produced", "Access review completed"],
  },
  {
    id: "s6", step: 6, title: "Gap Identification and Recommendations",
    description: "Consolidate all findings from design review and assurance activities into a clear gap-and-recommendation record with severity and owners.",
    tasks: [
      { id: "s6-t1", text: "Compile all open design gaps with severity (Critical → Low) and assigned owner", industries: ["All"] },
      { id: "s6-t2", text: "Separate go-live blockers from post-go-live items", industries: ["All"] },
      { id: "s6-t3", text: "For each gap: define the recommended remediation, target date, and verification method", industries: ["All"] },
      { id: "s6-t4", text: "Where gaps cannot be immediately remediated: document formal risk acceptance with compensating controls, expiry, and approver", industries: ["All"] },
      { id: "s6-t5", text: "Produce management summary: top risks, go-live readiness status, decisions required", industries: ["All"] },
    ],
    questions: ["Which findings block go-live?", "Who owns each remediation?", "What compensating controls are in place for accepted risks?", "Has the risk owner formally signed off?"],
    assurance: ["Gap register produced and shared", "Go-live readiness decision made", "Risk acceptance records signed"],
  },
  {
    id: "s7", step: 7, title: "Outcome Documentation and Closure",
    description: "Produce the final artefacts needed to close the engagement, support audit traceability, and meet regulatory evidence requirements.",
    tasks: [
      { id: "s7-t1", text: "Architecture review record produced: input, findings, decisions, sign-off", industries: ["All"] },
      { id: "s7-t2", text: "Risk register finalised with all items in final status (Closed, Accepted, or Deferred)", industries: ["All"] },
      { id: "s7-t3", text: "VAPT closure: remediation tracker updated, retest results linked, report finalised", industries: ["All"] },
      { id: "s7-t4", text: "Evidence pack assembled: all audit-ready artefacts linked and named", industries: ["All"] },
      { id: "s7-t5", text: "Go-live sign-off obtained from security architect and engagement lead", industries: ["All"] },
      { id: "s7-t6", text: "Residual risks formally accepted and recorded with named approver and review date", industries: ["All"] },
      { id: "s7-t7", text: "MAS TRM closure documentation prepared for FI client record", industries: ["FI"], evidence: "All MAS TRM-required evidence linked with clause references" },
    ],
    questions: ["Is the review record complete and dated?", "Are all residual risks formally accepted?", "Is the evidence pack navigable for an auditor?", "Has sign-off been obtained in writing?"],
    assurance: ["Architecture review record finalised", "Risk register closed", "Evidence pack assembled", "Go-live sign-off recorded"],
  },
];

export default function ChecklistsPage() {
  const [industry, setIndustry] = useState<Industry>("All");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>("s1");

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleStage = (id: string) => setExpanded(expanded === id ? null : id);

  const visibleItems = (items: CheckItem[]) =>
    items.filter((i) => industry === "All" || i.industries.includes("All") || i.industries.includes(industry));

  const totalItems = STAGES.flatMap((s) => visibleItems(s.tasks)).length;
  const completedItems = STAGES.flatMap((s) => visibleItems(s.tasks)).filter((i) => checked[i.id]).length;
  const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">06 Expand Stage Guided Checklists</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#edf3fc] px-3 py-1 text-xs font-semibold text-[#1f4f97]">
            {completedItems}/{totalItems} ({progressPct}%)
          </span>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-[#e1e8f3] overflow-hidden">
          <div className="h-full rounded-full bg-[#1f4f97] transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="mt-3 flex gap-2">
          {(["All", "FI", "GovTech", "Generic"] as Industry[]).map((ind) => (
            <button key={ind} onClick={() => setIndustry(ind)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${industry === ind ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
            >{ind}</button>
          ))}
        </div>
      </header>

      {STAGES.map((stage) => {
        const items = visibleItems(stage.tasks);
        const stageComplete = items.length > 0 && items.every((i) => checked[i.id]);
        const stageCount = items.filter((i) => checked[i.id]).length;
        return (
          <article key={stage.id} className={`rounded-xl border bg-white ${stageComplete ? "border-green-300" : "border-[#c9d5e6]"}`}>
            <button
              onClick={() => toggleStage(stage.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${stageComplete ? "bg-green-100 text-green-700" : "bg-[#edf3fc] text-[#1f4f97]"}`}>
                  {stageComplete ? "✓" : stage.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#10203d]">{stage.title}</p>
                  <p className="text-xs text-[#4a6080]">{stageCount}/{items.length} tasks completed</p>
                </div>
              </div>
              <span className="text-[#3a5480] text-sm">{expanded === stage.id ? "▲" : "▼"}</span>
            </button>

            {expanded === stage.id && (
              <div className="border-t border-[#e1e8f3] px-5 pb-5 pt-4 space-y-5">
                <p className="text-sm text-[#33496f]">{stage.description}</p>

                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#3a5480]">Tasks</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <label key={item.id} className="flex gap-3 cursor-pointer group">
                        <input type="checkbox" checked={!!checked[item.id]} onChange={() => toggle(item.id)} className="mt-0.5 h-4 w-4 rounded border-[#c9d5e6] accent-[#1f4f97]" />
                        <div>
                          <span className={`text-sm ${checked[item.id] ? "line-through text-[#8fa3c2]" : "text-[#273f67]"}`}>{item.text}</span>
                          {item.pitfall && <p className="mt-0.5 text-xs text-amber-600">⚠ Pitfall: {item.pitfall}</p>}
                          {item.evidence && <p className="mt-0.5 text-xs text-[#4a6080] italic">Evidence: {item.evidence}</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#3a5480]">Key questions to ask</h4>
                    <ul className="space-y-1">
                      {stage.questions.map((q, i) => (
                        <li key={i} className="flex gap-2 text-sm text-[#273f67]">
                          <span className="text-[#1f4f97] shrink-0">?</span><span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#3a5480]">Required assurance / evidence</h4>
                    <ul className="space-y-1">
                      {stage.assurance.map((a, i) => (
                        <li key={i} className="flex gap-2 text-sm text-[#273f67]">
                          <span className="text-green-600 shrink-0">✓</span><span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}

      {progressPct === 100 && (
        <div className="rounded-xl border border-green-300 bg-green-50 p-5 text-center">
          <p className="text-lg font-bold text-green-700">✓ All stages complete</p>
          <p className="mt-1 text-sm text-green-600">Proceed to gap identification and produce the engagement closure pack.</p>
        </div>
      )}
    </section>
  );
}
