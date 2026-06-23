export type GalleryCategory = "Member" | "Conference" | "기타";

export type PublicationType = "Journal" | "Conference";

export type PatentStatus = "registered" | "pending";

export type MemberGroup = "postdocs" | "gradStudents" | "phdAlumni" | "msAlumni";



export interface NewsItem {

  id: number;

  type: string;

  date: string;

  title: string;

  detail: string;

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

  createdAt?: string;

  updatedAt?: string;

}



export interface GalleryItem {

  id: number;

  title: string;

  date: string;

  category: GalleryCategory;

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

  fieldKr: string;

  fieldEn: string;

}



export interface AlumniMember {

  id: number;

  nameKo: string;

  nameEn: string;

  degree: string;

  graduationDate: string;

}



export interface MemberRecord {

  id: number;

  memberGroup: MemberGroup;

  nameKo: string;

  nameEn: string;

  degree: string;

  email: string;

  fieldKr: string;

  fieldEn: string;

  graduationDate: string;

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



/** Publication DOI 표시/링크용 */

export function publicationDoiLink(pub: Publication): string {

  return pub.doiLink?.trim() || pub.doi.trim();

}


