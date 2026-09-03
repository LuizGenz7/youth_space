"use client";

import {
  ArrowRight,
  Search,
  X,
} from "lucide-react";

export default function TalentsHero({
  search,
  onSearch,
}) {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=85')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/20" />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-slate-950/30" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
            Talents
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Find the right
            <span className="block text-white/60">
              person for the job.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Browse talented young people offering
            creative skills, professional services
            and local expertise.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSearch(search);
            }}
            className="mt-7"
          >
            <div className="flex items-center rounded-2xl border border-white/20 bg-white p-2 shadow-xl transition focus-within:border-white/40 focus-within:ring-4 focus-within:ring-white/10">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                <Search size={19} />
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  onSearch(event.target.value)
                }
                placeholder="Search talents, skills or services..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 sm:text-base"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
              >
                <span className="hidden sm:inline">
                  Search
                </span>

                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}