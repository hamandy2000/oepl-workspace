"use client";
import { useState } from "react";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { GalleryCategory } from "@/types/content";
import { galleryCoverPhoto } from "@/lib/content/display";

type Category = "전체" | GalleryCategory;

const categories: Category[] = ["전체", "Member", "Conference", "기타"];
const PER_PAGE = 9;

export default function GalleryPage() {
  const { t } = useLang();
  const { content } = useContent();
  const photos = content.gallery;
  const [category, setCategory] = useState<Category>("전체");
  const [page, setPage] = useState(1);

  const filtered = category === "전체" ? photos : photos.filter((p) => p.category === category);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function selectCategory(c: Category) {
    setCategory(c);
    setPage(1);
  }

  function changePage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const catColors: Record<Category, { bg: string; text: string; border: string }> = {
    전체:       { bg: "transparent",           text: "#6b7280", border: "#e5e7eb" },
    Member:     { bg: "rgba(232,136,0,0.08)",  text: "#E88800", border: "rgba(232,136,0,0.25)" },
    Conference: { bg: "rgba(59,130,246,0.08)", text: "#3b82f6", border: "rgba(59,130,246,0.25)" },
    기타:       { bg: "rgba(107,114,128,0.08)", text: "#6b7280", border: "rgba(107,114,128,0.25)" },
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">

        {/* Banner */}
        <section className="bg-[#080d1e] pt-16 flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="text-center">
            <p className="section-label mb-2">OEPL</p>
            <h1 className="text-5xl font-bold leading-tight text-white">{t.gallery.banner}</h1>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">

            {/* Header + filters */}
            <div className="flex mb-10">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const active = category === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => selectCategory(cat)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={{
                        background: active ? "#E88800" : "#f9fafb",
                        color: active ? "#ffffff" : "#6b7280",
                        border: `1px solid ${active ? "#E88800" : "#e5e7eb"}`,
                      }}
                    >
                      {t.gallery.categoryLabels[cat] ?? cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Count */}
            <p className="text-xs text-[#9ca3af] mb-6 text-right">{t.gallery.count(filtered.length)}</p>

            {/* 3-column grid */}
            <div className="grid grid-cols-3 gap-8">
              {paginated.map((photo) => {
                const cover = galleryCoverPhoto(photo);
                return (
                <div key={photo.id} className="flex flex-col gap-3 group cursor-pointer">
                  {/* Image placeholder */}
                  <div
                    className="w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 transition-all duration-300 group-hover:border-[#E88800]/40"
                    style={{ aspectRatio: "5/3" }}
                  >
                    <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="opacity-20 w-10 h-10" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#E88800" strokeWidth="1.5" />
                          <circle cx="8.5" cy="8.5" r="1.5" stroke="#E88800" strokeWidth="1.5" />
                          <path d="M21 15l-5-5L5 21" stroke="#E88800" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: catColors[photo.category].bg || "#f3f4f6",
                          color: catColors[photo.category].text,
                          border: `1px solid ${catColors[photo.category].border}`,
                        }}
                      >
                        {photo.category}
                      </span>
                      <span className="text-[10px] text-[#9ca3af]">{photo.date}</span>
                    </div>
                    <p className="text-sm font-medium text-[#080d1e] leading-snug break-keep group-hover:text-[#E88800] transition-colors">
                      {photo.title}
                    </p>
                  </div>
                </div>
              );})}
            </div>

            {/* Empty state */}
            {paginated.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#9ca3af]">{t.gallery.empty}</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-16">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
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
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
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
