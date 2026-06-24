import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

type NavItem = { id: number; title: string };

type Props = {
  prev: NavItem | null;
  next: NavItem | null;
  labels: {
    prev: string;
    next: string;
    empty: string;
  };
};

function NavCell({
  item,
  direction,
  label,
  emptyLabel,
}: {
  item: NavItem | null;
  direction: "prev" | "next";
  label: string;
  emptyLabel: string;
}) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronDown : ChevronUp;

  const labelEl = (
    <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wide">
      <Icon size={12} />
      {label}
    </span>
  );

  if (!item) {
    return (
      <div className="flex items-center gap-3 min-w-0 px-4 py-3 text-left">
        {labelEl}
        <span className="text-xs text-[#d1d5db] min-w-0 truncate">{emptyLabel}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 min-w-0 px-4 py-3 text-left">
      {labelEl}
      <Link
        href={`/news/${item.id}`}
        className="text-xs font-medium text-[#374151] min-w-0 truncate hover:text-[#E88800] transition-colors"
      >
        {item.title}
      </Link>
    </div>
  );
}

export default function NewsDetailNav({ prev, next, labels }: Props) {
  return (
    <nav
      className="mt-4 flex flex-col divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
      aria-label="News navigation"
    >
      <NavCell item={next} direction="next" label={labels.next} emptyLabel={labels.empty} />
      <NavCell item={prev} direction="prev" label={labels.prev} emptyLabel={labels.empty} />
    </nav>
  );
}
