import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  engagementId: z.string().min(1),
  controlRef: z.string().min(1),
  category: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["Pending", "Collected", "Verified", "N/A"]).default("Pending"),
  link: z.string().optional(),
  notes: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const engagementId = searchParams.get("engagementId");
  const where = engagementId ? { engagementId } : {};
  const rows = await db.evidenceItem.findMany({ where, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ ok: true, data: rows });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  const row = await db.evidenceItem.create({ data: parsed.data });
  return NextResponse.json({ ok: true, data: row }, { status: 201 });
}