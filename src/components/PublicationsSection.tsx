"use client";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const publications = [
  {
    year: "2024",
    journal: "Advanced Energy Materials",
    titleKo: "안정성이 향상된 고효율 비풀러렌 유기태양전지",
    title: "High-Efficiency Non-Fullerene Organic Solar Cells with Enhanced Stability",
    authors: "J. Kim, H. Lee, S. Park, et al.",
  },
  {
    year: "2024",
    journal: "Nature Communications",
    titleKo: "유기광전지의 광대역 흡수를 위한 분자 설계 전략",
    title: "Molecular Design Strategy for Broadband Absorption in Organic Photovoltaics",
    authors: "H. Lee, J. Kim, S. Park, et al.",
  },
  {
    year: "2023",
    journal: "Joule",
    titleKo: "고성능 OPV 모듈의 대면적 제작 공정",
    title: "Scalable Fabrication of High-Performance OPV Modules",
    authors: "S. Park, J. Kim, H. Lee, et al.",
  },
  {
    year: "2023",
    journal: "ACS Applied Materials",
    titleKo: "장수명 유기태양전지를 위한 안정적 비풀러렌 수용체",
    title: "Stable Non-Fullerene Acceptors for Long-Lifetime Organic Solar Cells",
    authors: "J. Kim, S. Park, H. Lee, et al.",
  },
];

export default function PublicationsSection() {
  const { lang, t } = useLang();
  return (
    <section id="publications" className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs tracking-widest uppercase font-semibold mb-3" style={{ color: "#E88800" }}>
              {t.publications.label}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">
              {t.publications.title}
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#E88800" }}
          >
            {t.publications.more}
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publications.map((pub, i) => {
            const primaryTitle = lang === "KR" ? pub.titleKo : pub.title;
            const secondaryTitle = lang === "KR" ? pub.title : pub.titleKo;
            return (
              <div
                key={i}
                className="pub-card flex flex-col rounded-xl overflow-hidden border border-[#e5e7eb] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(232,136,0,0.30)] hover:border-[#E88800]/30"
              >
                <div className="flex flex-col flex-1 p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[#9ca3af] text-xs">{pub.year}</span>
                    <span className="text-[#d1d5db]">·</span>
                    <span className="text-xs font-semibold text-[#9ca3af]">{pub.journal}</span>
                  </div>
                  <h3 className="text-[#080d1e] font-semibold text-sm leading-snug mb-1 line-clamp-2">
                    {primaryTitle}
                  </h3>
                  <p className="text-[#9ca3af] text-xs leading-snug mb-3 line-clamp-2">
                    {secondaryTitle}
                  </p>
                  <p className="text-[#9ca3af] text-xs mb-4">{pub.authors}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
