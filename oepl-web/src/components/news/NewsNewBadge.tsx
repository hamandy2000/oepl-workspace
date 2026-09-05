/** 뉴스 NEW 배지 (스타일: src/styles/badge.css) */

type Props = {
  label?: string;
  className?: string;
};

export default function NewsNewBadge({ label = "NEW", className = "" }: Props) {
  return <span className={`badge badge-new ${className}`.trim()}>{label}</span>;
}
