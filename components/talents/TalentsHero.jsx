"use client";

import {
  ArrowRight,
  Search,
  X,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useTalentsStore } from "@/stores/talentsStore";

export default function TalentsHero() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const talentsLoading = useTalentsStore(
    (state) => state.talentsLoading,
  );

  const search = searchParams.get("search") || "";

  function changeSearch(value) {
    if (talentsLoading) return;

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    const query = params.toString();

    router.push(
      query
        ? `?${query}`
        : window.location.pathname,
      {
        scroll: false,
      },
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (talentsLoading) return;

    changeSearch(search);
  }

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      style={{
        backgroundImage:
          "url('/images/youth-space-hero.webp')",
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
            onSubmit={handleSubmit}
            className="mt-7"
          >
            <div
              className={`flex items-center rounded-2xl border border-white/20 bg-white p-2 shadow-xl transition ${
                talentsLoading
                  ? "opacity-70"
                  : "focus-within:border-white/40 focus-within:ring-4 focus-within:ring-white/10"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                <Search size={19} />
              </div>

              <input
                type="search"
                value={search}
                disabled={talentsLoading}
                onChange={(event) =>
                  changeSearch(event.target.value)
                }
                placeholder={
                  talentsLoading
                    ? "Loading talents..."
                    : "Search talents, skills or services..."
                }
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed sm:text-base"
              />

              {search && !talentsLoading && (
                <button
                  type="button"
                  onClick={() => changeSearch("")}
                  className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                disabled={talentsLoading}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="hidden sm:inline">
                  {talentsLoading
                    ? "Loading..."
                    : "Search"}
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