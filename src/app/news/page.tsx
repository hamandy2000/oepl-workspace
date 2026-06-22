import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import NewsSection from "@/components/NewsSection";

export default function NewsPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <NewsSection />
      </main>
      <FooterCTA />
    </>
  );
}
