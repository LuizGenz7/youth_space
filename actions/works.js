"use server";

import { z } from "zod";

import { getTrendingWorks } from "@/data/works";

const trendingWorksSchema = z.object({
    limit: z.number().int().min(1).max(10),
});

const TRENDING_WORKS_LIMIT = 10;

/**
 * Get trending works for the Discover page.
 *
 * @param {{ limit?: number }} input
 */
export async function getTrendingWorksAction(
    input = {}
) {
    const validation =
        trendingWorksSchema.safeParse({
            limit:
                input.limit ??
                TRENDING_WORKS_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            works: [],
            error: "Invalid request.",
        };
    }

    const works = await getTrendingWorks(
        validation.data.limit
    );

    return {
        success: true,
        works,
        error: null,
    };
}