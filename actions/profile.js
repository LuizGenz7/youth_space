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
 * SCHEMAS
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
            username:
                usernameSchema
                    .optional(),

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
        return null;
    }

    const category =
        await getCategoryById(
            categoryId
        );

    if (!category) {
        throw new Error(
            "CATEGORY_NOT_FOUND"
        );
    }

    return category;
}

/*
 * ==================================================
 * COMPLETE PROFILE
 * ==================================================
 *
 * The data layer is responsible for:
 *
 * - atomic profile creation
 * - username reservation
 * - category counter
 * - cache invalidation
 *
 * This action only handles:
 *
 * - validation
 * - authentication
 * - action response
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
                getValidationError(
                    validation
                ),
        };
    }

    try {
        const user =
            await requireAuthAction();

        /*
         * UX check only.
         *
         * createProfile() remains the
         * authoritative atomic check.
         */

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

        await validateCategory(
            validation.data.categoryId
        );

        const profile =
            await createProfile(
                validation.data
            );

        return {
            success: true,
            alreadyExists: false,
            username:
                profile.username,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            alreadyExists: false,
            username: null,
            error:
                getProfileErrorMessage(
                    error
                ),
        };
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
                getProfileErrorMessage(
                    error
                ),
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
 *
 * Public UX check.
 *
 * Final username reservation is performed
 * atomically by createProfile/updateProfile.
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
                getValidationError(
                    validation
                ),
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
 *
 * The data layer handles:
 *
 * - atomic profile update
 * - username change
 * - old/new username registry
 * - category counter changes
 * - affected cache invalidation
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
                getValidationError(
                    validation
                ),
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
         * UX validation.
         *
         * updateProfile() performs its
         * own authoritative category check.
         */

        if (
            validation.data.categoryId
        ) {
            await validateCategory(
                validation.data.categoryId
            );
        }

        const profile =
            await updateProfileWithUsername(
                validation.data
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
            error:
                getProfileErrorMessage(
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
                getValidationError(
                    validation
                ),
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

        const profile =
            await updateUsername(
                validation.data
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
            error:
                getProfileErrorMessage(
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
 * The data layer handles:
 *
 * - atomic deletion
 * - username deletion
 * - category counter
 * - affected cache invalidation
 * ==================================================
 */

export async function deleteProfileAction() {
    try {
        await requireAuthAction();

        await deleteProfile();

        return {
            success: true,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            error:
                getDeleteProfileError(
                    error
                ),
        };
    }
}

/*
 * ==================================================
 * VALIDATION ERROR
 * ==================================================
 */

function getValidationError(
    validation
) {
    return (
        validation.error
            ?.issues?.[0]
            ?.message ||
        "Invalid profile information."
    );
}

/*
 * ==================================================
 * PROFILE ERROR
 * ==================================================
 */

function getProfileErrorMessage(
    error
) {
    switch (
        error?.message
    ) {
        case "AUTH_REQUIRED":
            return (
                "You must be logged in."
            );

        case "PROFILE_EXISTS":
            return (
                "Your profile has already been created."
            );

        case "PROFILE_NOT_FOUND":
            return (
                "Your profile could not be found."
            );

        case "USERNAME_TAKEN":
            return (
                "That username is already taken."
            );

        case "CATEGORY_NOT_FOUND":
            return (
                "Please select a valid category."
            );

        case "CURRENT_CATEGORY_NOT_FOUND":
            return (
                "Your current category could not be found."
            );

        case "INVALID_PROFILE_DATA":
            return (
                "Invalid profile information."
            );

        case "PROFILE_UPDATE_FAILED":
            return (
                "Your profile could not be updated. Please try again."
            );

        default:
            return (
                "Unable to update your profile. Please try again."
            );
    }
}

/*
 * ==================================================
 * DELETE ERROR
 * ==================================================
 */

function getDeleteProfileError(
    error
) {
    switch (
        error?.message
    ) {
        case "AUTH_REQUIRED":
            return (
                "You must be logged in."
            );

        case "PROFILE_NOT_FOUND":
            return (
                "Profile not found."
            );

        case "CATEGORY_NOT_FOUND":
            return (
                "Your profile category could not be found."
            );

        default:
            return (
                "Unable to delete your profile."
            );
    }
}