"use server";

import { z } from "zod";

import {
    getMoreTalents,
    getTopTalents,
    getNewTalents,
} from "@/data/talents";

const loadMoreTalentsSchema = z.object({
    id: z.string().trim().min(1).max(100),
    talents: z.array(z.unknown()),
});

const discoverTalentsSchema = z.object({
    limit: z.number().int().min(1).max(10),
});

const MAX_LOAD = 8;
const DISCOVER_TALENTS_LIMIT = 10;

/**
 * Load more talents for a category.
 *
 * @param {{
 *   id: string,
 *   talents: unknown[]
 * }} input
 */
export async function loadMoreTalentsAction(input) {
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

    const { id, talents } = validation.data;

    const result = await getMoreTalents({
        categoryId: id,
        cursor: talents.length,
        limit: MAX_LOAD,
    });

    return {
        success: true,
        ...result,
        error: null,
    };
}

/**
 * Get top talents for Discover.
 *
 * @param {{ limit?: number }} input
 */
export async function getTopTalentsAction(input = {}) {
    const validation =
        discoverTalentsSchema.safeParse({
            limit:
                input.limit ??
                DISCOVER_TALENTS_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            talents: [],
            error: "Invalid request.",
        };
    }

    const talents = await getTopTalents(
        validation.data.limit
    );

    return {
        success: true,
        talents,
        error: null,
    };
}

/**
 * Get newest talents for Discover.
 *
 * @param {{ limit?: number }} input
 */
export async function getNewTalentsAction(input = {}) {
    const validation =
        discoverTalentsSchema.safeParse({
            limit:
                input.limit ??
                DISCOVER_TALENTS_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            talents: [],
            error: "Invalid request.",
        };
    }

    const talents = await getNewTalents(
        validation.data.limit
    );

    return {
        success: true,
        talents,
        error: null,
    };
}