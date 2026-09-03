"use client";

import { useEffect } from "react";

import QuickCategories from "@/components/talents/QuickCategories";
import TalentFilters from "@/components/talents/TalentFilters";
import CategorySection from "@/components/talents/CategorySection";
import EmptyState from "@/components/talents/EmptyState";

import useTalentBrowser from "@/hooks/talents/useTalentBrowser";
import { useTalentsStore } from "@/stores/talentsStore";
import { LoaderCircle } from "lucide-react";

export default function TalentsContent({ talents = [], categories = [] }) {
  const browser = useTalentBrowser({
    talents,
    categories,
  });

  const setTalentsLoading = useTalentsStore((state) => state.setTalentsLoading);

  useEffect(() => {
    // Talent data has finished loading.
    setTalentsLoading(false);

    // Reset loading state if the content unmounts.
    return () => {
      setTalentsLoading(true);
    };
  }, [setTalentsLoading]);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <QuickCategories
          categories={browser.availableCategories}
          activeCategory={browser.category}
          onCategoryChange={browser.changeCategory}
        />

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

        {browser.visibleCategories.length > 0 ? (
          <div className="mt-10 space-y-14">
            {browser.visibleCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                talents={browser.getCategoryTalents(category)}
                total={browser.getCategoryTotal(category)}
                hasMore={browser.hasMoreTalents(category)}
                loading={browser.isCategoryLoading(category.name)}
                onLoadMore={() => browser.loadMoreTalents(category.name)}
              />
            ))}

            {browser.hasMoreCategories && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={browser.loadMoreCategories}
                  disabled={browser.loadingCategories}
                  aria-busy={browser.loadingCategories}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {browser.loadingCategories ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load more categories</span>
                  )}
                </button>
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
