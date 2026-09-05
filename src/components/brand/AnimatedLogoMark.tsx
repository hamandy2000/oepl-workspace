"use client";

/** OEPL 타이포 로고 드로잉 애니메이션 */

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  fetchLogoMark,
  LOGO_DRAW_SEQUENCE,
  LOGO_FILL,
  LOGO_LETTER_CLIPS,
  LOGO_MARK_SRC,
  LOGO_MASK_STROKE_WIDTH,
  LOGO_O_CORNER_CLIP,
  LOGO_O_CORNER_REVEAL,
  LOGO_O_STROKE_EXCLUDE_CORNER_PATH,
  LOGO_STROKE_SCALE,
  LOGO_SUBTITLE_CLIP,
  LOGO_SUBTITLE_FILL,
  LOGO_SUBTITLE_FILL_DARK,
  logoStrokeDrawTiming,
  drawOffsetAtPoint,
  pathLengthAtPoint,
  type ParsedLogoMark,
} from "@/components/brand/logo-paths";

type Props = {
  className?: string;
  playToken?: number;
  darkMode?: boolean;
};

type CancelFn = () => void;

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

// Ease-out (no slow start) — the corner reveal picks up right where the main sweep's own
// deceleration leaves off, instead of resetting to a standing start. Two slow-starts stacked
// back to back at the handoff is what read as a stutter rather than one continuous motion.
function easeOut(t: number): number {
  return 1 - (1 - t) ** 2;
}

function setRectClip(
  el: SVGRectElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  el.setAttribute("x", String(x));
  el.setAttribute("y", String(y));
  el.setAttribute("width", String(Math.max(0, width)));
  el.setAttribute("height", String(Math.max(0, height)));
}

function runSubtitleAnimation(el: SVGRectElement, delayMs: number): CancelFn {
  let frame = 0;
  let cancelled = false;
  const { x, y, width, height } = LOGO_SUBTITLE_CLIP;

  const start = () => {
    const t0 = performance.now();
    const durationMs = 1400;

    const tick = (now: number) => {
      if (cancelled) return;
      const raw = Math.min(Math.max((now - t0) / durationMs, 0), 1);
      setRectClip(el, x, y, width * ease(raw), height);
      if (raw < 1) frame = requestAnimationFrame(tick);
      else setRectClip(el, x, y, width, height);
    };

    frame = requestAnimationFrame(tick);
  };

  setRectClip(el, x, y, 0, height);
  const delayTimer = window.setTimeout(start, delayMs);

  return () => {
    cancelled = true;
    window.clearTimeout(delayTimer);
    cancelAnimationFrame(frame);
  };
}

/**
 * "o"'s main stroke and corner block, driven from a single rAF loop instead of a CSS
 * animation (stroke) plus a separate rAF loop (corner). Two independent clocks — the
 * compositor thread running the CSS `stroke-dashoffset` animation, and the main thread
 * running the corner's own rAF — don't guarantee matching frame timing, so right around
 * the handoff a thin sliver of the stroke's own edge could show through a frame or two
 * before/after the corner rect caught up, or vice versa. Computing both from the same
 * `now` inside one callback makes that impossible: whatever frame paints, both are already
 * at the values for that exact instant.
 *
 * The corner grows bottom-up (see LOGO_O_CORNER_CLIP) and only starts once the main
 * sweep's own visible motion is done (see LOGO_O_CORNER_REVEAL) — both still apply, just
 * computed together instead of on separate timers.
 */
function runOStrokeAndCorner(
  strokeEl: SVGGeometryElement,
  cornerEl: SVGRectElement,
  strokeLength: number,
  delayMs: number,
  durationMs: number,
  onDone: () => void,
): CancelFn {
  let frame = 0;
  let cancelled = false;
  const { x, y, width, height } = LOGO_O_CORNER_CLIP;
  const bottom = y + height;
  const { start: cStart, end: cEnd } = LOGO_O_CORNER_REVEAL;

  const start = () => {
    const t0 = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const raw = Math.min(Math.max((now - t0) / durationMs, 0), 1);

      strokeEl.style.strokeDashoffset = `${strokeLength * (1 - ease(raw))}`;

      const cornerRaw = raw <= cStart ? 0 : Math.min(1, (raw - cStart) / (cEnd - cStart));
      const h = height * easeOut(cornerRaw);
      setRectClip(cornerEl, x, bottom - h, width, h);

      if (raw < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };

    frame = requestAnimationFrame(tick);
  };

  strokeEl.style.strokeDasharray = `${strokeLength}`;
  strokeEl.style.strokeDashoffset = `${strokeLength}`;
  setRectClip(cornerEl, x, bottom, width, 0);
  const delayTimer = window.setTimeout(start, delayMs);

  return () => {
    cancelled = true;
    window.clearTimeout(delayTimer);
    cancelAnimationFrame(frame);
  };
}

export default function AnimatedLogoMark({
  className,
  playToken = 0,
  darkMode = false,
}: Props) {
  const reactId = useId().replace(/:/g, "");
  const rootRef = useRef<SVGSVGElement>(null);
  const [logo, setLogo] = useState<ParsedLogoMark | null>(null);
  const [usePngFallback, setUsePngFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLogoMark()
      .then((parsed) => {
        if (!cancelled) {
          setLogo(parsed);
          setUsePngFallback(false);
        }
      })
      .catch(() => {
        if (!cancelled) setUsePngFallback(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (usePngFallback) return;

    const root = rootRef.current;
    if (!root || !logo) return;

    const maskEls = LOGO_DRAW_SEQUENCE.map(
      ({ id }) => root.querySelector(`#logo-mask-${id}`) as SVGGeometryElement | null,
    ).filter(Boolean) as SVGGeometryElement[];

    const fillEls = LOGO_DRAW_SEQUENCE.map(
      ({ id }) => root.querySelector(`#logo-fill-${id}`) as SVGPathElement | null,
    ).filter(Boolean) as SVGPathElement[];

    const oCornerRectEl = root.querySelector("#logo-o-corner-rect") as SVGRectElement | null;

    const subtitleClipEl = root.querySelector(
      "#logo-clip-shape-subtitle",
    ) as SVGRectElement | null;

    const lengths = maskEls.map((el) => el.getTotalLength());
    const { durations, delays } = logoStrokeDrawTiming(lengths);
    const oIndex = LOGO_DRAW_SEQUENCE.findIndex((step) => step.id === "o");

    const lastIndex = LOGO_DRAW_SEQUENCE.length - 1;
    const subtitleDelay =
      LOGO_DRAW_SEQUENCE.length > 0
        ? (delays[lastIndex] ?? 0) + (durations[lastIndex] ?? 0) + 0.08
        : 0;

    const cancels: CancelFn[] = [];
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const revealFill = (fillEl: SVGPathElement) => {
      fillEl.removeAttribute("mask");
    };

    if (prefersReducedMotion) {
      fillEls.forEach(revealFill);
      if (oCornerRectEl) {
        const { x, y, width, height } = LOGO_O_CORNER_CLIP;
        setRectClip(oCornerRectEl, x, y, width, height);
      }
      if (subtitleClipEl) {
        setRectClip(
          subtitleClipEl,
          LOGO_SUBTITLE_CLIP.x,
          LOGO_SUBTITLE_CLIP.y,
          LOGO_SUBTITLE_CLIP.width,
          LOGO_SUBTITLE_CLIP.height,
        );
      }
      return;
    }

    maskEls.forEach((el, i) => {
      if (i === oIndex) return; // 'o' is driven by the unified rAF loop below, not CSS.
      el.classList.remove("brand-draw-stroke", "brand-draw-stroke-offset");
      const length = lengths[i];
      const step = LOGO_DRAW_SEQUENCE[i];
      const reverse = step?.reverse ?? false;

      el.style.strokeDasharray = `${length}`;
      el.style.setProperty("--draw-duration", `${durations[i]}s`);
      el.style.setProperty("--draw-delay", `${delays[i]}s`);

      if (step?.drawStart && !step.drawPath) {
        const startAt = pathLengthAtPoint(el, step.drawStart.x, step.drawStart.y);
        const direction = step.drawDirection ?? "forward";
        const { initialOffset, endOffset } = drawOffsetAtPoint(
          length,
          startAt,
          direction,
        );
        el.style.strokeDashoffset = `${initialOffset}`;
        el.style.setProperty("--draw-end-offset", `${endOffset}`);
      } else {
        el.style.removeProperty("--draw-end-offset");
        el.style.strokeDashoffset = reverse ? `${-length}` : `${length}`;
      }
    });

    fillEls.forEach((fillEl, i) => {
      if (i === oIndex) return; // 'o' fill is revealed by the unified rAF loop's onDone.
      const step = LOGO_DRAW_SEQUENCE[i];
      if (!step) return;
      fillEl.setAttribute("mask", `url(#${reactId}-mask-${step.id})`);

      let ended = false;
      const onEnd = () => {
        if (ended) return;
        ended = true;
        revealFill(fillEl);
      };
      const maskEl = maskEls[i];
      if (!maskEl) return;
      maskEl.removeEventListener("animationend", onEnd);
      maskEl.addEventListener("animationend", onEnd, { once: true });
      const fallbackTimer = window.setTimeout(
        onEnd,
        ((delays[i] ?? 0) + (durations[i] ?? 0)) * 1000 + 120,
      );
      cancels.push(() => {
        window.clearTimeout(fallbackTimer);
      });
    });

    if (oCornerRectEl && oIndex >= 0) {
      const oMaskEl = maskEls[oIndex];
      const oFillEl = fillEls[oIndex];
      const oLength = lengths[oIndex] ?? 0;
      const oDelay = delays[oIndex] ?? 0;
      const oDuration = durations[oIndex] ?? 0;
      if (oMaskEl && oFillEl) {
        oFillEl.setAttribute("mask", `url(#${reactId}-mask-o)`);
        let ended = false;
        const onDone = () => {
          if (ended) return;
          ended = true;
          revealFill(oFillEl);
        };
        cancels.push(
          runOStrokeAndCorner(
            oMaskEl,
            oCornerRectEl,
            oLength,
            oDelay * 1000,
            oDuration * 1000,
            onDone,
          ),
        );
        const fallbackTimer = window.setTimeout(onDone, (oDelay + oDuration) * 1000 + 120);
        cancels.push(() => window.clearTimeout(fallbackTimer));
      }
    }

    if (subtitleClipEl) {
      cancels.push(runSubtitleAnimation(subtitleClipEl, subtitleDelay * 1000));
    }

    void root.getBoundingClientRect();
    maskEls.forEach((el, i) => {
      if (i === oIndex) return; // 'o' is driven by the unified rAF loop, not a CSS class.
      const step = LOGO_DRAW_SEQUENCE[i];
      el.classList.add(
        step?.drawStart && !step.drawPath
          ? "brand-draw-stroke-offset"
          : "brand-draw-stroke",
      );
    });

    return () => cancels.forEach((cancel) => cancel());
  }, [playToken, logo, darkMode, usePngFallback, reactId]);

  if (usePngFallback) {
    const src = darkMode ? LOGO_MARK_SRC.dark : LOGO_MARK_SRC.fill;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={`${playToken}-${darkMode ? "dark" : "light"}`}
        src={src}
        alt="OEPL Logo Mark"
        className={`brand-reveal-image w-full h-auto object-contain ${className ?? ""}`}
      />
    );
  }

  if (!logo) {
    return (
      <svg
        viewBox="0 0 2428 956"
        fill="none"
        aria-hidden="true"
        className={className}
      />
    );
  }

  const scaleTransform = `scale(${LOGO_STROKE_SCALE.sx} ${LOGO_STROKE_SCALE.sy})`;
  const subtitleFill = darkMode ? LOGO_SUBTITLE_FILL_DARK : LOGO_SUBTITLE_FILL;

  return (
    <svg
      ref={rootRef}
      viewBox={logo.viewBox}
      fill="none"
      aria-label="OEPL Logo Mark"
      className={`w-full h-auto block ${className ?? ""}`}
    >
      <defs>
        {LOGO_DRAW_SEQUENCE.map((step) => (
          <clipPath
            key={`clip-${step.id}`}
            id={`${reactId}-clip-${step.id}`}
            clipPathUnits="userSpaceOnUse"
          >
            <rect
              x={LOGO_LETTER_CLIPS[step.id].x}
              y={LOGO_LETTER_CLIPS[step.id].y}
              width={LOGO_LETTER_CLIPS[step.id].width}
              height={LOGO_LETTER_CLIPS[step.id].height}
            />
          </clipPath>
        ))}

        {/* Clips the "o" stroke path away from the corner block — its stroke width reaches
            partway into that area as it passes by, which without this shows up as a small
            early rectangular nub. Not applied to the corner rect itself. */}
        <clipPath
          id={`${reactId}-clip-o-stroke-exclude`}
          clipPathUnits="userSpaceOnUse"
        >
          <path d={LOGO_O_STROKE_EXCLUDE_CORNER_PATH} clipRule="evenodd" />
        </clipPath>

        {LOGO_DRAW_SEQUENCE.map((step) => (
          <mask
            key={`mask-${step.id}`}
            id={`${reactId}-mask-${step.id}`}
            maskUnits="userSpaceOnUse"
          >
            {step.id === "o" ? (
              <g clipPath={`url(#${reactId}-clip-o-stroke-exclude)`}>
                <g transform={scaleTransform}>
                  <path
                    id={`logo-mask-${step.id}`}
                    d={logo.drawPaths[step.id]}
                    fill="none"
                    stroke="white"
                    strokeWidth={LOGO_MASK_STROKE_WIDTH}
                    strokeLinecap="butt"
                    strokeLinejoin={step.strokeLinejoin ?? "round"}
                  />
                </g>
              </g>
            ) : (
              <g transform={scaleTransform}>
                <path
                  id={`logo-mask-${step.id}`}
                  d={logo.drawPaths[step.id]}
                  fill="none"
                  stroke="white"
                  strokeWidth={LOGO_MASK_STROKE_WIDTH}
                  strokeLinecap="butt"
                  strokeLinejoin={step.strokeLinejoin ?? "round"}
                />
              </g>
            )}
            {/* "o"'s corner block — unioned into the same mask as the stroke path (not a
                separate clip-path/fill-path pair) so there's no seam where they'd otherwise
                meet. Zero size until the tail end of the step (see LOGO_O_CORNER_REVEAL). */}
            {step.id === "o" && <rect id="logo-o-corner-rect" fill="white" />}
          </mask>
        ))}

        <clipPath
          id={`${reactId}-clip-subtitle`}
          clipPathUnits="userSpaceOnUse"
        >
          <rect
            id="logo-clip-shape-subtitle"
            x={LOGO_SUBTITLE_CLIP.x}
            y={LOGO_SUBTITLE_CLIP.y}
            width={0}
            height={LOGO_SUBTITLE_CLIP.height}
          />
        </clipPath>
      </defs>

      {LOGO_DRAW_SEQUENCE.map((step) => (
        <path
          key={step.id}
          id={`logo-fill-${step.id}`}
          d={logo.fills[step.id]}
          fill={LOGO_FILL}
          clipPath={`url(#${reactId}-clip-${step.id})`}
          mask={`url(#${reactId}-mask-${step.id})`}
        />
      ))}

      <g key={playToken} id="subtitle" clipPath={`url(#${reactId}-clip-subtitle)`}>
        <path d={logo.subtitle} fill={subtitleFill} />
      </g>
    </svg>
  );
}
