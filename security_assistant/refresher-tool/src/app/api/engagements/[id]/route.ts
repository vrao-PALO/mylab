import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateEngagementSchema } from "@/lib/engagement-api-schema";
import { createWorkflowSnapshot } from "@/lib/workflow-state";

function parseJsonSafely(value: string | undefined) {
  try {
    return JSON.parse(value ?? "null");
  } catch {
    return null;
  }
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const row = await db.engagement.findUnique({ where: { id } });

  if (!row) {
    return NextResponse.json({ ok: false, message: "Engagement not found" }, { status: 404 });
  }

  const workflow = createWorkflowSnapshot({
    ...(parseJsonSafely(row.workflowJson) ?? {}),
    intake: parseJsonSafely(row.intakeJson),
    scope: parseJsonSafely(row.scopeJson),
    inputs: parseJsonSafely(row.inputsJson),
  });

  return NextResponse.json({
    ok: true,
    data: {
      ...row,
      intake: workflow.intake,
      scope: workflow.scope,
      inputs: workflow.inputs,
      workflow,
    },
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const payload = await request.json().catch(() => ({}));
  const parsed = updateEngagementSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid payload", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await db.engagement.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ ok: false, message: "Engagement not found" }, { status: 404 });
  }

  const input = parsed.data;
  const hasIntake = Object.prototype.hasOwnProperty.call(payload, "intake");
  const hasScope = Object.prototype.hasOwnProperty.call(payload, "scope");
  const hasInputs = Object.prototype.hasOwnProperty.call(payload, "inputs");
  const hasWorkflow = Object.prototype.hasOwnProperty.call(payload, "workflow");
  const existingWorkflow = createWorkflowSnapshot({
    ...(parseJsonSafely(existing.workflowJson) ?? {}),
    intake: parseJsonSafely(existing.intakeJson),
    scope: parseJsonSafely(existing.scopeJson),
    inputs: parseJsonSafely(existing.inputsJson),
  });
  const workflowUpdate = hasWorkflow && input.workflow ? createWorkflowSnapshot(input.workflow) : undefined;
  const nextWorkflow = createWorkflowSnapshot({
    intake: hasIntake || input.workflow?.intake !== undefined
      ? {
          ...existingWorkflow.intake,
          ...(workflowUpdate?.intake ?? {}),
          ...(hasIntake && input.intake ? input.intake : {}),
        }
      : existingWorkflow.intake,
    scope: hasScope ? input.scope : workflowUpdate?.scope ?? existingWorkflow.scope,
    inputs: hasInputs ? input.inputs : workflowUpdate?.inputs ?? existingWorkflow.inputs,
    controlMapping:
      input.workflow?.controlMapping !== undefined
        ? workflowUpdate?.controlMapping
        : existingWorkflow.controlMapping,
    riskRegister:
      input.workflow?.riskRegister !== undefined
        ? workflowUpdate?.riskRegister
        : existingWorkflow.riskRegister,
    checklists:
      input.workflow?.checklists !== undefined
        ? workflowUpdate?.checklists
        : existingWorkflow.checklists,
    evidence:
      input.workflow?.evidence !== undefined
        ? workflowUpdate?.evidence
        : existingWorkflow.evidence,
    role:
      input.workflow?.role !== undefined
        ? workflowUpdate?.role
        : existingWorkflow.role,
  });

  const updated = await db.engagement.update({
    where: { id },
    data: {
      title: input.title ?? existing.title,
      status: input.status ?? existing.status,
      notes: input.notes ?? existing.notes,
      engagementType: nextWorkflow.intake.engagementType ?? existing.engagementType,
      industry: nextWorkflow.intake.industry ?? existing.industry,
      businessObjective: nextWorkflow.intake.businessObjective ?? existing.businessObjective,
      timeline: nextWorkflow.intake.timeline ?? existing.timeline,
      intakeJson: JSON.stringify(nextWorkflow.intake),
      scopeJson: JSON.stringify(nextWorkflow.scope),
      inputsJson: JSON.stringify(nextWorkflow.inputs),
      workflowJson: JSON.stringify(nextWorkflow),
    },
  });

  return NextResponse.json({ ok: true, data: updated });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const existing = await db.engagement.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ ok: false, message: "Engagement not found" }, { status: 404 });
  }

  await db.engagement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


