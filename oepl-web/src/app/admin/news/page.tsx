"use client";

import { Pin } from "lucide-react";
import { useMemo, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { ContentPhoto, NewsFile, NewsItem } from "@/types/content";
import { NEW_ID, isNewId } from "@/lib/data/ids";
import { sortNewsItems, formatNewsPostDate, formatCreatedAtMinute } from "@/lib/content/display";
import { inputClass } from "@/components/admin/form-styles";
import {
  AdminAttachmentUpload,
  AdminModal,
  AdminMultiPhotoUpload,
  AdminPageHeader,
  AdminRowActions,
  AdminRowIndex,
  AdminTable,
  AdminTablePagination,
  AdminTableSearch,
  adminMatchesSearch,
  Field,
  useAdminPagination,
} from "@/components/admin/AdminUi";
import {
  buildLocalNewsMedia,
  syncNewsMedia,
  type NewsMediaDraft,
} from "@/lib/data/media-sync";
import {
  readContentPhotoPreview,
  validateContentPhotoFile,
  validateNewsFile,
} from "@/lib/supabase/content-media";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const emptyNews = (): NewsItem => ({
  id: NEW_ID,
  type: "News",
  date: "",
  title: "",
  detail: "",
  author: "관리자",
  viewCount: 0,
  pinned: false,
  photos: [],
  files: [],
});

type PendingPhoto = { key: string; file: File; preview: string };
type PendingFile = { key: string; file: File };

export default function AdminNewsPage() {
  const { t } = useLang();
  const { content, upsertNews, deleteNews } = useContent();
  const sortedNews = useMemo(() => sortNewsItems(content.news), [content.news]);
  const [draft, setDraft] = useState<NewsItem | null>(null);
  const [keptPhotos, setKeptPhotos] = useState<ContentPhoto[]>([]);
  const [keptFiles, setKeptFiles] = useState<NewsFile[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [removedPhotoIds, setRemovedPhotoIds] = useState<number[]>([]);
  const [removedFileIds, setRemovedFileIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const filteredNews = useMemo(
    () =>
      sortedNews.filter((item) =>
        adminMatchesSearch(search, [
          item.title,
          item.detail,
          item.date,
          item.author,
          formatCreatedAtMinute(item.createdAt),
          item.pinned ? t.admin.noticePinned : t.admin.noticeOff,
        ])
      ),
    [sortedNews, search, t.admin.noticePinned, t.admin.noticeOff]
  );
  const { page, setPage, totalPages, paginate, rowOffset } = useAdminPagination(filteredNews.length, search);
  const pagedNews = paginate(filteredNews);

  function resetMediaDraft() {
    setKeptPhotos([]);
    setKeptFiles([]);
    setPendingPhotos([]);
    setPendingFiles([]);
    setRemovedPhotoIds([]);
    setRemovedFileIds([]);
  }

  function openDraft(item: NewsItem) {
    resetMediaDraft();
    setKeptPhotos(item.photos);
    setKeptFiles(item.files);
    setDraft({ ...item });
  }

  function handlePhotosAdd(files: File[]) {
    void (async () => {
      const valid: File[] = [];
      for (const file of files) {
        const validationError = validateContentPhotoFile(file);
        if (validationError) {
          alert(validationError);
          continue;
        }
        valid.push(file);
      }
      if (valid.length === 0) return;

      const added = await Promise.all(
        valid.map(async (file, i) => ({
          key: `p-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          preview: await readContentPhotoPreview(file),
        }))
      );
      setPendingPhotos((prev) => [...prev, ...added]);
    })();
  }

  function handlePhotoRemove(id: number | string) {
    if (typeof id === "string") {
      setPendingPhotos((prev) => prev.filter((p) => p.key !== id));
      return;
    }
    setRemovedPhotoIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function handleFilesAdd(files: File[]) {
    const added: PendingFile[] = [];
    for (const file of files) {
      const validationError = validateNewsFile(file);
      if (validationError) {
        alert(validationError);
        continue;
      }
      added.push({
        key: `f-${Date.now()}-${added.length}-${Math.random().toString(36).slice(2, 7)}`,
        file,
      });
    }
    if (added.length > 0) {
      setPendingFiles((prev) => [...prev, ...added]);
    }
  }

  function handleFileRemove(id: number | string) {
    if (typeof id === "string") {
      setPendingFiles((prev) => prev.filter((f) => f.key !== id));
      return;
    }
    setRemovedFileIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  const photoItems = [
    ...keptPhotos
      .filter((p) => !removedPhotoIds.includes(p.id))
      .map((p) => ({ id: p.id, url: p.url })),
    ...pendingPhotos.map((p) => ({ id: p.key, url: p.preview })),
  ];

  const fileItems = [
    ...keptFiles
      .filter((f) => !removedFileIds.includes(f.id))
      .map((f) => ({ id: f.id, fileName: f.fileName })),
    ...pendingFiles.map((f) => ({ id: f.key, fileName: f.file.name })),
  ];

  async function handleSubmit() {
    if (!draft) return;
    setSubmitting(true);
    try {
      const now = new Date();
      const normalized: NewsItem = {
        ...draft,
        id: draft.id || NEW_ID,
        type: draft.type || "News",
        author: "관리자",
        date: draft.date.trim() || formatNewsPostDate(now),
        createdAt: draft.createdAt || now.toISOString(),
        photos: [],
        files: [],
      };

      let saved = await upsertNews(normalized);

      const mediaDraft: NewsMediaDraft = {
        keptPhotos,
        keptFiles,
        removedPhotoIds,
        removedFileIds,
        newPhotoFiles: pendingPhotos.map((p) => p.file),
        newFiles: pendingFiles.map((f) => f.file),
      };

      const media = isSupabaseConfigured()
        ? await syncNewsMedia(saved.id, mediaDraft)
        : await buildLocalNewsMedia(mediaDraft);

      saved = await upsertNews({
        ...saved,
        date: saved.date?.trim() || normalized.date,
        createdAt: saved.createdAt ?? normalized.createdAt,
        photos: media.photos,
        files: media.files,
      });

      setDraft(null);
      resetMediaDraft();
    } catch (err) {
      alert(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        title={t.admin.news}
        count={content.news.length}
        onAdd={() => {
          resetMediaDraft();
          setDraft(emptyNews());
        }}
        addLabel={t.admin.add}
      />
      <AdminTable
        headers={[t.admin.colNo, t.admin.colDate, t.admin.colTitle, t.admin.pinned, ""]}
        toolbar={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <AdminTableSearch
              value={search}
              onChange={setSearch}
              placeholder={t.admin.searchPlaceholder}
            />
            {search.trim() && (
              <span className="text-xs text-[#9ca3af]">{t.admin.searchResult(filteredNews.length)}</span>
            )}
          </div>
        }
      >
        {pagedNews.map((item, index) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <AdminRowIndex index={rowOffset + index + 1} />
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">
              {(formatCreatedAtMinute(item.createdAt) ?? item.date) || "—"}
            </td>
            <td className="px-4 py-3 font-medium text-[#080d1e]">{item.title}</td>
            <td className="px-4 py-3 text-xs">
              {item.pinned ? (
                <span
                  className="inline-flex items-center justify-center text-[#E88800]"
                  title={t.admin.noticePinned}
                  aria-label={t.admin.noticePinned}
                >
                  <Pin size={14} className="fill-current" strokeWidth={2.5} />
                </span>
              ) : (
                <span className="text-[#d1d5db]">—</span>
              )}
            </td>
            <td className="px-4 py-3">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => openDraft(item)}
                onDelete={() => {
                  if (confirm(t.admin.confirmDelete)) deleteNews(item.id);
                }}
              />
            </td>
          </tr>
        ))}
      </AdminTable>
      <AdminTablePagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <AdminModal
        open={!!draft}
        title={draft && !isNewId(draft.id) ? t.admin.edit : t.admin.add}
        onClose={() => {
          resetMediaDraft();
          setDraft(null);
        }}
        onSubmit={() => {
          void handleSubmit();
        }}
        submitLabel={submitting ? t.admin.saving : t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {draft && (
          <>
            <Field label={t.admin.colTitle}>
              <input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label={t.admin.noticeSetting}>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-[#374151]">
                  <input
                    type="radio"
                    name="notice-setting"
                    checked={!draft.pinned}
                    onChange={() => setDraft({ ...draft, pinned: false })}
                    className="border-gray-300 text-[#E88800] focus:ring-[#E88800]"
                  />
                  {t.admin.noticeOff}
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-[#374151]">
                  <input
                    type="radio"
                    name="notice-setting"
                    checked={draft.pinned}
                    onChange={() => setDraft({ ...draft, pinned: true })}
                    className="border-gray-300 text-[#E88800] focus:ring-[#E88800]"
                  />
                  {t.admin.noticePinned}
                </label>
              </div>
            </Field>
            <Field label="Detail">
              <textarea
                className={`${inputClass} min-h-[160px] resize-y`}
                rows={6}
                value={draft.detail}
                onChange={(e) => setDraft({ ...draft, detail: e.target.value })}
              />
            </Field>
            <Field label="Photos">
              <AdminMultiPhotoUpload items={photoItems} onAdd={handlePhotosAdd} onRemove={handlePhotoRemove} />
            </Field>
            <Field label="Files">
              <AdminAttachmentUpload items={fileItems} onAdd={handleFilesAdd} onRemove={handleFileRemove} />
            </Field>
          </>
        )}
      </AdminModal>
    </>
  );
}
