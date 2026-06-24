import tokens from "@/styles/tokens.json";

export type BrandColorToken = {
  id: string;
  token: string;
  cssVar: string;
  hex: string;
  lightLabel: boolean;
  name: { kr: string; en: string };
};

const c = tokens.color;

/** CI 소개에 표시할 브랜드 팔레트 — tokens.json / globals.css @theme 과 동기화 */
export const brandPalette: BrandColorToken[] = [
  {
    id: "brand",
    token: "color.amber.500",
    cssVar: "--color-brand",
    hex: c.amber["500"].$value,
    lightLabel: true,
    name: { kr: "Brand Amber", en: "Brand Amber" },
  },
  {
    id: "bg",
    token: "color.neutral.900",
    cssVar: "--color-neutral-900",
    hex: c.neutral["900"].$value,
    lightLabel: true,
    name: { kr: "Neutral 900", en: "Neutral 900" },
  },
  {
    id: "subtle",
    token: "color.neutral.500",
    cssVar: "--color-subtle",
    hex: c.neutral["500"].$value,
    lightLabel: false,
    name: { kr: "Neutral 500", en: "Neutral 500" },
  },
  {
    id: "surface",
    token: "color.neutral.50",
    cssVar: "--color-neutral-50",
    hex: c.neutral["50"].$value,
    lightLabel: false,
    name: { kr: "Neutral 50", en: "Neutral 50" },
  },
];

export function brandColorStyle(cssVar: string): string {
  return `var(${cssVar})`;
}
