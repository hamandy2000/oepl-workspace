export type GalleryCategory = "Member" | "Conference" | "기타";

export type PublicationType = "Journal" | "Conference";

export type PatentStatus = "registered" | "pending";

export type MemberGroup = "postdocs" | "gradStudents" | "phdAlumni" | "msAlumni";

export interface ContentPhoto {
  id: number;
  url: string;
  sortOrder: number;
}

export interface NewsFile {
  id: number;
  url: string;
  fileName: string;
  sortOrder: number;
}

export interface NewsItem {
  id: number;
  type: string;
  date: string;
  title: string;
  detail: string;
  author: string;
  viewCount: number;
  pinned: boolean;
  photos: ContentPhoto[];
  files: NewsFile[];
  createdAt?: string;
  updatedAt?: string;
}



export interface Publication {

  id: number;

  type: PublicationType;

  titleKo: string;

  titleEn: string;

  authors: string;

  journal: string;

  doi: string;

  doiLink?: string;

  /** 게재일 — YYYY-MM-DD */
  publishedAt: string;

  createdAt?: string;

  updatedAt?: string;

}



export interface GalleryItem {
  id: number;
  title: string;
  date: string;
  category: GalleryCategory;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}



export interface Patent {

  id: number;

  number: string;

  title: string;

  titleEn: string;

  date: string;

  status: PatentStatus;

  inventors: string;

  createdAt?: string;

  updatedAt?: string;

}



export interface TimelineEntry {

  id: number;

  period: string;

  textKr: string;

  textEn: string;

}



export interface Professor {

  nameKo: string;

  nameEn: string;

  affiliationKr: string;

  affiliationEn: string;

  email: string;

  scholar: string;

  education: TimelineEntry[];

  career: TimelineEntry[];

  achievements: TimelineEntry[];

}



export interface ResearcherMember {

  id: number;

  nameKo: string;

  nameEn: string;

  degree: string;

  email: string;

  research: string;

  photoUrl?: string;

  createdAt?: string;

}



export interface AlumniMember {

  id: number;

  nameKo: string;

  nameEn: string;

  degree: string;

  graduationDate: string;

  photoUrl?: string;

  createdAt?: string;

}



export interface MemberRecord {

  id: number;

  memberGroup: MemberGroup;

  nameKo: string;

  nameEn: string;

  degree: string;

  email: string;

  research: string;

  graduationDate: string;

  photoUrl?: string;

  createdAt?: string;

}



export interface MembersData {

  professor: Professor;

  postdocs: ResearcherMember[];

  gradStudents: ResearcherMember[];

  phdAlumni: AlumniMember[];

  msAlumni: AlumniMember[];

}



export interface SiteContent {

  news: NewsItem[];

  publications: Publication[];

  gallery: GalleryItem[];

  patents: Patent[];

  members: MembersData;

}



/** Publication DOI 링크 — doi_link가 있을 때만 사용 */
export function publicationDoiLink(pub: Publication): string {
  return pub.doiLink?.trim() ?? "";
}


