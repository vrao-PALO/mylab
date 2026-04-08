import { describe, expect, it } from "vitest";
import { deriveIntakeGuidance } from "@/lib/intake-guidance";
import type { RequirementIntake } from "@/types/domain";

const baseIntake: RequirementIntake = {
  engagementType: "RFP",
  industry: "FI",
  responderPersona: "Presales Lead",
  deliveryModel: "Existing SaaS",
  hostingModel: "Cloud Hosted",
  externalExposure: "Internet Facing",
  dataResidency: "Unknown",
  storesPersonalData: "Yes",
  storesFinancialData: "Yes",
  hasPrivilegedAccess: "Yes",
  usesAi: "No",
  businessObjective: "Respond to a bank security questionnaire for an existing SaaS platform",
  expectedOutcome: "Produce a credible response pack and gap view",
  successCriteria: "Client questions answered with clear assumptions and evidence",
  constraints: "Two-week turnaround with limited engineering input",
  timeline: "Submission due next Friday",
};

describe("deriveIntakeGuidance", () => {
  it("recommends presales mode for presales personas", () => {
    const result = deriveIntakeGuidance(baseIntake);
    expect(result.recommendedRoleMode).toBe("Presales");
  });

  it("adds internet and privacy driven frameworks", () => {
    const result = deriveIntakeGuidance(baseIntake);
    expect(result.frameworkIds).toContain("mas-trm");
    expect(result.frameworkIds).toContain("pdpa");
    expect(result.frameworkIds).toContain("owasp-asvs");
    expect(result.frameworkIds).toContain("soc2");
  });

  it("adds AI governance emphasis when AI is in scope", () => {
    const result = deriveIntakeGuidance({ ...baseIntake, usesAi: "Yes", responderPersona: "Security Architect" });
    expect(result.recommendedRoleMode).toBe("Architect");
    expect(result.frameworkIds).toContain("nist-800-53");
    expect(result.priorityThemes.some((theme) => theme.includes("AI governance"))).toBe(true);
  });

  it("recommends auditor mode for internal auditors", () => {
    const result = deriveIntakeGuidance({ ...baseIntake, responderPersona: "Internal Auditor", engagementType: "Internal Audit" });
    expect(result.recommendedRoleMode).toBe("Auditor");
  });
});