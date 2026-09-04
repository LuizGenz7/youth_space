export default function TopCategoriesLoading({ className = "" }) {
  return (
    <section className={className}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-8 w-48 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
        </div>

        <div className="hidden h-4 w-16 animate-pulse rounded bg-slate-100 sm:block" />
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

              <div className="h-3 w-5 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="mt-5 h-4 w-24 animate-pulse rounded bg-slate-100" />

            <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
