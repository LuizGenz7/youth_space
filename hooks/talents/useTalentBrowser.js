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
  "Central",
  "Copperbelt",
  "Eastern",
  "Luapula",
  "Lusaka",
  "Muchinga",
  "Northern",
  "North-Western",
  "Southern",
  "Western",
];
export const sortOptions = [
  "Recommended",
  "Newest",
  "A-Z",
  "Available now",
];

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

/*
 * =========================================================
 * HOOK
 * =========================================================
 */

export default function useTalentBrowser({
  talents = [],
  categories = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * =========================================================
   * CURRENT FILTER / SEARCH STATE
   * =========================================================
   *
   * The URL is the source of truth.
   *
   * Example:
   *
   * /talents?search=john&category=Design&location=Lusaka&sort=Newest
   *
   * becomes:
   *
   * search   = "john"
   * category = "Design"
   * location = "Lusaka"
   * sort     = "Newest"
   */

  const search = searchParams.get("search") || "";

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
   * CATEGORY PAGINATION STATE
   * =========================================================
   *
   * Controls how many category sections are visible.
   *
   * This is completely separate from talent filtering.
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
   * Only categories containing talents are displayed.
   *
   * We do NOT apply search/location/sort here.
   *
   * CategorySection needs the original category information
   * so it can decide whether it needs to lazy-load talents.
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
   *
   * Converts the category value from the URL into the
   * actual category object.
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
   * Attach the talents that were already supplied by the
   * server to their matching categories.
   *
   * IMPORTANT:
   *
   * DO NOT filter these talents using:
   *
   * - search
   * - location
   * - sort
   *
   * CategorySection handles those filters.
   *
   * This is important for lazy loading.
   *
   * Example:
   *
   * Category has 50 talents.
   *
   * Server initially gives us 8.
   *
   * If the user searches "John", we still keep those
   * original 8 talents. We don't turn the category into
   * an empty array and accidentally trigger a fetch.
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
   * URL UPDATE
   * =========================================================
   *
   * All search/filter changes go through this function.
   *
   * Example:
   *
   * updateParams({
   *   search: "John"
   * });
   *
   * produces:
   *
   * /talents?search=John
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
   *
   * Whenever a filter changes, start category pagination
   * from the beginning.
   */

  function resetPagination() {
    setVisibleCategoryCount(
      INITIAL_CATEGORY_COUNT,
    );
  }

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   *
   * This updates the search value in the URL.
   *
   * The actual talent filtering happens inside
   * CategorySection.
   */

  function changeSearch(value) {
    updateParams({
      search: value.trim()
        ? value
        : null,
    });

    resetPagination();
  }

  /*
   * =========================================================
   * CATEGORY FILTER
   * =========================================================
   */

  function changeCategory(value) {
    updateParams({
      category: value,
    });

    resetPagination();
  }

  /*
   * =========================================================
   * LOCATION FILTER
   * =========================================================
   */

  function changeLocation(value) {
    updateParams({
      location: value,
    });

    resetPagination();
  }

  /*
   * =========================================================
   * SORT
   * =========================================================
   */

  function changeSort(value) {
    updateParams({
      sort: value,
    });

    resetPagination();
  }

  /*
   * =========================================================
   * CLEAR FILTERS
   * =========================================================
   *
   * Removes all query parameters.
   *
   * Example:
   *
   * /talents?search=John&location=Lusaka
   *
   * becomes:
   *
   * /talents
   */

  function clearFilters() {
    router.replace(pathname, {
      scroll: false,
    });

    resetPagination();
  }

  /*
   * =========================================================
   * FILTER STATUS
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
   * Category filtering controls WHICH category sections
   * are displayed.
   *
   * Talent filtering does NOT happen here.
   *
   * CategorySection handles:
   *
   * - search
   * - location
   * - sort
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
   * This is the number of talents supplied to this page.
   *
   * It is NOT the number of talents matching the current
   * search/filter combination.
   *
   * CategorySection performs the actual filtering.
   */

  const totalResults = talents.length;

  /*
   * =========================================================
   * RETURN
   * =========================================================
   */

  return {
    /*
     * Current search / filters
     */
    search,
    category: activeCategoryName,
    location,
    sort,

    /*
     * Available filter options
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
     * Result information
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
