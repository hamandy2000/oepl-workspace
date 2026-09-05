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
import { createServiceRoleClient } from "@/lib/supabase/admin-server";

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

function adminClient() {
  return createServiceRoleClient();
}

export async function persistNewsAdmin(item: NewsItem): Promise<NewsItem> {
  return upsertEntity(adminClient(), "news", item, newsToRow, newsFromRow);
}

export async function removeNewsAdmin(id: number): Promise<void> {
  const client = adminClient();
  await removeNewsMediaWithClient(client, id);
  const { error } = await client.from("news").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function persistPublicationAdmin(item: Publication): Promise<Publication> {
  return upsertEntity(adminClient(), "publications", item, publicationToRow, publicationFromRow);
}

export async function removePublicationAdmin(id: number): Promise<void> {
  const { error } = await adminClient().from("publications").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function persistGalleryAdmin(item: GalleryItem): Promise<GalleryItem> {
  return upsertEntity(adminClient(), "gallery", item, galleryToRow, galleryFromRow);
}

export async function removeGalleryAdmin(id: number): Promise<void> {
  const client = adminClient();
  await removeGalleryPhotoWithClient(client, id);
  const { error } = await client.from("gallery").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function persistPatentAdmin(item: Patent): Promise<Patent> {
  return upsertEntity(adminClient(), "patents", item, patentToRow, patentFromRow);
}

export async function removePatentAdmin(id: number): Promise<void> {
  const { error } = await adminClient().from("patents").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function persistMemberAdmin(item: MemberRecord): Promise<MemberRecord> {
  return upsertEntity(adminClient(), "members", item, memberRecordToRow, memberRecordFromRow);
}

export async function removeMemberAdmin(id: number): Promise<void> {
  const { error } = await adminClient().from("members").delete().eq("id", id);
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

export async function runAdminContentAction(action: AdminContentAction, payload: unknown) {
  switch (action) {
    case "upsertNews":
      return persistNewsAdmin(payload as NewsItem);
    case "deleteNews":
      await removeNewsAdmin(Number(payload));
      return { ok: true };
    case "upsertPublication":
      return persistPublicationAdmin(payload as Publication);
    case "deletePublication":
      await removePublicationAdmin(Number(payload));
      return { ok: true };
    case "upsertGallery":
      return persistGalleryAdmin(payload as GalleryItem);
    case "deleteGallery":
      await removeGalleryAdmin(Number(payload));
      return { ok: true };
    case "upsertPatent":
      return persistPatentAdmin(payload as Patent);
    case "deletePatent":
      await removePatentAdmin(Number(payload));
      return { ok: true };
    case "upsertMember":
      return persistMemberAdmin(payload as MemberRecord);
    case "deleteMember":
      await removeMemberAdmin(Number(payload));
      return { ok: true };
    default:
      throw new Error("Unknown action");
  }
}
