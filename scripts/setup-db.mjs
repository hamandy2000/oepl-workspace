/**
 * Supabase에 setup_all.sql 실행
 * .env.local 필요: SUPABASE_DB_URL (또는 DATABASE_URL)
 * Dashboard → Project Settings → Database → Connection string → URI
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8").replace(/^\uFEFF/, "");
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

const sql = postgres(dbUrl, { ssl: "require", max: 1 });

try {
  console.log("setup_all.sql 실행 중...");
  await sql.file(resolve(process.cwd(), "supabase/setup_all.sql"));
  console.log("✅ 스키마 적용 완료");
} catch (err) {
  console.error("❌ 스키마 적용 실패:", err.message);
  process.exit(1);
} finally {
  await sql.end();
}
