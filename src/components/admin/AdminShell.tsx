"use client";

/** 관리자 공통 셸 — 사이드바 내비게이션과 로그아웃 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  Newspaper,
  Images,
  FileText,
  Globe,
  PanelLeftClose,
  PanelLeft,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";
import { useLang } from "@/contexts/LangContext";
import { headerBtnClass } from "@/components/admin/form-styles";

const nav = [
  { href: "/admin", labelKey: "dashboard" as const, icon: LayoutDashboard, exact: true },
  { href: "/admin/members", labelKey: "members" as const, icon: Users },
  { href: "/admin/publications", labelKey: "publications" as const, icon: BookOpen },
  { href: "/admin/news", labelKey: "news" as const, icon: Newspaper },
  { href: "/admin/gallery", labelKey: "gallery" as const, icon: Images },
  { href: "/admin/patents", labelKey: "patents" as const, icon: FileText },
  { href: "/admin/account", labelKey: "account" as const, icon: KeyRound },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { t, lang } = useLang();
  const { saving } = useContent();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setSidebarOpen(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  function handleLogout() {
    void logout().then(() => router.replace("/login"));
  }

  function closeSidebarOnMobile() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setSidebarOpen(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#080d1e] flex">
      {sidebarOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-56 flex-shrink-0 bg-[#080d1e] text-white flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <Link
              href="/"
              className="inline-block"
              aria-label="OEPL — Organic Electronic Physics Laboratory"
              onClick={closeSidebarOnMobile}
            >
              <span
                className="block h-9 aspect-[120/40] bg-brand [mask-image:url(/oepl-logo.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:left_center] [-webkit-mask-image:url(/oepl-logo.png)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:left_center]"
                aria-hidden
              />
            </Link>
            <button
              type="button"
              className="p-1 text-white/60 hover:text-white transition-colors shrink-0"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <PanelLeftClose size={18} aria-hidden />
            </button>
          </div>
          <p className="font-semibold text-base">{t.admin.title}</p>
          <p className="text-sm text-white/50 mt-1">{t.admin.titleEn}</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {nav.map(({ href, labelKey, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebarOnMobile}
                className={`flex items-center gap-2.5 px-3 py-3.5 rounded-xl text-sm transition-colors ${
                  active ? "bg-[#E88800] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="flex items-baseline gap-1 min-w-0 leading-snug">
                  <span>{t.admin[labelKey]}</span>
                  {lang === "KR" && (
                    <span
                      className={`text-2xs font-normal ${
                        active ? "text-white/75" : "text-white/40"
                      }`}
                    >
                      {t.admin.navEn[labelKey]}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 bg-[#f9fafb] flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center justify-center size-9 rounded-lg border border-gray-200 text-[#6b7280] hover:text-[#080d1e] hover:border-[#E88800]/40 transition-colors"
                aria-expanded={sidebarOpen}
                aria-label="Open sidebar"
              >
                <PanelLeft size={18} aria-hidden />
              </button>
            )}
            {saving && (
              <span className="text-xs text-[#E88800]">{t.admin.saving}</span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className={`${headerBtnClass} inline-flex items-center gap-1.5`}>
              <Globe size={14} aria-hidden />
              <span className="hidden sm:inline">{t.admin.viewSite}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className={`${headerBtnClass} inline-flex items-center gap-1.5`}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">{t.admin.logout}</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 pb-12 bg-[#f9fafb]">{children}</main>
      </div>
    </div>
  );
}
