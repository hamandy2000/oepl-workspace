"use client";
import { useState } from "react";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

type Category = "전체" | "Member" | "Conference" | "기타";

const photos: { id: number; title: string; date: string; category: Category }[] = [
  { id: 1,  category: "Conference", title: "MRS Spring Meeting 2026 포스터 발표",          date: "2026.04.10" },
  { id: 2,  category: "Conference", title: "한국물리학회 봄 학술대회 구두 발표",            date: "2026.04.22" },
  { id: 3,  category: "Member",     title: "2026년 2월 석사 학위 수여식",                   date: "2026.02.18" },
  { id: 4,  category: "Member",     title: "오준석 박사 졸업 및 취업 축하 송별회",          date: "2026.02.10" },
  { id: 5,  category: "Member",     title: "겨울 연구실 MT — 강원도 평창",                  date: "2026.01.20" },
  { id: 6,  category: "Member",     title: "신입 연구원 환영회 및 오리엔테이션",             date: "2026.03.05" },
  { id: 7,  category: "Conference", title: "MRS Fall Meeting 2025 포스터 발표",             date: "2025.11.28" },
  { id: 8,  category: "Conference", title: "ICSM 2025 국제 학술대회 참가",                  date: "2025.10.14" },
  { id: 9,  category: "Member",     title: "2025년 8월 석·박사 학위 수여식",               date: "2025.08.22" },
  { id: 10, category: "Member",     title: "윤서연 박사 졸업 및 LG화학 입사 축하 송별회",   date: "2025.08.15" },
  { id: 11, category: "Member",     title: "여름 연구실 MT — 경남 거제",                    date: "2025.07.18" },
  { id: 12, category: "기타",       title: "조신욱 교수 부임 7주년 기념 행사",               date: "2025.09.01" },
  { id: 13, category: "Conference", title: "한국고분자학회 춘계 학술대회",                    date: "2025.04.25" },
  { id: 14, category: "Member",     title: "2025년 2월 석사 학위 수여식",                   date: "2025.02.20" },
  { id: 15, category: "Member",     title: "강태호 석사 졸업 및 SK하이닉스 입사 송별",      date: "2025.02.12" },
  { id: 16, category: "Member",     title: "겨울 연구실 MT — 전북 무주",                    date: "2025.01.17" },
  { id: 17, category: "기타",       title: "KAIST·UNIST 공동 연구팀 교류 행사",             date: "2024.11.05" },
  { id: 18, category: "Conference", title: "MRS Fall Meeting 2024 포스터 발표",             date: "2024.11.25" },
];

const categories: Category[] = ["전체", "Member", "Conference", "기타"];
const PER_PAGE = 9;

export default function GalleryPage() {
  const { t } = useLang();
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
        <section className="pt-10 pb-20">
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
              {paginated.map((photo) => (
                <div key={photo.id} className="flex flex-col gap-3 group cursor-pointer">
                  {/* Image placeholder */}
                  <div
                    className="w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 transition-all duration-300 group-hover:border-[#E88800]/40"
                    style={{ aspectRatio: "5/3" }}
                  >
                    <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
                      <svg className="opacity-20 w-10 h-10" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#E88800" strokeWidth="1.5" />
                        <circle cx="8.5" cy="8.5" r="1.5" stroke="#E88800" strokeWidth="1.5" />
                        <path d="M21 15l-5-5L5 21" stroke="#E88800" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
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
              ))}
            </div>

            {/* Empty state */}
            {paginated.length === 0 && (
              <div className="text-center py-20">
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
