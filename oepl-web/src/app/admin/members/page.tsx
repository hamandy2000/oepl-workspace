"use client";



import { useMemo, useState } from "react";

import { useLang } from "@/contexts/LangContext";

import { useContent } from "@/contexts/ContentContext";

import type { MemberRecord, Professor, TimelineEntry } from "@/types/content";

import { NEW_ID, isNewId, nextLocalId } from "@/lib/data/ids";

import { flattenMembers } from "@/lib/data/mappers";

import {

  degreeOptionsFor,

  formatGraduation,

  hasGraduated,

  memberFieldDisplay,

  normalizeDegree,

  normalizeMemberRecord,

} from "@/lib/content/members";

import { btnPrimaryClass, inputClass } from "@/components/admin/form-styles";

import { AdminDropdown, AdminModal, AdminRowActions, AdminTable, Field } from "@/components/admin/AdminUi";



function openMemberDraft(item: MemberRecord): MemberRecord {

  return { ...item, degree: normalizeDegree(item.degree, item.memberGroup) };

}



function emptyMember(): MemberRecord {

  return {

    id: NEW_ID,

    memberGroup: "postdocs",

    nameKo: "",

    nameEn: "",

    degree: "박사후연구원",

    email: "",

    fieldKr: "",

    fieldEn: "",

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

  return (

    <div className="col-span-full border-t border-gray-100 pt-4 mt-2">

      <div className="flex items-center justify-between mb-3">

        <h3 className="text-sm font-bold text-[#080d1e]">{title}</h3>

        <button

          type="button"

          onClick={() => onChange([...entries, { id: nextLocalId(entries), period: "", textKr: "", textEn: "" }])}

          className="text-xs font-semibold text-[#E88800] cursor-pointer"

        >

          + 추가

        </button>

      </div>

      <div className="flex flex-col gap-3">

        {entries.map((entry) => (

          <div key={entry.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start">

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

              className="text-xs text-red-500 font-semibold cursor-pointer px-2 py-2"

            >

              삭제

            </button>

          </div>

        ))}

      </div>

    </div>

  );

}



export default function AdminMembersPage() {

  const { t } = useLang();

  const { content, updateProfessor, upsertMember, deleteMember } = useContent();

  const [draft, setDraft] = useState<MemberRecord | null>(null);

  const prof = content.members.professor;



  const allMembers = useMemo(() => flattenMembers(content.members), [content.members]);



  function patchProfessor(patch: Partial<Professor>) {

    updateProfessor({ ...prof, ...patch });

  }



  function cellOrDash(value: string) {

    return value.trim() || "—";

  }



  const tableToolbar = (

    <>

      <h2 className="text-base font-bold text-[#080d1e]">Members</h2>

      <button type="button" onClick={() => setDraft(emptyMember())} className={btnPrimaryClass} style={{ background: "#E88800" }}>

        {t.admin.add}

      </button>

    </>

  );



  return (

    <div className="flex flex-col gap-8">

      <section className="rounded-2xl bg-white border border-gray-100 p-6">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-bold text-[#080d1e]">{t.members.professorTitle}</h2>

          <span className="text-[10px] text-[#9ca3af]">브라우저 저장 · 즉시 반영</span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field label="Name (KR)">

            <input className={inputClass} value={prof.nameKo} onChange={(e) => patchProfessor({ nameKo: e.target.value })} />

          </Field>

          <Field label="Name (EN)">

            <input className={inputClass} value={prof.nameEn} onChange={(e) => patchProfessor({ nameEn: e.target.value })} />

          </Field>

          <Field label="Affiliation (KR)">

            <input className={inputClass} value={prof.affiliationKr} onChange={(e) => patchProfessor({ affiliationKr: e.target.value })} />

          </Field>

          <Field label="Affiliation (EN)">

            <input className={inputClass} value={prof.affiliationEn} onChange={(e) => patchProfessor({ affiliationEn: e.target.value })} />

          </Field>

          <Field label="Email">

            <input className={inputClass} value={prof.email} onChange={(e) => patchProfessor({ email: e.target.value })} />

          </Field>

          <Field label="Scholar URL">

            <input className={inputClass} value={prof.scholar} onChange={(e) => patchProfessor({ scholar: e.target.value })} />

          </Field>



          <TimelineSection

            title="Education"

            entries={prof.education}

            onChange={(education) => patchProfessor({ education })}

          />

          <TimelineSection

            title="Career"

            entries={prof.career}

            onChange={(career) => patchProfessor({ career })}

          />

          <TimelineSection

            title="Achievements"

            entries={prof.achievements}

            onChange={(achievements) => patchProfessor({ achievements })}

          />

        </div>

      </section>



      <section>

        <AdminTable

          headers={["Name (KR)", "Name (EN)", "Degree", "Email", "Field", "Graduation", ""]}

          toolbar={tableToolbar}

        >

          {allMembers.map((item) => (

            <tr key={item.id} className="border-b border-gray-50 last:border-0">

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

                  onEdit={() => setDraft(openMemberDraft(item))}

                  onDelete={() => { if (confirm(t.admin.confirmDelete)) deleteMember(item.id); }}

                />

              </td>

            </tr>

          ))}

        </AdminTable>

      </section>



      <AdminModal

        open={!!draft}

        title={draft && !isNewId(draft.id) ? t.admin.edit : t.admin.add}

        onClose={() => setDraft(null)}

        onSubmit={() => {

          if (draft) {

            void upsertMember(normalizeMemberRecord({ ...draft, id: draft.id || NEW_ID }));

            setDraft(null);

          }

        }}

        submitLabel={t.admin.save}

        cancelLabel={t.admin.cancel}

      >

        {draft && (

          <>

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
                <Field label="Field">
                  <input
                    className={inputClass}
                    value={draft.fieldKr || draft.fieldEn}
                    onChange={(e) => setDraft({ ...draft, fieldKr: e.target.value, fieldEn: e.target.value })}
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
              <p className="text-[10px] text-[#9ca3af] mt-1">날짜 입력 시 졸업생으로 분류됩니다. 화면에는 연도만 표시됩니다.</p>
            </Field>

          </>

        )}

      </AdminModal>

    </div>

  );

}

