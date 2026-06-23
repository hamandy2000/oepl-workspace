/**
 * Supabase 테이블 연결 상태 확인
 * Usage: node scripts/check-db.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ .env.local에 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY가 없습니다.");
  process.exit(1);
}

const tables = ["news", "publications", "gallery", "patents", "members"];

console.log("Supabase 테이블 확인...\n");

let allOk = true;
for (const table of tables) {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (res.ok) {
      console.log(`✅ ${table}`);
    } else {
      const body = await res.text();
      console.log(`❌ ${table} — ${res.status} ${body.slice(0, 120)}`);
      allOk = false;
    }
  } catch (err) {
    console.log(`❌ ${table} — ${err.message}`);
    allOk = false;
  }
}

console.log("");
if (allOk) {
  console.log("모든 테이블 연결 OK. 어드민 → 샘플 데이터 DB에 저장 으로 시드하세요.");
} else {
  console.log("테이블이 없습니다. Supabase SQL Editor에서 supabase/setup_all.sql 을 실행하세요.");
  process.exit(1);
}
