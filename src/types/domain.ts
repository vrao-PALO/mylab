export type EngagementType =
  | "RFP"
  | "RFQ"
  | "Assessment"
  | "Internal Audit"
  | "Advisory";

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
