type Props = {
  label?: string;
  className?: string;
};

export default function NewsNewBadge({ label = "NEW", className = "" }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-[#E88800] text-white leading-none ${className}`}
    >
      {label}
    </span>
  );
}
