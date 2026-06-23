"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { btnDangerClass, btnGhostClass, btnPrimaryClass } from "./form-styles";

export function AdminPageHeader({
  title,
  onAdd,
  addLabel,
}: {
  title: string;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-[#080d1e]">{title}</h1>
      <button type="button" onClick={onAdd} className={btnPrimaryClass} style={{ background: "#E88800" }}>
        {addLabel}
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              onClick={() => { onChange(o.value); setOpen(false); }}
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
        <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {headers.map((h, i) => (
                <th key={i} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af]">
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
    <div className="flex gap-2">
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
