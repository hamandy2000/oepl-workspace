/** UI 문구 사전 — 한국어/영어 번역 테이블 */

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
    columns: Record<string, { label: string; href: string }[]>;
    copyright: string; contactUs: string; bizNum: string;
  };
  about: {
    banner: string; greetingLabel: string; greetingTitle: string;
    greetingPs: string[]; researchLabel: string; researchTitle: string;
    profPhoto: string;
    areas: Array<{ tag: string; title: string; desc: string; detail: string }>;
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
    careerLabel: string;
    postdocLabel: string; postdocTitle: string;
    gradLabel: string; gradTitle: string;
    phdAlumniLabel: string; phdAlumniTitle: string;
    msAlumniLabel: string; msAlumniTitle: string;
    photo: string;
    degreeMap: Record<string, string>;
    loading: string;
  };
  publication: {
    banner: string; yearAll: string;
    count: (n: number) => string;
    sortNewest: string; sortOldest: string;
    noResults: string;
    loading: string;
  };
  gallery: {
    banner: string;
    categoryLabels: Record<string, string>;
    count: (n: number) => string;
    empty: string;
    loading: string;
  };
  contact: {
    label: string; banner: string; title: string; heading: string;
    addressLabel: string; address: string; addressEn: string;
    phoneLabel: string; emailLabel: string; hoursLabel: string; hours: string;
    copySuccess: string;
  };
  login: {
    banner: string; heading: string; desc: string;
    passwordLabel: string; passwordPlaceholder: string;
    emailLabel: string; emailPlaceholder: string;
    submit: string; backHome: string; error: string;
  };
  notFoundPage: {
    title: string;
    titleEn: string;
    desc: string;
    descEn: string;
    backHome: string;
  };
  admin: {
    title: string;
    titleEn: string;
    dashboard: string;
    dashboardDesc: string;
    dashboardDescEn: string;
    members: string;
    publications: string;
    news: string;
    gallery: string;
    patents: string;
    navEn: {
      dashboard: string;
      members: string;
      publications: string;
      news: string;
      gallery: string;
      patents: string;
    };
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
    subtitle: "Organic Electronic Physics Labotory",
    title: "OEPL 유기전자물리 연구실",
    desc: "유기전자물리 연구실에서는 유기반도체를 이용한 전자 소자를 개발하는 연구를 진행하고 있습니다. 특히 유기태양전지 개발에 집중하며, 세계 최고 수준의 효율 달성을 목표로 합니다.",
    btn1: "연구 분야 보기",
    btn2: "논문 보기",
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
      { title: "첨단 소재",    enTitle: "Advanced Materials",   desc: "차세대 전자기기를 위한 기능성 소재 연구" },
      { title: "소자 공학",    enTitle: "Device Engineering",  desc: "고성능 소자 구조 및 공정 기술 연구" },
      { title: "첨단 분석", enTitle: "Advanced Characterization", desc: "전하 수송 및 소자 동작 메커니즘 연구" },
      { title: "광전기", enTitle: "Photovoltaics", desc: "고효율 에너지 변환 및 응용 연구" },
    ],
  },
  research: {
    label: "About our Research",
    title: "연구 분야 소개",
    more: "더보기",
    items: [
      { tag: "OSCs",  title: "유기태양전지", desc: "경량·유연·용액공정 유기태양전지 소재·소자 및 고효율화 연구" },
      { tag: "PSCs",  title: "페로브스카이트 태양전지", desc: "고효율 페로브스카이트 태양전지 소재·소자 및 성능 분석 연구" },
      { tag: "OFETs", title: "유기 전계효과 트랜지스터", desc: "유기 전계효과 트랜지스터 소재·소자 특성 연구" },
      { tag: "Metal Ink", title: "금속 잉크", desc: "전극·회로 형성을 위한 금속 MOD 잉크 소재 개발" },
      { tag: "ELA", title: "에너지 손실 분석", desc: "유기태양전지 에너지 손실 메커니즘 분석 및 효율 향상 연구" },
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
      "col1": [
        { label: "연구실 소개", href: "/about" },
        { label: "교수 소개", href: "/members#professor" },
        { label: "연구원 소개", href: "/members#researchers" },
      ],
      "col2": [
        { label: "논문 목록", href: "/publication" },
        { label: "최근 소식", href: "/news" },
        { label: "갤러리", href: "/gallery" },
      ],
      "col3": [{ label: "Contact", href: "/contact" }],
    },
    copyright: "Copyright © Ulsan University OEPL Lab all right reserved ㅣ Designed by Haminji",
    contactUs: "Contact Us",
    bizNum: "사업자등록번호: 206-82-07306",
  },
  about: {
    banner: "Research",
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
    profPhoto: "사진",
    areas: [
      {
        tag: "OSCs",
        title: "유기태양전지",
        desc: "경량·유연·용액공정 유기태양전지 소재·소자 및 고효율화 연구",
        detail:
          "유기태양전지(OSC)는 경량, 기계적 유연성, 용액 공정성으로 차세대 광전 기술로 주목받고 있습니다. 소자 물리와 계면 공학에 중점을 두고, 전하 생성·전달·추출 및 에너지 손실 메커니즘을 규명하여 고효율·고안정 광전 소자 개발을 목표로 합니다. 친환경 첨가제, 용액 공정 기술, 금속 산화물 전자 수송층 등을 활용해 박막 형상, 계면 특성, 소자 성능을 최적화합니다.",
      },
      {
        tag: "PSCs",
        title: "페로브스카이트 태양전지",
        desc: "고효율 페로브스카이트 태양전지 소재·소자 및 성능 분석 연구",
        detail:
          "페로브스카이트 태양전지(PSC)는 고효율 에너지 변환의 뛰어난 잠재력을 지닌 광전 기술로 주목받고 있습니다. 연구는 탠덤 소자 구조, 상보적 소재 통합, 소자 공학을 포괄하여 태양 에너지 활용을 극대화합니다. 스펙트럼 흡수 범위 확장과 광전 변환 효율 향상을 위한 첨단 소재 및 구조 설계 전략을 탐구합니다.",
      },
      {
        tag: "OFETs",
        title: "유기 전계효과 트랜지스터",
        desc: "유기 전계효과 트랜지스터 소재·소자 특성 연구",
        detail:
          "유기 전계효과 트랜지스터(OFET)는 유기 반도체를 이용해 전류 흐름을 제어하는 핵심 유기전자 소자로, 유연 전자, 웨어러블, 센서 등 다양한 응용이 가능합니다. 전하 수송, 트랜지스터 동작 메커니즘, 이동도와 스위칭 안정성 향상을 위한 소재·소자 전략을 연구합니다.",
      },
      {
        tag: "Metal Ink",
        title: "금속 잉크",
        desc: "전극·회로 형성을 위한 금속 MOD 잉크 소재 개발",
        detail:
          "금속-유기 분해(MOD) 잉크는 유기 리간드와 배위된 금속 이온으로 구성된 입자 없는(particle-free) 금속 잉크로, 용해 가능한 금속-유기 착물 형태입니다. 분해 후 상대적으로 낮은 공정 온도에서 균일하고 고전도성인 금속 박막을 형성할 수 있습니다.\n\n특히 금속-리간드 착물 설계, 잉크 제형, 열·광·마이크로파 공정을 이용한 제어 소결에 중점을 두고, 박막 형성, 기판 접착, 전기 전도도 및 기계적 내구성을 좌우하는 메커니즘을 연구합니다.",
      },
      {
        tag: "ELA",
        title: "에너지 손실 분석",
        desc: "유기태양전지 에너지 손실 메커니즘 분석 및 효율 향상 연구",
        detail:
          "유기태양전지의 에너지 손실은 Shockley–Queisser(SQ) 상세 균형 프레임워크 내에서 정량 분석되며, 피할 수 없는 SQ 한계 손실, 비이상적 흡수 및 서브밴드갭 상태에서 기인하는 추가 복사 손실, 비복사 재결합 손실로 분해됩니다.\n\n전하 전달(CT) 상태는 donor–acceptor 벌크 이종접합의 계면 여기 상태로, 전하 생성과 재결합을 매개하여 서브밴드갭 흡수, 발광, 개방회로 전압에 큰 영향을 미칩니다.\n\n이러한 에너지 손실 메커니즘과 CT 상태 에너지 준위는 자체 구축 Fourier-transform photocurrent spectroscopy(FTPS-EQE) 시스템과 전계발광(EL), EL quantum efficiency(EQEEL) 측정을 통해 연구합니다.",
      },
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
          "OEPL 심볼마크는 벤젠 고리(유기분자·π-공액 구조)와 잎(친환경·지속가능 에너지), 두 개의 궤도 고리(전자물리·에너지 연구)를 결합하여 OEPL 연구실의 학문적 정체성과 친환경 에너지 기술에 대한 비전을 동시에 전달합니다.",
          "공식 행사, 포스터, 발표 자료 등에서 심볼마크 단독 또는 로고마크와 함께 사용할 수 있으며, 비율·색상·여백을 임의로 변경하지 않도록 해 주세요.",
        ],
        assets: { png: "/brand/oepl-symbol.png" },
      },
      logo: {
        enTitle: "Logo Mark",
        krTitle: "로고마크",
        paragraphs: [
          "로고마크는 OEPL 타이포형 로고와 영문 풀네임(Organic Electronic Physics Laboratory)을 조합한 공식 타이포 표기입니다.",
          "심볼뿐만 아니라 타이포형 로고에도 친환경 에너지 기술 이미지를 살리기 위해 잎을 형상화한 타이포형 로고타입을 아이콘화하였습니다.",
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
          "시각적 임팩트가 높은 #E88800로 표현하여 태양열의 밝은 이미지를 전달하였으며, 유기태양전지 기술의 밝은 미래와 열정을 의미하였다.",
        ],
        assets: { png: "/brand/oepl-brand-colors.png" },
      },
    },
  },
  members: {
    banner: "Members",
    professorLabel: "Professor",
    professorTitle: "교수 소개",
    careerLabel: "주요 경력",
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
    loading: "불러오는 중…",
  },
  publication: {
    banner: "Publication",
    yearAll: "전체",
    count: (n) => `${n}개 논문`,
    sortNewest: "최신순",
    sortOldest: "오래된순",
    noResults: "해당 조건의 논문이 없습니다.",
    loading: "불러오는 중…",
  },
  gallery: {
    banner: "Gallery",
    categoryLabels: { "전체": "전체", "Member": "Member", "Conference": "Conference", "기타": "기타" },
    count: (n) => `${n}개 행사`,
    empty: "해당 카테고리의 행사가 없습니다.",
    loading: "불러오는 중…",
  },
  contact: {
    label: "Contact Us", banner: "Contact", title: "연락처", heading: "Contact Us",
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
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력하세요",
    emailLabel: "이메일",
    emailPlaceholder: "이메일을 입력하세요",
    submit: "로그인",
    backHome: "홈으로 돌아가기",
    error: "이메일 또는 비밀번호가 올바르지 않거나, 관리자 권한이 없는 계정입니다.",
  },
  notFoundPage: {
    title: "페이지를 찾을 수 없습니다",
    titleEn: "Page Not Found",
    desc: "요청하신 주소가 잘못되었거나, 페이지가 이동·삭제되었을 수 있습니다.",
    descEn: "The page you're looking for doesn't exist or may have been moved.",
    backHome: "홈으로 돌아가기",
  },
  admin: {
    title: "관리자 페이지",
    titleEn: "Admin Page",
    dashboard: "대시보드",
    dashboardDesc: "콘텐츠를 관리하려면 아래 메뉴를 선택하세요.",
    dashboardDescEn: "Select a section below to manage site content.",
    members: "멤버",
    publications: "논문",
    news: "뉴스",
    gallery: "갤러리",
    patents: "특허",
    navEn: {
      dashboard: "Dashboard",
      members: "Members",
      publications: "Publications",
      news: "News",
      gallery: "Gallery",
      patents: "Patents",
    },
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
    subtitle: "Organic Electronic Physics Labotory",
    title: "OEPL 유기전자물리 연구실",
    desc: "We develop electronic devices using organic semiconductors, with a special focus on organic solar cells. Our goal is to achieve world-class efficiency and drive next-generation energy technology.",
    btn1: "Our Research",
    btn2: "View Papers",
  },
  intro: {
    label: "About Our Lab",
    title: "Organic Electronic\nPhysics\u00a0Labotory(OEPL)",
    tagline: "Light into Energy, Research into the Future.",
    p1: "Our lab is dedicated to the development of advanced electronic devices based on semiconductors. We focus on organic photovoltaics (OPVs), perovskite solar cells (PSCs), organic field-effect transistors (OFETs), and device physics, including charge transport, interfacial engineering, and comprehensive energy-loss analysis using Korea's only independently established energy-loss analysis system for organic solar cells.",
    p2: "In addition, we actively collaborate with leading universities and research institutes in Korea and abroad to drive advances in electronic device technologies.",
    p3: "",
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
      { title: "Advanced Materials",   enTitle: "Advanced Materials",   desc: "Functional materials for emerging electronics" },
      { title: "Device Engineering",  enTitle: "Device Engineering",  desc: "High-performance device architectures and processing technologies" },
      { title: "Advanced Characterization",  enTitle: "Advanced Characterization",  desc: "Charge transport and device operation mechanisms" },
      { title: "Photovoltaics",     enTitle: "Photovoltaics",     desc: "High-efficiency energy conversion and applications" },
    ],
  },
  research: {
    label: "About our Research",
    title: "Research Areas",
    more: "More",
    items: [
      { tag: "OSCs",  title: "Organic solar cells", desc: "Research on OSC materials, devices, and efficiency enhancement" },
      { tag: "PSCs",  title: "Perovskite solar cells", desc: "Research on PSC materials, fabrication, and performance analysis" },
      { tag: "OFETs", title: "Organic field effect transistors", desc: "Research on OFET materials and device characteristics" },
      { tag: "Metal Ink", title: "Metal ink", desc: "Development of MOD metal inks for electrodes and circuit patterning" },
      { tag: "ELA", title: "Energy loss analysis", desc: "Analysis of energy loss mechanisms in organic photovoltaics" },
    ],
  },
  news: {
    banner: "News",
    label: "Latest News",
    title: "News of OEPL",
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
      "col1": [
        { label: "About", href: "/about" },
        { label: "Professor", href: "/members#professor" },
        { label: "Researchers", href: "/members#researchers" },
      ],
      "col2": [
        { label: "Publications", href: "/publication" },
        { label: "News", href: "/news" },
        { label: "Gallery", href: "/gallery" },
      ],
      "col3": [{ label: "Contact", href: "/contact" }],
    },
    copyright: "Copyright © Ulsan University OEPL Lab all right reserved ㅣ Designed by Haminji",
    contactUs: "Contact Us",
    bizNum: "Biz Reg. No.: 206-82-07306",
  },
  about: {
    banner: "Research",
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
    profPhoto: "Photo",
    areas: [
      {
        tag: "OSCs",
        title: "Organic solar cells",
        desc: "Research on OSC materials, devices, and efficiency enhancement",
        detail:
          "Organic solar cells (OSCs) have attracted considerable attention as next-generation photovoltaic technologies due to their lightweight, mechanical flexibility, and solution-processability. With particular emphasis on device physics and interface engineering, studies are directed toward understanding charge generation, transport, extraction, and energy-loss mechanisms for the development of high-efficiency and stable photovoltaic devices. Environmentally friendly additives, solution-processing technologies, and metal oxide electron transport layers are also explored to optimize thin-film morphology, interfacial properties, and overall device performance.",
      },
      {
        tag: "PSCs",
        title: "Perovskite solar cells",
        desc: "Research on PSC materials, fabrication, and performance analysis",
        detail:
          "Perovskite solar cells (PSCs) have emerged as attractive photovoltaic technologies with exceptional potential for high-efficiency energy conversion. Research encompasses tandem device architectures, complementary material integration, and device engineering to maximize solar energy utilization. Advanced materials and structural design strategies are explored to extend the spectral absorption range and improve photovoltaic conversion efficiency.",
      },
      {
        tag: "OFETs",
        title: "Organic field effect transistors",
        desc: "Research on OFET materials and device characteristics",
        detail:
          "Organic field-effect transistors (OFETs) are key organic electronic devices that regulate current flow using organic semiconductors, offering broad applications in flexible electronics, wearable systems, and sensors. Current research examines charge transport, transistor operating mechanisms, and material and device strategies for improving charge-carrier mobility and switching stability.",
      },
      {
        tag: "Metal Ink",
        title: "Metal ink",
        desc: "Development of MOD metal inks for electrodes and circuit patterning",
        detail:
          "Metal–organic decomposition (MOD) inks are particle-free metal inks composed of metal ions coordinated with organic ligands to form soluble metal–organic complexes. Upon decomposition, these inks can produce uniform, highly conductive metal films at relatively low processing temperatures.\n\nWith a particular focus on metal–ligand complex design, ink formulation, and controlled sintering using thermal, photonic, and microwave processes, we investigate the mechanisms governing film formation, substrate adhesion, electrical conductivity, and mechanical durability.",
      },
      {
        tag: "ELA",
        title: "Energy loss analysis",
        desc: "Analysis of energy loss mechanisms in organic photovoltaics",
        detail:
          "Energy loss in organic solar cells is quantitatively analyzed within the Shockley–Queisser (SQ) detailed-balance framework and decomposed into the unavoidable SQ-limited loss, additional radiative loss arising from non-ideal absorption and sub-bandgap states, and non-radiative recombination loss.\n\nCharge-transfer (CT) states are interfacial excited states characteristic of donor–acceptor bulk heterojunctions that mediate charge generation and recombination, thereby strongly influencing sub-bandgap absorption, emission, and open-circuit voltage.\n\nThese energy-loss mechanisms and CT-state energetics are investigated using our home-built Fourier-transform photocurrent spectroscopy (FTPS-EQE) system together with electroluminescence (EL) and EL quantum efficiency (EQEEL) measurements.",
      },
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
          "The OEPL symbol combines a benzene ring (organic molecules and π-conjugation), a leaf (eco-friendly and sustainable energy), and two orbital rings (electronic physics and energy research) to convey both the lab’s scientific identity and its vision for green energy technology.",
          "Use it alone or with the logo mark at official events, on posters, and in presentation materials. Do not alter proportions, colors, or clear space.",
        ],
        assets: { png: "/brand/oepl-symbol.png" },
      },
      logo: {
        enTitle: "Logo Mark",
        krTitle: "Logo Mark",
        paragraphs: [
          "The logo mark is the official typographic lockup of the OEPL typographic logo and full name (Organic Electronic Physics Laboratory).",
          "Beyond the symbol, the typographic logo also iconizes a leaf-shaped logotype to convey the image of eco-friendly energy technology.",
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
          "Expressed in #E88800 with high visual impact, it conveys the bright image of solar heat and signifies the bright future and passion of organic solar cell technology.",
        ],
        assets: { png: "/brand/oepl-brand-colors.png" },
      },
    },
  },
  members: {
    banner: "Members",
    professorLabel: "Professor",
    professorTitle: "Professor",
    careerLabel: "Career",
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
    loading: "Loading…",
  },
  publication: {
    banner: "Publication",
    yearAll: "All",
    count: (n) => `${n} paper${n !== 1 ? "s" : ""}`,
    sortNewest: "Latest",
    sortOldest: "Oldest",
    noResults: "No papers found.",
    loading: "Loading…",
  },
  gallery: {
    banner: "Gallery",
    categoryLabels: { "전체": "All", "Member": "Member", "Conference": "Conference", "기타": "Other" },
    count: (n) => `${n} event${n !== 1 ? "s" : ""}`,
    empty: "No events in this category.",
    loading: "Loading…",
  },
  contact: {
    label: "Contact Us", banner: "Contact", title: "Contact", heading: "Contact Us",
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
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    submit: "Log in",
    backHome: "Back to home",
    error: "Invalid email or password, or this account is not an admin.",
  },
  notFoundPage: {
    title: "Page Not Found",
    titleEn: "Page Not Found",
    desc: "The page you're looking for doesn't exist or may have been moved.",
    descEn: "The page you're looking for doesn't exist or may have been moved.",
    backHome: "Back to home",
  },
  admin: {
    title: "Admin Page",
    titleEn: "Administration",
    dashboard: "Dashboard",
    dashboardDesc: "Select a section below to manage site content.",
    dashboardDescEn: "Select a section below to manage site content.",
    members: "Members",
    publications: "Publications",
    news: "News",
    gallery: "Gallery",
    patents: "Patents",
    navEn: {
      dashboard: "Dashboard",
      members: "Members",
      publications: "Publications",
      news: "News",
      gallery: "Gallery",
      patents: "Patents",
    },
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
