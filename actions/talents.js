"use server";

import { z } from "zod";
import { getMoreTalents } from "@/data/talents";

const loadMoreTalentsSchema = z.object({
    id: z.string().trim().min(1).max(100),
    talents: z.array(z.unknown()),
});

const MAX_LOAD = 8;

/**
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