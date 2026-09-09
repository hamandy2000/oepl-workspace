"use client";

/** 홈 뉴스 섹션 — 캐러셀/그리드 전환 표시 (스타일: src/styles/news.css) */

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { latestNewsId, newsDisplay, sortNewsItems } from "@/lib/content/display";
import type { NewsItem } from "@/types/content";
import NewsNewBadge from "@/components/news/NewsNewBadge";
import NewsPinnedBadge from "@/components/news/NewsPinnedBadge";

const HOME_NEWS_LIMIT = 4;
const CAROUSEL_MIN_ITEMS = 3;
const SLIDE_GAP_PX = 20;

type Labels = { badgePinned: string; badgeNew: string; readMore: string };

type ListProps = {
  items: NewsItem[];
  lang: ReturnType<typeof useLang>["lang"];
  latestId: number | null;
  labels: Labels;
};

function NewsCard({
  item,
  lang,
  latestId,
  labels,
}: {
  item: NewsItem;
  lang: ReturnType<typeof useLang>["lang"];
  latestId: number | null;
  labels: Labels;
}) {
  const display = newsDisplay(item, lang);

  return (
    <Link href={`/news/${item.id}`} className="news-card">
      <div className="card-head">
        <span className="type">{display.type}</span>
        <span className="date">{display.date}</span>
      </div>
      <h3 className="card-title">
        {item.pinned && <NewsPinnedBadge label={labels.badgePinned} />}
        {item.id === latestId && <NewsNewBadge label={labels.badgeNew} />}
        <span className="text">{display.title}</span>
      </h3>
      <p className="card-desc">{display.detail}</p>
      <div className="read-more">
        {labels.readMore} <ArrowRight size={12} />
      </div>
    </Link>
  );
}

function NewsDots({
  count,
  activeIndex = 0,
  onSelect,
}: {
  count: number;
  activeIndex?: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <div className="news-dots-container">
      {Array.from({ length: count }, (_, i) => {
        const active = i === activeIndex;
        const className = active ? "dot is-active" : "dot";

        if (onSelect) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={className}
              aria-label={`Go to news slide ${i + 1}`}
              aria-current={active ? "true" : undefined}
            />
          );
        }

        return <span key={i} className={className} aria-hidden={!active} />;
      })}
    </div>
  );
}

function NewsStaticGrid({ items, lang, latestId, labels }: ListProps) {
  return (
    <>
      <div className={items.length === 1 ? "news-grid-container" : "news-grid-container is-multi"}>
        {items.map((item) => (
          <NewsCard key={item.id} item={item} lang={lang} latestId={latestId} labels={labels} />
        ))}
      </div>
      <NewsDots count={1} />
    </>
  );
}

function NewsCarousel({ items, lang, latestId, labels }: ListProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [slideWidth, setSlideWidth] = useState(0);

  const pageCount = Math.max(1, items.length - slidesPerView + 1);
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < pageCount - 1;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const perView = window.matchMedia("(min-width: 768px)").matches ? 2 : 1;
    const width = (track.clientWidth - SLIDE_GAP_PX * (perView - 1)) / perView;

    setSlidesPerView(perView);
    setSlideWidth(Math.max(0, width));
    setActiveIndex((prev) => Math.min(prev, Math.max(0, items.length - perView)));
  }, [items.length]);

  const syncActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track || slideWidth <= 0) return;

    const step = slideWidth + SLIDE_GAP_PX;
    const index = Math.min(pageCount - 1, Math.max(0, Math.round(track.scrollLeft / step)));
    setActiveIndex(index);
  }, [pageCount, slideWidth]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncActiveIndex();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [measure, syncActiveIndex]);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track || slideWidth <= 0) return;

    const nextIndex = Math.min(pageCount - 1, Math.max(0, index));
    const step = slideWidth + SLIDE_GAP_PX;
    track.scrollTo({ left: step * nextIndex, behavior: "smooth" });
    setActiveIndex(nextIndex);
  }

  return (
    <div>
      <div className="news-carousel-container">
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={!canPrev}
          className="nav-btn is-prev"
          aria-label="Previous news"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={!canNext}
          className="nav-btn is-next"
          aria-label="Next news"
        >
          <ChevronRight size={18} />
        </button>

        <div
          ref={trackRef}
          onScroll={syncActiveIndex}
          className="track scrollbar-hide"
          style={{ gap: SLIDE_GAP_PX }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="slide"
              style={slideWidth > 0 ? { width: slideWidth } : { width: "100%" }}
            >
              <NewsCard item={item} lang={lang} latestId={latestId} labels={labels} />
            </div>
          ))}
        </div>
      </div>

      <NewsDots count={pageCount} activeIndex={activeIndex} onSelect={scrollToIndex} />
    </div>
  );
}

function NewsList(props: ListProps) {
  if (props.items.length < CAROUSEL_MIN_ITEMS) {
    return <NewsStaticGrid {...props} />;
  }
  return <NewsCarousel {...props} />;
}

export default function NewsSection() {
  const { lang, t } = useLang();
  const { content } = useContent();

  const { latestId, items } = useMemo(() => {
    const sorted = sortNewsItems(content.news);
    return { latestId: latestNewsId(content.news), items: sorted.slice(0, HOME_NEWS_LIMIT) };
  }, [content.news]);

  const labels = {
    badgePinned: t.news.badgePinned,
    badgeNew: t.news.badgeNew,
    readMore: t.news.readMore,
  };

  return (
    <section id="news" className="news-section section-y section-anchor">
      <div className="section-wrapper">
        <div className="section-head-container">
          <div>
            <p className="section-label">{t.news.label}</p>
            <h2 className="section-title">{t.news.title}</h2>
          </div>
          <Link href="/news" className="more-link">
            {t.news.more}
            <ArrowRight size={15} />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="news-empty-container">
            <Newspaper size={40} strokeWidth={1.5} className="empty-icon" aria-hidden />
            <p className="empty-text">{t.news.empty}</p>
            <Link href="/news" className="empty-link">
              {t.news.more}
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <NewsList items={items} lang={lang} latestId={latestId} labels={labels} />
        )}

        <div className="more-link-container">
          <Link href="/news" className="btn-more">
            {t.news.more} <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
