"use server";

import { z } from "zod";

import {
    createProfile,
    getProfileByUid,
    getProfileByUsername,
    isUsernameAvailable,
    updateUsername,
    updateProfileWithUsername,
    deleteProfile,
} from "@/data/profile";

import { getCategoryById } from "@/data/categories";

import {
    requireAuth,
    requireAuthAction,
} from "@/lib/auth-server";

/* ========================================================================== */
/* Constants                                                                  */
/* ========================================================================== */

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

/* ========================================================================== */
/* Shared Schemas                                                             */
/* ========================================================================== */

const displayNameSchema = z
    .string()
    .trim()
    .min(2, "Your name is too short.")
    .max(80, "Your name is too long.");

const usernameSchema = z
    .string()
    .trim()
    .toLowerCase()
    .regex(
        USERNAME_REGEX,
        "Username must be 3–30 characters and use only lowercase letters, numbers and underscores.",
    );

const roleSchema = z
    .string()
    .trim()
    .min(2, "Please enter what you do.")
    .max(60, "Your role is too long.");

const categoryIdSchema = z
    .string()
    .trim()
    .min(1, "Please select a category.");

const provinceSchema = z
    .string()
    .trim()
    .min(1, "Please select your province.");

const districtSchema = z
    .string()
    .trim()
    .min(1, "Please select your district.");

const bioSchema = z
    .string()
    .trim()
    .min(20, "Your bio should be at least 20 characters.")
    .max(500, "Your bio is too long.");

const phoneSchema = z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Phone number is too long.");

const whatsappSchema = z
    .string()
    .trim()
    .min(7, "Please enter a valid WhatsApp number.")
    .max(20, "WhatsApp number is too long.");

/* ========================================================================== */
/* Avatar Schemas                                                             */
/* ========================================================================== */

/*
 * Cloudinary secure URL.
 *
 * Nullable because an existing profile may intentionally
 * have no avatar.
 */
const avatarSchema = z
    .string()
    .trim()
    .url("Please provide a valid avatar URL.")
    .nullable()
    .optional();

/*
 * Cloudinary public_id.
 *
 * Example:
 * youth-space/avatars/abc123xyz
 *
 * This is intentionally optional because existing profiles
 * may not have an avatarPublicId yet.
 */
const avatarPublicIdSchema = z
    .string()
    .trim()
    .min(1, "Avatar public ID cannot be empty.")
    .max(500, "Avatar public ID is too long.")
    .nullable()
    .optional();

const skillsSchema = z
    .array(
        z
            .string()
            .trim()
            .min(1, "Skill cannot be empty.")
            .max(60, "Skill is too long."),
    )
    .max(20, "You can have up to 20 skills.");

const serviceSchema = z
    .object({
        /*
         * Existing services may have an ID.
         * Newly created services from the client do not.
         */
        id: z.string().trim().min(1).optional(),

        name: z
            .string()
            .trim()
            .min(1, "Service name cannot be empty.")
            .max(100, "Service name is too long."),

        description: z
            .string()
            .trim()
            .max(500, "Service description is too long.")
            .optional()
            .default(""),

        /*
         * Current ProfileClient uses minPrice.
         */
        minPrice: z
            .union([z.string().trim(), z.number()])
            .optional(),

        /*
         * Keep compatibility with older service records.
         */
        price: z
            .union([z.string().trim(), z.number()])
            .optional(),

        image: z
            .string()
            .trim()
            .url("Please provide a valid service image URL.")
            .nullable()
            .optional(),
    })
    .strict();

const servicesSchema = z
    .array(serviceSchema)
    .max(20, "You can have up to 20 services.");

/* ========================================================================== */
/* Complete Profile                                                           */
/* ========================================================================== */

const completeProfileSchema = z
    .object({
        displayName: displayNameSchema,

        username: usernameSchema,

        role: roleSchema,

        categoryId: categoryIdSchema,

        province: provinceSchema,

        district: districtSchema,

        bio: bioSchema,

        phone: phoneSchema,

        whatsapp: whatsappSchema,

        available: z.boolean(),

        /*
         * Avatar is optional during profile completion.
         */
        avatar: avatarSchema,

        avatarPublicId: avatarPublicIdSchema,
    })
    .strict();

/* ========================================================================== */
/* Update Profile                                                             */
/* ========================================================================== */

const updateProfileSchema = z
    .object({
        /*
         * ----------------------------------------------------------------------
         * Profile
         * ----------------------------------------------------------------------
         */

        displayName: displayNameSchema.optional(),

        username: usernameSchema.optional(),

        /*
         * ----------------------------------------------------------------------
         * Professional
         * ----------------------------------------------------------------------
         */

        role: roleSchema.optional(),

        categoryId: categoryIdSchema.optional(),

        province: provinceSchema.optional(),

        district: districtSchema.optional(),

        bio: bioSchema.optional(),

        phone: phoneSchema.optional(),

        whatsapp: whatsappSchema.optional(),

        available: z.boolean().optional(),

        /*
         * ----------------------------------------------------------------------
         * Avatar
         * ----------------------------------------------------------------------
         *
         * avatar:
         * Cloudinary secure URL.
         *
         * avatarPublicId:
         * Cloudinary public_id used later if we need to replace/delete
         * the image through Cloudinary's server-side API.
         */

        avatar: avatarSchema,

        avatarPublicId: avatarPublicIdSchema,

        /*
         * ----------------------------------------------------------------------
         * Skills
         * ----------------------------------------------------------------------
         */

        skills: skillsSchema.optional(),

        /*
         * ----------------------------------------------------------------------
         * Services
         * ----------------------------------------------------------------------
         */

        services: servicesSchema.optional(),
    })
    .strict();

/* ========================================================================== */
/* Category Validation                                                        */
/* ========================================================================== */

async function validateCategory(categoryId) {
    if (!categoryId) {
        return null;
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
        throw new Error("CATEGORY_NOT_FOUND");
    }

    return category;
}

/* ========================================================================== */
/* Complete Profile                                                           */
/* ========================================================================== */

export async function completeProfileAction(input = {}) {
    const validation = completeProfileSchema.safeParse(input);

    if (!validation.success) {
        return {
            success: false,
            alreadyExists: false,
            username: null,
            profile: null,
            error: getValidationError(validation),
        };
    }

    try {
        const user = await requireAuthAction();

        /*
         * UX check only.
         *
         * createProfile() remains the authoritative
         * profile creation operation.
         */
        const existingProfile = await getProfileByUid(user.uid);

        if (existingProfile) {
            return {
                success: true,
                alreadyExists: true,
                username: existingProfile.username,
                profile: existingProfile,
                error: null,
            };
        }

        await validateCategory(validation.data.categoryId);

        const profile = await createProfile({
            ...validation.data,
            uid: user.uid,
        });

        return {
            success: true,
            alreadyExists: false,
            username: profile.username,
            profile,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            alreadyExists: false,
            username: null,
            profile: null,
            error: getProfileErrorMessage(error),
        };
    }
}

/* ========================================================================== */
/* Get My Profile                                                             */
/* ========================================================================== */

export async function getMyProfileAction() {
    try {
        const user = await requireAuth();

        const profile = await getProfileByUid(user.uid);

        if (!profile) {
            return {
                success: false,
                profile: null,
                code: "PROFILE_NOT_FOUND",
                error: "Profile not found.",
            };
        }

        return {
            success: true,
            profile,
            code: null,
            error: null,
        };
    } catch (error) {
        console.error("getMyProfileAction failed:", error);

        return {
            success: false,
            profile: null,
            code:
                error?.code ||
                error?.message ||
                "PROFILE_LOAD_FAILED",
            error: getProfileErrorMessage(error),
        };
    }
}

/* ========================================================================== */
/* Get Public Profile                                                         */
/* ========================================================================== */

export async function getProfileAction(username) {
    const validation = usernameSchema.safeParse(username);

    if (!validation.success) {
        return {
            success: false,
            profile: null,
            error: "Invalid username.",
        };
    }

    try {
        const profile = await getProfileByUsername(
            validation.data,
        );

        if (!profile) {
            return {
                success: false,
                profile: null,
                error: "Talent profile not found.",
            };
        }

        return {
            success: true,
            profile,
            error: null,
        };
    } catch (error) {
        console.error("getProfileAction failed:", error);

        return {
            success: false,
            profile: null,
            error: "Unable to load this profile.",
        };
    }
}

/* ========================================================================== */
/* Check Username                                                             */
/* ========================================================================== */

export async function checkUsernameAction(username) {
    const validation = usernameSchema.safeParse(username);

    if (!validation.success) {
        return {
            success: false,
            available: false,
            error: getValidationError(validation),
        };
    }

    try {
        const available = await isUsernameAvailable(
            validation.data,
        );

        return {
            success: true,
            available,
            error: null,
        };
    } catch (error) {
        console.error("checkUsernameAction failed:", error);

        return {
            success: false,
            available: false,
            error: "Unable to check username.",
        };
    }
}

/* ========================================================================== */
/* Update Profile                                                             */
/* ========================================================================== */

export async function updateProfileAction(input = {}) {
    const validation = updateProfileSchema.safeParse(input);

    if (!validation.success) {
        return {
            success: false,
            profile: null,
            code: "VALIDATION_FAILED",
            error: getValidationError(validation),
        };
    }

    try {
        const user = await requireAuthAction();

        const currentProfile = await getProfileByUid(user.uid);

        if (!currentProfile) {
            return {
                success: false,
                profile: null,
                code: "PROFILE_NOT_FOUND",
                error: "Your profile could not be found.",
            };
        }

        /*
         * Validate category before sending the update
         * to the data layer.
         */
        if (validation.data.categoryId) {
            await validateCategory(
                validation.data.categoryId,
            );
        }

        /*
         * Keep the update scoped to fields that were
         * actually supplied by the client.
         *
         * This now includes:
         *
         * avatar
         * avatarPublicId
         */
        const updateData = {
            ...validation.data,
        };

        const profile =
            await updateProfileWithUsername(updateData);

        return {
            success: true,
            profile,
            code: null,
            error: null,
        };
    } catch (error) {
        console.error(
            "updateProfileAction failed:",
            error,
        );

        return {
            success: false,
            profile: null,
            code:
                error?.code ||
                error?.message ||
                "PROFILE_UPDATE_FAILED",
            error: getProfileErrorMessage(error),
        };
    }
}

/* ========================================================================== */
/* Update Username                                                            */
/* ========================================================================== */

export async function updateUsernameAction(username) {
    const validation = usernameSchema.safeParse(username);

    if (!validation.success) {
        return {
            success: false,
            username: null,
            error: getValidationError(validation),
        };
    }

    try {
        const user = await requireAuthAction();

        const currentProfile = await getProfileByUid(user.uid);

        if (!currentProfile) {
            return {
                success: false,
                username: null,
                code: "PROFILE_NOT_FOUND",
                error: "Your profile could not be found.",
            };
        }

        const profile = await updateUsername(
            validation.data,
        );

        return {
            success: true,
            username: profile.username,
            code: null,
            error: null,
        };
    } catch (error) {
        console.error(
            "updateUsernameAction failed:",
            error,
        );

        return {
            success: false,
            username: null,
            error: getProfileErrorMessage(error),
        };
    }
}

/* ========================================================================== */
/* Delete Profile                                                             */
/* ========================================================================== */

export async function deleteProfileAction() {
    try {
        await requireAuthAction();

        await deleteProfile();

        return {
            success: true,
            error: null,
        };
    } catch (error) {
        console.error(
            "deleteProfileAction failed:",
            error,
        );

        return {
            success: false,
            error: getDeleteProfileError(error),
        };
    }
}

/* ========================================================================== */
/* Validation Error                                                           */
/* ========================================================================== */

function getValidationError(validation) {
    return (
        validation.error?.issues?.[0]?.message ||
        "Invalid profile information."
    );
}

/* ========================================================================== */
/* Profile Error                                                              */
/* ========================================================================== */

function getProfileErrorMessage(error) {
    const code = error?.code;
    const message = error?.message;

    switch (code || message) {
        case "AUTH_REQUIRED":
            return "You must be logged in.";

        case "PROFILE_EXISTS":
            return "Your profile has already been created.";

        case "PROFILE_NOT_FOUND":
            return "Your profile could not be found.";

        case "USERNAME_TAKEN":
            return "That username is already taken.";

        case "CATEGORY_NOT_FOUND":
            return "Please select a valid category.";

        case "CURRENT_CATEGORY_NOT_FOUND":
            return "Your current category could not be found.";

        case "INVALID_PROFILE_DATA":
            return "Invalid profile information.";

        case "PROFILE_UPDATE_FAILED":
            return "Your profile could not be updated. Please try again.";

        case "PERMISSION_DENIED":
        case "PERMISSION_DENIED: Missing or insufficient permissions.":
            return "You do not have permission to update this profile.";

        default:
            return "Unable to update your profile. Please try again.";
    }
}

/* ========================================================================== */
/* Delete Error                                                               */
/* ========================================================================== */

function getDeleteProfileError(error) {
    const code = error?.code;
    const message = error?.message;

    switch (code || message) {
        case "AUTH_REQUIRED":
            return "You must be logged in.";

        case "PROFILE_NOT_FOUND":
            return "Profile not found.";

        case "CATEGORY_NOT_FOUND":
            return "Your profile category could not be found.";

        case "PERMISSION_DENIED":
        case "PERMISSION_DENIED: Missing or insufficient permissions.":
            return "You do not have permission to delete your profile.";

        default:
            return "Unable to delete your profile.";
    }
}