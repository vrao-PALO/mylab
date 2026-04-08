"use client";
import { useState } from "react";
import { stories } from "@/lib/knowledge-base";

const story = stories.find((s) => s.id === "story-12")!;

type Severity = "Critical" | "High" | "Medium" | "Low" | "Pass";
type Area = "All" | "inbound" | "data" | "access" | "monitoring" | "cicd" | "dr";

const AREA_LABELS: Record<Area, string> = {
  All: "All areas", inbound: "Inbound data flows", data: "Data processing & storage",
  access: "Access control", monitoring: "Monitoring & SIEM", cicd: "CI/CD & deployment", dr: "DR & resilience",
};

interface ReviewItem {
  id: string;
  title: string;
  question: string;
  guidance: string;
  evidence: string;
  severity: Severity;
  area: Area;
  napta?: string;
}

const REVIEW_ITEMS: ReviewItem[] = [
  // Inbound
  { id: "r1", area: "inbound", severity: "Critical", title: "Inbound API source authentication", question: "Are all inbound integration sources authenticated before data is accepted?", guidance: "Every inbound data source must authenticate using a strong mechanism — Managed Identity, Entra bearer token, or mutual TLS. No anonymous or shared-secret-only sources allowed.", evidence: "Authentication method per integration, Managed Identity config, Entra app registration.", napta: "NAPTA: ETL Function App must validate Entra bearer token from Napta HR API before processing." },
  { id: "r2", area: "inbound", severity: "High", title: "Encryption in transit for all inbound flows", question: "Is all data in transit encrypted with TLS 1.2 or above?", guidance: "All data flows — inbound, internal, and outbound — must use TLS 1.2 minimum. No clear-text HTTP channels permitted in any environment.", evidence: "TLS configuration scan, cipher suite list, certificate validity, NSG/firewall rules blocking port 80.", napta: "NAPTA: GitHub Actions deployment over HTTPS; ETL payload transmission verified TLS 1.2+." },
  { id: "r3", area: "inbound", severity: "High", title: "Input validation and injection prevention", question: "Is all inbound data validated and sanitised before processing or storage?", guidance: "All inbound payloads must be validated against a defined schema. SQL injection, SSRF, and command injection vectors must be blocked at the API or ETL layer.", evidence: "Input validation policy, code review evidence, SAST scan results, VAPT coverage of injection vectors." },
  // Data
  { id: "r4", area: "data", severity: "Critical", title: "Data classification enforced at storage tier", question: "Are INTERNAL, CONFIDENTIAL, FINANCIAL, and AUDIT data stored in separate access-controlled tiers?", guidance: "Each data classification must have separate access controls enforced at the database or schema level. No single role should have access across all classification tiers.", evidence: "Database schema design, role-to-table access matrix, RBAC configuration per data tier.", napta: "NAPTA: INTERNAL (BI), CONFIDENTIAL (HR/Audit), FINANCIAL (Finance), AUDIT (Audit team) — each tier must have enforced role-scoped access via read-side views." },
  { id: "r5", area: "data", severity: "High", title: "Production isolated from non-production", question: "Is there a validated technical boundary preventing dev/test access to production data?", guidance: "Production and non-production environments must be in separate resource groups, subscriptions, or network segments. No shared credentials, no direct access paths.", evidence: "Infrastructure diagram, subscription/resource group separation evidence, network security group rules.", napta: "NAPTA: single PostgreSQL per environment (not shared). Dev and prod are separate instances." },
  { id: "r6", area: "data", severity: "High", title: "Sensitive data not exposed in logs or exports", question: "Are FINANCIAL, AUDIT, and PII data excluded from application logs and error messages?", guidance: "Log configuration must be reviewed to confirm no sensitive field values (account numbers, NRIC, salary figures) appear in log payloads. Structured logging with field allowlists recommended.", evidence: "Log configuration, sample log review, structured logging policy, VAPT log exposure test results." },
  { id: "r7", area: "data", severity: "Medium", title: "Retention and disposal policy defined", question: "Is there a documented retention schedule and secure disposal procedure for each data class?", guidance: "Each data classification must have a defined maximum retention period and a secure disposal method. Disposal events must be logged.", evidence: "Retention schedule document, disposal procedure, disposal log records." },
  // Access
  { id: "r8", area: "access", severity: "Critical", title: "Per-service Managed Identities — no shared identities", question: "Does each Function App have its own Managed Identity scoped to only the resources it needs?", guidance: "Each service must have a dedicated Managed Identity. Shared identities between services violate least-privilege and make blast radius control impossible.", evidence: "Managed Identity assignment per Function App, Key Vault access policy per identity, no wildcard or over-permissioned roles.", napta: "NAPTA: ETL App and Migration App must each have separate Managed Identities. Neither should have access to the other's Key Vault secrets." },
  { id: "r9", area: "access", severity: "Critical", title: "Human access via Entra ID SSO only", question: "Is all human (operator and developer) access to the platform gated through Entra ID with MFA?", guidance: "No local accounts or shared passwords for human access. All operators must authenticate via Entra ID. MFA required for all accounts with production access.", evidence: "Entra ID configuration, MFA enforcement policy, no local account evidence, access provisioning records." },
  { id: "r10", area: "access", severity: "High", title: "Secrets in Key Vault — no hardcoded credentials", question: "Are all secrets, connection strings, and API keys stored in Azure Key Vault and accessed via Managed Identity?", guidance: "Zero hardcoded secrets in code, config files, or CI/CD environment variables. All secrets referenced via Key Vault secret URI. Key Vault access policies scoped per service identity.", evidence: "Secret scan (truffleHog/gitleaks) output, Key Vault secret reference configuration, no plaintext secrets in repo or pipeline logs." },
  { id: "r11", area: "access", severity: "High", title: "Read-only role-scoped access for BI/HR/Finance/Audit users", question: "Do HR, Finance, Audit, and BI users access data only via read-side role-scoped views — not direct DB access?", guidance: "Business users must access data through a controlled API or view layer with RBAC enforced server-side. No direct database connection strings handed to business users.", evidence: "API/view layer design, RBAC matrix per role, no direct DB access evidence for business user accounts." },
  // Monitoring
  { id: "r12", area: "monitoring", severity: "Critical", title: "Audit logging active in production", question: "Are all security-relevant events captured in a tamper-evident audit log?", guidance: "Authentication events, data access, privilege changes, and admin actions must be logged. Log table must be insert-only (no updates/deletes by application role). Retention minimum 12 months.", evidence: "Audit log configuration, sample log entries, retention policy, tamper-protection mechanism.", napta: "NAPTA R-001: audit_log table must be active and populated. This was a Critical open risk at design time." },
  { id: "r13", area: "monitoring", severity: "High", title: "Application Insights and Log Analytics configured", question: "Is the full observability stack active — App Insights, Log Analytics, Azure Monitor, and Action Groups?", guidance: "All four components must be configured: App Insights for app telemetry, Log Analytics as central log sink, Azure Monitor for metric alerts, Action Groups for alert notification routing.", evidence: "App Insights resource config, Log Analytics workspace, Azure Monitor alert rules, Action Group configuration.", napta: "NAPTA observability stack: Application Insights + Log Analytics + Azure Monitor + Action Groups; SIEM downstream of Log Analytics." },
  { id: "r14", area: "monitoring", severity: "High", title: "SIEM integration and monitoring cadence", question: "Does a downstream SIEM ingest Log Analytics data and is there a defined monitoring cadence?", guidance: "SIEM (e.g. Microsoft Sentinel) must be connected to Log Analytics. Alert rules must cover auth failures, privilege changes, off-hours access, and data export anomalies. A defined review cadence must be documented.", evidence: "SIEM connection config, alert rule definitions, monitoring cadence SOP.", napta: "NAPTA R-007: Sentinel SIEM + monitoring cadence — open risk at design time, pricing decision required." },
  // CI/CD
  { id: "r15", area: "cicd", severity: "Critical", title: "Branch protection on main branch", question: "Is the main branch protected — no direct pushes, peer review required, SAST gate active?", guidance: "Main branch must have: direct push blocked, at least one peer review required, SAST scan must pass before merge. This prevents unreviewed or malicious code reaching production.", evidence: "Branch protection rule configuration, CI/CD pipeline config showing SAST gate, merge policy.", napta: "NAPTA R-005: branch protection was open risk at design time. Must be resolved before production." },
  { id: "r16", area: "cicd", severity: "High", title: "GitHub Actions path separation — ARM vs data/schema", question: "Are the ARM (infrastructure) and Entra bearer token (schema/data) GitHub Actions paths clearly separated with distinct permissions?", guidance: "Infrastructure deployment (ARM) and application/data deployment must use separate workflows with separate permissions and triggers. No single workflow should have both infrastructure and data access.", evidence: "GitHub Actions workflow files, permissions per workflow, trigger conditions.", napta: "NAPTA: GitHub Actions has two paths — ARM for infrastructure, Entra bearer tokens for schema/data. These must be validated as separate with distinct permission scopes." },
  { id: "r17", area: "cicd", severity: "High", title: "SAST and SCA scanning in CI/CD pipeline", question: "Are SAST (code scanning) and SCA (dependency CVE scanning) gates active in CI/CD?", guidance: "Both SAST and SCA must be configured as PR/push gates. Critical findings must fail the pipeline. Results must be reviewed and not suppressed without documented justification.", evidence: "CodeQL / SAST tool config, Dependabot SCA config, pipeline failure evidence for test finding, suppression register." },
  // DR
  { id: "r18", area: "dr", severity: "High", title: "RTO and RPO targets defined and tested", question: "Are RTO and RPO targets defined for each environment and validated by a DR test?", guidance: "Target RTO and RPO must be defined in a formal BCP/DR plan, approved by senior management, and validated by at least one DR test per year.", evidence: "BCP/DR plan with RTO/RPO table, DR test results, management approval.", napta: "NAPTA R-009b: single-region acceptable for Phase 1 MVP — but RTO/RPO targets must still be formally defined." },
  { id: "r19", area: "dr", severity: "Medium", title: "Database backup and verified restore", question: "Is automated backup configured for PostgreSQL and has a restore been successfully tested?", guidance: "Automated daily backup required. Backup must be stored in a separate location from the primary. A restore test must have been completed and documented within the last 6 months.", evidence: "Backup configuration, backup retention policy, restore test record with timestamp and confirming integrity." },
];

const SEV_COLORS: Record<Severity, string> = {
  Critical: "bg-red-100 text-red-700 border-red-300",
  High: "bg-orange-100 text-orange-700 border-orange-300",
  Medium: "bg-amber-100 text-amber-700 border-amber-300",
  Low: "bg-blue-100 text-blue-700 border-blue-300",
  Pass: "bg-green-100 text-green-700 border-green-300",
};

type FindingStatus = "Not reviewed" | "Pass" | "Finding" | "N/A";

export default function ArchitectureReviewPage() {
  const [area, setArea] = useState<Area>("All");
  const [findings, setFindings] = useState<Record<string, FindingStatus>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = REVIEW_ITEMS.filter((i) => area === "All" || i.area === area);
  const totalReviewed = Object.values(findings).filter((v) => v !== "Not reviewed").length;
  const openFindings = Object.values(findings).filter((v) => v === "Finding").length;
  const passed = Object.values(findings).filter((v) => v === "Pass").length;

  const setFinding = (id: string, status: FindingStatus) =>
    setFindings((prev) => ({ ...prev, [id]: status }));

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">12 Internal Platform Architecture Review</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap">
            <span className="rounded-full bg-[#edf3fc] px-3 py-1 text-xs font-semibold text-[#1f4f97]">{totalReviewed}/{REVIEW_ITEMS.length} reviewed</span>
            {openFindings > 0 && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">{openFindings} finding{openFindings > 1 ? "s" : ""}</span>}
            {passed > 0 && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{passed} passed</span>}
          </div>
        </div>
        <div className="mt-3 rounded-md bg-amber-50 border border-amber-200 px-4 py-2 text-xs text-amber-800">
          <strong>NAPTA open risks at design time:</strong> R-001 (audit logging), R-002 (RBAC), R-003 (per-service identities), R-005 (branch protection), R-006 (retention), R-007 (SIEM). Verify these in the review.
        </div>
      </header>

      <div className="flex flex-wrap gap-1">
        {(Object.keys(AREA_LABELS) as Area[]).map((a) => (
          <button key={a} onClick={() => setArea(a)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${area === a ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
          >{AREA_LABELS[a]}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const status = findings[item.id] ?? "Not reviewed";
          return (
            <article key={item.id} className={`rounded-xl border bg-white overflow-hidden ${status === "Finding" ? "border-red-300" : status === "Pass" ? "border-green-300" : "border-[#c9d5e6]"}`}>
              <button className="w-full flex items-start justify-between p-4 text-left hover:bg-[#f8fbff] transition-colors"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              >
                <div className="flex-1 pr-3">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${SEV_COLORS[item.severity]}`}>{item.severity}</span>
                    <span className="rounded-full bg-[#edf3fc] text-[#1e3d6c] px-2 py-0.5 text-xs">{AREA_LABELS[item.area]}</span>
                    {status !== "Not reviewed" && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status === "Pass" ? "bg-green-100 text-green-700" : status === "Finding" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>{status}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#10203d]">{item.title}</p>
                  <p className="mt-0.5 text-xs text-[#4a6080] italic">{item.question}</p>
                </div>
                <span className="text-[#3a5480] text-sm shrink-0">{expanded === item.id ? "▲" : "▼"}</span>
              </button>

              {expanded === item.id && (
                <div className="border-t border-[#e1e8f3] p-4 space-y-3">
                  <div className="rounded-md bg-[#f8fbff] border border-[#d8e0ed] p-3">
                    <p className="text-xs font-semibold text-[#3a5480] mb-1">What to check</p>
                    <p className="text-sm text-[#273f67]">{item.guidance}</p>
                  </div>
                  <div className="rounded-md bg-green-50 border border-green-200 p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Evidence required</p>
                    <p className="text-sm text-[#1a3a1a]">{item.evidence}</p>
                  </div>
                  {item.napta && (
                    <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                      <p className="text-xs font-semibold text-blue-700 mb-1">NAPTA-specific note</p>
                      <p className="text-sm text-blue-900">{item.napta}</p>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {(["Pass", "Finding", "N/A", "Not reviewed"] as FindingStatus[]).map((s) => (
                      <button key={s} onClick={() => setFinding(item.id, s)}
                        className={`rounded-md px-3 py-1 text-xs font-medium border transition-colors ${status === s ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-white text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {openFindings > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">Open findings ({openFindings}) — resolve before production deployment:</p>
          <ul className="mt-2 space-y-1">
            {REVIEW_ITEMS.filter((i) => findings[i.id] === "Finding").map((i) => (
              <li key={i.id} className="text-xs text-red-600 flex gap-2">
                <span className={`rounded-full border px-2 py-0.5 font-semibold ${SEV_COLORS[i.severity]}`}>{i.severity}</span>
                <span>{i.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}