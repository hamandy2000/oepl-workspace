"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useContent } from "@/contexts/ContentContext";
import type { Publication } from "@/types/content";
import { NEW_ID, isNewId } from "@/lib/data/ids";
import {
  formatPublicationDate,
  normalizePublication,
  publicationDateInputValue,
  publicationSortKey,
} from "@/lib/content/display";
import { inputClass } from "@/components/admin/form-styles";
import {
  AdminModal,
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

const emptyPub = (): Publication => ({
  id: NEW_ID,
  type: "Journal",
  titleKo: "",
  titleEn: "",
  authors: "",
  journal: "",
  doi: "",
  publishedAt: new Date().toISOString().slice(0, 10),
});

function cellOrDash(value: string) {
  return value.trim() || "—";
}

export default function AdminPublicationsPage() {
  const { t } = useLang();
  const { content, upsertPublication, deletePublication } = useContent();
  const [draft, setDraft] = useState<Publication | null>(null);
  const [search, setSearch] = useState("");

  const sortedPublications = useMemo(
    () => [...content.publications].sort((a, b) => publicationSortKey(b) - publicationSortKey(a)),
    [content.publications]
  );

  const filteredPublications = useMemo(
    () =>
      sortedPublications.filter((item) =>
        adminMatchesSearch(search, [
          item.doi,
          item.titleKo,
          item.titleEn,
          item.authors,
          item.journal,
          item.doiLink,
          formatPublicationDate(item),
          item.publishedAt,
        ])
      ),
    [sortedPublications, search]
  );
  const { page, setPage, totalPages, paginate, rowOffset } = useAdminPagination(filteredPublications.length, search);
  const pagedPublications = paginate(filteredPublications);

  return (
    <>
      <AdminPageHeader
        title={t.admin.publications}
        count={content.publications.length}
        onAdd={() => setDraft(emptyPub())}
        addLabel={t.admin.add}
      />
      <AdminTable
        headers={[
          t.admin.colNo,
          "DOI",
          "Title (KO)",
          "Title (EN)",
          "Authors",
          "Journal",
          t.admin.colDate,
          "DOI Link",
          "",
        ]}
        toolbar={
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <AdminTableSearch
              value={search}
              onChange={setSearch}
              placeholder={t.admin.searchPlaceholder}
            />
            {search.trim() && (
              <span className="text-xs text-[#9ca3af]">{t.admin.searchResult(filteredPublications.length)}</span>
            )}
          </div>
        }
      >
        {pagedPublications.map((item, index) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <AdminRowIndex index={rowOffset + index + 1} />
            <td className="px-4 py-3 text-xs text-[#9ca3af] max-w-[120px] truncate font-mono" title={item.doi}>
              {cellOrDash(item.doi)}
            </td>
            <td className="px-4 py-3 font-medium text-[#080d1e] max-w-[200px] truncate" title={item.titleKo}>
              {cellOrDash(item.titleKo)}
            </td>
            <td className="px-4 py-3 text-xs text-[#6b7280] max-w-[200px] truncate" title={item.titleEn}>
              {cellOrDash(item.titleEn)}
            </td>
            <td className="px-4 py-3 text-xs text-[#6b7280] max-w-[160px] truncate" title={item.authors}>
              {cellOrDash(item.authors)}
            </td>
            <td className="px-4 py-3 text-xs text-[#9ca3af] max-w-[140px] truncate" title={item.journal}>
              {cellOrDash(item.journal)}
            </td>
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">
              {formatPublicationDate(item) ?? "—"}
            </td>
            <td className="px-4 py-3 text-xs text-[#9ca3af] max-w-[140px] truncate" title={item.doiLink}>
              {cellOrDash(item.doiLink ?? "")}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => setDraft({ ...item })}
                onDelete={() => {
                  if (confirm(t.admin.confirmDelete)) deletePublication(item.id);
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
            void upsertPublication(normalizePublication({ ...draft, id: draft.id || NEW_ID }));
            setDraft(null);
          }
        }}
        submitLabel={t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {draft && (
          <>
            <Field label={t.admin.colDate}>
              <input
                type="date"
                className={inputClass}
                value={publicationDateInputValue(draft)}
                onChange={(e) => setDraft({ ...draft, publishedAt: e.target.value })}
              />
            </Field>
            <Field label="Title (KO)">
              <input className={inputClass} value={draft.titleKo} onChange={(e) => setDraft({ ...draft, titleKo: e.target.value })} />
            </Field>
            <Field label="Title (EN)">
              <input className={inputClass} value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} />
            </Field>
            <Field label="Authors">
              <input className={inputClass} value={draft.authors} onChange={(e) => setDraft({ ...draft, authors: e.target.value })} />
            </Field>
            <Field label="Journal">
              <input className={inputClass} value={draft.journal} onChange={(e) => setDraft({ ...draft, journal: e.target.value })} />
            </Field>
            <Field label="DOI">
              <input className={inputClass} value={draft.doi} onChange={(e) => setDraft({ ...draft, doi: e.target.value })} />
            </Field>
            <Field label="DOI Link">
              <input
                className={inputClass}
                value={draft.doiLink ?? ""}
                onChange={(e) => setDraft({ ...draft, doiLink: e.target.value || undefined })}
                placeholder="https://doi.org/..."
              />
            </Field>
          </>
        )}
      </AdminModal>
    </>
  );
}
