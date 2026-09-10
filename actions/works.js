"use server";

import { z } from "zod";
import { updateTag } from "next/cache";

import {
  getTrendingWorks,
  toggleWorkLike,
  deleteWork,
} from "@/data/works";

import {
  requireAuthAction,
} from "@/lib/auth-server";

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
      .max(
        TRENDING_WORKS_LIMIT
      ),
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
 * PUBLIC
 *
 * No authentication required.
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
      error:
        "Invalid request.",
    };
  }

  /*
   * --------------------------------------------------
   * LOAD DATA
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
 * AUTHENTICATED USERS ONLY
 *
 * Client sends:
 *
 * {
 *   workId
 * }
 *
 * UID comes from FirebaseServerApp.
 */

export async function toggleLikeAction(
  input = {}
) {
  /*
   * --------------------------------------------------
   * VALIDATE INPUT
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
      error:
        "Invalid request.",
    };
  }

  /*
   * --------------------------------------------------
   * AUTHENTICATE USER
   * --------------------------------------------------
   */

  let user;

  try {
    user =
      await requireAuthAction();
  } catch (error) {
    /*
     * requireAuthAction() redirects when
     * authentication is missing.
     *
     * If the Server Action needs to
     * return an error instead, our
     * requireAuthAction helper should not
     * redirect.
     *
     * We handle the error here so
     * the action never exposes an
     * internal authentication error.
     */

    console.error(
      "[toggleLikeAction] Authentication error:",
      error
    );

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
        liked: false,
        likes: 0,
        error:
          "Work not found.",
      };
    }

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
 * AUTHENTICATED USERS ONLY
 *
 * Client sends:
 *
 * {
 *   workId
 * }
 *
 * The server gets the UID from
 * FirebaseServerApp and verifies
 * ownership inside data/works.js.
 */

export async function deleteWorkAction(
  input = {}
) {
  /*
   * --------------------------------------------------
   * VALIDATE INPUT
   * --------------------------------------------------
   */

  const validation =
    deleteWorkSchema.safeParse(
      input
    );

  if (!validation.success) {
    return {
      success: false,
      error:
        "Invalid request.",
    };
  }

  /*
   * --------------------------------------------------
   * AUTHENTICATE USER
   * --------------------------------------------------
   */

  let user;

  try {
    user =
      await requireAuthAction();
  } catch (error) {
    console.error(
      "[deleteWorkAction] Authentication error:",
      error
    );

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
   * DELETE WORK
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

    // Trending works
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

    // User/talent data
    updateTag(
      `talent:${user.uid}`
    );

    // Profile data
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
