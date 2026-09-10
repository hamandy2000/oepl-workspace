/** 요청 쿠키에 바인딩된 서버용 Supabase 클라이언트 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Request-scoped Supabase client carrying the signed-in user's session.
 *
 * Queries made through this client run as that user, so RLS applies — writes
 * succeed only for accounts listed in public.admin_users (see supabase/admins.sql).
 * This is the difference that matters versus the service role client: a mistake in
 * route-level authorization can no longer turn into unrestricted database access,
 * because the database is checking too.
 *
 * Not cached across requests — each request has its own cookies.
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component, where cookies are read-only. The proxy
            // refreshes the session on every request, so dropping the write here is
            // safe — it would only have re-set what the proxy already set.
          }
        },
      },
    },
  );
}
