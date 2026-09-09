/** 관리자 세션 확인 API — 현재 쿠키의 유효성 반환 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/auth/admin-session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return NextResponse.json({ authenticated: isValidSessionToken(token) });
}
