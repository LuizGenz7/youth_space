export default function CategoriesSkeleton() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Categories */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
            >
              <div className="h-11 w-11 rounded-xl bg-slate-200" />

              <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />

              <div className="mt-2 h-3 w-full rounded bg-slate-100" />
              <div className="mt-1 h-3 w-2/3 rounded bg-slate-100" />

              <div className="mt-4 h-3 w-1/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Youth Space Banner */}
        <div className="mt-10 min-h-[360px] animate-pulse bg-slate-200 sm:mt-16 sm:min-h-[400px]" />
      </div>
    </section>
  );
}
