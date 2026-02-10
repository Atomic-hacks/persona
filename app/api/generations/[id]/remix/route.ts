export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { incrementRemix } from "@/lib/repo/generations";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await incrementRemix(id);
  return NextResponse.json({ ok: true });
}
