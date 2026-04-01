import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(["Pending", "Collected", "Verified", "N/A"]).optional(),
  link: z.string().optional(),
  notes: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const payload = await request.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  const row = await db.evidenceItem.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true, data: row });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await db.evidenceItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}