/**
 * Logo mark animation assets:
 * - oepl_typo_logo.svg      — original solid fill (#E88800)
 * - oepl_typo_logo_02.svg   — CI stroke centerlines for draw motion
 */
import { strokeDrawTiming } from "@/components/brand/symbol-paths";
export type LogoLetterId = "o" | "e" | "p" | "l";

export type LogoDrawDirection = "forward" | "reverse";

export type LogoDrawStep = {
  id: LogoLetterId;
  /** Used when drawStart is not set */
  reverse?: boolean;
  /**
   * Draw origin on oepl_typo_logo_02.svg stroke path (viewBox 0 0 1949 779).
   * Nearest point on the path is used as the start.
   */
  drawStart?: { x: number; y: number };
  /** With drawStart: forward = along path, reverse = opposite direction */
  drawDirection?: LogoDrawDirection;
  /** Full mask path in _02 coords — overrides stroke SVG and drawStart */
  drawPath?: string;
  /** Mask stroke-linejoin. Defaults to "round". */
  strokeLinejoin?: "round" | "miter";
};

export type LogoClipBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * ── Draw tuning ──────────────────────────────────────────────
 * Coordinates are in oepl_typo_logo_02.svg space (1949 × 779).
 *
 * Option A — start point + direction (uses _02 stroke path, same geometry as CI):
 *   drawStart: { x, y }, drawDirection: "forward" | "reverse"
 *
 * Option B — full custom path (Option A ignored):
 *   drawPath: "M…"
 *
 * Option C — neither: whole path, optional reverse flag
 * ─────────────────────────────────────────────────────────────
 */
export const LOGO_DRAW_SEQUENCE: LogoDrawStep[] = [
  {
    id: "o",
    // CI direction (matches the Figma reference): top-right → left → bottom-left →
    // bottom-right, closing back at the start (527,73).
    // Close with Z (not a coordinate-matched "H527") so the seam is a proper linejoin, not
    // two overlapping butt caps.
    drawPath:
      "M527 73H275C164.543 73 75 162.543 75 273V363C75 473.457 164.543 563 275 563H327C437.457 563 527 473.457 527 363Z",
    // The seam at (527,73) is the letterform's one genuinely sharp (non-tangent) corner —
    // matching the Figma mark's square top-right corner (rounded-tl/bl/br only, no tr radius).
    // "round" softens it into a visible bump right before the mask is stripped; "miter" keeps
    // it crisp the whole time, so there's no round-then-snap flash at the end of the draw.
    strokeLinejoin: "miter",
  },
  { id: "e", reverse: true },
  { id: "p" },
  { id: "l" },
];

/**
 * The "o" corner block (top-right, ~290 units tall) is much thicker than the ring's normal
 * ~167-187 unit stroke width, so the main sweep's H275 pass only ever grazes its top edge —
 * never enough to reveal it whole. Rather than let that show as a partial sliver (hollow
 * notch) or patch it in early (a piece appearing before the sweep reaches it), this rect is
 * added as its own white shape INSIDE "o"'s mask (unioned with the stroke path there — see
 * AnimatedLogoMark's mask defs), not as a second clip-path/fill-path pair. Two separately
 * clipped copies of the same fill, sitting edge to edge, each get their own antialiasing and
 * leave a faint seam where they meet; one mask with two shapes doesn't. It stays invisible
 * (zero size) until the tail end of the step, then grows in whole. Coordinates are in the
 * fill's own viewBox (2428 × 956).
 *
 * The main sweep's own visible motion is actually done by ~75-78% of its length — the last
 * quarter of drawPath lies inside the corner hole (clipped away), so it keeps "animating"
 * with nothing to show for it. The corner reveal starts right around there — overlapping the
 * dead tail of the main sweep in time, but not in anything actually visible, since nothing
 * else is moving on screen during that window — and finishes exactly when the main sweep's
 * own duration ends, so the two feel like one continuous motion instead of a separate second
 * animation bolted on the end (starting the corner earlier, while the main sweep still has
 * visible ground to cover, is what read as two things moving at once).
 */
export const LOGO_O_CORNER_CLIP: LogoClipBox = {
  x: 560.103,
  // Starts at the letter clip's own top (-20), not the "excess thickness" boundary
  // (166.697) — the main stroke's start point (527,73 in _02 coords) has a butt cap, so it
  // never reaches past x=527 there (butt caps don't extend past the path endpoint at all,
  // only the perpendicular stroke width does). That leaves the sliver from x=527 out to the
  // hole's right edge, for y above 166.697, permanently uncovered by the main layer — not a
  // timing issue, a geometry one. Extending the hole to the full tab height hands that sliver
  // to the corner layer too, instead of leaving a gap neither layer paints.
  y: -20,
  width: 186.701,
  height: 464.526,
};

/** [start, end] as a fraction of the "o" main sweep's own duration. */
export const LOGO_O_CORNER_REVEAL = { start: 0.78, end: 1 } as const;

/** Map 02 stroke coords → original fill viewBox */
export const LOGO_STROKE_SCALE = {
  sx: 2428 / 1949,
  sy: 956 / 779,
} as const;

/** Per-letter clip in original viewBox — prevents mask bleed */
export const LOGO_LETTER_CLIPS: Record<LogoLetterId, LogoClipBox> = {
  o: { x: -20, y: -20, width: 800, height: 820 },
  e: { x: 755, y: -20, width: 735, height: 820 },
  p: { x: 1490, y: -20, width: 730, height: 820 },
  l: { x: 2225, y: -20, width: 215, height: 820 },
};

/**
 * Excludes LOGO_O_CORNER_CLIP from whatever it's applied to — an evenodd "frame with a
 * hole" path, in the fill's own viewBox. Applied to the STROKE PATH only (not the corner
 * rect, and not the fill-o element itself — see AnimatedLogoMark's mask defs): the main
 * sweep's stroke width reaches partway into the corner block as it passes by, and without
 * this, that graze shows up as a small early rectangular nub — the same premature-reveal
 * problem the corner layer exists to avoid, just re-opened from a different angle. Clipping
 * only the stroke, not the corner rect, keeps them both painting into the same mask (no
 * seam) while still keeping the corner invisible until its own reveal says otherwise.
 */
export const LOGO_O_STROKE_EXCLUDE_CORNER_PATH = (() => {
  const box = LOGO_LETTER_CLIPS.o;
  const hole = LOGO_O_CORNER_CLIP;
  return [
    `M${box.x},${box.y}`,
    `H${box.x + box.width}`,
    `V${box.y + box.height}`,
    `H${box.x}`,
    "Z",
    `M${hole.x},${hole.y}`,
    `H${hole.x + hole.width}`,
    `V${hole.y + hole.height}`,
    `H${hole.x}`,
    "Z",
  ].join(" ");
})();

export const LOGO_SUBTITLE_CLIP: LogoClipBox = {
  x: 0,
  y: 800,
  width: 2428,
  height: 160,
};

export const LOGO_MARK_SRC = {
  fill: "/brand/oepl_typo_logo.svg",
  stroke: "/brand/oepl_typo_logo_02.svg",
  dark: "/brand/oepl-logo-mark-dark.png",
} as const;

export const LOGO_FILL = "#E88800";
export const LOGO_SUBTITLE_FILL = "#222124";
export const LOGO_SUBTITLE_FILL_DARK = "#FFFFFF";

/** Mask stroke width in _02 coordinate space (scaled with draw paths) */
export const LOGO_MASK_STROKE_WIDTH = 200;

export type ParsedLogoMark = {
  viewBox: string;
  fills: Record<LogoLetterId, string>;
  drawPaths: Record<LogoLetterId, string>;
  subtitle: string;
};

const LETTER_IDS: LogoLetterId[] = ["o", "e", "p", "l"];

function pathStartX(d: string): number {
  const match = d.match(/M\s*([-\d.]+)/);
  return match ? Number.parseFloat(match[1]) : 0;
}

function isOrangeFill(fill: string | null): boolean {
  return (fill ?? "").replace(/\s/g, "").toUpperCase() === "#E88800";
}

function isOrangeStroke(stroke: string | null): boolean {
  return (stroke ?? "").replace(/\s/g, "").toUpperCase() === "#E88800";
}

function parseFillSvg(markup: string): Pick<ParsedLogoMark, "viewBox" | "fills" | "subtitle"> {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) throw new Error("Invalid fill logo SVG");

  const orangePaths = Array.from(svg.querySelectorAll("path"))
    .filter((path) => isOrangeFill(path.getAttribute("fill")))
    .map((path) => path.getAttribute("d"))
    .filter((d): d is string => Boolean(d))
    .sort((a, b) => pathStartX(a) - pathStartX(b));

  if (orangePaths.length < 4) throw new Error("Fill logo SVG missing letter paths");

  const subtitlePath = Array.from(svg.querySelectorAll("path")).find(
    (path) => !isOrangeFill(path.getAttribute("fill")),
  );
  if (!subtitlePath) throw new Error("Fill logo SVG missing subtitle path");

  const fills = Object.fromEntries(
    LETTER_IDS.map((id, index) => [id, orangePaths[index] ?? ""]),
  ) as Record<LogoLetterId, string>;

  return {
    viewBox: svg.getAttribute("viewBox") ?? "0 0 2428 956",
    fills,
    subtitle: subtitlePath.getAttribute("d") ?? "",
  };
}

function parseStrokeSvg(markup: string): Record<LogoLetterId, string> {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) throw new Error("Invalid stroke logo SVG");

  const strokePaths = Array.from(svg.querySelectorAll("path"))
    .filter((path) => isOrangeStroke(path.getAttribute("stroke")))
    .map((path) => path.getAttribute("d"))
    .filter((d): d is string => Boolean(d))
    .sort((a, b) => pathStartX(a) - pathStartX(b));

  if (strokePaths.length < 4) throw new Error("Stroke logo SVG missing letter paths");

  return Object.fromEntries(
    LETTER_IDS.map((id, index) => [id, strokePaths[index] ?? ""]),
  ) as Record<LogoLetterId, string>;
}

function openStrokePath(d: string): string {
  return d.replace(/\s*Z\s*$/i, "");
}

function resolveDrawPaths(
  strokePaths: Record<LogoLetterId, string>,
): Record<LogoLetterId, string> {
  return Object.fromEntries(
    LETTER_IDS.map((id) => {
      const step = LOGO_DRAW_SEQUENCE.find((s) => s.id === id);
      if (step?.drawPath) return [id, step.drawPath];
      const stroke = strokePaths[id] ?? "";
      if (id === "o" && step?.drawStart) return [id, openStrokePath(stroke)];
      return [id, stroke];
    }),
  ) as Record<LogoLetterId, string>;
}

/** Nearest path-length to `(x, y)` in path coordinates */
export function pathLengthAtPoint(
  path: SVGGeometryElement,
  x: number,
  y: number,
): number {
  const total = path.getTotalLength();
  let best = 0;
  let bestDist = Infinity;

  for (let i = 0; i <= 500; i++) {
    const len = (total * i) / 500;
    const pt = path.getPointAtLength(len);
    const dist = (pt.x - x) ** 2 + (pt.y - y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = len;
    }
  }

  return best;
}

export type DrawOffsetAnimation = {
  initialOffset: number;
  endOffset: number;
};

/** Dash offsets for drawing from an arbitrary path point */
export function drawOffsetAtPoint(
  pathLength: number,
  startAt: number,
  direction: LogoDrawDirection,
): DrawOffsetAnimation {
  if (direction === "forward") {
    return {
      initialOffset: pathLength - startAt,
      endOffset: -startAt,
    };
  }
  // Reverse: start hidden, end fully visible (old formula showed full stroke then hid it)
  return {
    initialOffset: pathLength,
    endOffset: -startAt,
  };
}

export async function fetchLogoMark(): Promise<ParsedLogoMark> {
  const [fillRes, strokeRes] = await Promise.all([
    fetch(LOGO_MARK_SRC.fill),
    fetch(LOGO_MARK_SRC.stroke),
  ]);

  if (!fillRes.ok) throw new Error(`Fill logo SVG not found (${fillRes.status})`);
  if (!strokeRes.ok) throw new Error(`Stroke logo SVG not found (${strokeRes.status})`);

  const [fillMarkup, strokeMarkup] = await Promise.all([
    fillRes.text(),
    strokeRes.text(),
  ]);

  return {
    ...parseFillSvg(fillMarkup),
    drawPaths: resolveDrawPaths(parseStrokeSvg(strokeMarkup)),
  };
}

export function logoStrokeDrawTiming(lengths: number[]): {
  durations: number[];
  delays: number[];
} {
  const { durations, delays } = strokeDrawTiming(lengths);
  return {
    durations: durations.map((d) => d * 2),
    delays: delays.map((d) => d * 2),
  };
}

export { strokeDrawTiming } from "@/components/brand/symbol-paths";
