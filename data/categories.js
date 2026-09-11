import {
    cacheLife,
    cacheTag,
} from "next/cache";

import {
    collection,
    doc,
    getDoc,
    getDocs,
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
 * HELPERS
 * --------------------------------------------------
 */

/**
 * Normalize a category into the exact
 * public shape used by the application.
 *
 * IMPORTANT:
 *
 * We intentionally select fields one by one.
 */
function normalizeCategory(
    category
) {
    if (!category) {
        return null;
    }

    return {
        id:
            typeof category.id === "string"
                ? category.id
                : "",

        name:
            typeof category.name === "string"
                ? category.name
                : "",

        icon:
            typeof category.icon === "string"
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
 * Normalize and validate a category limit.
 */
function normalizeLimit(
    limit,
    defaultLimit
) {
    const value = Number(limit);

    if (!Number.isFinite(value)) {
        return defaultLimit;
    }

    return Math.min(
        Math.max(
            Math.floor(value),
            1
        ),
        10
    );
}

/*
 * --------------------------------------------------
 * ALL CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get all categories.
 *
 * Public Firebase data.
 *
 * Cached for one day.
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
 * Alias kept for existing actions.
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
 * Get a single category by ID.
 *
 * Public Firebase data.
 */
export async function getCategoryById(
    categoryId
) {
    "use cache";

    cacheLife("days");

    if (!categoryId) {
        return null;
    }

    const normalizedCategoryId =
        String(categoryId).trim();

    if (!normalizedCategoryId) {
        return null;
    }

    cacheTag(
        CATEGORIES_CACHE_TAG
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
 * Ordered by totalTalents.
 *
 * Public Firebase data.
 */
export async function getTopCategories(
    limit = TOP_CATEGORIES_LIMIT
) {
    "use cache";

    cacheLife("days");

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    const safeLimit =
        normalizeLimit(
            limit,
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
            )
        );

    const snapshot =
        await getDocs(
            categoriesQuery
        );

    return snapshot.docs
        .slice(
            0,
            safeLimit
        )
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
 * IMPORTANT:
 *
 * Because this function uses "use cache",
 * the random result is cached for the
 * cache lifetime.
 */
export async function getRandomCategories(
    limit = RANDOM_CATEGORIES_LIMIT
) {
    "use cache";

    cacheLife("days");

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    const safeLimit =
        normalizeLimit(
            limit,
            RANDOM_CATEGORIES_LIMIT
        );

    const allCategories =
        await getCategories();

    return [...allCategories]
        .sort(
            () =>
                Math.random() - 0.5
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