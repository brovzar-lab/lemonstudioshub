import { handlers } from "@/lib/auth";
import { authRateLimit } from "@/lib/rate-limit";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anon";
  const { success } = await authRateLimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }
  return handlers.POST(req);
}
