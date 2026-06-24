"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { brandColorStyle, brandPalette } from "@/styles/brand-colors";
import BrandMarkPreview from "@/components/brand/BrandMarkPreview";

type BrandTab = "symbol" | "logo" | "signature" | "colors";

type BrandPanel = {
  enTitle: string;
  krTitle: string;
  paragraphs: string[];
  assets: { png: string };
};

export default function BrandIdentitySection() {
  const { lang, t } = useLang();
  const b = t.about.brand;
  const [tab, setTab] = useState<BrandTab>("symbol");

  const tabs: { id: BrandTab; label: string }[] = [
    { id: "symbol", label: b.tabs.symbol },
    { id: "logo", label: b.tabs.logo },
    { id: "signature", label: b.tabs.signature },
    { id: "colors", label: b.tabs.colors },
  ];

  const panels: Record<BrandTab, BrandPanel> = {
    symbol: b.symbol,
    logo: b.logo,
    signature: b.signature,
    colors: b.colors,
  };

  const active = panels[tab];

  return (
    <section id="brand" className="py-12 bg-white border-b border-[var(--color-neutral-100)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <p className="section-label mb-1">{b.label}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-neutral-900)]">{b.sectionTitle}</h2>
        </div>

        <div className="flex flex-wrap gap-0 border border-[var(--color-neutral-200)] rounded-t-xl overflow-hidden mb-0">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 min-w-[100px] px-3 py-3 text-sm font-semibold transition-colors border-r border-[var(--color-neutral-200)] last:border-r-0 ${
                tab === id
                  ? "bg-[var(--color-brand)] text-[var(--color-neutral-0)]"
                  : "bg-white text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="border border-t-0 border-[var(--color-neutral-200)] rounded-b-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-0">
            <div className="p-6 md:p-8 md:border-r border-b md:border-b-0 border-[var(--color-neutral-200)]">
              <p className="text-sm font-medium text-[var(--color-brand)] mb-1">{active.enTitle}</p>
              <h3 className="text-xl md:text-2xl font-bold text-[var(--color-neutral-900)] mb-4">{active.krTitle}</h3>
              <div className="space-y-4 text-sm leading-relaxed text-[var(--color-neutral-500)] mb-2">
                {active.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {(
                  [
                    { label: b.downloadPng, href: active.assets.png, key: "png" },
                    { label: b.downloadAi, href: b.aiDownload, key: "ai" },
                  ] as const
                ).map((dl) => (
                  <a
                    key={dl.key}
                    href={dl.href}
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[var(--color-neutral-200)] bg-white text-sm font-medium text-[var(--color-neutral-700)] hover:border-[color-mix(in_srgb,var(--color-brand)_50%,transparent)] hover:text-[var(--color-brand)] transition-colors"
                  >
                    {dl.label}
                    <Download size={16} />
                  </a>
                ))}
              </div>

              {tab === "colors" && (
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                  {brandPalette.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg border border-[var(--color-neutral-200)] shrink-0"
                        style={{ background: brandColorStyle(item.cssVar) }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-neutral-900)] leading-snug">
                          {lang === "KR" ? item.name.kr : item.name.en}
                        </p>
                        <p className="text-xs font-mono text-[var(--color-neutral-500)]">{item.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 flex flex-col items-center justify-center bg-[var(--color-neutral-50)]">
              {tab === "colors" ? (
                <div className="w-full max-w-xs grid grid-cols-2 gap-3">
                  {brandPalette.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl aspect-square flex items-end p-3 border border-black/5"
                      style={{ background: brandColorStyle(item.cssVar) }}
                    >
                      <span
                        className="text-xs font-mono font-semibold px-2 py-1 rounded"
                        style={{
                          background: item.lightLabel ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)",
                          color: item.lightLabel ? "#fff" : "var(--color-neutral-700)",
                        }}
                      >
                        {item.hex}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <BrandMarkPreview tab={tab} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
