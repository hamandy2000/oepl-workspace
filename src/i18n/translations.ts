export type Lang = "KR" | "EN";

export interface Translations {
  header: { login: string };
  hero: { subtitle: string; title: string; desc: string; btn1: string; btn2: string };
  intro: {
    label: string; title: string; tagline: string;
    p1: string; p2: string; p3: string;
    btn1: string; btn2: string;
    stats: Array<{ value: string; label: string }>;
  };
  focus: {
    label: string; title: string;
    items: Array<{ title: string; enTitle: string; desc: string }>;
  };
  research: {
    label: string; title: string; more: string;
    items: Array<{ tag: string; title: string; desc: string }>;
  };
  news: {
    label: string; title: string; more: string; readMore: string;
    items: Array<{ badge: string; date: string; title: string; excerpt: string }>;
  };
  publications: { label: string; title: string; more: string };
  footer: {
    columns: Record<string, string[]>;
    copyright: string; contactUs: string; bizNum: string;
  };
  about: {
    banner: string; greetingLabel: string; greetingTitle: string;
    greetingPs: string[]; researchLabel: string; researchTitle: string;
    profPhoto: string;
    areas: Array<{ tag: string; title: string; desc: string }>;
  };
  members: {
    banner: string;
    professorLabel: string; professorTitle: string;
    educationLabel: string; careerLabel: string; achievementsLabel: string;
    postdocLabel: string; postdocTitle: string;
    gradLabel: string; gradTitle: string;
    phdAlumniLabel: string; phdAlumniTitle: string;
    msAlumniLabel: string; msAlumniTitle: string;
    photo: string;
    degreeMap: Record<string, string>;
  };
  publication: {
    banner: string; yearAll: string;
    count: (n: number) => string;
    sortNewest: string; sortOldest: string;
    noResults: string;
  };
  gallery: {
    banner: string;
    categoryLabels: Record<string, string>;
    count: (n: number) => string;
    empty: string;
  };
  contact: { label: string; title: string };
}

const KR: Translations = {
  header: { login: "로그인" },
  hero: {
    subtitle: "Organic Electronic Physics Laboratory",
    title: "유기전자물리 연구실",
    desc: "유기전자물리 연구실에서는 유기반도체를 이용한 전자 소자를 개발하는 연구를 진행하고 있습니다. 특히 유기태양전지 개발에 집중하며, 세계 최고 수준의 효율 달성을 목표로 합니다.",
    btn1: "연구 분야 보기",
    btn2: "논문 목록",
  },
  intro: {
    label: "About Our Lab",
    title: "OEPL 연구실 소개",
    tagline: "빛을 에너지로, 연구를 미래로.",
    p1: "안녕하십니까. 유기전자물리 연구실 OEPL입니다. OEPL은 유기반도체 기반의 차세대 에너지·전자소자 기술을 연구하며, 지속 가능한 미래를 위한 혁신적인 유기태양전지 개발에 함께하고 있습니다.",
    p2: "유기반도체는 탄소와 수소원자를 기반으로 단일 결합과 이중결합의 교차가 연속적으로 이루어진 π-공액 구조를 가진 유기 분자 소재입니다. 이러한 특성 덕분에 유연하고 가벼운 차세대 전자 소자 구현이 가능합니다.",
    p3: "저희 연구실은 유기태양전지(OPV) 효율 향상을 위한 소재·공정·소자 연구를 체계적으로 수행하고 있으며, 국내외 선도 연구 기관과의 협력을 통해 세계 최고 수준의 연구 성과를 목표로 합니다.",
    btn1: "연구 소개 보기",
    btn2: "구성원 소개",
    stats: [
      { value: "17.38%", label: "유기태양전지 최고 효율" },
      { value: "50+",    label: "국제 저널 논문" },
      { value: "10+",    label: "국내외 협력 기관" },
      { value: "2015",   label: "연구실 설립 연도" },
    ],
  },
  focus: {
    label: "What We Do",
    title: "Our Focus",
    items: [
      { title: "유기 소재",    enTitle: "Organic Materials",   desc: "차세대 유기전자 소자를 위한 π-공액 분자 소재 설계 및 합성 연구" },
      { title: "소자 공학",    enTitle: "Device Engineering",  desc: "고성능 유기전자 소자 및 광전 변환 소자 제작 공정 연구" },
      { title: "지속가능 에너지", enTitle: "Sustainable Energy", desc: "혁신적인 OPV 기술로 태양광을 청정 에너지로 전환하는 연구" },
      { title: "연구 성과",    enTitle: "Impact",              desc: "과학과 글로벌 협력을 통한 실질적인 연구 성과 창출" },
    ],
  },
  research: {
    label: "About our Research",
    title: "연구 분야 소개",
    more: "더보기",
    items: [
      { tag: "고효율 소자",  title: "고성능 태양전지 연구",                    desc: "유기태양전지를 이용한 고성능 태양전지 개발 및 분석 연구" },
      { tag: "투명 전극",    title: "(반)투명 전극 및\n유기 태양전지 연구",    desc: "반투명 전극 소재 개발" },
      { tag: "소재 개발",    title: "(반)투명 전극 및\n유기 태양전지 연구",    desc: "차세대 유기 소재 연구" },
      { tag: "분석 시스템",  title: "(반)투명 전극 및\n유기 태양전지 연구",    desc: "에너지 손실 분석 시스템" },
      { tag: "공동 연구",    title: "(반)투명 전극 및\n유기 태양전지 연구",    desc: "KAIST·UNIST 협력 연구" },
    ],
  },
  news: {
    label: "Latest News",
    title: "OEPL의 최근 소식",
    more: "더보기",
    readMore: "자세히 보기",
    items: [
      { badge: "News",        date: "2023.05.07", title: "OEPL 홈페이지 개설!",                  excerpt: "OEPL이 드디어 홈페이지를 새로 개설하였습니다. 앞으로 많은 관심 부탁드립니다." },
      { badge: "Research",    date: "2023.04.15", title: "유기태양전지 효율 17.38% 달성",         excerpt: "유기태양전지 효율 세계 최고 수준에 근접하는 17.38% 효율 달성 성과를 발표하였습니다." },
      { badge: "Award",       date: "2023.03.20", title: "국내외 공동연구 협약 체결",             excerpt: "KAIST·UNIST·재료연구소·에너지생산기술연구소와 공동 연구 협약을 체결하였습니다." },
      { badge: "Publication", date: "2023.02.10", title: "Nature Communications 논문 게재",      excerpt: "유기광전자 소자 분야 세계적 저널인 Nature Communications에 논문이 게재되었습니다." },
    ],
  },
  publications: { label: "Research Output", title: "최근 논문", more: "더보기" },
  footer: {
    columns: {
      "연구실": ["연구실 소개", "교수 소개", "연구원 소개", "졸업생"],
      "연구":   ["유기 소재", "소자 공학", "유기태양전지", "에너지 분석"],
      "정보":   ["논문 목록", "최근 소식", "갤러리", "Contact"],
    },
    copyright: "Copyright © Ulsan University OEPL Lab all right reserved ㅣ Designed by Haminji",
    contactUs: "Contact Us",
    bizNum: "사업자등록번호: 206-82-07306",
  },
  about: {
    banner: "About",
    greetingLabel: "인사말",
    greetingTitle: "빛을 에너지로,\n연구를 미래로.",
    greetingPs: [
      "안녕하십니까. 유기전자물리 연구실 OEPL입니다. OEPL은 유기반도체 기반의 차세대 에너지·전자소자 기술을 연구하며, 지속가능한 미래를 위한 혁신적인 유기태양전지 개발에 함께하고 있습니다.",
      "창의적인 연구와 활발한 협력을 바탕으로 세계 최고 수준의 연구 성과를 창출하며, 에너지 기술의 새로운 가능성을 열어가는 것을 목표로 하고 있습니다.",
      "유기반도체는 탄소와 수소원자를 기반으로 단일 결합과 이중결합의 교차가 연속적으로 구성되는 파이 결합 분자 또는 중합체(고분자)에 의해 만들어진 고체를 말합니다. 파이 결합 고분자는 화학 구조 변환을 통해 쉽게 밴드갭을 조절할 수 있어 반도체로도 역할을 합니다.",
      "유기전자물리 연구실에서는 유기반도체를 이용하여 전자 소자를 개발하는 연구를 진행하고 있습니다. 특히 유기태양전지 개발에 집중하고 있으며, 국내 여러 대학 및 정부출연연구소와 공동 연구를 진행하고 있습니다.",
    ],
    researchLabel: "About our Research",
    researchTitle: "연구 분야 소개",
    profPhoto: "교수님 사진",
    areas: [
      { tag: "고효율 소자",  title: "고성능 태양전지 연구",               desc: "유기태양전지를 이용한 고성능 태양전지 개발 및 분석 연구. 공인된 세계 최고 효율 17.5%에 근접하는 17.38%의 효율을 달성하였습니다." },
      { tag: "투명 전극",    title: "(반)투명 전극 및 유기태양전지 연구", desc: "반투명 유기태양전지를 위한 차세대 전극 소재 및 구조 개발 연구를 진행하고 있습니다." },
      { tag: "소재 개발",    title: "차세대 유기 소재 연구",               desc: "π-공액 분자 및 고분자 소재 합성을 통한 차세대 유기전자 소자용 핵심 소재 개발 연구입니다." },
      { tag: "에너지 분석",  title: "에너지 손실 분석 시스템",             desc: "국내 유일의 완전한 형태의 유기태양전지 에너지 손실 분석 시스템을 독자적으로 구축하였습니다." },
      { tag: "공동 연구",    title: "국내외 협력 연구",                     desc: "KAIST, UNIST, 재료연구소, 에너지생산기술연구소 등 국내 주요 기관과 공동 연구를 진행합니다." },
    ],
  },
  members: {
    banner: "Members",
    professorLabel: "Professor",
    professorTitle: "교수 소개",
    educationLabel: "학력",
    careerLabel: "주요 경력",
    achievementsLabel: "주요 실적",
    postdocLabel: "Post Doctoral Researchers",
    postdocTitle: "박사 후 연구원",
    gradLabel: "Graduate Students",
    gradTitle: "대학원 연구원",
    phdAlumniLabel: "Alumni · Ph.D",
    phdAlumniTitle: "졸업생 소개 · Ph.D 과정",
    msAlumniLabel: "Alumni · M.S",
    msAlumniTitle: "졸업생 소개 · M.S 과정",
    photo: "사진",
    degreeMap: { "박사과정": "박사과정", "석사과정": "석사과정", "박사후연구원": "박사후연구원", "학부연구생": "학부연구생" },
  },
  publication: {
    banner: "Publication",
    yearAll: "전체",
    count: (n) => `${n}개 논문`,
    sortNewest: "최신순",
    sortOldest: "오래된순",
    noResults: "해당 조건의 논문이 없습니다.",
  },
  gallery: {
    banner: "Gallery",
    categoryLabels: { "전체": "전체", "Member": "Member", "Conference": "Conference", "기타": "기타" },
    count: (n) => `${n}개 행사`,
    empty: "해당 카테고리의 행사가 없습니다.",
  },
  contact: { label: "Contact Us", title: "연락처" },
};

const EN: Translations = {
  header: { login: "Log in" },
  hero: {
    subtitle: "Organic Electronic Physics Laboratory",
    title: "Organic Electronic\nPhysics Lab",
    desc: "We develop electronic devices using organic semiconductors, with a special focus on organic solar cells. Our goal is to achieve world-class efficiency and drive next-generation energy technology.",
    btn1: "Our Research",
    btn2: "Publications",
  },
  intro: {
    label: "About Our Lab",
    title: "About OEPL",
    tagline: "Light into Energy, Research into the Future.",
    p1: "Welcome to OEPL — Organic Electronic Physics Laboratory. We research next-generation energy and electronic device technologies based on organic semiconductors, working toward innovative organic solar cell development for a sustainable future.",
    p2: "Organic semiconductors are organic molecular materials with a π-conjugated structure formed by alternating single and double bonds of carbon and hydrogen atoms. This enables flexible, lightweight next-generation electronic devices.",
    p3: "Our lab systematically conducts material, process, and device research to improve organic photovoltaic (OPV) efficiency, aiming for world-leading research outcomes in collaboration with top institutions.",
    btn1: "Our Research",
    btn2: "Members",
    stats: [
      { value: "17.38%", label: "OPV Record Efficiency" },
      { value: "50+",    label: "Journal Publications" },
      { value: "10+",    label: "Partner Institutions" },
      { value: "2015",   label: "Year Founded" },
    ],
  },
  focus: {
    label: "What We Do",
    title: "Our Focus",
    items: [
      { title: "Organic Materials",   enTitle: "Organic Materials",   desc: "Design and synthesis of π-conjugated molecular materials for next-generation organic electronic devices" },
      { title: "Device Engineering",  enTitle: "Device Engineering",  desc: "Fabrication processes for high-performance organic electronic and photoconversion devices" },
      { title: "Sustainable Energy",  enTitle: "Sustainable Energy",  desc: "Converting solar light into clean energy through innovative OPV technology" },
      { title: "Research Impact",     enTitle: "Impact",              desc: "Creating tangible research outcomes through science and global collaboration" },
    ],
  },
  research: {
    label: "About our Research",
    title: "Research Areas",
    more: "More",
    items: [
      { tag: "High Efficiency",      title: "High-Performance Solar Cell Research",                desc: "Development and analysis of high-performance solar cells using organic photovoltaics" },
      { tag: "Transparent Electrode", title: "(Semi-)Transparent Electrode &\nOPV Research",      desc: "Semi-transparent electrode material development" },
      { tag: "Materials",             title: "(Semi-)Transparent Electrode &\nOPV Research",      desc: "Next-generation organic material research" },
      { tag: "Analysis System",       title: "(Semi-)Transparent Electrode &\nOPV Research",      desc: "Energy loss analysis system" },
      { tag: "Collaboration",         title: "(Semi-)Transparent Electrode &\nOPV Research",      desc: "KAIST·UNIST collaborative research" },
    ],
  },
  news: {
    label: "Latest News",
    title: "Latest from OEPL",
    more: "More",
    readMore: "Read more",
    items: [
      { badge: "News",        date: "2023.05.07", title: "OEPL Website Launched!",              excerpt: "OEPL has finally launched its new website. We look forward to your continued interest and support." },
      { badge: "Research",    date: "2023.04.15", title: "17.38% OPV Efficiency Achieved",      excerpt: "We announced achieving 17.38% efficiency in organic solar cells, approaching the world-record level." },
      { badge: "Award",       date: "2023.03.20", title: "Joint Research Agreements Signed",    excerpt: "Collaborative agreements were signed with KAIST, UNIST, KIMS, and KIER." },
      { badge: "Publication", date: "2023.02.10", title: "Paper in Nature Communications",      excerpt: "Our research paper in organic optoelectronics was published in Nature Communications." },
    ],
  },
  publications: { label: "Research Output", title: "Recent Publications", more: "More" },
  footer: {
    columns: {
      "Lab":      ["About",   "Professor", "Researchers", "Alumni"],
      "Research": ["Organic Materials", "Device Engineering", "Organic Solar Cell", "Energy Analysis"],
      "Info":     ["Publications", "News", "Gallery", "Contact"],
    },
    copyright: "Copyright © Ulsan University OEPL Lab all right reserved ㅣ Designed by Haminji",
    contactUs: "Contact Us",
    bizNum: "Biz Reg. No.: 206-82-07306",
  },
  about: {
    banner: "About",
    greetingLabel: "Greeting",
    greetingTitle: "Light into Energy,\nResearch into the Future.",
    greetingPs: [
      "Welcome to OEPL — Organic Electronic Physics Laboratory. We research next-generation energy and electronic device technologies based on organic semiconductors, working toward innovative organic solar cell development for a sustainable future.",
      "Our goal is to generate world-leading research outcomes through creative research and active collaboration, opening new possibilities in energy technology.",
      "Organic semiconductors are solids formed by π-conjugated molecules or polymers whose structure is built from alternating single and double bonds of carbon and hydrogen atoms. These polymers can tune the bandgap through chemical structural transformation, functioning as semiconductors.",
      "OEPL develops electronic devices using organic semiconductors, with a particular focus on organic solar cells. We actively collaborate with multiple universities and government-funded research institutes.",
    ],
    researchLabel: "About our Research",
    researchTitle: "Research Areas",
    profPhoto: "Professor Photo",
    areas: [
      { tag: "High Efficiency",      title: "High-Performance Solar Cell Research",        desc: "Development and analysis of high-performance solar cells using organic photovoltaics, achieving 17.38% efficiency approaching the certified world record of 17.5%." },
      { tag: "Transparent Electrode", title: "(Semi-)Transparent Electrode and OPV",       desc: "Research on next-generation electrode materials and structures for semi-transparent organic solar cells." },
      { tag: "Materials Development", title: "Next-Gen Organic Materials Research",        desc: "Development of key materials for next-generation organic electronic devices through synthesis of π-conjugated molecules and polymers." },
      { tag: "Energy Analysis",       title: "Energy Loss Analysis System",                desc: "We have independently built the only complete organic solar cell energy loss analysis system in Korea." },
      { tag: "Collaboration",         title: "Domestic & International Collaboration",     desc: "We conduct joint research with major institutions including KAIST, UNIST, KIMS, and KIER." },
    ],
  },
  members: {
    banner: "Members",
    professorLabel: "Professor",
    professorTitle: "Professor",
    educationLabel: "Education",
    careerLabel: "Career",
    achievementsLabel: "Achievements",
    postdocLabel: "Post Doctoral Researchers",
    postdocTitle: "Post-Doctoral Researchers",
    gradLabel: "Graduate Students",
    gradTitle: "Graduate Researchers",
    phdAlumniLabel: "Alumni · Ph.D",
    phdAlumniTitle: "Alumni · Ph.D Program",
    msAlumniLabel: "Alumni · M.S",
    msAlumniTitle: "Alumni · M.S Program",
    photo: "Photo",
    degreeMap: { "박사과정": "Ph.D Student", "석사과정": "M.S Student", "박사후연구원": "Postdoc", "학부연구생": "Undergrad" },
  },
  publication: {
    banner: "Publication",
    yearAll: "All",
    count: (n) => `${n} paper${n !== 1 ? "s" : ""}`,
    sortNewest: "Newest",
    sortOldest: "Oldest",
    noResults: "No papers found.",
  },
  gallery: {
    banner: "Gallery",
    categoryLabels: { "전체": "All", "Member": "Member", "Conference": "Conference", "기타": "Other" },
    count: (n) => `${n} event${n !== 1 ? "s" : ""}`,
    empty: "No events in this category.",
  },
  contact: { label: "Contact Us", title: "Contact" },
};

export const translations: Record<Lang, Translations> = { KR, EN };
