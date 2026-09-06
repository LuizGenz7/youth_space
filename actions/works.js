"use server";

import { z } from "zod";
import { updateTag } from "next/cache";

import {
    getTrendingWorks,
    toggleWorkLike,
    deleteWork,
} from "@/data/works";

import { requireAuth } from "@/lib/auth";

/*
 * ==================================================
 * CONFIG
 * ==================================================
 */

const TRENDING_WORKS_LIMIT = 10;

/*
 * ==================================================
 * SCHEMAS
 * ==================================================
 */

const workIdSchema = z
    .string()
    .trim()
    .min(
        1,
        "Work ID is required."
    )
    .max(
        100,
        "Work ID is too long."
    );

const trendingWorksSchema = z
    .object({
        limit: z
            .number()
            .int()
            .min(1)
            .max(TRENDING_WORKS_LIMIT),
    })
    .strict();

const toggleLikeSchema = z
    .object({
        workId: workIdSchema,
    })
    .strict();

const deleteWorkSchema = z
    .object({
        workId: workIdSchema,
    })
    .strict();

/*
 * ==================================================
 * GET TRENDING WORKS
 * ==================================================
 *
 * Public action.
 *
 * Authentication is NOT required.
 */

export async function getTrendingWorksAction(
    input = {}
) {
    /*
     * --------------------------------------------------
     * VALIDATE
     * --------------------------------------------------
     */

    const validation =
        trendingWorksSchema.safeParse({
            limit:
                input?.limit ??
                TRENDING_WORKS_LIMIT,
        });

    if (!validation.success) {
        return {
            success: false,
            works: [],
            error: "Invalid request.",
        };
    }

    /*
     * --------------------------------------------------
     * LOAD
     * --------------------------------------------------
     */

    try {
        const works =
            await getTrendingWorks(
                validation.data.limit
            );

        return {
            success: true,

            works:
                Array.isArray(works)
                    ? works
                    : [],

            error: null,
        };
    } catch (error) {
        console.error(
            "[getTrendingWorksAction]",
            error
        );

        return {
            success: false,
            works: [],
            error:
                "Unable to load trending works.",
        };
    }
}

/*
 * ==================================================
 * TOGGLE LIKE
 * ==================================================
 *
 * Authenticated users only.
 *
 * The client sends ONLY:
 *
 * {
 *     workId
 * }
 *
 * UID is always taken from the
 * verified server session.
 */

export async function toggleLikeAction(
    input = {}
) {
    /*
     * --------------------------------------------------
     * VALIDATE
     * --------------------------------------------------
     */

    const validation =
        toggleLikeSchema.safeParse(
            input
        );

    if (!validation.success) {
        return {
            success: false,
            liked: false,
            likes: 0,
            error: "Invalid request.",
        };
    }

    /*
     * --------------------------------------------------
     * AUTHENTICATE
     * --------------------------------------------------
     */

    let user;

    try {
        user =
            await requireAuth();
    } catch {
        return {
            success: false,
            liked: false,
            likes: 0,
            error:
                "You must be logged in.",
        };
    }

    const workId =
        validation.data.workId;

    /*
     * --------------------------------------------------
     * TOGGLE LIKE
     * --------------------------------------------------
     */

    try {
        const result =
            await toggleWorkLike({
                workId,
                userId: user.uid,
            });

        /*
         * --------------------------------------------------
         * CACHE INVALIDATION
         * --------------------------------------------------
         *
         * Like count affects:
         *
         * - Individual work
         * - Works lists
         * - Trending works
         */

        updateTag("works");

        updateTag(
            "trending-works"
        );

        updateTag(
            `work:${workId}`
        );

        return {
            success: true,

            liked:
                Boolean(
                    result?.liked
                ),

            likes:
                Number(
                    result?.likes ?? 0
                ),

            error: null,
        };
    } catch (error) {
        console.error(
            "[toggleLikeAction]",
            error
        );

        return {
            success: false,
            liked: false,
            likes: 0,
            error:
                "Unable to update like.",
        };
    }
}

/*
 * ==================================================
 * DELETE WORK
 * ==================================================
 *
 * Authenticated users only.
 *
 * The client sends ONLY:
 *
 * {
 *     workId
 * }
 *
 * Ownership is verified server-side.
 */

export async function deleteWorkAction(
    input = {}
) {
    /*
     * --------------------------------------------------
     * VALIDATE
     * --------------------------------------------------
     */

    const validation =
        deleteWorkSchema.safeParse(
            input
        );

    if (!validation.success) {
        return {
            success: false,
            error: "Invalid request.",
        };
    }

    /*
     * --------------------------------------------------
     * AUTHENTICATE
     * --------------------------------------------------
     */

    let user;

    try {
        user =
            await requireAuth();
    } catch {
        return {
            success: false,
            error:
                "You must be logged in.",
        };
    }

    const workId =
        validation.data.workId;

    /*
     * --------------------------------------------------
     * DELETE
     * --------------------------------------------------
     */

    try {
        await deleteWork({
            workId,
            userId: user.uid,
        });

        /*
         * --------------------------------------------------
         * CACHE INVALIDATION
         * --------------------------------------------------
         */

        // All work lists
        updateTag("works");

        // Discover trending works
        updateTag(
            "trending-works"
        );

        // Individual work
        updateTag(
            `work:${workId}`
        );

        // User's works
        updateTag(
            `talent-works:${user.uid}`
        );

        // User's talent/profile data
        updateTag(
            `talent:${user.uid}`
        );

        // Profile cache
        updateTag("profiles");

        updateTag(
            `profile:${user.uid}`
        );

        return {
            success: true,
            error: null,
        };
    } catch (error) {
        console.error(
            "[deleteWorkAction]",
            error
        );

        /*
         * --------------------------------------------------
         * KNOWN ERRORS
         * --------------------------------------------------
         */

        if (
            error?.message ===
            "Work not found."
        ) {
            return {
                success: false,
                error:
                    "Work not found.",
            };
        }

        if (
            error?.message ===
            "You do not own this work."
        ) {
            return {
                success: false,
                error:
                    "You do not own this work.",
            };
        }

        return {
            success: false,
            error:
                "Unable to delete work.",
        };
    }
}