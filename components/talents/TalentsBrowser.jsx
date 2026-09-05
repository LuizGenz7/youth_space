"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

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
  const [talents] = useState(initialTalents);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const browser = useTalentBrowser({
    talents,
    categories,
  });

  const setTalentsLoading = useTalentsStore((state) => state.setTalentsLoading);

  /*
   * =========================================================
   * TALENTS STORE LOADING STATE
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

  async function handleLoadMoreCategories() {
    if (loadingCategories || !browser.hasMoreCategories) {
      return;
    }

    setLoadingCategories(true);

    try {
      browser.loadMoreCategories();
    } catch (error) {
      console.error("handleLoadMoreCategories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }

  const isSearching = Boolean(browser.search?.trim());

  const hasVisibleCategories = browser.visibleCategories.length > 0;

  const allCategoriesLoaded = !browser.hasMoreCategories;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* =====================================================
            QUICK CATEGORIES
            ===================================================== */}

        <QuickCategories
          categories={browser.availableCategories}
          activeCategory={browser.category}
          onCategoryChange={browser.changeCategory}
        />

        {/* =====================================================
            FILTERS
            ===================================================== */}

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

        {/* =====================================================
            CATEGORY RESULTS
            ===================================================== */}

        {hasVisibleCategories ? (
          <div className="mt-10 space-y-14">
            {browser.visibleCategories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}

            {/* =================================================
                LOAD MORE CATEGORIES
                ================================================= */}

            {!isSearching && browser.hasMoreCategories && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleLoadMoreCategories}
                  disabled={loadingCategories}
                  aria-busy={loadingCategories}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingCategories ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />

                      <span>Loading categories...</span>
                    </>
                  ) : (
                    <span>Load more categories</span>
                  )}
                </button>
              </div>
            )}

            {/* =================================================
                ALL CATEGORIES COMPLETED
                ================================================= */}

            {!isSearching && allCategoriesLoaded && (
              <div className="flex justify-center pt-2">
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  You&apos;ve explored all available talent categories.
                </p>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            hasData={talents.length > 0}
            onClear={browser.clearFilters}
          />
        )}
      </div>
    </section>
  );
}
