"use client";

/** 홈 대표 논문 섹션 (스타일: src/styles/publication.css) */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { publicationSortKey } from "@/lib/content/display";
import PublicationCard from "@/components/publications/PublicationCard";

export default function PublicationsSection() {
  const { lang, t } = useLang();
  const { content } = useContent();
  const publications = [...content.publications]
    .sort((a, b) => publicationSortKey(b) - publicationSortKey(a))
    .slice(0, 3);

  return (
    <section id="publications" className="publication-section section-y">
      <div className="section-wrapper">
        <div className="section-head-container">
          <div>
            <p className="section-label">{t.publications.label}</p>
            <h2 className="section-title">{t.publications.title}</h2>
          </div>
          <Link href="/publication" className="more-link">
            {t.publications.more}
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="publication-list-container">
          {publications.map((pub) => (
            <PublicationCard key={pub.id} pub={pub} lang={lang} />
          ))}
        </div>

        <div className="more-link-container">
          <Link href="/publication" className="btn-more">
            {t.publications.more} <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
