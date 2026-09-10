/** 관리자 로그아웃 API — 세션 쿠키 삭제 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  // Revokes the refresh token server-side, not just the local cookie — a copied
  // session stops working instead of staying valid until it expires on its own.
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
