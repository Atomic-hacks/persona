export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("Report received", body);
  return NextResponse.json({ ok: true });
}
