"use client";

/** 관리자 대시보드 — 관리 항목 카드 목록 */

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BookOpen, FileText, Images, LayoutDashboard, Newspaper, Users } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { SiteContent } from "@/types/content";

const cards: {
  href: string;
  key: "members" | "publications" | "news" | "gallery" | "patents";
  icon: LucideIcon;
  count: (c: SiteContent) => number;
  unit: string;
}[] = [
  {
    href: "/admin/members",
    key: "members",
    icon: Users,
    unit: "명",
    count: (c) =>
      c.members.postdocs.length +
      c.members.gradStudents.length +
      c.members.phdAlumni.length +
      c.members.msAlumni.length +
      1,
  },
  { href: "/admin/publications", key: "publications", icon: BookOpen, unit: "개", count: (c) => c.publications.length },
  { href: "/admin/news", key: "news", icon: Newspaper, unit: "개", count: (c) => c.news.length },
  { href: "/admin/gallery", key: "gallery", icon: Images, unit: "개", count: (c) => c.gallery.length },
  { href: "/admin/patents", key: "patents", icon: FileText, unit: "개", count: (c) => c.patents.length },
];

export default function AdminDashboardPage() {
  const { t, lang } = useLang();
  const { content } = useContent();

  return (
    <div>
      <div className="mb-5 flex gap-2">
        <LayoutDashboard
          size={24}
          strokeWidth={2}
          className="text-[#E88800] flex-shrink-0 mt-1"
          aria-hidden
        />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#080d1e] mb-1.5 flex items-baseline gap-1">
            <span>{t.admin.dashboard}</span>
            {lang === "KR" && (
              <span className="text-base font-normal text-[#9ca3af]">{t.admin.navEn.dashboard}</span>
            )}
          </h1>
          <p className="text-sm text-[#6b7280]">{t.admin.dashboardDesc}</p>
          {lang === "KR" && (
            <p className="text-xs text-[#9ca3af] mt-1">{t.admin.dashboardDescEn}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ href, key, icon: Icon, count, unit }) => (
          <Link
            key={href}
            href={href}
            className="card-hover group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:border-[#E88800]/40 flex items-center gap-5"
          >
            <div
              className="absolute inset-0 group-hover:bg-black/[0.025] transition-colors duration-300"
              aria-hidden
            />
            <div className="relative z-10 flex items-center gap-5 min-w-0 w-full">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#E88800]/10 text-[#E88800] group-hover:bg-[#E88800]/15 transition-colors">
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#9ca3af] mb-1.5 flex items-baseline gap-1">
                  <span>{t.admin[key]}</span>
                  {lang === "KR" && (
                    <span className="text-xs text-[#d1d5db]">{t.admin.navEn[key]}</span>
                  )}
                </p>
                <p className="text-3xl font-bold text-[#080d1e] leading-none flex items-baseline gap-0.5">
                  <span>{count(content)}</span>
                  {lang === "KR" && (
                    <span className="text-lg font-semibold text-[#6b7280]">{unit}</span>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
