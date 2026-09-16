"use server";

import { z } from "zod";

import {
  getTrendingWorks,
  toggleWorkLike,
  deleteWork,
  createWork,
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

const createWorkSchema =
  z
    .object({
      title:
        z
          .string()
          .trim()
          .min(
            1,
            "Work title is required."
          )
          .max(
            100,
            "Work title is too long."
          ),

      description:
        z
          .string()
          .trim()
          .max(
            1000,
            "Work description is too long."
          )
          .default(""),

      category:
        z
          .string()
          .trim()
          .max(
            100,
            "Work category is too long."
          )
          .default(""),

      image:
        z
          .string()
          .trim()
          .url(
            "Please provide a valid image URL."
          )
          .max(
            2000,
            "Image URL is too long."
          )
          .or(
            z.literal("")
          )
          .default(""),
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
 *
 * Cache is managed by data/works.js.
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
 * CREATE WORK
 * ==================================================
 *
 * AUTHENTICATED USERS ONLY
 *
 * Client sends:
 *
 * {
 *   title,
 *   description,
 *   category,
 *   image
 * }
 *
 * UID comes from authentication.
 *
 * The client does NOT provide:
 *
 * - uid
 * - talentId
 *
 * This prevents users from creating work
 * under another user's account.
 *
 * Cache invalidation is handled by
 * data/works.js.
 * ==================================================
 */

export async function createWorkAction(
  input = {}
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    createWorkSchema.safeParse(
      safeInput
    );

  if (!validation.success) {
    return {
      success: false,
      work: null,
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
        work: null,
        error:
          "You must be logged in.",
      };
    }

    return {
      success: false,
      work: null,
      error:
        "Authentication failed.",
    };
  }

  /*
   * --------------------------------------------------
   * CREATE
   * --------------------------------------------------
   */

  try {
    const work =
      await createWork({
        userId:
          user.uid,

        title:
          validation.data.title,

        description:
          validation.data.description,

        category:
          validation.data.category,

        image:
          validation.data.image,
      });

    return {
      success: true,

      work:
        work ?? null,

      error: null,
    };
  } catch (error) {
    return {
      success: false,

      work: null,

      error:
        getErrorMessage(
          error,
          "Unable to create work."
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
 * UID comes from authentication.
 *
 * Cache invalidation is handled by
 * data/works.js after the transaction
 * succeeds.
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

  /*
   * --------------------------------------------------
   * TOGGLE LIKE
   * --------------------------------------------------
   */

  try {
    const result =
      await toggleWorkLike({
        workId:
          validation.data.workId,

        userId:
          user.uid,
      });

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
 * UID comes from authentication.
 *
 * Ownership is verified by
 * data/works.js.
 *
 * Cache invalidation is also handled
 * by data/works.js.
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

  /*
   * --------------------------------------------------
   * DELETE
   * --------------------------------------------------
   */

  try {
    await deleteWork({
      workId:
        validation.data.workId,

      userId:
        user.uid,
    });

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