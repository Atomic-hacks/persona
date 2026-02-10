export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { insertGeneration } from "@/lib/repo/generations";
import { findBannedWord } from "@/lib/moderation";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 12;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function getIp(request: Request) {
  const headerList = request.headers;
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = headerList.get("x-real-ip");
  return realIp ?? "127.0.0.1";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return { ok: true };
}

export async function POST(request: Request) {
  const { z } = await import("zod");
  const GenerationSchema = z.object({
    type: z.enum(["persona", "scenario", "misinterpretation"]),
    input: z.record(z.string(), z.any()),
    output: z.record(z.string(), z.any()),
    output_text: z.string().min(1),
  });

  const ip = getIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Rate limit hit. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const body = await request.json();
  const parsed = GenerationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload." },
      { status: 400 },
    );
  }

  const bannedWord = findBannedWord(JSON.stringify(parsed.data.input));
  if (bannedWord) {
    return NextResponse.json(
      { error: "That input needs a quick edit. Try softer wording." },
      { status: 400 },
    );
  }

  const record = await insertGeneration(parsed.data);
  const origin = request.headers.get("origin") ?? "http://localhost:3000";
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? origin;
  const shareUrl = new URL(`/r/${record.id}`, base).toString();

  return NextResponse.json({ id: record.id, shareUrl });
}

// TODO: Use Redis or Upstash for rate limiting in production.
