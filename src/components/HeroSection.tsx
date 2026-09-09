"use client";

/** 홈 히어로 섹션 — 마우스 추적 글로우와 워드마크 (스타일: src/styles/hero.css) */

import { useRef, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

import BannerGlassStrips from "@/components/banner/BannerGlassStrips";

const GLOW_LERP = 0.1;

/** Figma Ellipse 63 — 336×315 @ (857, 357) on 1440×900 */
const FIGMA_GLOW = {
  width: 336,
  height: 315,
  blur: 75,
  minWidth: 240,
} as const;

const FIGMA_GLOW_DEFAULT = {
  x: (857 + 336 / 2) / 1440,
  y: (357 + 315 / 2) / 900,
} as const;

type HeroCopyProps = {
  subtitle: string;
  title: string;
  btn1: string;
  btn2: string;
};

function HeroCopy({ subtitle, title, btn1, btn2 }: HeroCopyProps) {
  return (
    <div className="hero-copy-container">
      <p className="subtitle">{subtitle}</p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero/oepl-wordmark.svg" alt="OEPL" className="wordmark" draggable={false} />

      <h1 className="hero-title">{title}</h1>

      <div className="hero-btn-container">
        <a href="/about#research" className="fill-btn">
          {btn1}
          <ArrowRight size={14} aria-hidden className="arrow" />
        </a>
        <a href="/publication" className="line-btn">
          {btn2}
          <ArrowRight size={14} aria-hidden className="arrow" />
        </a>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const targetRef = useRef({ ...FIGMA_GLOW_DEFAULT });
  const currentRef = useRef({ ...FIGMA_GLOW_DEFAULT });
  const rafRef = useRef<number | undefined>(undefined);

  const animate = useCallback(() => {
    const section = sectionRef.current;
    if (section) {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.x += (tgt.x - cur.x) * GLOW_LERP;
      cur.y += (tgt.y - cur.y) * GLOW_LERP;
      section.querySelectorAll<HTMLElement>("[data-hero-glow]").forEach((el) => {
        el.style.left = `${cur.x * 100}%`;
        el.style.top = `${cur.y * 100}%`;
      });
      section.style.setProperty("--hero-glow-x", `${cur.x * 100}%`);
      section.style.setProperty("--hero-glow-y", `${cur.y * 100}%`);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    const section = sectionRef.current;
    if (!section) return;

    section.style.setProperty("--hero-glow-x", `${FIGMA_GLOW_DEFAULT.x * 100}%`);
    section.style.setProperty("--hero-glow-y", `${FIGMA_GLOW_DEFAULT.y * 100}%`);

    const syncGlowSize = () => {
      const sectionWidth = section.getBoundingClientRect().width;
      const scaled = FIGMA_GLOW.width * (sectionWidth / 1440);
      const maxW = FIGMA_GLOW.width;
      const glowW = Math.min(maxW, Math.max(FIGMA_GLOW.minWidth, scaled));
      const glowH = glowW * (FIGMA_GLOW.height / FIGMA_GLOW.width);
      section.style.setProperty("--hero-glow-w", `${glowW}px`);
      section.style.setProperty("--hero-glow-h", `${glowH}px`);
      section.style.setProperty("--hero-glow-rx", `${glowW / 2}px`);
      section.style.setProperty("--hero-glow-ry", `${glowH / 2}px`);
    };

    syncGlowSize();
    const observer = new ResizeObserver(syncGlowSize);
    observer.observe(section);

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [animate]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    targetRef.current = {
      x: Math.min(1, Math.max(0, x)),
      y: Math.min(1, Math.max(0, y)),
    };
  };

  return (
    <section ref={sectionRef} onPointerMove={handlePointerMove} className="hero-section">
      <div className="hero-gradient" aria-hidden />

      <div data-hero-glow className="hero-glow" aria-hidden />

      <div className="glass-container">
        <BannerGlassStrips />
      </div>

      <div className="hero-wrapper">
        <HeroCopy
          subtitle={t.hero.subtitle}
          title={t.hero.title}
          btn1={t.hero.btn1}
          btn2={t.hero.btn2}
        />
      </div>
    </section>
  );
}
