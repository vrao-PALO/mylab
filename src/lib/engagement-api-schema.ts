import { z } from "zod";
import {
  assessmentScopeSchema,
  dataInputCatalogSchema,
  requirementIntakeSchema,
} from "@/lib/schemas";

const intakeDraftSchema = requirementIntakeSchema.partial();
const scopeDraftSchema = assessmentScopeSchema.partial();
const inputsDraftSchema = z.array(dataInputCatalogSchema).default([]);

export const createEngagementSchema = z.object({
  title: z.string().min(3).max(120),
  status: z.enum(["Draft", "InReview", "Approved", "Closed"]).default("Draft"),
  notes: z.string().max(2000).optional(),
  intake: intakeDraftSchema,
  scope: scopeDraftSchema.default({}),
  inputs: inputsDraftSchema,
});

export const updateEngagementSchema = createEngagementSchema.partial();

export type CreateEngagementInput = z.infer<typeof createEngagementSchema>;
export type UpdateEngagementInput = z.infer<typeof updateEngagementSchema>;