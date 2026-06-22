"use client";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

function ResearchCard({
  item,
  large,
}: {
  item: { tag: string; title: string; desc: string };
  large: boolean;
}) {
  return (
    <div
      className={`card-hover relative overflow-hidden rounded-2xl border border-gray-200 bg-white group cursor-pointer ${large ? "h-full" : ""}`}
    >
      <div className="absolute inset-0 group-hover:bg-black/[0.025] transition-colors duration-300" />
      <div className={`relative z-10 p-6 flex flex-col h-full ${large ? "justify-end min-h-[380px]" : "justify-end min-h-[180px]"}`}>
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E88800]/15 text-[#E88800] border border-[#E88800]/30 mb-3 w-fit">
          {item.tag}
        </span>
        <h3 className="text-[#080d1e] font-bold text-base leading-snug whitespace-pre-line mb-2">
          {item.title}
        </h3>
        <p className="text-[#6b7280] text-xs">{item.desc}</p>
      </div>
    </div>
  );
}

export default function ResearchSection() {
  const { t } = useLang();
  const [main, ...subs] = t.research.items;
  return (
    <section id="research" className="bg-[#f9fafb] py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-3">{t.research.label}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">
              {t.research.title}
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#E88800" }}
          >
            {t.research.more}
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ResearchCard item={main} large />
          <div className="grid grid-cols-2 gap-5">
            {subs.map((item, i) => (
              <ResearchCard key={i} item={item} large={false} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
