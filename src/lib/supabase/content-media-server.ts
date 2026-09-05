/** 서버 측 스토리지 업로드/삭제 (뉴스·갤러리·멤버 파일) */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  NEWS_FILES_BUCKET,
  NEWS_PHOTOS_BUCKET,
  GALLERY_PHOTOS_BUCKET,
  MEMBER_PHOTOS_BUCKET,
} from "@/lib/supabase/content-media-constants";

function photoExtension(file: File): string {
  switch (file.type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.\-()가-힣]/g, "_").slice(0, 120) || "file";
}

async function uploadToBucket(
  client: SupabaseClient,
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error } = await client.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function uploadNewsPhotoWithClient(
  client: SupabaseClient,
  newsId: number,
  file: File,
  index: number
): Promise<string> {
  const path = `${newsId}/${Date.now()}-${index}.${photoExtension(file)}`;
  return uploadToBucket(client, NEWS_PHOTOS_BUCKET, path, file);
}

export async function uploadNewsFileWithClient(
  client: SupabaseClient,
  newsId: number,
  file: File,
  index: number
): Promise<string> {
  const path = `${newsId}/${Date.now()}-${index}-${sanitizeFileName(file.name)}`;
  return uploadToBucket(client, NEWS_FILES_BUCKET, path, file);
}

export async function uploadGalleryPhotoWithClient(
  client: SupabaseClient,
  galleryId: number,
  file: File
): Promise<string> {
  const path = `${galleryId}/cover.${photoExtension(file)}`;
  return uploadToBucket(client, GALLERY_PHOTOS_BUCKET, path, file);
}

export async function uploadMemberPhotoWithClient(
  client: SupabaseClient,
  memberId: number,
  file: File
): Promise<string> {
  const path = `${memberId}/avatar.${photoExtension(file)}`;
  return uploadToBucket(client, MEMBER_PHOTOS_BUCKET, path, file);
}

export async function uploadProfessorPhotoWithClient(
  client: SupabaseClient,
  file: File
): Promise<string> {
  const path = `professor/avatar.${photoExtension(file)}`;
  return uploadToBucket(client, MEMBER_PHOTOS_BUCKET, path, file);
}

export async function removeGalleryPhotoWithClient(
  client: SupabaseClient,
  galleryId: number
): Promise<void> {
  const { data, error: listError } = await client.storage
    .from(GALLERY_PHOTOS_BUCKET)
    .list(String(galleryId));
  if (listError) throw new Error(listError.message);
  if (!data?.length) return;
  const paths = data.map((obj) => `${galleryId}/${obj.name}`);
  const { error } = await client.storage.from(GALLERY_PHOTOS_BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}

export async function removeMemberPhotoWithClient(
  client: SupabaseClient,
  memberId: number
): Promise<void> {
  const { data, error: listError } = await client.storage
    .from(MEMBER_PHOTOS_BUCKET)
    .list(String(memberId));
  if (listError) throw new Error(listError.message);
  if (!data?.length) return;
  const paths = data.map((obj) => `${memberId}/${obj.name}`);
  const { error } = await client.storage.from(MEMBER_PHOTOS_BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}

export async function removeProfessorPhotoWithClient(client: SupabaseClient): Promise<void> {
  const { data, error: listError } = await client.storage
    .from(MEMBER_PHOTOS_BUCKET)
    .list("professor");
  if (listError) throw new Error(listError.message);
  if (!data?.length) return;
  const paths = data.map((obj) => `professor/${obj.name}`);
  const { error } = await client.storage.from(MEMBER_PHOTOS_BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}

export async function removeStorageObjectByUrlWithClient(
  client: SupabaseClient,
  url: string
): Promise<void> {
  if (!url.startsWith("http")) return;
  const buckets = [NEWS_PHOTOS_BUCKET, GALLERY_PHOTOS_BUCKET, NEWS_FILES_BUCKET, MEMBER_PHOTOS_BUCKET];
  for (const bucket of buckets) {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) continue;
    const pathWithQuery = url.slice(idx + marker.length);
    const path = pathWithQuery.split("?")[0];
    const { error } = await client.storage.from(bucket).remove([path]);
    if (error) throw new Error(error.message);
    return;
  }
}
