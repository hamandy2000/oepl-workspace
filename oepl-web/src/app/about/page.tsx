"use client";

/** About 페이지 — 연구 분야, 특허, 브랜드 아이덴티티 (스타일: src/styles/about.css) */

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResearchAreaCard from "@/components/ResearchAreaCard";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import BrandIdentitySection from "@/components/BrandIdentitySection";
import PageBanner from "@/components/PageBanner";
import { formatPatentDate } from "@/lib/content/display";
import { FileText } from "lucide-react";

export default function AboutPage() {
  const { lang, t } = useLang();
  const { content } = useContent();
  const [expandedTag, setExpandedTag] = useState<string | null>(null);

  return (
    <>
      <Header />
      <main className="page-main">
        <PageBanner title={t.about.banner} />

        {/* 연구 분야 소개 */}
        <section id="research" className="about-research-section section-y">
          <div className="section-wrapper">
            <div className="page-head-container is-loose">
              <p className="section-label">{t.about.researchLabel}</p>
              <h2 className="section-title">{t.about.researchTitle}</h2>
            </div>

            <div className="about-area-container">
              {t.about.areas.map((area) => (
                <ResearchAreaCard
                  key={area.tag}
                  area={area}
                  expanded={expandedTag === area.tag}
                  onToggle={() => setExpandedTag((prev) => (prev === area.tag ? null : area.tag))}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 특허 소개 */}
        <section id="patents" className="about-patent-section section-y">
          <div className="section-wrapper">
            <div className="page-head-container is-loose">
              <p className="section-label">{t.about.patentLabel}</p>
              <h2 className="section-title">{t.about.patentTitle}</h2>
            </div>

            <div className="about-patent-container">
              {content.patents.map((patent) => {
                const isRegistered = patent.status === "registered";
                return (
                  <article key={patent.id} className="patent-card">
                    <div className={isRegistered ? "icon-box is-registered" : "icon-box"}>
                      <FileText size={18} />
                    </div>

                    <div className="patent-body">
                      <div className="meta-container">
                        <span className={isRegistered ? "status is-registered" : "status"}>
                          {isRegistered
                            ? t.about.patentStatusRegistered
                            : t.about.patentStatusPending}
                        </span>
                        <span className="number">{patent.number}</span>
                        <span className="date">{formatPatentDate(patent.date)}</span>
                      </div>

                      <h3 className="patent-title">
                        {lang === "KR" ? patent.title : patent.titleEn}
                      </h3>
                      <p className="inventors">{patent.inventors}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <BrandIdentitySection />
      </main>
      <Footer />
    </>
  );
}
