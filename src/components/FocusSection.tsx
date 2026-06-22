"use client";
import { Atom, Layers, Sun, TrendingUp } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const icons = [
  <Atom key="atom" size={48} strokeWidth={1.5} color="#E88800" />,
  <Layers key="layers" size={48} strokeWidth={1.5} color="#E88800" />,
  <Sun key="sun" size={48} strokeWidth={1.5} color="#E88800" />,
  <TrendingUp key="trending" size={48} strokeWidth={1.5} color="#E88800" />,
];

export default function FocusSection() {
  const { lang, t } = useLang();
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">

          {/* Left — title */}
          <div className="flex-shrink-0 flex items-stretch gap-5">
            <div>
              <p className="text-xs tracking-widest uppercase font-semibold mb-3" style={{ color: "#E88800" }}>
                {t.focus.label}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{t.focus.title}</h2>
            </div>
          </div>

          {/* Right — 4 cards */}
          <div className="flex-1 grid grid-cols-4 gap-8">
            {t.focus.items.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-4 text-center">
                <div className="flex items-center justify-center">
                  {icons[i]}
                </div>
                <div>
                  <div className="text-[#080d1e] font-semibold text-sm">{item.title}</div>
                  {lang === "KR" && (
                    <div className="text-xs text-[#9ca3af] mb-2">{item.enTitle}</div>
                  )}
                  <p className="text-[#6b7280] text-xs leading-relaxed break-keep">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
