"use client";
import { useState } from "react";
import { stories, getFrameworkById } from "@/lib/knowledge-base";

const story = stories.find((s) => s.id === "story-09")!;

type FilterTopic = "All" | "governance" | "access" | "sdlc" | "vapt" | "logging" | "third-party" | "resilience";
type FilterAudience = "All" | "client" | "internal" | "auditor";

interface FIQuestion {
  id: string;
  question: string;
  intent: string;
  answer: string;
  evidence: string;
  implementation: string;
  specialist: boolean;
  topics: FilterTopic[];
  audiences: FilterAudience[];
  frameworks: string[];
}

const FI_QUESTIONS: FIQuestion[] = [
  {
    id: "fi-1",
    question: "What access controls do you have on customer data?",
    intent: "Assess whether role-based access is enforced and privileged access is controlled and audited.",
    answer: "We enforce role-based access control (RBAC) aligned to the principle of least privilege. Each user role is granted only the minimum access needed for their function. Privileged access to sensitive data requires an additional approval step, is time-limited, and every privileged action is logged to a tamper-evident audit trail. Access is reviewed quarterly.",
    evidence: "RBAC matrix, access control policy, privileged access policy, quarterly access review records, audit log configuration.",
    implementation: "Entra ID / Azure AD groups mapped to RBAC roles; server-side access checks at every API endpoint; no client-side-only authorisation; admin and user paths strictly separated.",
    specialist: false,
    topics: ["access", "governance"],
    audiences: ["client", "auditor"],
    frameworks: ["mas-trm", "iso27001"],
  },
  {
    id: "fi-2",
    question: "How do you manage third-party and vendor security?",
    intent: "MAS TRM Section 5 requires formal third-party risk management including pre-onboarding assessment and ongoing monitoring.",
    answer: "Third-party vendors undergo a security risk assessment before onboarding, covering their security controls, audit certifications, data handling practices, and sub-processor usage. Contractual security obligations are embedded in all vendor agreements. We conduct periodic reviews and require vendors to notify us of material security incidents.",
    evidence: "Vendor risk assessment template, contractual security clauses, vendor audit reports (SOC 2 / ISO 27001), sub-processor register, periodic review records.",
    implementation: "Vendor risk scoring model; security requirements in procurement templates; annual review cadence for critical vendors; incident notification SLA in contracts.",
    specialist: false,
    topics: ["third-party", "governance"],
    audiences: ["client", "auditor"],
    frameworks: ["mas-trm"],
  },
  {
    id: "fi-3",
    question: "What is your secure SDLC maturity?",
    intent: "MAS TRM requires security to be embedded throughout the development lifecycle, not added as a post-build gate.",
    answer: "Security is integrated at every phase of our SDLC. Requirements stage includes threat modelling and security requirements derivation. Development includes SAST and SCA scanning in CI/CD with gate-fail on critical findings. Pre-release includes authenticated VAPT by an independent party. Post-release includes production monitoring and patch management.",
    evidence: "SDLC security policy, threat model records, SAST/SCA pipeline configuration and scan results, VAPT engagement letter and report, remediation tracker, patch cadence records.",
    implementation: "GitHub Actions CI/CD with CodeQL SAST and Dependabot SCA; branch protection on main required; peer review mandatory before merge; VAPT scoped to web, API, and infrastructure.",
    specialist: false,
    topics: ["sdlc"],
    audiences: ["client", "internal", "auditor"],
    frameworks: ["mas-trm", "owasp-asvs"],
  },
  {
    id: "fi-4",
    question: "How do you handle security testing before go-live?",
    intent: "MAS TRM expects independent, authenticated testing covering business logic — not just automated scanning.",
    answer: "We conduct multi-layer pre-go-live assurance: automated SAST/SCA in CI/CD, independent authenticated VAPT covering web, API, mobile (if applicable), and cloud configuration. All Critical and High findings must be remediated and retested before production deployment. Residual medium findings are risk-accepted with compensating controls and scheduled remediation. All findings and closure evidence are retained.",
    evidence: "VAPT scoping document, VAPT report, remediation tracker with closure dates, retest confirmation, risk acceptance records for accepted items.",
    implementation: "VAPT conducted by accredited third-party; authenticated testing required (not unauthenticated scan only); business logic and authorisation abuse testing included in scope.",
    specialist: false,
    topics: ["vapt", "sdlc"],
    audiences: ["client", "auditor"],
    frameworks: ["mas-trm", "owasp-asvs", "iso27001"],
  },
  {
    id: "fi-5",
    question: "What logging and monitoring do you have in place?",
    intent: "MAS TRM requires tamper-evident audit logging of all security-relevant events and active monitoring for anomalies.",
    answer: "All security-significant events are captured in tamper-evident logs: authentication success and failure, access control decisions, privilege escalations, admin actions, data exports, and configuration changes. Logs are retained for a minimum of 12 months. A SIEM correlates events and triggers alerts for suspicious activity. The security operations team reviews alerts on a defined cadence.",
    evidence: "Log configuration evidence, log retention policy, SIEM integration diagram, alert rule definitions, monitoring cadence documentation, sample log review records.",
    implementation: "Azure Monitor + Log Analytics + Application Insights; SIEM downstream (e.g. Microsoft Sentinel); alert rules for auth failures, privilege changes, off-hours access; 12-month retention enforced.",
    specialist: false,
    topics: ["logging", "governance"],
    audiences: ["client", "auditor"],
    frameworks: ["mas-trm", "iso27001", "soc2"],
  },
  {
    id: "fi-6",
    question: "How do you demonstrate MAS TRM governance alignment?",
    intent: "FI clients and their auditors expect a traceable mapping from MAS TRM clauses to implemented controls and evidence.",
    answer: "We maintain a control register that maps each applicable MAS TRM requirement to our implemented controls, the owner, evidence artefacts, and the last review date. This is reviewed at least annually and updated after any material change. Senior management reviews the technology risk posture quarterly.",
    evidence: "MAS TRM control mapping register, board/management risk reporting records, technology risk committee minutes, evidence artefacts linked per control.",
    implementation: "Control register maintained in GRC tool or structured spreadsheet; traceability from MAS TRM clause to control to evidence; annual internal review; external audit readiness maintained.",
    specialist: true,
    topics: ["governance"],
    audiences: ["auditor", "client"],
    frameworks: ["mas-trm"],
  },
  {
    id: "fi-7",
    question: "How do you handle operational resilience and DR for critical systems?",
    intent: "MAS TRM Section 7 requires defined RTO/RPO targets, tested DR plans, and board-approved continuity objectives.",
    answer: "Each critical system has defined RTO and RPO targets approved by senior management. DR plans are documented, tested at least annually, and updated after major changes. Test results, gaps, and remediation actions are reported to the relevant governance committee.",
    evidence: "BCP/DR plan, RTO/RPO target table, DR test results, board/committee approval records, post-test remediation tracker.",
    implementation: "Azure zone-redundant deployment for critical workloads; automated backup with verified restore testing; failover runbooks; annual DR test with documented results.",
    specialist: false,
    topics: ["resilience", "governance"],
    audiences: ["client", "auditor"],
    frameworks: ["mas-trm", "iso27001"],
  },
  {
    id: "fi-8",
    question: "How do you protect against insider threats and privileged access abuse?",
    intent: "MAS TRM and auditors expect separation of duties, PAM controls, and alerts for anomalous privileged activity.",
    answer: "Privileged access is controlled through a Privileged Access Management (PAM) process: just-in-time access, approval workflow, session recording for high-risk actions, and quarterly review. Separation of duties is enforced for incompatible roles (e.g. code commit and production deployment). All privileged actions are monitored and anomalous patterns trigger alerts.",
    evidence: "PAM policy, PAM tool configuration, access approval workflow evidence, separation of duties matrix, alert rule for privileged anomalies, quarterly access review records.",
    implementation: "Entra PIM for Azure privileged roles; approval gates for production access; CI/CD pipeline enforces branch protection and peer review; privileged session monitoring in place.",
    specialist: true,
    topics: ["access", "governance"],
    audiences: ["auditor", "internal"],
    frameworks: ["mas-trm", "iso27001", "nist-800-53"],
  },
];

const TOPIC_LABELS: Record<FilterTopic, string> = {
  All: "All topics", governance: "Governance", access: "Access management",
  sdlc: "Secure SDLC", vapt: "VAPT / Testing", logging: "Logging & monitoring",
  "third-party": "Third-party risk", resilience: "Resilience / DR",
};

export default function FiIndustryPage() {
  const [topic, setTopic] = useState<FilterTopic>("All");
  const [audience, setAudience] = useState<FilterAudience>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const masTrm = getFrameworkById("mas-trm");

  const filtered = FI_QUESTIONS.filter(
    (q) => (topic === "All" || q.topics.includes(topic)) && (audience === "All" || q.audiences.includes(audience))
  );

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">09 FI Compliance Quick Answers</h2>
        <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>MAS TRM:</strong> {story.notes[0].content}
        </div>
        <div className="mt-2 rounded-md bg-amber-50 border border-amber-200 px-4 py-2 text-xs text-amber-800">
          <strong>⚠ Advisory:</strong> {story.notes[2].content}
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-1">
          {(Object.keys(TOPIC_LABELS) as FilterTopic[]).map((t) => (
            <button key={t} onClick={() => setTopic(t)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${topic === t ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
            >{TOPIC_LABELS[t]}</button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["All", "client", "internal", "auditor"] as FilterAudience[]).map((a) => (
            <button key={a} onClick={() => setAudience(a)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors capitalize ${audience === a ? "bg-[#8b5cf6] text-white border-[#8b5cf6]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#8b5cf6]"}`}
            >{a === "All" ? "All audiences" : a}</button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#4a6080]">{filtered.length} question{filtered.length !== 1 ? "s" : ""} shown</p>

      <div className="space-y-3">
        {filtered.map((q) => (
          <article key={q.id} className={`rounded-xl border bg-white overflow-hidden ${q.specialist ? "border-amber-200" : "border-[#c9d5e6]"}`}>
            <button className="w-full flex items-start justify-between p-5 text-left hover:bg-[#f8fbff] transition-colors"
              onClick={() => setExpanded(expanded === q.id ? null : q.id)}
            >
              <div className="flex-1 pr-4">
                <div className="flex gap-2 flex-wrap mb-1">
                  {q.specialist && <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-semibold">Specialist review needed</span>}
                  {q.topics.map((t) => t !== "All" && <span key={t} className="rounded-full bg-[#edf3fc] text-[#1e3d6c] px-2 py-0.5 text-xs">{TOPIC_LABELS[t]}</span>)}
                </div>
                <p className="text-sm font-semibold text-[#10203d]">Q: {q.question}</p>
                <p className="mt-0.5 text-xs text-[#4a6080] italic">{q.intent}</p>
              </div>
              <span className="text-[#3a5480] text-sm shrink-0">{expanded === q.id ? "▲" : "▼"}</span>
            </button>

            {expanded === q.id && (
              <div className="border-t border-[#e1e8f3] p-5 space-y-3">
                <div className="rounded-md bg-green-50 border border-green-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-green-700 mb-1">Answer</p>
                  <p className="text-sm text-[#1a3a1a]">{q.answer}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-md bg-[#f8fbff] border border-[#d8e0ed] p-3">
                    <p className="text-xs font-semibold text-[#3a5480] mb-1">Evidence expected</p>
                    <p className="text-sm text-[#273f67]">{q.evidence}</p>
                  </div>
                  <div className="rounded-md bg-[#f8fbff] border border-[#d8e0ed] p-3">
                    <p className="text-xs font-semibold text-[#3a5480] mb-1">Typical implementation</p>
                    <p className="text-sm text-[#273f67]">{q.implementation}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {q.frameworks.map((fwId) => (
                    <span key={fwId} className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-2 py-0.5 text-xs text-[#1e3d6c]">{fwId.toUpperCase().replace(/-/g, " ")}</span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {masTrm && (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">MAS TRM key controls reference</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {masTrm.controls.map((c) => (
              <div key={c.id} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] p-3">
                <p className="text-xs font-semibold text-[#1e3d6c]">{c.clause} — {c.title}</p>
                <p className="mt-0.5 text-xs text-[#4a6080]">{c.intent}</p>
                <p className="mt-1 text-xs text-[#6b7ea0] italic">Evidence: {c.evidence}</p>
              </div>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}