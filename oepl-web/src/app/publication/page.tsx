"use client";

/** Publications 페이지 — 논문 목록(필터·정렬) (스타일: src/styles/publication.css, list.css) */

import { useState, useRef, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { publicationSortKey, publicationFilterYear } from "@/lib/content/display";
import PublicationCard from "@/components/publications/PublicationCard";
import PageBanner from "@/components/PageBanner";

function FilterBtn({
  value,
  active,
  onClick,
}: {
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={active ? "filter-btn is-active" : "filter-btn"}>
      {value}
    </button>
  );
}

function SortDropdown({
  sortOrder,
  setSortOrder,
}: {
  sortOrder: "newest" | "oldest";
  setSortOrder: (v: "newest" | "oldest") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "newest" as const, label: t.publication.sortNewest },
    { value: "oldest" as const, label: t.publication.sortOldest },
  ];

  const current = options.find((o) => o.value === sortOrder)!;

  return (
    <div ref={ref} className={open ? "sort-dropdown is-open" : "sort-dropdown"}>
      <button onClick={() => setOpen((p) => !p)} className="sort-btn">
        {current.label}
        <ChevronRight size={11} className="chevron" />
      </button>

      {open && (
        <div className="sort-menu">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                setSortOrder(o.value);
                setOpen(false);
              }}
              className={o.value === sortOrder ? "sort-option is-active" : "sort-option"}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PublicationPage() {
  const { lang, t } = useLang();
  const { content } = useContent();
  const publications = content.publications;
  const years = useMemo(() => {
    const uniqueYears = [
      ...new Set(
        publications
          .map((p) => publicationFilterYear(p))
          .filter((y): y is number => y !== null)
      ),
    ].sort((a, b) => b - a);

    if (uniqueYears.length === 0) return ["ALL"];
    return ["ALL", ...uniqueYears.map(String)];
  }, [publications]);
  const [yearFilter, setYearFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollButtons() {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 1;
    setCanScrollLeft(hasOverflow && el.scrollLeft > 0);
    setCanScrollRight(hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    if (yearFilter !== "ALL" && !years.includes(yearFilter)) {
      setYearFilter("ALL");
      setPage(1);
    }
  }, [years, yearFilter]);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    const ro = new ResizeObserver(updateScrollButtons);
    ro.observe(el);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [years]);

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  }

  const filtered = publications
    .filter((p) => yearFilter === "ALL" || String(publicationFilterYear(p) ?? "") === yearFilter)
    .sort((a, b) => {
      const da = publicationSortKey(a);
      const db = publicationSortKey(b);
      return sortOrder === "newest" ? db - da : da - db;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function changePage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setYearFilterAndReset(y: string) {
    setYearFilter(y);
    setPage(1);
  }

  return (
    <>
      <Header />
      <main className="page-main">
        <PageBanner title={t.publication.banner} />

        <section className="publication-section section-y">
          <div className="publication-wrapper">
            <div className="publication-filter-container">
              <div className="year-box">
                {canScrollLeft && (
                  <div className="scroll-fade is-left">
                    <button onClick={scrollLeft} className="scroll-btn" aria-label="Scroll left">
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                )}

                <div ref={scrollRef} className="year-scroll scrollbar-hide" onScroll={updateScrollButtons}>
                  <div className="year-list">
                    {years.map((y) => (
                      <FilterBtn
                        key={y}
                        value={y}
                        active={yearFilter === y}
                        onClick={() => setYearFilterAndReset(y)}
                      />
                    ))}
                  </div>
                </div>

                {canScrollRight && (
                  <div className="scroll-fade is-right">
                    <button onClick={scrollRight} className="scroll-btn" aria-label="Scroll right">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>

              <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </div>

            <p className="list-count">{t.publication.count(filtered.length)}</p>

            <div className="publication-list-container">
              {paginated.map((pub) => (
                <PublicationCard key={pub.id} pub={pub} lang={lang} />
              ))}
            </div>

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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
