/** 서버(서비스 롤) 뉴스 미디어 동기화 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ContentPhoto, NewsFile } from "@/types/content";
import { NEW_ID } from "@/lib/data/ids";
import { newsFileFromRow, newsFileToRow, newsPhotoFromRow, newsPhotoToRow } from "@/lib/data/mappers";
import {
  removeStorageObjectByUrlWithClient,
  uploadNewsFileWithClient,
  uploadNewsPhotoWithClient,
} from "@/lib/supabase/content-media-server";
import type { NewsMediaDraft } from "@/lib/data/media-sync";

export async function syncNewsMediaWithClient(
  client: SupabaseClient,
  newsId: number,
  draft: NewsMediaDraft
): Promise<{ photos: ContentPhoto[]; files: NewsFile[] }> {
  const keptPhotos = draft.keptPhotos.filter((p) => !draft.removedPhotoIds.includes(p.id));
  const keptFiles = draft.keptFiles.filter((f) => !draft.removedFileIds.includes(f.id));

  for (const id of draft.removedPhotoIds) {
    const { data } = await client.from("news_photos").select("url").eq("id", id).maybeSingle();
    if (data?.url) await removeStorageObjectByUrlWithClient(client, data.url as string);
    const { error } = await client.from("news_photos").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  for (const id of draft.removedFileIds) {
    const { data } = await client.from("news_file").select("url").eq("id", id).maybeSingle();
    if (data?.url) await removeStorageObjectByUrlWithClient(client, data.url as string);
    const { error } = await client.from("news_file").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  let photoOrder = keptPhotos.length;
  for (let i = 0; i < draft.newPhotoFiles.length; i++) {
    const url = await uploadNewsPhotoWithClient(client, newsId, draft.newPhotoFiles[i], i);
    const row = newsPhotoToRow(newsId, { id: NEW_ID, url, sortOrder: photoOrder + i }, photoOrder + i);
    const { data, error } = await client.from("news_photos").insert(row).select().single();
    if (error) throw new Error(error.message);
    keptPhotos.push(newsPhotoFromRow(data as Record<string, unknown>));
  }

  let fileOrder = keptFiles.length;
  for (let i = 0; i < draft.newFiles.length; i++) {
    const file = draft.newFiles[i];
    const url = await uploadNewsFileWithClient(client, newsId, file, i);
    const row = newsFileToRow(
      newsId,
      { id: NEW_ID, url, fileName: file.name, sortOrder: fileOrder + i },
      fileOrder + i
    );
    const { data, error } = await client.from("news_file").insert(row).select().single();
    if (error) throw new Error(error.message);
    keptFiles.push(newsFileFromRow(data as Record<string, unknown>));
  }

  return { photos: keptPhotos, files: keptFiles };
}

export async function removeNewsMediaWithClient(client: SupabaseClient, newsId: number): Promise<void> {
  const [photosRes, filesRes] = await Promise.all([
    client.from("news_photos").select("url").eq("news_id", newsId),
    client.from("news_file").select("url").eq("news_id", newsId),
  ]);
  if (photosRes.error) throw new Error(photosRes.error.message);
  if (filesRes.error) throw new Error(filesRes.error.message);

  for (const row of photosRes.data ?? []) {
    if (row.url) await removeStorageObjectByUrlWithClient(client, row.url as string);
  }
  for (const row of filesRes.data ?? []) {
    if (row.url) await removeStorageObjectByUrlWithClient(client, row.url as string);
  }
}
