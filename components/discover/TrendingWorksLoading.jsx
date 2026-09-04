import { TrendingUp } from "lucide-react";

export default function TrendingWorksLoading({
  className = "",
}) {
  return (
    <section className={className}>
      {/* Heading */}
      <div className="flex items-end gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
          <TrendingUp size={19} className="text-slate-200" />
        </div>

        <div>
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-8 w-48 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      {/* Description */}
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />

      {/* Work cards */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            {/* Work image */}
            <div className="aspect-[4/3] w-full animate-pulse bg-slate-100" />

            {/* Work content */}
            <div className="p-4">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />

              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />

              <div className="mt-4 flex items-center justify-between">
                <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />

                <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}