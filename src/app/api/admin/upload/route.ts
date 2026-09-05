/** 관리자 파일 업로드/삭제 API — 갤러리·멤버·교수 사진 스토리지 처리 */

import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin-api";
import { createServiceRoleClient, isAdminServerConfigured } from "@/lib/supabase/admin-server";
import {
  removeGalleryPhotoWithClient,
  removeMemberPhotoWithClient,
  removeProfessorPhotoWithClient,
  uploadGalleryPhotoWithClient,
  uploadMemberPhotoWithClient,
  uploadProfessorPhotoWithClient,
} from "@/lib/supabase/content-media-server";
import { validateContentPhotoFile } from "@/lib/supabase/content-media";

type UploadKind = "gallery-photo" | "member-photo" | "professor-photo";

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!isAdminServerConfigured()) {
    return NextResponse.json({ error: "Supabase admin is not configured" }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const kind = form.get("kind");
    const file = form.get("file");
    const entityIdRaw = form.get("entityId");

    if (typeof kind !== "string" || !(file instanceof File)) {
      return NextResponse.json({ error: "Invalid upload payload" }, { status: 400 });
    }

    const validationError = validateContentPhotoFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const client = createServiceRoleClient();
    let url = "";

    switch (kind as UploadKind) {
      case "gallery-photo": {
        const galleryId = Number(entityIdRaw);
        if (!Number.isFinite(galleryId)) {
          return NextResponse.json({ error: "Invalid gallery id" }, { status: 400 });
        }
        url = await uploadGalleryPhotoWithClient(client, galleryId, file);
        break;
      }
      case "member-photo": {
        const memberId = Number(entityIdRaw);
        if (!Number.isFinite(memberId)) {
          return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
        }
        url = await uploadMemberPhotoWithClient(client, memberId, file);
        break;
      }
      case "professor-photo":
        url = await uploadProfessorPhotoWithClient(client, file);
        break;
      default:
        return NextResponse.json({ error: "Unknown upload kind" }, { status: 400 });
    }

    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!isAdminServerConfigured()) {
    return NextResponse.json({ error: "Supabase admin is not configured" }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { kind?: UploadKind; entityId?: number };
    const client = createServiceRoleClient();

    switch (body.kind) {
      case "gallery-photo":
        if (!Number.isFinite(body.entityId)) {
          return NextResponse.json({ error: "Invalid gallery id" }, { status: 400 });
        }
        await removeGalleryPhotoWithClient(client, body.entityId!);
        break;
      case "member-photo":
        if (!Number.isFinite(body.entityId)) {
          return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
        }
        await removeMemberPhotoWithClient(client, body.entityId!);
        break;
      case "professor-photo":
        await removeProfessorPhotoWithClient(client);
        break;
      default:
        return NextResponse.json({ error: "Unknown upload kind" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
