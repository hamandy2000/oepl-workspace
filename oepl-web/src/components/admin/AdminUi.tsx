"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { btnDangerClass, btnGhostClass, btnPrimaryClass, inputClass } from "./form-styles";

export function adminMatchesSearch(
  query: string,
  parts: Array<string | number | null | undefined>
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return parts.some((part) => String(part ?? "").toLowerCase().includes(q));
}

export function AdminPageHeader({
  title,
  count,
  onAdd,
  addLabel,
  trailing,
}: {
  title: string;
  count?: number;
  onAdd?: () => void;
  addLabel?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-[#080d1e]">
        {title}
        {count != null && (
          <span className="ml-2 text-base font-semibold text-[#9ca3af]">({count})</span>
        )}
      </h1>
      {trailing ??
        (onAdd && addLabel ? (
          <button type="button" onClick={onAdd} className={btnPrimaryClass} style={{ background: "#E88800" }}>
            {addLabel}
          </button>
        ) : null)}
    </div>
  );
}

export function AdminTableSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputClass} w-full max-w-sm`}
    />
  );
}

export function AdminRowIndex({ index }: { index: number }) {
  return (
    <td className="px-2 py-3 text-xs text-[#9ca3af] tabular-nums whitespace-nowrap w-14 min-w-[3.5rem]">
      {index}
    </td>
  );
}

export const ADMIN_TABLE_PAGE_SIZE = 10;

export function useAdminPagination(totalItems: number, resetKey?: string | number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(totalItems / ADMIN_TABLE_PAGE_SIZE));
  const rowOffset = (page - 1) * ADMIN_TABLE_PAGE_SIZE;

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function paginate<T>(items: T[]): T[] {
    return items.slice(rowOffset, rowOffset + ADMIN_TABLE_PAGE_SIZE);
  }

  return { page, setPage, totalPages, paginate, rowOffset, pageSize: ADMIN_TABLE_PAGE_SIZE };
}

export function AdminTablePagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
        style={{ border: "1px solid #e5e7eb", color: "#6b7280" }}
        aria-label="Previous page"
      >
        <ChevronLeft size={13} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
          style={{
            background: p === page ? "#E88800" : "transparent",
            color: p === page ? "#ffffff" : "#6b7280",
            border: p === page ? "1px solid #E88800" : "1px solid transparent",
          }}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
        style={{ border: "1px solid #e5e7eb", color: "#6b7280" }}
        aria-label="Next page"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

export function AdminDropdown<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) ?? { value, label: value || "선택" };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const select = (next: T) => {
    setOpen(false);
    if (next !== value) onChange(next);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
        style={{
          background: "#ffffff",
          color: "#374151",
          border: "1px solid #e5e7eb",
        }}
      >
        {current.label}
        <ChevronRight
          size={11}
          className="transition-transform"
          style={{ transform: open ? "rotate(-90deg)" : "rotate(90deg)" }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 z-50 mt-1 rounded-xl overflow-hidden"
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            minWidth: "100%",
          }}
        >
          {options.map((o, i) => (
            <button
              key={o.value}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                select(o.value);
              }}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              style={{
                color: o.value === value ? "#E88800" : "#374151",
                borderTop: i > 0 ? "1px solid #f3f4f6" : "none",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminTable({
  headers,
  children,
  toolbar,
}: {
  headers: React.ReactNode[];
  children: React.ReactNode;
  toolbar?: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
      {toolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          {toolbar}
        </div>
      )}
      <div ref={scrollRef} className="overflow-x-auto admin-table-scroll">
        <table className="w-full text-sm min-w-max [&_tbody_td:not(:last-child)]:text-center [&_tbody_td:last-child]:text-right">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`py-3 text-[10px] font-semibold text-[#9ca3af] whitespace-nowrap ${
                    i === 0 ? "px-2 w-14 min-w-[3.5rem] normal-case tracking-normal" : "px-4 uppercase tracking-widest"
                  } ${i === headers.length - 1 ? "text-right" : "text-center"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[#080d1e]">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminRowActions({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: {
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
}) {
  return (
    <div className="flex gap-2 justify-end">
      <button type="button" onClick={onEdit} className={btnGhostClass}>
        {editLabel}
      </button>
      <button type="button" onClick={onDelete} className={btnDangerClass}>
        {deleteLabel}
      </button>
    </div>
  );
}

export function AdminModal({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel,
  cancelLabel,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  cancelLabel: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="px-6 pt-6 pb-2 flex-shrink-0">
          <h2 className="text-lg font-bold text-[#080d1e]">{title}</h2>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto admin-modal-scroll px-6 py-2">
          <div className="flex flex-col gap-4">{children}</div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 flex-shrink-0 border-t border-gray-100">
          <button type="button" onClick={onClose} className={btnGhostClass}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onSubmit} className={btnPrimaryClass} style={{ background: "#E88800" }}>
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[#374151]">{label}</span>
      {children}
    </label>
  );
}

export function AdminPhotoUpload({
  previewUrl,
  onFileSelect,
  onRemove,
  selectLabel = "사진 선택",
  removeLabel = "사진 삭제",
}: {
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  selectLabel?: string;
  removeLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <div className="w-[140px] h-[168px] rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-gray-400">No photo</span>
          )}
        </div>
        <p className="text-[10px] text-[#9ca3af] whitespace-nowrap w-[140px] text-center">JPEG, PNG, WebP · 최대 2MB</p>
      </div>
      <div className="flex flex-col gap-2 pt-1">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => inputRef.current?.click()} className={btnGhostClass}>
          {selectLabel}
        </button>
        {previewUrl && (
          <button
            type="button"
            onClick={onRemove}
            className={`${btnGhostClass} text-red-500 hover:border-red-300/60`}
          >
            {removeLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminMultiPhotoUpload({
  items,
  onAdd,
  onRemove,
  selectLabel = "사진 추가",
  maxItems,
  hint,
}: {
  items: { id: number | string; url: string }[];
  onAdd: (files: File[]) => void;
  onRemove: (id: number | string) => void;
  selectLabel?: string;
  maxItems?: number;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const atLimit = maxItems != null && items.length >= maxItems;
  const defaultHint =
    maxItems === 1
      ? "JPEG, PNG, WebP · 최대 2MB · 1장만 등록 가능"
      : "JPEG, PNG, WebP · 최대 2MB · 여러 장 선택 가능";

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <div key={item.id} className="relative w-[100px] h-[100px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {!atLimit && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={maxItems == null || maxItems > 1}
            className="hidden"
            onChange={(e) => {
              const list = e.target.files;
              if (!list?.length) return;
              const files = Array.from(list);
              onAdd(maxItems === 1 ? files.slice(0, 1) : files);
              e.target.value = "";
            }}
          />
          <button type="button" onClick={() => inputRef.current?.click()} className={btnGhostClass}>
            {selectLabel}
          </button>
          <p className="text-[10px] text-[#9ca3af] mt-1">{hint ?? defaultHint}</p>
        </div>
      )}
    </div>
  );
}

export function AdminAttachmentUpload({
  items,
  onAdd,
  onRemove,
  selectLabel = "첨부파일 추가",
}: {
  items: { id: number | string; fileName: string }[];
  onAdd: (files: File[]) => void;
  onRemove: (id: number | string) => void;
  selectLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs">
              <span className="truncate text-[#374151]">{item.fileName}</span>
              <button type="button" onClick={() => onRemove(item.id)} className="text-red-500 shrink-0">
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.hwp,.hwpx,.jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={(e) => {
            const list = e.target.files;
            if (!list?.length) return;
            onAdd(Array.from(list));
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => inputRef.current?.click()} className={btnGhostClass}>
          {selectLabel}
        </button>
        <p className="text-[10px] text-[#9ca3af] mt-1">PDF, DOC, PPT, ZIP, HWP 등 · 최대 10MB · 여러 개 선택 가능</p>
      </div>
    </div>
  );
}
