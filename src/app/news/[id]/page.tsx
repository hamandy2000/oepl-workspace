"use client";

/** News 상세 페이지 — 본문·첨부·조회수·이전/다음 글 (스타일: src/styles/news-detail.css) */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsDetailArticle from "@/components/news/NewsDetailArticle";
import NewsDetailNav from "@/components/news/NewsDetailNav";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { latestNewsId, newsDisplay, newsNeighbors } from "@/lib/content/display";
import { incrementNewsViewCount } from "@/lib/supabase/news-views";
import PageBanner from "@/components/PageBanner";

export default function NewsDetailPage() {
  const params = useParams();
  const { lang, t } = useLang();
  const { content, ready } = useContent();
  const viewedRef = useRef(false);
  const [viewCount, setViewCount] = useState(0);

  const id = Number(params.id);
  const item = Number.isFinite(id) ? content.news.find((n) => n.id === id) : undefined;
  const display = item ? newsDisplay(item, lang) : null;

  const latestId = useMemo(() => latestNewsId(content.news), [content.news]);

  const { prev, next } = useMemo(
    () => (item ? newsNeighbors(content.news, item.id) : { prev: null, next: null }),
    [content.news, item]
  );

  useEffect(() => {
    if (!item || viewedRef.current) return;
    viewedRef.current = true;
    setViewCount(item.viewCount ?? 0);

    void incrementNewsViewCount(item.id).then((count) => {
      if (count !== null) setViewCount(count);
    });
  }, [item]);

  return (
    <>
      <Header />
      <main className="news-detail-main">
        <PageBanner title={t.news.banner} />

        <section className="news-detail-section section-y">
          <div className="news-detail-wrapper">
            <Link
              href="/news"
              className="back-link"
            >
              <ArrowLeft size={14} />
              {t.news.backToList}
            </Link>

            {!ready ? (
              <p className="news-detail-loading">{t.news.loading}</p>
            ) : !display ? (
              <div className="news-detail-missing">
                <p className="missing-text">{t.news.notFound}</p>
                <Link
                  href="/news"
                  className="missing-link"
                >
                  {t.news.backToList}
                </Link>
              </div>
            ) : item && display ? (
              <>
                <NewsDetailArticle
                  display={display}
                  viewCount={viewCount}
                  lang={lang}
                  isLatest={item.id === latestId}
                  isPinned={item.pinned}
                  labels={{
                    author: t.news.author,
                    views: t.news.views,
                    postedDate: t.news.postedDate,
                    defaultAuthor: t.news.defaultAuthor,
                    attachments: t.news.attachments,
                    noAttachments: t.news.noAttachments,
                    download: t.news.download,
                    badgeNew: t.news.badgeNew,
                    badgePinned: t.news.badgePinned,
                  }}
                />
                <NewsDetailNav
                  prev={prev ? { id: prev.id, title: prev.title } : null}
                  next={next ? { id: next.id, title: next.title } : null}
                  labels={{
                    prev: t.news.prevPost,
                    next: t.news.nextPost,
                    empty: t.news.noAdjacentPost,
                  }}
                />
              </>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
