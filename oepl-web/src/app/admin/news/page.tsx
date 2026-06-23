"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { NewsItem } from "@/types/content";
import { NEW_ID, isNewId } from "@/lib/data/ids";
import { inputClass } from "@/components/admin/form-styles";
import { AdminModal, AdminPageHeader, AdminRowActions, AdminTable, Field } from "@/components/admin/AdminUi";

const emptyNews = (): NewsItem => ({
  id: NEW_ID,
  type: "News",
  date: "",
  title: "",
  detail: "",
});

export default function AdminNewsPage() {
  const { t } = useLang();
  const { content, upsertNews, deleteNews } = useContent();
  const [draft, setDraft] = useState<NewsItem | null>(null);

  return (
    <>
      <AdminPageHeader title={t.admin.news} onAdd={() => setDraft(emptyNews())} addLabel={t.admin.add} />
      <AdminTable headers={[t.admin.colDate, "Type", t.admin.colTitle, ""]}>
        {content.news.map((item) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">{item.date}</td>
            <td className="px-4 py-3 text-xs text-[#6b7280]">{item.type}</td>
            <td className="px-4 py-3 font-medium text-[#080d1e]">{item.title}</td>
            <td className="px-4 py-3">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => setDraft({ ...item })}
                onDelete={() => { if (confirm(t.admin.confirmDelete)) deleteNews(item.id); }}
              />
            </td>
          </tr>
        ))}
      </AdminTable>

      <AdminModal
        open={!!draft}
        title={draft && !isNewId(draft.id) ? t.admin.edit : t.admin.add}
        onClose={() => setDraft(null)}
        onSubmit={() => { if (draft) { void upsertNews({ ...draft, id: draft.id || NEW_ID }); setDraft(null); } }}
        submitLabel={t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {draft && (
          <>
            <Field label="Type"><input className={inputClass} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} /></Field>
            <Field label={t.admin.colDate}><input className={inputClass} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} placeholder="2023.05.07" /></Field>
            <Field label={t.admin.colTitle}><input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Detail"><textarea className={inputClass} rows={3} value={draft.detail} onChange={(e) => setDraft({ ...draft, detail: e.target.value })} /></Field>
          </>
        )}
      </AdminModal>
    </>
  );
}
