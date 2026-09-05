/** 배너 유리 스트립 장식 — 히어로/페이지 배너 공용 (스타일: src/styles/glass-strips.css) */

export const GLASS_STRIP_COUNT_MOBILE = 10;
export const GLASS_STRIP_COUNT_DESKTOP = 18;

function GlassStripRow({ count }: { count: number }) {
  const stripWidth = 100 / count;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="strip"
          // 개수에 따라 폭이 달라지므로 계산 값만 인라인으로 둔다
          style={{
            width: `calc(${stripWidth}% + 1px)`,
            marginRight: i < count - 1 ? -1 : 0,
          }}
          aria-hidden
        />
      ))}
    </>
  );
}

export default function BannerGlassStrips({
  variant = "hero",
}: {
  variant?: "hero" | "page";
}) {
  const base = variant === "page" ? "glass-strips is-page" : "glass-strips";

  return (
    <>
      <div className={`${base} is-mobile`} aria-hidden>
        <GlassStripRow count={GLASS_STRIP_COUNT_MOBILE} />
      </div>
      <div className={`${base} is-desktop`} aria-hidden>
        <GlassStripRow count={GLASS_STRIP_COUNT_DESKTOP} />
      </div>
    </>
  );
}
