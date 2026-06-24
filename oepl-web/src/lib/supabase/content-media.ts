import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  readMemberPhotoPreview,
  validateMemberPhotoFile,
} from "@/lib/supabase/member-photos";

export const NEWS_PHOTOS_BUCKET = "news-photos";
export const GALLERY_PHOTOS_BUCKET = "gallery-photos";
export const NEWS_FILES_BUCKET = "news-files";

export { validateMemberPhotoFile as validateContentPhotoFile, readMemberPhotoPreview as readContentPhotoPreview };

const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
const ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-hwp",
  "application/haansofthwp",
  "application/octet-stream",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.readAsDataURL(file);
  });
}

export function validateNewsFile(file: File): string | null {
  if (file.size > ATTACHMENT_MAX_BYTES) return "첨부파일은 10MB 이하만 업로드할 수 있습니다.";
  if (!ATTACHMENT_TYPES.has(file.type) && !file.name.match(/\.(pdf|doc|docx|ppt|pptx|zip|hwp|hwpx|jpg|jpeg|png|webp)$/i)) {
    return "지원하지 않는 파일 형식입니다.";
  }
  return null;
}

async function uploadToBucket(bucket: string, path: string, file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    return readFileAsDataUrl(file);
  }

  const sb = createClient();
  const { error } = await sb.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);

  const { data } = sb.storage.from(bucket).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function uploadNewsPhoto(newsId: number, file: File, index: number): Promise<string> {
  const validationError = validateMemberPhotoFile(file);
  if (validationError) throw new Error(validationError);
  const path = `${newsId}/${Date.now()}-${index}.${photoExtension(file)}`;
  return uploadToBucket(NEWS_PHOTOS_BUCKET, path, file);
}

export async function uploadGalleryPhoto(galleryId: number, file: File): Promise<string> {
  const validationError = validateMemberPhotoFile(file);
  if (validationError) throw new Error(validationError);
  const path = `${galleryId}/cover.${photoExtension(file)}`;
  return uploadToBucket(GALLERY_PHOTOS_BUCKET, path, file);
}

export async function removeGalleryPhoto(galleryId: number): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const sb = createClient();
  const { data, error: listError } = await sb.storage.from(GALLERY_PHOTOS_BUCKET).list(String(galleryId));
  if (listError) throw new Error(listError.message);
  if (!data?.length) return;

  const paths = data.map((obj) => `${galleryId}/${obj.name}`);
  const { error } = await sb.storage.from(GALLERY_PHOTOS_BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}

export async function uploadNewsFile(newsId: number, file: File, index: number): Promise<string> {
  const validationError = validateNewsFile(file);
  if (validationError) throw new Error(validationError);
  const path = `${newsId}/${Date.now()}-${index}-${sanitizeFileName(file.name)}`;
  return uploadToBucket(NEWS_FILES_BUCKET, path, file);
}

export async function removeStorageObjectByUrl(url: string): Promise<void> {
  if (!isSupabaseConfigured() || !url.startsWith("http")) return;

  const sb = createClient();
  const buckets = [NEWS_PHOTOS_BUCKET, GALLERY_PHOTOS_BUCKET, NEWS_FILES_BUCKET];
  for (const bucket of buckets) {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) continue;
    const pathWithQuery = url.slice(idx + marker.length);
    const path = pathWithQuery.split("?")[0];
    const { error } = await sb.storage.from(bucket).remove([path]);
    if (error) throw new Error(error.message);
    return;
  }
}
