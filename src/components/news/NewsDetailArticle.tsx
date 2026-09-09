"use client";

/** 뉴스 상세 본문 — 메타 정보·사진·첨부파일 (스타일: src/styles/news-detail.css) */

import { Download, Eye, FileText, Paperclip, User } from "lucide-react";
import type { ContentPhoto, NewsFile } from "@/types/content";
import type { Lang } from "@/i18n/translations";
import {
  fileExtension,
  fileExtensionStyle,
} from "@/components/news/news-detail-preview";
import NewsNewBadge from "@/components/news/NewsNewBadge";
import NewsPinnedBadge from "@/components/news/NewsPinnedBadge";

type Display = {
  type: string;
  date: string;
  title: string;
  detail: string;
  author: string;
  viewCount: number;
  photos: ContentPhoto[];
  files: NewsFile[];
};

type Props = {
  display: Display;
  viewCount: number;
  lang: Lang;
  labels: {
    author: string;
    views: string;
    postedDate: string;
    defaultAuthor: string;
    attachments: string;
    noAttachments: string;
    download: string;
    badgeNew: string;
    badgePinned: string;
  };
  isLatest?: boolean;
  isPinned?: boolean;
};

function resolveAuthor(author: string, defaultAuthor: string): string {
  const trimmed = author.trim();
  if (!trimmed || trimmed === "OEPL") return defaultAuthor;
  return trimmed;
}

export default function NewsDetailArticle({
  display,
  viewCount,
  lang,
  labels,
  isLatest,
  isPinned,
}: Props) {
  const photos = display.photos;
  const attachments = display.files;
  const locale = lang === "KR" ? "ko-KR" : "en-US";
  const authorName = resolveAuthor(display.author, labels.defaultAuthor);

  return (
    <article className="news-article">
      <div className="article-inner">
        <h2 className="article-title">
          {isPinned && <NewsPinnedBadge label={labels.badgePinned} className="is-offset" />}
          {isLatest && <NewsNewBadge label={labels.badgeNew} className="is-offset" />}
          {display.title}
        </h2>

        <div className="meta-bar">
          <div className="meta-group">
            <span className="meta-item">
              <User size={14} className="meta-icon" />
              <span className="meta-label">{labels.author}</span>
              <span className="meta-value">{authorName}</span>
            </span>
            <span className="meta-item">
              <Eye size={14} className="meta-icon" />
              <span className="meta-label">{labels.views}</span>
              <span className="meta-value is-num">{viewCount.toLocaleString(locale)}</span>
            </span>
          </div>
          <time className="meta-item is-date">
            <span className="meta-label">{labels.postedDate}</span>
            <span className="meta-value">{display.date}</span>
          </time>
        </div>

        <div className="article-body">{display.detail}</div>

        {photos.length > 0 && (
          <div className="photo-container">
            {photos.map((photo) => (
              <div key={photo.id} className="photo-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="photo-img" />
              </div>
            ))}
          </div>
        )}

        <div className="attach-container">
          <h3 className="attach-title">
            <Paperclip size={15} className="attach-icon" />
            {labels.attachments}
            {attachments.length > 0 && (
              <span className="attach-count">({attachments.length})</span>
            )}
          </h3>

          {attachments.length === 0 ? (
            <p className="attach-empty">{labels.noAttachments}</p>
          ) : (
            <ul className="attach-list">
              {attachments.map((file) => {
                const ext = fileExtension(file.fileName);
                const style = fileExtensionStyle(ext);

                return (
                  <li key={file.id}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={file.fileName}
                      className="attach-item"
                    >
                      {/* 확장자별 색은 데이터에서 오므로 인라인으로 둔다 */}
                      <div className="attach-icon-box" style={{ background: style.bg }}>
                        <FileText size={18} style={{ color: style.color }} />
                      </div>
                      <div className="attach-text">
                        <p className="attach-name">{file.fileName}</p>
                        <p className="attach-ext" style={{ color: style.color }}>
                          {ext}
                        </p>
                      </div>
                      <span className="attach-download">
                        <Download size={13} />
                        {labels.download}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
