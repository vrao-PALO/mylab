import { describe, expect, it } from "vitest";
import {
  generateAuditEvidencePack,
  generateEngagementPackage,
  generateEngagementSummary,
  generateRiskRegister,
} from "@/lib/export-templates";
import type { WorkflowExportContext } from "@/lib/workflow-state";

const context: WorkflowExportContext = {
  intake: {
    engagementType: "Assessment",
    industry: "FI",
    businessObjective: "Assess production readiness before go-live.",
    expectedOutcome: "Risk register and evidence pack.",
    successCriteria: "No open critical blockers.",
    constraints: "Four-week timeline.",
    timeline: "Q2 2026",
  },
  scope: {
    systems: "Customer portal, admin portal, ETL pipeline",
    hosting: ["Cloud"],
    environments: ["dev", "prod"],
    exposure: "Internet-facing",
    roles: "Admin, Auditor, Customer",
    dataDomains: "PII, Financial",
    integrations: "Azure AD, Payments API",
    outOfScope: "Legacy billing",
    thirdParty: "Payments API limited to settlement flow",
    industry: "FI",
  },
  inputs: {
    dataEntries: [
      {
        id: "d1",
        name: "Payroll data",
        classification: "FINANCIAL",
        regulation: "MAS TRM, PDPA",
        retention: "7 years",
        controls: "Masking, audit logging",
        hasAi: false,
        highRisk: true,
      },
    ],
    integrations: [],
  },
  controlMapping: {
    industry: "FI",
    rows: [
      { id: "m1", requirement: "All privileged actions must be logged", controls: ["mas-access-1"], gap: false },
      { id: "m2", requirement: "AI scoring decisions must be explainable", controls: [], gap: true },
    ],
  },
  riskRegister: {
    risks: [
      {
        id: "R-001",
        title: "Audit logging not active",
        description: "Missing audit log coverage.",
        severity: "Critical",
        likelihood: "High",
        impact: "No forensics.",
        asset: "Audit log table",
        owner: "Security Lead",
        status: "Open",
        framework: "MAS TRM 11.2",
        isGoLiveBlocker: true,
      },
    ],
  },
  checklists: {
    industry: "FI",
    checked: { "s1-t1": true },
    expanded: "s1",
  },
  evidence: [
    {
      id: "e1",
      engagementId: "local",
      controlRef: "MAS TRM 11.2",
      category: "Logs",
      title: "Authentication audit logs",
      status: "Collected",
      link: "https://example.test/audit-log",
      notes: "Collected from production sample.",
    },
  ],
  baselines: {
    intake: [
      {
        version: 1,
        createdAt: "2026-04-02T09:00:00.000Z",
        snapshot: { engagementType: "Assessment", industry: "FI", timeline: "Q2 2026" },
        summary: "Assessment | FI | Q2 2026",
      },
    ],
    scope: [
      {
        version: 1,
        createdAt: "2026-04-03T09:00:00.000Z",
        snapshot: {
          systems: "Customer portal, admin portal, ETL pipeline",
          hosting: ["Cloud"],
          environments: ["dev", "prod"],
          exposure: "Internet-facing",
          roles: "Admin, Auditor, Customer",
          dataDomains: "PII, Financial",
          integrations: "Azure AD, Payments API",
          outOfScope: "Legacy billing",
          thirdParty: "Payments API limited to settlement flow",
          industry: "FI",
        },
        summary: "Customer portal, admin portal, ETL pipeline | Internet-facing | dev, prod",
      },
    ],
  },
  role: "Architect",
};

describe("export templates", () => {
  it("generates an engagement summary from workflow state", () => {
    const output = generateEngagementSummary(context);

    expect(output).toContain("# Engagement Summary");
    expect(output).toContain("Assessment");
    expect(output).toContain("Customer portal, admin portal, ETL pipeline");
    expect(output).toContain("Go-live blockers: 1");
    expect(output).toContain("Intake baseline: v1 (2026-04-02)");
    expect(output).toContain("Scope baseline: v1 (2026-04-03)");
  });

  it("generates a risk register table from saved risks", () => {
    const output = generateRiskRegister(context);

    expect(output).toContain("| ID | Risk | Severity | Owner | Compensating Control | Status | Review Date |");
    expect(output).toContain("| R-001 | Audit logging not active | Critical | Security Lead");
  });

  it("generates an audit evidence table from evidence items", () => {
    const output = generateAuditEvidencePack(context);

    expect(output).toContain("| Control | Category | Evidence Item | Evidence Link | Notes | Status |");
    expect(output).toContain("Authentication audit logs");
    expect(output).toContain("https://example.test/audit-log");
  });

  it("combines all sections into the engagement package", () => {
    const output = generateEngagementPackage(context);

    expect(output).toContain("# Complete Engagement Package");
    expect(output).toContain("# Engagement Summary");
    expect(output).toContain("# Risk Register");
    expect(output).toContain("# Audit Evidence Pack");
  });
});
