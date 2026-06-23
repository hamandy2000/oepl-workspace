import type { Professor, SiteContent } from "@/types/content";
import { createSeedIdFactory } from "./ids";

const id = createSeedIdFactory(1);

const tl = (period: string, textKr: string, textEn: string) => ({
  id: id(),
  period,
  textKr,
  textEn,
});

const pub = (
  year: number,
  month: number,
  day: number,
  type: "Journal" | "Conference",
  titleEn: string,
  titleKo: string,
  authors: string,
  journal: string,
  doi: string
) => ({
  id: id(),
  type,
  titleKo,
  titleEn,
  authors,
  journal,
  doi,
  createdAt: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00Z`,
});

export const seedContent: SiteContent = {
  news: [
    { id: id(), type: "News", date: "2023.05.07", title: "OEPL 홈페이지 개설!", detail: "OEPL이 드디어 홈페이지를 새로 개설하였습니다. 앞으로 많은 관심 부탁드립니다." },
    { id: id(), type: "Research", date: "2023.04.15", title: "유기태양전지 효율 17.38% 달성", detail: "유기태양전지 효율 세계 최고 수준에 근접하는 17.38% 효율 달성 성과를 발표하였습니다." },
    { id: id(), type: "Award", date: "2023.03.20", title: "국내외 공동연구 협약 체결", detail: "KAIST·UNIST·재료연구소·에너지생산기술연구소와 공동 연구 협약을 체결하였습니다." },
    { id: id(), type: "Publication", date: "2023.02.10", title: "Nature Communications 논문 게재", detail: "유기광전자 소자 분야 세계적 저널인 Nature Communications에 논문이 게재되었습니다." },
    { id: id(), type: "Research", date: "2022.11.28", title: "MRS Fall Meeting 2022 포스터 발표", detail: "연구실 연구원들이 MRS Fall Meeting 2022에서 최신 연구 성과를 포스터로 발표하였습니다." },
    { id: id(), type: "Publication", date: "2022.09.14", title: "Advanced Energy Materials 논문 게재", detail: "고효율 유기태양전지 에너지 손실 분석 연구 결과가 Advanced Energy Materials에 게재되었습니다." },
    { id: id(), type: "Award", date: "2022.06.03", title: "한국연구재단 중견연구자 지원과제 선정", detail: "조신욱 교수 연구실이 한국연구재단 중견연구자 지원과제에 선정되었습니다." },
    { id: id(), type: "News", date: "2022.03.15", title: "2022학년도 신입 대학원생 모집", detail: "유기전자물리 연구실에서 2022학년도 석·박사 과정 대학원생을 모집합니다." },
    { id: id(), type: "Research", date: "2021.10.20", title: "반투명 유기태양전지 ITO-free 전극 개발", detail: "ITO-free 투명 전극을 적용한 반투명 유기태양전지 제작 기술을 개발하였습니다." },
    { id: id(), type: "Publication", date: "2021.07.08", title: "Joule 논문 게재", detail: "대면적 OPV 모듈 제작 공정 관련 연구가 Joule에 게재되었습니다." },
    { id: id(), type: "News", date: "2021.03.01", title: "울산대학교 유기전자물리 연구실 개설", detail: "울산대학교 자연과학대학에 유기전자물리 연구실(OEPL)이 개설되었습니다." },
    { id: id(), type: "Award", date: "2020.12.10", title: "ICSM 2020 Best Poster Award 수상", detail: "연구실 대학원생이 ICSM 2020 학술대회에서 Best Poster Award를 수상하였습니다." },
  ],
  publications: [
    pub(2023, 8, 15, "Journal", "17.38% Efficiency Organic Solar Cells via Non-fullerene Acceptor Engineering", "비풀러렌 억셉터 엔지니어링을 통한 17.38% 효율 유기태양전지", "S.U. Choi, J. Hong, K. Lee et al.", "Nature Energy", "https://doi.org/10.1038/example"),
    pub(2023, 3, 7, "Journal", "Energy Loss Analysis of High-Efficiency Organic Photovoltaics Using a Complete Analytical Framework", "완전 분석 프레임워크를 이용한 고효율 유기태양전지의 에너지 손실 분석", "S.U. Choi, H. Park, Y. Kim et al.", "Advanced Energy Materials", "https://doi.org/10.1002/example"),
    pub(2022, 11, 20, "Journal", "Semi-transparent Organic Solar Cells with Novel ITO-free Electrodes for Building-integrated Photovoltaics", "건물 일체형 광전지를 위한 ITO-free 전극 기반 반투명 유기태양전지", "J. Lee, S.U. Choi, M. Jung et al.", "ACS Energy Letters", "https://doi.org/10.1021/example"),
    pub(2022, 6, 3, "Journal", "π-Conjugated Small Molecule Donors for Efficient Organic Solar Cells: Molecular Design and Morphology Control", "고효율 유기태양전지를 위한 π-공액 소분자 도너: 분자 설계 및 모폴로지 제어", "S.U. Choi, C. Kang, S. Yoon et al.", "Chemistry of Materials", "https://doi.org/10.1021/example2"),
    pub(2021, 9, 14, "Journal", "Non-radiative Recombination Losses in Non-fullerene Organic Solar Cells: Quantification and Mitigation", "비풀러렌 유기태양전지의 비복사 재결합 손실 정량화 및 저감", "S.U. Choi, T. Kang, B. Lim et al.", "Joule", "https://doi.org/10.1016/example"),
    pub(2021, 5, 28, "Journal", "Morphology Evolution of Organic Solar Cells via Processing Additive: In-Situ GIWAXS Study", "공정 첨가제에 의한 유기태양전지 모폴로지 진화: In-Situ GIWAXS 연구", "Y. Shin, S.U. Choi, J. Heo et al.", "Nature Communications", "https://doi.org/10.1038/example2"),
    pub(2020, 10, 5, "Journal", "Charge Transport and Recombination Dynamics in High-Efficiency Organic Solar Cell Blends", "고효율 유기태양전지 블렌드의 전하 수송 및 재결합 동역학", "S.U. Choi, H. Jeon, M. Park et al.", "Advanced Functional Materials", "https://doi.org/10.1002/example2"),
    pub(2020, 4, 22, "Conference", "Complete Energy Loss Quantification in Organic Solar Cells from Optical Gap to Open-Circuit Voltage", "광학적 밴드갭부터 개방전압까지 유기태양전지의 완전 에너지 손실 정량화", "S.U. Choi et al.", "MRS Spring Meeting 2020", ""),
  ],
  gallery: [
    { id: id(), category: "Conference", title: "MRS Spring Meeting 2026 포스터 발표", date: "2026.04.10" },
    { id: id(), category: "Conference", title: "한국물리학회 봄 학술대회 구두 발표", date: "2026.04.22" },
    { id: id(), category: "Member", title: "2026년 2월 석사 학위 수여식", date: "2026.02.18" },
    { id: id(), category: "Member", title: "오준석 박사 졸업 및 취업 축하 송별회", date: "2026.02.10" },
    { id: id(), category: "Member", title: "겨울 연구실 MT — 강원도 평창", date: "2026.01.20" },
    { id: id(), category: "Member", title: "신입 연구원 환영회 및 오리엔테이션", date: "2026.03.05" },
    { id: id(), category: "Conference", title: "MRS Fall Meeting 2025 포스터 발표", date: "2025.11.28" },
    { id: id(), category: "Conference", title: "ICSM 2025 국제 학술대회 참가", date: "2025.10.14" },
    { id: id(), category: "Member", title: "2025년 8월 석·박사 학위 수여식", date: "2025.08.22" },
    { id: id(), category: "Member", title: "윤서연 박사 졸업 및 LG화학 입사 축하 송별회", date: "2025.08.15" },
    { id: id(), category: "Member", title: "여름 연구실 MT — 경남 거제", date: "2025.07.18" },
    { id: id(), category: "기타", title: "조신욱 교수 부임 7주년 기념 행사", date: "2025.09.01" },
    { id: id(), category: "Conference", title: "한국고분자학회 춘계 학술대회", date: "2025.04.25" },
    { id: id(), category: "Member", title: "2025년 2월 석사 학위 수여식", date: "2025.02.20" },
    { id: id(), category: "Member", title: "강태호 석사 졸업 및 SK하이닉스 입사 송별", date: "2025.02.12" },
    { id: id(), category: "Member", title: "겨울 연구실 MT — 전북 무주", date: "2025.01.17" },
    { id: id(), category: "기타", title: "KAIST·UNIST 공동 연구팀 교류 행사", date: "2024.11.05" },
    { id: id(), category: "Conference", title: "MRS Fall Meeting 2024 포스터 발표", date: "2024.11.25" },
  ],
  patents: [
    { id: id(), number: "US 7,935,961", title: "다층 바이폴라 전계효과 트랜지스터 및 그 제조 방법", titleEn: "Multi-layered bipolar field-effect transistor and method of manufacturing the same", date: "2011", status: "registered", inventors: "SY Lee, AJ Heeger, KH Lee, S Cho" },
    { id: id(), number: "US 8,552,421", title: "유기 미세전자 소자 및 그 제조 방법", titleEn: "Organic microelectronic device and fabrication method therefor", date: "2013", status: "registered", inventors: "SY Lee, S Cho, JY Lee, AJ Heeger" },
    { id: id(), number: "US 9,608,225", title: "발광 소자 및 그 제조 방법", titleEn: "Light emitting device and method of fabricating the same", date: "2017", status: "registered", inventors: "DH Kim, S Lee, K Lee, SH Park, S Cho, JK Lee, AJ Heeger" },
    { id: id(), number: "US 10,412,345", title: "Nhan 특허 — 유기태양전지용 계면층 소재 및 그 제조 방법", titleEn: "Nhan — Interfacial layer material for organic solar cell and method of manufacturing the same", date: "2019", status: "registered", inventors: "S Cho, Nhan, SY Lee, AJ Heeger" },
    { id: id(), number: "US 10,523,456", title: "MSM 특허 — MSM 구조 유기광전소자 및 그 제조 방법", titleEn: "MSM — Organic photovoltaic device with MSM structure and fabrication method therefor", date: "2021", status: "registered", inventors: "S Cho, SY Lee, AJ Heeger" },
  ],
  members: {
    professor: {
      nameKo: "조신욱 교수",
      nameEn: "Shin Uk Choi",
      affiliationKr: "울산대학교 공과대학 반도체물리공학과",
      affiliationEn: "Dept. of Semiconductor Physics Engineering, Univ. of Ulsan",
      email: "sucho@ulsan.ac.kr",
      scholar: "https://scholar.google.com",
      education: [
        tl("2000 – 2005", "서울대학교 물리학과 학사", "B.S. in Physics, Seoul National University"),
        tl("2005 – 2007", "서울대학교 물리학과 석사", "M.S. in Physics, Seoul National University"),
        tl("2007 – 2012", "서울대학교 물리학과 박사", "Ph.D. in Physics, Seoul National University"),
      ],
      career: [
        tl("2012 – 2015", "삼성전자 종합기술원 선임연구원", "Senior Researcher, Samsung Advanced Institute of Technology"),
        tl("2015 – 2018", "KAIST 물리학과 박사후연구원", "Postdoctoral Researcher, KAIST Dept. of Physics"),
        tl("2018 – 현재", "울산대학교 반도체물리공학과 교수", "Professor, Dept. of Semiconductor Physics Engineering, Univ. of Ulsan"),
      ],
      achievements: [
        tl("2023", "유기태양전지 효율 17.38% 달성 (세계 최고 수준)", "17.38% OPV Efficiency Achieved (World-Class Level)"),
        tl("2022", "국내 최초 완전한 에너지 손실 분석 시스템 구축", "First Complete Energy Loss Analysis System in Korea"),
        tl("2020", "한국연구재단 우수연구자 선정", "Selected as Outstanding Researcher by NRF Korea"),
      ],
    },
    postdocs: [
      { id: id(), nameKo: "홍길동", nameEn: "Hong Gil Dong", degree: "박사후연구원", email: "hgd@ulsan.ac.kr", fieldKr: "유기태양전지 효율 향상", fieldEn: "OPV Efficiency Enhancement" },
      { id: id(), nameKo: "김철수", nameEn: "Kim Chul Su", degree: "박사후연구원", email: "kcs@ulsan.ac.kr", fieldKr: "반투명 전극 소재", fieldEn: "Semi-transparent Electrode" },
      { id: id(), nameKo: "유나현", nameEn: "Yoo Na Hyeon", degree: "박사후연구원", email: "ynh@ulsan.ac.kr", fieldKr: "유기 소재 광물리", fieldEn: "Organic Material Photophysics" },
    ],
    gradStudents: [
      { id: id(), nameKo: "이영희", nameEn: "Lee Young Hee", degree: "박사과정", email: "lyh@ulsan.ac.kr", fieldKr: "유기 소재 합성", fieldEn: "Organic Material Synthesis" },
      { id: id(), nameKo: "박지민", nameEn: "Park Ji Min", degree: "박사과정", email: "pjm@ulsan.ac.kr", fieldKr: "소자 공정 개발", fieldEn: "Device Process Development" },
      { id: id(), nameKo: "최민준", nameEn: "Choi Min Jun", degree: "석사과정", email: "cmj@ulsan.ac.kr", fieldKr: "에너지 손실 분석", fieldEn: "Energy Loss Analysis" },
      { id: id(), nameKo: "정수빈", nameEn: "Jung Su Bin", degree: "석사과정", email: "jsb@ulsan.ac.kr", fieldKr: "광흡수 소재 연구", fieldEn: "Light-Absorbing Materials" },
      { id: id(), nameKo: "오민준", nameEn: "Oh Min Jun", degree: "석사과정", email: "omj@ulsan.ac.kr", fieldKr: "페로브스카이트 소재", fieldEn: "Perovskite Materials" },
      { id: id(), nameKo: "강하은", nameEn: "Kang Ha Eun", degree: "학부연구생", email: "khe@ulsan.ac.kr", fieldKr: "전하 이동 특성 분석", fieldEn: "Charge Transport Analysis" },
    ],
    phdAlumni: [
      { id: id(), nameKo: "오준석", nameEn: "Oh Jun Seok", degree: "박사과정", graduationDate: "2023-02-01" },
    ],
    msAlumni: [
      { id: id(), nameKo: "윤서연", nameEn: "Yoon Seo Yeon", degree: "석사과정", graduationDate: "2022-08-01" },
      { id: id(), nameKo: "강태호", nameEn: "Kang Tae Ho", degree: "석사과정", graduationDate: "2023-02-01" },
      { id: id(), nameKo: "임채원", nameEn: "Lim Chae Won", degree: "석사과정", graduationDate: "2022-02-01" },
      { id: id(), nameKo: "신예진", nameEn: "Shin Ye Jin", degree: "석사과정", graduationDate: "2021-08-01" },
      { id: id(), nameKo: "허준영", nameEn: "Heo Jun Young", degree: "석사과정", graduationDate: "2021-02-01" },
    ],
  },
};

export const STORAGE_KEY = "oepl-site-content";
export const PROFESSOR_STORAGE_KEY = "oepl-professor";

export function loadProfessor(): Professor {
  if (typeof window === "undefined") return seedContent.members.professor;
  try {
    const raw = localStorage.getItem(PROFESSOR_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Professor;
  } catch {
    /* ignore */
  }
  return seedContent.members.professor;
}

export function saveProfessorLocal(professor: Professor) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFESSOR_STORAGE_KEY, JSON.stringify(professor));
}

export function loadContent(): SiteContent {
  if (typeof window === "undefined") return seedContent;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const base = raw ? (JSON.parse(raw) as SiteContent) : seedContent;
    return {
      ...base,
      members: { ...base.members, professor: loadProfessor() },
    };
  } catch {
    return { ...seedContent, members: { ...seedContent.members, professor: loadProfessor() } };
  }
}

export function saveContent(content: SiteContent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function resetContent() {
  if (typeof window === "undefined") return seedContent;
  saveContent(seedContent);
  return seedContent;
}
