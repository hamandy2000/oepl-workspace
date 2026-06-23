import type { MemberGroup, MemberRecord, MembersData } from "@/types/content";
import { flattenMembers } from "@/lib/data/mappers";

export const MEMBER_DEGREE_OPTIONS = [
  "박사후연구원",
  "박사과정",
  "석사과정",
  "학부연구생",
] as const;

export type MemberDegree = (typeof MEMBER_DEGREE_OPTIONS)[number];

export function normalizeDegree(degree: string, memberGroup?: MemberGroup): MemberDegree {
  const trimmed = degree.trim();
  const compact = trimmed.replace(/\s+/g, "");
  const exact = MEMBER_DEGREE_OPTIONS.find((d) => d === trimmed || d === compact);
  if (exact) return exact;

  if (compact.includes("박사후") || compact.toLowerCase().includes("postdoc")) return "박사후연구원";
  if (compact.includes("학부")) return "학부연구생";
  if (compact.includes("석사")) return "석사과정";
  if (compact.includes("박사")) return "박사과정";

  switch (memberGroup) {
    case "postdocs":
      return "박사후연구원";
    case "msAlumni":
      return "석사과정";
    case "phdAlumni":
      return "박사과정";
    case "gradStudents":
      return "박사과정";
    default:
      return "박사후연구원";
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
  return degree === "박사후연구원" ? "postdocs" : "gradStudents";
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
      fieldKr: "",
      fieldEn: "",
    };
  }
  return {
    ...base,
    memberGroup,
    graduationDate: "",
  };
}

export function groupMembersForDisplay(members: MembersData) {
  const all = flattenMembers(members).map((m) => ({
    ...m,
    degree: normalizeDegree(m.degree, m.memberGroup),
  }));
  return {
    postdocs: all.filter((m) => !hasGraduated(m) && m.degree === "박사후연구원"),
    gradStudents: all.filter((m) => !hasGraduated(m) && m.degree !== "박사후연구원"),
    phdAlumni: all.filter((m) => hasGraduated(m) && m.degree !== "석사과정"),
    msAlumni: all.filter((m) => hasGraduated(m) && m.degree === "석사과정"),
  };
}

export function memberFieldDisplay(item: MemberRecord): string {
  return item.fieldKr || item.fieldEn || "—";
}
