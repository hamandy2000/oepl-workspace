"use client";

/** 홈 연구 분야 섹션 — 대표 카드 + 컴팩트 카드 배치 (스타일: src/styles/research.css) */

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { researchAreaImage } from "@/lib/content/research-images";

type ResearchItem = { tag: string; title: string; desc: string };

const RESEARCH_ORDER = ["OSCs", "PSCs", "OFETs", "Metal Ink", "ELA"] as const;

function sortResearchItems(items: ResearchItem[]) {
  return [...items].sort(
    (a, b) =>
      RESEARCH_ORDER.indexOf(a.tag as (typeof RESEARCH_ORDER)[number]) -
      RESEARCH_ORDER.indexOf(b.tag as (typeof RESEARCH_ORDER)[number])
  );
}

function ResearchCover({ tag, featured = false }: { tag: string; featured?: boolean }) {
  const image = researchAreaImage(tag, featured);
  return (
    <div className="cover">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="cover-img" />
      ) : null}
    </div>
  );
}

function CardBody({ item }: { item: ResearchItem }) {
  return (
    <div className="card-body">
      <span className="tag">{item.tag}</span>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-desc">{item.desc}</p>
    </div>
  );
}

function FeaturedCard({ item }: { item: ResearchItem }) {
  return (
    <div className="research-card card-hover">
      <div className="overlay" aria-hidden />
      <div className="cover-box">
        <ResearchCover tag={item.tag} featured />
      </div>
      <CardBody item={item} />
    </div>
  );
}

function CompactCard({ item, onSelect }: { item: ResearchItem; onSelect?: () => void }) {
  const interactive = onSelect != null;
  const className = interactive
    ? "research-card card-hover is-compact is-interactive"
    : "research-card card-hover is-compact";

  const content = (
    <>
      <div className="overlay" aria-hidden />
      <ResearchCover tag={item.tag} />
      <CardBody item={item} />
    </>
  );

  if (!interactive) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={className}
    >
      {content}
    </div>
  );
}

export default function ResearchSection() {
  const { lang, t } = useLang();
  const items = sortResearchItems(t.research.items);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = items[featuredIndex] ?? items[0];

  useEffect(() => {
    setFeaturedIndex(0);
  }, [lang]);

  return (
    <section id="research" className="research-section section-y">
      <div className="section-wrapper">
        <div className="section-head-container is-bottom">
          <div>
            <p className="section-label">{t.research.label}</p>
            <h2 className="section-title">{t.research.title}</h2>
          </div>
          <Link href="/about#research" className="more-link">
            {t.research.more}
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="research-list-container">
          {items.map((item) => (
            <CompactCard key={item.tag} item={item} />
          ))}
        </div>

        <div className="more-link-container">
          <Link href="/about#research" className="btn-more">
            {t.research.more} <ArrowRight size={13} />
          </Link>
        </div>

        <div className="research-grid-container">
          <div className="featured-box">
            <FeaturedCard key={featured.tag} item={featured} />
          </div>
          <div className="compact-box">
            {items.map((item, index) =>
              index === featuredIndex ? null : (
                <CompactCard key={item.tag} item={item} onSelect={() => setFeaturedIndex(index)} />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
