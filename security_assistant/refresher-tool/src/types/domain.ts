export type EngagementType =
  | "RFP"
  | "RFQ"
  | "Assessment"
  | "Internal Audit"
  | "Advisory";

export type ResponderPersona =
  | "Security Architect"
  | "Solution Architect"
  | "Presales Lead"
  | "Internal Auditor";

export type DeliveryModel =
  | "New SaaS"
  | "Existing SaaS"
  | "Internal Platform"
  | "Third-Party Service"
  | "Hybrid";

export type HostingModel =
  | "Cloud Hosted"
  | "Client Hosted"
  | "Hybrid"
  | "Unknown";

export type ExposureType = "Internal Only" | "Partner Facing" | "Internet Facing";

export type ResidencyType = "Local Only" | "Regional" | "Global" | "Unknown";

export type YesNoChoice = "Yes" | "No";

export type IndustryType =
  | "FI"
  | "GovTech"
  | "Real Estate"
  | "Education"
  | "Generic";

export type RiskSeverity = "Critical" | "High" | "Medium" | "Low";

export interface RequirementIntake {
  engagementType: EngagementType;
  industry: IndustryType;
  responderPersona: ResponderPersona;
  deliveryModel: DeliveryModel;
  hostingModel: HostingModel;
  externalExposure: ExposureType;
  dataResidency: ResidencyType;
  storesPersonalData: YesNoChoice;
  storesFinancialData: YesNoChoice;
  hasPrivilegedAccess: YesNoChoice;
  usesAi: YesNoChoice;
  businessObjective: string;
  expectedOutcome: string;
  successCriteria: string;
  constraints: string;
  timeline: string;
}

export interface AssessmentScope {
  systems: string[];
  environments: Array<"dev" | "test" | "prod">;
  userRoles: string[];
  dataDomains: string[];
  integrations: string[];
  inScope: string[];
  outOfScope: string[];
}

export interface DataInputCatalog {
  dataClass: "INTERNAL" | "CONFIDENTIAL" | "FINANCIAL" | "AUDIT" | "PII";
  source: string;
  destination: string;
  protocol: string;
  owner: string;
  hasAiComponent: boolean;
}

export interface RiskItem {
  title: string;
  severity: RiskSeverity;
  owner: string;
  status: "Open" | "Accepted" | "Mitigated" | "Closed";
}