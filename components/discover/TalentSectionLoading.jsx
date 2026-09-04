export default function TalentSectionLoading({ className = "" }) {
  return (
    <section className={className}>
      {/* Heading */}
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-8 w-48 max-w-full animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
        </div>

        <div className="hidden h-4 w-16 animate-pulse rounded bg-slate-100 sm:block" />
      </div>

      {/* Talent cards */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            {/* Image */}
            <div className="aspect-[4/3] w-full animate-pulse bg-slate-100" />

            {/* Content */}
            <div className="p-4">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />

              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />

              <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
              </div>

              <div className="mt-4 h-3 w-28 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
