"use client";

import { useMemo, useState } from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

/*
 * =========================================================
 * CONFIG
 * =========================================================
 */

const INITIAL_CATEGORY_COUNT = 6;
const CATEGORIES_PER_LOAD = 6;

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
 * SEARCH
 * =========================================================
 */

function matchesSearch(talent, search) {
  const query = normalize(search);

  if (!query) {
    return true;
  }

  const searchableFields = [
    talent.username,
    talent.displayName,
    talent.role,
    talent.category,
    talent.province,
    talent.district,
    talent.bio,

    ...(Array.isArray(talent.skills)
      ? talent.skills
      : []),

    ...(Array.isArray(talent.services)
      ? talent.services.map((service) =>
          typeof service === "string"
            ? service
            : service?.name,
        )
      : []),
  ];

  return searchableFields.some((value) =>
    normalize(value).includes(query),
  );
}

/*
 * =========================================================
 * PROVINCE
 * =========================================================
 */

function matchesProvince(talent, province) {
  if (
    !province ||
    province === "All provinces"
  ) {
    return true;
  }

  return (
    normalize(talent.province) ===
    normalize(province)
  );
}

/*
 * =========================================================
 * DISTRICT
 * =========================================================
 */

function matchesDistrict(talent, district) {
  if (
    !district ||
    district === "All districts"
  ) {
    return true;
  }

  return (
    normalize(talent.district) ===
    normalize(district)
  );
}

/*
 * =========================================================
 * SORT
 * =========================================================
 */

function sortTalents(talentList, sort) {
  const result = [...talentList];

  switch (sort) {
    case "Recommended":
      return result.sort(
        (a, b) =>
          Number(b.likes || 0) -
          Number(a.likes || 0),
      );

    case "Newest":
      return result.sort((a, b) => {
        const dateA = new Date(
          a.createdAt || 0,
        ).getTime();

        const dateB = new Date(
          b.createdAt || 0,
        ).getTime();

        return dateB - dateA;
      });

    case "A-Z":
      return result.sort((a, b) =>
        normalize(
          a.displayName,
        ).localeCompare(
          normalize(b.displayName),
        ),
      );

    case "Available now":
      return result.sort((a, b) => {
        if (a.available !== b.available) {
          return a.available ? -1 : 1;
        }

        return (
          Number(b.likes || 0) -
          Number(a.likes || 0)
        );
      });

    default:
      return result.sort(
        (a, b) =>
          Number(b.likes || 0) -
          Number(a.likes || 0),
      );
  }
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
   * =======================================================
   * URL FILTER STATE
   * =======================================================
   */

  const search =
    searchParams.get("search") || "";

  const categoryParam =
    searchParams.get("category") || "";

  const province =
    searchParams.get("province") ||
    "All provinces";

  const district =
    searchParams.get("district") ||
    "All districts";

  const sort =
    searchParams.get("sort") ||
    "Recommended";

  /*
   * =======================================================
   * CATEGORY PAGINATION
   * =======================================================
   *
   * Normal behavior:
   *
   *   6
   *   12
   *   18
   *   ...
   *
   * This controls how many categories are normally
   * revealed by "Load more categories".
   */

  const [
    visibleCategoryCount,
    setVisibleCategoryCount,
  ] = useState(
    INITIAL_CATEGORY_COUNT,
  );

  /*
   * =======================================================
   * AVAILABLE CATEGORIES
   * =======================================================
   *
   * IMPORTANT:
   *
   * This must contain ALL categories received from
   * the server.
   *
   * We do NOT slice here.
   *
   * Only categories with talents are included.
   */

  const availableCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        Number(
          category?.totalTalents || 0,
        ) > 0,
    );
  }, [categories]);

  /*
   * =======================================================
   * PROVINCES
   * =======================================================
   */

  const provinces = useMemo(() => {
    const values = talents
      .map(
        (talent) =>
          talent?.province,
      )
      .filter(Boolean);

    return [
      ...new Set(values),
    ].sort((a, b) =>
      String(a).localeCompare(
        String(b),
      ),
    );
  }, [talents]);

  /*
   * =======================================================
   * DISTRICTS
   * =======================================================
   */

  const districts = useMemo(() => {
    const sourceTalents =
      province === "All provinces"
        ? talents
        : talents.filter(
            (talent) =>
              normalize(
                talent?.province,
              ) ===
              normalize(province),
          );

    const values = sourceTalents
      .map(
        (talent) =>
          talent?.district,
      )
      .filter(Boolean);

    return [
      ...new Set(values),
    ].sort((a, b) =>
      String(a).localeCompare(
        String(b),
      ),
    );
  }, [talents, province]);

  /*
   * =======================================================
   * ACTIVE CATEGORY
   * =======================================================
   */

  const activeCategory = useMemo(() => {
    if (!categoryParam) {
      return null;
    }

    const normalizedParam =
      normalize(categoryParam);

    return (
      availableCategories.find(
        (category) =>
          normalize(
            category?.name,
          ) === normalizedParam,
      ) || null
    );
  }, [
    availableCategories,
    categoryParam,
  ]);

  const activeCategoryId =
    activeCategory?.id || "";

  const activeCategoryName =
    activeCategory?.name || "";

  /*
   * =======================================================
   * CATEGORY SECTIONS
   * =======================================================
   *
   * Every available category gets a lightweight
   * section object.
   *
   * IMPORTANT:
   *
   * A category can have:
   *
   *   talents: []
   *
   * when its talents were NOT part of the initial
   * server payload.
   *
   * CategorySection will then use React Query to
   * fetch that category's talents when it is rendered.
   */

  const categorySections = useMemo(() => {
    return availableCategories.map(
      (category) => {
        const categoryTalents =
          talents.filter(
            (talent) =>
              talent?.categoryId ===
              category?.id,
          );

        const searchFiltered =
          categoryTalents.filter(
            (talent) =>
              matchesSearch(
                talent,
                search,
              ),
          );

        const provinceFiltered =
          searchFiltered.filter(
            (talent) =>
              matchesProvince(
                talent,
                province,
              ),
          );

        const districtFiltered =
          provinceFiltered.filter(
            (talent) =>
              matchesDistrict(
                talent,
                district,
              ),
          );

        const filteredTalents =
          sortTalents(
            districtFiltered,
            sort,
          );

        return {
          ...category,

          /*
           * Initial talents only.
           *
           * If this category wasn't included
           * in the server's initial talent payload,
           * this will be [].
           */

          talents: categoryTalents,

          /*
           * Initial filtered talents.
           */

          filteredTalents,

          filteredCount:
            filteredTalents.length,
        };
      },
    );
  }, [
    availableCategories,
    talents,
    search,
    province,
    district,
    sort,
  ]);

  /*
   * =======================================================
   * GLOBAL FILTERED TALENTS
   * =======================================================
   */

  const filteredTalents = useMemo(() => {
    const result = talents.filter(
      (talent) => {
        const categoryMatches =
          !activeCategoryId ||
          talent?.categoryId ===
            activeCategoryId;

        const searchMatches =
          matchesSearch(
            talent,
            search,
          );

        const provinceMatches =
          matchesProvince(
            talent,
            province,
          );

        const districtMatches =
          matchesDistrict(
            talent,
            district,
          );

        return (
          categoryMatches &&
          searchMatches &&
          provinceMatches &&
          districtMatches
        );
      },
    );

    return sortTalents(
      result,
      sort,
    );
  }, [
    talents,
    activeCategoryId,
    search,
    province,
    district,
    sort,
  ]);

  /*
   * =======================================================
   * URL UPDATE
   * =======================================================
   */

  function updateParams(updates = {}) {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    Object.entries(
      updates,
    ).forEach(
      ([key, value]) => {
        const shouldRemove =
          value === null ||
          value === undefined ||
          value === "" ||
          value === "All" ||
          value === "All provinces" ||
          value === "All districts" ||
          value === "Recommended";

        if (shouldRemove) {
          params.delete(key);
        } else {
          params.set(
            key,
            String(value),
          );
        }
      },
    );

    const query =
      params.toString();

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
   * =======================================================
   * RESET PAGINATION
   * =======================================================
   */

  function resetPagination() {
    setVisibleCategoryCount(
      INITIAL_CATEGORY_COUNT,
    );
  }

  /*
   * =======================================================
   * SEARCH
   * =======================================================
   */

  function changeSearch(value) {
    const nextValue =
      String(value || "");

    updateParams({
      search:
        nextValue.trim()
          ? nextValue
          : null,
    });

    resetPagination();
  }

  /*
   * =======================================================
   * CATEGORY
   * =======================================================
   */

  function changeCategory(value) {
    updateParams({
      category: value,
    });

    resetPagination();
  }

  /*
   * =======================================================
   * PROVINCE
   * =======================================================
   */

  function changeProvince(value) {
    updateParams({
      province: value,
      district: null,
    });

    resetPagination();
  }

  /*
   * =======================================================
   * DISTRICT
   * =======================================================
   */

  function changeDistrict(value) {
    updateParams({
      district: value,
    });

    resetPagination();
  }

  /*
   * =======================================================
   * SORT
   * =======================================================
   */

  function changeSort(value) {
    updateParams({
      sort: value,
    });

    resetPagination();
  }

  /*
   * =======================================================
   * CLEAR FILTERS
   * =======================================================
   */

  function clearFilters() {
    router.replace(
      pathname,
      {
        scroll: false,
      },
    );

    resetPagination();
  }

  /*
   * =======================================================
   * FILTER STATUS
   * =======================================================
   */

  const isSearching =
    Boolean(search.trim());

  const hasCategoryFilter =
    Boolean(activeCategoryId);

  const hasProvinceFilter =
    province !== "All provinces";

  const hasDistrictFilter =
    district !== "All districts";

  const hasSortFilter =
    sort !== "Recommended";

  const hasActiveFilters =
    isSearching ||
    hasCategoryFilter ||
    hasProvinceFilter ||
    hasDistrictFilter ||
    hasSortFilter;

  /*
   * =======================================================
   * NORMAL VISIBLE CATEGORIES
   * =======================================================
   *
   * Normally we only render the first N categories.
   *
   * This is what makes category loading lazy.
   */

  const paginatedCategories =
    useMemo(() => {
      return categorySections.slice(
        0,
        visibleCategoryCount,
      );
    }, [
      categorySections,
      visibleCategoryCount,
    ]);

  /*
   * =======================================================
   * VISIBLE CATEGORIES
   * =======================================================
   *
   * IMPORTANT BEHAVIOR:
   *
   * 1. No category selected:
   *
   *      render first 6
   *
   * 2. Category selected:
   *
   *      render ONLY selected category
   *
   * Even if selected category is category #15,
   * it is rendered immediately.
   *
   * CategorySection then fetches its talents because
   * that category has no initial talents.
   */

  const visibleCategories =
    useMemo(() => {
      if (activeCategoryId) {
        const selectedCategory =
          categorySections.find(
            (category) =>
              category?.id ===
              activeCategoryId,
          );

        return selectedCategory
          ? [selectedCategory]
          : [];
      }

      return paginatedCategories;
    }, [
      categorySections,
      paginatedCategories,
      activeCategoryId,
    ]);

  /*
   * =======================================================
   * CATEGORY PAGINATION
   * =======================================================
   */

  const hasMoreCategories =
    !activeCategoryId &&
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
   * =======================================================
   * RESULTS
   * =======================================================
   */

  const totalResults =
    filteredTalents.length;

  const totalAvailableTalents =
    talents.length;

  /*
   * =======================================================
   * RETURN
   * =======================================================
   */

  return {
    /*
     * Current filters
     */

    search,

    category:
      activeCategoryName,

    province,

    district,

    sort,

    /*
     * Filter options
     */

    provinces,

    districts,

    sortOptions,

    /*
     * Categories
     */

    availableCategories,

    categorySections,

    paginatedCategories,

    visibleCategories,

    activeCategory,

    /*
     * Filtered talents
     */

    filteredTalents,

    /*
     * Results
     */

    totalResults,

    totalAvailableTalents,

    /*
     * Filter status
     */

    hasActiveFilters,

    isSearching,

    hasCategoryFilter,

    hasProvinceFilter,

    hasDistrictFilter,

    hasSortFilter,

    /*
     * Pagination
     */

    visibleCategoryCount,

    hasMoreCategories,

    loadMoreCategories,

    /*
     * Actions
     */

    changeSearch,

    changeCategory,

    changeProvince,

    changeDistrict,

    changeSort,

    clearFilters,
  };
}
