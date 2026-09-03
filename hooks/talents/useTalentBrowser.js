"use client";

import { useMemo, useState } from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

const INITIAL_CATEGORY_COUNT = 6;
const CATEGORIES_PER_LOAD = 6;

const INITIAL_TALENTS_PER_CATEGORY = 6;
const TALENTS_PER_CATEGORY_LOAD = 6;

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
    |--------------------------------------------------------------------------
    | URL state
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | UI state
    |--------------------------------------------------------------------------
    */

    const [
        visibleCategoryCount,
        setVisibleCategoryCount,
    ] = useState(INITIAL_CATEGORY_COUNT);

    const [categoryLimits, setCategoryLimits] =
        useState({});

    const [categoryLoading, setCategoryLoading] =
        useState({});

    const [categoriesLoading, setCategoriesLoading] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    const availableCategories = useMemo(() => {
        return categories.filter(
            (category) =>
                Number(category.totalTalents || 0) > 0,
        );
    }, [categories]);

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
    |--------------------------------------------------------------------------
    | URL helpers
    |--------------------------------------------------------------------------
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

        router.push(
            query
                ? `${pathname}?${query}`
                : pathname,
            {
                scroll: false,
            },
        );
    }

    function resetPagination() {
        setCategoryLimits({});
        setVisibleCategoryCount(
            INITIAL_CATEGORY_COUNT,
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
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
        router.push(pathname, {
            scroll: false,
        });

        resetPagination();
    }

    /*
    |--------------------------------------------------------------------------
    | Filter + sort talents
    |--------------------------------------------------------------------------
    */

    const filteredTalents = useMemo(() => {
        let results = [...talents];

        /*
        | Search
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

                return normalize(
                    searchableContent,
                ).includes(query);
            });
        }

        /*
        | Category
        */

        if (activeCategoryName) {
            results = results.filter(
                (talent) =>
                    normalize(talent.category) ===
                    normalize(activeCategoryName),
            );
        }

        /*
        | Location
        */

        if (location !== "All locations") {
            results = results.filter(
                (talent) =>
                    normalize(talent.location) ===
                    normalize(location),
            );
        }

        /*
        | Sort
        */

        switch (sort) {
            case "A-Z":
                results.sort((a, b) =>
                    String(a.name || "").localeCompare(
                        String(b.name || ""),
                    ),
                );
                break;

            case "Newest":
                results.sort((a, b) => {
                    const dateA = new Date(
                        a.createdAt || 0,
                    ).getTime();

                    const dateB = new Date(
                        b.createdAt || 0,
                    ).getTime();

                    return dateB - dateA;
                });
                break;

            case "Available now":
                results.sort(
                    (a, b) =>
                        Number(Boolean(b.available)) -
                        Number(Boolean(a.available)),
                );
                break;

            case "Recommended":
            default:
                results.sort(
                    (a, b) =>
                        Number(b.likesCount || 0) -
                        Number(a.likesCount || 0),
                );
                break;
        }

        return results;
    }, [
        talents,
        search,
        activeCategoryName,
        location,
        sort,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Category sections
    |--------------------------------------------------------------------------
    */

    const categorySections = useMemo(() => {
        return availableCategories
            .map((category) => {
                const categoryTalents =
                    filteredTalents.filter(
                        (talent) =>
                            normalize(
                                talent.category,
                            ) ===
                            normalize(category.name),
                    );

                return {
                    ...category,
                    talents: categoryTalents,
                };
            })
            .filter(
                (category) =>
                    category.talents.length > 0,
            );
    }, [
        availableCategories,
        filteredTalents,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Category totals
    |--------------------------------------------------------------------------
    |
    | Without filters:
    |   Use the authoritative category total.
    |
    | With search/category/location:
    |   Use the number of matching talents.
    |
    */

    const hasActiveFilters =
        Boolean(search.trim()) ||
        Boolean(activeCategoryName) ||
        location !== "All locations";

    function getCategoryTotal(category) {
        if (hasActiveFilters) {
            return category.talents.length;
        }

        return Number(category.totalTalents || 0);
    }

    /*
    |--------------------------------------------------------------------------
    | Visible categories
    |--------------------------------------------------------------------------
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

    const hasMoreCategories =
        !activeCategoryName &&
        visibleCategoryCount <
        categorySections.length;

    /*
    |--------------------------------------------------------------------------
    | Talent pagination
    |--------------------------------------------------------------------------
    */

    function getCategoryLimit(categoryName) {
        return (
            categoryLimits[categoryName] ||
            INITIAL_TALENTS_PER_CATEGORY
        );
    }

    function getCategoryTalents(category) {
        const limit = getCategoryLimit(
            category.name,
        );

        return category.talents.slice(
            0,
            limit,
        );
    }

    function hasMoreTalents(category) {
        return (
            getCategoryLimit(category.name) <
            category.talents.length
        );
    }

    function isCategoryLoading(categoryName) {
        return Boolean(
            categoryLoading[categoryName],
        );
    }

    function loadMoreTalents(categoryName) {
        if (isCategoryLoading(categoryName)) {
            return;
        }

        setCategoryLoading((current) => ({
            ...current,
            [categoryName]: true,
        }));

        // Temporary loading simulation.
        // Replace with the real data request later.
        setTimeout(() => {
            setCategoryLimits((current) => ({
                ...current,
                [categoryName]:
                    getCategoryLimit(categoryName) +
                    TALENTS_PER_CATEGORY_LOAD,
            }));

            setCategoryLoading((current) => ({
                ...current,
                [categoryName]: false,
            }));
        }, 700);
    }

    /*
    |--------------------------------------------------------------------------
    | Category pagination
    |--------------------------------------------------------------------------
    */

    function loadMoreCategories() {
        if (
            categoriesLoading ||
            !hasMoreCategories
        ) {
            return;
        }

        setCategoriesLoading(true);

        // Temporary loading simulation.
        // Replace with the real data request later.
        setTimeout(() => {
            setVisibleCategoryCount(
                (current) =>
                    current + CATEGORIES_PER_LOAD,
            );

            setCategoriesLoading(false);
        }, 700);
    }

    /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

    return {
        /*
        | URL state
        */

        search,
        category: activeCategoryName,
        location,
        sort,

        /*
        | Options
        */

        locations,
        sortOptions,

        /*
        | Data
        */

        availableCategories,
        filteredTalents,
        categorySections,
        visibleCategories,

        totalResults:
            filteredTalents.length,

        /*
        | Category totals
        */

        getCategoryTotal,

        /*
        | Category pagination
        */

        hasMoreCategories,

        loadingCategories:
            categoriesLoading,

        loadMoreCategories,

        /*
        | Talent pagination
        */

        getCategoryTalents,
        hasMoreTalents,
        isCategoryLoading,
        loadMoreTalents,

        /*
        | Filters
        */

        changeSearch,
        changeCategory,
        changeLocation,
        changeSort,
        clearFilters,
    };
}