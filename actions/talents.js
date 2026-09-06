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

const MAX_LOADED_COUNT = 1000;

/* =========================================================
   SCHEMAS
========================================================= */

const categoryIdSchema = z
    .string()
    .trim()
    .min(
        1,
        "Category ID is required."
    )
    .max(
        100,
        "Category ID is too long."
    );

const categoryLimitSchema = z
    .number()
    .int()
    .min(1)
    .max(INITIAL_CATEGORY_LOAD);

const categoryTalentsSchema = z
    .object({
        categoryId:
            categoryIdSchema,

        limit:
            categoryLimitSchema
                .optional(),
    })
    .strict();

const loadMoreTalentsSchema = z
    .object({
        categoryId:
            categoryIdSchema,

        loadedCount: z
            .number()
            .int()
            .min(0)
            .max(MAX_LOADED_COUNT),
    })
    .strict();

const discoverTalentsSchema = z
    .object({
        limit: z
            .number()
            .int()
            .min(1)
            .max(DISCOVER_TALENTS_LIMIT),
    })
    .strict();

/* =========================================================
   CATEGORY TALENTS
========================================================= */

/**
 * Load the first batch of talents for a category.
 *
 * Public action.
 * No authentication required.
 *
 * Client sends only:
 *
 * {
 *     categoryId,
 *     limit
 * }
 */
export async function loadCategoryTalentsAction(
    input = {},
) {
    const validation =
        categoryTalentsSchema.safeParse(
            input,
        );

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
        const result =
            await getCategoryTalents({
                categoryId,
                limit,
            });

        return {
            success: true,

            talents:
                Array.isArray(
                    result?.talents,
                )
                    ? result.talents
                    : [],

            nextCursor:
                result?.nextCursor ??
                null,

            hasMore:
                Boolean(
                    result?.hasMore,
                ),

            error: null,
        };
    } catch (error) {
        console.error(
            "loadCategoryTalentsAction:",
            error,
        );

        return {
            success: false,
            talents: [],
            nextCursor: null,
            hasMore: false,
            error:
                "Unable to load category talents.",
        };
    }
}

/* =========================================================
   LOAD MORE CATEGORY TALENTS
========================================================= */

/**
 * Load the next batch of talents for a category.
 *
 * Public action.
 * No authentication required.
 *
 * Client sends only:
 *
 * {
 *     categoryId,
 *     loadedCount
 * }
 *
 * Never accept the complete category object.
 */
export async function loadMoreTalentsAction(
    input = {},
) {
    const validation =
        loadMoreTalentsSchema.safeParse(
            input,
        );

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
        const result =
            await getMoreTalents({
                categoryId,
                cursor: loadedCount,
            });

        return {
            success: true,

            talents:
                Array.isArray(
                    result?.talents,
                )
                    ? result.talents
                    : [],

            nextCursor:
                result?.nextCursor ??
                null,

            hasMore:
                Boolean(
                    result?.hasMore,
                ),

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
            error:
                "Unable to load more talents.",
        };
    }
}

/* =========================================================
   DISCOVER — TOP TALENTS
========================================================= */

/**
 * Get top talents for the Discover page.
 *
 * Public action.
 * No authentication required.
 */
export async function getTopTalentsAction(
    input = {},
) {
    const validation =
        discoverTalentsSchema.safeParse({
            limit:
                input?.limit ??
                DISCOVER_TALENTS_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            talents: [],
            error: "Invalid request.",
        };
    }

    try {
        const talents =
            await getTopTalents(
                validation.data.limit,
            );

        return {
            success: true,

            talents:
                Array.isArray(talents)
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
            error:
                "Unable to load top talents.",
        };
    }
}

/* =========================================================
   DISCOVER — NEWEST TALENTS
========================================================= */

/**
 * Get newest talents for the Discover page.
 *
 * Public action.
 * No authentication required.
 */
export async function getNewTalentsAction(
    input = {},
) {
    const validation =
        discoverTalentsSchema.safeParse({
            limit:
                input?.limit ??
                DISCOVER_TALENTS_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            talents: [],
            error: "Invalid request.",
        };
    }

    try {
        const talents =
            await getNewTalents(
                validation.data.limit,
            );

        return {
            success: true,

            talents:
                Array.isArray(talents)
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
            error:
                "Unable to load newest talents.",
        };
    }
}