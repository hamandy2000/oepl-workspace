/** 연구 분야 커버 이미지 매핑 — 태그 → public 경로 */

export const RESEARCH_AREA_IMAGES: Partial<Record<string, string>> = {
  OSCs: "/research/oscs.png",
  PSCs: "/research/pscs.png",
  OFETs: "/research/ofets.png",
  "Metal Ink": "/research/metal-ink.png",
  ELA: "/research/ela.png",
};

/** Alternate cover when a card is shown as the home featured tile */
export const RESEARCH_AREA_FEATURED_IMAGES: Partial<Record<string, string>> = {
  ELA: "/research/ela-featured.png",
};

export function researchAreaImage(tag: string, featured = false): string | undefined {
  if (featured) {
    return RESEARCH_AREA_FEATURED_IMAGES[tag] ?? RESEARCH_AREA_IMAGES[tag];
  }
  return RESEARCH_AREA_IMAGES[tag];
}
