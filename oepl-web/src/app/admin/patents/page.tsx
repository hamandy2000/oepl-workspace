"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { Patent, PatentStatus } from "@/types/content";
import { NEW_ID, isNewId } from "@/lib/data/ids";
import { formatPatentDate, normalizePatentDate, patentDateInputValue, patentSortKey } from "@/lib/content/display";
import { inputClass } from "@/components/admin/form-styles";
import {
  AdminModal,
  AdminPageHeader,
  AdminRowActions,
  AdminRowIndex,
  AdminTable,
  AdminTablePagination,
  Field,
  useAdminPagination,
} from "@/components/admin/AdminUi";

const emptyPatent = (): Patent => ({
  id: NEW_ID,
  number: "",
  title: "",
  titleEn: "",
  date: new Date().toISOString().slice(0, 10),
  status: "registered",
  inventors: "",
});

export default function AdminPatentsPage() {
  const { t } = useLang();
  const { content, upsertPatent, deletePatent } = useContent();
  const [draft, setDraft] = useState<Patent | null>(null);

  const sortedPatents = useMemo(
    () => [...content.patents].sort((a, b) => patentSortKey(b.date) - patentSortKey(a.date)),
    [content.patents]
  );
  const { page, setPage, totalPages, paginate, rowOffset } = useAdminPagination(sortedPatents.length);
  const pagedPatents = paginate(sortedPatents);

  return (
    <>
      <AdminPageHeader
        title={t.admin.patents}
        count={content.patents.length}
        onAdd={() => setDraft(emptyPatent())}
        addLabel={t.admin.add}
      />
      <AdminTable headers={[t.admin.colNo, "Patent No.", t.admin.colTitle, t.admin.colDate, ""]}>
        {pagedPatents.map((item, index) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <AdminRowIndex index={rowOffset + index + 1} />
            <td className="px-4 py-3 text-xs font-mono text-[#9ca3af]">{item.number}</td>
            <td className="px-4 py-3 font-medium text-[#080d1e]">{item.title}</td>
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">{formatPatentDate(item.date)}</td>
            <td className="px-4 py-3">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => setDraft({ ...item })}
                onDelete={() => {
                  if (confirm(t.admin.confirmDelete)) deletePatent(item.id);
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
        onClose={() => setDraft(null)}
        onSubmit={() => {
          if (draft) {
            void upsertPatent({
              ...draft,
              id: draft.id || NEW_ID,
              date: normalizePatentDate(draft.date),
            });
            setDraft(null);
          }
        }}
        submitLabel={t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {draft && (
          <>
            <Field label="Patent No.">
              <input className={inputClass} value={draft.number} onChange={(e) => setDraft({ ...draft, number: e.target.value })} />
            </Field>
            <Field label="Title (KR)">
              <input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="Title (EN)">
              <input className={inputClass} value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} />
            </Field>
            <Field label={t.admin.colDate}>
              <input
                type="date"
                className={inputClass}
                value={patentDateInputValue(draft.date)}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as PatentStatus })}
              >
                <option value="registered">{t.about.patentStatusRegistered}</option>
                <option value="pending">{t.about.patentStatusPending}</option>
              </select>
            </Field>
            <Field label="Inventors">
              <input className={inputClass} value={draft.inventors} onChange={(e) => setDraft({ ...draft, inventors: e.target.value })} />
            </Field>
          </>
        )}
      </AdminModal>
    </>
  );
}
