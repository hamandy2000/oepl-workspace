"use client";

/** 정렬 드롭다운 — 논문·뉴스 목록 공용 (스타일: src/styles/list.css) */

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

export type SortOrder = "newest" | "oldest";

type Props = {
  sortOrder: SortOrder;
  setSortOrder: (v: SortOrder) => void;
  labels: { newest: string; oldest: string };
};

export default function SortDropdown({ sortOrder, setSortOrder, labels }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "newest" as const, label: labels.newest },
    { value: "oldest" as const, label: labels.oldest },
  ];

  const current = options.find((o) => o.value === sortOrder)!;

  function select(value: SortOrder) {
    setSortOrder(value);
    setOpen(false);
  }

  return (
    <div ref={ref} className={open ? "sort-dropdown is-open" : "sort-dropdown"}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="sort-btn"
        aria-expanded={open}
      >
        {current.label}
        <ChevronRight size={11} className="chevron" />
      </button>

      {open && (
        <div className="sort-menu">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => select(o.value)}
              className={o.value === sortOrder ? "sort-option is-active" : "sort-option"}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
