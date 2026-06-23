"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { publicationDoiLink } from "@/types/content";
import { publicationSortKey, publicationYear } from "@/lib/content/display";

function FilterBtn({ value, active, onClick }: { value: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
      style={{
        background: active ? "#E88800" : "#f9fafb",
        color: active ? "#ffffff" : "#6b7280",
        border: `1px solid ${active ? "#E88800" : "#e5e7eb"}`,
      }}
    >
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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
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
              className="w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-50"
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

export default function PublicationPage() {
  const { lang, t } = useLang();
  const { content } = useContent();
  const publications = content.publications;
  const years = useMemo(() => {
    if (publications.length === 0) return ["ALL"];
    const yearValues = publications.map((p) => publicationYear(p)).filter((y): y is number => y !== null);
    if (yearValues.length === 0) return ["ALL"];
    const maxYear = Math.max(...yearValues);
    const minYear = Math.min(...yearValues);
    return ["ALL", ...Array.from({ length: maxYear - minYear + 1 }, (_, i) => String(maxYear - i))];
  }, [publications]);
  const [yearFilter, setYearFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  }

  const filtered = publications
    .filter((p) => yearFilter === "ALL" || String(publicationYear(p) ?? "") === yearFilter)
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
      <main className="min-h-screen bg-white">

        {/* Banner */}
        <section className="bg-[#080d1e] pt-16 flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="text-center">
            <p className="section-label mb-2">OEPL</p>
            <h1 className="text-5xl font-bold leading-tight text-white">{t.publication.banner}</h1>
          </div>
        </section>

        {/* List */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-6">

            {/* Filters */}
            <div className="flex items-center gap-3 mb-10">
              {/* Year buttons — horizontally scrollable */}
              <div className="flex-1 relative min-w-0">
                {/* Left fade + button */}
                {canScrollLeft && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center z-10"
                    style={{ background: "linear-gradient(to left, transparent, white 60%)", width: 48 }}>
                    <button
                      onClick={scrollLeft}
                      className="pointer-events-auto mr-auto flex items-center justify-center w-6 h-6 rounded-full transition-colors hover:bg-gray-100"
                      style={{ color: "#9ca3af" }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                )}

                <div ref={scrollRef} className="overflow-x-auto scrollbar-hide" onScroll={handleScroll}>
                  <div className="flex items-center gap-2 w-max px-1">
                  {years.map((y) => (
                    <FilterBtn key={y} value={y} active={yearFilter === y} onClick={() => setYearFilterAndReset(y)} />
                  ))}
                  </div>
                </div>

                {/* Right fade + button */}
                {canScrollRight && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center z-10"
                    style={{ background: "linear-gradient(to right, transparent, white 60%)", width: 48 }}>
                    <button
                      onClick={scrollRight}
                      className="pointer-events-auto ml-auto flex items-center justify-center w-6 h-6 rounded-full transition-colors hover:bg-gray-100"
                      style={{ color: "#9ca3af" }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Sort dropdown — fixed right */}
              <div className="flex-shrink-0">
                <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
              </div>
            </div>

            <p className="text-xs text-[#9ca3af] mb-6">{t.publication.count(filtered.length)}</p>

            <div className="flex flex-col gap-4">
              {paginated.map((pub) => {
                const doiHref = publicationDoiLink(pub);
                const year = publicationYear(pub);
                return (
                <div
                  key={pub.id}
                  className="group rounded-2xl bg-white border border-gray-100 p-6 flex flex-col gap-3 hover:border-[#E88800]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: pub.type === "Journal" ? "rgba(232,136,0,0.1)" : "#f3f4f6",
                          color: pub.type === "Journal" ? "#E88800" : "#6b7280",
                          border: `1px solid ${pub.type === "Journal" ? "rgba(232,136,0,0.25)" : "#e5e7eb"}`,
                        }}
                      >
                        {pub.journal}
                      </span>
                      {year !== null && (
                        <span className="text-[10px] font-medium text-[#9ca3af]">{year}</span>
                      )}
                    </div>
                    {doiHref && (
                      <a
                        href={doiHref}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0 flex items-center gap-1 text-xs text-[#9ca3af] hover:text-[#E88800] transition-colors"
                      >
                        <ExternalLink size={12} />
                        DOI
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-sm leading-snug text-[#080d1e] group-hover:text-[#E88800] transition-colors">
                      {lang === "KR" ? pub.titleKo : pub.titleEn}
                    </h3>
                    {(lang === "KR" ? pub.titleEn : pub.titleKo) && (
                      <p className="text-sm leading-snug text-[#9ca3af]">
                        {lang === "KR" ? pub.titleEn : pub.titleKo}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-[#6b7280]">{pub.authors}</p>
                    {pub.doi ? (
                      <a
                        href={doiHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs mt-0.5 text-[#E88800] font-medium hover:underline inline-block"
                      >
                        {pub.doi}
                      </a>
                    ) : null}
                  </div>
                </div>
              );})}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors disabled:opacity-30"
                  style={{ border: "1px solid #e5e7eb", color: "#6b7280" }}
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
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
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors disabled:opacity-30"
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
