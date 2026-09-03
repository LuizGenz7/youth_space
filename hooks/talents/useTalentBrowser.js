"use client";

import { useMemo, useState } from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import { loadMoreTalentsAction } from "@/actions/talents";

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

    const [
        loadedTalents,
        setLoadedTalents,
    ] = useState(talents);

    const [
        visibleCategoryCount,
        setVisibleCategoryCount,
    ] = useState(INITIAL_CATEGORY_COUNT);

    const [categoryLoading, setCategoryLoading] =
        useState({});

    const [categoriesLoading, setCategoriesLoading] =
        useState(false);

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
        setVisibleCategoryCount(
            INITIAL_CATEGORY_COUNT,
        );
    }

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

    const filteredTalents = useMemo(() => {
        let results = [...loadedTalents];

        if (search.trim()) {
            const query = normalize(search);

            results = results.filter((talent) => {
                const searchableContent = [
                    talent.role,
                    talent.category,
                    talent.location,
                    talent.description,
                    ...(Array.isArray(talent.skills)
                        ? talent.skills
                        : []),
                ]
                    .filter(Boolean)
                    .join(" ");

                return normalize(
                    searchableContent,
                ).includes(query);
            });
        }

        if (activeCategoryName) {
            results = results.filter(
                (talent) =>
                    normalize(talent.category) ===
                    normalize(activeCategoryName),
            );
        }

        if (location !== "All locations") {
            results = results.filter(
                (talent) =>
                    normalize(talent.location) ===
                    normalize(location),
            );
        }

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
        loadedTalents,
        search,
        activeCategoryName,
        location,
        sort,
    ]);

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

    const hasActiveFilters =
        Boolean(search.trim()) ||
        Boolean(activeCategoryName) ||
        location !== "All locations";

    function getCategoryTotal(category) {
        if (hasActiveFilters) {
            return category.talents.length;
        }

        return Number(
            category.totalTalents || 0,
        );
    }

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
            availableCategories.length;

    function getCategoryTalents(category) {
        return category.talents;
    }

    function hasMoreTalents(category) {
        if (hasActiveFilters) {
            return false;
        }

        return (
            category.talents.length <
            Number(category.totalTalents || 0)
        );
    }

    function isCategoryLoading(categoryId) {
        return Boolean(
            categoryLoading[categoryId],
        );
    }

    async function loadMoreTalents(category) {
        if (!category?.id) {
            return;
        }

        if (isCategoryLoading(category.id)) {
            return;
        }

        if (!hasMoreTalents(category)) {
            return;
        }

        setCategoryLoading((current) => ({
            ...current,
            [category.id]: true,
        }));

        try {
            const result =
                await loadMoreTalentsAction(
                    category,
                );

            if (!result?.success) {
                console.error(
                    result?.error ||
                        "Failed to load more talents.",
                );

                return;
            }

            if (
                !Array.isArray(
                    result.talents,
                ) ||
                result.talents.length === 0
            ) {
                return;
            }

            setLoadedTalents((current) => [
                ...current,
                ...result.talents,
            ]);
        } catch (error) {
            console.error(
                "loadMoreTalents:",
                error,
            );
        } finally {
            setCategoryLoading((current) => ({
                ...current,
                [category.id]: false,
            }));
        }
    }

    function loadMoreCategories() {
        if (
            categoriesLoading ||
            !hasMoreCategories
        ) {
            return;
        }

        setCategoriesLoading(true);

        setVisibleCategoryCount(
            (current) =>
                current + CATEGORIES_PER_LOAD,
        );

        setCategoriesLoading(false);
    }

    return {
        search,
        category: activeCategoryName,
        location,
        sort,

        locations,
        sortOptions,

        availableCategories,
        filteredTalents,
        categorySections,
        visibleCategories,

        totalResults:
            filteredTalents.length,

        getCategoryTotal,

        hasMoreCategories,
        loadingCategories:
            categoriesLoading,
        loadMoreCategories,

        getCategoryTalents,
        hasMoreTalents,
        isCategoryLoading,
        loadMoreTalents,

        changeSearch,
        changeCategory,
        changeLocation,
        changeSort,
        clearFilters,
    };
}