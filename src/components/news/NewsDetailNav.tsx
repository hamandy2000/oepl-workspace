/** 뉴스 상세 이전/다음 글 내비게이션 (스타일: src/styles/news-detail.css) */

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
  const Icon = direction === "prev" ? ChevronDown : ChevronUp;

  return (
    <div className="nav-cell">
      <span className="nav-label">
        <Icon size={12} />
        {label}
      </span>
      {item ? (
        <Link href={`/news/${item.id}`} className="nav-title">
          {item.title}
        </Link>
      ) : (
        <span className="nav-empty">{emptyLabel}</span>
      )}
    </div>
  );
}

export default function NewsDetailNav({ prev, next, labels }: Props) {
  return (
    <nav className="news-nav" aria-label="News navigation">
      <NavCell item={next} direction="next" label={labels.next} emptyLabel={labels.empty} />
      <NavCell item={prev} direction="prev" label={labels.prev} emptyLabel={labels.empty} />
    </nav>
  );
}
