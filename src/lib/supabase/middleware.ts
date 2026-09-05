/** 요청마다 Supabase 세션 쿠키를 갱신하는 미들웨어 로직 */

import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isValidSessionToken,
} from "@/lib/auth/admin-session";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated = isValidSessionToken(token);

  if (pathname.startsWith("/admin") && !authenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && authenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next({ request });
}
