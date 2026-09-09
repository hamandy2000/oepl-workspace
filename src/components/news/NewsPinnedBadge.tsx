/** 뉴스 상단 고정(공지) 배지 (스타일: src/styles/badge.css) */

type Props = {
  label?: string;
  className?: string;
};

export default function NewsPinnedBadge({ label = "공지", className = "" }: Props) {
  return <span className={`badge badge-notice ${className}`.trim()}>{label}</span>;
}
