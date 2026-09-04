export default function LocalServicesLoading() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div>
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-7 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-2/3 max-w-lg animate-pulse rounded bg-slate-100" />
        </div>

        {/* Category cards */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              {/* Icon */}
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

              {/* Category name */}
              <div className="mt-5 h-4 w-24 animate-pulse rounded bg-slate-200" />

              {/* Description */}
              <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-1.5 h-3 w-3/4 animate-pulse rounded bg-slate-100" />

              {/* Count */}
              <div className="mt-5 h-3 w-16 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
