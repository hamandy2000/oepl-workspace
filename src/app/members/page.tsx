"use client";

/** Members 페이지 — 교수·연구원·대학원생·졸업생 목록 (스타일: src/styles/members.css) */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, BookOpen, FlaskConical, Briefcase } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import { groupMembersForDisplay, formatGraduationYear } from "@/lib/content/members";
import type { MemberRecord } from "@/types/content";
import PageBanner from "@/components/PageBanner";
import type { Lang } from "@/i18n/translations";

function MemberAvatar({ photoUrl, lang }: { photoUrl?: string; lang: Lang }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt="" className="member-photo" />;
  }
  return (
    <span className="member-photo-placeholder">{lang === "KR" ? "사진" : "Photo"}</span>
  );
}

function ResearcherCard({
  r,
  lang,
  degreeMap,
}: {
  r: MemberRecord;
  lang: Lang;
  degreeMap: Record<string, string>;
}) {
  return (
    <div className="researcher-card card-hover">
      <div className="photo-box">
        <MemberAvatar photoUrl={r.photoUrl} lang={lang} />
      </div>
      <div className="member-body">
        <div className="name-box">
          <span className="name">{lang === "KR" ? r.nameKo : r.nameEn}</span>
          <span className="name-sub">{lang === "KR" ? r.nameEn : r.nameKo}</span>
        </div>
        <span className="degree-tag">{degreeMap[r.degree] ?? r.degree}</span>
        <p className="info-row">
          <FlaskConical size={11} className="info-icon" />
          <span className="info-text">{r.research}</span>
        </p>
        <p className="info-row is-email">
          <Mail size={11} className="info-icon" />
          <span className="info-text">{r.email}</span>
        </p>
      </div>
    </div>
  );
}

function AlumniCard({
  a,
  lang,
  degreeMap,
}: {
  a: MemberRecord;
  lang: Lang;
  degreeMap: Record<string, string>;
}) {
  return (
    <div className="alumni-card card-hover">
      <div className="alumni-body">
        <div className="name-row">
          <span className="name">{lang === "KR" ? a.nameKo : a.nameEn}</span>
          <span className="name-sub">{lang === "KR" ? a.nameEn : a.nameKo}</span>
        </div>
        <span className="graduation">{formatGraduationYear(a)}</span>
      </div>
      <span className="degree-tag">{degreeMap[a.degree] ?? a.degree}</span>
    </div>
  );
}

function CareerRow({ period, desc }: { period: string; desc: string }) {
  return (
    <div className="career-row">
      <div className="career-inner">
        <span className="period">{period}</span>
        <span className="desc">{desc}</span>
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
      <main className="page-main">
        <PageBanner title={m.banner} />

        {/* 교수 소개 */}
        <section id="professor" className="members-section section-anchor section-y">
          <div className="section-wrapper">
            <div className="page-head-container">
              <p className="section-label">{m.professorLabel}</p>
              <h2 className="section-title">{m.professorTitle}</h2>
            </div>

            <div className="professor-card">
              <div className="photo-box">
                <MemberAvatar photoUrl={professor.photoUrl} lang={lang} />
              </div>
              <div className="professor-body">
                <div>
                  <p className="affiliation">{affiliation}</p>
                  <div className="name-row">
                    <h3 className="name">{lang === "KR" ? professor.nameKo : professor.nameEn}</h3>
                    <span className="name-sub">
                      {lang === "KR" ? professor.nameEn : professor.nameKo}
                    </span>
                  </div>
                </div>

                <div className="link-container">
                  <a href={professor.scholar} target="_blank" rel="noreferrer" className="link">
                    <BookOpen size={14} className="link-icon" />
                    Google Scholar
                  </a>
                  <a href={`mailto:${professor.email}`} className="link">
                    <Mail size={14} className="link-icon" />
                    {professor.email}
                  </a>
                </div>

                <div>
                  <div className="career-head">
                    <div className="icon-box">
                      <Briefcase size={14} />
                    </div>
                    <p className="career-label">{m.careerLabel}</p>
                  </div>
                  {professor.career.map((c) => (
                    <CareerRow
                      key={c.id}
                      period={c.period}
                      desc={lang === "KR" ? c.textKr : c.textEn}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 박사후연구원 */}
        <section id="researchers" className="members-section is-alt section-anchor section-y">
          <div className="section-wrapper">
            <div className="page-head-container">
              <p className="section-label">{m.postdocLabel}</p>
              <h2 className="section-title">{m.postdocTitle}</h2>
            </div>
            <div className="member-list-container">
              {postdocs.map((r) => (
                <ResearcherCard key={r.id} r={r} lang={lang} degreeMap={m.degreeMap} />
              ))}
            </div>
          </div>
        </section>

        {/* 대학원생 */}
        <section className="members-section section-y">
          <div className="section-wrapper">
            <div className="page-head-container">
              <p className="section-label">{m.gradLabel}</p>
              <h2 className="section-title">{m.gradTitle}</h2>
            </div>
            <div className="member-list-container">
              {gradStudents.map((r) => (
                <ResearcherCard key={r.id} r={r} lang={lang} degreeMap={m.degreeMap} />
              ))}
            </div>
          </div>
        </section>

        {/* 졸업생 — Ph.D */}
        <section className="members-section is-alt section-y">
          <div className="section-wrapper">
            <div className="page-head-container">
              <p className="section-label">{m.phdAlumniLabel}</p>
              <h2 className="section-title">{m.phdAlumniTitle}</h2>
            </div>
            <div className="alumni-list-container">
              {phdAlumni.map((a) => (
                <AlumniCard key={a.id} a={a} lang={lang} degreeMap={m.degreeMap} />
              ))}
            </div>
          </div>
        </section>

        {/* 졸업생 — M.S */}
        <section className="members-section is-last section-y">
          <div className="section-wrapper">
            <div className="page-head-container">
              <p className="section-label">{m.msAlumniLabel}</p>
              <h2 className="section-title">{m.msAlumniTitle}</h2>
            </div>
            <div className="alumni-list-container">
              {msAlumni.map((a) => (
                <AlumniCard key={a.id} a={a} lang={lang} degreeMap={m.degreeMap} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
