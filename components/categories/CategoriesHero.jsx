"use client";

import Image from "next/image";
import { ArrowRight, Search, X } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CategoriesHero({ categoriesLoading = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  function updateSearch(value) {
    if (categoriesLoading) {
      return;
    }

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
    if (categoriesLoading) {
      return;
    }

    updateSearch(event.target.value);
  }

  function clearSearch() {
    if (categoriesLoading) {
      return;
    }

    updateSearch("");
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
      <Image
        src="/images/hero/categories-hero.webp"
        alt="Young people exploring different skills and creative fields"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-slate-950/2" aria-hidden="true" />

      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50"
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/70 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
            Categories
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Explore skills.
            <span className="block text-white/60">Find possibilities.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Explore different skills, services and creative fields from talented
            young people in the Youth Space community.
          </p>

          <form onSubmit={handleSubmit} className="mt-7" role="search">
            <div
              className={`flex items-center rounded-2xl border border-white/20 bg-white p-2 shadow-xl transition ${
                categoriesLoading
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
                disabled={categoriesLoading}
                onChange={handleChange}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && search && !categoriesLoading) {
                    clearSearch();
                  }
                }}
                placeholder={
                  categoriesLoading
                    ? "Loading categories..."
                    : "Search categories..."
                }
                aria-label="Search categories"
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed sm:text-base"
              />

              {search && !categoriesLoading && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                disabled={categoriesLoading || !search.trim()}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="hidden sm:inline">
                  {categoriesLoading ? "Loading..." : "Search"}
                </span>

                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </form>

          <p className="mt-3 text-xs text-white/50">
            Search by category name, skill, or service.
          </p>
        </div>
      </div>
    </section>
  );
}
