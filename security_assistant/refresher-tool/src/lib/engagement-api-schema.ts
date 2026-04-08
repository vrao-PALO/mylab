import { z } from "zod";
import {
  assessmentScopeSchema,
  dataInputCatalogSchema,
  requirementIntakeSchema,
} from "@/lib/schemas";

const intakeDraftSchema = requirementIntakeSchema.partial();
const legacyScopeDraftSchema = assessmentScopeSchema.partial();
const scopeStateSchema = z.object({
  systems: z.string().default(""),
  hosting: z.array(z.string()).default([]),
  environments: z.array(z.string()).default([]),
  exposure: z.string().default(""),
  roles: z.string().default(""),
  dataDomains: z.string().default(""),
  integrations: z.string().default(""),
  outOfScope: z.string().default(""),
  thirdParty: z.string().default(""),
  industry: z.string().default("Generic"),
});
const inputsStateSchema = z.object({
  dataEntries: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      classification: z.enum(["INTERNAL", "CONFIDENTIAL", "FINANCIAL", "AUDIT", "PII"]),
      regulation: z.string(),
      retention: z.string(),
      controls: z.string(),
      hasAi: z.boolean(),
      highRisk: z.boolean(),
    }),
  ).default([]),
  integrations: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      destination: z.string(),
      protocol: z.string(),
      authMethod: z.string(),
      sensitivity: z.enum(["INTERNAL", "CONFIDENTIAL", "FINANCIAL", "AUDIT", "PII"]),
      thirdParty: z.boolean(),
    }),
  ).default([]),
}).default({ dataEntries: [], integrations: [] });
const legacyInputsArraySchema = z.array(dataInputCatalogSchema).default([]);
const controlMappingStateSchema = z.object({
  industry: z.string().default("FI"),
  rows: z.array(
    z.object({
      id: z.string(),
      requirement: z.string(),
      controls: z.array(z.string()).default([]),
      gap: z.boolean(),
    }),
  ).default([]),
}).default({ industry: "FI", rows: [] });
const riskRegisterStateSchema = z.object({
  risks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      severity: z.enum(["Critical", "High", "Medium", "Low"]),
      likelihood: z.enum(["High", "Medium", "Low"]),
      impact: z.string(),
      asset: z.string(),
      owner: z.string(),
      status: z.enum(["Open", "Accepted", "Mitigated", "Closed"]),
      framework: z.string(),
      exception: z
        .object({
          justification: z.string(),
          compensatingControl: z.string(),
          expiry: z.string(),
          approver: z.string(),
        })
        .optional(),
      isGoLiveBlocker: z.boolean(),
    }),
  ).default([]),
}).default({ risks: [] });
const checklistStateSchema = z.object({
  industry: z.enum(["All", "FI", "GovTech", "Generic"]).default("All"),
  checked: z.record(z.string(), z.boolean()).default({}),
  expanded: z.string().nullable().default("s1"),
}).default({ industry: "All", checked: {}, expanded: "s1" });
const evidenceStateSchema = z.array(
  z.object({
    id: z.string(),
    controlRef: z.string(),
    category: z.string(),
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(["Pending", "Collected", "Verified", "N/A"]),
    link: z.string().optional(),
    notes: z.string().optional(),
    dueDate: z.string().optional(),
    engagementId: z.string(),
  }),
).default([]);
const intakeBaselineRecordSchema = z.object({
  version: z.number().int().positive(),
  createdAt: z.string(),
  snapshot: intakeDraftSchema.default({}),
  summary: z.string().default(""),
  reason: z.string().optional(),
  approver: z.string().optional(),
});
const scopeBaselineRecordSchema = z.object({
  version: z.number().int().positive(),
  createdAt: z.string(),
  snapshot: scopeStateSchema.default({}),
  summary: z.string().default(""),
  reason: z.string().optional(),
  approver: z.string().optional(),
});
const baselinesStateSchema = z.object({
  intake: z.array(intakeBaselineRecordSchema).default([]),
  scope: z.array(scopeBaselineRecordSchema).default([]),
}).default({ intake: [], scope: [] });
const workflowSnapshotSchema = z
  .object({
    intake: intakeDraftSchema.default({}),
    scope: scopeStateSchema.default({}),
    inputs: z.union([inputsStateSchema, legacyInputsArraySchema]).default({ dataEntries: [], integrations: [] }),
    controlMapping: controlMappingStateSchema,
    riskRegister: riskRegisterStateSchema,
    checklists: checklistStateSchema,
    evidence: evidenceStateSchema,
    baselines: baselinesStateSchema,
    role: z.enum(["Architect", "Presales", "Auditor"]).default("Architect"),
  })
  .partial();

export const createEngagementSchema = z.object({
  title: z.string().min(3).max(120),
  status: z.enum(["Draft", "InReview", "Approved", "Closed"]).default("Draft"),
  notes: z.string().max(2000).optional(),
  intake: intakeDraftSchema,
  scope: z.union([legacyScopeDraftSchema, scopeStateSchema]).default({}),
  inputs: z.union([inputsStateSchema, legacyInputsArraySchema]).default({ dataEntries: [], integrations: [] }),
  workflow: workflowSnapshotSchema.optional(),
});

export const updateEngagementSchema = createEngagementSchema.partial();

export type CreateEngagementInput = z.infer<typeof createEngagementSchema>;
export type UpdateEngagementInput = z.infer<typeof updateEngagementSchema>;