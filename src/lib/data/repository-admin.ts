/** 서비스 롤 기반 콘텐츠 저장/삭제 (API 라우트 전용) */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GalleryItem,
  MemberRecord,
  NewsItem,
  Patent,
  Publication,
} from "@/types/content";
import { isNewId } from "@/lib/data/ids";
import {
  galleryFromRow,
  galleryToRow,
  memberRecordFromRow,
  memberRecordToRow,
  newsFromRow,
  newsToRow,
  patentFromRow,
  patentToRow,
  publicationFromRow,
  publicationToRow,
} from "@/lib/data/mappers";
import { removeNewsMediaWithClient } from "@/lib/data/media-sync-server";
import { removeGalleryPhotoWithClient } from "@/lib/supabase/content-media-server";

async function upsertEntity<T extends { id: number }>(
  client: SupabaseClient,
  table: string,
  item: T,
  toRow: (item: T, updating: boolean) => Record<string, unknown>,
  fromRow: (row: Record<string, unknown>) => T
): Promise<T> {
  if (isNewId(item.id)) {
    const { data, error } = await client.from(table).insert(toRow(item, false)).select().single();
    if (error) throw new Error(error.message);
    return fromRow(data as Record<string, unknown>);
  }
  const { data, error } = await client.from(table).upsert(toRow(item, true)).select().single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}

// Every function here takes the caller's Supabase client rather than creating a
// service role client of its own. That client carries the admin's identity, so RLS
// (see supabase/admins.sql) re-checks each write at the database — route-level
// authorization is no longer the only thing between a request and the data.

export async function persistNewsAdmin(client: SupabaseClient, item: NewsItem): Promise<NewsItem> {
  return upsertEntity(client, "news", item, newsToRow, newsFromRow);
}

export async function removeNewsAdmin(client: SupabaseClient, id: number): Promise<void> {
  await removeNewsMediaWithClient(client, id);
  const { error } = await client.from("news").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function persistPublicationAdmin(client: SupabaseClient, item: Publication): Promise<Publication> {
  return upsertEntity(client, "publications", item, publicationToRow, publicationFromRow);
}

export async function removePublicationAdmin(client: SupabaseClient, id: number): Promise<void> {
  const { error } = await client.from("publications").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function persistGalleryAdmin(client: SupabaseClient, item: GalleryItem): Promise<GalleryItem> {
  return upsertEntity(client, "gallery", item, galleryToRow, galleryFromRow);
}

export async function removeGalleryAdmin(client: SupabaseClient, id: number): Promise<void> {
  await removeGalleryPhotoWithClient(client, id);
  const { error } = await client.from("gallery").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function persistPatentAdmin(client: SupabaseClient, item: Patent): Promise<Patent> {
  return upsertEntity(client, "patents", item, patentToRow, patentFromRow);
}

export async function removePatentAdmin(client: SupabaseClient, id: number): Promise<void> {
  const { error } = await client.from("patents").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function persistMemberAdmin(client: SupabaseClient, item: MemberRecord): Promise<MemberRecord> {
  return upsertEntity(client, "members", item, memberRecordToRow, memberRecordFromRow);
}

export async function removeMemberAdmin(client: SupabaseClient, id: number): Promise<void> {
  const { error } = await client.from("members").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type AdminContentAction =
  | "upsertNews"
  | "deleteNews"
  | "upsertPublication"
  | "deletePublication"
  | "upsertGallery"
  | "deleteGallery"
  | "upsertPatent"
  | "deletePatent"
  | "upsertMember"
  | "deleteMember";

export async function runAdminContentAction(
  client: SupabaseClient,
  action: AdminContentAction,
  payload: unknown,
) {
  switch (action) {
    case "upsertNews":
      return persistNewsAdmin(client, payload as NewsItem);
    case "deleteNews":
      await removeNewsAdmin(client, Number(payload));
      return { ok: true };
    case "upsertPublication":
      return persistPublicationAdmin(client, payload as Publication);
    case "deletePublication":
      await removePublicationAdmin(client, Number(payload));
      return { ok: true };
    case "upsertGallery":
      return persistGalleryAdmin(client, payload as GalleryItem);
    case "deleteGallery":
      await removeGalleryAdmin(client, Number(payload));
      return { ok: true };
    case "upsertPatent":
      return persistPatentAdmin(client, payload as Patent);
    case "deletePatent":
      await removePatentAdmin(client, Number(payload));
      return { ok: true };
    case "upsertMember":
      return persistMemberAdmin(client, payload as MemberRecord);
    case "deleteMember":
      await removeMemberAdmin(client, Number(payload));
      return { ok: true };
    default:
      throw new Error("Unknown action");
  }
}
