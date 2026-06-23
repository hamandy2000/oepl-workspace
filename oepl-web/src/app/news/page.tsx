"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { newsDisplay } from "@/lib/content/display";

const PER_PAGE = 10;

function parseDate(date: string) {
  return new Date(date.replace(/\./g, "-"));
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
    { value: "newest" as const, label: t.news.sortNewest },
    { value: "oldest" as const, label: t.news.sortOldest },
  ];

  const current = options.find((o) => o.value === sortOrder)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
        style={{
          background: "#f9fafb",
          color: "#374151",
          border: "1px solid #e5e7eb",
        }}
      >
        {current.label}
        <ChevronRight
          size={11}
          className="transition-transform"
          style={{ transform: open ? "rotate(-90deg)" : "rotate(90deg)" }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-1 rounded-xl overflow-hidden"
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            minWidth: "100%",
          }}
        >
          {options.map((o, i) => (
            <button
              key={o.value}
              onClick={() => { setSortOrder(o.value); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-50 cursor-pointer"
              style={{
                color: o.value === sortOrder ? "#E88800" : "#374151",
                borderTop: i > 0 ? "1px solid #f3f4f6" : "none",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default function NewsPage() {
  const { lang, t } = useLang();
  const { content } = useContent();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const sorted = useMemo(() => {
    return [...content.news].sort((a, b) => {
      const diff = parseDate(b.date).getTime() - parseDate(a.date).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });
  }, [content.news, sortOrder]);

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function setSortOrderAndReset(order: "newest" | "oldest") {
    setSortOrder(order);
    setPage(1);
  }

  function changePage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function rowNumber(indexOnPage: number) {
    const absoluteIndex = (page - 1) * PER_PAGE + indexOnPage;
    if (sortOrder === "newest") {
      return sorted.length - absoluteIndex;
    }
    return absoluteIndex + 1;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">

        {/* Banner */}
        <section className="bg-[#080d1e] pt-16 flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="text-center">
            <p className="section-label mb-2">OEPL</p>
            <h1 className="text-5xl font-bold leading-tight text-white">{t.news.banner}</h1>
          </div>
        </section>

        {/* Notice list */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-6">

            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-xs text-[#9ca3af]">{t.news.count(sorted.length)}</p>
              <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrderAndReset} />
            </div>
            {/* List header — desktop */}
            <div className="hidden sm:grid grid-cols-[48px_1fr_96px] gap-4 px-4 py-3 border-y border-gray-200 bg-gray-50 text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af] text-center">
              <span>{t.news.colNo}</span>
              <span>{t.news.colTitle}</span>
              <span>{t.news.colDate}</span>
            </div>

            {/* Rows */}
            <div className="border-b border-gray-200">
              {paginated.map((item, i) => {
                const display = newsDisplay(item, lang);
                return (
                <article
                  key={item.id}
                  className="group grid grid-cols-1 sm:grid-cols-[48px_1fr_96px] gap-2 sm:gap-4 px-4 py-5 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors hover:bg-[#fff8ef]/40"
                >
                  <span className="hidden sm:block text-xs text-[#9ca3af] font-mono pt-0.5 text-center">
                    {rowNumber(i)}
                  </span>

                  <div className="min-w-0">
                    <div className="sm:hidden mb-1">
                      <span className="text-[10px] text-[#9ca3af]">{display.date}</span>
                    </div>
                    <h2 className="text-sm font-semibold text-[#080d1e] leading-snug group-hover:text-[#E88800] transition-colors">
                      {display.title}
                    </h2>
                    <p className="text-xs text-[#6b7280] leading-relaxed mt-1.5 line-clamp-2">
                      {display.detail}
                    </p>
                  </div>

                  <time className="hidden sm:block text-xs text-[#9ca3af] text-center pt-0.5 flex-shrink-0">
                    {display.date}
                  </time>
                </article>
              );})}
            </div>

            {paginated.length === 0 && (
              <div className="text-center py-12 border-b border-gray-200">
                <p className="text-[#9ca3af]">{t.news.empty}</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  style={{ border: "1px solid #e5e7eb", color: "#6b7280" }}
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      background: p === page ? "#E88800" : "transparent",
                      color: p === page ? "#ffffff" : "#6b7280",
                      border: p === page ? "1px solid #E88800" : "1px solid transparent",
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  style={{ border: "1px solid #e5e7eb", color: "#6b7280" }}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}

          </div>
        </section>

      </main>
      <FooterCTA />
    </>
  );
}
