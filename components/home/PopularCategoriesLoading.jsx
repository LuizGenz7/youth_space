export default function PopularCategoriesLoading() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />

            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Categories */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              {/* Rank */}
              <div className="absolute right-3 top-3 h-3 w-4 animate-pulse rounded bg-slate-100" />

              {/* Icon */}
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-slate-100" />

              {/* Content */}
              <div className="min-w-0 flex-1 pr-5">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />

                <div className="mt-2 h-3 w-14 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}