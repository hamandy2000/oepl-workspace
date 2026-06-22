"use client";
import { useLang } from "@/contexts/LangContext";

export default function IntroSection() {
  const { t } = useLang();
  return (
    <section id="about" className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <div className="mb-10">
              <p className="section-label mb-1">{t.intro.label}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e] mb-4 leading-snug">
                {t.intro.title}
              </h2>
            </div>

            <div>
              <p className="text-lg text-[#E88800] font-medium mb-6 leading-snug">
                {t.intro.tagline}
              </p>
              <div>
                <div className="space-y-4 text-[#6b7280] text-sm leading-relaxed">
                  <p>{t.intro.p1}</p>
                  <p>{t.intro.p2}</p>
                  <p>{t.intro.p3}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/about"
                className="inline-flex items-center gap-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  padding: "var(--spacing-300) var(--spacing-600)",
                  background: "var(--color-brand)",
                  color: "#ffffff",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                {t.intro.btn1}
              </a>
              <a
                href="/members"
                className="inline-flex items-center gap-2 rounded-full text-sm font-medium transition-all hover:text-[var(--color-neutral-900)]"
                style={{
                  padding: "var(--spacing-300) var(--spacing-600)",
                  border: "1px solid var(--color-neutral-200)",
                  color: "var(--color-neutral-500)",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                {t.intro.btn2}
              </a>
            </div>
          </div>

          {/* Right — stats / highlights */}
          <div className="grid grid-cols-2 gap-6">
            {t.intro.stats.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-100 p-6 flex flex-col gap-2 hover:border-[#E88800]/40 transition-colors"
              >
                <span className="text-3xl font-bold text-[#080d1e]">{value}</span>
                <span className="text-xs text-[#9ca3af] leading-snug">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
