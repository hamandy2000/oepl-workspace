/** 관리자 인증 데이터 접근 계층 — 세션 검증 및 admin_users 확인 */

import { cache } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AdminSession = {
  user: User;
  client: SupabaseClient;
};

/**
 * The signed-in user, or null.
 *
 * getUser() rather than getSession(): getSession only decodes whatever is in the
 * cookie, which the client controls, while getUser verifies the token against the
 * auth server. Never decide access from getSession on the server.
 *
 * cache() dedupes this within a single render/request pass.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user ?? null;
  } catch {
    return null;
  }
});

/**
 * The signed-in user *and* proof they're an admin, or null.
 *
 * Signing in is not authorization — the account also has to be in
 * public.admin_users. The same check exists in RLS, so this is the fast path and
 * a clear 403, not the only thing standing between a visitor and the data.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;

    const { data: row, error: adminError } = await client
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !row) return null;
    return { user: data.user, client };
  } catch {
    return null;
  }
});

export async function isCurrentUserAdmin(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}
