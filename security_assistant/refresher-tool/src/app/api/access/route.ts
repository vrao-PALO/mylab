import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { key?: string };
  const configuredKey = process.env.REFRESHER_ACCESS_KEY;

  if (!configuredKey) {
    return NextResponse.json({ ok: true, message: "Access gate disabled." });
  }

  if (!body.key || body.key !== configuredKey) {
    return NextResponse.json({ ok: false, message: "Invalid access key." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("sa_gate", configuredKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
