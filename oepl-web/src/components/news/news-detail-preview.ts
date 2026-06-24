import type { ContentPhoto, NewsFile } from "@/types/content";

/** 디자인 확인용 임시 사진 — Admin 업로드 시 대체 */
export const NEWS_DESIGN_PLACEHOLDER_PHOTOS: ContentPhoto[] = [
  { id: -1, url: "https://picsum.photos/id/48/800/450", sortOrder: 0 },
  { id: -2, url: "https://picsum.photos/id/96/800/450", sortOrder: 1 },
];

export function withNewsDesignPreview(photos: ContentPhoto[], _files: NewsFile[]) {
  const hasPhotos = photos.length > 0;
  return {
    photos: hasPhotos ? photos : NEWS_DESIGN_PLACEHOLDER_PHOTOS,
  };
}

export function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toUpperCase() : "FILE";
}

export function fileExtensionStyle(ext: string): { bg: string; color: string } {
  switch (ext) {
    case "PDF":
      return { bg: "rgba(239,68,68,0.1)", color: "#dc2626" };
    case "DOC":
    case "DOCX":
      return { bg: "rgba(59,130,246,0.1)", color: "#2563eb" };
    case "PPT":
    case "PPTX":
      return { bg: "rgba(249,115,22,0.1)", color: "#ea580c" };
    case "XLS":
    case "XLSX":
      return { bg: "rgba(34,197,94,0.1)", color: "#16a34a" };
    default:
      return { bg: "rgba(107,114,128,0.1)", color: "#6b7280" };
  }
}
