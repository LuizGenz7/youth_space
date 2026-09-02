import TalentsContent from "@/components/talents/TalentsContent";
import { Suspense } from "react";

export default function TalentsPage() {
  return (
    <Suspense fallback={<TalentsLoading />}>
      <TalentsContent />
    </Suspense>
  );
}

function TalentsLoading() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <div className="max-w-3xl">
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

          <div className="mt-5 h-12 w-full max-w-xl animate-pulse rounded-lg bg-slate-200 sm:h-16" />

          <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-100" />

          <div className="mt-7 h-16 w-full animate-pulse rounded-2xl bg-slate-100" />
        </div>

        <div className="mt-12">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />

          <div className="mt-5 flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-20 min-w-[145px] animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        </div>

        <div className="mt-10 border-b border-slate-200 pb-6">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
