export default function CategoriesHeroSkeleton() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-900">
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl animate-pulse">
          {/* Eyebrow */}
          <div className="h-3 w-24 rounded bg-white/20" />

          {/* Heading */}
          <div className="mt-5 h-12 w-3/4 rounded-lg bg-white/20 sm:h-14 lg:h-16" />

          {/* Description */}
          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/10" />
          <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-white/10" />

          {/* Search */}
          <div className="mt-7 h-[60px] w-full rounded-2xl bg-white/20" />

          {/* Search hint */}
          <div className="mt-3 h-3 w-64 rounded bg-white/10" />
        </div>
      </div>
    </section>
  );
}
