export default function StatBadge({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white/60 backdrop-blur">
      <Icon size={12} />
      {value} {label}
    </div>
  );
}