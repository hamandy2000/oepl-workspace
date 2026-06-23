import type {
  AlumniMember,
  GalleryItem,
  MemberGroup,
  MemberRecord,
  MembersData,
  NewsItem,
  Patent,
  Professor,
  Publication,
  ResearcherMember,
  SiteContent,
  TimelineEntry,
} from "@/types/content";

import { isNewId } from "@/lib/data/ids";

const PROFESSOR_ID = "default";

type TimelineKind = "education" | "career" | "achievements";

function rowId(row: Record<string, unknown>): number {
  return Number(row.id);
}

function withOptionalId(id: number, row: Record<string, unknown>) {
  return isNewId(id) ? row : { id, ...row };
}

function optionalTimestamp(row: Record<string, unknown>, key: string): string | undefined {
  const v = row[key];
  return typeof v === "string" ? v : undefined;
}

export function newsFromRow(row: Record<string, unknown>): NewsItem {
  return {
    id: rowId(row),
    type: row.type as string,
    date: row.date as string,
    title: row.title as string,
    detail: row.detail as string,
    createdAt: optionalTimestamp(row, "created_at"),
    updatedAt: optionalTimestamp(row, "updated_at"),
  };
}

export function newsToRow(item: NewsItem, updating = false) {
  const row = withOptionalId(item.id, {
    type: item.type,
    date: item.date,
    title: item.title,
    detail: item.detail,
  });
  if (updating) row.updated_at = new Date().toISOString();
  return row;
}

export function publicationFromRow(row: Record<string, unknown>): Publication {
  const doiLink = row.doi_link as string | null | undefined;
  return {
    id: rowId(row),
    type: row.type as Publication["type"],
    titleKo: row.title_ko as string,
    titleEn: row.title_en as string,
    authors: row.authors as string,
    journal: row.journal as string,
    doi: (row.doi as string) ?? "",
    doiLink: doiLink?.trim() || undefined,
    createdAt: optionalTimestamp(row, "created_at"),
    updatedAt: optionalTimestamp(row, "updated_at"),
  };
}

export function publicationToRow(item: Publication, updating = false) {
  const row = withOptionalId(item.id, {
    type: item.type,
    title_ko: item.titleKo,
    title_en: item.titleEn,
    authors: item.authors,
    journal: item.journal,
    doi: item.doi,
    doi_link: item.doiLink?.trim() || null,
  });
  if (updating) row.updated_at = new Date().toISOString();
  return row;
}

export function galleryFromRow(row: Record<string, unknown>): GalleryItem {
  return {
    id: rowId(row),
    title: row.title as string,
    date: row.date as string,
    category: row.type as GalleryItem["category"],
    createdAt: optionalTimestamp(row, "created_at"),
    updatedAt: optionalTimestamp(row, "updated_at"),
  };
}

export function galleryToRow(item: GalleryItem, updating = false) {
  const row = withOptionalId(item.id, {
    title: item.title,
    date: item.date,
    type: item.category,
  });
  if (updating) row.updated_at = new Date().toISOString();
  return row;
}

export function patentFromRow(row: Record<string, unknown>): Patent {
  return {
    id: rowId(row),
    number: row.number as string,
    title: row.title as string,
    titleEn: row.title_en as string,
    date: row.date as string,
    status: row.status as Patent["status"],
    inventors: row.inventors as string,
    createdAt: optionalTimestamp(row, "created_at"),
    updatedAt: optionalTimestamp(row, "updated_at"),
  };
}

export function patentToRow(item: Patent, updating = false) {
  const row = withOptionalId(item.id, {
    number: item.number,
    title: item.title,
    title_en: item.titleEn,
    date: item.date,
    status: item.status,
    inventors: item.inventors,
  });
  if (updating) row.updated_at = new Date().toISOString();
  return row;
}

export function timelineFromRow(row: Record<string, unknown>): TimelineEntry {
  return {
    id: rowId(row),
    period: row.period as string,
    textKr: row.text_kr as string,
    textEn: row.text_en as string,
  };
}

export function professorToRow(professor: Professor) {
  return {
    id: PROFESSOR_ID,
    name_ko: professor.nameKo,
    name_en: professor.nameEn,
    affiliation_kr: professor.affiliationKr,
    affiliation_en: professor.affiliationEn,
    email: professor.email,
    scholar: professor.scholar,
    updated_at: new Date().toISOString(),
  };
}

export function timelineToRows(
  professor: Professor
): { id: number; professor_id: string; kind: TimelineKind; period: string; text_kr: string; text_en: string; sort_order: number }[] {
  const kinds: { kind: TimelineKind; entries: TimelineEntry[] }[] = [
    { kind: "education", entries: professor.education },
    { kind: "career", entries: professor.career },
    { kind: "achievements", entries: professor.achievements },
  ];

  return kinds.flatMap(({ kind, entries }) =>
    entries.map((entry, index) => ({
      id: entry.id,
      professor_id: PROFESSOR_ID,
      kind,
      period: entry.period,
      text_kr: entry.textKr,
      text_en: entry.textEn,
      sort_order: index,
    }))
  );
}

export function researcherFromRow(row: Record<string, unknown>): ResearcherMember {
  return {
    id: rowId(row),
    nameKo: row.name_ko as string,
    nameEn: row.name_en as string,
    degree: row.degree as string,
    email: (row.email as string) ?? "",
    fieldKr: (row.field_kr as string) ?? "",
    fieldEn: (row.field_en as string) ?? "",
  };
}

function graduationDateFromRow(row: Record<string, unknown>): string {
  const fromDate = row.graduation_date;
  if (fromDate != null && String(fromDate).trim()) {
    return String(fromDate).slice(0, 10);
  }
  const year = row.year as number | null | undefined;
  const month = row.month as number | null | undefined;
  if (year && month) {
    return `${year}-${String(month).padStart(2, "0")}-01`;
  }
  return "";
}

export function researcherToRow(group: "postdocs" | "gradStudents", item: ResearcherMember) {
  return {
    id: item.id,
    member_group: group,
    name_ko: item.nameKo,
    name_en: item.nameEn,
    degree: item.degree,
    email: item.email,
    field_kr: item.fieldKr,
    field_en: item.fieldEn,
    graduation_date: null,
  };
}

export function alumniFromRow(row: Record<string, unknown>): AlumniMember {
  return {
    id: rowId(row),
    nameKo: row.name_ko as string,
    nameEn: row.name_en as string,
    degree: row.degree as string,
    graduationDate: graduationDateFromRow(row),
  };
}

export function alumniToRow(group: "phdAlumni" | "msAlumni", item: AlumniMember) {
  return {
    id: item.id,
    member_group: group,
    name_ko: item.nameKo,
    name_en: item.nameEn,
    degree: item.degree,
    email: null,
    field_kr: null,
    field_en: null,
    graduation_date: item.graduationDate?.trim() || null,
  };
}

export function buildProfessor(
  row: Record<string, unknown> | null,
  timelines: Record<string, unknown>[]
): Professor | null {
  if (!row) return null;

  const byKind = (kind: TimelineKind) =>
    timelines
      .filter((t) => t.kind === kind)
      .sort((a, b) => (a.sort_order as number) - (b.sort_order as number))
      .map(timelineFromRow);

  return {
    nameKo: row.name_ko as string,
    nameEn: row.name_en as string,
    affiliationKr: row.affiliation_kr as string,
    affiliationEn: row.affiliation_en as string,
    email: row.email as string,
    scholar: row.scholar as string,
    education: byKind("education"),
    career: byKind("career"),
    achievements: byKind("achievements"),
  };
}

export function isResearcherGroup(group: MemberGroup): group is "postdocs" | "gradStudents" {
  return group === "postdocs" || group === "gradStudents";
}

export function memberRecordToRow(item: MemberRecord) {
  const researcher = isResearcherGroup(item.memberGroup);
  return withOptionalId(item.id, {
    member_group: item.memberGroup,
    name_ko: item.nameKo,
    name_en: item.nameEn,
    degree: item.degree,
    email: researcher ? item.email : null,
    field_kr: researcher ? item.fieldKr : null,
    field_en: researcher ? item.fieldEn : null,
    graduation_date: researcher ? null : item.graduationDate?.trim() || null,
  });
}

export function memberRecordFromRow(row: Record<string, unknown>): MemberRecord {
  const group = row.member_group as MemberGroup;
  const graduationDate = graduationDateFromRow(row);
  if (isResearcherGroup(group)) {
    const r = researcherFromRow(row);
    return {
      memberGroup: group,
      ...r,
      graduationDate: "",
    };
  }
  const a = alumniFromRow(row);
  return {
    memberGroup: group,
    ...a,
    email: "",
    fieldKr: "",
    fieldEn: "",
  };
}

export function flattenMembers(members: MembersData): MemberRecord[] {
  const toRecord = (group: MemberGroup, item: ResearcherMember | AlumniMember): MemberRecord => {
    if (isResearcherGroup(group)) {
      const r = item as ResearcherMember;
      return {
        id: r.id,
        memberGroup: group,
        nameKo: r.nameKo,
        nameEn: r.nameEn,
        degree: r.degree,
        email: r.email,
        fieldKr: r.fieldKr,
        fieldEn: r.fieldEn,
        graduationDate: "",
      };
    }
    const a = item as AlumniMember;
    return {
      id: a.id,
      memberGroup: group,
      nameKo: a.nameKo,
      nameEn: a.nameEn,
      degree: a.degree,
      email: "",
      fieldKr: "",
      fieldEn: "",
      graduationDate: a.graduationDate,
    };
  };

  return [
    ...members.postdocs.map((m) => toRecord("postdocs", m)),
    ...members.gradStudents.map((m) => toRecord("gradStudents", m)),
    ...members.phdAlumni.map((m) => toRecord("phdAlumni", m)),
    ...members.msAlumni.map((m) => toRecord("msAlumni", m)),
  ];
}

export function applyMemberRecord(members: MembersData, record: MemberRecord): MembersData {
  const id = record.id;
  const cleared: MembersData = {
    ...members,
    postdocs: members.postdocs.filter((m) => m.id !== id),
    gradStudents: members.gradStudents.filter((m) => m.id !== id),
    phdAlumni: members.phdAlumni.filter((m) => m.id !== id),
    msAlumni: members.msAlumni.filter((m) => m.id !== id),
  };

  if (isResearcherGroup(record.memberGroup)) {
    const researcher: ResearcherMember = {
      id: record.id,
      nameKo: record.nameKo,
      nameEn: record.nameEn,
      degree: record.degree,
      email: record.email,
      fieldKr: record.fieldKr,
      fieldEn: record.fieldEn,
    };
    return { ...cleared, [record.memberGroup]: [researcher, ...cleared[record.memberGroup]] };
  }

  const alumni: AlumniMember = {
    id: record.id,
    nameKo: record.nameKo,
    nameEn: record.nameEn,
    degree: record.degree,
    graduationDate: record.graduationDate,
  };
  return { ...cleared, [record.memberGroup]: [alumni, ...cleared[record.memberGroup]] };
}

export function removeMemberFromGroups(members: MembersData, id: number): MembersData {
  return {
    ...members,
    postdocs: members.postdocs.filter((m) => m.id !== id),
    gradStudents: members.gradStudents.filter((m) => m.id !== id),
    phdAlumni: members.phdAlumni.filter((m) => m.id !== id),
    msAlumni: members.msAlumni.filter((m) => m.id !== id),
  };
}
export function groupMembers(rows: Record<string, unknown>[]) {
  const result: Record<MemberGroup, ResearcherMember[] | AlumniMember[]> = {
    postdocs: [],
    gradStudents: [],
    phdAlumni: [],
    msAlumni: [],
  };

  for (const row of rows) {
    const record = memberRecordFromRow(row);
    const group = record.memberGroup;
    if (isResearcherGroup(group)) {
      (result[group] as ResearcherMember[]).push({
        id: record.id,
        nameKo: record.nameKo,
        nameEn: record.nameEn,
        degree: record.degree,
        email: record.email,
        fieldKr: record.fieldKr,
        fieldEn: record.fieldEn,
      });
    } else {
      (result[group] as AlumniMember[]).push({
        id: record.id,
        nameKo: record.nameKo,
        nameEn: record.nameEn,
        degree: record.degree,
        graduationDate: record.graduationDate,
      });
    }
  }

  return result;
}

export { PROFESSOR_ID };
