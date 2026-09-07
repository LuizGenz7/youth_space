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
    requireAuth,
} from "@/lib/auth";

/*
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

const USERNAME_REGEX =
    /^[a-z0-9_]{3,30}$/;

/*
 * --------------------------------------------------
 * VALIDATION
 * --------------------------------------------------
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

        available: z.boolean(),
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
            categoryIdSchema.optional(),

        province: z
            .string()
            .trim()
            .min(
                1,
                "Please select your province."
            )
            .optional(),

        district: z
            .string()
            .trim()
            .min(
                1,
                "Please select your district."
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
                "Phone number is too long."
            )
            .optional(),

        whatsapp: z
            .string()
            .trim()
            .min(
                7,
                "WhatsApp number is too long."
            )
            .max(
                20,
                "WhatsApp number is too long."
            )
            .optional(),

        available:
            z.boolean().optional(),

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
            usernameSchema.optional(),
    })
    .strict();

/*
 * --------------------------------------------------
 * CATEGORY VALIDATION
 * --------------------------------------------------
 */

async function validateCategory(
    categoryId
) {
    console.log(
        "PROFILE: validateCategory started",
        categoryId
    );

    if (!categoryId) {
        console.log(
            "PROFILE: no category ID"
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
        "PROFILE: category lookup result",
        !!category
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
 * --------------------------------------------------
 * COMPLETE PROFILE
 * --------------------------------------------------
 */

export async function completeProfileAction(
    input = {}
) {
    console.log(
        "PROFILE: completeProfileAction started"
    );

    const validation =
        completeProfileSchema.safeParse(
            input
        );

    if (!validation.success) {
        console.error(
            "PROFILE: validation failed",
            validation.error.issues
        );

        return {
            success: false,
            alreadyExists: false,
            username: null,
            error:
                validation.error.issues[0]
                    ?.message ||
                "Invalid profile information.",
        };
    }

    console.log(
        "PROFILE: validation passed"
    );

    try {
        /*
         * --------------------------------------------------
         * AUTHENTICATION
         * --------------------------------------------------
         */

        console.log(
            "PROFILE: checking authentication"
        );

        const user =
            await requireAuth();

        console.log(
            "PROFILE: authenticated",
            user?.uid
        );

        /*
         * --------------------------------------------------
         * EXISTING PROFILE
         * --------------------------------------------------
         */

        console.log(
            "PROFILE: checking existing profile"
        );

        const existingProfile =
            await getProfileByUid(
                user.uid
            );

        console.log(
            "PROFILE: existing profile result",
            !!existingProfile
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
         * --------------------------------------------------
         * VALIDATE CATEGORY
         * --------------------------------------------------
         */

        console.log(
            "PROFILE: validating category"
        );

        const categoryResult =
            await validateCategory(
                validation.data.categoryId
            );

        console.log(
            "PROFILE: category validation complete",
            categoryResult.valid
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

        /*
         * --------------------------------------------------
         * CREATE PROFILE
         * --------------------------------------------------
         */

        console.log(
            "PROFILE: creating Firestore profile"
        );

        const profile =
            await createProfile({
                uid: user.uid,

                displayName:
                    user.name ||
                    user.displayName ||
                    "",

                email:
                    user.email ||
                    "",

                ...validation.data,

                category:
                    categoryResult
                        .category.name,
            });

        console.log(
            "PROFILE: profile created",
            profile?.username
        );

        /*
         * --------------------------------------------------
         * CACHE INVALIDATION
         * --------------------------------------------------
         */

        console.log(
            "PROFILE: updating cache tags"
        );

        updateTag("profiles");

        updateTag(
            `profile:${user.uid}`
        );

        updateTag(
            `profile-username:${profile.username}`
        );

        updateTag("categories");

        console.log(
            "PROFILE: completeProfileAction completed"
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
            "PROFILE: completeProfileAction FAILED",
            error
        );

        return handleProfileError(error);
    }
}

/*
 * --------------------------------------------------
 * GET MY PROFILE
 * --------------------------------------------------
 */

export async function getMyProfileAction() {
    try {
        const user =
            await requireAuth();

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
        console.error(
            "GET MY PROFILE ERROR:",
            error
        );

        return {
            success: false,
            profile: null,
            error:
                "Unable to load your profile.",
        };
    }
}

/*
 * --------------------------------------------------
 * GET PUBLIC PROFILE
 * --------------------------------------------------
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
    } catch (error) {
        console.error(
            "GET PROFILE ERROR:",
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
 * --------------------------------------------------
 * CHECK USERNAME
 * --------------------------------------------------
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
                validation.error.issues[0]
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
    } catch (error) {
        console.error(
            "CHECK USERNAME ERROR:",
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
 * --------------------------------------------------
 * UPDATE PROFILE
 * --------------------------------------------------
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
                validation.error.issues[0]
                    ?.message ||
                "Invalid profile information.",
        };
    }

    try {
        const user =
            await requireAuth();

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
            "UPDATE PROFILE ERROR:",
            error
        );

        return {
            success: false,
            profile: null,
            ...handleProfileError(error),
        };
    }
}

/*
 * --------------------------------------------------
 * UPDATE USERNAME
 * --------------------------------------------------
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
                validation.error.issues[0]
                    ?.message ||
                "Invalid username.",
        };
    }

    try {
        const user =
            await requireAuth();

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
            "UPDATE USERNAME ERROR:",
            error
        );

        return {
            success: false,
            username: null,
            ...handleProfileError(error),
        };
    }
}

/*
 * --------------------------------------------------
 * DELETE MY PROFILE
 * --------------------------------------------------
 */

export async function deleteProfileAction() {
    try {
        const user =
            await requireAuth();

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
            "DELETE PROFILE ERROR:",
            error
        );

        return {
            success: false,
            error:
                error?.message ===
                    "PROFILE_NOT_FOUND"
                    ? "Profile not found."
                    : "Unable to delete your profile.",
        };
    }
}

/*
 * --------------------------------------------------
 * ERROR HANDLER
 * --------------------------------------------------
 */

function handleProfileError(error) {
    switch (error?.message) {
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
            console.error(
                "Profile action error:",
                error
            );

            return {
                success: false,
                error:
                    "Unable to update your profile. Please try again.",
            };
    }
}
