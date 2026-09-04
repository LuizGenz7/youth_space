"use client";

import { useEffect, useState } from "react";

import QuickCategories from "@/components/talents/QuickCategories";
import TalentFilters from "@/components/talents/TalentFilters";
import CategorySection from "@/components/talents/CategorySection";
import EmptyState from "@/components/talents/EmptyState";

import useTalentBrowser from "@/hooks/talents/useTalentBrowser";
import { useTalentsStore } from "@/stores/talentsStore";

import { LoaderCircle } from "lucide-react";
import { loadCategoryTalentsAction } from "@/actions/talents";

const TALENTS_PER_CATEGORY = 8;

export default function TalentsContent({
  talents: initialTalents = [],
  categories = [],
}) {
  const [talents, setTalents] = useState(initialTalents);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState({});

  const browser = useTalentBrowser({
    talents,
    categories,
  });

  const setTalentsLoading = useTalentsStore((state) => state.setTalentsLoading);

  useEffect(() => {
    setTalentsLoading(false);

    return () => {
      setTalentsLoading(true);
    };
  }, [setTalentsLoading]);

  async function loadCategoryTalents(category) {
    if (!category?.id) return;

    if (categoryLoading[category.id]) return;

    const alreadyLoaded = talents.some(
      (talent) => String(talent.categoryId || "") === String(category.id),
    );

    if (alreadyLoaded) return;

    setCategoryLoading((current) => ({
      ...current,
      [category.id]: true,
    }));

    try {
      const result = await loadCategoryTalentsAction({
        categoryId: category.id,
        limit: TALENTS_PER_CATEGORY,
      });

      if (!result?.success) {
        console.error(result?.error || "Failed to load category talents.");
        return;
      }

      if (!Array.isArray(result.talents) || result.talents.length === 0) {
        return;
      }

      setTalents((current) => {
        const existingIds = new Set(current.map((talent) => talent.id));

        const newTalents = result.talents.filter(
          (talent) => !existingIds.has(talent.id),
        );

        return [...current, ...newTalents];
      });
    } catch (error) {
      console.error("loadCategoryTalents:", error);
    } finally {
      setCategoryLoading((current) => ({
        ...current,
        [category.id]: false,
      }));
    }
  }

  async function handleLoadMoreCategories() {
    if (loadingCategories || !browser.hasMoreCategories) {
      return;
    }

    setLoadingCategories(true);

    try {
      const currentCount = browser.visibleCategories.length;
      const nextCategories = browser.availableCategories.slice(
        currentCount,
        currentCount + 6,
      );

      await Promise.all(
        nextCategories.map((category) => loadCategoryTalents(category)),
      );

      browser.loadMoreCategories();
    } catch (error) {
      console.error("handleLoadMoreCategories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }

  const isSearching = Boolean(browser.search?.trim());

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
            {browser.visibleCategories.map((category) => {
              const loading = Boolean(categoryLoading[category.id]);

              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  talents={browser.getCategoryTalents(category)}
                  total={browser.getCategoryTotal(category)}
                  hasMore={browser.hasMoreTalents(category)}
                  loading={loading}
                  onLoadMore={() => loadCategoryTalents(category)}
                />
              );
            })}

            {!isSearching && browser.hasMoreCategories && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleLoadMoreCategories}
                  disabled={loadingCategories}
                  aria-busy={loadingCategories}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingCategories ? (
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
