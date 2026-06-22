"use client";

import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/contexts/LangContext";

const navLinks = [
  { label: "Home",        href: "/" },
  { label: "About",       href: "/about" },
  { label: "Members",     href: "/members" },
  { label: "Publication", href: "/publication" },
  { label: "News",        href: "/news" },
  { label: "Gallery",     href: "/gallery" },
  { label: "Contact",     href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white border-b border-gray-200 shadow-sm"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/oepl-logo.png"
            alt="OEPL — Organic Electronic Physics Laboratory"
            width={120}
            height={40}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#6b7280] hover:text-[#080d1e] text-sm font-medium transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#E88800] group-hover:w-full transition-all duration-200" />
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Login */}
          <a
            href="#"
            className="px-4 py-1.5 text-xs font-medium border border-gray-200 text-[#6b7280] rounded-full hover:border-[#E88800]/60 hover:text-[#080d1e] transition-all"
          >
            {t.header.login}
          </a>

          {/* Language switcher */}
          <div className="flex items-center gap-1.5" aria-label="Switch language">
            <Globe size={14} strokeWidth={1.8} className="text-[#6b7280]" />
            <button
              onClick={() => setLang("KR")}
              className={`text-xs font-semibold transition-colors ${
                lang === "KR" ? "text-[#E88800]" : "text-[#9ca3af] hover:text-[#080d1e]"
              }`}
            >
              KO
            </button>
            <span className="text-[#d1d5db] text-xs">|</span>
            <button
              onClick={() => setLang("EN")}
              className={`text-xs font-semibold transition-colors ${
                lang === "EN" ? "text-[#E88800]" : "text-[#9ca3af] hover:text-[#080d1e]"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#6b7280] hover:text-[#080d1e]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 shadow-lg">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#6b7280] hover:text-[#E88800] text-sm font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
