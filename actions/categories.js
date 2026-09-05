"use server";

import { z } from "zod";

import { getTopCategories } from "@/data/categories";

const topCategoriesSchema = z.object({
    limit: z.number().int().min(1).max(10),
});

const TOP_CATEGORIES_LIMIT = 10;

/**
 * Get top categories for the Discover page.
 *
 * @param {{ limit?: number }} input
 */
export async function getTopCategoriesAction(
    input = {}
) {
    const validation =
        topCategoriesSchema.safeParse({
            limit:
                input.limit ??
                TOP_CATEGORIES_LIMIT,
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