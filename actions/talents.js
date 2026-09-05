"use server";

import { z } from "zod";

import {
    getCategoryTalents,
    getMoreTalents,
    getTopTalents,
    getNewTalents,
} from "@/data/talents";

/* =========================================================
   CONFIG
========================================================= */

const INITIAL_CATEGORY_LOAD = 8;
const DISCOVER_TALENTS_LIMIT = 10;

/* =========================================================
   SCHEMAS
========================================================= */

const categoryTalentsSchema = z.object({
    categoryId: z.string().trim().min(1).max(100),

    limit: z
        .number()
        .int()
        .min(1)
        .max(8)
        .optional(),
});

const loadMoreTalentsSchema = z.object({
    categoryId: z.string().trim().min(1).max(100),

    loadedCount: z
        .number()
        .int()
        .min(0)
        .max(1000),
});

const discoverTalentsSchema = z.object({
    limit: z
        .number()
        .int()
        .min(1)
        .max(10),
});

/* =========================================================
   CATEGORY TALENTS
========================================================= */


export async function loadCategoryTalentsAction(input) {
    const validation = categoryTalentsSchema.safeParse(input);

    if (!validation.success) {
        return {
            success: false,
            talents: [],
            nextCursor: null,
            hasMore: false,
            error: "Invalid request.",
        };
    }

    const {
        categoryId,
        limit = INITIAL_CATEGORY_LOAD,
    } = validation.data;

    try {
        const result = await getCategoryTalents({
            categoryId,
            limit,
        });

        return {
            success: true,
            talents: Array.isArray(result?.talents)
                ? result.talents
                : [],
            nextCursor: result?.nextCursor ?? null,
            hasMore: Boolean(result?.hasMore),
            error: null,
        };
    } catch (e) {
        return {
            success: false,
            talents: [],
            nextCursor: null,
            hasMore: false,
            error: "Unable to load category talents.",
        };
    }
}

/* =========================================================
   LOAD MORE CATEGORY TALENTS
========================================================= */

/**
 * Load the next batch of talents for a category.
 *
 * The client provides the category object.
 * Only the category ID and currently loaded count
 * are extracted and validated on the server.
 */
export async function loadMoreTalentsAction(category) {
    const input = {
        categoryId: category?.id,
        loadedCount: Array.isArray(category?.talents)
            ? category.talents.length
            : 0,
    };

    const validation =
        loadMoreTalentsSchema.safeParse(input);

    if (!validation.success) {
        return {
            success: false,
            talents: [],
            nextCursor: null,
            hasMore: false,
            error: "Invalid request.",
        };
    }

    const {
        categoryId,
        loadedCount,
    } = validation.data;

    try {
        const result = await getMoreTalents({
            categoryId,
            cursor: loadedCount,
        });

        return {
            success: true,
            talents: Array.isArray(result?.talents)
                ? result.talents
                : [],
            nextCursor: result?.nextCursor ?? null,
            hasMore: Boolean(result?.hasMore),
            error: null,
        };
    } catch (error) {
        console.error(
            "loadMoreTalentsAction:",
            error,
        );

        return {
            success: false,
            talents: [],
            nextCursor: null,
            hasMore: false,
            error: "Unable to load more talents.",
        };
    }
}

/* =========================================================
   DISCOVER — TOP TALENTS
========================================================= */

/**
 * Get top talents for the Discover page.
 */
export async function getTopTalentsAction(
    input = {},
) {
    const validation =
        discoverTalentsSchema.safeParse({
            limit:
                input.limit ?? DISCOVER_TALENTS_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            talents: [],
            error: "Invalid request.",
        };
    }

    try {
        const talents = await getTopTalents(
            validation.data.limit,
        );

        return {
            success: true,
            talents: Array.isArray(talents)
                ? talents
                : [],
            error: null,
        };
    } catch (error) {
        console.error(
            "getTopTalentsAction:",
            error,
        );

        return {
            success: false,
            talents: [],
            error: "Unable to load top talents.",
        };
    }
}

/* =========================================================
   DISCOVER — NEWEST TALENTS
========================================================= */

/**
 * Get newest talents for the Discover page.
 */
export async function getNewTalentsAction(
    input = {},
) {
    const validation =
        discoverTalentsSchema.safeParse({
            limit:
                input.limit ?? DISCOVER_TALENTS_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            talents: [],
            error: "Invalid request.",
        };
    }

    try {
        const talents = await getNewTalents(
            validation.data.limit,
        );

        return {
            success: true,
            talents: Array.isArray(talents)
                ? talents
                : [],
            error: null,
        };
    } catch (error) {
        console.error(
            "getNewTalentsAction:",
            error,
        );

        return {
            success: false,
            talents: [],
            error: "Unable to load newest talents.",
        };
    }
}