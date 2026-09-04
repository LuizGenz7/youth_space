export default function StatsLoading({ className = "" }) {
  return (
    <div
      className={`flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 ${className}`}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="min-w-[160px] flex-1 rounded-2xl border border-slate-200 bg-white p-4 sm:min-w-0"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

            <div className="flex-1">
              <div className="h-6 w-14 animate-pulse rounded bg-slate-100" />

              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
