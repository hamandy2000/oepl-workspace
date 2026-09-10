/** 관리자 로그인 API — 자격 검증 후 세션 쿠키 발급 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  checkLoginRateLimit,
  clientKeyFromRequest,
  resetLoginRateLimit,
} from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Auth is not configured" }, { status: 503 });
  }

  const rateKey = clientKeyFromRequest(request);
  const limit = checkLoginRateLimit(rateKey);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    // Deliberately identical to the not-an-admin response below, so this endpoint
    // can't be used to enumerate which emails have accounts.
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!adminRow) {
    // Authenticated but not authorized. Drop the session rather than leaving a
    // usable non-admin cookie behind on an admin-only login form.
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  resetLoginRateLimit(rateKey);
  return NextResponse.json({ ok: true, email: data.user.email ?? null });
}
