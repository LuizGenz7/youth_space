export default function FeaturedTalentsLoading() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div>
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-7 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-2/3 max-w-lg animate-pulse rounded bg-slate-200" />
        </div>

        {/* Talent cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <TalentCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TalentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Profile image */}
      <div className="aspect-[4/3] w-full animate-pulse bg-slate-200" />

      <div className="p-5">
        {/* Name */}
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

        {/* Location / category */}
        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />

        {/* Description */}
        <div className="mt-5 h-3 w-full animate-pulse rounded bg-slate-100" />

        <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-slate-100" />

        {/* Bottom action */}
        <div className="mt-5 h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}
