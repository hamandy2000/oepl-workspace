import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/** Increments news view_count in Supabase; returns new count or null on failure / offline. */
export async function incrementNewsViewCount(newsId: number): Promise<number | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await createClient().rpc("increment_news_view_count", {
    p_news_id: newsId,
  });

  if (error) {
    console.error("[incrementNewsViewCount]", error.message);
    return null;
  }

  const count = typeof data === "number" ? data : Number(data);
  return Number.isFinite(count) ? count : null;
}
