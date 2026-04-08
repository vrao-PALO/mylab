import { z } from "zod";

export const requirementIntakeSchema = z.object({
  engagementType: z.enum(["RFP", "RFQ", "Assessment", "Internal Audit", "Advisory"]),
  industry: z.enum(["FI", "GovTech", "Real Estate", "Education", "Generic"]),
  responderPersona: z.enum(["Security Architect", "Solution Architect", "Presales Lead", "Internal Auditor"]),
  deliveryModel: z.enum(["New SaaS", "Existing SaaS", "Internal Platform", "Third-Party Service", "Hybrid"]),
  hostingModel: z.enum(["Cloud Hosted", "Client Hosted", "Hybrid", "Unknown"]),
  externalExposure: z.enum(["Internal Only", "Partner Facing", "Internet Facing"]),
  dataResidency: z.enum(["Local Only", "Regional", "Global", "Unknown"]),
  storesPersonalData: z.enum(["Yes", "No"]),
  storesFinancialData: z.enum(["Yes", "No"]),
  hasPrivilegedAccess: z.enum(["Yes", "No"]),
  usesAi: z.enum(["Yes", "No"]),
  businessObjective: z.string().min(10),
  expectedOutcome: z.string().min(10),
  successCriteria: z.string().min(10),
  constraints: z.string().min(2),
  timeline: z.string().min(2),
});

export const assessmentScopeSchema = z.object({
  systems: z.array(z.string().min(1)).min(1),
  environments: z.array(z.enum(["dev", "test", "prod"])).min(1),
  userRoles: z.array(z.string().min(1)).min(1),
  dataDomains: z.array(z.string().min(1)).min(1),
  integrations: z.array(z.string().min(1)).min(1),
  inScope: z.array(z.string().min(1)).min(1),
  outOfScope: z.array(z.string().min(1)).default([]),
});

export const dataInputCatalogSchema = z.object({
  dataClass: z.enum(["INTERNAL", "CONFIDENTIAL", "FINANCIAL", "AUDIT", "PII"]),
  source: z.string().min(1),
  destination: z.string().min(1),
  protocol: z.string().min(1),
  owner: z.string().min(1),
  hasAiComponent: z.boolean(),
});

export type RequirementIntakeInput = z.infer<typeof requirementIntakeSchema>;
export type AssessmentScopeInput = z.infer<typeof assessmentScopeSchema>;
export type DataInputCatalogInput = z.infer<typeof dataInputCatalogSchema>;