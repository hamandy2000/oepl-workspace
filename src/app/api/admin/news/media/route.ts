/** 뉴스 미디어 동기화 API — 뉴스 사진·첨부파일을 서버에서 일괄 반영 */

import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin-api";
import { syncNewsMediaWithClient } from "@/lib/data/media-sync-server";
import type { NewsMediaDraft } from "@/lib/data/media-sync";
import { createServiceRoleClient, isAdminServerConfigured } from "@/lib/supabase/admin-server";
import { validateContentPhotoFile, validateNewsFile } from "@/lib/supabase/content-media";

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!isAdminServerConfigured()) {
    return NextResponse.json({ error: "Supabase admin is not configured" }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const newsId = Number(form.get("newsId"));
    if (!Number.isFinite(newsId)) {
      return NextResponse.json({ error: "Invalid newsId" }, { status: 400 });
    }

    const draftJson = form.get("draft");
    if (typeof draftJson !== "string") {
      return NextResponse.json({ error: "Missing draft" }, { status: 400 });
    }

    const parsed = JSON.parse(draftJson) as Omit<
      NewsMediaDraft,
      "newPhotoFiles" | "newFiles"
    >;

    const draft: NewsMediaDraft = {
      keptPhotos: parsed.keptPhotos ?? [],
      keptFiles: parsed.keptFiles ?? [],
      removedPhotoIds: parsed.removedPhotoIds ?? [],
      removedFileIds: parsed.removedFileIds ?? [],
      newPhotoFiles: form.getAll("newPhotoFiles").filter((v): v is File => v instanceof File),
      newFiles: form.getAll("newFiles").filter((v): v is File => v instanceof File),
    };

    for (const file of draft.newPhotoFiles) {
      const validationError = validateContentPhotoFile(file);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }
    for (const file of draft.newFiles) {
      const validationError = validateNewsFile(file);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    const client = createServiceRoleClient();
    const result = await syncNewsMediaWithClient(client, newsId, draft);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Media sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
