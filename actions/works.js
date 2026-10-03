"use server";

import { z } from "zod";

import {
  getTrendingWorks,
  getCurrentUserWorkLikes,
  getWorkLikeStatus,
  toggleWorkLike,
  createWork,
  updateWork,
  deleteWork,
} from "@/data/works";

import { requireAuthAction } from "@/lib/auth-server";
import { getTalentById } from "@/data/talents";

/*
 * =========================================================
 * CONFIG
 * =========================================================
 */

const DISCOVER_WORKS_LIMIT = 10;

const MAX_WORK_ID_LENGTH = 128;
const MAX_CATEGORY_ID_LENGTH = 100;

/*
 * =========================================================
 * SCHEMAS
 * =========================================================
 */

const workIdSchema = z
  .string()
  .trim()
  .min(1, "Work ID is required.")
  .max(
    MAX_WORK_ID_LENGTH,
    "Work ID is too long.",
  );

const categoryIdSchema = z
  .string()
  .trim()
  .min(1, "Category ID is required.")
  .max(
    MAX_CATEGORY_ID_LENGTH,
    "Category ID is too long.",
  );

/*
 * ---------------------------------------------------------
 * TRENDING WORKS
 * ---------------------------------------------------------
 */

const trendingWorksSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(DISCOVER_WORKS_LIMIT),
  })
  .strict();

/*
 * ---------------------------------------------------------
 * IMAGE
 * ---------------------------------------------------------
 */

const imageSchema = z
  .string()
  .trim()
  .url(
    "Please provide a valid image URL.",
  )
  .max(
    2000,
    "Image URL is too long.",
  )
  .or(z.literal(""))
  .default("");

/*
 * ---------------------------------------------------------
 * CREATE / UPDATE WORK
 * ---------------------------------------------------------
 */

const workFieldsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(
        1,
        "Work title is required.",
      )
      .max(
        100,
        "Work title is too long.",
      ),

    description: z
      .string()
      .trim()
      .max(
        1000,
        "Work description is too long.",
      )
      .default(""),

    category: z
      .string()
      .trim()
      .max(
        100,
        "Work category is too long.",
      )
      .default(""),

    categoryId:
      categoryIdSchema,

    image:
      imageSchema,
  })
  .strict();

const createWorkSchema =
  workFieldsSchema;

const updateWorkSchema = z
  .object({
    workId:
      workIdSchema,

    title: z
      .string()
      .trim()
      .min(
        1,
        "Work title is required.",
      )
      .max(
        100,
        "Work title is too long.",
      ),

    description: z
      .string()
      .trim()
      .max(
        1000,
        "Work description is too long.",
      )
      .default(""),

    category: z
      .string()
      .trim()
      .max(
        100,
        "Work category is too long.",
      )
      .default(""),

    categoryId:
      categoryIdSchema,

    image:
      imageSchema,
  })
  .strict();

/*
 * ---------------------------------------------------------
 * LIKE
 * ---------------------------------------------------------
 */

const workLikeSchema = z
  .object({
    workId:
      workIdSchema,

    liked:
      z.boolean(),
  })
  .strict();

const workLikeStatusSchema = z
  .object({
    workId:
      workIdSchema,
  })
  .strict();

/*
 * ---------------------------------------------------------
 * DELETE
 * ---------------------------------------------------------
 */

const deleteWorkSchema = z
  .object({
    workId:
      workIdSchema,
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

function normalizeWorks(works) {
  return Array.isArray(works)
    ? works
    : [];
}

function normalizeLikes(value) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(number),
  );
}

/*
 * =========================================================
 * PUBLIC WORK HELPERS
 * =========================================================
 *
 * Public work data must remain safe for prerendering.
 *
 * The data layer may return:
 *
 * likedByMe: true / false
 *
 * but this action intentionally starts public data with
 * likedByMe: false and resolves the real authenticated
 * state separately when needed.
 *
 * Raw likes[] is never returned.
 * =========================================================
 */

function addDefaultLikeState(
  works,
) {
  return normalizeWorks(
    works,
  ).map(
    (work) => ({
      ...work,

      likes:
        normalizeLikes(
          work?.likes,
        ),

      likedByMe:
        false,
    }),
  );
}

/*
 * =========================================================
 * AUTHENTICATED LIKE STATE
 * =========================================================
 *
 * Same pattern as actions/talents.js.
 *
 * This is request-time only.
 *
 * It uses:
 *
 * getCurrentUserWorkLikes()
 *
 * and converts the returned Set into:
 *
 * likedByMe: true / false
 * =========================================================
 */

async function enrichWorksWithLikeState(
  works,
) {
  const normalizedWorks =
    normalizeWorks(
      works,
    );

  if (
    !normalizedWorks.length
  ) {
    return [];
  }

  try {
    const workIds =
      normalizedWorks
        .map(
          (work) =>
            work?.id,
        )
        .filter(
          (id) =>
            typeof id ===
            "string" &&
            id.trim(),
        );

    if (
      !workIds.length
    ) {
      return normalizedWorks.map(
        (work) => ({
          ...work,
          likedByMe: false,
        }),
      );
    }

    const likedIds =
      await getCurrentUserWorkLikes(
        workIds,
      );

    return normalizedWorks.map(
      (work) => ({
        ...work,

        likes:
          normalizeLikes(
            work?.likes,
          ),

        likedByMe:
          likedIds.has(
            work.id,
          ),
      }),
    );
  } catch (error) {
    console.error(
      "enrichWorksWithLikeState failed:",
      error,
    );

    return normalizedWorks.map(
      (work) => ({
        ...work,

        likes:
          normalizeLikes(
            work?.likes,
          ),

        likedByMe:
          false,
      }),
    );
  }
}

/*
 * =========================================================
 * GET TRENDING WORKS
 * =========================================================
 *
 * PUBLIC DATA.
 *
 * Do not resolve authenticated like state here during
 * prerendering.
 * =========================================================
 */

export async function getTrendingWorksAction(
  input = {},
) {
  const safeInput =
    normalizeInput(
      input,
    );

  const validation =
    trendingWorksSchema.safeParse({
      limit:
        safeInput.limit ??
        DISCOVER_WORKS_LIMIT,
    });

  if (
    !validation.success
  ) {
    return {
      success: false,

      works: [],

      error:
        "Invalid request.",
    };
  }

  try {
    const works =
      await getTrendingWorks();

    const limitedWorks =
      normalizeWorks(
        works,
      ).slice(
        0,
        validation.data.limit,
      );

    return {
      success: true,

      works:
        addDefaultLikeState(
          limitedWorks,
        ),

      error: null,
    };
  } catch (error) {
    console.error(
      "getTrendingWorksAction failed:",
      error,
    );

    return {
      success: false,

      works: [],

      error:
        getErrorMessage(
          error,
          "Unable to load trending works.",
        ),
    };
  }
}

/*
 * =========================================================
 * GET TRENDING WORKS WITH CURRENT USER LIKE STATE
 * =========================================================
 *
 * Request-time helper.
 *
 * Use this when the caller specifically needs:
 *
 * likedByMe
 *
 * for the authenticated user.
 * =========================================================
 */

export async function getTrendingWorksWithLikeStateAction(
  input = {},
) {
  const safeInput =
    normalizeInput(
      input,
    );

  const validation =
    trendingWorksSchema.safeParse({
      limit:
        safeInput.limit ??
        DISCOVER_WORKS_LIMIT,
    });

  if (
    !validation.success
  ) {
    return {
      success: false,

      works: [],

      error:
        "Invalid request.",
    };
  }

  try {
    const works =
      await getTrendingWorks();

    const limitedWorks =
      normalizeWorks(
        works,
      ).slice(
        0,
        validation.data.limit,
      );

    const enrichedWorks =
      await enrichWorksWithLikeState(
        limitedWorks,
      );

    return {
      success: true,

      works:
        enrichedWorks,

      error: null,
    };
  } catch (error) {
    console.error(
      "getTrendingWorksWithLikeStateAction failed:",
      error,
    );

    return {
      success: false,

      works: [],

      error:
        getErrorMessage(
          error,
          "Unable to load trending works.",
        ),
    };
  }
}

/*
 * =========================================================
 * GET WORK LIKE STATUS
 * =========================================================
 *
 * AUTHENTICATED REQUEST.
 *
 * Returns:
 *
 * {
 *   liked: boolean,
 *   likes: number
 * }
 * =========================================================
 */

export async function getWorkLikeStatusAction(
  input = {},
) {
  const safeInput =
    normalizeInput(
      input,
    );

  const validation =
    workLikeStatusSchema.safeParse({
      workId:
        safeInput.workId,
    });

  if (
    !validation.success
  ) {
    return {
      success: false,

      liked: false,

      likes: null,

      error:
        "Invalid request.",
    };
  }

  try {
    const result =
      await getWorkLikeStatus(
        validation.data.workId,
      );

    return {
      success: true,

      liked:
        Boolean(
          result?.liked,
        ),

      likes:
        result?.likes ===
          null
          ? null
          : normalizeLikes(
            result?.likes,
          ),

      error: null,
    };
  } catch (error) {
    console.error(
      "getWorkLikeStatusAction failed:",
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
 * TOGGLE WORK LIKE
 * =========================================================
 *
 * AUTHENTICATED REQUEST.
 *
 * The client sends:
 *
 * {
 *   workId,
 *   liked
 * }
 *
 * Example:
 *
 * liked: true
 *
 * means:
 *
 * "I want this work to be liked."
 *
 * liked: false
 *
 * means:
 *
 * "I want to remove my like."
 *
 * The data layer gets the actual authenticated UID.
 * =========================================================
 */

export async function toggleLikeAction(
  input = {},
) {
  const safeInput =
    normalizeInput(
      input,
    );

  const validation =
    workLikeSchema.safeParse({
      workId:
        safeInput.workId,

      liked:
        safeInput.liked,
    });

  if (
    !validation.success
  ) {
    return {
      success: false,

      liked: false,

      likes: null,

      error:
        "Invalid request.",
    };
  }

  try {
    const result =
      await toggleWorkLike({
        workId:
          validation.data.workId,

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
      "toggleLikeAction failed:",
      error,
    );

    return {
      success: false,

      liked: false,

      likes: null,

      error:
        getErrorMessage(
          error,
          "Unable to update work like.",
        ),
    };
  }
}

/*
 * =========================================================
 * CREATE WORK
 * =========================================================
 *
 * AUTHENTICATED.
 *
 * The data layer remains responsible for ownership and
 * authenticated user validation.
 * =========================================================
 */

export async function createWorkAction(input = {}) {
  const safeInput = normalizeInput(input);

  const validation = createWorkSchema.safeParse(safeInput);

  if (!validation.success) {
    return {
      success: false,
      work: null,
      error: "Invalid request.",
    };
  }

  let user;

  try {
    user = await requireAuthAction();
  } catch (error) {
    console.error(
      "createWorkAction authentication failed:",
      error,
    );

    return {
      success: false,
      work: null,
      error: "Authentication failed.",
    };
  }

  if (!user) {
    return {
      success: false,
      work: null,
      error: "You must be logged in.",
    };
  }

  try {
    /*
     * IMPORTANT:
     * Get the talent profile using the authenticated user's UID.
     *
     * Do NOT accept talentId, talentName, or talentUsername
     * from the client.
     */
    const talent = await getTalentById(user.uid);

    if (!talent) {
      return {
        success: false,
        work: null,
        error: "Talent profile not found.",
      };
    }

    const work = await createWork({
      talentId: user.uid,
      talentName: talent.displayName,
      talentUsername: talent.username,

      title: validation.data.title,
      description: validation.data.description,
      category: validation.data.category,
      categoryId: validation.data.categoryId,
      image: validation.data.image,
    });

    return {
      success: true,
      work,
      error: null,
    };
  } catch (error) {
    console.error(
      "createWorkAction failed:",
      error,
    );

    return {
      success: false,
      work: null,
      error: getErrorMessage(
        error,
        "Unable to create work.",
      ),
    };
  }
}

/*
 * =========================================================
 * UPDATE WORK
 * =========================================================
 *
 * AUTHENTICATED.
 *
 * Ownership remains enforced by data/works.js.
 * =========================================================
 */

export async function updateWorkAction(
  input = {},
) {
  const safeInput =
    normalizeInput(
      input,
    );

  const validation =
    updateWorkSchema.safeParse(
      safeInput,
    );

  if (
    !validation.success
  ) {
    return {
      success: false,

      work: null,

      error:
        "Invalid request.",
    };
  }

  try {
    await requireAuthAction();
  } catch {
    return {
      success: false,

      work: null,

      error:
        "You must be logged in.",
    };
  }

  try {
    const work =
      await updateWork({
        workId:
          validation.data.workId,

        title:
          validation.data.title,

        description:
          validation.data.description,

        category:
          validation.data.category,

        categoryId:
          validation.data.categoryId,

        image:
          validation.data.image,
      });

    return {
      success: true,

      work,

      error: null,
    };
  } catch (error) {
    console.error(
      "updateWorkAction failed:",
      error,
    );

    return {
      success: false,

      work: null,

      error:
        getErrorMessage(
          error,
          "Unable to update work.",
        ),
    };
  }
}

/*
 * =========================================================
 * DELETE WORK
 * =========================================================
 *
 * AUTHENTICATED.
 *
 * Ownership remains enforced inside data/works.js.
 * =========================================================
 */

export async function deleteWorkAction(
  input = {},
) {
  const safeInput =
    normalizeInput(
      input,
    );

  const validation =
    deleteWorkSchema.safeParse(
      safeInput,
    );

  if (
    !validation.success
  ) {
    return {
      success: false,

      error:
        "Invalid request.",
    };
  }

  try {
    await requireAuthAction();
  } catch {
    return {
      success: false,

      error:
        "You must be logged in.",
    };
  }

  try {
    const result =
      await deleteWork(
        validation.data.workId,
      );

    return {
      success: true,

      workId:
        result?.workId ??
        validation.data.workId,

      error: null,
    };
  } catch (error) {
    console.error(
      "deleteWorkAction failed:",
      error,
    );

    return {
      success: false,

      error:
        getErrorMessage(
          error,
          "Unable to delete work.",
        ),
    };
  }
}