export default function TalentsHeroLoading() {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-900"
      aria-hidden="true"
    >
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl animate-pulse">
          {/* Eyebrow */}
          <div className="h-3 w-32 rounded bg-white/20" />

          {/* Heading */}
          <div className="mt-5 h-12 w-80 rounded bg-white/20 sm:h-14 sm:w-[28rem] lg:h-16 lg:w-[34rem]" />
          <div className="mt-3 h-12 w-64 rounded bg-white/10 sm:h-14 sm:w-80 lg:h-16 lg:w-96" />

          {/* Description */}
          <div className="mt-6 space-y-2">
            <div className="h-4 w-full max-w-xl rounded bg-white/10" />
            <div className="h-4 w-4/5 max-w-lg rounded bg-white/10" />
          </div>

          {/* Search */}
          <div className="mt-7 h-[60px] w-full rounded-2xl bg-white/90 p-2">
            <div className="flex h-full items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200" />

              <div className="h-4 flex-1 rounded bg-slate-200" />

              <div className="h-11 w-24 shrink-0 rounded-xl bg-slate-300" />
            </div>
          </div>

          {/* Hint */}
          <div className="mt-3 h-3 w-72 rounded bg-white/10" />
        </div>
      </div>
    </section>
  );
}