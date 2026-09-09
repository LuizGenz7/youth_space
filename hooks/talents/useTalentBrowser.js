"use client";

import { useMemo, useState } from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

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
 * SEARCH MATCH
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
      ? talent.services.map(
          (service) =>
            typeof service === "string"
              ? service
              : service?.name,
        )
      : []),
  ];

  return searchableFields.some(
    (value) =>
      normalize(value).includes(query),
  );
}

/*
 * =========================================================
 * PROVINCE MATCH
 * =========================================================
 */

function matchesProvince(
  talent,
  province,
) {
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
 * DISTRICT MATCH
 * =========================================================
 */

function matchesDistrict(
  talent,
  district,
) {
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

function sortTalents(
  talentList,
  sort,
) {
  const result = [...talentList];

  switch (sort) {
    /*
     * -------------------------------------------------------
     * RECOMMENDED
     * -------------------------------------------------------
     */

    case "Recommended":
      return result.sort(
        (a, b) =>
          Number(b.likes || 0) -
          Number(a.likes || 0),
      );

    /*
     * -------------------------------------------------------
     * NEWEST
     * -------------------------------------------------------
     */

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

    /*
     * -------------------------------------------------------
     * A-Z
     * -------------------------------------------------------
     */

    case "A-Z":
      return result.sort((a, b) =>
        normalize(
          a.displayName,
        ).localeCompare(
          normalize(
            b.displayName,
          ),
        ),
      );

    /*
     * -------------------------------------------------------
     * AVAILABLE NOW
     * -------------------------------------------------------
     */

    case "Available now":
      return result.sort((a, b) => {
        if (
          a.available !==
          b.available
        ) {
          return a.available
            ? -1
            : 1;
        }

        return (
          Number(b.likes || 0) -
          Number(a.likes || 0)
        );
      });

    /*
     * -------------------------------------------------------
     * DEFAULT
     * -------------------------------------------------------
     */

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

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  /*
   * =======================================================
   * URL FILTER STATE
   * =======================================================
   *
   * URL is the source of truth.
   *
   * Example:
   *
   * /talents?
   * category=Hair+%26+Beauty
   * &province=Central
   * &district=Kabwe
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
   */

  const availableCategories =
    useMemo(() => {
      return categories.filter(
        (category) =>
          Number(
            category.totalTalents || 0,
          ) > 0,
      );
    }, [categories]);

  /*
   * =======================================================
   * PROVINCES
   * =======================================================
   *
   * Creates the province filter options
   * directly from the talent data.
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
   *
   * If a province is selected:
   *
   *     show only districts
   *     belonging to that province.
   *
   * If no province is selected:
   *
   *     show all districts.
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

    const values =
      sourceTalents
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
  }, [
    talents,
    province,
  ]);

  /*
   * =======================================================
   * ACTIVE CATEGORY
   * =======================================================
   *
   * URL stores the category NAME.
   *
   * Example:
   *
   * ?category=Hair+%26+Beauty
   *
   * We resolve it to the category object,
   * then use category.id for talent matching.
   */

  const activeCategory =
    useMemo(() => {
      if (!categoryParam) {
        return null;
      }

      const normalizedParam =
        normalize(categoryParam);

      return (
        availableCategories.find(
          (category) =>
            normalize(
              category.name,
            ) ===
            normalizedParam,
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
   */

  const categorySections =
    useMemo(() => {
      return availableCategories.map(
        (category) => {
          /*
           * -------------------------------------------------
           * CATEGORY
           * -------------------------------------------------
           */

          const categoryTalents =
            talents.filter(
              (talent) =>
                talent.categoryId ===
                category.id,
            );

          /*
           * -------------------------------------------------
           * SEARCH
           * -------------------------------------------------
           */

          const searchFiltered =
            categoryTalents.filter(
              (talent) =>
                matchesSearch(
                  talent,
                  search,
                ),
            );

          /*
           * -------------------------------------------------
           * PROVINCE
           * -------------------------------------------------
           */

          const provinceFiltered =
            searchFiltered.filter(
              (talent) =>
                matchesProvince(
                  talent,
                  province,
                ),
            );

          /*
           * -------------------------------------------------
           * DISTRICT
           * -------------------------------------------------
           */

          const districtFiltered =
            provinceFiltered.filter(
              (talent) =>
                matchesDistrict(
                  talent,
                  district,
                ),
            );

          /*
           * -------------------------------------------------
           * SORT
           * -------------------------------------------------
           */

          const filteredTalents =
            sortTalents(
              districtFiltered,
              sort,
            );

          return {
            ...category,

            /*
             * All talents in category.
             */
            talents:
              categoryTalents,

            /*
             * Filtered talents.
             */
            filteredTalents,

            /*
             * Number after filters.
             */
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
   *
   * Applies:
   *
   * category
   * search
   * province
   * district
   * sort
   */

  const filteredTalents =
    useMemo(() => {
      const result =
        talents.filter((talent) => {
          /*
           * CATEGORY
           */

          const categoryMatches =
            !activeCategoryId ||
            talent.categoryId ===
              activeCategoryId;

          /*
           * SEARCH
           */

          const searchMatches =
            matchesSearch(
              talent,
              search,
            );

          /*
           * PROVINCE
           */

          const provinceMatches =
            matchesProvince(
              talent,
              province,
            );

          /*
           * DISTRICT
           */

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
        });

      /*
       * Sort after filtering.
       */

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

  function updateParams(
    updates = {},
  ) {
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

  function changeCategory(
    value,
  ) {
    updateParams({
      category: value,
    });

    resetPagination();
  }

  /*
   * =======================================================
   * PROVINCE
   * =======================================================
   *
   * Changing province clears district.
   *
   * Example:
   *
   * Central + Kabwe
   *        ↓
   * Lusaka
   *        ↓
   * Lusaka + All districts
   */

  function changeProvince(
    value,
  ) {
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

  function changeDistrict(
    value,
  ) {
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
   * VISIBLE CATEGORIES
   * =======================================================
   */

  const visibleCategories =
    activeCategoryId
      ? categorySections.filter(
          (category) =>
            category.id ===
            activeCategoryId,
        )
      : categorySections.slice(
          0,
          visibleCategoryCount,
        );

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