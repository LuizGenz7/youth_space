export default function FilterPill({ children, active = false }) {
  return (
    <button
      type="button"
      className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-950"
      }`}
    >
      {children}
    </button>
  );
}
