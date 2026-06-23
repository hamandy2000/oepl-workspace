"use client";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { publicationSortKey, publicationYear } from "@/lib/content/display";

export default function PublicationsSection() {
  const { lang, t } = useLang();
  const { content } = useContent();
  const publications = [...content.publications]
    .sort((a, b) => publicationSortKey(b) - publicationSortKey(a))
    .slice(0, 4);

  return (
    <section id="publications" className="bg-white py-12">
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
            href="/publication"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#E88800" }}
          >
            {t.publications.more}
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publications.map((pub) => {
            const primaryTitle = lang === "KR" ? pub.titleKo : pub.titleEn;
            const secondaryTitle = lang === "KR" ? pub.titleEn : pub.titleKo;
            const year = publicationYear(pub);
            return (
              <div
                key={pub.id}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white transition-colors hover:border-[#E88800]/40 p-4"
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-3">
                    {year !== null && (
                      <>
                        <span className="text-[#9ca3af] text-xs">{year}</span>
                        <span className="text-[#d1d5db]">·</span>
                      </>
                    )}
                    <span className="text-xs font-semibold text-[#9ca3af]">{pub.journal}</span>
                  </div>
                  <h3 className="text-[#080d1e] font-semibold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-[#E88800] transition-colors">
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
