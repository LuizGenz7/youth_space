"use server";

import { z } from "zod";

import {
    getTopCategories,
    getRandomCategories,
    getAllCategories,
} from "@/data/categories";

/*
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

const TOP_CATEGORIES_LIMIT = 10;
const RANDOM_CATEGORIES_LIMIT = 10;

/*
 * --------------------------------------------------
 * VALIDATION
 * --------------------------------------------------
 */

const categoryLimitSchema =
    z.object({
        limit: z
            .number()
            .int()
            .min(1)
            .max(10),
    });

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

function normalizeInput(input) {
    if (
        !input ||
        typeof input !== "object" ||
        Array.isArray(input)
    ) {
        return {};
    }

    return input;
}

function getErrorMessage(
    error,
    fallback
) {
    if (
        error instanceof Error &&
        error.message
    ) {
        return error.message;
    }

    return fallback;
}

/*
 * --------------------------------------------------
 * GET TOP CATEGORIES
 * --------------------------------------------------
 *
 * Action responsibility:
 *
 * 1. Validate input
 * 2. Call data layer
 * 3. Return serializable result
 *
 * Firestore logic stays inside
 * data/categories.js.
 * --------------------------------------------------
 */

export async function getTopCategoriesAction(
    input = {}
) {
    const safeInput =
        normalizeInput(input);

    const validation =
        categoryLimitSchema.safeParse({
            limit:
                safeInput.limit ??
                TOP_CATEGORIES_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            categories: [],
            error: "Invalid category limit.",
        };
    }

    try {
        const categories =
            await getTopCategories(
                validation.data.limit
            );

        return {
            success: true,
            categories,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            categories: [],
            error: getErrorMessage(
                error,
                "Failed to load top categories."
            ),
        };
    }
}

/*
 * --------------------------------------------------
 * GET RANDOM CATEGORIES
 * --------------------------------------------------
 */

export async function getRandomCategoriesAction(
    input = {}
) {
    const safeInput =
        normalizeInput(input);

    const validation =
        categoryLimitSchema.safeParse({
            limit:
                safeInput.limit ??
                RANDOM_CATEGORIES_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            categories: [],
            error: "Invalid category limit.",
        };
    }

    try {
        const categories =
            await getRandomCategories(
                validation.data.limit
            );

        return {
            success: true,
            categories,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            categories: [],
            error: getErrorMessage(
                error,
                "Failed to load random categories."
            ),
        };
    }
}

/*
 * --------------------------------------------------
 * GET ALL CATEGORIES
 * --------------------------------------------------
 */

export async function getAllCategoriesAction() {
    try {
        const categories =
            await getAllCategories();

        return {
            success: true,
            categories,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            categories: [],
            error: getErrorMessage(
                error,
                "Failed to load categories."
            ),
        };
    }
}