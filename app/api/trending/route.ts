export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getTrending } from "@/lib/repo/generations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? 7);
  const limit = Number(searchParams.get("limit") ?? 10);
  const safeDays = Number.isFinite(days) ? Math.max(1, Math.min(days, 30)) : 7;
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 20)) : 10;

  const items = await getTrending(safeDays, safeLimit);
  return NextResponse.json({ items });
}
