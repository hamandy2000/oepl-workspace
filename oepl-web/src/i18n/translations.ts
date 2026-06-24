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
    banner: string;
    label: string; title: string; more: string; readMore: string;
    colNo: string; colTitle: string; colDate: string;
    sortNewest: string; sortOldest: string;
    count: (n: number) => string;
    empty: string;
    backToList: string;
    notFound: string;
    loading: string;
    author: string;
    views: string;
    postedDate: string;
    defaultAuthor: string;
    attachments: string;
    noAttachments: string;
    download: string;
    prevPost: string;
    nextPost: string;
    noAdjacentPost: string;
    badgeNew: string;
    badgePinned: string;
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
    patentLabel: string; patentTitle: string;
    patentStatusRegistered: string; patentStatusPending: string;
    brand: {
      label: string;
      sectionTitle: string;
      tabs: { symbol: string; logo: string; signature: string; colors: string };
      previewBgLight: string;
      previewBgDark: string;
      downloadPng: string;
      downloadAi: string;
      aiDownload: string;
      symbol: {
        enTitle: string;
        krTitle: string;
        paragraphs: string[];
        assets: { png: string };
      };
      logo: {
        enTitle: string;
        krTitle: string;
        paragraphs: string[];
        assets: { png: string };
      };
      signature: {
        enTitle: string;
        krTitle: string;
        paragraphs: string[];
        assets: { png: string };
      };
      colors: {
        enTitle: string;
        krTitle: string;
        paragraphs: string[];
        assets: { png: string };
      };
    };
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
  contact: {
    label: string; title: string; heading: string;
    addressLabel: string; address: string; addressEn: string;
    phoneLabel: string; emailLabel: string; hoursLabel: string; hours: string;
    copySuccess: string;
  };
  login: {
    banner: string; heading: string; desc: string;
    idLabel: string; passwordLabel: string;
    idPlaceholder: string; passwordPlaceholder: string;
    emailLabel: string; emailPlaceholder: string;
    submit: string; backHome: string; error: string;
  };
  admin: {
    title: string;
    dashboard: string;
    dashboardDesc: string;
    members: string;
    publications: string;
    news: string;
    gallery: string;
    patents: string;
    add: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    saved: string;
    confirmDelete: string;
    colNo: string;
    colTitle: string;
    colDate: string;
    searchPlaceholder: string;
    searchResult: (n: number) => string;
    logout: string;
    viewSite: string;
    saving: string;
    pinned: string;
    noticeSetting: string;
    noticeOff: string;
    noticePinned: string;
  };
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
    banner: "News",
    label: "Latest News",
    title: "OEPL의 최근 소식",
    more: "더보기",
    readMore: "자세히 보기",
    colNo: "번호",
    colTitle: "제목",
    colDate: "날짜",
    sortNewest: "최신순",
    sortOldest: "오래된순",
    count: (n) => `${n}개 소식`,
    empty: "등록된 소식이 없습니다.",
    backToList: "목록으로",
    notFound: "소식을 찾을 수 없습니다.",
    loading: "불러오는 중…",
    author: "작성자",
    views: "조회",
    postedDate: "작성일",
    defaultAuthor: "관리자",
    attachments: "첨부파일",
    noAttachments: "첨부 파일이 없습니다",
    download: "다운로드",
    prevPost: "이전글",
    nextPost: "다음글",
    noAdjacentPost: "글이 없습니다",
    badgeNew: "NEW",
    badgePinned: "공지",
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
    patentLabel: "Patents",
    patentTitle: "특허 소개",
    patentStatusRegistered: "등록",
    patentStatusPending: "출원",
    brand: {
      label: "Brand Identity",
      sectionTitle: "연구실 CI 소개",
      tabs: { symbol: "심볼마크", logo: "로고마크", signature: "시그니처", colors: "전용색상" },
      previewBgLight: "흰 배경",
      previewBgDark: "검은 배경",
      downloadPng: "PNG 다운로드",
      downloadAi: "AI 다운로드",
      aiDownload: "/brand/oepl_logo_download.ai",
      symbol: {
        enTitle: "Symbol Mark",
        krTitle: "심볼마크",
        paragraphs: [
          "OEPL 심볼마크는 벤젠 고리(유기분자·π-공액 구조)와 나뭇잎(친환경·지속가능 에너지), 두 개의 궤도 고리(전자물리·에너지 연구)를 결합한 그래픽 문양입니다.",
          "유기전자물리 연구실의 학문적 정체성과 친환경 에너지 기술에 대한 비전을 동시에 전달합니다. 공식 행사, 포스터, 발표 자료 등에서 심볼마크 단독 또는 로고마크와 함께 사용할 수 있으며, 비율·색상·여백을 임의로 변경하지 않도록 해 주세요.",
        ],
        assets: { png: "/brand/oepl-symbol.png" },
      },
      logo: {
        enTitle: "Logo Mark",
        krTitle: "로고마크",
        paragraphs: [
          "로고마크는 OEPL 워드마크와 영문 풀네임(Organic Electronic Physics Laboratory)을 조합한 공식 타이포 표기입니다.",
          "웹사이트, 명함, 보도자료 등 연구실명과 함께 브랜드를 전달해야 하는 경우 로고마크 사용을 권장합니다. 어두운 배경 위 사용을 기본으로 합니다.",
        ],
        assets: { png: "/brand/oepl-logo-mark.png" },
      },
      signature: {
        enTitle: "Signature",
        krTitle: "시그니처",
        paragraphs: [
          "시그니처는 심볼마크와 로고마크를 가로로 조합한 공식 CI 조합형입니다.",
          "연구실을 대표하는 공식 문서, 배너, 홈페이지 등에서 심볼과 로고를 함께 사용할 때 시그니처를 사용합니다. 요소 간 간격과 비율을 임의로 변경하지 않도록 해 주세요.",
        ],
        assets: { png: "/brand/oepl-signature.png" },
      },
      colors: {
        enTitle: "Brand Colors",
        krTitle: "전용색상",
        paragraphs: [
          "OEPL 전용색상은 `src/styles/tokens.json`과 `globals.css`에 정의된 디자인 토큰 팔레트입니다. Brand Amber(`--color-brand`)는 심볼·강조 요소에, Neutral 900(`--color-neutral-900`)은 페이지·배너 배경에 사용합니다.",
        ],
        assets: { png: "/brand/oepl-brand-colors.png" },
      },
    },
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
    degreeMap: { "박사과정": "박사과정", "석사과정": "석사과정", "박사 후 연구원": "박사 후 연구원", "박사후연구원": "박사 후 연구원" },
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
  contact: {
    label: "Contact Us", title: "연락처", heading: "Contact Us",
    addressLabel: "주소",
    address: "(44610) 울산광역시 남구 대학로 93, 울산대학교 자연과학대학 8호관 8-224호 / 8-228호",
    addressEn: "(44610) Room 8-224 / 8-228, Building 8, College of Natural Sciences, Ulsan University,\n93, Daehak-ro, Nam-gu, Ulsan, Republic of Korea",
    phoneLabel: "전화",
    emailLabel: "이메일",
    hoursLabel: "운영 시간",
    hours: "평일 09:00 – 18:00",
    copySuccess: "복사됨",
  },
  login: {
    banner: "Login",
    heading: "연구실 관리자 로그인",
    desc: "연구실 구성원 전용 페이지입니다.",
    idLabel: "아이디",
    passwordLabel: "비밀번호",
    idPlaceholder: "아이디를 입력하세요",
    passwordPlaceholder: "비밀번호를 입력하세요",
    emailLabel: "이메일",
    emailPlaceholder: "admin@example.com",
    submit: "로그인",
    backHome: "홈으로 돌아가기",
    error: "아이디 또는 비밀번호가 올바르지 않습니다.",
  },
  admin: {
    title: "관리자 페이지",
    dashboard: "대시보드",
    dashboardDesc: "콘텐츠를 관리하려면 아래 메뉴를 선택하세요.",
    members: "멤버",
    publications: "논문",
    news: "뉴스",
    gallery: "갤러리",
    patents: "특허",
    add: "추가",
    edit: "수정",
    delete: "삭제",
    save: "저장",
    cancel: "취소",
    saved: "저장되었습니다.",
    confirmDelete: "삭제하시겠습니까?",
    colNo: "번호",
    colTitle: "제목",
    colDate: "날짜",
    searchPlaceholder: "검색…",
    searchResult: (n) => `검색 결과 ${n}건`,
    logout: "로그아웃",
    viewSite: "사이트 보기 →",
    saving: "저장 중…",
    pinned: "공지",
    noticeSetting: "공지 설정",
    noticeOff: "설정 안함",
    noticePinned: "상단 고정",
  },
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
    banner: "News",
    label: "Latest News",
    title: "Latest from OEPL",
    more: "More",
    readMore: "Read more",
    colNo: "No.",
    colTitle: "Title",
    colDate: "Date",
    sortNewest: "Newest",
    sortOldest: "Oldest",
    count: (n) => `${n} item${n !== 1 ? "s" : ""}`,
    empty: "No news items yet.",
    backToList: "Back to list",
    notFound: "News item not found.",
    loading: "Loading…",
    author: "Author",
    views: "Views",
    postedDate: "Posted",
    defaultAuthor: "Admin",
    attachments: "Attachments",
    noAttachments: "No attachments",
    download: "Download",
    prevPost: "Previous",
    nextPost: "Next",
    noAdjacentPost: "No post",
    badgeNew: "NEW",
    badgePinned: "Notice",
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
    patentLabel: "Patents",
    patentTitle: "Patents",
    patentStatusRegistered: "Registered",
    patentStatusPending: "Pending",
    brand: {
      label: "Brand Identity",
      sectionTitle: "Lab CI Guide",
      tabs: { symbol: "Symbol Mark", logo: "Logo Mark", signature: "Signature", colors: "Brand Colors" },
      previewBgLight: "Light",
      previewBgDark: "Dark",
      downloadPng: "Download PNG",
      downloadAi: "Download AI",
      aiDownload: "/brand/oepl_logo_download.ai",
      symbol: {
        enTitle: "Symbol Mark",
        krTitle: "Symbol Mark",
        paragraphs: [
          "The OEPL symbol combines a benzene ring (organic molecules and π-conjugation), a leaf (eco-friendly and sustainable energy), and two orbital rings (electronic physics and energy research).",
          "It conveys both our scientific identity and our vision for green energy technology. Use it alone or with the logo mark on posters and official materials. Do not alter proportions, colors, or clear space.",
        ],
        assets: { png: "/brand/oepl-symbol.png" },
      },
      logo: {
        enTitle: "Logo Mark",
        krTitle: "Logo Mark",
        paragraphs: [
          "The logo mark is the official typographic lockup of the OEPL wordmark and full name (Organic Electronic Physics Laboratory).",
          "Use the logo mark when the lab name and brand should appear together — on websites, business cards, and press materials. Dark backgrounds are preferred.",
        ],
        assets: { png: "/brand/oepl-logo-mark.png" },
      },
      signature: {
        enTitle: "Signature",
        krTitle: "Signature",
        paragraphs: [
          "The signature combines the symbol mark and logo mark in a horizontal lockup.",
          "Use the signature on official documents, banners, and the homepage when both the symbol and logo should appear together. Do not alter spacing or proportions.",
        ],
        assets: { png: "/brand/oepl-signature.png" },
      },
      colors: {
        enTitle: "Brand Colors",
        krTitle: "Brand Colors",
        paragraphs: [
          "OEPL brand colors come from the design tokens in `src/styles/tokens.json` and `globals.css`. Brand Amber (`--color-brand`) is used for symbols and accents; Neutral 900 (`--color-neutral-900`) for page and banner backgrounds.",
        ],
        assets: { png: "/brand/oepl-brand-colors.png" },
      },
    },
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
    degreeMap: { "박사과정": "Ph.D Student", "석사과정": "M.S Student", "박사 후 연구원": "Postdoc", "박사후연구원": "Postdoc" },
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
  contact: {
    label: "Contact Us", title: "Contact", heading: "Contact Us",
    addressLabel: "Address",
    address: "(44610) 울산광역시 남구 대학로 93, 울산대학교 자연과학대학 8호관 8-224호 / 8-228호",
    addressEn: "(44610) Room 8-224 / 8-228, Building 8, College of Natural Sciences, Ulsan University,\n93, Daehak-ro, Nam-gu, Ulsan, Republic of Korea",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Hours",
    hours: "Mon – Fri, 09:00 – 18:00",
    copySuccess: "Copied",
  },
  login: {
    banner: "Login",
    heading: "Lab Admin Login",
    desc: "This page is for lab members only.",
    idLabel: "Username",
    passwordLabel: "Password",
    idPlaceholder: "Enter your username",
    passwordPlaceholder: "Enter your password",
    emailLabel: "Email",
    emailPlaceholder: "admin@example.com",
    submit: "Log in",
    backHome: "Back to home",
    error: "Invalid username or password.",
  },
  admin: {
    title: "Admin Page",
    dashboard: "Dashboard",
    dashboardDesc: "Select a section below to manage site content.",
    members: "Members",
    publications: "Publications",
    news: "News",
    gallery: "Gallery",
    patents: "Patents",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    saved: "Saved.",
    confirmDelete: "Delete this item?",
    colNo: "No.",
    colTitle: "Title",
    colDate: "Date",
    searchPlaceholder: "Search…",
    searchResult: (n) => `${n} result${n === 1 ? "" : "s"}`,
    logout: "Log out",
    viewSite: "View site →",
    saving: "Saving…",
    pinned: "Notice",
    noticeSetting: "Notice",
    noticeOff: "None",
    noticePinned: "Pin to top",
  },
};

export const translations: Record<Lang, Translations> = { KR, EN };
