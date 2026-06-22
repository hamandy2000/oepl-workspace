"use client";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export default function NewsSection() {
  const { t } = useLang();
  return (
    <section id="news" className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-1">{t.news.label}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-neutral-900)]">
              {t.news.title}
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#E88800" }}
          >
            {t.news.more}
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="flex flex-row gap-5 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory md:overflow-visible md:mx-0 md:px-0">
          {t.news.items.map((item, i) => (
            <div
              key={i}
              className="card-hover flex-shrink-0 w-[280px] sm:w-[260px] md:flex-1 rounded-2xl overflow-hidden border border-gray-200 bg-white flex flex-col group cursor-pointer shadow-sm snap-start"
            >
              <div className="relative h-44 overflow-hidden bg-gray-50">
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
              </div>
              <div className="px-4 py-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E88800]/15 text-[#E88800] border border-[#E88800]/30">
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-[#9ca3af]">{item.date}</span>
                </div>
                <h3 className="text-[var(--color-neutral-900)] font-semibold text-xs leading-snug line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[var(--color-neutral-500)] text-[11px] leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-brand)] opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
                  {t.news.readMore} <ArrowRight size={11} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <a href="#" className="btn-more">{t.news.more} <ArrowRight size={13} /></a>
        </div>
      </div>
    </section>
  );
}
