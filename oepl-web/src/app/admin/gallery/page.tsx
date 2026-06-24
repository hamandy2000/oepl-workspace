"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { GalleryCategory, GalleryItem } from "@/types/content";
import { NEW_ID, isNewId } from "@/lib/data/ids";
import { formatNewsPostDate } from "@/lib/content/display";
import { inputClass } from "@/components/admin/form-styles";
import {
  AdminModal,
  AdminPageHeader,
  AdminMultiPhotoUpload,
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
  readContentPhotoPreview,
  removeGalleryPhoto,
  uploadGalleryPhoto,
  validateContentPhotoFile,
} from "@/lib/supabase/content-media";

const emptyGallery = (): GalleryItem => ({
  id: NEW_ID,
  title: "",
  date: "",
  category: "Member",
});

export default function AdminGalleryPage() {
  const { t } = useLang();
  const { content, upsertGallery, deleteGallery } = useContent();
  const [draft, setDraft] = useState<GalleryItem | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const filteredGallery = useMemo(
    () =>
      content.gallery.filter((item) =>
        adminMatchesSearch(search, [item.title, item.category, item.date])
      ),
    [content.gallery, search]
  );
  const { page, setPage, totalPages, paginate, rowOffset } = useAdminPagination(filteredGallery.length, search);
  const pagedGallery = paginate(filteredGallery);

  function resetPhotoDraft() {
    setPhotoPreview(null);
    setPendingPhotoFile(null);
    setPhotoRemoved(false);
  }

  function openDraft(item: GalleryItem) {
    resetPhotoDraft();
    setPhotoPreview(item.photoUrl || null);
    setDraft({ ...item });
  }

  function handlePhotosAdd(files: File[]) {
    const file = files[0];
    if (!file) return;
    const validationError = validateContentPhotoFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }
    setPendingPhotoFile(file);
    setPhotoRemoved(false);
    void readContentPhotoPreview(file).then(setPhotoPreview);
  }

  function handlePhotoRemove() {
    setPendingPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(true);
  }

  async function handleSubmit() {
    if (!draft) return;
    setSubmitting(true);
    try {
      const normalized: GalleryItem = {
        ...draft,
        id: draft.id || NEW_ID,
        date: !isNewId(draft.id) && draft.date.trim() ? draft.date : formatNewsPostDate(),
      };
      if (photoRemoved) {
        normalized.photoUrl = "";
      }

      let saved = await upsertGallery(normalized);
      setDraft((d) => (d ? { ...d, id: saved.id } : d));

      if (pendingPhotoFile) {
        const url = await uploadGalleryPhoto(saved.id, pendingPhotoFile);
        saved = await upsertGallery({ ...saved, photoUrl: url });
      } else if (photoRemoved && draft.photoUrl) {
        await removeGalleryPhoto(saved.id);
      }

      setDraft(null);
      resetPhotoDraft();
    } catch (err) {
      alert(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const photoItems = photoPreview ? [{ id: pendingPhotoFile ? "pending" : "saved", url: photoPreview }] : [];

  return (
    <>
      <AdminPageHeader
        title={t.admin.gallery}
        count={content.gallery.length}
        onAdd={() => {
          resetPhotoDraft();
          setDraft(emptyGallery());
        }}
        addLabel={t.admin.add}
      />
      <AdminTable
        headers={[t.admin.colNo, "Category", t.admin.colDate, t.admin.colTitle, ""]}
        toolbar={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <AdminTableSearch
              value={search}
              onChange={setSearch}
              placeholder={t.admin.searchPlaceholder}
            />
            {search.trim() && (
              <span className="text-xs text-[#9ca3af]">{t.admin.searchResult(filteredGallery.length)}</span>
            )}
          </div>
        }
      >
        {pagedGallery.map((item, index) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <AdminRowIndex index={rowOffset + index + 1} />
            <td className="px-4 py-3 text-xs text-[#9ca3af]">{item.category}</td>
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">{item.date}</td>
            <td className="px-4 py-3 font-medium text-[#080d1e]">{item.title}</td>
            <td className="px-4 py-3">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => openDraft(item)}
                onDelete={() => {
                  if (confirm(t.admin.confirmDelete)) deleteGallery(item.id);
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
          resetPhotoDraft();
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
            <Field label="Category">
              <select
                className={inputClass}
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as GalleryCategory })}
              >
                <option value="Member">Member</option>
                <option value="Conference">Conference</option>
                <option value="기타">기타</option>
              </select>
            </Field>
            <Field label={t.admin.colTitle}>
              <input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="Photo">
              <AdminMultiPhotoUpload
                items={photoItems}
                onAdd={handlePhotosAdd}
                onRemove={() => handlePhotoRemove()}
                selectLabel="사진 선택"
                maxItems={1}
              />
            </Field>
          </>
        )}
      </AdminModal>
    </>
  );
}
