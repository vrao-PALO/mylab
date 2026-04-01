import { describe, it, expect } from "vitest";
import {
  requirementIntakeSchema,
  assessmentScopeSchema,
  dataInputCatalogSchema,
} from "@/lib/schemas";

// ── requirementIntakeSchema ──────────────────────────────────────────────────

describe("requirementIntakeSchema", () => {
  const valid = {
    engagementType: "RFP",
    industry: "FI",
    businessObjective: "Assess security posture before go-live",
    expectedOutcome: "Produce risk register with remediation roadmap",
    successCriteria: "All critical risks have owners and ETA",
    constraints: "6 weeks",
    timeline: "Q2 2026",
  };

  it("accepts a valid intake payload", () => {
    expect(() => requirementIntakeSchema.parse(valid)).not.toThrow();
  });

  it("rejects unknown engagementType", () => {
    const result = requirementIntakeSchema.safeParse({ ...valid, engagementType: "Unknown" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown industry", () => {
    const result = requirementIntakeSchema.safeParse({ ...valid, industry: "Healthcare" });
    expect(result.success).toBe(false);
  });

  it("rejects businessObjective shorter than 10 chars", () => {
    const result = requirementIntakeSchema.safeParse({ ...valid, businessObjective: "Short" });
    expect(result.success).toBe(false);
  });

  it("rejects missing required field", () => {
    const { timeline, ...missing } = valid;
    const result = requirementIntakeSchema.safeParse(missing);
    expect(result.success).toBe(false);
  });

  it("accepts all valid engagementType values", () => {
    const types = ["RFP", "RFQ", "Assessment", "Internal Audit", "Advisory"] as const;
    for (const t of types) {
      expect(() => requirementIntakeSchema.parse({ ...valid, engagementType: t })).not.toThrow();
    }
  });

  it("accepts all valid industry values", () => {
    const industries = ["FI", "GovTech", "Real Estate", "Education", "Generic"] as const;
    for (const ind of industries) {
      expect(() => requirementIntakeSchema.parse({ ...valid, industry: ind })).not.toThrow();
    }
  });
});

// ── assessmentScopeSchema ────────────────────────────────────────────────────

describe("assessmentScopeSchema", () => {
  const valid = {
    systems: ["HR API", "Finance Portal"],
    environments: ["dev", "prod"],
    userRoles: ["Admin", "HR Manager"],
    dataDomains: ["HR Data", "Financial Data"],
    integrations: ["NAPTA HR API", "Azure Key Vault"],
    inScope: ["ETL Function App", "PostgreSQL"],
    outOfScope: [],
  };

  it("accepts a valid scope payload", () => {
    expect(() => assessmentScopeSchema.parse(valid)).not.toThrow();
  });

  it("rejects empty systems array", () => {
    const result = assessmentScopeSchema.safeParse({ ...valid, systems: [] });
    expect(result.success).toBe(false);
  });

  it("rejects invalid environment value", () => {
    const result = assessmentScopeSchema.safeParse({ ...valid, environments: ["staging"] });
    expect(result.success).toBe(false);
  });

  it("accepts all valid environment values", () => {
    expect(() =>
      assessmentScopeSchema.parse({ ...valid, environments: ["dev", "test", "prod"] })
    ).not.toThrow();
  });

  it("outOfScope defaults to empty array when omitted", () => {
    const { outOfScope, ...noOos } = valid;
    const result = assessmentScopeSchema.safeParse(noOos);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.outOfScope).toEqual([]);
    }
  });

  it("rejects empty strings within arrays", () => {
    const result = assessmentScopeSchema.safeParse({ ...valid, userRoles: [""] });
    expect(result.success).toBe(false);
  });
});

// ── dataInputCatalogSchema ───────────────────────────────────────────────────

describe("dataInputCatalogSchema", () => {
  const valid = {
    dataClass: "CONFIDENTIAL",
    source: "NAPTA HR API",
    destination: "PostgreSQL hr_schema",
    protocol: "HTTPS",
    owner: "HR Team",
    hasAiComponent: false,
  };

  it("accepts a valid data input payload", () => {
    expect(() => dataInputCatalogSchema.parse(valid)).not.toThrow();
  });

  it("rejects unknown dataClass", () => {
    const result = dataInputCatalogSchema.safeParse({ ...valid, dataClass: "TOP SECRET" });
    expect(result.success).toBe(false);
  });

  it("accepts all valid dataClass values", () => {
    const classes = ["INTERNAL", "CONFIDENTIAL", "FINANCIAL", "AUDIT", "PII"] as const;
    for (const dc of classes) {
      expect(() => dataInputCatalogSchema.parse({ ...valid, dataClass: dc })).not.toThrow();
    }
  });

  it("rejects missing hasAiComponent", () => {
    const { hasAiComponent, ...missing } = valid;
    const result = dataInputCatalogSchema.safeParse(missing);
    expect(result.success).toBe(false);
  });

  it("rejects empty source string", () => {
    const result = dataInputCatalogSchema.safeParse({ ...valid, source: "" });
    expect(result.success).toBe(false);
  });

  it("accepts hasAiComponent as true", () => {
    expect(() =>
      dataInputCatalogSchema.parse({ ...valid, hasAiComponent: true })
    ).not.toThrow();
  });
});