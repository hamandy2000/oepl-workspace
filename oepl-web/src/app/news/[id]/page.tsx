"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import NewsDetailArticle from "@/components/news/NewsDetailArticle";
import NewsDetailNav from "@/components/news/NewsDetailNav";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { latestNewsId, newsDisplay, newsNeighbors } from "@/lib/content/display";
import { incrementNewsViewCount } from "@/lib/supabase/news-views";

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
      <main className="min-h-screen bg-[#f9fafb]">
        <section className="bg-[#080d1e] pt-16 flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="text-center px-6">
            <p className="section-label mb-2">OEPL</p>
            <h1 className="text-5xl font-bold leading-tight text-white">{t.news.banner}</h1>
          </div>
        </section>

        <section className="py-10 md:py-12">
          <div className="max-w-3xl mx-auto px-6">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6b7280] hover:text-[#E88800] transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              {t.news.backToList}
            </Link>

            {!ready ? (
              <p className="text-sm text-[#9ca3af]">{t.news.loading}</p>
            ) : !display ? (
              <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
                <p className="text-sm text-[#6b7280]">{t.news.notFound}</p>
                <Link
                  href="/news"
                  className="inline-block mt-4 text-xs font-semibold text-[#E88800] hover:underline"
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
      <FooterCTA />
    </>
  );
}
