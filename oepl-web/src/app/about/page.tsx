"use client";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import BrandIdentitySection from "@/components/BrandIdentitySection";
import { formatPatentDate } from "@/lib/content/display";
import { FileText } from "lucide-react";

export default function AboutPage() {
  const { lang, t } = useLang();
  const { content } = useContent();
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">

        {/* Banner */}
        <section className="bg-[#080d1e] pt-16 flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="text-center">
            <p className="section-label mb-2">OEPL</p>
            <h1 className="text-5xl font-bold leading-tight text-white">{t.about.banner}</h1>
          </div>
        </section>

        {/* 인사말 */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="rounded-2xl aspect-[15/16] flex items-center justify-center bg-gray-100 border border-gray-200">
              <span className="text-sm text-gray-400">{t.about.profPhoto}</span>
            </div>
            <div>
              <p className="section-label mb-8">{t.about.greetingLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e] mb-6 leading-snug">
                {t.about.greetingTitle.split("\n").map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[#6b7280]">
                {t.about.greetingPs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>

        <BrandIdentitySection />

        {/* 연구 분야 소개 */}
        <section id="research" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <p className="section-label mb-1">{t.about.researchLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{t.about.researchTitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.about.areas.map((area, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-gray-100 overflow-hidden flex flex-col hover:border-[#E88800]/40 transition-colors card-hover"
                >
                  <div className="w-full bg-gray-100" style={{ height: 240 }} />
                  <div className="p-6 flex flex-col gap-3">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full w-fit bg-[#E88800]/10 text-[#E88800] border border-[#E88800]/20">
                      {area.tag}
                    </span>
                    <h3 className="font-bold text-base text-[#080d1e]">{area.title}</h3>
                    <p className="text-sm leading-relaxed text-[#6b7280]">{area.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 특허 소개 */}
        <section id="patents" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <p className="section-label mb-1">{t.about.patentLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{t.about.patentTitle}</h2>
            </div>

            <div className="flex flex-col gap-4">
              {content.patents.map((patent) => {
                const isRegistered = patent.status === "registered";
                return (
                  <div
                    key={patent.id}
                    className="rounded-2xl bg-white border border-gray-100 p-6 flex gap-5 items-start hover:border-[#E88800]/40 transition-colors group"
                  >
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                      style={{ background: isRegistered ? "rgba(232,136,0,0.1)" : "#f3f4f6" }}
                    >
                      <FileText size={18} style={{ color: isRegistered ? "#E88800" : "#9ca3af" }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: isRegistered ? "rgba(232,136,0,0.1)" : "#f3f4f6",
                            color: isRegistered ? "#E88800" : "#6b7280",
                            border: `1px solid ${isRegistered ? "rgba(232,136,0,0.25)" : "#e5e7eb"}`,
                          }}
                        >
                          {isRegistered ? t.about.patentStatusRegistered : t.about.patentStatusPending}
                        </span>
                        <span className="text-[10px] text-[#9ca3af] font-mono">{patent.number}</span>
                        <span className="text-[10px] text-[#9ca3af]">{formatPatentDate(patent.date)}</span>
                      </div>

                      <h3 className="font-semibold text-sm text-[#080d1e] leading-snug mb-1 group-hover:text-[#E88800] transition-colors">
                        {lang === "KR" ? patent.title : patent.titleEn}
                      </h3>
                      <p className="text-xs text-[#9ca3af] leading-snug mb-2">
                        {lang === "KR" ? patent.titleEn : patent.title}
                      </p>
                      <p className="text-xs text-[#6b7280]">{patent.inventors}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
      <FooterCTA />
    </>
  );
}
