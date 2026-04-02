import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    engagement: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { db } from "@/lib/db";
import { GET as listEngagements, POST as createEngagement } from "@/app/api/engagements/route";
import { DELETE as deleteEngagement, GET as getEngagement, PATCH as updateEngagement } from "@/app/api/engagements/[id]/route";

const mockedDb = db as unknown as {
  engagement: {
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

describe("engagement routes", () => {
  beforeEach(() => {
    mockedDb.engagement.findMany.mockReset();
    mockedDb.engagement.create.mockReset();
    mockedDb.engagement.findUnique.mockReset();
    mockedDb.engagement.update.mockReset();
    mockedDb.engagement.delete.mockReset();
  });

  it("lists engagements with parsed JSON payloads", async () => {
    mockedDb.engagement.findMany.mockResolvedValue([
      {
        id: "eng-1",
        title: "Pilot engagement",
        status: "Draft",
        engagementType: "Assessment",
        industry: "FI",
        businessObjective: "Assess readiness",
        timeline: "Q2 2026",
        intakeJson: JSON.stringify({ engagementType: "Assessment", industry: "FI" }),
        scopeJson: JSON.stringify({ systems: "Portal" }),
        inputsJson: JSON.stringify({
          dataEntries: [],
          integrations: [{ id: "i1", source: "HR", destination: "Portal", protocol: "HTTPS", authMethod: "Token", sensitivity: "PII", thirdParty: true }],
        }),
        workflowJson: JSON.stringify({ role: "Architect", controlMapping: { industry: "FI", rows: [] }, riskRegister: { risks: [] }, checklists: { industry: "All", checked: {}, expanded: "s1" }, evidence: [] }),
        createdAt: new Date("2026-04-02T00:00:00.000Z"),
        updatedAt: new Date("2026-04-02T00:00:00.000Z"),
        notes: null,
      },
    ]);

    const response = await listEngagements();
    const payload = await response.json();

    expect(payload.ok).toBe(true);
    expect(payload.data[0].intake.industry).toBe("FI");
    expect(payload.data[0].scope.systems).toBe("Portal");
    expect(payload.data[0].inputs.integrations[0].sensitivity).toBe("PII");
    expect(payload.data[0].workflow.role).toBe("Architect");
  });

  it("creates an engagement when the payload is valid", async () => {
    mockedDb.engagement.create.mockResolvedValue({ id: "eng-2", title: "New engagement" });

    const request = new Request("http://localhost/api/engagements", {
      method: "POST",
      body: JSON.stringify({
        title: "New engagement",
        status: "Draft",
        intake: { engagementType: "Assessment", industry: "FI", businessObjective: "Assess security posture", expectedOutcome: "Produce roadmap", successCriteria: "No criticals", constraints: "6 weeks", timeline: "Q2 2026" },
        scope: {},
        inputs: { dataEntries: [], integrations: [] },
        workflow: { role: "Architect", controlMapping: { industry: "FI", rows: [] }, riskRegister: { risks: [] }, checklists: { industry: "All", checked: {}, expanded: "s1" }, evidence: [] },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await createEngagement(request);
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.ok).toBe(true);
    expect(mockedDb.engagement.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        title: "New engagement",
        intakeJson: expect.any(String),
        workflowJson: expect.any(String),
      }),
    }));
  });

  it("rejects invalid create payloads", async () => {
    const request = new Request("http://localhost/api/engagements", {
      method: "POST",
      body: JSON.stringify({ title: "x" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await createEngagement(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
  });

  it("returns a single engagement with parsed JSON", async () => {
    mockedDb.engagement.findUnique.mockResolvedValue({
      id: "eng-3",
      title: "Saved engagement",
      status: "Draft",
      engagementType: "Assessment",
      industry: "FI",
      businessObjective: "Assess readiness",
      timeline: "Q2 2026",
      intakeJson: JSON.stringify({ industry: "FI" }),
      scopeJson: JSON.stringify({ systems: "Portal" }),
      inputsJson: JSON.stringify({ dataEntries: [], integrations: [] }),
      workflowJson: JSON.stringify({ role: "Auditor", controlMapping: { industry: "FI", rows: [] }, riskRegister: { risks: [] }, checklists: { industry: "All", checked: {}, expanded: "s1" }, evidence: [] }),
      createdAt: new Date("2026-04-02T00:00:00.000Z"),
      updatedAt: new Date("2026-04-02T00:00:00.000Z"),
      notes: null,
    });

    const response = await getEngagement(new Request("http://localhost/api/engagements/eng-3"), { params: Promise.resolve({ id: "eng-3" }) });
    const payload = await response.json();

    expect(payload.ok).toBe(true);
    expect(payload.data.scope.systems).toBe("Portal");
    expect(payload.data.workflow.role).toBe("Auditor");
  });

  it("merges nested JSON fields on patch", async () => {
    mockedDb.engagement.findUnique.mockResolvedValue({
      id: "eng-4",
      title: "Saved engagement",
      status: "Draft",
      engagementType: "Assessment",
      industry: "FI",
      businessObjective: "Assess readiness",
      timeline: "Q2 2026",
      intakeJson: JSON.stringify({ engagementType: "Assessment", industry: "FI", businessObjective: "Assess readiness", timeline: "Q2 2026" }),
      scopeJson: JSON.stringify({ systems: ["Portal"] }),
      inputsJson: JSON.stringify({ dataEntries: [], integrations: [] }),
      workflowJson: JSON.stringify({ role: "Architect", controlMapping: { industry: "FI", rows: [{ id: "m1", requirement: "Existing mapping", controls: ["iso-a5-15"], gap: false }] }, riskRegister: { risks: [] }, checklists: { industry: "All", checked: {}, expanded: "s1" }, evidence: [] }),
      createdAt: new Date("2026-04-02T00:00:00.000Z"),
      updatedAt: new Date("2026-04-02T00:00:00.000Z"),
      notes: null,
    });
    mockedDb.engagement.update.mockResolvedValue({ id: "eng-4", status: "InReview" });

    const request = new Request("http://localhost/api/engagements/eng-4", {
      method: "PATCH",
      body: JSON.stringify({
        status: "InReview",
        intake: { timeline: "Q3 2026" },
        workflow: { role: "Auditor", scope: { systems: "Portal", outOfScope: "Legacy billing" } },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await updateEngagement(request, { params: Promise.resolve({ id: "eng-4" }) });
    const payload = await response.json();

    expect(payload.ok).toBe(true);
    expect(mockedDb.engagement.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: "InReview",
        intakeJson: JSON.stringify({ engagementType: "Assessment", industry: "FI", businessObjective: "Assess readiness", timeline: "Q3 2026" }),
        scopeJson: JSON.stringify({ systems: "Portal", hosting: [], environments: [], exposure: "", roles: "", dataDomains: "", integrations: "", outOfScope: "Legacy billing", thirdParty: "", industry: "Generic" }),
        workflowJson: expect.any(String),
      }),
    }));
  });

  it("deletes an engagement when it exists", async () => {
    mockedDb.engagement.findUnique.mockResolvedValue({ id: "eng-5" });
    mockedDb.engagement.delete.mockResolvedValue({ id: "eng-5" });

    const response = await deleteEngagement(new Request("http://localhost/api/engagements/eng-5", { method: "DELETE" }), { params: Promise.resolve({ id: "eng-5" }) });
    const payload = await response.json();

    expect(payload.ok).toBe(true);
    expect(mockedDb.engagement.delete).toHaveBeenCalledWith({ where: { id: "eng-5" } });
  });
});
