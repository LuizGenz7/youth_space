"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDownAZ,
  ArrowRight,
  CakeSlice,
  Camera,
  ChevronDown,
  ChevronRight,
  Code2,
  MapPin,
  Scissors,
  Search,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TalentCard from "@/components/talents/TalentCard";

import { talents } from "@/data/talents";
import { categories } from "@/data/categories";

const INITIAL_VISIBLE_COUNT = 8;

const locations = ["All locations", "Lusaka", "Ndola", "Kitwe", "Livingstone"];

const sortOptions = ["Recommended", "Newest", "A-Z", "Available now"];

/*
 * Category icons are UI concerns.
 *
 * categories.js only stores the icon name:
 *
 * icon: "scissors"
 *
 * This keeps the data layer clean and makes it
 * easier to move categories to Firebase later.
 */
const categoryIcons = {
  scissors: Scissors,
  sparkles: Sparkles,
  shirt: Shirt,
  "cake-slice": CakeSlice,
  camera: Camera,
  code: Code2,
  sliders: SlidersHorizontal,
};

/*
 * Build categories from the data source.
 *
 * The category count is derived from talents instead
 * of being manually maintained.
 */
const categoriesWithCounts = categories.map((category) => ({
  ...category,
  count: talents.filter(
    (talent) =>
      talent.category?.trim().toLowerCase() ===
      category.name?.trim().toLowerCase(),
  ).length,
}));

export default function TalentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * URL = source of truth
   *
   * Examples:
   *
   * /talents
   * /talents?category=Barbers
   * /talents?category=barbers
   * /talents?search=developer
   * /talents?location=Lusaka
   * /talents?sort=A-Z
   */

  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const location = searchParams.get("location") || "All locations";
  const sort = searchParams.get("sort") || "Recommended";

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  /*
   * Resolve the category from the URL.
   *
   * Supports:
   *
   * ?category=Barbers
   * ?category=barbers
   *
   * The actual category name always comes from
   * categories.js.
   */
  const activeCategory = useMemo(() => {
    if (!categoryParam) {
      return null;
    }

    return (
      categoriesWithCounts.find(
        (category) =>
          category.name?.trim().toLowerCase() ===
          categoryParam.trim().toLowerCase(),
      ) || null
    );
  }, [categoryParam]);

  const activeCategoryName = activeCategory?.name || "";

  /*
   * Update URL query parameters.
   *
   * Default values are removed from the URL.
   */
  function updateParams(updates = {}) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      const shouldRemove =
        value === null ||
        value === undefined ||
        value === "" ||
        value === "All" ||
        value === "All locations" ||
        value === "Recommended";

      if (shouldRemove) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function changeSearch(value) {
    updateParams({
      search: value.trim() ? value : null,
    });

    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function changeCategory(value) {
    updateParams({
      category: value,
    });

    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function changeLocation(value) {
    updateParams({
      location: value,
    });

    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function changeSort(value) {
    updateParams({
      sort: value,
    });

    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function clearFilters() {
    router.push(pathname, {
      scroll: false,
    });

    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  /*
   * Filter + sort talents.
   */
  const filteredTalents = useMemo(() => {
    let results = [...talents];

    /*
     * Search
     */
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      results = results.filter((talent) => {
        const searchableContent = [
          talent.name,
          talent.role,
          talent.category,
          talent.location,
          talent.description,
          talent.bio,
          ...(talent.skills || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableContent.includes(query);
      });
    }

    /*
     * Category
     *
     * The category name is resolved from categories.js.
     */
    if (activeCategoryName) {
      results = results.filter(
        (talent) =>
          talent.category?.trim().toLowerCase() ===
          activeCategoryName.trim().toLowerCase(),
      );
    }

    /*
     * Location
     */
    if (location !== "All locations") {
      results = results.filter(
        (talent) =>
          talent.location?.trim().toLowerCase() ===
          location.trim().toLowerCase(),
      );
    }

    /*
     * Sort
     */
    if (sort === "A-Z") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "Newest") {
      results.sort((a, b) => b.id - a.id);
    }

    if (sort === "Available now") {
      results.sort((a, b) => Number(b.available) - Number(a.available));
    }

    return results;
  }, [search, activeCategoryName, location, sort]);

  const visibleTalents = filteredTalents.slice(0, visibleCount);

  const hasMore = visibleCount < filteredTalents.length;

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <TalentsHero search={search} onSearch={changeSearch} />

      <section>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          {/* Categories */}
          <QuickCategories
            activeCategory={activeCategoryName}
            onCategoryChange={changeCategory}
          />

          {/* Filters */}
          <div className="mt-8 border-b border-slate-200 pb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-950">
                  {filteredTalents.length} talents found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {activeCategoryName
                    ? `Showing ${activeCategoryName} talents.`
                    : "Discover people offering skills and services."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <FilterButton
                  icon={MapPin}
                  options={locations}
                  value={location}
                  onChange={changeLocation}
                />

                <FilterButton
                  icon={ArrowDownAZ}
                  options={sortOptions}
                  value={sort}
                  onChange={changeSort}
                />
              </div>
            </div>

            {/* Active filters */}
            {(activeCategoryName || location !== "All locations" || search) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-bold text-slate-400">
                  Filters:
                </span>

                {search && (
                  <FilterChip
                    label={`"${search}"`}
                    onRemove={() => changeSearch("")}
                  />
                )}

                {activeCategoryName && (
                  <FilterChip
                    label={activeCategoryName}
                    onRemove={() => changeCategory("All")}
                  />
                )}

                {location !== "All locations" && (
                  <FilterChip
                    label={location}
                    onRemove={() => changeLocation("All locations")}
                  />
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-1 text-xs font-bold text-slate-500 transition hover:text-slate-950"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          {visibleTalents.length > 0 ? (
            <>
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {visibleTalents.map((talent) => (
                  <TalentCard
                    key={talent.id}
                    id={talent.id}
                    image={talent.image}
                    initials={talent.initials}
                    name={talent.name}
                    role={talent.role}
                    location={talent.location}
                    skills={talent.skills}
                    likes={talent.likes}
                    workCount={talent.workCount}
                    verified={talent.verified}
                    available={talent.available}
                  />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount(
                        (current) => current + INITIAL_VISIBLE_COUNT,
                      )
                    }
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Load more
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}

              {/* End */}
              {!hasMore && filteredTalents.length > INITIAL_VISIBLE_COUNT && (
                <p className="mt-8 text-center text-xs font-medium text-slate-400">
                  You've reached the end of the results.
                </p>
              )}
            </>
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function TalentsHero({ search, onSearch }) {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Talents
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Find the right
            <span className="block text-slate-400">person for the job.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Browse talented young people offering creative skills, professional
            services and local expertise.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSearch(search);
            }}
            className="mt-7"
          >
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-950/[0.04]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                <Search size={19} />
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Search talents, skills or services..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium outline-none placeholder:text-slate-400 sm:text-base"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="mr-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <span className="hidden sm:inline">Search</span>

                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CATEGORIES
========================================================= */

function QuickCategories({ activeCategory, onCategoryChange }) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Browse categories
          </p>

          <h2 className="mt-1 text-xl font-black">What are you looking for?</h2>
        </div>

        <Link
          href="/categories"
          className="hidden items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-950 sm:flex"
        >
          All categories
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="-mx-5 mt-5 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none sm:mx-0 sm:px-0">
        {/* All */}
        <CategoryButton
          title="All"
          count={talents.length}
          icon={SlidersHorizontal}
          active={!activeCategory}
          onClick={() => onCategoryChange("All")}
        />

        {/* Categories from data */}
        {categoriesWithCounts.map((item) => {
          const Icon = categoryIcons[item.icon] || Sparkles;

          const active =
            activeCategory?.trim().toLowerCase() ===
            item.name?.trim().toLowerCase();

          return (
            <CategoryButton
              key={item.id}
              title={item.name}
              count={item.count}
              icon={Icon}
              active={active}
              onClick={() => onCategoryChange(item.name)}
            />
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   CATEGORY BUTTON
========================================================= */

function CategoryButton({ title, count, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-w-[145px] shrink-0 items-center gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.98] ${
        active
          ? "border-slate-950 bg-slate-950 text-white shadow-md"
          : "border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-white/10 text-white"
            : "bg-slate-100 text-slate-600 group-hover:bg-slate-950 group-hover:text-white"
        }`}
      >
        <Icon size={17} />
      </div>

      <div>
        <p className="text-xs font-black">{title}</p>

        <p
          className={`mt-0.5 text-[10px] ${
            active ? "text-slate-400" : "text-slate-400"
          }`}
        >
          {count} talents
        </p>
      </div>
    </button>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({ icon: Icon, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      <Icon
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* =========================================================
   FILTER CHIP
========================================================= */

function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
    >
      {label}

      <X size={12} />
    </button>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onClear }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
        <Search size={20} />
      </div>

      <h3 className="mt-5 text-lg font-black">No talents found</h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        We couldn't find anyone matching your current search or filters. Try
        changing your search.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800"
      >
        Clear filters
      </button>
    </div>
  );
}
