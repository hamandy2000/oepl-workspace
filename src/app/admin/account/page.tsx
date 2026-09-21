"use client";

/** 관리자 계정 — 비밀번호 변경 */

import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { AdminPageHeader, Field } from "@/components/admin/AdminUi";
import { btnPrimaryClass, inputClass } from "@/components/admin/form-styles";
import { changeAdminPassword } from "@/lib/admin/client-api";

const MIN_LENGTH = 8;

export default function AdminAccountPage() {
  const { t } = useLang();
  const a = t.admin;

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);

    // 서버도 같은 규칙을 다시 검사한다. 여기서 거르는 건 왕복을 아끼기 위한 것일 뿐이다.
    if (next !== confirm) return setError(a.errMismatch);
    if (next.length < MIN_LENGTH) return setError(a.errTooShort);
    if (next === current) return setError(a.errSameAsCurrent);

    setSaving(true);
    try {
      await changeAdminPassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 401) setError(a.errWrongCurrent);
      else if (status === 429) setError(a.errTooMany);
      else setError(a.errGeneric);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminPageHeader title={a.accountTitle} titleEn="Account" />

      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-5 text-xs text-[#6b7280]">{a.accountDesc}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label={a.currentPassword}>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </Field>

          <Field label={a.newPassword}>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              minLength={MIN_LENGTH}
              required
              className={inputClass}
            />
          </Field>

          <Field label={a.confirmPassword}>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              minLength={MIN_LENGTH}
              required
              className={inputClass}
            />
          </Field>

          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          {done && <p className="text-xs font-semibold text-[#15803d]">{a.passwordChanged}</p>}

          <button
            type="submit"
            disabled={saving}
            className={`${btnPrimaryClass} mt-1 self-start bg-[#E88800] disabled:opacity-60`}
          >
            {saving ? a.saving : a.changePassword}
          </button>
        </form>
      </div>
    </>
  );
}
