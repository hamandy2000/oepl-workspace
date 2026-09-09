/** 관리자 콘텐츠 변경 API — 서비스 롤 권한으로 저장/삭제 액션을 처리 */

import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin-api";
import {
  type AdminContentAction,
  runAdminContentAction,
} from "@/lib/data/repository-admin";
import { isAdminServerConfigured } from "@/lib/supabase/admin-server";

const ACTIONS = new Set<AdminContentAction>([
  "upsertNews",
  "deleteNews",
  "upsertPublication",
  "deletePublication",
  "upsertGallery",
  "deleteGallery",
  "upsertPatent",
  "deletePatent",
  "upsertMember",
  "deleteMember",
]);

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (!isAdminServerConfigured()) {
    return NextResponse.json({ error: "Supabase admin is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as { action?: string; payload?: unknown };
  if (!body.action || !ACTIONS.has(body.action as AdminContentAction)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const result = await runAdminContentAction(body.action as AdminContentAction, body.payload);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Persist failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
