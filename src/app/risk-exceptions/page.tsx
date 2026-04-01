"use client";
import { useState } from "react";
import { stories } from "@/lib/knowledge-base";

const story = stories.find((s) => s.id === "story-05")!;

type Severity = "Critical" | "High" | "Medium" | "Low";
type Status = "Open" | "Accepted" | "Mitigated" | "Closed";

interface RiskEntry {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  likelihood: "High" | "Medium" | "Low";
  impact: string;
  asset: string;
  owner: string;
  status: Status;
  framework: string;
  exception?: {
    justification: string;
    compensatingControl: string;
    expiry: string;
    approver: string;
  };
  isGoLiveBlocker: boolean;
}

const SEV_COLORS: Record<Severity, string> = {
  Critical: "bg-red-100 text-red-700 border-red-300",
  High: "bg-orange-100 text-orange-700 border-orange-300",
  Medium: "bg-amber-100 text-amber-700 border-amber-300",
  Low: "bg-blue-100 text-blue-700 border-blue-300",
};

const STATUS_COLORS: Record<Status, string> = {
  Open: "bg-red-50 text-red-600",
  Accepted: "bg-amber-50 text-amber-600",
  Mitigated: "bg-green-50 text-green-700",
  Closed: "bg-gray-100 text-gray-500",
};

const INITIAL_RISKS: RiskEntry[] = [
  {
    id: "R-001", title: "Audit logging not active in production", description: "Security-relevant events (auth, access changes, admin actions) are not being captured in the audit log table.", severity: "Critical", likelihood: "High", impact: "Cannot detect unauthorized access or comply with MAS TRM logging requirements.", asset: "PostgreSQL audit_log table", owner: "Security Lead", status: "Open", framework: "MAS TRM 11.2, ISO 27001 A.8.15", isGoLiveBlocker: true,
  },
  {
    id: "R-002", title: "Data-layer RBAC incomplete", description: "Role-scoped access to FINANCIAL and AUDIT data tiers is not fully implemented; over-privileged access possible.", severity: "High", likelihood: "Medium", impact: "Finance and Audit data accessible to users outside the required role boundary.", asset: "PostgreSQL (FINANCIAL and AUDIT tables)", owner: "Platform Team", status: "Open", framework: "MAS TRM 10.1, ISO 27001 A.5.15", isGoLiveBlocker: true,
  },
  {
    id: "R-003", title: "Branch protection not enabled on main", description: "Unreviewed code can be merged directly to main and deployed to production without peer review or SAST gate.", severity: "High", likelihood: "Medium", impact: "Malicious or insecure code can reach production without detection.", asset: "GitHub Actions CI/CD pipeline", owner: "DevOps Lead", status: "Open", framework: "MAS TRM 9.1, OWASP ASVS V1.1, SOC 2 CC8.1", isGoLiveBlocker: true,
  },
  {
    id: "R-004", title: "Broad internal document access for support staff", description: "Support agents have access to CONFIDENTIAL-tier documents beyond the scope needed for their role.", severity: "Medium", likelihood: "Low", impact: "Potential for inadvertent or malicious data exposure from support workflows.", asset: "Document management module", owner: "Support Manager", status: "Accepted", framework: "ISO 27001 A.5.15, CIS Control 5",
    exception: { justification: "Support team requires broad read access for client escalation handling. Risk is residual and proportionate.", compensatingControl: "Enhanced logging of all support access events; quarterly access review.", expiry: "2026-09-30", approver: "CISO" },
    isGoLiveBlocker: false,
  },
];

export default function RiskExceptionsPage() {
  const [risks, setRisks] = useState<RiskEntry[]>(INITIAL_RISKS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [filterSeverity, setFilterSeverity] = useState<Severity | "All">("All");

  const filtered = risks.filter(
    (r) => (filterStatus === "All" || r.status === filterStatus) && (filterSeverity === "All" || r.severity === filterSeverity)
  );

  const blockers = risks.filter((r) => r.isGoLiveBlocker && r.status === "Open");
  const openCount = risks.filter((r) => r.status === "Open").length;

  const setStatus = (id: string, status: Status) => {
    setRisks((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">05 Produce Risk and Exception Advisory</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">{openCount} open</span>
            {blockers.length > 0 && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">{blockers.length} go-live blocker{blockers.length > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Advisory note:</strong> {story.notes[0].content}
        </div>
      </header>

      {blockers.length > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">🚫 Go-live is blocked — {blockers.length} unresolved critical/high risk(s):</p>
          <ul className="mt-2 space-y-1">
            {blockers.map((b) => (
              <li key={b.id} className="text-xs text-red-600 flex gap-2">
                <span className={`rounded-full border px-2 py-0.5 font-semibold text-xs ${SEV_COLORS[b.severity]}`}>{b.severity}</span>
                <span>{b.id} — {b.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Risk register</h3>
          <div className="flex gap-2 ml-auto flex-wrap">
            <div className="flex gap-1">
              {(["All", "Open", "Accepted", "Mitigated", "Closed"] as const).map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${filterStatus === s ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6]"}`}
                >{s}</button>
              ))}
            </div>
            <div className="flex gap-1">
              {(["All", "Critical", "High", "Medium", "Low"] as const).map((s) => (
                <button key={s} onClick={() => setFilterSeverity(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${filterSeverity === s ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6]"}`}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((risk) => (
            <div key={risk.id} className={`rounded-lg border p-4 ${risk.isGoLiveBlocker && risk.status === "Open" ? "border-red-200 bg-red-50" : "border-[#d8e0ed] bg-[#f8fbff]"}`}>
              <div className="flex flex-wrap items-start gap-2 justify-between">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="text-sm font-bold text-[#10203d]">{risk.id}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${SEV_COLORS[risk.severity]}`}>{risk.severity}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[risk.status]}`}>{risk.status}</span>
                  {risk.isGoLiveBlocker && risk.status === "Open" && (
                    <span className="rounded-full bg-red-600 text-white px-2 py-0.5 text-xs font-semibold">🚫 Go-live blocker</span>
                  )}
                </div>
                <button onClick={() => setExpandedId(expandedId === risk.id ? null : risk.id)}
                  className="text-xs text-[#1f4f97] hover:underline"
                >
                  {expandedId === risk.id ? "▲ Less" : "▼ Details"}
                </button>
              </div>

              <p className="mt-1 text-sm font-semibold text-[#15305a]">{risk.title}</p>
              <p className="mt-0.5 text-xs text-[#4a6080]">Owner: {risk.owner} | Framework: {risk.framework}</p>

              {expandedId === risk.id && (
                <div className="mt-3 space-y-2 border-t border-[#d8e0ed] pt-3">
                  <p className="text-sm text-[#273f67]"><strong>Description:</strong> {risk.description}</p>
                  <p className="text-sm text-[#273f67]"><strong>Business impact:</strong> {risk.impact}</p>
                  <p className="text-sm text-[#273f67]"><strong>Affected asset:</strong> {risk.asset}</p>
                  <p className="text-sm text-[#273f67]"><strong>Likelihood:</strong> {risk.likelihood}</p>

                  {risk.exception && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 mt-2">
                      <p className="text-xs font-semibold text-amber-700 mb-1">Exception record</p>
                      <p className="text-xs text-amber-800"><strong>Justification:</strong> {risk.exception.justification}</p>
                      <p className="text-xs text-amber-800"><strong>Compensating control:</strong> {risk.exception.compensatingControl}</p>
                      <p className="text-xs text-amber-800"><strong>Expiry:</strong> {risk.exception.expiry} | <strong>Approver:</strong> {risk.exception.approver}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {(["Open", "Accepted", "Mitigated", "Closed"] as Status[]).map((s) => (
                      <button key={s} onClick={() => setStatus(risk.id, s)}
                        className={`rounded-md px-3 py-1 text-xs font-medium border transition-colors ${risk.status === s ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-white text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Common exception pitfalls</h3>
        <ul className="space-y-1">
          {story.notes[2].content.replace("Common exception pitfalls: ", "").split(", ").map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#273f67]">
              <span className="text-amber-500 shrink-0">⚠</span><span>{p}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
