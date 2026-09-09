/** 브랜드 컬러 팔레트 — CI 소개에 표시할 목록 (globals.css @theme 과 동기화할 것) */

export type BrandColorToken = {
  id: string;
  cssVar: string;
  hex: string;
  lightLabel: boolean;
  name: { kr: string; en: string };
};

/** 스와치 색은 cssVar 로 칠하고, hex 는 그 아래 라벨로만 표시한다. */
export const brandPalette: BrandColorToken[] = [
  {
    id: "brand",
    cssVar: "--color-brand",
    hex: "#E88800",
    lightLabel: true,
    name: { kr: "Brand Amber", en: "Brand Amber" },
  },
  {
    id: "bg",
    cssVar: "--color-neutral-900",
    hex: "#1A1A1A",
    lightLabel: true,
    name: { kr: "Neutral 900", en: "Neutral 900" },
  },
];

export function brandColorStyle(cssVar: string): string {
  return `var(${cssVar})`;
}
