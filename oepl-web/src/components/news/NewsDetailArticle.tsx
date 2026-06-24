"use client";

import { Download, Eye, FileText, Paperclip, User } from "lucide-react";
import type { ContentPhoto, NewsFile } from "@/types/content";
import type { Lang } from "@/i18n/translations";
import {
  fileExtension,
  fileExtensionStyle,
  withNewsDesignPreview,
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

export default function NewsDetailArticle({ display, viewCount, lang, labels, isLatest, isPinned }: Props) {
  const { photos } = withNewsDesignPreview(display.photos, display.files);
  const attachments = display.files;
  const locale = lang === "KR" ? "ko-KR" : "en-US";
  const authorName = resolveAuthor(display.author, labels.defaultAuthor);

  return (
    <article className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl md:text-[1.75rem] font-bold text-[#080d1e] leading-snug mb-5 flex items-start gap-2 flex-wrap">
          {isPinned && <NewsPinnedBadge label={labels.badgePinned} className="mt-1.5 md:mt-2" />}
          {isLatest && <NewsNewBadge label={labels.badgeNew} className="mt-1.5 md:mt-2" />}
          {display.title}
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 px-4 mb-6 rounded-xl bg-[#f9fafb] border border-gray-100 text-xs text-[#6b7280]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <User size={14} className="text-[#9ca3af]" />
              <span className="text-[#9ca3af]">{labels.author}</span>
              <span className="font-medium text-[#374151]">{authorName}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye size={14} className="text-[#9ca3af]" />
              <span className="text-[#9ca3af]">{labels.views}</span>
              <span className="font-medium text-[#374151] tabular-nums">
                {viewCount.toLocaleString(locale)}
              </span>
            </span>
          </div>
          <time className="inline-flex items-center gap-1.5 shrink-0 ml-auto tabular-nums">
            <span className="text-[#9ca3af]">{labels.postedDate}</span>
            <span className="font-medium text-[#374151]">{display.date}</span>
          </time>
        </div>

        <div className="text-[15px] text-[#4b5563] leading-[1.85] whitespace-pre-wrap mb-8">
          {display.detail}
        </div>

        {photos.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-xl overflow-hidden border border-gray-100 bg-[#f9fafb]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" className="w-full h-auto block" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-gray-100">
          <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#080d1e] mb-4">
            <Paperclip size={15} className="text-[#E88800]" />
            {labels.attachments}
            {attachments.length > 0 && (
              <span className="text-xs font-normal text-[#9ca3af]">({attachments.length})</span>
            )}
          </h3>

          {attachments.length === 0 ? (
            <p className="text-sm text-[#9ca3af] text-center py-2">{labels.noAttachments}</p>
          ) : (
            <ul className="flex flex-col gap-2">
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
                      className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-[#fafafa] px-4 py-3 hover:border-[#E88800]/30 hover:bg-[#FFF7EB]/40 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: style.bg }}
                      >
                        <FileText size={18} style={{ color: style.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#374151] truncate group-hover:text-[#E88800] transition-colors">
                          {file.fileName}
                        </p>
                        <p className="text-[10px] font-semibold mt-0.5" style={{ color: style.color }}>
                          {ext}
                        </p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-[#E88800] px-3 py-1.5 rounded-lg border border-[#E88800]/20 bg-white group-hover:bg-[#E88800] group-hover:text-white transition-colors">
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
