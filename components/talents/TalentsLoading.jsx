export default function TalentsLoading() {
  return <TalentsContentSkeleton />;
}

/* =========================================================
   CONTENT
========================================================= */

function TalentsContentSkeleton() {
  return (
    <section>
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
      <div className="flex items-end justify-between">
        <div>
          <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />

          <div className="mt-2 h-7 w-48 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="hidden h-5 w-24 animate-pulse rounded bg-slate-100 sm:block" />
      </div>

      <div className="mt-5 flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[76px] min-w-[145px] shrink-0 animate-pulse rounded-2xl bg-slate-100"
          />
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
      <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />

      <div className="flex gap-3">
        <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-100" />

        <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-100" />
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
        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />

        <div>
          <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />
        </div>
      </div>

      {/* Talent cards */}
      <TalentCardSkeletonGrid />

      {/* Load more */}
      <div className="mt-7 flex justify-center">
        <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </section>
  );
}

/* =========================================================
   TALENT CARD GRID
========================================================= */

function TalentCardSkeletonGrid() {
  return (
    <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-[360px] animate-pulse rounded-2xl bg-slate-100"
        />
      ))}
    </div>
  );
}

/* =========================================================
   LOAD MORE CATEGORIES
========================================================= */

function LoadMoreCategoriesSkeleton() {
  return (
    <div className="mt-16 flex justify-center border-t border-slate-200 pt-8 sm:mt-24 sm:pt-10">
      <div className="h-11 w-44 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}