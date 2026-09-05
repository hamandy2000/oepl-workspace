/** 관리자 로그인 API — 자격 검증 후 세션 쿠키 발급 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createSessionToken,
  verifyAdminCredentials,
} from "@/lib/auth/admin-session";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(), adminSessionCookieOptions);
  return NextResponse.json({ ok: true });
}
