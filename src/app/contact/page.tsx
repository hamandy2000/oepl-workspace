"use client";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { useLang } from "@/contexts/LangContext";

export default function ContactPage() {
  const { t } = useLang();
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="bg-white py-20 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs tracking-widest uppercase font-semibold mb-3" style={{ color: "#E88800" }}>
              {t.contact.label}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#080d1e] mb-4">{t.contact.title}</h1>
            <div className="mt-8 space-y-3 text-[#6b7280] text-sm">
              <p>(44610) 울산광역시 남구 대학로 93 울산대학교 자연과학대학 8호관 8-224호 / 8-228호</p>
              <p>93 Daehak-ro, Nam-gu, Ulsan 44610, Korea — Bldg. 8, Rm. 8-224 / 8-228, Univ. of Ulsan</p>
              <p>+82-52-220-2547 (office)</p>
              <p>sucho@ulsan.ac.kr</p>
            </div>
          </div>
        </section>
      </main>
      <FooterCTA />
    </>
  );
}
