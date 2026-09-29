"use server";

import { z } from "zod";

import {
  getTrendingWorks,
  createWork,
  updateWork,
  toggleWorkLike,
  getWorkLikeStatus,
  deleteWork,
} from "@/data/works";

import { requireAuthAction } from "@/lib/auth-server";

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
  .min(1, "Work ID is required.")
  .max(100, "Work ID is too long.");

/*
 * --------------------------------------------------
 * TRENDING WORKS
 * --------------------------------------------------
 */

const trendingWorksSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(TRENDING_WORKS_LIMIT),
  })
  .strict();

/*
 * --------------------------------------------------
 * CLOUDINARY IMAGE
 * --------------------------------------------------
 *
 * `image` is the public HTTPS URL.
 *
 * `imagePublicId` is the Cloudinary asset identifier
 * used by the server when an image needs to be
 * replaced or deleted.
 * --------------------------------------------------
 */

const imageFieldsSchema = z
  .object({
    image: z
      .string()
      .trim()
      .url("Please provide a valid image URL.")
      .max(2000, "Image URL is too long.")
      .or(z.literal(""))
      .default(""),

    imagePublicId: z
      .string()
      .trim()
      .max(
        500,
        "Image public ID is too long.",
      )
      .default(""),
  })
  .strict();

/*
 * --------------------------------------------------
 * CREATE / UPDATE WORK
 * --------------------------------------------------
 */

const workFieldsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Work title is required.")
      .max(100, "Work title is too long."),

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

    categoryId: z
      .string()
      .trim()
      .max(
        100,
        "Work category ID is too long.",
      )
      .default(""),

    ...imageFieldsSchema.shape,
  })
  .strict();

const createWorkSchema = workFieldsSchema;

const updateWorkSchema = z
  .object({
    workId: workIdSchema,

    title: z
      .string()
      .trim()
      .min(1, "Work title is required.")
      .max(100, "Work title is too long."),

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

    categoryId: z
      .string()
      .trim()
      .max(
        100,
        "Work category ID is too long.",
      )
      .default(""),

    ...imageFieldsSchema.shape,
  })
  .strict();

/*
 * --------------------------------------------------
 * LIKE
 * --------------------------------------------------
 */

const toggleLikeSchema = z
  .object({
    workId: workIdSchema,
  })
  .strict();

const workLikeStatusSchema = z
  .object({
    workId: workIdSchema,
  })
  .strict();

/*
 * --------------------------------------------------
 * DELETE
 * --------------------------------------------------
 */

const deleteWorkSchema = z
  .object({
    workId: workIdSchema,
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

function getErrorMessage(error, fallback) {
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
 * AUTH HELPER
 * ==================================================
 *
 * Keeps authentication handling consistent across
 * every authenticated work action.
 * ==================================================
 */

async function getAuthenticatedUser() {
  try {
    return await requireAuthAction();
  } catch (error) {
    if (error?.code === "AUTH_REQUIRED") {
      return null;
    }

    throw error;
  }
}

/*
 * ==================================================
 * GET TRENDING WORKS
 * ==================================================
 *
 * PUBLIC
 * ==================================================
 */

export async function getTrendingWorksAction(
  input = {},
) {
  const safeInput = normalizeInput(input);

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
    const works = await getTrendingWorks(
      validation.data.limit,
    );

    return {
      success: true,

      works: Array.isArray(works)
        ? works
        : [],

      error: null,
    };
  } catch (error) {
    return {
      success: false,
      works: [],

      error: getErrorMessage(
        error,
        "Unable to load trending works.",
      ),
    };
  }
}

/*
 * ==================================================
 * CREATE WORK
 * ==================================================
 *
 * AUTHENTICATED
 *
 * Client provides:
 *
 * {
 *   title,
 *   description,
 *   category,
 *   categoryId,
 *   image,
 *   imagePublicId
 * }
 *
 * Client NEVER provides:
 *
 * - userId
 * - talentId
 * - likes
 * - createdAt
 * ==================================================
 */

export async function createWorkAction(
  input = {},
) {
  const safeInput = normalizeInput(input);

  const validation =
    createWorkSchema.safeParse(
      safeInput,
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
      await getAuthenticatedUser();
  } catch {
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

  /*
   * --------------------------------------------------
   * CREATE
   * --------------------------------------------------
   */

  try {
    const work = await createWork({
      userId: user.uid,

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

      imagePublicId:
        validation.data.imagePublicId,
    });

    return {
      success: true,

      work: work ?? null,

      error: null,
    };
  } catch (error) {
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
 * ==================================================
 * UPDATE WORK
 * ==================================================
 *
 * AUTHENTICATED
 *
 * Ownership is verified inside data/works.js.
 *
 * The image fields work like this:
 *
 * NO NEW IMAGE:
 *
 * image = existing URL
 * imagePublicId = existing public ID
 *
 * NEW IMAGE:
 *
 * image = new Cloudinary URL
 * imagePublicId = new Cloudinary public ID
 *
 * The data layer should compare the existing
 * `imagePublicId` with the new one and remove the
 * old Cloudinary asset when appropriate.
 *
 * Client cannot change:
 *
 * - talentId
 * - owner
 * - likes
 * - createdAt
 * ==================================================
 */

export async function updateWorkAction(
  input = {},
) {
  const safeInput = normalizeInput(input);

  const validation =
    updateWorkSchema.safeParse(
      safeInput,
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
      await getAuthenticatedUser();
  } catch {
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

  /*
   * --------------------------------------------------
   * UPDATE
   * --------------------------------------------------
 */

  try {
    const work = await updateWork({
      workId:
        validation.data.workId,

      userId:
        user.uid,

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

      imagePublicId:
        validation.data.imagePublicId,
    });

    return {
      success: true,

      work: work ?? null,

      error: null,
    };
  } catch (error) {
    if (
      error?.message ===
      "Work not found."
    ) {
      return {
        success: false,
        work: null,
        error: "Work not found.",
      };
    }

    if (
      error?.message ===
      "You do not own this work."
    ) {
      return {
        success: false,
        work: null,
        error:
          "You do not own this work.",
      };
    }

    return {
      success: false,

      work: null,

      error: getErrorMessage(
        error,
        "Unable to update work.",
      ),
    };
  }
}

/*
 * ==================================================
 * GET WORK LIKE STATUS
 * ==================================================
 *
 * AUTHENTICATED
 *
 * Returns:
 *
 * {
 *   liked: boolean,
 *   likes: number
 * }
 * ==================================================
 */

export async function getWorkLikeStatusAction(
  input = {},
) {
  const safeInput = normalizeInput(input);

  const validation =
    workLikeStatusSchema.safeParse(
      safeInput,
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
      await getAuthenticatedUser();
  } catch {
    return {
      success: false,
      liked: false,
      likes: 0,
      error: "Authentication failed.",
    };
  }

  if (!user) {
    return {
      success: false,
      liked: false,
      likes: 0,
      error: "You must be logged in.",
    };
  }

  /*
   * --------------------------------------------------
   * GET STATUS
   * --------------------------------------------------
 */

  try {
    const result =
      await getWorkLikeStatus({
        workId:
          validation.data.workId,

        userId:
          user.uid,
      });

    return {
      success: true,

      liked: Boolean(
        result?.liked,
      ),

      likes: Number(
        result?.likes ?? 0,
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
        error: "Work not found.",
      };
    }

    return {
      success: false,
      liked: false,
      likes: 0,
      error:
        "Unable to load like status.",
    };
  }
}

/*
 * ==================================================
 * TOGGLE LIKE
 * ==================================================
 *
 * AUTHENTICATED
 *
 * Client sends only:
 *
 * {
 *   workId
 * }
 *
 * Server gets UID from authentication.
 *
 * The transaction in data/works.js handles:
 *
 * LIKE:
 *   likes + 1
 *   create likes/{userId}
 *
 * UNLIKE:
 *   likes - 1
 *   delete likes/{userId}
 * ==================================================
 */

export async function toggleLikeAction(
  input = {},
) {
  const safeInput = normalizeInput(input);

  const validation =
    toggleLikeSchema.safeParse(
      safeInput,
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
      await getAuthenticatedUser();
  } catch {
    return {
      success: false,
      liked: false,
      likes: 0,
      error: "Authentication failed.",
    };
  }

  if (!user) {
    return {
      success: false,
      liked: false,
      likes: 0,
      error: "You must be logged in.",
    };
  }

  /*
   * --------------------------------------------------
   * TOGGLE
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

      liked: Boolean(
        result?.liked,
      ),

      likes: Number(
        result?.likes ?? 0,
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
        error: "Work not found.",
      };
    }

    return {
      success: false,
      liked: false,
      likes: 0,
      error: "Unable to update like.",
    };
  }
}

/*
 * ==================================================
 * DELETE WORK
 * ==================================================
 *
 * AUTHENTICATED
 *
 * Ownership is verified server-side.
 *
 * IMPORTANT:
 *
 * deleteWork() should also retrieve the work's
 * `imagePublicId` before deleting the Firestore
 * document and remove the corresponding Cloudinary
 * asset server-side.
 *
 * The Cloudinary API secret must NEVER be sent to
 * the client.
 *
 * Client cannot delete another user's work simply
 * by supplying another workId.
 * ==================================================
 */

export async function deleteWorkAction(
  input = {},
) {
  const safeInput = normalizeInput(input);

  const validation =
    deleteWorkSchema.safeParse(
      safeInput,
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
      await getAuthenticatedUser();
  } catch {
    return {
      success: false,
      error: "Authentication failed.",
    };
  }

  if (!user) {
    return {
      success: false,
      error: "You must be logged in.",
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
        error: "Work not found.",
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
      error: "Unable to delete work.",
    };
  }
}