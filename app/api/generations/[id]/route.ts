export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getGenerationById } from "@/lib/repo/generations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const record = await getGenerationById(id);
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(record);
}
