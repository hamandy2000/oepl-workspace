"use client";

/** 연구 분야 카드 — 클릭 시 상세 오버레이 (스타일: src/styles/about.css) */

import { researchAreaImage } from "@/lib/content/research-images";

type ResearchArea = {
  tag: string;
  title: string;
  desc: string;
  detail: string;
};

const isEla = (tag: string) => tag === "ELA";

function OverlayContent({ area }: { area: ResearchArea }) {
  return (
    <>
      <div className="overlay-head">
        <span className="tag">{area.tag}</span>
        <h3 className="card-title">{area.title}</h3>
      </div>
      <div className="detail">{area.detail}</div>
    </>
  );
}

function CardBody({ area, image }: { area: ResearchArea; image: string | null }) {
  return (
    <>
      <div className="cover">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="cover-img" />
        ) : null}
      </div>

      <div className="card-body">
        <span className="tag">{area.tag}</span>
        <h3 className="card-title">{area.title}</h3>
        <p className="card-desc">{area.desc}</p>
      </div>
    </>
  );
}

export default function ResearchAreaCard({
  area,
  expanded,
  onToggle,
}: {
  area: ResearchArea;
  expanded: boolean;
  onToggle: () => void;
}) {
  const image = researchAreaImage(area.tag) ?? null;
  const elaExpanded = expanded && isEla(area.tag);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="area-card card-hover"
    >
      {elaExpanded ? (
        <div className="stack">
          <div className="stack-ghost" aria-hidden>
            <CardBody area={area} image={image} />
          </div>
          <div className="overlay stack-overlay">
            <OverlayContent area={area} />
          </div>
        </div>
      ) : (
        <>
          <CardBody area={area} image={image} />
          {expanded && (
            <div className="overlay">
              <OverlayContent area={area} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
