"use client";

/** 홈 연구실 소개 섹션 (스타일: src/styles/intro.css) */

import { useLang } from "@/contexts/LangContext";

export default function IntroSection() {
  const { t } = useLang();

  return (
    <section id="about" className="intro-section section-y">
      <div className="section-wrapper">
        <div className="intro-content-container">
          <div className="intro-text-container">
            <div className="intro-head">
              <p className="section-label">{t.intro.label}</p>
              <h2 className="intro-title">
                {t.intro.title.split("\n").map((line, i) => (
                  <span key={i} className="line">
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            <p className="tagline">{t.intro.tagline}</p>
            <div className="desc-list">
              {[t.intro.p1, t.intro.p2, t.intro.p3].filter(Boolean).map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="intro-btn-container">
              <a href="/about" className="btn-primary">
                {t.intro.btn1}
              </a>
              <a href="/members" className="btn-line">
                {t.intro.btn2}
              </a>
            </div>
          </div>

          <div className="intro-photo-container">
            <span className="placeholder">{t.about.profPhoto}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
