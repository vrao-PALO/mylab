"use client";
import { useState } from "react";
import { getFrameworkById } from "@/lib/knowledge-base";

type Area = "All" | "citizen-data" | "access" | "logging" | "inter-agency" | "continuity" | "procurement";

const AREA_LABELS: Record<Area, string> = {
  All: "All areas",
  "citizen-data": "Citizen data",
  access: "Access control",
  logging: "Logging & accountability",
  "inter-agency": "Inter-agency",
  continuity: "Service continuity",
  procurement: "Vendor / procurement",
};

interface GovItem {
  id: string;
  title: string;
  description: string;
  controls: string;
  evidence: string;
  areas: Area[];
  critical: boolean;
}

const GOV_ITEMS: GovItem[] = [
  {
    id: "g1", title: "PDPA and Citizen Data Protection",
    description: "All personal data of Singapore citizens and residents must be handled under PDPA obligations: consent, purpose limitation, protection, retention, transfer, and breach notification. Government systems must embed privacy-by-design at architecture level.",
    controls: "Data classification for citizen records; purpose-limitation controls in API layer; retention schedules enforced; PDPA consent mechanism for data collection; cross-border transfer assessment where data leaves Singapore.",
    evidence: "Data Protection Impact Assessment (DPIA), privacy notice, consent mechanism, retention schedule, disposal records, cross-border transfer assessment.",
    areas: ["citizen-data"], critical: true,
  },
  {
    id: "g2", title: "IM8 Security Policies — ICT&SS",
    description: "Singapore Government ICT & Smart Systems (ICT&SS) IM8 clauses set mandatory baseline security controls for all government and statutory board systems. IM8 covers system classification, access management, vulnerability management, incident management, and more.",
    controls: "IM8 system classification (Restricted/Confidential/Sensitive); mandatory security baseline per classification tier; annual security review; VAPT compliance per IM8 schedule.",
    evidence: "IM8 system classification register, security baseline checklist per tier, VAPT report, annual security review record.",
    areas: ["citizen-data", "access"], critical: true,
  },
  {
    id: "g3", title: "Zero Trust Architecture for Government (GovZTA)",
    description: "Singapore Government Zero Trust Architecture (GovZTA) mandates that trust is never implicit — all access requests are authenticated, authorised, and continuously validated regardless of network location. Officers accessing government systems must be authenticated per device and session.",
    controls: "Strong MFA for all officer accounts; device compliance checks before access; session validation at every API call; network microsegmentation; lateral movement detection.",
    evidence: "MFA enrollment records, device management configuration, zero-trust access policy, network segmentation diagram, session log review.",
    areas: ["access"], critical: true,
  },
  {
    id: "g4", title: "Officer / Admin Role Separation",
    description: "Officer-facing portals and admin functions must be clearly separated. Citizen-facing workflows must not share the same identity or access path as privileged admin workflows. Separation of duties must be enforced for sensitive government operations.",
    controls: "Separate identity providers or role scopes for officers vs citizens; admin UI and API endpoints behind stricter access gates; SoD matrix for sensitive government operations; admin session recording.",
    evidence: "Role-access matrix, SoD register, identity configuration, admin access approval workflow evidence.",
    areas: ["access"], critical: true,
  },
  {
    id: "g5", title: "Privacy-Aware Logging and Accountability",
    description: "Government systems must log all officer access to citizen data. Logs must be tamper-evident, retained per government retention policy, and auditable for investigation. Logs must not contain raw sensitive citizen data — only references and access metadata.",
    controls: "Audit logging of all officer access to citizen records; log fields limited to who, what, when, outcome — no raw PII in log payloads; tamper-evident log storage; review cadence defined.",
    evidence: "Log configuration, sample log review (confirming no PII leakage), retention policy, log tamper protection evidence.",
    areas: ["logging", "citizen-data"], critical: true,
  },
  {
    id: "g6", title: "Inter-Agency Data Sharing Boundaries",
    description: "Data sharing between government agencies must be governed by formal data sharing agreements, purpose limitations, and access controls. Data must not flow across agency boundaries without explicit authorisation and data classification review.",
    controls: "Data sharing agreement (DSA) for each inter-agency integration; purpose limitation enforced at API gateway; data classification review before sharing; audit log of all inter-agency data exchanges.",
    evidence: "Data sharing agreements, API gateway access policy, data classification for shared data, inter-agency exchange audit log.",
    areas: ["inter-agency", "citizen-data"], critical: false,
  },
  {
    id: "g7", title: "Public Availability and Service Continuity",
    description: "Citizen-facing services require high availability commitments. Downtime affects public trust and government service delivery. RTO/RPO must be defined per service criticality tier and aligned to IM8 continuity requirements.",
    controls: "RTO/RPO defined per service tier; availability monitoring with alerting; DR plan tested annually; incident communication plan for citizen-impacting outages.",
    evidence: "SLA / availability commitment, DR plan, DR test results, incident communication procedure.",
    areas: ["continuity"], critical: false,
  },
  {
    id: "g8", title: "Government Vendor and Procurement Security",
    description: "GovTech and statutory board procurements require vendors to meet security baseline requirements. Vendors handling government data must demonstrate controls equivalent to the system classification tier. VAPT and security assessments are often contractually mandated.",
    controls: "Vendor security requirements in tender documents; vendor VAPT obligation before go-live; sub-contractor disclosure requirement; government data handling obligations in contract; periodic vendor review.",
    evidence: "Vendor security clauses in contract, VAPT requirement in scope of works, sub-contractor register, vendor periodic review records.",
    areas: ["procurement"], critical: false,
  },
];

export default function GovTechIndustryPage() {
  const [area, setArea] = useState<Area>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const iso = getFrameworkById("iso27001");
  const filtered = GOV_ITEMS.filter((i) => area === "All" || i.areas.includes(area));

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">GovTech Overlay Guidance</h2>
        <p className="mt-1 text-sm text-[#33496f]">
          Security and compliance guidance for Singapore Government and statutory board engagements. Covers PDPA, IM8, GovZTA, inter-agency data sharing, and citizen-facing service controls.
        </p>
        <div className="mt-3 rounded-md bg-[#edf3fc] px-4 py-2 text-xs text-[#2a4a80]">
          <strong>Applicable frameworks:</strong> PDPA · ICT&SS IM8 · Singapore GovZTA · ISO 27001 · OWASP ASVS · NIST SP 800-53 · CIS Controls v8 · MTCS Tier 3
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
        {filtered.map((item) => (
          <article key={item.id} className={`rounded-xl border bg-white overflow-hidden ${item.critical ? "border-[#1f4f97]" : "border-[#c9d5e6]"}`}>
            <button className="w-full flex items-start justify-between p-5 text-left hover:bg-[#f8fbff] transition-colors"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <div className="flex-1 pr-4">
                <div className="flex gap-2 mb-1 flex-wrap">
                  {item.critical && <span className="rounded-full bg-[#1f4f97] text-white px-2 py-0.5 text-xs font-semibold">Mandatory baseline</span>}
                  {item.areas.filter((a) => a !== "All").map((a) => (
                    <span key={a} className="rounded-full bg-[#edf3fc] text-[#1e3d6c] px-2 py-0.5 text-xs">{AREA_LABELS[a]}</span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-[#10203d]">{item.title}</p>
                <p className="mt-0.5 text-xs text-[#4a6080] line-clamp-2">{item.description}</p>
              </div>
              <span className="text-[#3a5480] text-sm shrink-0">{expanded === item.id ? "▲" : "▼"}</span>
            </button>

            {expanded === item.id && (
              <div className="border-t border-[#e1e8f3] p-5 space-y-3">
                <p className="text-sm text-[#273f67]">{item.description}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-md bg-[#f8fbff] border border-[#d8e0ed] p-3">
                    <p className="text-xs font-semibold text-[#3a5480] mb-1">Required controls</p>
                    <p className="text-sm text-[#273f67]">{item.controls}</p>
                  </div>
                  <div className="rounded-md bg-green-50 border border-green-200 p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Evidence expected</p>
                    <p className="text-sm text-[#1a3a1a]">{item.evidence}</p>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">GovTech presales red flags — when to escalate to a security architect</h3>
        <ul className="space-y-1">
          {[
            "The system handles citizen NRIC, health, or welfare data",
            "The system integrates with another government agency or Singpass",
            "The system is classified Restricted or above under IM8",
            "The client requires MTCS Tier 3 certification from cloud vendors",
            "The system is internet-facing and handles officer authentication",
            "The client requires a formal DPIA or IM8 self-assessment as part of procurement",
          ].map((flag, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#273f67]">
              <span className="text-red-500 shrink-0">🚩</span><span>{flag}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}