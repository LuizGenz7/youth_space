"use server";

import { z } from "zod";

import {
  getCategoryTalents,
  getMoreTalents,
  getTopTalents,
  getNewTalents,
  toggleTalentLike,
} from "@/data/talents";

/*
 * =========================================================
 * CONFIG
 * =========================================================
 */

const INITIAL_CATEGORY_LOAD = 8;
const DISCOVER_TALENTS_LIMIT = 10;
const MAX_LOADED_COUNT = 1000;
const MAX_TALENT_ID_LENGTH = 128;

/*
 * =========================================================
 * SCHEMAS
 * =========================================================
 */

const categoryIdSchema = z
  .string()
  .trim()
  .min(
    1,
    "Category ID is required.",
  )
  .max(
    100,
    "Category ID is too long.",
  );

const categoryLimitSchema = z
  .number()
  .int()
  .min(1)
  .max(INITIAL_CATEGORY_LOAD);

const categoryTalentsSchema = z
  .object({
    categoryId: categoryIdSchema,

    limit:
      categoryLimitSchema.optional(),
  })
  .strict();

const loadMoreTalentsSchema = z
  .object({
    categoryId: categoryIdSchema,

    loadedCount: z
      .number()
      .int()
      .min(0)
      .max(MAX_LOADED_COUNT),
  })
  .strict();

const discoverTalentsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(DISCOVER_TALENTS_LIMIT),
  })
  .strict();

/*
 * =========================================================
 * LIKE SCHEMA
 * =========================================================
 *
 * The client may request a desired state.
 *
 * The server DOES NOT trust that state blindly.
 * toggleTalentLike() verifies the authenticated user
 * and the existing talentLikes document inside a
 * Firestore transaction.
 */

const talentLikeSchema = z
  .object({
    talentId: z
      .string()
      .trim()
      .min(
        1,
        "Talent ID is required.",
      )
      .max(
        MAX_TALENT_ID_LENGTH,
        "Talent ID is too long.",
      )
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Invalid talent ID.",
      ),

    liked: z.boolean(),
  })
  .strict();

/*
 * =========================================================
 * HELPERS
 * =========================================================
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
  fallback,
) {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

function normalizeTalents(talents) {
  return Array.isArray(talents)
    ? talents
    : [];
}

/*
 * =========================================================
 * CATEGORY TALENTS
 * =========================================================
 */

export async function loadCategoryTalentsAction(
  input = {},
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    categoryTalentsSchema.safeParse({
      categoryId:
        safeInput.categoryId,

      limit:
        safeInput.limit ??
        INITIAL_CATEGORY_LOAD,
    });

  if (!validation.success) {
    return {
      success: false,
      talents: [],
      nextCursor: null,
      hasMore: false,
      error: "Invalid request.",
    };
  }

  try {
    const result =
      await getCategoryTalents(
        validation.data.categoryId,
      );

    return {
      success: true,

      talents:
        normalizeTalents(
          result?.talents,
        ),

      nextCursor:
        result?.nextCursor ??
        null,

      hasMore:
        Boolean(
          result?.hasMore,
        ),

      error: null,
    };
  } catch (error) {
    return {
      success: false,
      talents: [],
      nextCursor: null,
      hasMore: false,
      error:
        getErrorMessage(
          error,
          "Unable to load category talents.",
        ),
    };
  }
}

/*
 * =========================================================
 * LOAD MORE CATEGORY TALENTS
 * =========================================================
 */

export async function loadMoreTalentsAction(
  input = {},
) {
  const safeInput =
    normalizeInput(input);

  const category =
    safeInput.category;

  const safeCategory =
    category &&
    typeof category === "object" &&
    !Array.isArray(category)
      ? category
      : {};

  const categoryId =
    safeCategory.id;

  const loadedCount =
    Array.isArray(
      safeCategory.talents,
    )
      ? safeCategory.talents.length
      : 0;

  const validation =
    loadMoreTalentsSchema.safeParse({
      categoryId,
      loadedCount,
    });

  if (!validation.success) {
    return {
      success: false,
      talents: [],
      nextCursor: null,
      hasMore: false,
      error: "Invalid request.",
    };
  }

  try {
    const result =
      await getMoreTalents({
        categoryId:
          validation.data.categoryId,

        cursor:
          validation.data.loadedCount,
      });

    return {
      success: true,

      talents:
        normalizeTalents(
          result?.talents,
        ),

      nextCursor:
        result?.nextCursor ??
        null,

      hasMore:
        Boolean(
          result?.hasMore,
        ),

      error: null,
    };
  } catch (error) {
    return {
      success: false,
      talents: [],
      nextCursor: null,
      hasMore: false,
      error:
        getErrorMessage(
          error,
          "Unable to load more talents.",
        ),
    };
  }
}

/*
 * =========================================================
 * TALENT LIKE
 * =========================================================
 *
 * SECURITY:
 *
 * 1. Input is validated with Zod.
 * 2. Unknown fields are rejected.
 * 3. Talent ID format is validated.
 * 4. Authentication is checked inside
 *    toggleTalentLike().
 * 5. The server obtains the authenticated UID.
 * 6. The client cannot choose another user's ID.
 * 7. Firestore transaction checks the actual
 *    talentLikes/{userId}_{talentId} document.
 * 8. The likes counter is changed only when the
 *    actual like state changes.
 *
 * The client-provided `liked` means:
 *
 * "I want this state."
 *
 * It does NOT mean:
 *
 * "The database is currently in this state."
 */

export async function toggleTalentLikeAction(
  input = {},
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    talentLikeSchema.safeParse({
      talentId:
        safeInput.talentId,

      liked:
        safeInput.liked,
    });

  if (!validation.success) {
    return {
      success: false,
      liked: false,
      likes: null,
      error: "Invalid request.",
    };
  }

  try {
    const result =
      await toggleTalentLike({
        talentId:
          validation.data.talentId,

        liked:
          validation.data.liked,
      });

    if (
      !result ||
      typeof result.liked !==
        "boolean" ||
      typeof result.likes !==
        "number" ||
      !Number.isFinite(result.likes) ||
      result.likes < 0
    ) {
      return {
        success: false,
        liked: false,
        likes: null,
        error:
          "Unable to verify like state.",
      };
    }

    return {
      success: true,

      liked:
        result.liked,

      likes:
        Math.max(
          0,
          Math.floor(
            result.likes,
          ),
        ),

      error: null,
    };
  } catch (error) {
    return {
      success: false,
      liked: false,
      likes: null,
      error:
        getErrorMessage(
          error,
          "Unable to update talent like.",
        ),
    };
  }
}

/*
 * =========================================================
 * DISCOVER — TOP TALENTS
 * =========================================================
 */

export async function getTopTalentsAction(
  input = {},
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    discoverTalentsSchema.safeParse({
      limit:
        safeInput.limit ??
        DISCOVER_TALENTS_LIMIT,
    });

  if (!validation.success) {
    return {
      success: false,
      talents: [],
      error: "Invalid request.",
    };
  }

  try {
    const talents =
      await getTopTalents(
        validation.data.limit,
      );

    return {
      success: true,

      talents:
        normalizeTalents(
          talents,
        ),

      error: null,
    };
  } catch (error) {
    return {
      success: false,
      talents: [],
      error:
        getErrorMessage(
          error,
          "Unable to load top talents.",
        ),
    };
  }
}

/*
 * =========================================================
 * DISCOVER — NEWEST TALENTS
 * =========================================================
 */

export async function getNewTalentsAction(
  input = {},
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    discoverTalentsSchema.safeParse({
      limit:
        safeInput.limit ??
        DISCOVER_TALENTS_LIMIT,
    });

  if (!validation.success) {
    return {
      success: false,
      talents: [],
      error: "Invalid request.",
    };
  }

  try {
    const talents =
      await getNewTalents(
        validation.data.limit,
      );

    return {
      success: true,

      talents:
        normalizeTalents(
          talents,
        ),

      error: null,
    };
  } catch (error) {
    return {
      success: false,
      talents: [],
      error:
        getErrorMessage(
          error,
          "Unable to load newest talents.",
        ),
    };
  }
}