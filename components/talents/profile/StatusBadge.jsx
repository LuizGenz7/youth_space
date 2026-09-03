export default function StatusBadge({ available }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black backdrop-blur ${
        available
          ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
          : "border-white/10 bg-white/10 text-white/55"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          available
            ? "bg-emerald-400"
            : "bg-white/30"
        }`}
      />

      {available ? "Available" : "Currently unavailable"}
    </div>
  );
}