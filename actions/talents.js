"use server";

import { z } from "zod";

import {
  getCategoryTalents,
  getMoreTalents,
  getTopTalents,
  getNewTalents,
} from "@/data/talents";

/*
 * =========================================================
 * CONFIG
 * =========================================================
 */

const INITIAL_CATEGORY_LOAD = 8;
const DISCOVER_TALENTS_LIMIT = 10;
const MAX_LOADED_COUNT = 1000;

/*
 * =========================================================
 * SCHEMAS
 * =========================================================
 */

const categoryIdSchema =
  z
    .string()
    .trim()
    .min(
      1,
      "Category ID is required."
    )
    .max(
      100,
      "Category ID is too long."
    );

const categoryLimitSchema =
  z
    .number()
    .int()
    .min(1)
    .max(
      INITIAL_CATEGORY_LOAD
    );

const categoryTalentsSchema =
  z
    .object({
      categoryId:
        categoryIdSchema,

      limit:
        categoryLimitSchema
          .optional(),
    })
    .strict();

const loadMoreTalentsSchema =
  z
    .object({
      categoryId:
        categoryIdSchema,

      loadedCount:
        z
          .number()
          .int()
          .min(0)
          .max(
            MAX_LOADED_COUNT
          ),
    })
    .strict();

const discoverTalentsSchema =
  z
    .object({
      limit:
        z
          .number()
          .int()
          .min(1)
          .max(
            DISCOVER_TALENTS_LIMIT
          ),
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

function normalizeTalents(
  talents
) {
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
  input = {}
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
      await getCategoryTalents({
        categoryId:
          validation.data.categoryId,

        limit:
          validation.data.limit,
      });

    return {
      success: true,

      talents:
        normalizeTalents(
          result?.talents
        ),

      nextCursor:
        result?.nextCursor ??
        null,

      hasMore:
        Boolean(
          result?.hasMore
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
          "Unable to load category talents."
        ),
    };
  }
}

/*
 * =========================================================
 * LOAD MORE CATEGORY TALENTS
 * =========================================================
 *
 * Client sends:
 *
 * {
 *   category: {
 *     id,
 *     talents
 *   }
 * }
 *
 * The action extracts only the information
 * required by the data layer.
 * =========================================================
 */

export async function loadMoreTalentsAction(
  input = {}
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
      safeCategory.talents
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
          result?.talents
        ),

      nextCursor:
        result?.nextCursor ??
        null,

      hasMore:
        Boolean(
          result?.hasMore
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
          "Unable to load more talents."
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
  input = {}
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
        validation.data.limit
      );

    return {
      success: true,

      talents:
        normalizeTalents(
          talents
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
          "Unable to load top talents."
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
  input = {}
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
        validation.data.limit
      );

    return {
      success: true,

      talents:
        normalizeTalents(
          talents
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
          "Unable to load newest talents."
        ),
    };
  }
}