"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Users, BookOpen, Newspaper, Images, FileText } from "lucide-react";
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
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useLang();
  const { saving } = useContent();

  function handleLogout() {
    void logout().then(() => router.replace("/login"));
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#080d1e] flex">
      <aside className="w-56 flex-shrink-0 bg-[#080d1e] text-white flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <Link
            href="/"
            className="inline-block mb-2"
            aria-label="OEPL — Organic Electronic Physics Laboratory"
          >
            <span
              className="block h-7 aspect-[120/40] bg-brand [mask-image:url(/oepl-logo.png)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:left_center] [-webkit-mask-image:url(/oepl-logo.png)] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:left_center]"
              aria-hidden
            />
          </Link>
          <p className="font-semibold text-sm">{t.admin.title}</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {nav.map(({ href, labelKey, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active ? "bg-[#E88800] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {t.admin[labelKey]}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 min-w-0 bg-[#f9fafb] flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            {saving && (
              <span className="text-xs text-[#E88800]">{t.admin.saving}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className={headerBtnClass}>
              {t.admin.viewSite}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className={`${headerBtnClass} inline-flex items-center gap-1.5`}
            >
              <LogOut size={14} />
              {t.admin.logout}
            </button>
          </div>
        </header>
        <main className="flex-1 p-8 pb-12 bg-[#f9fafb]">{children}</main>
      </div>
    </div>
  );
}
