"use client";

import { useEffect, useState } from "react";
import { useFormPersistence } from "@/lib/use-form-persistence";
import { stories } from "@/lib/knowledge-base";
import { getWorkflowExportContext, type RiskEntry, type RiskSeverity, type RiskStatus, type RiskRegisterState } from "@/lib/workflow-state";
import { PREFILL_MARKER_KEYS, applyRiskRegisterPrefill, getIntakePrefillSignature } from "@/lib/intake-prefill";
import { useRole } from "@/components/role-mode";

const story = stories.find((s) => s.id === "story-05")!;

const SEV_COLORS: Record<RiskSeverity, string> = {
  Critical: "bg-red-100 text-red-700 border-red-300",
  High: "bg-orange-100 text-orange-700 border-orange-300",
  Medium: "bg-amber-100 text-amber-700 border-amber-300",
  Low: "bg-blue-100 text-blue-700 border-blue-300",
};

const STATUS_COLORS: Record<RiskStatus, string> = {
  Open: "bg-red-50 text-red-600",
  Accepted: "bg-amber-50 text-amber-600",
  Mitigated: "bg-green-50 text-green-700",
  Closed: "bg-gray-100 text-gray-500",
};

const INITIAL_RISKS: RiskEntry[] = [
  {
    id: "R-001",
    title: "Audit logging not active in production",
    description: "Security-relevant events (auth, access changes, admin actions) are not being captured in the audit log table.",
    severity: "Critical",
    likelihood: "High",
    impact: "Cannot detect unauthorized access or comply with MAS TRM logging requirements.",
    asset: "PostgreSQL audit_log table",
    owner: "Security Lead",
    status: "Open",
    framework: "MAS TRM 11.2, ISO 27001 A.8.15",
    isGoLiveBlocker: true,
  },
  {
    id: "R-002",
    title: "Data-layer RBAC incomplete",
    description: "Role-scoped access to FINANCIAL and AUDIT data tiers is not fully implemented; over-privileged access possible.",
    severity: "High",
    likelihood: "Medium",
    impact: "Finance and Audit data accessible to users outside the required role boundary.",
    asset: "PostgreSQL (FINANCIAL and AUDIT tables)",
    owner: "Platform Team",
    status: "Open",
    framework: "MAS TRM 10.1, ISO 27001 A.5.15",
    isGoLiveBlocker: true,
  },
  {
    id: "R-003",
    title: "Branch protection not enabled on main",
    description: "Unreviewed code can be merged directly to main and deployed to production without peer review or SAST gate.",
    severity: "High",
    likelihood: "Medium",
    impact: "Malicious or insecure code can reach production without detection.",
    asset: "GitHub Actions CI/CD pipeline",
    owner: "DevOps Lead",
    status: "Open",
    framework: "MAS TRM 9.1, OWASP ASVS V1.1, SOC 2 CC8.1",
    isGoLiveBlocker: true,
  },
  {
    id: "R-004",
    title: "Broad internal document access for support staff",
    description: "Support agents have access to CONFIDENTIAL-tier documents beyond the scope needed for their role.",
    severity: "Medium",
    likelihood: "Low",
    impact: "Potential for inadvertent or malicious data exposure from support workflows.",
    asset: "Document management module",
    owner: "Support Manager",
    status: "Accepted",
    framework: "ISO 27001 A.5.15, CIS Control 5",
    exception: {
      justification: "Support team requires broad read access for client escalation handling. Risk is residual and proportionate.",
      compensatingControl: "Enhanced logging of all support access events; quarterly access review.",
      expiry: "2026-09-30",
      approver: "CISO",
    },
    isGoLiveBlocker: false,
  },
];

const DEFAULT_STATE: RiskRegisterState = { risks: INITIAL_RISKS };

export default function RiskExceptionsPage() {
  const role = useRole();
  const [state, setState] = useFormPersistence<RiskRegisterState>("risk-exceptions", DEFAULT_STATE);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<RiskStatus | "All">("All");
  const [filterSeverity, setFilterSeverity] = useState<RiskSeverity | "All">("All");

  useEffect(() => {
    const workflow = getWorkflowExportContext();
    const signature = getIntakePrefillSignature(workflow.intake);
    if (!signature || localStorage.getItem(PREFILL_MARKER_KEYS.riskRegister) === signature) return;

    const next = applyRiskRegisterPrefill(state, workflow.intake);
    localStorage.setItem(PREFILL_MARKER_KEYS.riskRegister, signature);

    if (JSON.stringify(next) !== JSON.stringify(state)) {
      setState(next);
    }
  }, [setState, state]);

  const filtered = state.risks.filter(
    (risk) => (filterStatus === "All" || risk.status === filterStatus) && (filterSeverity === "All" || risk.severity === filterSeverity),
  );
  const blockers = state.risks.filter((risk) => risk.isGoLiveBlocker && risk.status === "Open");
  const openCount = state.risks.filter((risk) => risk.status === "Open").length;
  const canUpdateStatus = role !== "Presales";

  const setStatus = (id: string, status: RiskStatus) => {
    if (!canUpdateStatus) return;
    setState({
      risks: state.risks.map((risk) => (risk.id === id ? { ...risk, status } : risk)),
    });
  };

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">05 Produce Risk and Exception Advisory</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">{openCount} open</span>
            {blockers.length > 0 && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">{blockers.length} blocker{blockers.length > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Advisory note:</strong> {story.notes[0].content}
        </div>
        <div className="mt-3 rounded-md border border-[#d8e0ed] bg-[#f8fbff] px-4 py-3 text-xs text-[#33496f]">
          <strong>{role} focus:</strong>{" "}
          {role === "Architect"
            ? "Track actual go-live blockers and change the status only when the control state materially changes."
            : role === "Auditor"
              ? "Use the register as the decision log for findings, accepted exceptions, and evidence follow-up."
              : "Presales mode keeps this page as a disclosure summary. Status changes are locked to avoid implying formal sign-off."}
        </div>
      </header>

      {blockers.length > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">Go-live is blocked - {blockers.length} unresolved critical or high risk(s):</p>
          <ul className="mt-2 space-y-1">
            {blockers.map((blocker) => (
              <li key={blocker.id} className="flex gap-2 text-xs text-red-600">
                <span className={`rounded-full border px-2 py-0.5 font-semibold text-xs ${SEV_COLORS[blocker.severity]}`}>{blocker.severity}</span>
                <span>{blocker.id} - {blocker.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Risk register</h3>
          <div className="ml-auto flex flex-wrap gap-2">
            <div className="flex gap-1">
              {(["All", "Open", "Accepted", "Mitigated", "Closed"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filterStatus === status ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6]"}`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {(["All", "Critical", "High", "Medium", "Low"] as const).map((severity) => (
                <button
                  key={severity}
                  type="button"
                  onClick={() => setFilterSeverity(severity)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filterSeverity === severity ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6]"}`}
                >
                  {severity}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((risk) => (
            <div key={risk.id} className={`rounded-lg border p-4 ${risk.isGoLiveBlocker && risk.status === "Open" ? "border-red-200 bg-red-50" : "border-[#d8e0ed] bg-[#f8fbff]"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#10203d]">{risk.id}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${SEV_COLORS[risk.severity]}`}>{risk.severity}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[risk.status]}`}>{risk.status}</span>
                  {risk.isGoLiveBlocker && risk.status === "Open" && (
                    <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">Go-live blocker</span>
                  )}
                </div>
                <button type="button" onClick={() => setExpandedId(expandedId === risk.id ? null : risk.id)} className="text-xs text-[#1f4f97] hover:underline">
                  {expandedId === risk.id ? "Less" : "Details"}
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
                    <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-3">
                      <p className="mb-1 text-xs font-semibold text-amber-700">Exception record</p>
                      <p className="text-xs text-amber-800"><strong>Justification:</strong> {risk.exception.justification}</p>
                      <p className="text-xs text-amber-800"><strong>Compensating control:</strong> {risk.exception.compensatingControl}</p>
                      <p className="text-xs text-amber-800"><strong>Expiry:</strong> {risk.exception.expiry} | <strong>Approver:</strong> {risk.exception.approver}</p>
                    </div>
                  )}

                  {canUpdateStatus ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(["Open", "Accepted", "Mitigated", "Closed"] as RiskStatus[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatus(risk.id, status)}
                          className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${risk.status === status ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-white text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#4a6080]">Status changes are disabled in Presales mode.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </article>

      {role === "Presales" ? (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Client disclosure guidance</h3>
          <ul className="space-y-1 text-sm text-[#273f67]">
            <li>Call out material blockers honestly, but avoid implying formal acceptance or remediation closure without owner approval.</li>
            <li>Position accepted risks as managed exceptions with compensating controls and expiry, not as resolved issues.</li>
            <li>Use the export page after final review if you need a clean Markdown risk register for sharing.</li>
          </ul>
        </article>
      ) : (
        <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Common exception pitfalls</h3>
          <ul className="space-y-1">
            {story.notes[2].content.replace("Common exception pitfalls: ", "").split(", ").map((pitfall, index) => (
              <li key={index} className="flex gap-2 text-sm text-[#273f67]">
                <span className="shrink-0 text-amber-500">?</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}

