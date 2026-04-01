import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createEngagementSchema } from "@/lib/engagement-api-schema";

function parseJsonSafely(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function GET() {
  const rows = await db.engagement.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const data = rows.map((row) => ({
    ...row,
    intake: parseJsonSafely(row.intakeJson),
    scope: parseJsonSafely(row.scopeJson),
    inputs: parseJsonSafely(row.inputsJson),
  }));

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
  const row = await db.engagement.create({
    data: {
      title: input.title,
      status: input.status,
      notes: input.notes,
      engagementType: input.intake.engagementType ?? "Advisory",
      industry: input.intake.industry ?? "Generic",
      businessObjective: input.intake.businessObjective ?? "",
      timeline: input.intake.timeline ?? "",
      intakeJson: JSON.stringify(input.intake),
      scopeJson: JSON.stringify(input.scope),
      inputsJson: JSON.stringify(input.inputs),
    },
  });

  return NextResponse.json({ ok: true, data: row }, { status: 201 });
}