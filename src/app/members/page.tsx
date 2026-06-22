"use client";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import { Mail, BookOpen, FlaskConical, GraduationCap, Briefcase, Star } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const professor = {
  nameKo: "조신욱 교수",
  nameEn: "Shin Uk Choi",
  affiliation: { KR: "울산대학교 공과대학 반도체물리공학과", EN: "Dept. of Semiconductor Physics Engineering, Univ. of Ulsan" },
  email: "sucho@ulsan.ac.kr",
  scholar: "https://scholar.google.com",
  education: [
    { period: "2000 – 2005", KR: "서울대학교 물리학과 학사",  EN: "B.S. in Physics, Seoul National University" },
    { period: "2005 – 2007", KR: "서울대학교 물리학과 석사",  EN: "M.S. in Physics, Seoul National University" },
    { period: "2007 – 2012", KR: "서울대학교 물리학과 박사",  EN: "Ph.D. in Physics, Seoul National University" },
  ],
  career: [
    { period: "2012 – 2015", KR: "삼성전자 종합기술원 선임연구원",          EN: "Senior Researcher, Samsung Advanced Institute of Technology" },
    { period: "2015 – 2018", KR: "KAIST 물리학과 박사후연구원",              EN: "Postdoctoral Researcher, KAIST Dept. of Physics" },
    { period: "2018 – 현재",  KR: "울산대학교 반도체물리공학과 교수",        EN: "Professor, Dept. of Semiconductor Physics Engineering, Univ. of Ulsan" },
  ],
  achievements: [
    { period: "2023", KR: "유기태양전지 효율 17.38% 달성 (세계 최고 수준)", EN: "17.38% OPV Efficiency Achieved (World-Class Level)" },
    { period: "2022", KR: "국내 최초 완전한 에너지 손실 분석 시스템 구축",  EN: "First Complete Energy Loss Analysis System in Korea" },
    { period: "2020", KR: "한국연구재단 우수연구자 선정",                    EN: "Selected as Outstanding Researcher by NRF Korea" },
  ],
};

const postdocs = [
  { nameKo: "홍길동", nameEn: "Hong Gil Dong", degree: "박사후연구원", email: "hgd@ulsan.ac.kr", field: { KR: "유기태양전지 효율 향상",  EN: "OPV Efficiency Enhancement" } },
  { nameKo: "김철수", nameEn: "Kim Chul Su",   degree: "박사후연구원", email: "kcs@ulsan.ac.kr", field: { KR: "반투명 전극 소재",        EN: "Semi-transparent Electrode" } },
  { nameKo: "유나현", nameEn: "Yoo Na Hyeon",  degree: "박사후연구원", email: "ynh@ulsan.ac.kr", field: { KR: "유기 소재 광물리",       EN: "Organic Material Photophysics" } },
];

const gradStudents = [
  { nameKo: "이영희", nameEn: "Lee Young Hee", degree: "박사과정",   email: "lyh@ulsan.ac.kr", field: { KR: "유기 소재 합성",     EN: "Organic Material Synthesis" } },
  { nameKo: "박지민", nameEn: "Park Ji Min",   degree: "박사과정",   email: "pjm@ulsan.ac.kr", field: { KR: "소자 공정 개발",    EN: "Device Process Development" } },
  { nameKo: "최민준", nameEn: "Choi Min Jun",  degree: "석사과정",   email: "cmj@ulsan.ac.kr", field: { KR: "에너지 손실 분석",  EN: "Energy Loss Analysis" } },
  { nameKo: "정수빈", nameEn: "Jung Su Bin",   degree: "석사과정",   email: "jsb@ulsan.ac.kr", field: { KR: "광흡수 소재 연구",  EN: "Light-Absorbing Materials" } },
  { nameKo: "오민준", nameEn: "Oh Min Jun",    degree: "석사과정",   email: "omj@ulsan.ac.kr", field: { KR: "페로브스카이트 소재", EN: "Perovskite Materials" } },
  { nameKo: "강하은", nameEn: "Kang Ha Eun",   degree: "학부연구생", email: "khe@ulsan.ac.kr", field: { KR: "전하 이동 특성 분석", EN: "Charge Transport Analysis" } },
];

const phdAlumni = [
  { nameKo: "오준석", nameEn: "Oh Jun Seok", degree: "박사과정", year: 2023, month: 2, affiliation: { KR: "삼성전자 DS부문", EN: "Samsung Electronics DS" } },
];

const msAlumni = [
  { nameKo: "윤서연", nameEn: "Yoon Seo Yeon", degree: "석사과정", year: 2022, month: 8,  affiliation: { KR: "LG화학 연구소",      EN: "LG Chem Research Lab" } },
  { nameKo: "강태호", nameEn: "Kang Tae Ho",   degree: "석사과정", year: 2023, month: 2,  affiliation: { KR: "SK하이닉스",          EN: "SK Hynix" } },
  { nameKo: "임채원", nameEn: "Lim Chae Won",  degree: "석사과정", year: 2022, month: 2,  affiliation: { KR: "한국에너지연구원",     EN: "KIER" } },
  { nameKo: "신예진", nameEn: "Shin Ye Jin",   degree: "석사과정", year: 2021, month: 8,  affiliation: { KR: "KAIST 박사과정",      EN: "KAIST Ph.D Program" } },
  { nameKo: "허준영", nameEn: "Heo Jun Young", degree: "석사과정", year: 2021, month: 2,  affiliation: { KR: "현대자동차 연구소",   EN: "Hyundai Motor Research" } },
];

type Lang = "KR" | "EN";

function ResearcherCard({ r, lang, degreeMap }: {
  r: { nameKo: string; nameEn: string; degree: string; email: string; field: Record<string, string> };
  lang: Lang;
  degreeMap: Record<string, string>;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-3 flex gap-4 hover:border-[#E88800]/40 transition-colors">
      <div className="flex-shrink-0 rounded-xl w-[140px] h-[168px] flex items-center justify-center bg-gray-100 border border-gray-200">
        <span className="text-[10px] text-gray-400">{lang === "KR" ? "사진" : "Photo"}</span>
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
          <span className="truncate">{r.field[lang]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
          <Mail size={11} />
          <span className="truncate">{r.email}</span>
        </div>
      </div>
    </div>
  );
}

function AlumniCard({ a, lang }: {
  a: { nameKo: string; nameEn: string; degree: string; year: number; month: number; affiliation: Record<string, string> };
  lang: Lang;
}) {
  const degreeLabel = lang === "KR"
    ? (a.degree === "박사과정" ? "박사과정" : "석사과정")
    : (a.degree === "박사과정" ? "Ph.D Program" : "M.S Program");
  const monthPad = String(a.month).padStart(2, "0");
  return (
    <div className="rounded-xl bg-white border border-gray-100 px-5 py-4 flex items-center justify-between gap-4 hover:border-[#E88800]/30 transition-colors">
      <div>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-semibold text-sm text-[#080d1e]">{lang === "KR" ? a.nameKo : a.nameEn}</span>
          <span className="text-xs text-[#9ca3af]">{lang === "KR" ? a.nameEn : a.nameKo}</span>
        </div>
        <span className="text-xs text-[#6b7280]">{a.year} · {monthPad}</span>
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
  const m = t.members;
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
        <section className="py-20 bg-white border-b border-gray-100">
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
                  <p className="text-xs text-[#9ca3af] mb-1">{professor.affiliation[lang]}</p>
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
                  {professor.education.map((e, i) => (
                    <TimelineRow key={i} period={e.period} desc={e[lang]} />
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E88800]/10 text-[#E88800]">
                      <Briefcase size={14} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">{m.careerLabel}</p>
                  </div>
                  {professor.career.map((c, i) => (
                    <TimelineRow key={i} period={c.period} desc={c[lang]} />
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E88800]/10 text-[#E88800]">
                      <Star size={14} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">{m.achievementsLabel}</p>
                  </div>
                  {professor.achievements.map((a, i) => (
                    <TimelineRow key={i} period={a.period} desc={a[lang]} />
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
              {postdocs.map((r, i) => (
                <ResearcherCard key={i} r={r} lang={lang} degreeMap={m.degreeMap} />
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
              {gradStudents.map((r, i) => (
                <ResearcherCard key={i} r={r} lang={lang} degreeMap={m.degreeMap} />
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
              {phdAlumni.map((a, i) => (
                <AlumniCard key={i} a={a} lang={lang} />
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
              {msAlumni.map((a, i) => (
                <AlumniCard key={i} a={a} lang={lang} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <FooterCTA />
    </>
  );
}
