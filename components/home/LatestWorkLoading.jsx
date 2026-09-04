export default function LatestWorkLoading() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        {/* Section heading */}
        <div>
          <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-7 w-60 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-100" />

          <div className="mt-2 h-4 w-2/3 max-w-lg animate-pulse rounded bg-slate-100" />
        </div>

        {/* Work cards */}
        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <WorkCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Work image */}
      <div className="aspect-square w-full animate-pulse bg-slate-200" />

      <div className="p-4">
        {/* Work title */}
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

        {/* Talent */}
        <div className="mt-3 h-3 w-24 animate-pulse rounded bg-slate-100" />

        {/* Bottom row */}
        <div className="mt-5 flex items-center justify-between">
          <div className="h-3 w-14 animate-pulse rounded bg-slate-100" />

          <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
