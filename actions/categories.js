"use server";

import { z } from "zod";

import {
    getTopCategories,
    getRandomCategories,
    getAllCategories,
} from "@/data/categories";

const categoryLimitSchema = z.object({
    limit: z.number().int().min(1).max(10),
});

const TOP_CATEGORIES_LIMIT = 10;
const RANDOM_CATEGORIES_LIMIT = 10;

/**
 * Get top categories for the Discover page.
 *
 * @param {{ limit?: number }} input
 */
export async function getTopCategoriesAction(input = {}) {
    const validation = categoryLimitSchema.safeParse({
        limit: input.limit ?? TOP_CATEGORIES_LIMIT,
    });

    if (!validation.success) {
        return {
            success: false,
            categories: [],
            error: "Invalid request.",
        };
    }

    const categories = await getTopCategories(
        validation.data.limit
    );

    return {
        success: true,
        categories,
        error: null,
    };
}

/**
 * Get random categories.
 *
 * @param {{ limit?: number }} input
 */
export async function getRandomCategoriesAction(input = {}) {
    const validation = categoryLimitSchema.safeParse({
        limit: input.limit ?? RANDOM_CATEGORIES_LIMIT,
    });

    if (!validation.success) {
        return {
            success: false,
            categories: [],
            error: "Invalid request.",
        };
    }

    const categories = await getRandomCategories(
        validation.data.limit
    );

    return {
        success: true,
        categories,
        error: null,
    };
}

/**
 * Get all categories.
 */
export async function getAllCategoriesAction() {
    try {
        const categories = await getAllCategories();

        return {
            success: true,
            categories,
            error: null,
        };
    } catch (error) {
        console.error(
            "getAllCategoriesAction error:",
            error
        );

        return {
            success: false,
            categories: [],
            error: "Failed to load categories.",
        };
    }
}