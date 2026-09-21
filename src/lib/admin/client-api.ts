/** 클라이언트용 관리자 API 래퍼 — /api/admin 라우트 호출 */

import type { AdminContentAction } from "@/lib/data/repository-admin";
import type { NewsMediaDraft } from "@/lib/data/media-sync";

async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const json = JSON.parse(text) as { error?: string };
    return json.error ?? text;
  } catch {
    return text || "Request failed";
  }
}

export async function adminContentMutate<T>(action: AdminContentAction, payload: unknown): Promise<T> {
  const res = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action, payload }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<T>;
}

export async function adminSyncNewsMedia(
  newsId: number,
  draft: NewsMediaDraft
): Promise<{ photos: NewsMediaDraft["keptPhotos"]; files: NewsMediaDraft["keptFiles"] }> {
  const form = new FormData();
  form.append("newsId", String(newsId));
  form.append(
    "draft",
    JSON.stringify({
      keptPhotos: draft.keptPhotos,
      keptFiles: draft.keptFiles,
      removedPhotoIds: draft.removedPhotoIds,
      removedFileIds: draft.removedFileIds,
    })
  );
  draft.newPhotoFiles.forEach((file) => form.append("newPhotoFiles", file));
  draft.newFiles.forEach((file) => form.append("newFiles", file));

  const res = await fetch("/api/admin/news/media", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export type AdminUploadKind = "gallery-photo" | "member-photo" | "professor-photo";

export async function adminUploadFile(
  kind: AdminUploadKind,
  file: File,
  entityId?: number
): Promise<string> {
  const form = new FormData();
  form.append("kind", kind);
  form.append("file", file);
  if (entityId != null) form.append("entityId", String(entityId));

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res));
  const json = (await res.json()) as { url: string };
  return json.url;
}

export async function adminRemoveGalleryPhoto(galleryId: number): Promise<void> {
  const res = await fetch("/api/admin/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ kind: "gallery-photo", entityId: galleryId }),
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function adminRemoveMemberPhoto(memberId: number): Promise<void> {
  const res = await fetch("/api/admin/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ kind: "member-photo", entityId: memberId }),
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function adminRemoveProfessorPhoto(): Promise<void> {
  const res = await fetch("/api/admin/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ kind: "professor-photo" }),
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const res = await fetch("/api/auth/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const err = new Error(await parseError(res)) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
}
