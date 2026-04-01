"use client";
import { useState } from "react";
import { stories, getFrameworkById } from "@/lib/knowledge-base";

const story = stories.find((s) => s.id === "story-10")!;

type ClientType = "All" | "ai-platform" | "integration" | "portal" | "fi" | "govtech" | "education";

const CLIENT_LABELS: Record<ClientType, string> = {
  All: "All client types",
  "ai-platform": "AI-powered platform",
  integration: "Integration platform",
  portal: "Customer portal",
  fi: "Regulated FI",
  govtech: "Public sector / GovTech",
  education: "Education / SIT",
};

interface PresalesItem {
  id: string;
  question: string;
  guidance: string;
  redFlag: boolean;
  whoAnswers: "sales" | "architect" | "formal-assessment";
  clientTypes: ClientType[];
  frameworks: string[];
}

const DISCOVERY_PROMPTS = [
  "What data does this system handle? Is any of it personal data, financial data, or regulated data?",
  "What compliance obligations apply — PDPA, MAS TRM, IM8, SOC 2 Type II?",
  "Are there existing audits, certifications, or assessments we need to respond to?",
  "Is this a regulated or public-sector engagement? FI client? Statutory board?",
  "Does the system include AI or machine learning components? How are outputs used?",
  "Will the solution be internet-facing? Will it handle citizen or customer authentication?",
  "What integrations are in scope — third-party APIs, payment gateways, identity providers?",
  "What is the go-live timeline and are there known security or compliance milestones?",
];

const PRESALES_ITEMS: PresalesItem[] = [
  {
    id: "p1",
    question: "What security do we need for an AI-powered interview platform?",
    guidance: "Key areas: PDPA for video recordings and resume data (consent, retention, disposal), AI governance (explainability, bias thresholds, fallback for low-confidence scoring), SSO/institutional identity integration, OWASP MASVS for mobile browser, role-based dashboards that do not expose individual student data.",
    redFlag: false,
    whoAnswers: "architect",
    clientTypes: ["ai-platform", "education"],
    frameworks: ["pdpa", "owasp-masvs", "owasp-asvs"],
  },
  {
    id: "p2",
    question: "What security do we need for a data integration platform?",
    guidance: "Key areas: data classification (map each data type to a sensitivity tier), RBAC enforced per data tier (HR/Finance/Audit access separation), audit logging for all data access, environment segregation (dev must not reach prod), Managed Identity for service-to-service auth, Entra ID SSO for human access.",
    redFlag: false,
    whoAnswers: "architect",
    clientTypes: ["integration"],
    frameworks: ["iso27001", "pdpa", "nist-800-53"],
  },
  {
    id: "p3",
    question: "What security do we need for a customer portal?",
    guidance: "Key areas: strong authentication (MFA for account actions), OWASP ASVS Level 2 for web, object-level authorisation (user can only see their own records), secure document handling (access-controlled storage, no plain URL sharing), PDPA for any personal data collected, audit logging for account and document access.",
    redFlag: false,
    whoAnswers: "architect",
    clientTypes: ["portal"],
    frameworks: ["owasp-asvs", "pdpa", "iso27001"],
  },
  {
    id: "p4",
    question: "The client is a MAS-regulated financial institution — what do they expect?",
    guidance: "Escalate to a security architect immediately. Key expectations: MAS TRM alignment, VAPT before go-live, secure SDLC with code review, privileged access controls, audit logging, third-party risk management, DR with defined RTO/RPO. Sales should not commit to specific MAS TRM controls without security architect review.",
    redFlag: true,
    whoAnswers: "architect",
    clientTypes: ["fi"],
    frameworks: ["mas-trm", "iso27001", "soc2"],
  },
  {
    id: "p5",
    question: "The client is a Singapore government agency — what do they expect?",
    guidance: "Escalate to a security architect. Key expectations: IM8 compliance, PDPA for citizen data, GovZTA for access, MTCS Tier 3 if cloud-hosted, formal DPIA for citizen data collection, VAPT before go-live. Procurement documents often mandate specific security deliverables.",
    redFlag: true,
    whoAnswers: "architect",
    clientTypes: ["govtech"],
    frameworks: ["pdpa", "iso27001", "mtcs-tier3"],
  },
  {
    id: "p6",
    question: "Do we have ISO 27001 or SOC 2 certification?",
    guidance: "Sales can state our current certification status factually. If no certification exists, explain the controls we have in place and note that a formal audit engagement can be scoped if required. Do not overstate certification scope. If the client is FI, they are likely asking for vendor risk assurance — escalate to architect.",
    redFlag: false,
    whoAnswers: "sales",
    clientTypes: ["All", "fi", "portal"],
    frameworks: ["iso27001", "soc2"],
  },
  {
    id: "p7",
    question: "What is our VAPT approach?",
    guidance: "Sales can explain that VAPT is conducted by an independent third-party tester before major releases. Do not commit to specific tools, testers, or timelines without architect / delivery confirmation. For FI engagements, VAPT must be authenticated and must cover business logic — not just automated scanning.",
    redFlag: false,
    whoAnswers: "sales",
    clientTypes: ["All", "fi"],
    frameworks: ["owasp-asvs", "mas-trm"],
  },
  {
    id: "p8",
    question: "How do we handle PDPA — can we store Singapore personal data?",
    guidance: "Sales can confirm PDPA compliance at a high level: consent collected, purpose limitation enforced, retention schedules defined, data protection controls in place. For cross-border transfers or sensitive categories (health, financial, biometrics), escalate to architect for DPIA or transfer impact assessment.",
    redFlag: false,
    whoAnswers: "sales",
    clientTypes: ["All", "ai-platform", "portal", "education"],
    frameworks: ["pdpa"],
  },
  {
    id: "p9",
    question: "The client wants a penetration test report from us — can we provide one?",
    guidance: "If you have a recent VAPT report (within 12 months) for the relevant system, it can be shared under NDA after internal approval. Confirm scope matches client requirements. If no VAPT report exists, this requires delivery team planning — do not commit to a timeline without confirming with the delivery lead and security architect.",
    redFlag: false,
    whoAnswers: "architect",
    clientTypes: ["All", "fi"],
    frameworks: ["mas-trm", "owasp-asvs"],
  },
];

const WHO_COLORS: Record<PresalesItem["whoAnswers"], string> = {
  "sales": "bg-green-100 text-green-700",
  "architect": "bg-blue-100 text-blue-700",
  "formal-assessment": "bg-purple-100 text-purple-700",
};
const WHO_LABELS: Record<PresalesItem["whoAnswers"], string> = {
  "sales": "Sales can answer",
  "architect": "Needs security architect",
  "formal-assessment": "Formal assessment required",
};

export default function GenericIndustryPage() {
  const [clientType, setClientType] = useState<ClientType>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = PRESALES_ITEMS.filter(
    (p) => clientType === "All" || p.clientTypes.includes("All") || p.clientTypes.includes(clientType)
  );

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">10 Sales and Presales Security Briefing</h2>
        <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Key framing:</strong> Security is about enabling trusted delivery and protecting the client's customers, operations, and reputation — not a compliance tick-box.
        </div>
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Discovery prompts — ask at first meeting</h3>
        <ul className="space-y-1">
          {DISCOVERY_PROMPTS.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#273f67]">
              <span className="text-[#1f4f97] font-bold shrink-0">→</span><span>{p}</span>
            </li>
          ))}
        </ul>
      </article>

      <div className="flex flex-wrap gap-1">
        {(Object.keys(CLIENT_LABELS) as ClientType[]).map((c) => (
          <button key={c} onClick={() => setClientType(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${clientType === c ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
          >{CLIENT_LABELS[c]}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className={`rounded-xl border bg-white overflow-hidden ${item.redFlag ? "border-red-300" : "border-[#c9d5e6]"}`}>
            <button className="w-full flex items-start justify-between p-5 text-left hover:bg-[#f8fbff] transition-colors"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <div className="flex-1 pr-4">
                <div className="flex gap-2 mb-1 flex-wrap">
                  {item.redFlag && <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-semibold">🚩 Escalate to architect</span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${WHO_COLORS[item.whoAnswers]}`}>{WHO_LABELS[item.whoAnswers]}</span>
                </div>
                <p className="text-sm font-semibold text-[#10203d]">{item.question}</p>
              </div>
              <span className="text-[#3a5480] text-sm shrink-0">{expanded === item.id ? "▲" : "▼"}</span>
            </button>

            {expanded === item.id && (
              <div className="border-t border-[#e1e8f3] p-5 space-y-3">
                <div className="rounded-md bg-green-50 border border-green-200 p-3">
                  <p className="text-xs font-semibold uppercase text-green-700 mb-1">Guidance</p>
                  <p className="text-sm text-[#1a3a1a]">{item.guidance}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.frameworks.map((fwId) => (
                    <span key={fwId} className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-2 py-0.5 text-xs text-[#1e3d6c]">
                      {fwId.toUpperCase().replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">What sales can answer vs. what needs an architect</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { label: "Sales can answer", color: "bg-green-50 border-green-200", items: ["Certification status (ISO 27001, SOC 2)", "General VAPT approach", "PDPA compliance at a high level", "Whether MFA is supported", "Whether logs are retained"] },
            { label: "Needs security architect", color: "bg-blue-50 border-blue-200", items: ["MAS TRM alignment specifics", "IM8 and GovZTA compliance", "VAPT scope and timing commitment", "AI governance controls", "Cross-border transfer assessment", "Specific control mapping for RFP response"] },
            { label: "Formal assessment required", color: "bg-purple-50 border-purple-200", items: ["Architecture review report", "Data Protection Impact Assessment (DPIA)", "Control gap analysis with evidence", "Risk register sign-off", "VAPT report delivery"] },
          ].map((col) => (
            <div key={col.label} className={`rounded-md border p-3 ${col.color}`}>
              <p className="text-xs font-semibold mb-2 text-[#10203d]">{col.label}</p>
              <ul className="space-y-1">
                {col.items.map((item, i) => (
                  <li key={i} className="text-xs text-[#273f67] flex gap-1"><span>•</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}