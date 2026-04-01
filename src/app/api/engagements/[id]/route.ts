import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateEngagementSchema } from "@/lib/engagement-api-schema";

function parseJsonSafely(value: string) {
  try {
    return JSON.parse(value);
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

  return NextResponse.json({
    ok: true,
    data: {
      ...row,
      intake: parseJsonSafely(row.intakeJson),
      scope: parseJsonSafely(row.scopeJson),
      inputs: parseJsonSafely(row.inputsJson),
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
  const nextIntake = {
    ...parseJsonSafely(existing.intakeJson),
    ...(input.intake ?? {}),
  };
  const nextScope = {
    ...parseJsonSafely(existing.scopeJson),
    ...(input.scope ?? {}),
  };
  const nextInputs = input.inputs ?? parseJsonSafely(existing.inputsJson) ?? [];

  const updated = await db.engagement.update({
    where: { id },
    data: {
      title: input.title ?? existing.title,
      status: input.status ?? existing.status,
      notes: input.notes ?? existing.notes,
      engagementType: nextIntake.engagementType ?? existing.engagementType,
      industry: nextIntake.industry ?? existing.industry,
      businessObjective: nextIntake.businessObjective ?? existing.businessObjective,
      timeline: nextIntake.timeline ?? existing.timeline,
      intakeJson: JSON.stringify(nextIntake),
      scopeJson: JSON.stringify(nextScope),
      inputsJson: JSON.stringify(nextInputs),
    },
  });

  return NextResponse.json({ ok: true, data: updated });
}