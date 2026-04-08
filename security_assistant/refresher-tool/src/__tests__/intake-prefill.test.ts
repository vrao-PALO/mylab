import { describe, expect, it } from "vitest";
import {
  PREFILL_MARKER_KEYS,
  applyControlMappingPrefill,
  applyInputsPrefill,
  applyRiskRegisterPrefill,
  applyScopePrefill,
  getIntakePrefillSignature,
} from "@/lib/intake-prefill";
import {
  EMPTY_INPUTS_STATE,
  EMPTY_SCOPE_STATE,
  type ControlMappingState,
  type RiskRegisterState,
} from "@/lib/workflow-state";
import type { RequirementIntake } from "@/types/domain";

const intake: RequirementIntake = {
  engagementType: "Assessment",
  industry: "GovTech",
  responderPersona: "Security Architect",
  deliveryModel: "Third-Party Service",
  hostingModel: "Hybrid",
  externalExposure: "Internet Facing",
  dataResidency: "Unknown",
  storesPersonalData: "Yes",
  storesFinancialData: "No",
  hasPrivilegedAccess: "Yes",
  usesAi: "Yes",
  businessObjective: "Assess a citizen-facing platform before go-live",
  expectedOutcome: "Generate a scoped security review pack and key risks",
  successCriteria: "Owners, blockers, and evidence requirements are clear",
  constraints: "Tight delivery timeline with vendor dependency",
  timeline: "Go-live in Q3 2026",
};

describe("intake prefill helpers", () => {
  it("builds a stable signature for complete intake payloads", () => {
    expect(getIntakePrefillSignature(intake)).toContain('"industry":"GovTech"');
    expect(PREFILL_MARKER_KEYS.scope).toContain("sa-prefill-scope-");
  });

  it("returns null signature for incomplete intake payloads", () => {
    expect(getIntakePrefillSignature({ industry: "FI" })).toBeNull();
  });

  it("prefills scope defaults from intake signals without overwriting populated fields", () => {
    const next = applyScopePrefill(EMPTY_SCOPE_STATE, intake);
    expect(next.hosting).toEqual(["Cloud", "On-premises", "Hybrid"]);
    expect(next.environments).toEqual(["prod"]);
    expect(next.exposure).toBe("Internet-facing");
    expect(next.industry).toBe("GovTech");
    expect(next.roles).toContain("Administrator");
    expect(next.dataDomains).toContain("AI prompts and outputs");
  });

  it("adds intake-driven input and integration defaults", () => {
    const next = applyInputsPrefill(EMPTY_INPUTS_STATE, intake);
    expect(next.dataEntries.some((entry) => entry.id === "prefill-data-personal")).toBe(true);
    expect(next.dataEntries.some((entry) => entry.id === "prefill-data-ai")).toBe(true);
    expect(next.integrations.some((entry) => entry.id === "prefill-integration-vendor")).toBe(true);
    expect(next.integrations.some((entry) => entry.id === "prefill-integration-public")).toBe(true);
  });

  it("adds intake-driven control mapping rows and sets industry away from default", () => {
    const current: ControlMappingState = { industry: "FI", rows: [] };
    const next = applyControlMappingPrefill(current, intake);
    expect(next.industry).toBe("GovTech");
    expect(next.rows.some((row) => row.id === "prefill-map-public-access")).toBe(true);
    expect(next.rows.some((row) => row.id === "prefill-map-ai-governance" && row.gap)).toBe(true);
  });

  it("adds intake-driven risk records with blocker coverage", () => {
    const current: RiskRegisterState = { risks: [] };
    const next = applyRiskRegisterPrefill(current, intake);
    expect(next.risks.some((risk) => risk.id === "PREFILL-R-001" && risk.isGoLiveBlocker)).toBe(true);
    expect(next.risks.some((risk) => risk.id === "PREFILL-R-003" && risk.title.includes("Data residency"))).toBe(true);
    expect(next.risks.some((risk) => risk.id === "PREFILL-R-005")).toBe(true);
  });
});
