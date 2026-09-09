"use server";

import { z } from "zod";

import {
  getCategoryTalents,
  getMoreTalents,
  getTopTalents,
  getNewTalents,
} from "@/data/talents";

/* =========================================================
   CONFIG
========================================================= */

const INITIAL_CATEGORY_LOAD = 8;
const DISCOVER_TALENTS_LIMIT = 10;
const MAX_LOADED_COUNT = 1000;

/* =========================================================
   SCHEMAS
========================================================= */

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
    categoryId:
      categoryIdSchema,

    limit:
      categoryLimitSchema
        .optional(),
  })
  .strict();

const loadMoreTalentsSchema = z
  .object({
    categoryId:
      categoryIdSchema,

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

/* =========================================================
   CATEGORY TALENTS
========================================================= */

export async function loadCategoryTalentsAction({
  categoryId,
  limit = INITIAL_CATEGORY_LOAD,
} = {}) {
  const validation =
    categoryTalentsSchema.safeParse({
      categoryId,
      limit,
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
        Array.isArray(
          result?.talents,
        )
          ? result.talents
          : [],

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
      "loadCategoryTalentsAction:",
      error,
    );

    return {
      success: false,
      talents: [],
      nextCursor: null,
      hasMore: false,
      error:
        "Unable to load category talents.",
    };
  }
}

/* =========================================================
   LOAD MORE CATEGORY TALENTS
========================================================= */

/*
 * Client passes:
 *
 * {
 *   category
 * }
 *
 * The action extracts category here.
 */

export async function loadMoreTalentsAction({
  category,
} = {}) {
  /*
   * Extract only the values we actually need
   * from the category object.
   */

  const categoryId =
    category?.id;

  const loadedCount =
    Array.isArray(
      category?.talents,
    )
      ? category.talents.length
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
console.log(result);

    return {
      success: true,

      talents:
        Array.isArray(
          result?.talents,
        )
          ? result.talents
          : [],

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
      "loadMoreTalentsAction:",
      error,
    );

    return {
      success: false,
      talents: [],
      nextCursor: null,
      hasMore: false,
      error:
        "Unable to load more talents.",
    };
  }
}

/* =========================================================
   DISCOVER — TOP TALENTS
========================================================= */

export async function getTopTalentsAction({
  limit = DISCOVER_TALENTS_LIMIT,
} = {}) {
  const validation =
    discoverTalentsSchema.safeParse({
      limit,
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
        Array.isArray(talents)
          ? talents
          : [],

      error: null,
    };
  } catch (error) {
    console.error(
      "getTopTalentsAction:",
      error,
    );

    return {
      success: false,
      talents: [],
      error:
        "Unable to load top talents.",
    };
  }
}

/* =========================================================
   DISCOVER — NEWEST TALENTS
========================================================= */

export async function getNewTalentsAction({
  limit = DISCOVER_TALENTS_LIMIT,
} = {}) {
  const validation =
    discoverTalentsSchema.safeParse({
      limit,
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
        Array.isArray(talents)
          ? talents
          : [],

      error: null,
    };
  } catch (error) {
    console.error(
      "getNewTalentsAction:",
      error,
    );

    return {
      success: false,
      talents: [],
      error:
        "Unable to load newest talents.",
    };
  }
}