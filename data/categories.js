import {
    cacheLife,
    cacheTag,
} from "next/cache";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
} from "firebase/firestore";

import {
    getPublicServerFirebase,
} from "@/lib/server";

/*
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

const CATEGORIES_COLLECTION =
    "categories";

const TOP_CATEGORIES_LIMIT = 10;
const RANDOM_CATEGORIES_LIMIT = 10;

const CATEGORIES_CACHE_TAG =
    "categories";

/*
 * --------------------------------------------------
 * CACHE TAGS
 * --------------------------------------------------
 */

/**
 * Cache tag for one category.
 *
 * Example:
 *
 * category:art
 * category:music
 * category:technology
 */
export function categoryCacheTag(
    categoryId
) {
    return `category:${String(
        categoryId
    )
        .trim()
        .toLowerCase()}`;
}

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

/**
 * Normalize a category into the exact
 * public shape used by the application.
 */
function normalizeCategory(
    category
) {
    if (!category) {
        return null;
    }

    return {
        id:
            typeof category.id ===
                "string"
                ? category.id
                : "",

        name:
            typeof category.name ===
                "string"
                ? category.name
                : "",

        icon:
            typeof category.icon ===
                "string"
                ? category.icon
                : "circle",

        description:
            typeof category.description ===
                "string"
                ? category.description
                : "",

        totalTalents:
            Number(
                category.totalTalents || 0
            ),
    };
}

/**
 * Convert a Firestore document
 * into the public category shape.
 */
function serializeCategory(
    document
) {
    if (!document?.exists()) {
        return null;
    }

    return normalizeCategory({
        id: document.id,
        ...document.data(),
    });
}

/**
 * Normalize and validate a limit.
 */
function normalizeLimit(
    value,
    defaultLimit
) {
    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return defaultLimit;
    }

    return Math.min(
        Math.max(
            Math.floor(number),
            1
        ),
        10
    );
}

/**
 * Normalize a category ID.
 */
function normalizeCategoryId(
    categoryId
) {
    if (!categoryId) {
        return "";
    }

    return String(categoryId)
        .trim()
        .toLowerCase();
}

/*
 * --------------------------------------------------
 * ALL CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get all categories.
 *
 * FIRST REQUEST:
 *   Firestore is queried once.
 *
 * SUBSEQUENT REQUESTS:
 *   Cached for days.
 *
 * IMPORTANT:
 * The entire collection result is one cache
 * entry. If the collection changes, this cache
 * entry must be invalidated.
 */
export async function getCategories() {
    "use cache";

    cacheLife("days");

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    const {
        db,
    } =
        getPublicServerFirebase();

    const categoriesRef =
        collection(
            db,
            CATEGORIES_COLLECTION
        );

    const categoriesQuery =
        query(
            categoriesRef,
            orderBy(
                "name",
                "asc"
        )
        );

    const snapshot =
        await getDocs(
            categoriesQuery
        );

    return snapshot.docs
        .map(
            (document) =>
                serializeCategory(
                    document
                )
        )
        .filter(Boolean);
}

/**
 * Alias kept for existing code.
 */
export async function getAllCategories() {
    return getCategories();
}

/*
 * --------------------------------------------------
 * CATEGORY BY ID
 * --------------------------------------------------
 */

/**
 * Get one category.
 *
 * This category has its own cache tag.
 *
 * Example:
 *
 * category:art
 *
 * Changing Art does not require the Art
 * category's individual cache to be discarded
 * together with unrelated category caches.
 */
export async function getCategoryById(
    categoryId
) {
    "use cache";

    cacheLife("days");

    const normalizedCategoryId =
        normalizeCategoryId(
            categoryId
        );

    if (!normalizedCategoryId) {
        return null;
    }

    cacheTag(
        categoryCacheTag(
            normalizedCategoryId
        )
    );

    const {
        db,
    } =
        getPublicServerFirebase();

    const categoryRef =
        doc(
            db,
            CATEGORIES_COLLECTION,
            normalizedCategoryId
        );

    const snapshot =
        await getDoc(
            categoryRef
        );

    return serializeCategory(
        snapshot
    );
}

/*
 * --------------------------------------------------
 * TOP CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get the most popular categories.
 *
 * Firestore performs the ordering and
 * limiting, so we don't download every
 * category just to select the top results.
 */
export async function getTopCategories(
    limitValue =
        TOP_CATEGORIES_LIMIT
) {
    "use cache";

    cacheLife("days");

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    const safeLimit =
        normalizeLimit(
            limitValue,
            TOP_CATEGORIES_LIMIT
        );

    const {
        db,
    } =
        getPublicServerFirebase();

    const categoriesRef =
        collection(
            db,
            CATEGORIES_COLLECTION
        );

    const categoriesQuery =
        query(
            categoriesRef,

            orderBy(
                "totalTalents",
                "desc"
            ),

            limit(
                safeLimit
            )
        );

    const snapshot =
        await getDocs(
            categoriesQuery
        );

    return snapshot.docs
        .map(
            (document) =>
                serializeCategory(
                    document
                )
        )
        .filter(Boolean);
}

/*
 * --------------------------------------------------
 * RANDOM CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get random categories.
 *
 * Firestore does not provide a native
 * random-document query.
 *
 * Therefore we use the cached complete
 * category collection and randomize it
 * in memory.
 *
 * Because the result is cached for days,
 * the random selection remains stable
 * during the cache lifetime.
 */
export async function getRandomCategories(
    limitValue =
        RANDOM_CATEGORIES_LIMIT
) {
    "use cache";

    cacheLife("days");

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    const safeLimit =
        normalizeLimit(
            limitValue,
            RANDOM_CATEGORIES_LIMIT
        );

    const allCategories =
        await getCategories();

    return [...allCategories]
        .sort(
            () =>
                Math.random() -
                0.5
        )
        .slice(
            0,
            safeLimit
        );
}

/*
 * --------------------------------------------------
 * EXPORTS
 * --------------------------------------------------
 */

export {
    CATEGORIES_COLLECTION,
    CATEGORIES_CACHE_TAG,
    TOP_CATEGORIES_LIMIT,
    RANDOM_CATEGORIES_LIMIT,
};