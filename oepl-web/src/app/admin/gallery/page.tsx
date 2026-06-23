"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { GalleryItem, GalleryCategory } from "@/types/content";
import { NEW_ID, isNewId } from "@/lib/data/ids";
import { inputClass } from "@/components/admin/form-styles";
import { AdminModal, AdminPageHeader, AdminRowActions, AdminTable, Field } from "@/components/admin/AdminUi";

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

  return (
    <>
      <AdminPageHeader title={t.admin.gallery} onAdd={() => setDraft(emptyGallery())} addLabel={t.admin.add} />
      <AdminTable headers={["Category", t.admin.colDate, t.admin.colTitle, ""]}>
        {content.gallery.map((item) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <td className="px-4 py-3 text-xs text-[#9ca3af]">{item.category}</td>
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">{item.date}</td>
            <td className="px-4 py-3 font-medium text-[#080d1e]">{item.title}</td>
            <td className="px-4 py-3">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => setDraft({ ...item })}
                onDelete={() => { if (confirm(t.admin.confirmDelete)) deleteGallery(item.id); }}
              />
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal
        open={!!draft}
        title={draft && !isNewId(draft.id) ? t.admin.edit : t.admin.add}
        onClose={() => setDraft(null)}
        onSubmit={() => { if (draft) { void upsertGallery({ ...draft, id: draft.id || NEW_ID }); setDraft(null); } }}
        submitLabel={t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {draft && (
          <>
            <Field label="Category">
              <select className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as GalleryCategory })}>
                <option value="Member">Member</option>
                <option value="Conference">Conference</option>
                <option value="기타">기타</option>
              </select>
            </Field>
            <Field label={t.admin.colDate}><input className={inputClass} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></Field>
            <Field label={t.admin.colTitle}><input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          </>
        )}
      </AdminModal>
    </>
  );
}
