"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import TalentsHero from "@/components/talents/TalentsHero";
import QuickCategories from "@/components/talents/QuickCategories";
import TalentFilters from "@/components/talents/TalentFilters";
import CategorySection from "@/components/talents/CategorySection";
import EmptyState from "@/components/talents/EmptyState";

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


const categoriesWithCounts = categories
  .map((category) => ({
    ...category,
    count: talents.filter(
      (talent) => normalize(talent.category) === normalize(category.name),
    ).length,
  }))
  .filter((category) => category.count > 0);

export default function TalentsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const location = searchParams.get("location") || "All locations";
  const sort = searchParams.get("sort") || "Recommended";

  const [visibleCategoryCount, setVisibleCategoryCount] = useState(
    INITIAL_CATEGORY_COUNT,
  );

  const [categoryLimits, setCategoryLimits] = useState({});

  
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
  | URL parameters
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

  function resetCategoryLimits() {
    setCategoryLimits({});
    setVisibleCategoryCount(INITIAL_CATEGORY_COUNT);
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

  /*
  |--------------------------------------------------------------------------
  | Filter talents
  |--------------------------------------------------------------------------
  */

  const filteredTalents = useMemo(() => {
    let results = [...talents];

    // Search
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

    // Category
    if (activeCategoryName) {
      results = results.filter(
        (talent) =>
          normalize(talent.category) === normalize(activeCategoryName),
      );
    }

    // Location
    if (location !== "All locations") {
      results = results.filter(
        (talent) => normalize(talent.location) === normalize(location),
      );
    }

    // Sort
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
  | Category sections
  |--------------------------------------------------------------------------
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
  | Visible categories
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
  | Load more
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

          <TalentFilters
            totalResults={totalResults}
            activeCategory={activeCategoryName}
            search={search}
            location={location}
            sort={sort}
            locations={locations}
            sortOptions={sortOptions}
            onLocationChange={changeLocation}
            onSortChange={changeSort}
            onSearchChange={changeSearch}
            onCategoryChange={changeCategory}
            onClear={clearFilters}
          />

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

              {hasMoreCategories && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={loadMoreCategories}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Load more categories
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
