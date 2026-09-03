export default function TalentsLoading() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <TalentsHeroSkeleton />
      <TalentsContentSkeleton />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function TalentsHeroSkeleton() {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

          {/* Heading */}
          <div className="mt-5 h-12 w-full max-w-2xl animate-pulse rounded-xl bg-slate-200 sm:h-16" />

          {/* Description */}
          <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-slate-100" />

          {/* Search */}
          <div className="mt-7 h-16 w-full max-w-3xl animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTENT
========================================================= */

function TalentsContentSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <BrowseCategoriesSkeleton />
      <FeaturedTalentsSkeleton />
      <CategorySectionsSkeleton />
      <LoadMoreCategoriesSkeleton />
    </div>
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

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="hidden h-5 w-20 animate-pulse rounded bg-slate-100 sm:block" />
      </div>

      <div className="mt-7 flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[76px] min-w-[155px] animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   FEATURED / TRENDING TALENTS
========================================================= */

function FeaturedTalentsSkeleton() {
  return (
    <section className="mt-12 border-b border-slate-200 pb-12 sm:mt-16 sm:pb-16">
      <div className="flex items-end gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />

        <div>
          <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

          <div className="mt-2 h-7 w-48 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />

      <TalentCardSkeletonGrid />
    </section>
  );
}

/* =========================================================
   CATEGORY SECTIONS
========================================================= */

function CategorySectionsSkeleton() {
  return (
    <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-24">
      {Array.from({ length: 3 }).map((_, categoryIndex) => (
        <CategorySectionSkeleton key={categoryIndex} />
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
