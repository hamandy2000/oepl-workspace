"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { Publication } from "@/types/content";
import { NEW_ID, isNewId } from "@/lib/data/ids";
import { publicationYear } from "@/lib/content/display";
import { inputClass } from "@/components/admin/form-styles";
import { AdminModal, AdminPageHeader, AdminRowActions, AdminTable, Field } from "@/components/admin/AdminUi";

const emptyPub = (): Publication => ({
  id: NEW_ID,
  type: "Journal",
  titleKo: "",
  titleEn: "",
  authors: "",
  journal: "",
  doi: "",
});

export default function AdminPublicationsPage() {
  const { t } = useLang();
  const { content, upsertPublication, deletePublication } = useContent();
  const [draft, setDraft] = useState<Publication | null>(null);

  return (
    <>
      <AdminPageHeader title={t.admin.publications} onAdd={() => setDraft(emptyPub())} addLabel={t.admin.add} />
      <AdminTable headers={["Year", t.admin.colTitle, ""]}>
        {content.publications.map((item) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">{publicationYear(item) ?? "—"}</td>
            <td className="px-4 py-3 font-medium text-[#080d1e]">{item.titleKo || item.titleEn}</td>
            <td className="px-4 py-3">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => setDraft({ ...item })}
                onDelete={() => { if (confirm(t.admin.confirmDelete)) deletePublication(item.id); }}
              />
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal
        open={!!draft}
        title={draft && !isNewId(draft.id) ? t.admin.edit : t.admin.add}
        onClose={() => setDraft(null)}
        onSubmit={() => { if (draft) { void upsertPublication({ ...draft, id: draft.id || NEW_ID }); setDraft(null); } }}
        submitLabel={t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {draft && (
          <>
            <Field label="Type">
              <select className={inputClass} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as Publication["type"] })}>
                <option value="Journal">Journal</option>
                <option value="Conference">Conference</option>
              </select>
            </Field>
            <Field label="Title (KO)"><input className={inputClass} value={draft.titleKo} onChange={(e) => setDraft({ ...draft, titleKo: e.target.value })} /></Field>
            <Field label="Title (EN)"><input className={inputClass} value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} /></Field>
            <Field label="Authors"><input className={inputClass} value={draft.authors} onChange={(e) => setDraft({ ...draft, authors: e.target.value })} /></Field>
            <Field label="Journal"><input className={inputClass} value={draft.journal} onChange={(e) => setDraft({ ...draft, journal: e.target.value })} /></Field>
            <Field label="DOI"><input className={inputClass} value={draft.doi} onChange={(e) => setDraft({ ...draft, doi: e.target.value })} /></Field>
            <Field label="DOI Link"><input className={inputClass} value={draft.doiLink ?? ""} onChange={(e) => setDraft({ ...draft, doiLink: e.target.value || undefined })} placeholder="Optional — defaults to DOI" /></Field>
          </>
        )}
      </AdminModal>
    </>
  );
}
