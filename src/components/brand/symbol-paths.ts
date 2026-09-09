/**
 * Draw sequence for public/brand/oepl-symbol.svg
 *
 * SVG path layout (0-based):
 *   0–1 hex (starts bottom-left), 2 top orbit, 3 bottom orbit, 4 leaf, 5 inner
 *
 * Motion order: hex → inner → orbits → leaf
 * `reverse`: reveal from path end toward start (dashoffset −length → 0)
 */
export type SymbolDrawStep = {
  index: number;
  reverse?: boolean;
};

export const SYMBOL_DRAW_SEQUENCE: SymbolDrawStep[] = [
  { index: 1, reverse: true }, // hex ① — bottom-left start (original path 1, reversed)
  { index: 0 }, // hex ⑤~⑦ — original path 0 geometry
  { index: 5, reverse: true }, // inner ⑧~⑨
  { index: 2 }, // orbit ⑩ top
  { index: 3, reverse: true }, // orbit ⑪ bottom
  { index: 4 }, // leaf ⑫~⑬
];

/** @deprecated use SYMBOL_DRAW_SEQUENCE */
export const SYMBOL_DRAW_ORDER = SYMBOL_DRAW_SEQUENCE.map((s) => s.index) as readonly number[];

export type ParsedSymbolSvg = {
  viewBox: string;
  strokeWidth: number;
  stroke?: string;
  strokeLinecap?: string;
  strokeLinejoin?: string;
  paths: string[];
};

export function parseSymbolSvg(markup: string): ParsedSymbolSvg {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) throw new Error("Invalid symbol SVG");

  const viewBox = svg.getAttribute("viewBox") ?? "0 0 886 948";
  const firstPath = doc.querySelector("path");
  const strokeWidth = Number(firstPath?.getAttribute("stroke-width") ?? 50);
  const stroke = firstPath?.getAttribute("stroke") ?? undefined;
  const strokeLinecap = firstPath?.getAttribute("stroke-linecap") ?? undefined;
  const strokeLinejoin = firstPath?.getAttribute("stroke-linejoin") ?? undefined;

  const paths = Array.from(doc.querySelectorAll("path"))
    .map((p) => p.getAttribute("d"))
    .filter((d): d is string => Boolean(d));

  if (paths.length === 0) throw new Error("Symbol SVG has no paths");

  return { viewBox, strokeWidth, stroke, strokeLinecap, strokeLinejoin, paths };
}

export function drawOrder(length: number): number[] {
  const order = SYMBOL_DRAW_ORDER.filter((i) => i < length);
  if (order.length === length) return [...order];
  return Array.from({ length }, (_, i) => i);
}

/** Sequential timing — duration scales with path length */
const DRAW_SPEED = 0.28;

export function strokeDrawTiming(lengths: number[]): { durations: number[]; delays: number[] } {
  const max = Math.max(...lengths, 1);
  const durations = lengths.map((len) => (0.45 + (len / max) * 0.95) * DRAW_SPEED);
  const delays: number[] = [];
  let elapsed = 0;
  for (const duration of durations) {
    delays.push(elapsed);
    elapsed += duration;
  }
  return { durations, delays };
}
