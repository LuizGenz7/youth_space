"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
  LoaderCircle,
} from "lucide-react";

import QuickCategories from "@/components/talents/QuickCategories";
import TalentFilters from "@/components/talents/TalentFilters";
import CategorySection from "@/components/talents/CategorySection";
import EmptyState from "@/components/talents/EmptyState";

import useTalentBrowser from "@/hooks/talents/useTalentBrowser";
import { useTalentsStore } from "@/stores/talentsStore";

export default function TalentsContent({
  talents: initialTalents = [],
  categories = [],
}) {
  /*
   * =========================================================
   * SERVER DATA
   * =========================================================
   *
   * Keep the server-provided talents stable.
   *
   * CategorySection is responsible for category-level
   * fetching and pagination.
   */

  const [talents] = useState(initialTalents);

  /*
   * =========================================================
   * LOCAL UI STATE
   * =========================================================
   */

  const [loadingCategories, setLoadingCategories] =
    useState(false);

  /*
   * =========================================================
   * TALENT BROWSER
   * =========================================================
   *
   * The URL remains the source of truth for:
   *
   * - search
   * - category
   * - location
   * - sort
   */

  const browser = useTalentBrowser({
    talents,
    categories,
  });

  /*
   * =========================================================
   * ZUSTAND
   * =========================================================
   */

  const categoryResults = useTalentsStore(
    (state) => state.categoryResults,
  );

  const setTalentsLoading = useTalentsStore(
    (state) => state.setTalentsLoading,
  );

  /*
   * =========================================================
   * FILTER KEY
   * =========================================================
   *
   * Every unique filter combination gets its own key.
   *
   * This prevents results from an old search being reused
   * for a new search.
   *
   * Example:
   *
   * search=John
   * category=
   * location=All locations
   * sort=Recommended
   *
   * becomes a unique key.
   */

  const filtersKey = useMemo(() => {
    return JSON.stringify({
      search: browser.search.trim(),
      category: browser.category || "",
      location: browser.location || "",
      sort: browser.sort || "",
    });
  }, [
    browser.search,
    browser.category,
    browser.location,
    browser.sort,
  ]);

  /*
   * =========================================================
   * PAGE LOADING STATE
   * =========================================================
   */

  useEffect(() => {
    setTalentsLoading(false);

    return () => {
      setTalentsLoading(true);
    };
  }, [setTalentsLoading]);

  /*
   * =========================================================
   * LOAD MORE CATEGORIES
   * =========================================================
   */

  function handleLoadMoreCategories() {
    if (
      loadingCategories ||
      !browser.hasMoreCategories
    ) {
      return;
    }

    setLoadingCategories(true);

    try {
      browser.loadMoreCategories();
    } catch (error) {
      console.error(
        "Failed to load more categories:",
        error,
      );
    } finally {
      setLoadingCategories(false);
    }
  }

  /*
   * =========================================================
   * DISPLAY STATE
   * =========================================================
   */

  const isSearching = Boolean(
    browser.search?.trim(),
  );

  /*
   * Only categories currently mounted by this component
   * participate in the global result calculation.
   */

  const visibleCategoryIds = useMemo(() => {
    return browser.visibleCategories
      .map((category) => category.id)
      .filter(Boolean);
  }, [browser.visibleCategories]);

  /*
   * =========================================================
   * CURRENT FILTER RESULTS
   * =========================================================
   *
   * CategorySection stores its result together with the
   * filter key that produced it.
   *
   * Therefore an old result cannot be used for a new search.
   */

  const currentCategoryResultEntries =
    visibleCategoryIds.map(
      (categoryId) => {
        const result =
          categoryResults[categoryId];

        if (!result) {
          return [
            categoryId,
            undefined,
          ];
        }

        /*
         * Ignore results belonging to an older filter state.
         */

        if (
          result.filtersKey !==
          filtersKey
        ) {
          return [
            categoryId,
            undefined,
          ];
        }

        return [
          categoryId,
          result.hasData,
        ];
      },
    );

  /*
   * =========================================================
   * RESULTS READY
   * =========================================================
   *
   * Every visible category must report a result for the
   * CURRENT filtersKey.
   *
   * undefined means:
   *
   * "This category has not evaluated the current filters yet."
   */

  const categoryResultsReady =
    visibleCategoryIds.length > 0 &&
    currentCategoryResultEntries.every(
      ([, hasData]) =>
        typeof hasData === "boolean",
    );

  /*
   * =========================================================
   * ANY MATCHING RESULTS
   * =========================================================
   */

  const hasAnyMatchingResults =
    currentCategoryResultEntries.some(
      ([, hasData]) => hasData === true,
    );

  /*
   * =========================================================
   * GLOBAL EMPTY STATE
   * =========================================================
   *
   * Never show EmptyState while the current filter state is
   * still being evaluated.
   */

  const shouldShowEmptyState =
    categoryResultsReady &&
    !hasAnyMatchingResults;

  /*
   * =========================================================
   * CATEGORY FOOTER
   * =========================================================
   */

  const allCategoriesLoaded =
    !browser.hasMoreCategories;

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* ===================================================
            QUICK CATEGORIES
        =================================================== */}

        <QuickCategories
          categories={browser.availableCategories}
          activeCategory={browser.category}
          onCategoryChange={browser.changeCategory}
        />

        {/* ===================================================
            FILTERS
        =================================================== */}

        <TalentFilters
          totalResults={browser.totalResults}
          activeCategory={browser.category}
          search={browser.search}
          location={browser.location}
          sort={browser.sort}
          locations={browser.locations}
          sortOptions={browser.sortOptions}
          onLocationChange={browser.changeLocation}
          onSortChange={browser.changeSort}
          onSearchChange={browser.changeSearch}
          onCategoryChange={browser.changeCategory}
          onClear={browser.clearFilters}
        />

        {/* ===================================================
            RESULTS
        =================================================== */}

        {shouldShowEmptyState ? (
          <EmptyState
            hasData={talents.length > 0}
            onClear={browser.clearFilters}
          />
        ) : (
          <div className="mt-10 space-y-14">
            {browser.visibleCategories.map(
              (category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  search={browser.search}
                  location={browser.location}
                  sort={browser.sort}
                  filtersKey={filtersKey}
                />
              ),
            )}

            {/* ===============================================
                LOAD MORE CATEGORIES
            =============================================== */}

            {!isSearching &&
              browser.hasMoreCategories && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={
                      handleLoadMoreCategories
                    }
                    disabled={loadingCategories}
                    aria-busy={
                      loadingCategories
                    }
                    className="inline-flex h-11 min-w-37.5 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingCategories ? (
                      <>
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                          aria-hidden="true"
                        />

                        <span>
                          Loading categories...
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          Load more categories
                        </span>

                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>
                </div>
              )}

            {/* ===============================================
                ALL CATEGORIES COMPLETED
            =============================================== */}

            {!isSearching &&
              allCategoriesLoaded &&
              hasAnyMatchingResults && (
                <div className="flex justify-center pt-2">
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    You&apos;ve explored all
                    available talent categories.
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </section>
  );
}
