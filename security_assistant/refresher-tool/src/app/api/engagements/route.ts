import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createEngagementSchema } from "@/lib/engagement-api-schema";
import { createWorkflowSnapshot } from "@/lib/workflow-state";

function parseJsonSafely(value: string | undefined) {
  try {
    return JSON.parse(value ?? "null");
  } catch {
    return null;
  }
}

export async function GET() {
  const rows = await db.engagement.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const data = rows.map((row) => {
    const workflow = createWorkflowSnapshot({
      ...(parseJsonSafely(row.workflowJson) ?? {}),
      intake: parseJsonSafely(row.intakeJson),
      scope: parseJsonSafely(row.scopeJson),
      inputs: parseJsonSafely(row.inputsJson),
    });

    return {
      ...row,
      intake: workflow.intake,
      scope: workflow.scope,
      inputs: workflow.inputs,
      workflow,
    };
  });

  return NextResponse.json({ ok: true, data });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const parsed = createEngagementSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid payload", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const workflow = createWorkflowSnapshot({
    ...(input.workflow ?? {}),
    intake: input.workflow?.intake ?? input.intake,
    scope: input.workflow?.scope ?? input.scope,
    inputs: input.workflow?.inputs ?? input.inputs,
  });

  const row = await db.engagement.create({
    data: {
      title: input.title,
      status: input.status,
      notes: input.notes,
      engagementType: workflow.intake.engagementType ?? "Advisory",
      industry: workflow.intake.industry ?? "Generic",
      businessObjective: workflow.intake.businessObjective ?? "",
      timeline: workflow.intake.timeline ?? "",
      intakeJson: JSON.stringify(workflow.intake),
      scopeJson: JSON.stringify(workflow.scope),
      inputsJson: JSON.stringify(workflow.inputs),
      workflowJson: JSON.stringify(workflow),
    },
  });

  return NextResponse.json({ ok: true, data: row }, { status: 201 });
}
