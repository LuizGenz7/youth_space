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

const usernameSchema =
  z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      USERNAME_REGEX,
      "Username must be 3–30 characters and use only lowercase letters, numbers and underscores."
    );

const categoryIdSchema =
  z
    .string()
    .trim()
    .min(
      1,
      "Please select a category."
    );

const completeProfileSchema =
  z
    .object({
      username:
        usernameSchema,

      role:
        z
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

      province:
        z
          .string()
          .trim()
          .min(
            1,
            "Please select your province."
          ),

      district:
        z
          .string()
          .trim()
          .min(
            1,
            "Please select your district."
          ),

      bio:
        z
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

      phone:
        z
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

      whatsapp:
        z
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

const updateProfileSchema =
  z
    .object({
      role:
        z
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

      province:
        z
          .string()
          .trim()
          .min(
            1,
            "Please select a province."
          )
          .optional(),

      district:
        z
          .string()
          .trim()
          .min(
            1,
            "Please select a district."
          )
          .optional(),

      bio:
        z
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

      phone:
        z
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

      whatsapp:
        z
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
        z
          .boolean()
          .optional(),

      avatar:
        z
          .string()
          .trim()
          .url(
            "Please provide a valid avatar URL."
          )
          .nullable()
          .optional(),

      skills:
        z
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

      services:
        z
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
 * CACHE INVALIDATION
 * ==================================================
 */

function invalidateProfileCache({
  uid,
  oldUsername = null,
  newUsername = null,
}) {
  updateTag("profiles");

  updateTag(
    `profile:${uid}`
  );

  if (oldUsername) {
    updateTag(
      `profile-username:${oldUsername}`
    );

    updateTag(
      `username:${oldUsername}`
    );

    updateTag(
      `username-availability:${oldUsername}`
    );
  }

  if (newUsername) {
    updateTag(
      `profile-username:${newUsername}`
    );

    updateTag(
      `username:${newUsername}`
    );

    updateTag(
      `username-availability:${newUsername}`
    );
  }
}

/*
 * ==================================================
 * COMPLETE PROFILE
 * ==================================================
 *
 * data/profile.js is responsible for creating:
 *
 * talents/{uid}
 * usernames/{username}
 *
 * atomically.
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

    /*
     * Validate the category before
     * touching Firestore.
     */

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

    /*
     * createProfile() creates BOTH:
     *
     * talents/{uid}
     * usernames/{username}
     *
     * in one Firestore transaction.
     */

    const profile =
      await createProfile(
        profileInput
      );

    invalidateProfileCache({
      uid:
        user.uid,

      newUsername:
        profile.username,
    });

    updateTag(
      "categories"
    );

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
 *
 * Username resolution happens through:
 *
 * usernames/{username}
 *        ↓
 *       uid
 *        ↓
 * talents/{uid}
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
 *
 * Checks:
 *
 * usernames/{username}
 *
 * directly.
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
  } catch(e) {
    return {
      success: false,
      available: false,
      error:
        "Unable to check username." + e,
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

    /*
     * Validate category before
     * updating the profile.
     */

    if (
      validation.data
        .categoryId
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

    const oldUsername =
      currentProfile.username ||
      null;

    const requestedUsername =
      validation.data.username ||
      oldUsername;

    const profile =
      await updateProfileWithUsername(
        validation.data
      );

    /*
     * updateProfileWithUsername()
     * atomically handles:
     *
     * talents/{uid}
     *
     * usernames/{oldUsername}
     *
     * usernames/{newUsername}
     */

    invalidateProfileCache({
      uid:
        user.uid,

      oldUsername,

      newUsername:
        profile?.username ||
        requestedUsername,
    });

    updateTag(
      "categories"
    );

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
      currentProfile.username ||
      null;

    const profile =
      await updateUsername(
        validation.data
      );

    invalidateProfileCache({
      uid:
        user.uid,

      oldUsername,

      newUsername:
        profile.username,
    });

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
 *
 * data/profile.js atomically deletes:
 *
 * talents/{uid}
 * usernames/{username}
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

    invalidateProfileCache({
      uid:
        user.uid,

      oldUsername:
        profile.username ||
        null,
    });

    updateTag(
      "categories"
    );

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
        alreadyExists: false,
        username: null,
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

    case "INVALID_PROFILE_DATA":
      return {
        success: false,
        error:
          "Invalid profile information.",
      };

    default:
      return {
        success: false,
        error:
          "Unable to update your profile. Please try again.",
      };
  }
}
