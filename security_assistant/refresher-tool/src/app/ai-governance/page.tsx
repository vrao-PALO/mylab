"use client";
import { useState } from "react";
import { stories } from "@/lib/knowledge-base";

const story = stories.find((s) => s.id === "story-13")!;

type Domain = "All" | "ai-scoring" | "video" | "identity" | "mobile" | "data-governance" | "pdpa";
type Stance = "Not reviewed" | "Compliant" | "Gap" | "N/A";

const DOMAIN_LABELS: Record<Domain, string> = {
  All: "All domains",
  "ai-scoring": "AI scoring & fairness",
  video: "Video recording & access",
  identity: "Identity & session",
  mobile: "Mobile security",
  "data-governance": "Data governance",
  pdpa: "PDPA obligations",
};

interface GovernanceCheck {
  id: string;
  rfqRef?: string;
  domain: Domain;
  title: string;
  requirement: string;
  controls: string;
  evidence: string;
  frameworks: string[];
  pdpaRisk?: string;
}

const CHECKS: GovernanceCheck[] = [
  // AI scoring
  { id: "g1", domain: "ai-scoring", rfqRef: "S-04", title: "AI scoring model explainability", requirement: "The AI scoring engine must be able to explain, in plain language, why a candidate received their score for each dimension assessed.", controls: "Document the model decision logic or scorecard weights. Where black-box models are used, implement an explanation layer (e.g. SHAP values or rule-based post-processor) that generates candidate-readable feedback.", evidence: "Model decision documentation, explanation output sample, code review of feedback generation logic.", frameworks: ["IMDA AI Governance", "PDPA"] },
  { id: "g2", domain: "ai-scoring", rfqRef: "S-09", title: "Bias and fairness threshold policy", requirement: "The platform must define quantitative fairness thresholds across demographic groups and test model outputs against them before release.", controls: "Define accepted disparity thresholds (e.g. max 5% score divergence across gender/age/nationality groups). Run fairness tests as part of model CI pipeline. Fail deployment if thresholds breached.", evidence: "Fairness threshold policy document, bias test results per model release, CI pipeline gate evidence.", frameworks: ["IMDA AI Governance", "OWASP ASVS"], pdpaRisk: "Biased scoring on protected characteristics (nationality, age, gender) may breach PDPA's data accuracy obligation and create unlawful discrimination exposure." },
  { id: "g3", domain: "ai-scoring", rfqRef: "S-09", title: "Human override and fallback mechanism", requirement: "A human reviewer must be able to override or set aside any AI score. A fallback mechanism must exist if the model is unavailable.", controls: "Implement a reviewer override UI with mandatory justification field. Define fallback procedure (manual scoring or delay in result release). Log all overrides with reviewer identity and reason.", evidence: "Override UI presence, override audit log entries, fallback procedure SOP.", frameworks: ["IMDA AI Governance"] },
  { id: "g4", domain: "ai-scoring", rfqRef: "S-04", title: "Model regression and drift monitoring", requirement: "AI model performance must be monitored post-deployment. Significant drift or accuracy degradation must trigger a formal review.", controls: "Define baseline model metrics (precision, recall, F1). Implement automated drift detection on production scoring distributions. Alert and review process if drift exceeds threshold.", evidence: "Model performance baseline document, drift monitoring configuration, alert rule definitions, review records.", frameworks: ["IMDA AI Governance", "CIS Controls"] },
  // Video
  { id: "g5", domain: "video", rfqRef: "S-03", title: "Video recordings encrypted at rest", requirement: "All interview video recordings must be encrypted at rest using AES-256 or equivalent.", controls: "Enable server-side encryption on storage (Azure Blob Storage SSE with CMK preferred). Do not store unencrypted video on any intermediary system.", evidence: "Storage encryption configuration, CMK key vault setup, data-at-rest encryption policy.", frameworks: ["PDPA", "ISO 27001"], pdpaRisk: "Video recordings contain biometric data (face, voice). PDPA treats this as personal data requiring protection." },
  { id: "g6", domain: "video", rfqRef: "S-10", title: "Video access control — candidate vs reviewer isolation", requirement: "Candidates must not be able to access other candidates' recordings. Reviewers must only see recordings assigned to them.", controls: "Enforce per-resource access control at the API layer. Generate time-limited SAS URLs (expiry ≤ session/interview length + 15 min) for video playback. Validate user session before issuing SAS URL.", evidence: "API access control code review, SAS URL expiry policy, access control test results.", frameworks: ["OWASP ASVS", "PDPA"] },
  { id: "g7", domain: "video", rfqRef: "S-10", title: "Video retention and secure disposal", requirement: "Video recordings must be retained only for the period defined in the data retention policy and securely deleted at expiry.", controls: "Define retention period per recording category (e.g. 6 months post-assessment). Configure automated lifecycle deletion rules on storage. Log deletion events. Candidates must be informed of retention period.", evidence: "Retention policy, automated lifecycle rule configuration, deletion log, candidate privacy notice referencing retention.", frameworks: ["PDPA", "ISO 27001"], pdpaRisk: "Retaining personal data (including video) beyond stated purpose is a PDPA breach. Disposal must be logged and irreversible." },
  { id: "g8", domain: "video", rfqRef: "S-03", title: "Recording consent capture and log", requirement: "Candidates must explicitly consent to video recording before the interview begins. Consent must be logged with a timestamp.", controls: "Add a consent screen at interview start. Record consent acceptance (candidate ID + timestamp + consent version) in the audit log. Allow withdrawal notice procedure.", evidence: "Consent screen UI, consent log entries, consent withdrawal procedure.", frameworks: ["PDPA"] },
  // Identity
  { id: "g9", domain: "identity", rfqRef: "S-01", title: "SSO via SAML 2.0 or OIDC", requirement: "All user authentication must go through the institution's IdP using SAML 2.0 or OpenID Connect. No local credential stores.", controls: "Integrate with client IdP (e.g. Microsoft Entra / Active Directory Federation Services). Enforce SSO as the only login path — disable password-based local login in production.", evidence: "IdP integration config, SSO-only policy, no local login evidence, test login via IdP.", frameworks: ["OWASP ASVS", "CIS Controls"] },
  { id: "g10", domain: "identity", rfqRef: "S-01", title: "Session timeout and inactivity handling", requirement: "Sessions must expire after a defined inactivity period. Re-authentication must be required on session expiry during an active interview.", controls: "Implement session idle timeout (recommended: 30 min for admin, 60 min for candidate during interview). Provide a session expiry warning with extend-or-save option before an interview is terminated.", evidence: "Session configuration, timeout policy, inactivity warning UI, re-auth flow test.", frameworks: ["OWASP ASVS"] },
  { id: "g11", domain: "identity", rfqRef: "S-01", title: "Role-based dashboard access validation", requirement: "Each role (candidate, reviewer, admin) must be validated server-side. No client-side role gating as sole control.", controls: "Enforce RBAC at the API layer for every route. Three distinct roles: candidate (own records only), reviewer (assigned records only), admin (platform management). Verify server-side on every request.", evidence: "API RBAC configuration, role matrix document, penetration test results for privilege escalation.", frameworks: ["OWASP ASVS", "CIS Controls"] },
  // Mobile
  { id: "g12", domain: "mobile", title: "Camera and microphone permissions scoped per session", requirement: "Camera and microphone access must be requested only at interview start and released on interview end or tab close.", controls: "Request permissions only at interview start. Programmatically release media streams on interview completion, page unload, and session expiry. Do not cache stream handles between sessions.", evidence: "Browser/mobile permission request timing, stream release code review, MASVS assessment output.", frameworks: ["OWASP MASVS", "OWASP MASTG"] },
  { id: "g13", domain: "mobile", title: "Secure browser environment for recordings", requirement: "The mobile browser environment must not allow recording content to leak to the local device camera roll or clipboard.", controls: "Disable download and screenshot of video content via browser API controls. Ensure media is streamed to backend and not written to device storage. Review OWASP MASVS Mobile Browser controls.", evidence: "Browser security controls config, MASVS assessment checklist completion, penetration test evidence.", frameworks: ["OWASP MASVS"] },
  // Data governance
  { id: "g14", domain: "data-governance", rfqRef: "S-01", title: "CV/JD data scoped to assessment purpose only", requirement: "Resume (CV) and job description (JD) data uploaded for an interview must be used only for that interview's AI processing. Not retained for other purposes.", controls: "Define data purpose statement. Do not use CV/JD data to train other models without re-consent. Apply purpose limitation tagging to CV/JD records.", evidence: "Purpose limitation policy, data flow diagram showing CV/JD scope, no cross-purpose usage evidence.", frameworks: ["PDPA"], pdpaRisk: "PDPA Section 18 purpose limitation: data collected for hiring assessment cannot be repurposed for analytics, job matching, or model training without fresh consent." },
  { id: "g15", domain: "data-governance", title: "AI model training data governance", requirement: "Any candidate data used to train or fine-tune AI models must be anonymised, consented, and governed by a formal data policy.", controls: "Separate training data pipeline from production data. Anonymise all candidate identifiers before training data ingest. Document consent basis and data lineage for all training samples.", evidence: "Training data anonymisation config, consent record for training data usage, data lineage documentation, privacy impact assessment.", frameworks: ["PDPA", "IMDA AI Governance"] },
  // PDPA
  { id: "g16", domain: "pdpa", title: "Cross-border data transfer assessment", requirement: "If any candidate data (video, CV, scores) is processed or stored outside Singapore, a PDPA cross-border transfer assessment must be completed.", controls: "Map all data processing locations. For any offshore processing: confirm equivalent protection standard of destination country or obtain contractual protections. Document assessment outcome.", evidence: "Data residency map, cross-border transfer assessment record, contractual clauses with offshore processors.", frameworks: ["PDPA"], pdpaRisk: "PDPA cross-border transfer obligation (Section 26): data controller must ensure comparable protection in destination country or apply safeguards." },
  { id: "g17", domain: "pdpa", title: "Privacy notice presented before data collection", requirement: "Candidates must be shown a clear privacy notice before submitting any personal data (CV, video, identity).", controls: "Present privacy notice at account creation and at interview start. Privacy notice must cover: data collected, purpose, retention period, sharing, and contact for access/correction requests.", evidence: "Privacy notice text, UI confirmation screen, version control for notice updates.", frameworks: ["PDPA"] },
  { id: "g18", domain: "pdpa", title: "Data subject access and correction rights", requirement: "Candidates must be able to request access to their personal data and correct inaccuracies.", controls: "Implement a formal access/correction request process. Acknowledge requests within 30 days. Provide a contact channel in the privacy notice. Log all requests and outcomes.", evidence: "Access/correction request procedure, request log, privacy notice contact channel.", frameworks: ["PDPA"] },
];

const SEV_COLORS: Record<Stance, string> = {
  "Not reviewed": "bg-gray-100 text-gray-500 border-gray-300",
  Compliant: "bg-green-100 text-green-700 border-green-300",
  Gap: "bg-red-100 text-red-700 border-red-300",
  "N/A": "bg-gray-100 text-gray-400 border-gray-200",
};

export default function AIGovernancePage() {
  const [domain, setDomain] = useState<Domain>("All");
  const [stances, setStances] = useState<Record<string, Stance>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = CHECKS.filter((c) => domain === "All" || c.domain === domain);
  const gaps = Object.values(stances).filter((v) => v === "Gap").length;
  const compliant = Object.values(stances).filter((v) => v === "Compliant").length;

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold text-[#10203d]">13 AI Platform Governance Assessment</h2>
            <p className="mt-1 text-sm text-[#33496f]">{story.goal}</p>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap">
            <span className="rounded-full bg-[#edf3fc] px-3 py-1 text-xs font-semibold text-[#1f4f97]">{CHECKS.length} controls</span>
            {gaps > 0 && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">{gaps} gap{gaps > 1 ? "s" : ""}</span>}
            {compliant > 0 && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{compliant} compliant</span>}
          </div>
        </div>
        <div className="mt-3 rounded-md bg-blue-50 border border-blue-200 px-4 py-2 text-xs text-blue-800">
          <strong>Context:</strong> Singapore education institution AI mock interview platform. RFQ items S-01 (resume/JD upload), S-03 (video recording), S-04 (AI scoring), S-09 (fairness/bias), S-10 (video access/disposal). Frameworks: Singapore PDPA, IMDA AI Governance Framework, OWASP ASVS, OWASP MASVS, CIS Controls.
        </div>
      </header>

      <div className="flex flex-wrap gap-1">
        {(Object.keys(DOMAIN_LABELS) as Domain[]).map((d) => (
          <button key={d} onClick={() => setDomain(d)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${domain === d ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
          >{DOMAIN_LABELS[d]}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((check) => {
          const stance = stances[check.id] ?? "Not reviewed";
          return (
            <article key={check.id} className={`rounded-xl border bg-white overflow-hidden ${stance === "Gap" ? "border-red-300" : stance === "Compliant" ? "border-green-300" : "border-[#c9d5e6]"}`}>
              <button className="w-full flex items-start justify-between p-4 text-left hover:bg-[#f8fbff] transition-colors"
                onClick={() => setExpanded(expanded === check.id ? null : check.id)}
              >
                <div className="flex-1 pr-3">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    {check.rfqRef && <span className="rounded-full bg-[#edf3fc] text-[#1e3d6c] px-2 py-0.5 text-xs font-mono">{check.rfqRef}</span>}
                    <span className="rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">{DOMAIN_LABELS[check.domain]}</span>
                    {stance !== "Not reviewed" && (
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${SEV_COLORS[stance]}`}>{stance}</span>
                    )}
                    {check.pdpaRisk && <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs">⚠ PDPA risk</span>}
                  </div>
                  <p className="text-sm font-semibold text-[#10203d]">{check.title}</p>
                  <p className="mt-0.5 text-xs text-[#4a6080] italic">{check.requirement}</p>
                </div>
                <span className="text-[#3a5480] text-sm shrink-0">{expanded === check.id ? "▲" : "▼"}</span>
              </button>

              {expanded === check.id && (
                <div className="border-t border-[#e1e8f3] p-4 space-y-3">
                  <div className="rounded-md bg-[#f8fbff] border border-[#d8e0ed] p-3">
                    <p className="text-xs font-semibold text-[#3a5480] mb-1">Required controls</p>
                    <p className="text-sm text-[#273f67]">{check.controls}</p>
                  </div>
                  <div className="rounded-md bg-green-50 border border-green-200 p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Evidence required</p>
                    <p className="text-sm text-[#1a3a1a]">{check.evidence}</p>
                  </div>
                  {check.pdpaRisk && (
                    <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                      <p className="text-xs font-semibold text-amber-700 mb-1">PDPA risk note</p>
                      <p className="text-sm text-amber-900">{check.pdpaRisk}</p>
                    </div>
                  )}
                  <div className="flex gap-1 flex-wrap">
                    {check.frameworks.map((f) => (
                      <span key={f} className="rounded-full bg-[#edf3fc] text-[#1f4f97] px-2 py-0.5 text-xs">{f}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(["Compliant", "Gap", "N/A", "Not reviewed"] as Stance[]).map((s) => (
                      <button key={s} onClick={() => setStances((prev) => ({ ...prev, [check.id]: s }))}
                        className={`rounded-md px-3 py-1 text-xs font-medium border transition-colors ${stance === s ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-white text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {gaps > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">Identified gaps ({gaps}) — remediate before go-live:</p>
          <ul className="mt-2 space-y-1">
            {CHECKS.filter((c) => stances[c.id] === "Gap").map((c) => (
              <li key={c.id} className="text-xs text-red-600 flex gap-2 items-center">
                {c.rfqRef && <span className="rounded-full bg-red-100 border border-red-300 px-2 py-0.5 font-mono">{c.rfqRef}</span>}
                <span>{c.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}