/** 멤버·교수 사진 업로드·삭제·검증 */

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

import { MEMBER_PHOTOS_BUCKET, PHOTO_MAX_BYTES, PHOTO_MAX_MB } from "@/lib/supabase/content-media-constants";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateMemberPhotoFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.";
  }
  if (file.size > PHOTO_MAX_BYTES) {
    return `이미지 크기는 ${PHOTO_MAX_MB}MB 이하여야 합니다.`;
  }
  return null;
}

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

export async function uploadProfessorPhoto(file: File): Promise<string> {
  const validationError = validateMemberPhotoFile(file);
  if (validationError) throw new Error(validationError);

  if (!isSupabaseConfigured()) {
    return readFileAsDataUrl(file);
  }

  const sb = createClient();
  const path = `professor/avatar.${photoExtension(file)}`;
  const { error } = await sb.storage.from(MEMBER_PHOTOS_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);

  const { data } = sb.storage.from(MEMBER_PHOTOS_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function removeProfessorPhoto(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const sb = createClient();
  const { data, error: listError } = await sb.storage.from(MEMBER_PHOTOS_BUCKET).list("professor");
  if (listError) throw new Error(listError.message);
  if (!data?.length) return;

  const paths = data.map((obj) => `professor/${obj.name}`);
  const { error } = await sb.storage.from(MEMBER_PHOTOS_BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}

export async function uploadMemberPhoto(memberId: number, file: File): Promise<string> {
  const validationError = validateMemberPhotoFile(file);
  if (validationError) throw new Error(validationError);

  if (!isSupabaseConfigured()) {
    return readFileAsDataUrl(file);
  }

  const sb = createClient();
  const path = `${memberId}/avatar.${photoExtension(file)}`;
  const { error } = await sb.storage.from(MEMBER_PHOTOS_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);

  const { data } = sb.storage.from(MEMBER_PHOTOS_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function removeMemberPhoto(memberId: number): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const sb = createClient();
  const { data, error: listError } = await sb.storage.from(MEMBER_PHOTOS_BUCKET).list(String(memberId));
  if (listError) throw new Error(listError.message);
  if (!data?.length) return;

  const paths = data.map((obj) => `${memberId}/${obj.name}`);
  const { error } = await sb.storage.from(MEMBER_PHOTOS_BUCKET).remove(paths);
  if (error) throw new Error(error.message);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("이미지를 읽을 수 없습니다."));
    reader.readAsDataURL(file);
  });
}

export function readMemberPhotoPreview(file: File): Promise<string> {
  return readFileAsDataUrl(file);
}
