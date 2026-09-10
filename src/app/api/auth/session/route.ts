/** 관리자 세션 확인 API — 현재 쿠키의 유효성 반환 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/dal";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({
    authenticated: session !== null,
    email: session?.user.email ?? null,
  });
}
