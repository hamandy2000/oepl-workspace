type Props = {
  label?: string;
  className?: string;
};

export default function NewsPinnedBadge({ label = "공지", className = "" }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide bg-[#080d1e] text-white leading-none ${className}`}
    >
      {label}
    </span>
  );
}
