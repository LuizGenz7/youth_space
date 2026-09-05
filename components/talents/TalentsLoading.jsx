export default function TalentsLoading() {
  return <TalentsContentSkeleton />;
}

/* =========================================================
   CONTENT
========================================================= */

function TalentsContentSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading talents">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <BrowseCategoriesSkeleton />

        <FiltersSkeleton />

        <CategorySectionsSkeleton />

        <LoadMoreCategoriesSkeleton />
      </div>
    </section>
  );
}

/* =========================================================
   BROWSE CATEGORIES
========================================================= */

function BrowseCategoriesSkeleton() {
  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <Skeleton className="h-3 w-28" />

          <Skeleton className="mt-2 h-7 w-48" />
        </div>

        <Skeleton className="hidden h-5 w-24 sm:block" />
      </div>

      {/* Categories */}
      <div className="mt-5 flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[76px] min-w-[145px] shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
          >
            <div className="flex h-full items-center gap-3 px-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-2 h-2.5 w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   FILTERS
========================================================= */

function FiltersSkeleton() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
      {/* Result count */}
      <Skeleton className="h-5 w-32" />

      {/* Filter controls */}
      <div className="flex gap-3">
        <Skeleton className="h-11 w-36 rounded-xl" />

        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </div>
  );
}

/* =========================================================
   CATEGORY SECTIONS
========================================================= */

function CategorySectionsSkeleton() {
  return (
    <div className="mt-10 space-y-14">
      {Array.from({ length: 3 }).map((_, index) => (
        <CategorySectionSkeleton key={index} />
      ))}
    </div>
  );
}

function CategorySectionSkeleton() {
  return (
    <section>
      {/* Category heading */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />

        <div>
          <Skeleton className="h-6 w-40 rounded-md" />

          <Skeleton className="mt-2 h-3.5 w-56 rounded-md" />
        </div>
      </div>

      {/* Talent cards */}
      <TalentCardSkeletonGrid />

      {/* Load more */}
      <div className="mt-7 flex justify-center">
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </section>
  );
}

/* =========================================================
   TALENT CARD GRID
========================================================= */

export function TalentCardSkeletonGrid({ length = 8 }) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length }).map((_, index) => (
        <TalentCardSkeleton key={index} />
      ))}
    </div>
  );
}

/* =========================================================
   TALENT CARD
========================================================= */

function TalentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Profile image */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      {/* Card content */}
      <div className="p-4">
        {/* Name + verification */}
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-28 rounded-md" />

          <Skeleton className="h-4 w-4 rounded-full" />
        </div>

        {/* Role */}
        <Skeleton className="mt-2 h-3 w-32 rounded-md" />

        {/* Location */}
        <Skeleton className="mt-3 h-3 w-24 rounded-md" />

        {/* Skills */}
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
          <Skeleton className="h-3 w-16 rounded-md" />

          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LOAD MORE CATEGORIES
========================================================= */

function LoadMoreCategoriesSkeleton() {
  return (
    <div className="mt-16 flex justify-center border-t border-slate-200 pt-8 sm:mt-24 sm:pt-10">
      <Skeleton className="h-11 w-44 rounded-xl" />
    </div>
  );
}

/* =========================================================
   BASE SKELETON
========================================================= */

function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-100 ${className}`}
    />
  );
}
