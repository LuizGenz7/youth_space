export default function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-lg font-black leading-none">
            {value}
          </p>

          <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}