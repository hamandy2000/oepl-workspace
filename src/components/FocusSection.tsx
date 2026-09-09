"use client";

/** 홈 연구 중점 분야 섹션 — 아이콘 + 설명 그리드 (스타일: src/styles/focus.css) */

import { useLang } from "@/contexts/LangContext";
import { focusIcons, FOCUS_ICON_PROPS } from "@/components/icons/FocusIcons";

export default function FocusSection() {
  const { lang, t } = useLang();

  return (
    <section className="focus-section section-y">
      <div className="section-wrapper">
        <div className="focus-content-container">
          <div className="focus-head-container">
            <div>
              <p className="section-label">{t.focus.label}</p>
              <h2 className="section-title">{t.focus.title}</h2>
            </div>
          </div>

          <ul className="focus-list-container">
            {t.focus.items.map((item, i) => {
              const Icon = focusIcons[i];
              return (
                <li key={i} className="focus-item">
                  <div className="icon-box">
                    <Icon {...FOCUS_ICON_PROPS} />
                  </div>
                  <div>
                    <p className="title">{item.title}</p>
                    {lang === "KR" && <p className="en-title">{item.enTitle}</p>}
                    <p className="desc">{item.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
