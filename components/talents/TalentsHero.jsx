"use client";

import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TalentsHero({ talentsLoading = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  function updateSearch(value) {
    const params = new URLSearchParams(searchParams.toString());

    const trimmedValue = value.trim();

    if (trimmedValue) {
      params.set("search", trimmedValue);
    } else {
      params.delete("search");
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleChange(event) {
    updateSearch(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      {/* Hero image */}
      <Image
        src="/images/hero/talents-hero.webp"
        alt="Young people sharing their skills and creative work"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-slate-950/2" aria-hidden="true" />

      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50"
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/70 to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
            Discover Talent
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Find the right
            <span className="block text-white/60">person for the job.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Discover talented young people offering creative skills,
            professional services, and local expertise.
          </p>

          {/* Search */}
          <form onSubmit={handleSubmit} className="mt-7" role="search">
            <div
              className={`flex items-center rounded-2xl border border-white/20 bg-white p-2 shadow-xl transition ${
                talentsLoading
                  ? "opacity-70"
                  : "focus-within:border-white/40 focus-within:ring-4 focus-within:ring-white/10"
              }`}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400"
                aria-hidden="true"
              >
                <Search size={19} />
              </div>

              <input
                type="search"
                value={search}
                disabled={talentsLoading}
                onChange={handleChange}
                placeholder={
                  talentsLoading
                    ? "Loading talents..."
                    : "Search talents, skills or services..."
                }
                aria-label="Search talents, skills or services"
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed sm:text-base"
              />

              <button
                type="submit"
                disabled={talentsLoading || !search.trim()}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="hidden sm:inline">
                  {talentsLoading ? "Loading..." : "Search"}
                </span>

                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </form>

          <p className="mt-3 text-xs text-white/50">
            Search by name, skill, service, category, or location.
          </p>
        </div>
      </div>
    </section>
  );
}
