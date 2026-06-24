import type { Lang } from "@/i18n/translations";
import type { GalleryItem, NewsItem, Publication } from "@/types/content";

/** Supabase created_at → YYYY.MM.DD */
export function formatCreatedAtDay(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return formatNewsPostDate(d);
}

/** Supabase created_at → YYYY.MM.DD HH:mm (seconds truncated) */
export function formatCreatedAtMinute(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setSeconds(0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${h}:${min}`;
}

/** 뉴스 게시일 — YYYY.MM.DD (최초 저장 시점) */
export function formatNewsPostDate(when = new Date()): string {
  const y = when.getFullYear();
  const m = String(when.getMonth() + 1).padStart(2, "0");
  const day = String(when.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function newsSortKey(item: NewsItem): number {
  if (item.createdAt) {
    const d = new Date(item.createdAt);
    if (!Number.isNaN(d.getTime())) {
      d.setSeconds(0, 0);
      return d.getTime();
    }
  }
  const parsed = new Date(item.date.replace(/\./g, "-"));
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

/** 고정글 우선, 그다음 날짜순 정렬 */
export function sortNewsItems(
  news: NewsItem[],
  order: "newest" | "oldest" = "newest"
): NewsItem[] {
  return [...news].sort((a, b) => {
    const pinDiff = Number(b.pinned) - Number(a.pinned);
    if (pinDiff !== 0) return pinDiff;
    const dateDiff = newsSortKey(b) - newsSortKey(a);
    return order === "newest" ? dateDiff : -dateDiff;
  });
}

/** 가장 최근 뉴스 id (고정글 제외, newsSortKey 기준) */
export function latestNewsId(news: NewsItem[]): number | null {
  const candidates = news.filter((n) => !n.pinned);
  if (candidates.length === 0) return null;
  const sorted = [...candidates].sort((a, b) => newsSortKey(b) - newsSortKey(a));
  return sorted[0]!.id;
}

export function newsCoverPhoto(item: NewsItem): string | undefined {
  return item.photos[0]?.url;
}

export function galleryCoverPhoto(item: GalleryItem): string | undefined {
  return item.photoUrl;
}

export function newsDisplay(item: NewsItem, _lang: Lang) {
  return {
    type: item.type,
    date: formatCreatedAtDay(item.createdAt) ?? item.date,
    title: item.title,
    detail: item.detail,
    author: item.author?.trim() ?? "",
    viewCount: item.viewCount ?? 0,
    photos: item.photos,
    coverPhoto: newsCoverPhoto(item),
    files: item.files,
  };
}

/** 최신순 목록 기준 — 이전글(더 과거) · 다음글(더 최신) */
export function newsNeighbors(
  news: NewsItem[],
  currentId: number
): { prev: NewsItem | null; next: NewsItem | null } {
  const sorted = sortNewsItems(news);
  const index = sorted.findIndex((n) => n.id === currentId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: sorted[index + 1] ?? null,
    next: sorted[index - 1] ?? null,
  };
}

export function publicationPublishedAt(pub: Publication): string | null {
  const v = pub.publishedAt?.trim();
  if (v) return v;
  if (pub.createdAt) return pub.createdAt.slice(0, 10);
  return null;
}

export function publicationYear(pub: Publication): number | null {
  const iso = publicationPublishedAt(pub);
  if (!iso) return null;
  const y = Number(iso.slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

/** Admin 저장 전 게재일 기본값 */
export function normalizePublication(item: Publication): Publication {
  const publishedAt = item.publishedAt?.trim() || new Date().toISOString().slice(0, 10);
  return { ...item, publishedAt, type: item.type || "Journal" };
}

/** Publication 게시일 — YYYY.MM.DD */
export function formatPublicationDate(pub: Publication): string | null {
  const iso = publicationPublishedAt(pub);
  if (!iso) return null;
  const [y, m, day] = iso.split("-");
  if (!y || !m || !day) return null;
  return `${y}.${m}.${day}`;
}

export function publicationDateInputValue(pub: Publication): string {
  return publicationPublishedAt(pub) ?? new Date().toISOString().slice(0, 10);
}

export function publicationSortKey(pub: Publication): number {
  const iso = publicationPublishedAt(pub);
  if (!iso) return 0;
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

/** 특허일 — YYYY-MM-DD (input) / YYYY.MM.DD (표시) */
export function patentDateToIso(date: string): string {
  const v = date.trim();
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(v)) return v.replace(/\./g, "-");
  if (/^\d{4}$/.test(v)) return `${v}-01-01`;
  const parsed = new Date(v);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return "";
}

export function patentDateInputValue(date: string): string {
  return patentDateToIso(date);
}

export function formatPatentDate(date: string): string {
  const iso = patentDateToIso(date);
  if (!iso) return date.trim() || "—";
  const [y, m, day] = iso.split("-");
  return `${y}.${m}.${day}`;
}

export function normalizePatentDate(date: string): string {
  return patentDateToIso(date) || new Date().toISOString().slice(0, 10);
}

export function patentSortKey(date: string): number {
  const iso = patentDateToIso(date);
  if (!iso) return 0;
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}
