/** 관리자 비밀번호 변경 API — 현재 비밀번호 재확인 후 변경 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth/require-admin-api";
import {
  checkLoginRateLimit,
  clientKeyFromRequest,
  resetLoginRateLimit,
} from "@/lib/auth/rate-limit";

export const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { user, client } = guard.session;
  const email = user.email;
  if (!email) {
    return NextResponse.json({ error: "Account has no email" }, { status: 400 });
  }

  // 현재 비밀번호를 맞힐 때까지 반복 시도하는 것을 로그인과 같은 한도로 막는다.
  const rateKey = clientKeyFromRequest(request);
  const limit = checkLoginRateLimit(rateKey);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    currentPassword?: string;
    newPassword?: string;
  } | null;

  const currentPassword = body?.currentPassword ?? "";
  const newPassword = body?.newPassword ?? "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Missing password" }, { status: 400 });
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: "Password too short" }, { status: 400 });
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: "Password unchanged" }, { status: 400 });
  }

  /*
   * updateUser()는 세션만 있으면 현재 비밀번호 없이도 바꾼다. 로그인된 화면을
   * 잠깐 만진 사람이 비밀번호를 갈아치우고 계정을 가져가는 것을 막으려고, 별도
   * 클라이언트로 현재 비밀번호를 먼저 확인한다.
   *
   * 확인에는 쿠키를 만지지 않는 별도 클라이언트를 쓴다. signInWithPassword는 호출한
   * 클라이언트의 세션을 덮어쓰므로, 요청자의 세션 쿠키가 휩쓸리지 않게 분리한다.
   */
  const verifier = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { error: verifyError } = await verifier.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (verifyError) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { error: updateError } = await client.auth.updateUser({ password: newPassword });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  resetLoginRateLimit(rateKey);
  return NextResponse.json({ ok: true });
}
