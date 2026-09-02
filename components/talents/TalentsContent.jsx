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

const INITIAL_CATEGORY_COUNT = 6;
const CATEGORIES_PER_LOAD = 6;

const INITIAL_TALENTS_PER_CATEGORY = 6;
const TALENTS_PER_CATEGORY_LOAD = 6;

const locations = ["All locations", "Lusaka", "Ndola", "Kitwe", "Livingstone"];

const sortOptions = ["Recommended", "Newest", "A-Z", "Available now"];

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function CategoryIcon({ name, size = 17 }) {
  switch (name) {
    case "scissors":
      return <Scissors size={size} />;

    case "sparkles":
      return <Sparkles size={size} />;

    case "shirt":
      return <Shirt size={size} />;

    case "cake-slice":
      return <CakeSlice size={size} />;

    case "camera":
      return <Camera size={size} />;

    case "code":
      return <Code2 size={size} />;

    case "sliders":
      return <SlidersHorizontal size={size} />;

    default:
      return <Sparkles size={size} />;
  }
}

/*
|--------------------------------------------------------------------------
| Category counts
|--------------------------------------------------------------------------
*/

const categoriesWithCounts = categories
  .map((category) => ({
    ...category,
    count: talents.filter(
      (talent) => normalize(talent.category) === normalize(category.name),
    ).length,
  }))
  .filter((category) => category.count > 0);

/*
|--------------------------------------------------------------------------
| Main component
|--------------------------------------------------------------------------
*/

export default function TalentsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const location = searchParams.get("location") || "All locations";
  const sort = searchParams.get("sort") || "Recommended";

  /*
   * How many categories are currently visible.
   */
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(
    INITIAL_CATEGORY_COUNT,
  );

  /*
   * Each category gets its own independent visible count.
   *
   * Example:
   *
   * {
   *   Barbers: 12,
   *   Photographers: 6,
   *   Designers: 18
   * }
   */
  const [categoryLimits, setCategoryLimits] = useState({});

  /*
   |--------------------------------------------------------------------------
   | Active category
   |--------------------------------------------------------------------------
   */

  const activeCategory = useMemo(() => {
    if (!categoryParam) {
      return null;
    }

    return (
      categoriesWithCounts.find(
        (category) => normalize(category.name) === normalize(categoryParam),
      ) || null
    );
  }, [categoryParam]);

  const activeCategoryName = activeCategory?.name || "";

  /*
   |--------------------------------------------------------------------------
   | URL filters
   |--------------------------------------------------------------------------
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

    resetCategoryLimits();
  }

  function changeCategory(value) {
    updateParams({
      category: value,
    });

    resetCategoryLimits();
  }

  function changeLocation(value) {
    updateParams({
      location: value,
    });

    resetCategoryLimits();
  }

  function changeSort(value) {
    updateParams({
      sort: value,
    });

    resetCategoryLimits();
  }

  function clearFilters() {
    router.push(pathname, {
      scroll: false,
    });

    resetCategoryLimits();
  }

  function resetCategoryLimits() {
    setCategoryLimits({});
    setVisibleCategoryCount(INITIAL_CATEGORY_COUNT);
  }

  /*
   |--------------------------------------------------------------------------
   | Filter talents
   |--------------------------------------------------------------------------
   |
   | We filter the local dataset here for the MVP.
   |
   | Later, this same category structure can be replaced with
   | Firestore queries without changing the UI.
   |
   */

  const filteredTalents = useMemo(() => {
    let results = [...talents];

    /*
     * Search
     */
    if (search.trim()) {
      const query = normalize(search);

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
          .join(" ");

        return normalize(searchableContent).includes(query);
      });
    }

    /*
     * Category
     */
    if (activeCategoryName) {
      results = results.filter(
        (talent) =>
          normalize(talent.category) === normalize(activeCategoryName),
      );
    }

    /*
     * Location
     */
    if (location !== "All locations") {
      results = results.filter(
        (talent) => normalize(talent.location) === normalize(location),
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

  /*
   |--------------------------------------------------------------------------
   | Build category sections
   |--------------------------------------------------------------------------
   |
   | Instead of rendering every talent together, we group them by category.
   */

  const categorySections = useMemo(() => {
    return categoriesWithCounts
      .map((category) => {
        const categoryTalents = filteredTalents.filter(
          (talent) => normalize(talent.category) === normalize(category.name),
        );

        return {
          ...category,
          talents: categoryTalents,
        };
      })
      .filter((category) => category.talents.length > 0);
  }, [filteredTalents]);

  /*
   |--------------------------------------------------------------------------
   | Categories to display
   |--------------------------------------------------------------------------
   */

  const visibleCategories = activeCategoryName
    ? categorySections.filter(
        (category) =>
          normalize(category.name) === normalize(activeCategoryName),
      )
    : categorySections.slice(0, visibleCategoryCount);

  const hasMoreCategories =
    !activeCategoryName && visibleCategoryCount < categorySections.length;

  /*
   |--------------------------------------------------------------------------
   | Category load more
   |--------------------------------------------------------------------------
   */

  function getCategoryLimit(categoryName) {
    return categoryLimits[categoryName] || INITIAL_TALENTS_PER_CATEGORY;
  }

  function loadMoreTalents(categoryName) {
    setCategoryLimits((current) => ({
      ...current,
      [categoryName]:
        getCategoryLimit(categoryName) + TALENTS_PER_CATEGORY_LOAD,
    }));
  }

  function loadMoreCategories() {
    setVisibleCategoryCount((current) => current + CATEGORIES_PER_LOAD);
  }

  /*
   |--------------------------------------------------------------------------
   | Total results
   |--------------------------------------------------------------------------
   */

  const totalResults = filteredTalents.length;

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <TalentsHero search={search} onSearch={changeSearch} />

      <section>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <QuickCategories
            activeCategory={activeCategoryName}
            onCategoryChange={changeCategory}
          />

          {/* Filters */}
          <div className="mt-8 border-b border-slate-200 pb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-950">
                  {totalResults} {totalResults === 1 ? "talent" : "talents"}{" "}
                  found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {activeCategoryName
                    ? `Showing ${activeCategoryName} talents.`
                    : "Browse talented people by category."}
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

          {/* Category sections */}
          {visibleCategories.length > 0 ? (
            <div className="mt-10 space-y-14">
              {visibleCategories.map((category) => {
                const limit = getCategoryLimit(category.name);

                const visibleTalents = category.talents.slice(0, limit);

                const hasMore = limit < category.talents.length;

                return (
                  <CategorySection
                    key={category.id}
                    category={category}
                    talents={visibleTalents}
                    total={category.talents.length}
                    hasMore={hasMore}
                    onLoadMore={() => loadMoreTalents(category.name)}
                  />
                );
              })}

              {/* Load more categories */}
              {hasMoreCategories && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={loadMoreCategories}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Load more categories
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}

              {!hasMoreCategories &&
                !activeCategoryName &&
                categorySections.length > INITIAL_CATEGORY_COUNT && (
                  <p className="text-center text-xs font-medium text-slate-400">
                    You've reached the end of the categories.
                  </p>
                )}
            </div>
          ) : (
            <EmptyState onClear={clearFilters} />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Category Section
|--------------------------------------------------------------------------
*/

function CategorySection({ category, talents, total, hasMore, onLoadMore }) {
  return (
    <section>
      {/* Section heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <CategoryIcon name={category.icon} size={18} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-950">
                {category.name}
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                {total}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Talented people offering {category.name.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      {/* Talent cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {talents.map((talent) => (
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

      {/* Category-specific load more */}
      {hasMore && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            Load more {category.name.toLowerCase()}
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {!hasMore && total > 6 && (
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          You've reached the end of {category.name.toLowerCase()}.
        </p>
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Hero
|--------------------------------------------------------------------------
*/

function TalentsHero({ search, onSearch }) {
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
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/65" />

      {/* Subtle extra gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-slate-950/30" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
            Talents
          </p>

          {/* Heading */}
          <h1 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Find the right
            <span className="block text-white/60">
              person for the job.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Browse talented young people offering creative skills,
            professional services and local expertise.
          </p>

          {/* Search */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSearch(search);
            }}
            className="mt-7"
          >
            <div className="flex items-center rounded-2xl border border-white/20 bg-white p-2 shadow-xl transition focus-within:border-white/40 focus-within:ring-4 focus-within:ring-white/10">
              {/* Search icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                <Search size={19} />
              </div>

              {/* Input */}
              <input
                type="search"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Search talents, skills or services..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 sm:text-base"
              />

              {/* Clear */}
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

              {/* Search button */}
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



/*
|--------------------------------------------------------------------------
| Quick Categories
|--------------------------------------------------------------------------
*/

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
        <CategoryButton
          title="All"
          count={talents.length}
          icon="sliders"
          active={!activeCategory}
          onClick={() => onCategoryChange("All")}
        />

        {categoriesWithCounts.map((item) => (
          <CategoryButton
            key={item.id}
            title={item.name}
            count={item.count}
            icon={item.icon}
            active={normalize(activeCategory) === normalize(item.name)}
            onClick={() => onCategoryChange(item.name)}
          />
        ))}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Category Button
|--------------------------------------------------------------------------
*/

function CategoryButton({ title, count, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-w-36.25 shrink-0 items-center gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.98] ${
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
        <CategoryIcon name={icon} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-black">{title}</p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {count} {count === 1 ? "talent" : "talents"}
        </p>
      </div>
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Filter Button
|--------------------------------------------------------------------------
*/

function FilterButton({ icon: Icon, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
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

/*
|--------------------------------------------------------------------------
| Filter Chip
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

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
