import type { RequirementIntake } from "@/types/domain";
import type { RoleMode } from "@/components/role-mode";
import { frameworksByIndustry } from "@/lib/data/frameworks";

export interface IntakeGuidance {
  recommendedRoleMode: RoleMode;
  summary: string;
  frameworkIds: string[];
  priorityThemes: string[];
  clarificationQuestions: string[];
  nextFocus: string[];
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function isYes(
  value:
    | RequirementIntake["usesAi"]
    | RequirementIntake["storesPersonalData"]
    | RequirementIntake["storesFinancialData"]
    | RequirementIntake["hasPrivilegedAccess"],
) {
  return value === "Yes";
}

function getRecommendedRoleMode(intake: RequirementIntake): RoleMode {
  if (intake.responderPersona === "Internal Auditor") return "Auditor";
  if (intake.responderPersona === "Presales Lead") return "Presales";
  return "Architect";
}

export function deriveIntakeGuidance(intake: RequirementIntake): IntakeGuidance {
  const frameworkIds = [...(frameworksByIndustry[intake.industry] ?? [])];

  if (isYes(intake.storesPersonalData) && !frameworkIds.includes("pdpa")) {
    frameworkIds.push("pdpa");
  }

  if (intake.externalExposure === "Internet Facing" && !frameworkIds.includes("owasp-asvs")) {
    frameworkIds.push("owasp-asvs");
  }

  if ((intake.deliveryModel === "New SaaS" || intake.deliveryModel === "Existing SaaS") && intake.industry !== "Education" && !frameworkIds.includes("soc2")) {
    frameworkIds.push("soc2");
  }

  if (isYes(intake.usesAi) && !frameworkIds.includes("nist-800-53")) {
    frameworkIds.push("nist-800-53");
  }

  if (intake.industry === "GovTech" && !frameworkIds.includes("mtcs-tier3")) {
    frameworkIds.push("mtcs-tier3");
  }

  const priorityThemes = unique([
    intake.externalExposure === "Internet Facing"
      ? "Internet-facing attack surface, authentication hardening, and VAPT readiness"
      : "Internal trust boundaries, segmentation, and least-privilege design",
    isYes(intake.storesPersonalData) || isYes(intake.storesFinancialData)
      ? "Data classification, retention, encryption, and transfer safeguards"
      : "System inventory, dependency hygiene, and baseline logging",
    isYes(intake.hasPrivilegedAccess)
      ? "Privileged access control, MFA, server-side authorization, and audit trails"
      : "Role design, approval workflow, and operational accountability",
    intake.deliveryModel === "Third-Party Service" || intake.deliveryModel === "Existing SaaS"
      ? "Vendor due diligence, shared-responsibility boundaries, and evidence requests"
      : "Security requirements in architecture, SDLC, and deployment controls",
    isYes(intake.usesAi)
      ? "AI governance, human override, explainability, and model/data handling"
      : "Operational resilience, incident handling, and control ownership",
  ]);

  const clarificationQuestions = unique([
    intake.dataResidency === "Unknown"
      ? "Where must production and backup data reside, and is cross-border transfer allowed?"
      : "What are the approved residency and transfer boundaries for production and support data?",
    intake.deliveryModel === "Third-Party Service" || intake.deliveryModel === "Existing SaaS"
      ? "Which security attestations, VAPT reports, and sub-processor disclosures can the vendor provide?"
      : "Which internal teams own identity, logging, and release approvals for this solution?",
    intake.externalExposure === "Internet Facing"
      ? "What public endpoints exist, and what pre-go-live testing is mandatory before exposure?"
      : "What partner or administrator pathways still bypass normal user controls?",
    isYes(intake.usesAi)
      ? "How are model decisions reviewed, challenged, and overridden when confidence is low or bias is detected?"
      : "What monitoring, alerting, and response path exists for security-significant events?",
    isYes(intake.storesPersonalData)
      ? "What is the lawful purpose, retention period, and deletion trigger for personal data?"
      : "What evidence will prove the solution does not introduce hidden sensitive-data handling?",
  ]);

  const nextFocus = unique([
    intake.engagementType === "RFP" || intake.engagementType === "RFQ"
      ? "Prepare a concise client-facing control narrative and make all assumptions explicit in the bid response"
      : "Turn the intake into a concrete scope statement before moving into detailed review",
    "Prefill scope with the hosting model, exposure level, and likely privileged roles",
    "Use the inputs stage to confirm whether data sensitivity and third-party assumptions are actually true",
    isYes(intake.hasPrivilegedAccess)
      ? "Plan for privileged-user evidence early: RBAC matrix, MFA enforcement, and approval records"
      : "Focus downstream evidence on architecture, logging, and change control",
  ]);

  const summary = `${intake.responderPersona} triage for a ${intake.deliveryModel.toLowerCase()} ${intake.engagementType.toLowerCase()} in ${intake.industry}. Prioritize ${priorityThemes[0].toLowerCase()} and ${priorityThemes[1].toLowerCase()}.`;

  return {
    recommendedRoleMode: getRecommendedRoleMode(intake),
    summary,
    frameworkIds: unique(frameworkIds),
    priorityThemes,
    clarificationQuestions,
    nextFocus,
  };
}