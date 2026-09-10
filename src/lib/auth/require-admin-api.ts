/** API 라우트용 관리자 인증 가드 */

import { NextResponse } from "next/server";
import { getAdminSession, getCurrentUser, type AdminSession } from "@/lib/auth/dal";

export type AdminGuardResult =
  | { ok: true; session: AdminSession }
  | { ok: false; response: NextResponse };

/**
 * Gate for admin route handlers. Returns the caller's admin session — including a
 * Supabase client bound to their identity, which route handlers should use for all
 * writes so RLS applies on top of this check.
 *
 * 401 means "not signed in", 403 means "signed in, not an admin". Distinguishing
 * them is fine here: reaching this point already required a valid session, so it
 * leaks nothing an attacker doesn't have.
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await getAdminSession();
  if (session) return { ok: true, session };

  const user = await getCurrentUser();
  return {
    ok: false,
    response: user
      ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
      : NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  };
}
