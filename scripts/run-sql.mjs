/**
 * supabase/*.sql 파일을 순서대로 실행
 * .env.local 필요: SUPABASE_DB_URL (또는 DATABASE_URL)
 * Dashboard → Project Settings → Database → Connection string → URI
 *
 * 사용법:
 *   node scripts/run-sql.mjs                    전체를 의존성 순서대로
 *   node scripts/run-sql.mjs supabase/news.sql  지정한 파일만
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

/**
 * 순서가 중요하다. admins.sql이 public.is_admin()을 정의하고
 * 나머지 파일의 RLS 정책이 그 함수를 호출한다.
 */
const ORDERED_FILES = [
  "supabase/admins.sql",
  "supabase/news.sql",
  "supabase/news_photos.sql",
  "supabase/news_file.sql",
  "supabase/publications.sql",
  "supabase/patents.sql",
  "supabase/members.sql",
  "supabase/gallery.sql",
  "supabase/storage.sql",
];

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8").replace(/^﻿/, "");
    const env = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}

const env = loadEnv();
const dbUrl = env.SUPABASE_DB_URL || env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ SUPABASE_DB_URL (또는 DATABASE_URL)이 .env.local에 없습니다.");
  console.error("   Supabase Dashboard → Project Settings → Database → Connection string → URI");
  process.exit(1);
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : ORDERED_FILES;

const missing = targets.filter((f) => !existsSync(resolve(process.cwd(), f)));
if (missing.length) {
  console.error("❌ 파일을 찾을 수 없습니다:", missing.join(", "));
  process.exit(1);
}

const sql = postgres(dbUrl, { ssl: "require", max: 1 });

try {
  for (const file of targets) {
    process.stdout.write(`  ${file} ... `);
    await sql.file(resolve(process.cwd(), file));
    console.log("ok");
  }
  console.log(`✅ ${targets.length}개 파일 적용 완료`);
} catch (err) {
  console.log("실패");
  console.error("❌", err.message);
  process.exit(1);
} finally {
  await sql.end();
}
