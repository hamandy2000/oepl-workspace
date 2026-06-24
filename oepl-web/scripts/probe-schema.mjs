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

async function probe(table, columns) {
  const select = columns.join(",");
  const res = await fetch(`${url}/rest/v1/${table}?select=${select}&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  return { table, ok: res.ok, status: res.status, body: body.slice(0, 200) };
}

const checks = [
  probe("news", ["id", "type", "title", "detail"]),
  probe("news_photos", ["id", "news_id", "url", "sort_order"]),
  probe("news_file", ["id", "news_id", "url", "file_name"]),
  probe("publications", ["id", "title_ko", "title_en", "doi_link"]),
  probe("gallery", ["id", "type", "photo_url"]),
  probe("members", ["id", "photo_url", "graduation_date", "research"]),
];

const results = await Promise.all(checks);
for (const r of results) {
  console.log(r.ok ? "✅" : "❌", r.table, r.status, r.ok ? "" : r.body);
}
