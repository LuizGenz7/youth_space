"use server";

import { z } from "zod";
import { updateTag } from "next/cache";

import {
  createProfile,
  getProfileByUid,
  getProfileByUsername,
  isUsernameAvailable,
  updateUsername,
  updateProfileWithUsername,
  deleteProfile,
} from "@/data/profile";

import {
  getCategoryById,
} from "@/data/categories";

import {
  requireAuthAction,
} from "@/lib/auth-server";

/*
 * ==================================================
 * CONSTANTS
 * ==================================================
 */

const USERNAME_REGEX =
  /^[a-z0-9_]{3,30}$/;

/*
 * ==================================================
 * VALIDATION
 * ==================================================
 */

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    USERNAME_REGEX,
    "Username must be 3–30 characters and use only lowercase letters, numbers and underscores."
  );

const categoryIdSchema = z
  .string()
  .trim()
  .min(
    1,
    "Please select a category."
  );

const completeProfileSchema = z
  .object({
    username: usernameSchema,

    role: z
      .string()
      .trim()
      .min(
        2,
        "Please enter what you do."
      )
      .max(
        60,
        "Your role is too long."
      ),

    categoryId:
      categoryIdSchema,

    province: z
      .string()
      .trim()
      .min(
        1,
        "Please select your province."
      ),

    district: z
      .string()
      .trim()
      .min(
        1,
        "Please select your district."
      ),

    bio: z
      .string()
      .trim()
      .min(
        20,
        "Your bio should be at least 20 characters."
      )
      .max(
        500,
        "Your bio is too long."
      ),

    phone: z
      .string()
      .trim()
      .min(
        7,
        "Please enter a valid phone number."
      )
      .max(
        20,
        "Phone number is too long."
      ),

    whatsapp: z
      .string()
      .trim()
      .min(
        7,
        "Please enter a valid WhatsApp number."
      )
      .max(
        20,
        "WhatsApp number is too long."
      ),

    available:
      z.boolean(),
  })
  .strict();

const updateProfileSchema = z
  .object({
    role: z
      .string()
      .trim()
      .min(
        2,
        "Your role is too short."
      )
      .max(
        60,
        "Your role is too long."
      )
      .optional(),

    categoryId:
      categoryIdSchema
        .optional(),

    province: z
      .string()
      .trim()
      .min(
        1,
        "Please select a province."
      )
      .optional(),

    district: z
      .string()
      .trim()
      .min(
        1,
        "Please select a district."
      )
      .optional(),

    bio: z
      .string()
      .trim()
      .min(
        20,
        "Your bio should be at least 20 characters."
      )
      .max(
        500,
        "Your bio is too long."
      )
      .optional(),

    phone: z
      .string()
      .trim()
      .min(
        7,
        "Please enter a valid phone number."
      )
      .max(
        20,
        "Your phone number is too long."
      )
      .optional(),

    whatsapp: z
      .string()
      .trim()
      .min(
        7,
        "Please enter a valid WhatsApp number."
      )
      .max(
        20,
        "Your WhatsApp number is too long."
      )
      .optional(),

    available:
      z.boolean()
        .optional(),

    avatar: z
      .string()
      .trim()
      .url(
        "Please provide a valid avatar URL."
      )
      .nullable()
      .optional(),

    skills: z
      .array(
        z
          .string()
          .trim()
          .min(
            1,
            "Skill cannot be empty."
          )
          .max(
            60,
            "Skill is too long."
          )
      )
      .max(
        20,
        "You can have up to 20 skills."
      )
      .optional(),

    services: z
      .array(
        z
          .string()
          .trim()
          .min(
            1,
            "Service cannot be empty."
          )
          .max(
            100,
            "Service is too long."
          )
      )
      .max(
        20,
        "You can have up to 20 services."
      )
      .optional(),

    username:
      usernameSchema
        .optional(),
  })
  .strict();

/*
 * ==================================================
 * CATEGORY VALIDATION
 * ==================================================
 */

async function validateCategory(
  categoryId
) {
  if (!categoryId) {
    return {
      valid: true,
      category: null,
    };
  }

  const category =
    await getCategoryById(
      categoryId
    );

  if (!category) {
    return {
      valid: false,
      category: null,
    };
  }

  return {
    valid: true,
    category,
  };
}

/*
 * ==================================================
 * COMPLETE PROFILE
 * ==================================================
 */

export async function completeProfileAction(
  input = {}
) {
  const validation =
    completeProfileSchema.safeParse(
      input
    );

  if (!validation.success) {
    return {
      success: false,
      alreadyExists: false,
      username: null,
      error:
        validation.error
          .issues[0]
          ?.message ||
        "Invalid profile information.",
    };
  }

  try {
    const user =
      await requireAuthAction();

    const existingProfile =
      await getProfileByUid(
        user.uid
      );

    if (existingProfile) {
      return {
        success: true,
        alreadyExists: true,
        username:
          existingProfile.username,
        error: null,
      };
    }

    const categoryResult =
      await validateCategory(
        validation.data
          .categoryId
      );

    if (!categoryResult.valid) {
      return {
        success: false,
        alreadyExists: false,
        username: null,
        error:
          "Please select a valid category.",
      };
    }

    const profileInput = {
      ...validation.data,

      uid:
        user.uid,

      displayName:
        user.displayName ||
        "",

      email:
        user.email ||
        "",

      category:
        categoryResult
          .category.name,
    };

    const profile =
      await createProfile(
        profileInput
      );

    /*
     * Invalidate public profile
     * and profile-related caches.
     */

    updateTag("profiles");

    updateTag(
      `profile:${user.uid}`
    );

    updateTag(
      `profile-username:${profile.username}`
    );

    updateTag("categories");

    return {
      success: true,
      alreadyExists: false,
      username:
        profile.username,
      error: null,
    };
  } catch (error) {
    return handleProfileError(
      error
    );
  }
}

/*
 * ==================================================
 * GET MY PROFILE
 * ==================================================
 */

export async function getMyProfileAction() {
  try {
    const user =
      await requireAuthAction();

    const profile =
      await getProfileByUid(
        user.uid
      );

    if (!profile) {
      return {
        success: false,
        profile: null,
        error:
          "Profile not found.",
      };
    }

    return {
      success: true,
      profile,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      profile: null,
      error:
        error?.message ===
          "AUTH_REQUIRED"
          ? "You must be logged in."
          : "Unable to load your profile.",
    };
  }
}

/*
 * ==================================================
 * GET PUBLIC PROFILE
 * ==================================================
 */

export async function getProfileAction(
  username
) {
  const validation =
    usernameSchema.safeParse(
      username
    );

  if (!validation.success) {
    return {
      success: false,
      profile: null,
      error:
        "Invalid username.",
    };
  }

  try {
    const profile =
      await getProfileByUsername(
        validation.data
      );

    if (!profile) {
      return {
        success: false,
        profile: null,
        error:
          "Talent profile not found.",
      };
    }

    return {
      success: true,
      profile,
      error: null,
    };
  } catch {
    return {
      success: false,
      profile: null,
      error:
        "Unable to load this profile.",
    };
  }
}

/*
 * ==================================================
 * CHECK USERNAME
 * ==================================================
 */

export async function checkUsernameAction(
  username
) {
  const validation =
    usernameSchema.safeParse(
      username
    );

  if (!validation.success) {
    return {
      success: false,
      available: false,
      error:
        validation.error
          .issues[0]
          ?.message ||
        "Invalid username.",
    };
  }

  try {
    const available =
      await isUsernameAvailable(
        validation.data
      );

    return {
      success: true,
      available,
      error: null,
    };
  } catch {
    return {
      success: false,
      available: false,
      error:
        "Unable to check username.",
    };
  }
}

/*
 * ==================================================
 * UPDATE PROFILE
 * ==================================================
 */

export async function updateProfileAction(
  input = {}
) {
  const validation =
    updateProfileSchema.safeParse(
      input
    );

  if (!validation.success) {
    return {
      success: false,
      profile: null,
      error:
        validation.error
          .issues[0]
          ?.message ||
        "Invalid profile information.",
    };
  }

  try {
    const user =
      await requireAuthAction();

    const currentProfile =
      await getProfileByUid(
        user.uid
      );

    if (!currentProfile) {
      return {
        success: false,
        profile: null,
        error:
          "Your profile could not be found.",
      };
    }

    if (
      validation.data.categoryId
    ) {
      const categoryResult =
        await validateCategory(
          validation.data
            .categoryId
        );

      if (!categoryResult.valid) {
        return {
          success: false,
          profile: null,
          error:
            "Please select a valid category.",
        };
      }
    }

    const profile =
      await updateProfileWithUsername(
        validation.data
      );

    updateTag("profiles");

    updateTag(
      `profile:${user.uid}`
    );

    updateTag("categories");

    if (
      currentProfile.username
    ) {
      updateTag(
        `profile-username:${currentProfile.username}`
      );
    }

    if (
      profile?.username
    ) {
      updateTag(
        `profile-username:${profile.username}`
      );
    }

    return {
      success: true,
      profile,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      profile: null,
      ...handleProfileError(
        error
      ),
    };
  }
}

/*
 * ==================================================
 * UPDATE USERNAME
 * ==================================================
 */

export async function updateUsernameAction(
  username
) {
  const validation =
    usernameSchema.safeParse(
      username
    );

  if (!validation.success) {
    return {
      success: false,
      username: null,
      error:
        validation.error
          .issues[0]
          ?.message ||
        "Invalid username.",
    };
  }

  try {
    const user =
      await requireAuthAction();

    const currentProfile =
      await getProfileByUid(
        user.uid
      );

    if (!currentProfile) {
      return {
        success: false,
        username: null,
        error:
          "Your profile could not be found.",
      };
    }

    const oldUsername =
      currentProfile.username;

    const profile =
      await updateUsername(
        validation.data
      );

    updateTag("profiles");

    updateTag(
      `profile:${user.uid}`
    );

    if (oldUsername) {
      updateTag(
        `profile-username:${oldUsername}`
      );
    }

    updateTag(
      `profile-username:${profile.username}`
    );

    return {
      success: true,
      username:
        profile.username,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      username: null,
      ...handleProfileError(
        error
      ),
    };
  }
}

/*
 * ==================================================
 * DELETE MY PROFILE
 * ==================================================
 */

export async function deleteProfileAction() {
  try {
    const user =
      await requireAuthAction();

    const profile =
      await getProfileByUid(
        user.uid
      );

    if (!profile) {
      return {
        success: false,
        error:
          "Profile not found.",
      };
    }

    await deleteProfile();

    updateTag("profiles");

    updateTag(
      `profile:${user.uid}`
    );

    updateTag("categories");

    if (profile.username) {
      updateTag(
        `profile-username:${profile.username}`
      );
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    if (
      error?.message ===
      "AUTH_REQUIRED"
    ) {
      return {
        success: false,
        error:
          "You must be logged in.",
      };
    }

    if (
      error?.message ===
      "PROFILE_NOT_FOUND"
    ) {
      return {
        success: false,
        error:
          "Profile not found.",
      };
    }

    return {
      success: false,
      error:
        "Unable to delete your profile.",
    };
  }
}

/*
 * ==================================================
 * PROFILE ERROR HANDLER
 * ==================================================
 */

function handleProfileError(
  error
) {
  switch (
  error?.message
  ) {
    case "AUTH_REQUIRED":
      return {
        success: false,
        alreadyExists: false,
        username: null,
        error:
          "You must be logged in.",
      };

    case "PROFILE_EXISTS":
      return {
        success: false,
        alreadyExists: true,
        username: null,
        error:
          "Your profile has already been created.",
      };

    case "PROFILE_NOT_FOUND":
      return {
        success: false,
        profile: null,
        error:
          "Your profile could not be found.",
      };

    case "USERNAME_TAKEN":
      return {
        success: false,
        error:
          "That username is already taken.",
      };

    case "UID_REQUIRED":
      return {
        success: false,
        error:
          "Authentication is required.",
      };

    case "USERNAME_REQUIRED":
      return {
        success: false,
        error:
          "Username is required.",
      };

    case "PROFILE_CHANGED":
      return {
        success: false,
        error:
          "Your profile changed while it was being updated. Please try again.",
      };

    default:
      return {
        success: false,
        error:
          "Unable to update your profile. Please try again.",
      };
  }
}