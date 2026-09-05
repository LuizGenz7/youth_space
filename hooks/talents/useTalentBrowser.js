"use client";

import { useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const INITIAL_CATEGORY_COUNT = 6;
const CATEGORIES_PER_LOAD = 6;

export const locations = [
  "All locations",
  "Lusaka",
  "Ndola",
  "Kitwe",
  "Livingstone",
];

export const sortOptions = [
  "Recommended",
  "Newest",
  "A-Z",
  "Available now",
];

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export default function useTalentBrowser({
  talents = [],
  categories = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * =========================================================
   * FILTER STATE
   * =========================================================
   *
   * The URL is the source of truth.
   *
   * CategorySection receives these values and performs
   * filtering on the talents it already has.
   */

  const search =
    searchParams.get("search") || "";

  const categoryParam =
    searchParams.get("category") || "";

  const location =
    searchParams.get("location") ||
    "All locations";

  const sort =
    searchParams.get("sort") ||
    "Recommended";

  /*
   * =========================================================
   * CATEGORY PAGINATION
   * =========================================================
   */

  const [
    visibleCategoryCount,
    setVisibleCategoryCount,
  ] = useState(INITIAL_CATEGORY_COUNT);

  /*
   * =========================================================
   * AVAILABLE CATEGORIES
   * =========================================================
   *
   * Categories come from the server.
   *
   * We intentionally do not filter categories based on the
   * current talent filters.
   *
   * This allows CategorySection to decide whether it needs
   * to lazy-load its own data.
   */

  const availableCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        Number(category.totalTalents || 0) > 0,
    );
  }, [categories]);

  /*
   * =========================================================
   * ACTIVE CATEGORY
   * =========================================================
   */

  const activeCategory = useMemo(() => {
    if (!categoryParam) {
      return null;
    }

    return (
      availableCategories.find(
        (category) =>
          normalize(category.name) ===
          normalize(categoryParam),
      ) || null
    );
  }, [
    availableCategories,
    categoryParam,
  ]);

  const activeCategoryName =
    activeCategory?.name || "";

  /*
   * =========================================================
   * CATEGORY SECTIONS
   * =========================================================
   *
   * IMPORTANT:
   *
   * We use the ORIGINAL talents here.
   *
   * We do NOT apply search, location or sort here.
   *
   * This prevents a filter from turning a category's
   * initialTalents into an empty array and accidentally
   * triggering CategorySection's lazy fetch.
   */

  const categorySections = useMemo(() => {
    return availableCategories.map(
      (category) => {
        const categoryTalents =
          talents.filter(
            (talent) =>
              normalize(talent.category) ===
              normalize(category.name),
          );

        return {
          ...category,
          talents: categoryTalents,
        };
      },
    );
  }, [
    availableCategories,
    talents,
  ]);

  /*
   * =========================================================
   * URL HELPERS
   * =========================================================
   */

  function updateParams(updates = {}) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    Object.entries(updates).forEach(
      ([key, value]) => {
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
      },
    );

    const query = params.toString();

    router.replace(
      query
        ? `${pathname}?${query}`
        : pathname,
      {
        scroll: false,
      },
    );
  }

  /*
   * =========================================================
   * RESET CATEGORY PAGINATION
   * =========================================================
   */

  function resetPagination() {
    setVisibleCategoryCount(
      INITIAL_CATEGORY_COUNT,
    );
  }

  /*
   * =========================================================
   * FILTER ACTIONS
   * =========================================================
   */

  function changeSearch(value) {
    updateParams({
      search: value.trim()
        ? value
        : null,
    });

    resetPagination();
  }

  function changeCategory(value) {
    updateParams({
      category: value,
    });

    resetPagination();
  }

  function changeLocation(value) {
    updateParams({
      location: value,
    });

    resetPagination();
  }

  function changeSort(value) {
    updateParams({
      sort: value,
    });

    resetPagination();
  }

  function clearFilters() {
    router.replace(pathname, {
      scroll: false,
    });

    resetPagination();
  }

  /*
   * =========================================================
   * FILTER STATE
   * =========================================================
   */

  const isSearching =
    Boolean(search.trim());

  const hasActiveFilters =
    isSearching ||
    Boolean(activeCategoryName) ||
    location !== "All locations" ||
    sort !== "Recommended";

  /*
   * =========================================================
   * VISIBLE CATEGORIES
   * =========================================================
   *
   * Category filtering only controls WHICH sections are
   * displayed.
   *
   * Talent filtering itself happens inside CategorySection.
   */

  const visibleCategories =
    activeCategoryName
      ? categorySections.filter(
          (category) =>
            normalize(category.name) ===
            normalize(activeCategoryName),
        )
      : categorySections.slice(
          0,
          visibleCategoryCount,
        );

  /*
   * =========================================================
   * CATEGORY PAGINATION
   * =========================================================
   */

  const hasMoreCategories =
    !activeCategoryName &&
    visibleCategoryCount <
      categorySections.length;

  function loadMoreCategories() {
    if (!hasMoreCategories) {
      return;
    }

    setVisibleCategoryCount(
      (currentCount) =>
        Math.min(
          currentCount +
            CATEGORIES_PER_LOAD,
          categorySections.length,
        ),
    );
  }

  /*
   * =========================================================
   * RESULTS
   * =========================================================
   *
   * This is the number of talents initially supplied to
   * the page.
   *
   * Individual CategorySection components apply the active
   * filters to their own loaded data.
   */

  const totalResults = talents.length;

  /*
   * =========================================================
   * RETURN
   * =========================================================
   */

  return {
    /*
     * Filters
     */
    search,
    category: activeCategoryName,
    location,
    sort,

    /*
     * Filter options
     */
    locations,
    sortOptions,

    /*
     * Categories
     */
    availableCategories,
    categorySections,
    visibleCategories,

    /*
     * Results
     */
    totalResults,
    hasActiveFilters,

    /*
     * Category pagination
     */
    hasMoreCategories,
    loadMoreCategories,

    /*
     * Filter actions
     */
    changeSearch,
    changeCategory,
    changeLocation,
    changeSort,
    clearFilters,
  };
}