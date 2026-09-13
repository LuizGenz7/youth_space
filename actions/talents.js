"use server";

import { z } from "zod";

import {
  getCategoryTalents,
  getCurrentUserTalentLikes,
  getMoreTalents,
  getTalentLikeStatus,
  getTopTalents,
  getNewTalents,
  toggleTalentLike,
} from "@/data/talents";

/*
 * =========================================================
 * CONFIG
 * =========================================================
 */

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

const talentIdSchema = z
  .string()
  .trim()
  .min(1, "Talent ID is required.")
  .max(
    MAX_TALENT_ID_LENGTH,
    "Talent ID is too long.",
  )
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "Invalid talent ID.",
  );

const talentLikeSchema = z
  .object({
    talentId: talentIdSchema,
    liked: z.boolean(),
  })
  .strict();

const talentLikeStatusSchema = z
  .object({
    talentId: talentIdSchema,
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

function getErrorMessage(error, fallback) {
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

function normalizeLikes(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(number),
  );
}

/*
 * =========================================================
 * PUBLIC TALENT HELPERS
 * =========================================================
 *
 * IMPORTANT:
 *
 * Discover/category data is public.
 *
 * We must NOT call getServerFirebase() while this data
 * is being prerendered because getServerFirebase() uses
 * headers().
 *
 * Therefore public talent queries return:
 *
 * liked: false
 *
 * The client can optimistically update the state when the
 * authenticated user interacts with the like button.
 * =========================================================
 */

function addDefaultLikeState(talents) {
  return normalizeTalents(talents).map(
    (talent) => ({
      ...talent,
      liked: false,
    }),
  );
}

/*
 * =========================================================
 * AUTHENTICATED LIKE STATE
 * =========================================================
 *
 * This function is ONLY for request-time/authenticated
 * operations.
 *
 * It must NOT be called from public Discover data during
 * prerendering.
 * =========================================================
 */

async function enrichTalentsWithLikeState(
  talents,
) {
  const normalizedTalents =
    normalizeTalents(talents);

  if (!normalizedTalents.length) {
    return [];
  }

  try {
    const talentIds =
      normalizedTalents.map(
        (talent) => talent.id,
      );

    const likedIds =
      await getCurrentUserTalentLikes(
        talentIds,
      );

    return normalizedTalents.map(
      (talent) => ({
        ...talent,

        liked:
          likedIds.has(
            talent.id,
          ),
      }),
    );
  } catch (error) {
    console.error(
      "enrichTalentsWithLikeState failed:",
      error,
    );

    return normalizedTalents.map(
      (talent) => ({
        ...talent,
        liked: false,
      }),
    );
  }
}

/*
 * =========================================================
 * CATEGORY TALENTS — INITIAL LOAD
 * =========================================================
 *
 * PUBLIC DATA ONLY.
 *
 * Do not resolve authenticated like state here.
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

    const talents =
      addDefaultLikeState(
        result?.talents,
      );

    return {
      success: true,

      talents,

      nextCursor:
        result?.nextCursor ?? null,

      hasMore:
        Boolean(
          result?.hasMore,
        ),

      error: null,
    };
  } catch (error) {
    console.error(
      "loadCategoryTalentsAction failed:",
      error,
    );

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
 * PUBLIC DATA ONLY.
 * =========================================================
 */

export async function loadMoreTalentsAction(
  input = {},
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    loadMoreTalentsSchema.safeParse({
      categoryId:
        safeInput.id,

      cursor:
        safeInput.nextCursor,
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
      });

    const talents =
      addDefaultLikeState(
        result?.talents,
      );

    return {
      success: true,

      talents,

      nextCursor:
        result?.nextCursor ?? null,

      hasMore:
        Boolean(
          result?.hasMore,
        ),

      error: null,
    };
  } catch (error) {
    console.error(
      "loadMoreTalentsAction failed:",
      error,
    );

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
 * GET TALENT LIKE STATUS
 * =========================================================
 *
 * AUTHENTICATED REQUEST.
 *
 * This action is allowed to use the current user's
 * authentication context.
 * =========================================================
 */

export async function getTalentLikeStatusAction(
  input = {},
) {
  const safeInput =
    normalizeInput(input);

  const validation =
    talentLikeStatusSchema.safeParse({
      talentId:
        safeInput.talentId,
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
      await getTalentLikeStatus(
        validation.data.talentId,
      );

    return {
      success: true,

      liked:
        Boolean(
          result?.liked,
        ),

      likes:
        result?.likes === null
          ? null
          : normalizeLikes(
              result?.likes,
            ),

      error: null,
    };
  } catch (error) {
    console.error(
      "getTalentLikeStatusAction failed:",
      error,
    );

    return {
      success: false,
      liked: false,
      likes: null,
      error:
        getErrorMessage(
          error,
          "Unable to load like status.",
        ),
    };
  }
}

/*
 * =========================================================
 * TALENT LIKE
 * =========================================================
 *
 * AUTHENTICATED REQUEST.
 *
 * The data layer verifies the authenticated user.
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
      typeof result.liked !==
        "boolean" ||
      !Number.isFinite(
        result.likes,
      ) ||
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
        normalizeLikes(
          result.likes,
        ),

      error: null,
    };
  } catch (error) {
    console.error(
      "toggleTalentLikeAction failed:",
      error,
    );

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
 *
 * PUBLIC DATA ONLY.
 *
 * IMPORTANT:
 * Do NOT call enrichTalentsWithLikeState() here.
 *
 * This action can therefore safely run during
 * Next.js prerendering.
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
      await getTopTalents();

    const limitedTalents =
      normalizeTalents(
        talents,
      ).slice(
        0,
        validation.data.limit,
      );

    return {
      success: true,

      talents:
        addDefaultLikeState(
          limitedTalents,
        ),

      error: null,
    };
  } catch (error) {
    console.error(
      "getTopTalentsAction failed:",
      error,
    );

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
 *
 * PUBLIC DATA ONLY.
 *
 * Do NOT call enrichTalentsWithLikeState() here.
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
      await getNewTalents();

    const limitedTalents =
      normalizeTalents(
        talents,
      ).slice(
        0,
        validation.data.limit,
      );

    return {
      success: true,

      talents:
        addDefaultLikeState(
          limitedTalents,
        ),

      error: null,
    };
  } catch (error) {
    console.error(
      "getNewTalentsAction failed:",
      error,
    );

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