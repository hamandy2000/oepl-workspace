"use client";

/** News 목록 페이지 — 정렬·페이지네이션 (스타일: src/styles/news.css, list.css) */

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { newsDisplay, sortNewsItems, latestNewsId } from "@/lib/content/display";
import NewsNewBadge from "@/components/news/NewsNewBadge";
import NewsPinnedBadge from "@/components/news/NewsPinnedBadge";
import PageBanner from "@/components/PageBanner";
import SortDropdown, { type SortOrder } from "@/components/list/SortDropdown";

const PER_PAGE = 10;

export default function NewsPage() {
  const { lang, t } = useLang();
  const { content, ready } = useContent();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const latestId = useMemo(() => latestNewsId(content.news), [content.news]);

  const sorted = useMemo(
    () => sortNewsItems(content.news, sortOrder),
    [content.news, sortOrder]
  );

  const nonPinnedSorted = useMemo(() => sorted.filter((n) => !n.pinned), [sorted]);

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function setSortOrderAndReset(order: SortOrder) {
    setSortOrder(order);
    setPage(1);
  }

  function changePage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function rowNumber(item: (typeof paginated)[number]) {
    if (item.pinned) return null;
    const idx = nonPinnedSorted.findIndex((n) => n.id === item.id);
    if (idx === -1) return null;
    if (sortOrder === "newest") {
      return nonPinnedSorted.length - idx;
    }
    return idx + 1;
  }

  return (
    <>
      <Header />
      <main className="page-main">
        <PageBanner title={t.news.banner} />

        <section className="news-list-section section-y">
          <div className="news-wrapper">
            <div className="news-list-head">
              <p className="list-count is-inline">{t.news.count(sorted.length)}</p>
              <SortDropdown
                sortOrder={sortOrder}
                setSortOrder={setSortOrderAndReset}
                labels={{ newest: t.news.sortNewest, oldest: t.news.sortOldest }}
              />
            </div>

            <div className="news-table-head">
              <span>{t.news.colNo}</span>
              <span>{t.news.colTitle}</span>
              <span>{t.news.colDate}</span>
            </div>

            <div className="news-table-body">
              {paginated.map((item) => {
                const display = newsDisplay(item, lang);
                return (
                  <Link key={item.id} href={`/news/${item.id}`} className="news-row">
                    <span className="row-no">
                      {item.pinned ? (
                        <NewsPinnedBadge label={t.news.badgePinned} />
                      ) : (
                        rowNumber(item)
                      )}
                    </span>

                    <div className="row-main">
                      <div className="row-meta">
                        {item.pinned && <NewsPinnedBadge label={t.news.badgePinned} />}
                        <span>{display.date}</span>
                      </div>
                      <h2 className="row-title">
                        {item.id === latestId && <NewsNewBadge label={t.news.badgeNew} />}
                        <span className="text">{display.title}</span>
                      </h2>
                      <p className="row-desc">{display.detail}</p>
                    </div>

                    <time className="row-date">{display.date}</time>
                  </Link>
                );
              })}
            </div>

            {paginated.length === 0 && (
              <div className="news-list-empty">
                <p>{ready ? t.news.empty : t.news.loading}</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className="page-btn is-nav"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={p === page ? "page-btn is-active" : "page-btn"}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  className="page-btn is-nav"
                  aria-label="Next page"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
