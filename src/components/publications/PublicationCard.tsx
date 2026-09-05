"use client";

/** 논문 카드 — 제목·저자·저널 정보 (스타일: src/styles/publication.css) */

import { ExternalLink } from "lucide-react";
import type { Lang } from "@/i18n/translations";
import type { Publication } from "@/types/content";
import { publicationDoiLink } from "@/types/content";
import { formatPublicationDate } from "@/lib/content/display";

type Props = {
  pub: Publication;
  lang: Lang;
};

export default function PublicationCard({ pub, lang }: Props) {
  const doiHref = publicationDoiLink(pub);
  const pubDate = formatPublicationDate(pub);
  const titleKo = pub.titleKo.trim();
  const titleEn = pub.titleEn.trim();
  const title = lang === "KR" ? titleKo || titleEn : titleEn || titleKo;

  return (
    <article className="publication-card">
      <div className="card-head">
        <div className="meta-container">
          {pub.journal?.trim() && <span className="journal">{pub.journal}</span>}
          {pubDate && <span className="date">{pubDate}</span>}
        </div>
        {doiHref && (
          <a href={doiHref} target="_blank" rel="noreferrer" className="doi-link">
            <ExternalLink size={12} />
            DOI
          </a>
        )}
      </div>

      <h3 className="card-title">{title}</h3>

      <div>
        <p className="authors">{pub.authors}</p>
        {pub.doi ? (
          doiHref ? (
            <a href={doiHref} target="_blank" rel="noreferrer" className="doi">
              {pub.doi}
            </a>
          ) : (
            <p className="doi">{pub.doi}</p>
          )
        ) : null}
      </div>
    </article>
  );
}
