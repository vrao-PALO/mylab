import { describe, expect, it } from "vitest";
import {
  getLatestIntakeBaseline,
  getLatestScopeBaseline,
  hasIntakeBaselineChanged,
  hasScopeBaselineChanged,
  storeIntakeBaseline,
  storeScopeBaseline,
} from "@/lib/baseline-history";
import { EMPTY_BASELINES_STATE, EMPTY_SCOPE_STATE } from "@/lib/workflow-state";
import type { RequirementIntake } from "@/types/domain";

const intake: Partial<RequirementIntake> = {
  engagementType: "Assessment",
  industry: "FI",
  timeline: "Q2 2026",
};

const scope = {
  ...EMPTY_SCOPE_STATE,
  systems: "Customer portal",
  exposure: "Internet-facing",
  environments: ["prod"],
};

describe("baseline history", () => {
  it("stores an intake baseline and exposes the latest record", () => {
    const next = storeIntakeBaseline(EMPTY_BASELINES_STATE, intake);
    expect(next.intake).toHaveLength(1);
    expect(getLatestIntakeBaseline(next)?.version).toBe(1);
    expect(getLatestIntakeBaseline(next)?.summary).toContain("Assessment");
  });

  it("does not duplicate identical intake baselines", () => {
    const once = storeIntakeBaseline(EMPTY_BASELINES_STATE, intake);
    const twice = storeIntakeBaseline(once, intake);
    expect(twice.intake).toHaveLength(1);
  });

  it("stores scope versions with reason and approver metadata", () => {
    const once = storeScopeBaseline(EMPTY_BASELINES_STATE, scope);
    const twice = storeScopeBaseline(
      once,
      { ...scope, thirdParty: "Vendor boundary updated" },
      { reason: "Vendor scope clarified", approver: "Lead Architect" },
    );
    expect(twice.scope).toHaveLength(2);
    expect(getLatestScopeBaseline(twice)?.version).toBe(2);
    expect(getLatestScopeBaseline(twice)?.reason).toBe("Vendor scope clarified");
    expect(getLatestScopeBaseline(twice)?.approver).toBe("Lead Architect");
  });

  it("detects draft changes relative to the latest baselines", () => {
    const withBaselines = storeScopeBaseline(storeIntakeBaseline(EMPTY_BASELINES_STATE, intake), scope);
    expect(hasIntakeBaselineChanged(intake, withBaselines)).toBe(false);
    expect(hasScopeBaselineChanged(scope, withBaselines)).toBe(false);
    expect(hasIntakeBaselineChanged({ ...intake, industry: "GovTech" }, withBaselines)).toBe(true);
    expect(hasScopeBaselineChanged({ ...scope, systems: "Admin portal" }, withBaselines)).toBe(true);
  });
});