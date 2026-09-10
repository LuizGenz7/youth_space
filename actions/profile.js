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
  getAuthUser,
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
  console.log(
    "[PROFILE] Validating category:",
    categoryId
  );

  if (!categoryId) {
    console.log(
      "[PROFILE] No category supplied."
    );

    return {
      valid: true,
      category: null,
    };
  }

  const category =
    await getCategoryById(
      categoryId
    );

  console.log(
    "[PROFILE] Category result:",
    category
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
  console.log(
    "\n=================================================="
  );

  console.log(
    "[PROFILE] COMPLETE PROFILE START"
  );

  console.log(
    "[PROFILE] Raw input:",
    input
  );

  /*
   * --------------------------------------------------
   * VALIDATE
   * --------------------------------------------------
   */

  const validation =
    completeProfileSchema.safeParse(
      input
    );

  console.log(
    "[PROFILE] Validation success:",
    validation.success
  );

  if (!validation.success) {
    console.error(
      "[PROFILE] VALIDATION ERRORS:",
      validation.error.issues
    );

    console.error(
      "[PROFILE] VALIDATION FORMAT:",
      validation.error.format()
    );

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

  console.log(
    "[PROFILE] Validated data:",
    validation.data
  );

  /*
   * --------------------------------------------------
   * AUTHENTICATION
   * --------------------------------------------------
   */

  try {
    console.log(
      "[PROFILE] Checking authentication..."
    );

    /*
     * DEBUG:
     * Check the raw authenticated user
     * before requireAuthAction().
     */

    const authUser =
      await getAuthUser();

    console.log(
      "[PROFILE] getAuthUser() result:",
      authUser
    );

    if (!authUser) {
      console.error(
        "[PROFILE] ❌ NO AUTHENTICATED USER"
      );

      return {
        success: false,
        alreadyExists: false,
        username: null,
        error:
          "You must be logged in.",
      };
    }

    console.log(
      "[PROFILE] ✅ Authenticated UID:",
      authUser.uid
    );

    console.log(
      "[PROFILE] Authenticated email:",
      authUser.email
    );

    console.log(
      "[PROFILE] Email verified:",
      authUser.emailVerified
    );

    /*
     * requireAuthAction() should return
     * the exact same authenticated user.
     */

    const user =
      await requireAuthAction();

    console.log(
      "[PROFILE] requireAuthAction() result:",
      user
    );

    console.log(
      "[PROFILE] ✅ Server authentication successful."
    );

    /*
     * --------------------------------------------------
     * EXISTING PROFILE
     * --------------------------------------------------
     */

    console.log(
      "[PROFILE] Checking existing profile..."
    );

    const existingProfile =
      await getProfileByUid(
        user.uid
      );

    console.log(
      "[PROFILE] Existing profile:",
      existingProfile
    );

    if (existingProfile) {
      console.log(
        "[PROFILE] Profile already exists."
      );

      return {
        success: true,
        alreadyExists: true,
        username:
          existingProfile.username,
        error: null,
      };
    }

    /*
     * --------------------------------------------------
     * CATEGORY
     * --------------------------------------------------
     */

    const categoryResult =
      await validateCategory(
        validation.data
          .categoryId
      );

    if (!categoryResult.valid) {
      console.error(
        "[PROFILE] ❌ Invalid category."
      );

      return {
        success: false,
        alreadyExists: false,
        username: null,
        error:
          "Please select a valid category.",
      };
    }

    console.log(
      "[PROFILE] ✅ Category valid:",
      categoryResult.category
    );

    /*
     * --------------------------------------------------
     * CREATE PROFILE
     * --------------------------------------------------
     */

    const profileInput = {
      uid: user.uid,

      displayName:
        user.displayName ||
        "",

      email:
        user.email ||
        "",

      ...validation.data,

      category:
        categoryResult
          .category.name,
    };

    console.log(
      "[PROFILE] Creating profile with:",
      profileInput
    );

    const profile =
      await createProfile(
        profileInput
      );

    console.log(
      "[PROFILE] ✅ Profile created:",
      profile
    );

    /*
     * --------------------------------------------------
     * CACHE INVALIDATION
     * --------------------------------------------------
     */

    console.log(
      "[PROFILE] Updating cache tags..."
    );

    updateTag("profiles");

    updateTag(
      `profile:${user.uid}`
    );

    updateTag(
      `profile-username:${profile.username}`
    );

    updateTag(
      "categories"
    );

    console.log(
      "[PROFILE] Cache tags updated."
    );

    console.log(
      "[PROFILE] ✅ COMPLETE PROFILE SUCCESS"
    );

    console.log(
      "==================================================\n"
    );

    return {
      success: true,
      alreadyExists: false,
      username:
        profile.username,
      error: null,
    };
  } catch (error) {
    console.error(
      "\n=================================================="
    );

    console.error(
      "[PROFILE] ❌ COMPLETE PROFILE FAILED"
    );

    logActualError(
      error
    );

    console.error(
      "==================================================\n"
    );

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
  console.log(
    "[PROFILE] GET MY PROFILE START"
  );

  try {
    const user =
      await requireAuthAction();

    console.log(
      "[PROFILE] Authenticated UID:",
      user.uid
    );

    const profile =
      await getProfileByUid(
        user.uid
      );

    console.log(
      "[PROFILE] Profile:",
      profile
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
    console.error(
      "[PROFILE] GET MY PROFILE FAILED"
    );

    logActualError(
      error
    );

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
  console.log(
    "[PROFILE] GET PUBLIC PROFILE:",
    username
  );

  const validation =
    usernameSchema.safeParse(
      username
    );

  if (!validation.success) {
    console.error(
      "[PROFILE] Invalid username:",
      validation.error.issues
    );

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
  } catch (error) {
    console.error(
      "[PROFILE] GET PUBLIC PROFILE FAILED"
    );

    logActualError(
      error
    );

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
  console.log(
    "[PROFILE] CHECK USERNAME:",
    username
  );

  const validation =
    usernameSchema.safeParse(
      username
    );

  if (!validation.success) {
    console.error(
      "[PROFILE] Username validation:",
      validation.error.issues
    );

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

    console.log(
      "[PROFILE] Username available:",
      available
    );

    return {
      success: true,
      available,
      error: null,
    };
  } catch (error) {
    console.error(
      "[PROFILE] CHECK USERNAME FAILED"
    );

    logActualError(
      error
    );

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
  console.log(
    "[PROFILE] UPDATE PROFILE START"
  );

  console.log(
    "[PROFILE] Input:",
    input
  );

  const validation =
    updateProfileSchema.safeParse(
      input
    );

  if (!validation.success) {
    console.error(
      "[PROFILE] UPDATE VALIDATION ERRORS:",
      validation.error.issues
    );

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

    console.log(
      "[PROFILE] Authenticated UID:",
      user.uid
    );

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
        user.uid,
        validation.data
      );

    console.log(
      "[PROFILE] Updated profile:",
      profile
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
    console.error(
      "[PROFILE] UPDATE PROFILE FAILED"
    );

    logActualError(
      error
    );

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
  console.log(
    "[PROFILE] UPDATE USERNAME:",
    username
  );

  const validation =
    usernameSchema.safeParse(
      username
    );

  if (!validation.success) {
    console.error(
      "[PROFILE] Username validation:",
      validation.error.issues
    );

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

    console.log(
      "[PROFILE] Authenticated UID:",
      user.uid
    );

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
        user.uid,
        validation.data
      );

    console.log(
      "[PROFILE] Username updated:",
      profile.username
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
    console.error(
      "[PROFILE] UPDATE USERNAME FAILED"
    );

    logActualError(
      error
    );

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
  console.log(
    "[PROFILE] DELETE PROFILE START"
  );

  try {
    const user =
      await requireAuthAction();

    console.log(
      "[PROFILE] Authenticated UID:",
      user.uid
    );

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

    await deleteProfile(
      user.uid
    );

    console.log(
      "[PROFILE] Profile deleted."
    );

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
    console.error(
      "[PROFILE] DELETE PROFILE FAILED"
    );

    logActualError(
      error
    );

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
 * ACTUAL ERROR LOGGER
 * ==================================================
 */

function logActualError(
  error
) {
  console.error(
    "[ACTUAL ERROR] Object:",
    error
  );

  console.error(
    "[ACTUAL ERROR] Name:",
    error?.name
  );

  console.error(
    "[ACTUAL ERROR] Message:",
    error?.message
  );

  console.error(
    "[ACTUAL ERROR] Code:",
    error?.code
  );

  console.error(
    "[ACTUAL ERROR] Cause:",
    error?.cause
  );

  console.error(
    "[ACTUAL ERROR] Stack:",
    error?.stack
  );

  /*
   * Firebase errors can contain
   * additional properties.
   */

  if (
    error &&
    typeof error === "object"
  ) {
    console.error(
      "[ACTUAL ERROR] Keys:",
      Object.keys(error)
    );

    console.error(
      "[ACTUAL ERROR] JSON:",
      safeStringify(error)
    );
  }
}

/*
 * ==================================================
 * SAFE ERROR SERIALIZER
 * ==================================================
 */

function safeStringify(
  value
) {
  try {
    return JSON.stringify(
      value,
      Object.getOwnPropertyNames(
        value
      ),
      2
    );
  } catch {
    return String(value);
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
      /*
       * We deliberately log the complete
       * unknown error before returning a
       * safe client message.
       */

      logActualError(
        error
      );

      return {
        success: false,
        error:
          error?.message ||
          "Unable to update your profile. Please try again.",
      };
  }
}