/** 서비스 롤 Supabase 클라이언트 생성 (서버 전용) */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";

let adminClient: SupabaseClient | null = null;

export function isAdminServerConfigured(): boolean {
  return Boolean(
    isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export function createServiceRoleClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  if (!adminClient) {
    adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
