"use client";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { Mail, BookOpen, FlaskConical, GraduationCap, Briefcase, Star } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { groupMembersForDisplay, formatGraduationYear } from "@/lib/content/members";
import type { MemberRecord } from "@/types/content";
import type { Lang } from "@/i18n/translations";

function MemberAvatar({
  photoUrl,
  lang,
  className,
}: {
  photoUrl?: string;
  lang: Lang;
  className?: string;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoUrl} alt="" className={className ?? "w-full h-full object-cover"} />
    );
  }
  return <span className="text-[10px] text-gray-400">{lang === "KR" ? "사진" : "Photo"}</span>;
}

function ResearcherCard({ r, lang, degreeMap }: {
  r: MemberRecord;
  lang: Lang;
  degreeMap: Record<string, string>;
}) {
  const field = r.research;
  return (
    <div className="card-hover rounded-2xl bg-white border border-gray-100 p-3 flex gap-4 hover:border-[#E88800]/40">
      <div className="flex-shrink-0 rounded-xl w-[140px] h-[168px] flex items-center justify-center bg-gray-100 border border-gray-200 overflow-hidden">
        <MemberAvatar photoUrl={r.photoUrl} lang={lang} />
      </div>
      <div className="flex flex-col justify-between min-w-0 py-3 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-sm text-[#080d1e]">{lang === "KR" ? r.nameKo : r.nameEn}</span>
          <span className="text-xs text-[#9ca3af]">{lang === "KR" ? r.nameEn : r.nameKo}</span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit bg-[#E88800]/10 text-[#E88800] border border-[#E88800]/20">
          {degreeMap[r.degree] ?? r.degree}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
          <FlaskConical size={11} className="text-[#E88800]" />
          <span className="truncate">{field}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
          <Mail size={11} />
          <span className="truncate">{r.email}</span>
        </div>
      </div>
    </div>
  );
}

function AlumniCard({ a, lang, degreeMap }: { a: MemberRecord; lang: Lang; degreeMap: Record<string, string> }) {
  const degreeLabel = degreeMap[a.degree] ?? a.degree;
  return (
    <div className="card-hover rounded-xl bg-white border border-gray-100 px-5 py-4 flex items-center justify-between gap-4 hover:border-[#E88800]/40">
      <div>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-semibold text-sm text-[#080d1e]">{lang === "KR" ? a.nameKo : a.nameEn}</span>
          <span className="text-xs text-[#9ca3af]">{lang === "KR" ? a.nameEn : a.nameKo}</span>
        </div>
        <span className="text-xs text-[#6b7280]">{formatGraduationYear(a)}</span>
      </div>
      <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E88800]/10 text-[#E88800] border border-[#E88800]/20">
        {degreeLabel}
      </span>
    </div>
  );
}

function TimelineRow({ period, desc }: { period: string; desc: string }) {
  return (
    <div className="flex items-start py-3 border-b border-gray-100 pl-9">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 flex-1">
        <span className="text-xs font-medium flex-shrink-0 w-36 text-[#E88800]">{period}</span>
        <span className="text-sm text-[#6b7280]">{desc}</span>
      </div>
    </div>
  );
}

export default function MembersPage() {
  const { lang, t } = useLang();
  const { content } = useContent();
  const m = t.members;
  const professor = content.members.professor;
  const { postdocs, gradStudents, phdAlumni, msAlumni } = groupMembersForDisplay(content.members);
  const affiliation = lang === "KR" ? professor.affiliationKr : professor.affiliationEn;
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">

        {/* Banner */}
        <section className="bg-[#080d1e] pt-16 flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="text-center">
            <p className="section-label mb-2">OEPL</p>
            <h1 className="text-5xl font-bold leading-tight text-white">{m.banner}</h1>
          </div>
        </section>

        {/* 교수 소개 */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="section-label mb-1">{m.professorLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{m.professorTitle}</h2>
            </div>

            <div className="rounded-2xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="rounded-xl aspect-[5/6] flex items-center justify-center bg-gray-100 border border-gray-200">
                <span className="text-sm text-gray-400">{m.photo}</span>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs text-[#9ca3af] mb-1">{affiliation}</p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-2xl font-bold text-[#080d1e]">{lang === "KR" ? professor.nameKo : professor.nameEn}</h3>
                    <span className="text-base text-[#9ca3af]">{lang === "KR" ? professor.nameEn : professor.nameKo}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a href={professor.scholar} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-[#6b7280] hover:text-[#E88800] transition-colors">
                    <BookOpen size={14} className="text-[#E88800]" />
                    Google Scholar
                  </a>
                  <a href={`mailto:${professor.email}`}
                    className="inline-flex items-center gap-2 text-xs text-[#6b7280] hover:text-[#E88800] transition-colors">
                    <Mail size={14} className="text-[#E88800]" />
                    {professor.email}
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E88800]/10 text-[#E88800]">
                      <GraduationCap size={14} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">{m.educationLabel}</p>
                  </div>
                  {professor.education.map((e) => (
                    <TimelineRow key={e.id} period={e.period} desc={lang === "KR" ? e.textKr : e.textEn} />
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E88800]/10 text-[#E88800]">
                      <Briefcase size={14} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">{m.careerLabel}</p>
                  </div>
                  {professor.career.map((c) => (
                    <TimelineRow key={c.id} period={c.period} desc={lang === "KR" ? c.textKr : c.textEn} />
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E88800]/10 text-[#E88800]">
                      <Star size={14} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">{m.achievementsLabel}</p>
                  </div>
                  {professor.achievements.map((a) => (
                    <TimelineRow key={a.id} period={a.period} desc={lang === "KR" ? a.textKr : a.textEn} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 박사후연구원 */}
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="section-label mb-1">{m.postdocLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{m.postdocTitle}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {postdocs.map((r) => (
                <ResearcherCard key={r.id} r={r} lang={lang} degreeMap={m.degreeMap} />
              ))}
            </div>
          </div>
        </section>

        {/* 대학원생 */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="section-label mb-1">{m.gradLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{m.gradTitle}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gradStudents.map((r) => (
                <ResearcherCard key={r.id} r={r} lang={lang} degreeMap={m.degreeMap} />
              ))}
            </div>
          </div>
        </section>

        {/* 졸업생 — Ph.D */}
        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="section-label mb-1">{m.phdAlumniLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{m.phdAlumniTitle}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {phdAlumni.map((a) => (
                <AlumniCard key={a.id} a={a} lang={lang} degreeMap={m.degreeMap} />
              ))}
            </div>
          </div>
        </section>

        {/* 졸업생 — M.S */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="section-label mb-1">{m.msAlumniLabel}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080d1e]">{m.msAlumniTitle}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {msAlumni.map((a) => (
                <AlumniCard key={a.id} a={a} lang={lang} degreeMap={m.degreeMap} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <FooterCTA />
    </>
  );
}
