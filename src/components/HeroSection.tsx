"use client";
import { ArrowRight } from "lucide-react";
import OPVDiagram from "./OPVDiagram";
import { useLang } from "@/contexts/LangContext";

export default function HeroSection() {
  const { t } = useLang();
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[var(--color-bg)]">
      {/* Background stars */}
      <div className="absolute inset-0 hero-stars opacity-25 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 65% 50%, rgba(36,36,36,0.6) 0%, transparent 70%)",
        }}
      />
      {/* Brand ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(232,136,0,0.06) 0%, transparent 70%)",
          top: "30%",
          left: "-10%",
        }}
      />

      {/* Main */}
      <div className="relative flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center gap-8 pt-16 pb-16">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="section-label mb-5">{t.hero.subtitle}</p>

          <h1 className="text-5xl font-bold leading-tight text-[var(--color-text)]">
            OEPL
          </h1>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-6 text-[var(--color-text)] whitespace-pre-line">
            {t.hero.title}
          </h1>

          <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-8 max-w-md">
            {t.hero.desc}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#research"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] text-[var(--color-neutral-950)] font-semibold text-sm hover:bg-[var(--color-brand-hover)] transition-colors glow-box-orange"
              style={{ padding: "var(--spacing-300) var(--spacing-600)" }}
            >
              {t.hero.btn1}
              <ArrowRight size={15} />
            </a>
            <a
              href="#publications"
              className="inline-flex items-center gap-2 rounded-full border text-[var(--color-subtle)] font-medium text-sm transition-all hover:border-[var(--color-brand)] hover:text-[var(--color-text)]"
              style={{
                padding: "var(--spacing-300) var(--spacing-600)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-pill)",
              }}
            >
              {t.hero.btn2}
            </a>
          </div>
        </div>

        {/* Right — OPV Diagram */}
        <div className="flex-1 relative min-h-[340px] hidden md:block">
          <OPVDiagram />
        </div>
      </div>
    </section>
  );
}
