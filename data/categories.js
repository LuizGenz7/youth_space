import {
    cacheLife,
    cacheTag,
} from "next/cache";

import { getFirestore } from "firebase-admin/firestore";

import { adminApp } from "@/lib/firebase-admin";

const db = getFirestore(adminApp);

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
 *
 * Firestore timestamps such as:
 *
 * createdAt
 * updatedAt
 *
 * are NEVER returned.
 */
function normalizeCategory(doc) {
    if (!doc.exists) {
        return null;
    }

    const data = doc.data();

    return {
        id: doc.id,

        name:
            typeof data.name === "string"
                ? data.name
                : "",

        icon:
            typeof data.icon === "string"
                ? data.icon
                : "circle",

        description:
            typeof data.description ===
            "string"
                ? data.description
                : "",

        totalTalents:
            Number(
                data.totalTalents || 0
            ),
    };
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
 * Public data.
 *
 * Cached for one day.
 *
 * Only the normalized category fields
 * are returned.
 */
export async function getCategories() {
    "use cache";

    cacheLife("days");

    cacheTag(
        CATEGORIES_CACHE_TAG
    );

    const snapshot =
        await db
            .collection(
                CATEGORIES_COLLECTION
            )
            .get();

    return snapshot.docs
        .map(normalizeCategory)
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
 * Get a single category.
 *
 * Public data.
 *
 * Firestore:
 *
 * categories/{categoryId}
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

    const doc =
        await db
            .collection(
                CATEGORIES_COLLECTION
            )
            .doc(
                normalizedCategoryId
            )
            .get();

    return normalizeCategory(doc);
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
 * Public data.
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

    const snapshot =
        await db
            .collection(
                CATEGORIES_COLLECTION
            )
            .orderBy(
                "totalTalents",
                "desc"
            )
            .limit(
                safeLimit
            )
            .get();

    return snapshot.docs
        .map(normalizeCategory)
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
 * NOTE:
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
    CATEGORIES_CACHE_TAG,
    TOP_CATEGORIES_LIMIT,
    RANDOM_CATEGORIES_LIMIT,
};