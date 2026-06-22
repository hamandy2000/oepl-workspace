import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import ResearchSection from "@/components/ResearchSection";
import FocusSection from "@/components/FocusSection";
import NewsSection from "@/components/NewsSection";
import PublicationsSection from "@/components/PublicationsSection";
import FooterCTA from "@/components/FooterCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* 01 – 히어로 배너 (Figma: banner-section) */}
        <HeroSection />

        {/* 02 – 연구실 소개 (Figma: introduce-section) */}
        <IntroSection />

        {/* 03 – Our Focus (422:21 디자인) */}
        <FocusSection />

        {/* 04 – 연구 분야 소개 (Figma: features-section) */}
        <ResearchSection />

        {/* 05 – 최근 소식 (Figma: news-section) */}
        <NewsSection />

        {/* 06 – 논문 목록 (422:21 디자인) */}
        <PublicationsSection />
      </main>

      {/* 07 – Footer (Figma: footer-section) */}
      <FooterCTA />
    </>
  );
}
