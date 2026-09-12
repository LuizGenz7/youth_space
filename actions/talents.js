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

const TALENTS_PER_LOAD = 8;
const DISCOVER_TALENTS_LIMIT = 10;

const MAX_CATEGORY_ID_LENGTH = 100;
const MAX_TALENT_ID_LENGTH = 128;
const MAX_CURSOR_LENGTH = 1000;

/*
 * =========================================================
 * SCHEMAS
 * =========================================================
 */

const categoryIdSchema = z
  .string()
  .trim()
  .min(1, "Category ID is required.")
  .max(
    MAX_CATEGORY_ID_LENGTH,
    "Category ID is too long.",
  );

const categoryTalentsSchema = z
  .object({
    categoryId: categoryIdSchema,
  })
  .strict();

const loadMoreTalentsSchema = z
  .object({
    categoryId: categoryIdSchema,

    cursor: z
      .string()
      .trim()
      .min(1, "Cursor is required.")
      .max(
        MAX_CURSOR_LENGTH,
        "Cursor is too long.",
      ),
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
 * CATEGORY TALENTS — INITIAL LOAD
 * =========================================================
 *
 * First request:
 *
 * {
 *   categoryId
 * }
 *
 * The server always loads the first 8 talents.
 *
 * The data layer returns:
 *
 * {
 *   talents,
 *   nextCursor,
 *   hasMore
 * }
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
        result?.nextCursor ?? null,

      hasMore:
        Boolean(result?.hasMore),

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
 * CATEGORY TALENTS — LOAD MORE
 * =========================================================
 *
 * Cursor pagination:
 *
 * First load:
 *
 *   1 2 3 4 5 6 7 8
 *                 ↑
 *              cursor
 *
 * Load more sends that cursor.
 *
 * Server then loads:
 *
 *   9 10 11 12 13 14 15 16
 *
 * and returns another cursor.
 *
 * The next request uses that new cursor.
 *
 * This continues:
 *
 * 1–8
 * 9–16
 * 17–24
 * 25–32
 * ...
 *
 * until hasMore === false.
 *
 * The client NEVER sends the already-loaded talents.
 * The client NEVER sends loadedCount.
 */

export async function loadMoreTalentsAction(
  { id, nextCursor } = {}
) {

  const validation =
    loadMoreTalentsSchema.safeParse({
      categoryId:
        id,

      cursor:
        nextCursor,
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
          validation.data.cursor,

        limit:
          TALENTS_PER_LOAD,
      });

    return {
      success: true,

      talents:
        normalizeTalents(
          result?.talents,
        ),

      nextCursor:
        result?.nextCursor ?? null,

      hasMore:
        Boolean(result?.hasMore),

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
      typeof result.liked !== "boolean" ||
      typeof result.likes !== "number" ||
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