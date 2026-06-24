import type { AlumniMember, MemberGroup, MemberRecord, MembersData, ResearcherMember } from "@/types/content";
import { flattenMembers, isResearcherGroup, memberRecordFromRow } from "@/lib/data/mappers";

export const POSTDOC_DEGREE = "박사 후 연구원";

export const MEMBER_DEGREE_OPTIONS = [
  POSTDOC_DEGREE,
  "박사과정",
  "석사과정",
] as const;

export type MemberDegree = (typeof MEMBER_DEGREE_OPTIONS)[number];

export function normalizeDegree(degree: string, memberGroup?: MemberGroup): MemberDegree {
  const trimmed = degree.trim();
  const compact = trimmed.replace(/\s+/g, "");
  const exact = MEMBER_DEGREE_OPTIONS.find((d) => d === trimmed || d === compact);
  if (exact) return exact;

  if (compact.includes("박사후") || compact.includes("박사후연구원") || compact.toLowerCase().includes("postdoc")) {
    return POSTDOC_DEGREE;
  }
  if (compact.includes("석사")) return "석사과정";
  if (compact.includes("박사")) return "박사과정";

  switch (memberGroup) {
    case "postdocs":
      return POSTDOC_DEGREE;
    case "msAlumni":
      return "석사과정";
    case "phdAlumni":
      return "박사과정";
    case "gradStudents":
      return "박사과정";
    default:
      return POSTDOC_DEGREE;
  }
}

export function degreeOptionsFor(value: string, memberGroup?: MemberGroup) {
  const normalized = normalizeDegree(value, memberGroup);
  const base = MEMBER_DEGREE_OPTIONS.map((d) => ({ value: d, label: d }));
  if (base.some((o) => o.value === normalized)) return base;
  return [{ value: normalized, label: normalized }, ...base];
}

export function hasGraduated(item: Pick<MemberRecord, "graduationDate">): boolean {
  return Boolean(item.graduationDate?.trim());
}

/** 화면 표시용 — 졸업 연도만 */
export function formatGraduationYear(item: Pick<MemberRecord, "graduationDate">): string {
  if (!hasGraduated(item)) return "—";
  const d = item.graduationDate.trim();
  const year = d.slice(0, 4);
  if (/^\d{4}$/.test(year)) return year;
  const parsed = new Date(d);
  return Number.isNaN(parsed.getTime()) ? "—" : String(parsed.getFullYear());
}

export function formatGraduation(item: Pick<MemberRecord, "graduationDate">): string {
  return formatGraduationYear(item);
}

export function inferMemberGroup(
  item: Pick<MemberRecord, "degree" | "graduationDate" | "memberGroup">
): MemberGroup {
  const degree = normalizeDegree(item.degree, item.memberGroup);
  if (hasGraduated(item)) {
    return degree === "석사과정" ? "msAlumni" : "phdAlumni";
  }
  return degree === POSTDOC_DEGREE ? "postdocs" : "gradStudents";
}

export function normalizeMemberRecord(item: MemberRecord): MemberRecord {
  const degree = normalizeDegree(item.degree, item.memberGroup);
  const base = { ...item, degree };
  const memberGroup = inferMemberGroup(base);
  if (hasGraduated(item)) {
    return {
      ...base,
      memberGroup,
      email: "",
      research: "",
    };
  }
  return {
    ...base,
    memberGroup,
    graduationDate: "",
  };
}

export function compareMemberInsertOrder(
  a: Pick<MemberRecord, "id" | "createdAt">,
  b: Pick<MemberRecord, "id" | "createdAt">
): number {
  if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
    return a.createdAt.localeCompare(b.createdAt);
  }
  return a.id - b.id;
}

/** DB rows (created_at asc) → display groups by degree + graduation */
export function buildMemberGroupsFromRows(
  rows: Record<string, unknown>[]
): Omit<MembersData, "professor"> {
  const result = {
    postdocs: [] as ResearcherMember[],
    gradStudents: [] as ResearcherMember[],
    phdAlumni: [] as AlumniMember[],
    msAlumni: [] as AlumniMember[],
  };

  for (const row of rows) {
    const record = memberRecordFromRow(row);
    const group = inferMemberGroup(record);

    if (isResearcherGroup(group)) {
      (result[group] as ResearcherMember[]).push({
        id: record.id,
        nameKo: record.nameKo,
        nameEn: record.nameEn,
        degree: record.degree,
        email: record.email,
        research: record.research,
        photoUrl: record.photoUrl,
        createdAt: record.createdAt,
      });
    } else {
      (result[group] as AlumniMember[]).push({
        id: record.id,
        nameKo: record.nameKo,
        nameEn: record.nameEn,
        degree: record.degree,
        graduationDate: record.graduationDate,
        photoUrl: record.photoUrl,
        createdAt: record.createdAt,
      });
    }
  }

  return result;
}

export function groupMembersForDisplay(members: MembersData) {
  const all = flattenMembers(members)
    .map((m) => ({
      ...m,
      degree: normalizeDegree(m.degree, m.memberGroup),
    }))
    .sort(compareMemberInsertOrder);

  return {
    postdocs: all.filter((m) => !hasGraduated(m) && m.degree === POSTDOC_DEGREE),
    gradStudents: all.filter((m) => !hasGraduated(m) && m.degree !== POSTDOC_DEGREE),
    phdAlumni: all.filter((m) => hasGraduated(m) && m.degree !== "석사과정"),
    msAlumni: all.filter((m) => hasGraduated(m) && m.degree === "석사과정"),
  };
}

export function memberFieldDisplay(item: MemberRecord): string {
  return item.research.trim() || "—";
}
