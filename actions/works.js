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

const workIdSchema =
  z
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

const trendingWorksSchema =
  z
    .object({
      limit:
        z
          .number()
          .int()
          .min(1)
          .max(
            TRENDING_WORKS_LIMIT
          ),
    })
    .strict();

const toggleLikeSchema =
  z
    .object({
      workId:
        workIdSchema,
    })
    .strict();

const deleteWorkSchema =
  z
    .object({
      workId:
        workIdSchema,
    })
    .strict();

/*
 * ==================================================
 * HELPERS
 * ==================================================
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
 * ==================================================
 * GET TRENDING WORKS
 * ==================================================
 *
 * PUBLIC
 *
 * No authentication required.
 * ==================================================
 */

export async function getTrendingWorksAction(
  input = {}
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    trendingWorksSchema.safeParse({
      limit:
        safeInput.limit ??
        TRENDING_WORKS_LIMIT,
    });

  if (!validation.success) {
    return {
      success: false,
      works: [],
      error: "Invalid request.",
    };
  }

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
    return {
      success: false,
      works: [],
      error:
        getErrorMessage(
          error,
          "Unable to load trending works."
        ),
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
 * ==================================================
 */

export async function toggleLikeAction(
  input = {}
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    toggleLikeSchema.safeParse(
      safeInput
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
      await requireAuthAction();
  } catch (error) {
    if (
      error?.code ===
      "AUTH_REQUIRED"
    ) {
      return {
        success: false,
        liked: false,
        likes: 0,
        error:
          "You must be logged in.",
      };
    }

    return {
      success: false,
      liked: false,
      likes: 0,
      error:
        "Authentication failed.",
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

    updateTag(
      "works"
    );

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
 * UID comes from FirebaseServerApp.
 *
 * Ownership is verified by data/works.js.
 * ==================================================
 */

export async function deleteWorkAction(
  input = {}
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    deleteWorkSchema.safeParse(
      safeInput
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
      await requireAuthAction();
  } catch (error) {
    if (
      error?.code ===
      "AUTH_REQUIRED"
    ) {
      return {
        success: false,
        error:
          "You must be logged in.",
      };
    }

    return {
      success: false,
      error:
        "Authentication failed.",
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

    updateTag(
      "works"
    );

    updateTag(
      "trending-works"
    );

    updateTag(
      `work:${workId}`
    );

    updateTag(
      `talent-works:${user.uid}`
    );

    updateTag(
      `talent:${user.uid}`
    );

    /*
     * Profile cache tags.
     *
     * Keep these only if your profile
     * data functions use these tags.
     */

    updateTag(
      "profiles"
    );

    updateTag(
      `profile:${user.uid}`
    );

    return {
      success: true,
      error: null,
    };
  } catch (error) {
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