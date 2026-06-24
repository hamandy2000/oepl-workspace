"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  parseSymbolSvg,
  strokeDrawTiming,
  SYMBOL_DRAW_SEQUENCE,
  type ParsedSymbolSvg,
} from "@/components/brand/symbol-paths";

type Props = {
  className?: string;
  playToken?: number;
};

export default function AnimatedSymbolMark({ className, playToken = 0 }: Props) {
  const rootRef = useRef<SVGSVGElement>(null);
  const [symbol, setSymbol] = useState<ParsedSymbolSvg | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/brand/oepl-symbol.svg")
      .then((res) => res.text())
      .then((markup) => {
        if (!cancelled) setSymbol(parseSymbolSvg(markup));
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !symbol) return;

    const elements = SYMBOL_DRAW_SEQUENCE.map(({ index }) =>
      root.querySelector(`#symbol-path-${index}`) as SVGGeometryElement | null
    ).filter(Boolean) as SVGGeometryElement[];

    const meta = SYMBOL_DRAW_SEQUENCE.filter(({ index }) =>
      root.querySelector(`#symbol-path-${index}`)
    );

    const lengths = elements.map((el) => el.getTotalLength());
    const { durations, delays } = strokeDrawTiming(lengths);

    elements.forEach((el, i) => {
      el.classList.remove("brand-draw-stroke");
      const length = lengths[i];
      const reverse = meta[i]?.reverse ?? false;
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = reverse ? `${-length}` : `${length}`;
      el.style.setProperty("--draw-duration", `${durations[i]}s`);
      el.style.setProperty("--draw-delay", `${delays[i]}s`);
    });

    void root.getBoundingClientRect();
    elements.forEach((el) => el.classList.add("brand-draw-stroke"));
  }, [playToken, symbol]);

  if (!symbol) {
    return (
      <svg viewBox="0 0 886 948" fill="none" aria-hidden="true" className={className} />
    );
  }

  const gProps: React.SVGProps<SVGGElement> = {
    stroke: symbol.stroke ?? "var(--color-brand)",
    strokeWidth: symbol.strokeWidth,
    fill: "none",
  };
  if (symbol.strokeLinecap) gProps.strokeLinecap = symbol.strokeLinecap as "butt" | "round" | "square";
  if (symbol.strokeLinejoin) gProps.strokeLinejoin = symbol.strokeLinejoin as "miter" | "round" | "bevel";

  return (
    <svg
      ref={rootRef}
      viewBox={symbol.viewBox}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g {...gProps}>
        {symbol.paths.map((d, i) => (
          <path key={i} id={`symbol-path-${i}`} d={d} />
        ))}
      </g>
    </svg>
  );
}
