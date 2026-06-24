import type { ContentPhoto, NewsFile, NewsItem } from "@/types/content";
import {
  newsFileFromRow,
  newsFileToRow,
  newsPhotoFromRow,
  newsPhotoToRow,
} from "@/lib/data/mappers";
import {
  readContentPhotoPreview,
  removeStorageObjectByUrl,
  uploadNewsFile,
  uploadNewsPhoto,
} from "@/lib/supabase/content-media";
import { createClient } from "@/lib/supabase/client";
import { NEW_ID, nextLocalId } from "@/lib/data/ids";

function sb() {
  return createClient();
}

function groupByNewsId(rows: Record<string, unknown>[]) {
  const map = new Map<number, Record<string, unknown>[]>();
  for (const row of rows) {
    const newsId = Number(row.news_id);
    if (!map.has(newsId)) map.set(newsId, []);
    map.get(newsId)!.push(row);
  }
  return map;
}

export function attachNewsMedia(
  news: NewsItem[],
  photoRows: Record<string, unknown>[],
  fileRows: Record<string, unknown>[]
): NewsItem[] {
  const photosByNews = groupByNewsId(photoRows);
  const filesByNews = groupByNewsId(fileRows);
  return news.map((item) => ({
    ...item,
    photos: (photosByNews.get(item.id) ?? [])
      .map(newsPhotoFromRow)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    files: (filesByNews.get(item.id) ?? [])
      .map(newsFileFromRow)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}

export type NewsMediaDraft = {
  keptPhotos: ContentPhoto[];
  keptFiles: NewsFile[];
  removedPhotoIds: number[];
  removedFileIds: number[];
  newPhotoFiles: File[];
  newFiles: File[];
};

export async function syncNewsMedia(
  newsId: number,
  draft: NewsMediaDraft
): Promise<{ photos: ContentPhoto[]; files: NewsFile[] }> {
  const client = sb();
  const keptPhotos = draft.keptPhotos.filter((p) => !draft.removedPhotoIds.includes(p.id));
  const keptFiles = draft.keptFiles.filter((f) => !draft.removedFileIds.includes(f.id));

  for (const id of draft.removedPhotoIds) {
    const { data } = await client.from("news_photos").select("url").eq("id", id).maybeSingle();
    if (data?.url) await removeStorageObjectByUrl(data.url as string);
    const { error } = await client.from("news_photos").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  for (const id of draft.removedFileIds) {
    const { data } = await client.from("news_file").select("url").eq("id", id).maybeSingle();
    if (data?.url) await removeStorageObjectByUrl(data.url as string);
    const { error } = await client.from("news_file").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  let photoOrder = keptPhotos.length;
  for (let i = 0; i < draft.newPhotoFiles.length; i++) {
    const url = await uploadNewsPhoto(newsId, draft.newPhotoFiles[i], i);
    const row = newsPhotoToRow(newsId, { id: NEW_ID, url, sortOrder: photoOrder + i }, photoOrder + i);
    const { data, error } = await client.from("news_photos").insert(row).select().single();
    if (error) throw new Error(error.message);
    keptPhotos.push(newsPhotoFromRow(data as Record<string, unknown>));
  }

  let fileOrder = keptFiles.length;
  for (let i = 0; i < draft.newFiles.length; i++) {
    const file = draft.newFiles[i];
    const url = await uploadNewsFile(newsId, file, i);
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

export async function removeNewsMedia(newsId: number): Promise<void> {
  const client = sb();
  const [photosRes, filesRes] = await Promise.all([
    client.from("news_photos").select("url").eq("news_id", newsId),
    client.from("news_file").select("url").eq("news_id", newsId),
  ]);
  if (photosRes.error) throw new Error(photosRes.error.message);
  if (filesRes.error) throw new Error(filesRes.error.message);

  for (const row of photosRes.data ?? []) {
    if (row.url) await removeStorageObjectByUrl(row.url as string);
  }
  for (const row of filesRes.data ?? []) {
    if (row.url) await removeStorageObjectByUrl(row.url as string);
  }
}

export async function buildLocalNewsMedia(draft: NewsMediaDraft): Promise<{
  photos: ContentPhoto[];
  files: NewsFile[];
}> {
  const photos = draft.keptPhotos.filter((p) => !draft.removedPhotoIds.includes(p.id));
  const files = draft.keptFiles.filter((f) => !draft.removedFileIds.includes(f.id));

  for (let i = 0; i < draft.newPhotoFiles.length; i++) {
    const file = draft.newPhotoFiles[i];
    const url = await readContentPhotoPreview(file);
    photos.push({ id: nextLocalId(photos), url, sortOrder: photos.length });
  }

  for (let i = 0; i < draft.newFiles.length; i++) {
    const file = draft.newFiles[i];
    const url = await readContentPhotoPreview(file);
    files.push({
      id: nextLocalId(files),
      url,
      fileName: file.name,
      sortOrder: files.length,
    });
  }

  return { photos, files };
}
