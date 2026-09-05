"use client";

/** Gallery 페이지 — 카테고리 필터 + 페이지네이션 (스타일: src/styles/gallery.css, list.css) */

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { GalleryCategory } from "@/types/content";
import { galleryCoverPhoto } from "@/lib/content/display";
import PageBanner from "@/components/PageBanner";

type Category = "전체" | GalleryCategory;

const categories: Category[] = ["전체", "Member", "Conference", "기타"];
const PER_PAGE = 9;

/** 카테고리별 배지 색 — 기타는 기본값이라 별도 클래스가 없다 */
const CATEGORY_CLASS: Record<GalleryCategory, string> = {
  Member: "category is-member",
  Conference: "category is-conference",
  기타: "category",
};

export default function GalleryPage() {
  const { t } = useLang();
  const { content } = useContent();
  const photos = content.gallery;
  const [category, setCategory] = useState<Category>("전체");
  const [page, setPage] = useState(1);

  const filtered = category === "전체" ? photos : photos.filter((p) => p.category === category);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function selectCategory(c: Category) {
    setCategory(c);
    setPage(1);
  }

  function changePage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Header />
      <main className="page-main">
        <PageBanner title={t.gallery.banner} />

        <section className="gallery-section section-y">
          <div className="section-wrapper">
            <div className="filter-container gallery-filter-container">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className={category === cat ? "filter-btn is-active" : "filter-btn"}
                >
                  {t.gallery.categoryLabels[cat] ?? cat}
                </button>
              ))}
            </div>

            <p className="list-count is-right">{t.gallery.count(filtered.length)}</p>

            <div className="gallery-grid-container">
              {paginated.map((photo) => {
                const cover = galleryCoverPhoto(photo);
                return (
                  <article key={photo.id} className="gallery-card">
                    <div className="cover">
                      <div className="cover-inner">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cover} alt="" className="cover-img" />
                        ) : (
                          <ImageIcon className="cover-placeholder" strokeWidth={1.5} aria-hidden />
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="meta-container">
                        <span className={CATEGORY_CLASS[photo.category]}>{photo.category}</span>
                        <span className="date">{photo.date}</span>
                      </div>
                      <p className="gallery-title">{photo.title}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            {paginated.length === 0 && (
              <div className="gallery-empty-container">
                <p>{t.gallery.empty}</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination-container is-loose">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className="page-btn is-nav"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={13} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={p === page ? "page-btn is-active" : "page-btn"}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  className="page-btn is-nav"
                  aria-label="Next page"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
