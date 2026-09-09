"use client";

/** 관리자 멤버 관리 — 교수 프로필·멤버 정보·연혁 편집 */

import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useLang } from "@/contexts/LangContext";

import { useContent } from "@/contexts/ContentContext";

import type { MemberRecord, Professor, TimelineEntry } from "@/types/content";

import { NEW_ID, isNewId, nextLocalId } from "@/lib/data/ids";

import { flattenMembers } from "@/lib/data/mappers";

import {
  compareMemberInsertOrder,
  degreeOptionsFor,

  formatGraduation,

  hasGraduated,

  memberFieldDisplay,

  normalizeDegree,

  normalizeMemberRecord,

} from "@/lib/content/members";

import { btnDangerClass, btnPrimaryClass, inputClass } from "@/components/admin/form-styles";

import { AdminDropdown, AdminModal, AdminPageHeader, AdminPhotoUpload, AdminRowActions, AdminRowIndex, AdminTable, AdminTablePagination, Field, useAdminPagination } from "@/components/admin/AdminUi";
import {
  adminRemoveMemberPhoto,
  adminRemoveProfessorPhoto,
  adminUploadFile,
} from "@/lib/admin/client-api";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  readMemberPhotoPreview,
  uploadProfessorPhoto,
  validateMemberPhotoFile,
} from "@/lib/supabase/member-photos";



function openMemberDraft(item: MemberRecord): MemberRecord {

  return { ...item, degree: normalizeDegree(item.degree, item.memberGroup) };

}



function emptyMember(): MemberRecord {

  return {

    id: NEW_ID,

    memberGroup: "postdocs",

    nameKo: "",

    nameEn: "",

    degree: "박사 후 연구원",

    email: "",

    research: "",

    graduationDate: "",
  };
}



function TimelineSection({
  title,
  entries,
  onChange,
}: {
  title: string;
  entries: TimelineEntry[];
  onChange: (entries: TimelineEntry[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const rowGrid =
    "grid grid-cols-1 md:grid-cols-[minmax(120px,0.75fr)_minmax(0,1.75fr)_minmax(0,1.75fr)_72px] gap-2 items-center";

  function addEntry() {
    onChange([...entries, { id: nextLocalId(entries), period: "", textKr: "", textEn: "" }]);
    setOpen(true);
  }

  return (
    <div className="col-span-full border-t border-gray-100 pt-4 mt-2">
      <div className={`${open ? `${rowGrid} mb-3` : "flex items-center justify-between"}`}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center gap-1.5 text-sm font-bold text-[#080d1e] cursor-pointer hover:text-[#E88800] transition-colors ${open ? "md:col-span-3" : ""}`}
          aria-expanded={open}
        >
          <ChevronRight
            size={14}
            className="text-[#9ca3af] transition-transform"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          />
          {title}
          <span className="text-xs font-normal text-[#9ca3af]">({entries.length})</span>
        </button>
        <button
          type="button"
          onClick={addEntry}
          className={`text-xs font-semibold text-[#E88800] cursor-pointer ${open ? "justify-self-end" : ""}`}
        >
          + 추가
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <div key={entry.id} className={rowGrid}>
              <input
                className={inputClass}
                placeholder="Period"
                value={entry.period}
                onChange={(e) =>
                  onChange(entries.map((x) => (x.id === entry.id ? { ...x, period: e.target.value } : x)))
                }
              />
              <input
                className={inputClass}
                placeholder="Text (KR)"
                value={entry.textKr}
                onChange={(e) =>
                  onChange(entries.map((x) => (x.id === entry.id ? { ...x, textKr: e.target.value } : x)))
                }
              />
              <input
                className={inputClass}
                placeholder="Text (EN)"
                value={entry.textEn}
                onChange={(e) =>
                  onChange(entries.map((x) => (x.id === entry.id ? { ...x, textEn: e.target.value } : x)))
                }
              />
              <button
                type="button"
                onClick={() => onChange(entries.filter((x) => x.id !== entry.id))}
                className={`${btnDangerClass} justify-self-end`}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



export default function AdminMembersPage() {

  const { t } = useLang();

  const { content, ready, updateProfessor, upsertMember, deleteMember } = useContent();

  const [draft, setDraft] = useState<MemberRecord | null>(null);
  const [profDraft, setProfDraft] = useState<Professor | null>(null);
  const [profSaving, setProfSaving] = useState(false);
  const [profPhotoPreview, setProfPhotoPreview] = useState<string | null>(null);
  const [profPendingPhotoFile, setProfPendingPhotoFile] = useState<File | null>(null);
  const [profPhotoRemoved, setProfPhotoRemoved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && profDraft === null) {
      const prof = structuredClone(content.members.professor);
      setProfDraft(prof);
      setProfPhotoPreview(prof.photoUrl || null);
      setProfPendingPhotoFile(null);
      setProfPhotoRemoved(false);
    }
  }, [ready, content.members.professor, profDraft]);

  function patchProfessorDraft(patch: Partial<Professor>) {
    setProfDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function handleProfessorSave() {
    if (!profDraft) return;
    setProfSaving(true);
    try {
      let professor = { ...profDraft };
      const hadStoragePhoto =
        professor.photoUrl && !professor.photoUrl.startsWith("data:") && !professor.photoUrl.startsWith("blob:");

      if (profPhotoRemoved) {
        professor = { ...professor, photoUrl: "" };
        if (hadStoragePhoto && isSupabaseConfigured()) await adminRemoveProfessorPhoto();
      } else if (profPendingPhotoFile) {
        if (hadStoragePhoto && isSupabaseConfigured()) await adminRemoveProfessorPhoto();
        professor.photoUrl = isSupabaseConfigured()
          ? await adminUploadFile("professor-photo", profPendingPhotoFile)
          : await uploadProfessorPhoto(profPendingPhotoFile);
      }

      updateProfessor(professor);
      setProfDraft(professor);
      setProfPhotoPreview(professor.photoUrl || null);
      setProfPendingPhotoFile(null);
      setProfPhotoRemoved(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setProfSaving(false);
    }
  }

  function handleProfessorPhotoSelect(file: File) {
    const validationError = validateMemberPhotoFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }
    setProfPendingPhotoFile(file);
    setProfPhotoRemoved(false);
    void readMemberPhotoPreview(file).then(setProfPhotoPreview);
  }

  function handleProfessorPhotoRemove() {
    setProfPendingPhotoFile(null);
    setProfPhotoPreview(null);
    setProfPhotoRemoved(true);
  }

  function resetPhotoDraft() {
    setPhotoPreview(null);
    setPendingPhotoFile(null);
    setPhotoRemoved(false);
  }

  function openDraft(item: MemberRecord) {
    resetPhotoDraft();
    setPhotoPreview(item.photoUrl || null);
    setDraft(openMemberDraft(item));
  }

  function handlePhotoSelect(file: File) {
    const validationError = validateMemberPhotoFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }
    setPendingPhotoFile(file);
    setPhotoRemoved(false);
    void readMemberPhotoPreview(file).then(setPhotoPreview);
  }

  function handlePhotoRemove() {
    setPendingPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(true);
  }

  async function handleMemberSubmit() {
    if (!draft) return;
    setSubmitting(true);
    try {
      let normalized = normalizeMemberRecord({ ...draft, id: draft.id || NEW_ID });
      if (photoRemoved) normalized = { ...normalized, photoUrl: "" };

      let saved = await upsertMember(normalized);

      if (pendingPhotoFile) {
        const url = isSupabaseConfigured()
          ? await adminUploadFile("member-photo", pendingPhotoFile, saved.id)
          : await readMemberPhotoPreview(pendingPhotoFile);
        saved = await upsertMember({ ...saved, photoUrl: url });
      } else if (photoRemoved && draft.photoUrl && isSupabaseConfigured()) {
        await adminRemoveMemberPhoto(saved.id);
      }

      setDraft(null);
      resetPhotoDraft();
    } catch (err) {
      alert(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }



  const allMembers = useMemo(
    () => flattenMembers(content.members).sort(compareMemberInsertOrder),
    [content.members]
  );
  const { page, setPage, totalPages, paginate, rowOffset } = useAdminPagination(allMembers.length);
  const pagedMembers = paginate(allMembers);



  function cellOrDash(value: string) {
    return value.trim() || "—";
  }

  return (
    <>
      <AdminPageHeader
        title={t.members.professorTitle}
        titleEn={t.members.professorLabel}
        trailing={
          <button
            type="button"
            disabled={profSaving || !profDraft}
            onClick={handleProfessorSave}
            className={`${btnPrimaryClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ background: "#E88800" }}
          >
            {profSaving ? t.admin.saving : t.admin.save}
          </button>
        }
      />
      <section className="rounded-2xl bg-white border border-gray-100 p-6 mb-8">
        {profDraft && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Photo">
                <AdminPhotoUpload
                  previewUrl={profPhotoPreview}
                  onFileSelect={handleProfessorPhotoSelect}
                  onRemove={handleProfessorPhotoRemove}
                />
              </Field>
            </div>
            <Field label="Name (KR)">
              <input className={inputClass} value={profDraft.nameKo} onChange={(e) => patchProfessorDraft({ nameKo: e.target.value })} />
            </Field>
            <Field label="Name (EN)">
              <input className={inputClass} value={profDraft.nameEn} onChange={(e) => patchProfessorDraft({ nameEn: e.target.value })} />
            </Field>
            <Field label="Affiliation (KR)">
              <input className={inputClass} value={profDraft.affiliationKr} onChange={(e) => patchProfessorDraft({ affiliationKr: e.target.value })} />
            </Field>
            <Field label="Affiliation (EN)">
              <input className={inputClass} value={profDraft.affiliationEn} onChange={(e) => patchProfessorDraft({ affiliationEn: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className={inputClass} value={profDraft.email} onChange={(e) => patchProfessorDraft({ email: e.target.value })} />
            </Field>
            <Field label="Scholar URL">
              <input className={inputClass} value={profDraft.scholar} onChange={(e) => patchProfessorDraft({ scholar: e.target.value })} />
            </Field>
            <TimelineSection
              title="Career"
              entries={profDraft.career}
              onChange={(career) => patchProfessorDraft({ career })}
            />
          </div>
        )}
      </section>

      <AdminPageHeader
        title={t.admin.members}
        titleEn={t.admin.navEn.members}
        count={allMembers.length}
        countUnit="명"
        onAdd={() => {
          resetPhotoDraft();
          setDraft(emptyMember());
        }}
        addLabel={t.admin.add}
      />
      <AdminTable headers={[t.admin.colNo, "Name (KR)", "Name (EN)", "Degree", "Email", "Research", "Graduation", ""]}>
        {pagedMembers.map((item, index) => (
          <tr key={item.id} className="border-b border-gray-50 last:border-0">
            <AdminRowIndex index={rowOffset + index + 1} />
            <td className="px-4 py-3 font-medium text-[#080d1e] whitespace-nowrap">{item.nameKo}</td>
            <td className="px-4 py-3 text-xs text-[#6b7280] whitespace-nowrap">{cellOrDash(item.nameEn)}</td>
            <td className="px-4 py-3 text-xs font-semibold text-[#E88800] whitespace-nowrap">{item.degree}</td>
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">
              {!hasGraduated(item) ? cellOrDash(item.email) : "—"}
            </td>
            <td className="px-4 py-3 text-xs text-[#6b7280] max-w-[160px] truncate" title={memberFieldDisplay(item)}>
              {!hasGraduated(item) ? memberFieldDisplay(item) : "—"}
            </td>
            <td className="px-4 py-3 text-xs text-[#9ca3af] whitespace-nowrap">{formatGraduation(item)}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <AdminRowActions
                editLabel={t.admin.edit}
                deleteLabel={t.admin.delete}
                onEdit={() => openDraft(item)}
                onDelete={() => {
                  if (confirm(t.admin.confirmDelete)) deleteMember(item.id);
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
          void handleMemberSubmit();
        }}
        submitLabel={submitting ? t.admin.saving : t.admin.save}
        cancelLabel={t.admin.cancel}
      >
        {draft && (
          <>
            <Field label="Photo">
              <AdminPhotoUpload
                previewUrl={photoPreview}
                onFileSelect={handlePhotoSelect}
                onRemove={handlePhotoRemove}
              />
            </Field>
            <Field label="Degree">
              <AdminDropdown
                value={draft.degree}
                options={degreeOptionsFor(draft.degree, draft.memberGroup)}
                onChange={(degree) => setDraft({ ...draft, degree })}
              />
            </Field>
            <Field label="Name (KR)">
              <input className={inputClass} value={draft.nameKo} onChange={(e) => setDraft({ ...draft, nameKo: e.target.value })} />
            </Field>
            <Field label="Name (EN)">
              <input className={inputClass} value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} />
            </Field>
            {!hasGraduated(draft) && (
              <>
                <Field label="Email">
                  <input className={inputClass} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                </Field>
                <Field label="Research">
                  <input
                    className={inputClass}
                    value={draft.research}
                    onChange={(e) => setDraft({ ...draft, research: e.target.value })}
                  />
                </Field>
              </>
            )}
            <Field label="Graduation">
              <input
                type="date"
                className={inputClass}
                value={draft.graduationDate || ""}
                onChange={(e) => setDraft({ ...draft, graduationDate: e.target.value })}
              />
              <p className="text-2xs text-[#9ca3af] mt-1">날짜 입력 시 졸업생으로 분류됩니다. 화면에는 연도만 표시됩니다.</p>
            </Field>
          </>
        )}
      </AdminModal>
    </>
  );
}

