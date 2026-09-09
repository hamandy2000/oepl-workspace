"use client";

/** 공통 헤더 — 로고, 내비게이션, 언어 전환 (스타일: src/styles/header.css) */

import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LangContext";

const navLinks = [
  { label: "Home",        href: "/" },
  { label: "Research",    href: "/about" },
  { label: "Members",     href: "/members" },
  { label: "Publication", href: "/publication" },
  { label: "News",        href: "/news" },
  { label: "Gallery",     href: "/gallery" },
  { label: "Contact",     href: "/contact" },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function LogoContainer({
  priority = false,
  compact = false,
  onLabLogoClick,
}: {
  priority?: boolean;
  compact?: boolean;
  onLabLogoClick?: () => void;
}) {
  return (
    <div className={compact ? "logo-container is-compact" : "logo-container"}>
      <a
        href="https://www.ulsan.ac.kr/"
        target="_blank"
        rel="noopener noreferrer"
        className="logo-link"
        aria-label="University of Ulsan"
      >
        <Image
          src="/ulsan-university-logo.png"
          alt="University of Ulsan"
          width={180}
          height={48}
          className="logo-img"
          priority={priority}
        />
      </a>
      <span className="logo-bar" aria-hidden />
      <Link href="/" className="logo-link" onClick={onLabLogoClick}>
        <Image
          src="/oepl-logo.png"
          alt="OEPL — Organic Electronic Physics Laboratory"
          width={132}
          height={44}
          className="logo-img"
          priority={priority}
        />
      </Link>
    </div>
  );
}

function LangSwitch({
  lang,
  onSelect,
}: {
  lang: string;
  onSelect: (next: "KR" | "EN") => void;
}) {
  return (
    <div className="lang" aria-label="Switch language">
      <Globe size={16} strokeWidth={1.8} className="lang-icon" />
      <button
        type="button"
        onClick={() => onSelect("KR")}
        className={lang === "KR" ? "lang-btn is-active" : "lang-btn"}
      >
        KO
      </button>
      <span className="lang-bar">|</span>
      <button
        type="button"
        onClick={() => onSelect("EN")}
        className={lang === "EN" ? "lang-btn is-active" : "lang-btn"}
      >
        EN
      </button>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();

  // --- 동작 정의 (마크업에는 이름만 남긴다) ---
  const openMenu = () => setMobileOpen(true);
  const closeMenu = () => setMobileOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className={scrolled ? "header is-scrolled" : "header"}>
      <div className="header-wrapper">
        <LogoContainer priority />

        <nav className="header-nav-container">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="nav-link">
              {link.label}
              <span className="nav-line" />
            </Link>
          ))}
        </nav>

        <div className="header-util-container">
          <Link href="/login" className="btn-outline btn-sm">
            {t.header.login}
          </Link>
          <LangSwitch lang={lang} onSelect={setLang} />
        </div>

        <button
          type="button"
          className="header-menu-btn"
          onClick={openMenu}
          aria-expanded={mobileOpen}
          aria-controls="mobile-header"
          aria-label="Open menu"
        >
          <Menu size={22} aria-hidden />
        </button>
      </div>

      {/* 모바일 헤더 — Figma 558:460 (dim + 우측 패널) */}
      {mobileOpen && (
        <>
          <button
            type="button"
            className="mobile-header-dim"
            aria-label="Close menu overlay"
            onClick={closeMenu}
          />

          <aside
            id="mobile-header"
            className="mobile-header"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="mobile-header-wrapper">
              <div className="mobile-header-head-container">
                <LogoContainer compact onLabLogoClick={closeMenu} />
                <button
                  type="button"
                  className="close-btn"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <X size={22} aria-hidden />
                </button>
              </div>

              <nav className="mobile-header-nav-container">
                {navLinks.map((link) => {
                  const active = isNavActive(pathname, link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={active ? "nav-link is-active" : "nav-link"}
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <Link href="/login" className="btn-outline btn-block" onClick={closeMenu}>
                  {t.header.login}
                </Link>
              </nav>

              <div className="mobile-header-util-container">
                <div className="divider" />
                <LangSwitch lang={lang} onSelect={setLang} />
                <div className="info">
                  <p>Organic Electronic Physics Laboratory</p>
                  <a href="mailto:sucho@ulsan.ac.kr" className="info-link">
                    sucho@ulsan.ac.kr
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
