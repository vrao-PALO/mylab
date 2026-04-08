import { deriveIntakeGuidance } from "@/lib/intake-guidance";
import { requirementIntakeSchema } from "@/lib/schemas";
import type { RequirementIntake } from "@/types/domain";
import type {
  ControlMappingState,
  InputDataEntry,
  InputsFormState,
  IntegrationEntry,
  MappingRow,
  RiskEntry,
  RiskRegisterState,
  ScopeFormState,
} from "@/lib/workflow-state";

const PREFILL_VERSION = "v1";

export const PREFILL_MARKER_KEYS = {
  scope: `sa-prefill-scope-${PREFILL_VERSION}`,
  inputs: `sa-prefill-inputs-${PREFILL_VERSION}`,
  controlMapping: `sa-prefill-control-mapping-${PREFILL_VERSION}`,
  riskRegister: `sa-prefill-risk-register-${PREFILL_VERSION}`,
} as const;

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function joinList(values: string[]) {
  return unique(values.filter(Boolean)).join(", ");
}

function fillIfBlank(current: string, fallback: string) {
  return current.trim() ? current : fallback;
}

function mergeById<T extends { id: string }>(current: T[], additions: T[]) {
  const existing = new Set(current.map((item) => item.id));
  return [...current, ...additions.filter((item) => !existing.has(item.id))];
}

function parseCompleteIntake(value: Partial<RequirementIntake> | undefined): RequirementIntake | null {
  const parsed = requirementIntakeSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function mapScopeIndustry(industry: RequirementIntake["industry"]): ScopeFormState["industry"] {
  if (industry === "FI" || industry === "GovTech") return industry;
  return "Generic";
}

function mapControlIndustry(industry: RequirementIntake["industry"]): ControlMappingState["industry"] {
  if (industry === "FI" || industry === "GovTech" || industry === "Education" || industry === "Real Estate" || industry === "Generic") {
    return industry;
  }
  return "Generic";
}

function mapHosting(hostingModel: RequirementIntake["hostingModel"]): string[] {
  if (hostingModel === "Cloud Hosted") return ["Cloud"];
  if (hostingModel === "Client Hosted") return ["On-premises"];
  if (hostingModel === "Hybrid") return ["Cloud", "On-premises", "Hybrid"];
  return [];
}

function mapExposure(externalExposure: RequirementIntake["externalExposure"]): string {
  if (externalExposure === "Internet Facing") return "Internet-facing";
  if (externalExposure === "Partner Facing") return "Both";
  return "Internal only";
}

function getSuggestedEnvironments(intake: RequirementIntake) {
  if (intake.deliveryModel === "Third-Party Service" || intake.deliveryModel === "Existing SaaS") {
    return ["prod"];
  }
  return ["dev", "test", "prod"];
}

function getSuggestedDataDomains(intake: RequirementIntake) {
  const domains = ["Application data", "Security logs"];

  if (intake.storesPersonalData === "Yes") domains.push("PII");
  if (intake.storesFinancialData === "Yes") domains.push("Financial data");
  if (intake.hasPrivilegedAccess === "Yes") domains.push("Audit logs");
  if (intake.usesAi === "Yes") domains.push("AI prompts and outputs");

  return domains;
}

function getSuggestedRoles(intake: RequirementIntake) {
  const roles = ["End User", "Support User"];

  if (intake.hasPrivilegedAccess === "Yes") roles.push("Administrator");
  if (intake.engagementType === "Internal Audit") roles.push("Auditor");

  return roles;
}

function getSuggestedIntegrations(intake: RequirementIntake) {
  const integrations = ["Identity provider", "Monitoring and logging platform"];

  if (intake.externalExposure !== "Internal Only") integrations.push("Public ingress or API gateway");
  if (intake.deliveryModel === "Third-Party Service" || intake.deliveryModel === "Existing SaaS") integrations.push("Vendor-managed service boundary");
  if (intake.usesAi === "Yes") integrations.push("AI inference or model service");

  return integrations;
}

function getPrefilledDataEntries(intake: RequirementIntake): InputDataEntry[] {
  const entries: InputDataEntry[] = [];

  if (intake.storesPersonalData === "Yes") {
    entries.push({
      id: "prefill-data-personal",
      name: "Customer or employee personal data",
      classification: "PII",
      regulation: "PDPA",
      retention: "Per approved retention schedule",
      controls: "Consent, purpose limitation, retention control, access restriction, disposal evidence",
      hasAi: intake.usesAi === "Yes",
      highRisk: true,
    });
  }

  if (intake.storesFinancialData === "Yes") {
    entries.push({
      id: "prefill-data-financial",
      name: "Financial or regulated transaction data",
      classification: "FINANCIAL",
      regulation: intake.industry === "FI" ? "MAS TRM, PDPA" : "PDPA, ISO 27001",
      retention: "Per finance and records schedule",
      controls: "Least privilege, MFA for admin access, masking where needed, audit logging",
      hasAi: false,
      highRisk: true,
    });
  }

  if (intake.hasPrivilegedAccess === "Yes" || intake.engagementType === "Internal Audit") {
    entries.push({
      id: "prefill-data-audit",
      name: "Audit and administrative activity logs",
      classification: "AUDIT",
      regulation: intake.industry === "FI" ? "MAS TRM, ISO 27001" : "ISO 27001, NIST 800-53",
      retention: "Retain per audit policy",
      controls: "Tamper protection, restricted access, alerting, evidence retention",
      hasAi: false,
      highRisk: intake.engagementType === "Internal Audit",
    });
  }

  if (intake.usesAi === "Yes") {
    entries.push({
      id: "prefill-data-ai",
      name: "AI prompts, model inputs, and generated outputs",
      classification: intake.storesPersonalData === "Yes" ? "PII" : "CONFIDENTIAL",
      regulation: "NIST 800-53, PDPA",
      retention: "Define explicit AI retention boundary",
      controls: "Input logging, output review, override path, model monitoring, restricted access",
      hasAi: true,
      highRisk: true,
    });
  }

  return entries;
}

function getPrefilledIntegrations(intake: RequirementIntake): IntegrationEntry[] {
  const integrations: IntegrationEntry[] = [
    {
      id: "prefill-integration-identity",
      source: "Identity provider",
      destination: "Application and admin workflows",
      protocol: "HTTPS/OIDC/SAML",
      authMethod: "Federated identity",
      sensitivity: intake.hasPrivilegedAccess === "Yes" ? "CONFIDENTIAL" : "INTERNAL",
      thirdParty: false,
    },
  ];

  if (intake.externalExposure !== "Internal Only") {
    integrations.push({
      id: "prefill-integration-public",
      source: intake.externalExposure === "Partner Facing" ? "Partner network" : "Public client traffic",
      destination: "Application edge or API layer",
      protocol: "HTTPS/TLS",
      authMethod: intake.hasPrivilegedAccess === "Yes" ? "MFA + session controls" : "User authentication",
      sensitivity: intake.storesPersonalData === "Yes" || intake.storesFinancialData === "Yes" ? "CONFIDENTIAL" : "INTERNAL",
      thirdParty: false,
    });
  }

  if (intake.deliveryModel === "Third-Party Service" || intake.deliveryModel === "Existing SaaS") {
    integrations.push({
      id: "prefill-integration-vendor",
      source: "Vendor-managed platform",
      destination: "Primary business workflow",
      protocol: "HTTPS/API",
      authMethod: "Service-to-service trust",
      sensitivity: intake.storesFinancialData === "Yes" ? "FINANCIAL" : intake.storesPersonalData === "Yes" ? "PII" : "CONFIDENTIAL",
      thirdParty: true,
    });
  }

  if (intake.usesAi === "Yes") {
    integrations.push({
      id: "prefill-integration-ai",
      source: "Application workflow",
      destination: "AI model or inference service",
      protocol: "HTTPS/API",
      authMethod: "Application token",
      sensitivity: intake.storesPersonalData === "Yes" ? "PII" : "CONFIDENTIAL",
      thirdParty: intake.deliveryModel === "Third-Party Service",
    });
  }

  return integrations;
}

function getPrefilledMappingRows(intake: RequirementIntake): MappingRow[] {
  const guidance = deriveIntakeGuidance(intake);
  const rows: MappingRow[] = [];

  if (intake.externalExposure !== "Internal Only") {
    rows.push({
      id: "prefill-map-public-access",
      requirement: "Public and partner-facing entry points must enforce server-side authorization, strong session handling, and TLS-only transport",
      controls: ["asvs-v4-1", "asvs-v9-1"],
      gap: false,
    });
  }

  if (intake.hasPrivilegedAccess === "Yes") {
    rows.push({
      id: "prefill-map-privileged-access",
      requirement: "Privileged and administrative actions require least privilege, MFA, approval, and full audit logging",
      controls: guidance.frameworkIds.includes("mas-trm")
        ? ["mas-access-1", "mas-logging-1", "nist-ia-2"]
        : ["iso-a5-15", "iso-a8-15", "nist-ia-2"],
      gap: false,
    });
  }

  if (intake.storesPersonalData === "Yes") {
    rows.push({
      id: "prefill-map-personal-data",
      requirement: "Personal data collection, use, retention, disposal, and transfer boundaries must be explicitly governed and evidenced",
      controls: ["pdpa-purpose", "pdpa-retention", "pdpa-protection"],
      gap: false,
    });
  }

  if (intake.storesFinancialData === "Yes") {
    rows.push({
      id: "prefill-map-financial-data",
      requirement: "Financial or regulated data handling must enforce access segregation, logging, and pre-go-live assurance",
      controls: guidance.frameworkIds.includes("mas-trm")
        ? ["mas-access-1", "mas-logging-1", "mas-vapt-1"]
        : ["iso-a5-15", "iso-a8-15", "nist-ra-5"],
      gap: false,
    });
  }

  if (intake.deliveryModel === "Third-Party Service" || intake.deliveryModel === "Existing SaaS") {
    rows.push({
      id: "prefill-map-vendor-assurance",
      requirement: "Vendor-managed services must provide attestations, security evidence, and clear shared-responsibility boundaries",
      controls: guidance.frameworkIds.includes("mas-trm") ? ["mas-3p-1"] : ["soc2-cc8-1", "cis-16"],
      gap: false,
    });
  }

  if (intake.usesAi === "Yes") {
    rows.push({
      id: "prefill-map-ai-governance",
      requirement: "AI-assisted decisions must support human review, explainability, logging, and challenge or override paths",
      controls: [],
      gap: true,
    });
  }

  return rows;
}

function getPrefilledRisks(intake: RequirementIntake): RiskEntry[] {
  const risks: RiskEntry[] = [];

  if (intake.externalExposure !== "Internal Only") {
    risks.push({
      id: "PREFILL-R-001",
      title: "Internet or partner-facing surfaces may not have completed pre-go-live assurance",
      description: "Externally reachable entry points increase the attack surface and require verified authorization, TLS, and assurance testing before release.",
      severity: intake.externalExposure === "Internet Facing" ? "High" : "Medium",
      likelihood: "Medium",
      impact: "Unauthorized access or exploitable edge weaknesses could lead to compromise before operational monitoring is proven.",
      asset: "Application ingress and public API surface",
      owner: "Security Architect",
      status: "Open",
      framework: intake.industry === "FI" ? "OWASP ASVS, MAS TRM 14.1" : "OWASP ASVS, ISO 27001 A.8.8",
      isGoLiveBlocker: intake.externalExposure === "Internet Facing",
    });
  }

  if (intake.hasPrivilegedAccess === "Yes") {
    risks.push({
      id: "PREFILL-R-002",
      title: "Privileged access design may be incomplete or weakly evidenced",
      description: "Administrative pathways need role separation, MFA, approval flow, and audit logging before they can be treated as production-ready.",
      severity: "High",
      likelihood: "Medium",
      impact: "Over-privileged or weakly controlled admin access can bypass normal business controls and materially increase breach risk.",
      asset: "Administrative and privileged user workflows",
      owner: "Platform Team",
      status: "Open",
      framework: intake.industry === "FI" ? "MAS TRM 10.1, NIST IA-2" : "ISO 27001 A.5.15, NIST IA-2",
      isGoLiveBlocker: true,
    });
  }

  if (intake.storesPersonalData === "Yes" && intake.dataResidency === "Unknown") {
    risks.push({
      id: "PREFILL-R-003",
      title: "Data residency and transfer boundary is not yet defined",
      description: "Personal data is in scope but the approved residency and cross-border transfer boundary has not been confirmed.",
      severity: "High",
      likelihood: "Medium",
      impact: "The solution could violate client or regulatory transfer requirements and delay approval.",
      asset: "Personal data stores and backup locations",
      owner: "Data Protection Lead",
      status: "Open",
      framework: "PDPA 26, PDPA 24",
      isGoLiveBlocker: true,
    });
  }

  if (intake.deliveryModel === "Third-Party Service" || intake.deliveryModel === "Existing SaaS") {
    risks.push({
      id: "PREFILL-R-004",
      title: "Vendor evidence pack may be insufficient for shared-responsibility review",
      description: "The engagement depends on a vendor-managed service and may require attestations, testing evidence, and explicit responsibility boundaries before sign-off.",
      severity: "High",
      likelihood: "Medium",
      impact: "Unknown vendor control gaps can invalidate compliance claims or weaken the bid response.",
      asset: "Vendor-managed platform and sub-processors",
      owner: "Vendor Manager",
      status: "Open",
      framework: intake.industry === "FI" ? "MAS TRM 5.1" : "SOC 2 CC8.1, CIS 16",
      isGoLiveBlocker: intake.engagementType === "Assessment" || intake.engagementType === "Internal Audit",
    });
  }

  if (intake.usesAi === "Yes") {
    risks.push({
      id: "PREFILL-R-005",
      title: "AI governance controls may be undefined or not evidenced",
      description: "AI-enabled workflows need traceability, fallback behavior, review criteria, and output handling boundaries before they can be approved.",
      severity: "High",
      likelihood: "Medium",
      impact: "Opaque or weakly governed AI decisions can create regulatory, fairness, and explainability issues.",
      asset: "AI-assisted workflow and generated outputs",
      owner: "AI Governance Lead",
      status: "Open",
      framework: "NIST 800-53 AU-2, internal AI governance requirements",
      isGoLiveBlocker: false,
    });
  }

  return risks;
}

export function getIntakePrefillSignature(value: Partial<RequirementIntake> | undefined) {
  const intake = parseCompleteIntake(value);
  if (!intake) return null;

  return JSON.stringify({
    engagementType: intake.engagementType,
    industry: intake.industry,
    responderPersona: intake.responderPersona,
    deliveryModel: intake.deliveryModel,
    hostingModel: intake.hostingModel,
    externalExposure: intake.externalExposure,
    dataResidency: intake.dataResidency,
    storesPersonalData: intake.storesPersonalData,
    storesFinancialData: intake.storesFinancialData,
    hasPrivilegedAccess: intake.hasPrivilegedAccess,
    usesAi: intake.usesAi,
  });
}

export function applyScopePrefill(current: ScopeFormState, intakeValue: Partial<RequirementIntake> | undefined): ScopeFormState {
  const intake = parseCompleteIntake(intakeValue);
  if (!intake) return current;

  return {
    ...current,
    hosting: current.hosting.length ? current.hosting : mapHosting(intake.hostingModel),
    environments: current.environments.length ? current.environments : getSuggestedEnvironments(intake),
    exposure: fillIfBlank(current.exposure, mapExposure(intake.externalExposure)),
    roles: fillIfBlank(current.roles, joinList(getSuggestedRoles(intake))),
    dataDomains: fillIfBlank(current.dataDomains, joinList(getSuggestedDataDomains(intake))),
    integrations: fillIfBlank(current.integrations, joinList(getSuggestedIntegrations(intake))),
    thirdParty: fillIfBlank(
      current.thirdParty,
      intake.deliveryModel === "Third-Party Service" || intake.deliveryModel === "Existing SaaS"
        ? "Vendor-managed service boundary requires shared-responsibility clarification"
        : "No material third-party boundary declared from intake",
    ),
    industry: current.industry !== "Generic" ? current.industry : mapScopeIndustry(intake.industry),
  };
}

export function applyInputsPrefill(current: InputsFormState, intakeValue: Partial<RequirementIntake> | undefined): InputsFormState {
  const intake = parseCompleteIntake(intakeValue);
  if (!intake) return current;

  return {
    dataEntries: mergeById(current.dataEntries, getPrefilledDataEntries(intake)),
    integrations: mergeById(current.integrations, getPrefilledIntegrations(intake)),
  };
}

export function applyControlMappingPrefill(current: ControlMappingState, intakeValue: Partial<RequirementIntake> | undefined): ControlMappingState {
  const intake = parseCompleteIntake(intakeValue);
  if (!intake) return current;

  return {
    industry: current.industry !== "FI" ? current.industry : mapControlIndustry(intake.industry),
    rows: mergeById(current.rows, getPrefilledMappingRows(intake)),
  };
}

export function applyRiskRegisterPrefill(current: RiskRegisterState, intakeValue: Partial<RequirementIntake> | undefined): RiskRegisterState {
  const intake = parseCompleteIntake(intakeValue);
  if (!intake) return current;

  return {
    risks: mergeById(current.risks, getPrefilledRisks(intake)),
  };
}
