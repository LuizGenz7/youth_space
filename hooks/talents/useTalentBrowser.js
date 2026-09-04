"use client";

import { useMemo, useState } from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    loadCategoryTalentsAction,
    loadMoreTalentsAction,
} from "@/actions/talents";

const INITIAL_CATEGORY_COUNT = 6;
const CATEGORIES_PER_LOAD = 6;
const TALENTS_PER_CATEGORY = 8;

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
     * --------------------------------------------------
     * URL STATE
     * --------------------------------------------------
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
     * --------------------------------------------------
     * CLIENT UI STATE
     * --------------------------------------------------
     *
     * These are only concerned with what the UI currently
     * has loaded or is displaying.
     */

    const [loadedTalents, setLoadedTalents] =
        useState(talents);

    const [
        visibleCategoryCount,
        setVisibleCategoryCount,
    ] = useState(INITIAL_CATEGORY_COUNT);

    const [
        categoryLoading,
        setCategoryLoading,
    ] = useState({});

    const [
        categoriesLoading,
        setCategoriesLoading,
    ] = useState(false);

    /*
     * --------------------------------------------------
     * AVAILABLE CATEGORIES
     * --------------------------------------------------
     *
     * Categories themselves are supplied by the server.
     * The client only determines which ones are available
     * to display.
     */

    const availableCategories = useMemo(() => {
        return categories.filter(
            (category) =>
                Number(category.totalTalents || 0) > 0,
        );
    }, [categories]);

    /*
     * --------------------------------------------------
     * ACTIVE CATEGORY
     * --------------------------------------------------
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
     * --------------------------------------------------
     * URL FILTER HELPERS
     * --------------------------------------------------
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

        /*
         * replace() is intentional for keystroke search.
         * It prevents every search keystroke from creating
         * another browser history entry.
         */
        router.replace(
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

    /*
     * --------------------------------------------------
     * FILTER ACTIONS
     * --------------------------------------------------
     *
     * These only modify client/UI state and URL state.
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
     * --------------------------------------------------
     * CLIENT-SIDE FILTERING
     * --------------------------------------------------
     *
     * This works only with data already returned by the
     * server.
     *
     * No database access happens here.
     */

    const filteredTalents = useMemo(() => {
        let results = [...loadedTalents];

        /*
         * Search
         */
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

        /*
         * Category
         */
        if (activeCategoryName) {
            results = results.filter(
                (talent) =>
                    normalize(talent.category) ===
                    normalize(activeCategoryName),
            );
        }

        /*
         * Location
         */
        if (location !== "All locations") {
            results = results.filter(
                (talent) =>
                    normalize(talent.location) ===
                    normalize(location),
            );
        }

        /*
         * Sorting
         */
        switch (sort) {
            case "A-Z":
                results.sort((a, b) =>
                    String(
                        a.name || "",
                    ).localeCompare(
                        String(b.name || ""),
                    ),
                );
                break;

            case "Newest":
                results.sort((a, b) => {
                    const dateA =
                        new Date(
                            a.createdAt || 0,
                        ).getTime();

                    const dateB =
                        new Date(
                            b.createdAt || 0,
                        ).getTime();

                    return dateB - dateA;
                });
                break;

            case "Available now":
                results.sort(
                    (a, b) =>
                        Number(
                            Boolean(b.available),
                        ) -
                        Number(
                            Boolean(a.available),
                        ),
                );
                break;

            case "Recommended":
            default:
                results.sort(
                    (a, b) =>
                        Number(
                            b.likesCount || 0,
                        ) -
                        Number(
                            a.likesCount || 0,
                        ),
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

    /*
     * --------------------------------------------------
     * CATEGORY SECTIONS
     * --------------------------------------------------
     *
     * Every available category gets a section.
     *
     * A category can exist here even when its talents have
     * not been fetched yet.
     */

    const categorySections = useMemo(() => {
        return availableCategories.map(
            (category) => {
                const categoryTalents =
                    filteredTalents.filter(
                        (talent) =>
                            normalize(
                                talent.category,
                            ) ===
                            normalize(
                                category.name,
                            ),
                    );

                return {
                    ...category,
                    talents: categoryTalents,
                };
            },
        );
    }, [
        availableCategories,
        filteredTalents,
    ]);

    /*
     * --------------------------------------------------
     * FILTER STATE
     * --------------------------------------------------
     */

    const hasActiveFilters =
        Boolean(search.trim()) ||
        Boolean(activeCategoryName) ||
        location !== "All locations";

    /*
     * --------------------------------------------------
     * CATEGORY TOTAL
     * --------------------------------------------------
     */

    function getCategoryTotal(category) {
        if (hasActiveFilters) {
            return category.talents.length;
        }

        return Number(
            category.totalTalents || 0,
        );
    }

    /*
     * --------------------------------------------------
     * VISIBLE CATEGORIES
     * --------------------------------------------------
     */

    const visibleCategories =
        activeCategoryName
            ? categorySections.filter(
                (category) =>
                    normalize(
                        category.name,
                    ) ===
                    normalize(
                        activeCategoryName,
                    ),
            )
            : categorySections.slice(
                0,
                visibleCategoryCount,
            );

    /*
     * --------------------------------------------------
     * CATEGORY PAGINATION
     * --------------------------------------------------
     */

    const hasMoreCategories =
        !activeCategoryName &&
        visibleCategoryCount <
        availableCategories.length;

    /*
     * --------------------------------------------------
     * CATEGORY TALENT HELPERS
     * --------------------------------------------------
     */

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

    /*
     * --------------------------------------------------
     * SERVER ACTION:
     * LOAD INITIAL CATEGORY TALENTS
     * --------------------------------------------------
     *
     * The actual Firestore query happens on the server.
     *
     * The client sends only the category ID.
     */

    async function loadCategoryTalents(
        category,
    ) {
        if (!category?.id) {
            return;
        }

        if (isCategoryLoading(category.id)) {
            return;
        }

        /*
         * Don't fetch the category again if it already
         * has talents loaded.
         */
        if (category.talents?.length > 0) {
            return;
        }

        setCategoryLoading((current) => ({
            ...current,
            [category.id]: true,
        }));

        try {
            const result =
                await loadCategoryTalentsAction({
                    categoryId: category.id,
                    limit: TALENTS_PER_CATEGORY,
                });

            if (!result?.success) {
                console.error(
                    result?.error ||
                    "Failed to load category talents.",
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

            setLoadedTalents((current) => {
                const existingIds =
                    new Set(
                        current.map(
                            (talent) =>
                                talent.id,
                        ),
                    );

                const newTalents =
                    result.talents.filter(
                        (talent) =>
                            !existingIds.has(
                                talent.id,
                            ),
                    );

                return [
                    ...current,
                    ...newTalents,
                ];
            });
        } catch (error) {
            console.error(
                "loadCategoryTalents:",
                error,
            );
        } finally {
            setCategoryLoading((current) => ({
                ...current,
                [category.id]: false,
            }));
        }
    }

    /*
     * --------------------------------------------------
     * SERVER ACTION:
     * LOAD MORE TALENTS
     * --------------------------------------------------
     */

    async function loadMoreTalents(
        category,
    ) {
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
                await loadMoreTalentsAction({
                    categoryId: category,
                });

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

            setLoadedTalents((current) => {
                const existingIds =
                    new Set(
                        current.map(
                            (talent) =>
                                talent.id,
                        ),
                    );

                const newTalents =
                    result.talents.filter(
                        (talent) =>
                            !existingIds.has(
                                talent.id,
                            ),
                    );

                return [
                    ...current,
                    ...newTalents,
                ];
            });
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

    /*
     * --------------------------------------------------
     * SERVER ACTION:
     * REVEAL MORE CATEGORIES + LOAD THEIR TALENTS
     * --------------------------------------------------
     *
     * When another 6 categories are revealed, we ask the
     * server for the first 8 talents for each category.
     */

    async function loadMoreCategories() {
        if (
            categoriesLoading ||
            !hasMoreCategories
        ) {
            return;
        }

        setCategoriesLoading(true);

        const currentCount =
            visibleCategoryCount;

        const nextCount = Math.min(
            currentCount +
            CATEGORIES_PER_LOAD,
            availableCategories.length,
        );

        const newCategories =
            availableCategories.slice(
                currentCount,
                nextCount,
            );

        try {
            /*
             * Load the newly revealed categories in
             * parallel.
             *
             * Each request is still executed by the
             * server action.
             */
            await Promise.all(
                newCategories.map(
                    (category) =>
                        loadCategoryTalents(
                            category,
                        ),
                ),
            );

            /*
             * Reveal the categories after their initial
             * data has been requested.
             */
            setVisibleCategoryCount(
                nextCount,
            );
        } catch (error) {
            console.error(
                "loadMoreCategories:",
                error,
            );
        } finally {
            setCategoriesLoading(false);
        }
    }

    /*
     * --------------------------------------------------
     * PUBLIC API
     * --------------------------------------------------
     */

    return {
        /*
         * URL state
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
         * Data already available to the client
         */
        availableCategories,
        filteredTalents,
        categorySections,
        visibleCategories,

        /*
         * Results
         */
        totalResults:
            filteredTalents.length,

        getCategoryTotal,

        /*
         * Category pagination
         */
        hasMoreCategories,
        loadingCategories:
            categoriesLoading,
        loadMoreCategories,

        /*
         * Talent pagination
         */
        getCategoryTalents,
        hasMoreTalents,
        isCategoryLoading,

        /*
         * Server-backed loading
         */
        loadCategoryTalents,
        loadMoreTalents,

        /*
         * Client-side filters
         */
        changeSearch,
        changeCategory,
        changeLocation,
        changeSort,
        clearFilters,
    };
}