/** 서브페이지 상단 배너 — 제목 + 타원·유리 스트립 장식 (스타일: src/styles/page-banner.css) */

import BannerGlassStrips from "@/components/banner/BannerGlassStrips";

type Props = {
  title: string;
};

export default function PageBanner({ title }: Props) {
  return (
    <section className="page-banner">
      <div className="page-banner-wrapper">
        {/* Figma 642:625 @ top 134px */}
        <div className="ellipse is-wide" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banner/ellipse-61.svg" alt="" className="ellipse-img" draggable={false} />
        </div>

        {/* Figma 642:628 @ top 97px */}
        <div className="ellipse is-center" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/banner/ellipse-62.svg" alt="" className="ellipse-img" draggable={false} />
        </div>

        <div className="glass-container" aria-hidden>
          <BannerGlassStrips variant="page" />
        </div>

        <h1 className="page-title">{title}</h1>
      </div>
    </section>
  );
}
