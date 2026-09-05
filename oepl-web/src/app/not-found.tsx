"use client";

/** 404 Not Found 페이지 (스타일: src/styles/not-found.css) */

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/contexts/LangContext";

export default function NotFound() {
  const { t, lang } = useLang();
  const copy = t.notFoundPage;

  return (
    <>
      <Header />
      <main className="notfound-main">
        <section className="notfound-container">
          <p className="code">404</p>
          <h1 className="notfound-title">
            <span>{copy.title}</span>
            {lang === "KR" && <span className="title-en">{copy.titleEn}</span>}
          </h1>
          <p className="desc">{copy.desc}</p>
          {lang === "KR" && <p className="desc-en">{copy.descEn}</p>}
          <Link href="/" className="btn-primary btn-strong home-btn">
            {copy.backHome}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
