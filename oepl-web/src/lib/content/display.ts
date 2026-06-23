import type { Lang } from "@/i18n/translations";
import type { NewsItem, Publication } from "@/types/content";

export function newsDisplay(item: NewsItem, _lang: Lang) {
  return {
    type: item.type,
    date: item.date,
    title: item.title,
    detail: item.detail,
  };
}

export function publicationYear(pub: Publication): number | null {
  if (!pub.createdAt) return null;
  return new Date(pub.createdAt).getFullYear();
}

export function publicationSortKey(pub: Publication): number {
  if (pub.createdAt) return new Date(pub.createdAt).getTime();
  return 0;
}
