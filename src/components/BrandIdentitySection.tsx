"use client";

/** 브랜드 아이덴티티 섹션 — 심볼/로고/시그니처/컬러 탭 (스타일: src/styles/brand.css) */

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
    <section id="brand" className="brand-section section-y">
      <div className="section-wrapper">
        <div className="section-head-container">
          <div>
            <p className="section-label">{b.label}</p>
            <h2 className="section-title">{b.sectionTitle}</h2>
          </div>
        </div>

        <div className="brand-tab-container">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={tab === id ? "tab-btn is-active" : "tab-btn"}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="brand-panel-container">
          <div className="panel-grid">
            <div className="brand-text-container">
              <p className="en-title">{active.enTitle}</p>
              <h3 className="kr-title">{active.krTitle}</h3>
              <div className="desc-list">
                {active.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {tab !== "colors" && (
                <div className="brand-download-container">
                  {(
                    [
                      { label: b.downloadPng, href: active.assets.png, key: "png" },
                      { label: b.downloadAi, href: b.aiDownload, key: "ai" },
                    ] as const
                  ).map((dl) => (
                    <a key={dl.key} href={dl.href} download className="download-btn">
                      {dl.label}
                      <Download size={16} />
                    </a>
                  ))}
                </div>
              )}

              {tab === "colors" && (
                <div className="brand-color-list-container">
                  {brandPalette.map((item) => (
                    <div key={item.id} className="color-item">
                      <div
                        className="swatch"
                        style={{ background: brandColorStyle(item.cssVar) }}
                      />
                      <div className="color-text">
                        <p className="color-name">
                          {lang === "KR" ? item.name.kr : item.name.en}
                        </p>
                        <p className="color-hex">{item.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="brand-preview-container">
              {tab === "colors" ? (
                <div className="brand-swatch-grid-container">
                  {brandPalette.map((item) => (
                    <div
                      key={item.id}
                      className="swatch-box"
                      style={{ background: brandColorStyle(item.cssVar) }}
                    >
                      <span className={item.lightLabel ? "swatch-hex is-light" : "swatch-hex"}>
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
