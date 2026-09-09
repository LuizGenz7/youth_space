import { z } from "zod";

import {
    categories,
} from "./categories";

import {
    talents,
    getTalentById,
    getTalentByUsername,
} from "./talents_data";

/*
 * --------------------------------------------------
 * TEST PROFILE DATA
 * --------------------------------------------------
 *
 * Firebase has been completely removed.
 *
 * Profiles are stored in the in-memory `talents`
 * array from talents_data.js.
 *
 * Categories come from categories.js.
 *
 * IMPORTANT:
 *
 * This is TEST DATA only.
 * Changes exist only while the development server
 * is running.
 */

/*
 * --------------------------------------------------
 * TEST AUTH
 * --------------------------------------------------
 *
 * There is no Firebase Auth in test mode.
 *
 * The first generated talent acts as the currently
 * authenticated test user.
 *
 * You can change this later when we build the
 * real authentication layer.
 */

const TEST_CURRENT_USER_ID =
    talents[0]?.uid || "test-talent-1";

function getCurrentUser() {
    const user =
        getTalentById(
            TEST_CURRENT_USER_ID
        );

    if (!user) {
        throw new Error(
            "AUTH_REQUIRED"
        );
    }

    return {
        uid: user.uid,

        displayName:
            user.displayName,

        email:
            user.email,
    };
}

/*
 * --------------------------------------------------
 * VALIDATION
 * --------------------------------------------------
 */

const USERNAME_REGEX =
    /^[a-z0-9_]{3,30}$/;

const usernameSchema = z
    .string()
    .trim()
    .toLowerCase()
    .regex(
        USERNAME_REGEX,
        "Username must be 3-30 characters and contain only lowercase letters, numbers, and underscores."
    );

const profileUpdateSchema =
    z.object({
        username:
            usernameSchema.optional(),

        role:
            z
                .string()
                .trim()
                .max(100)
                .optional(),

        categoryId:
            z
                .string()
                .trim()
                .max(100)
                .optional(),

        province:
            z
                .string()
                .trim()
                .max(100)
                .optional(),

        district:
            z
                .string()
                .trim()
                .max(100)
                .optional(),

        bio:
            z
                .string()
                .trim()
                .max(1000)
                .optional(),

        phone:
            z
                .string()
                .trim()
                .max(30)
                .optional(),

        whatsapp:
            z
                .string()
                .trim()
                .max(30)
                .optional(),

        available:
            z
                .boolean()
                .optional(),

        avatar:
            z
                .string()
                .trim()
                .url()
                .nullable()
                .optional(),

        skills:
            z
                .array(
                    z
                        .string()
                        .trim()
                        .min(1)
                        .max(100)
                )
                .max(20)
                .optional(),

        services:
            z
                .array(
                    z.object({
                        id:
                            z.string(),

                        name:
                            z
                                .string()
                                .trim()
                                .min(1)
                                .max(150),

                        description:
                            z
                                .string()
                                .trim()
                                .max(1000)
                                .optional()
                                .default(""),

                        price:
                            z
                                .string()
                                .max(50)
                                .optional()
                                .default(""),

                        image:
                            z
                                .string()
                                .trim()
                                .url()
                                .or(
                                    z.literal("")
                                )
                                .optional()
                                .default(""),
                    })
                )
                .max(20)
                .optional(),
    });

/*
 * --------------------------------------------------
 * NORMALIZATION
 * --------------------------------------------------
 */

function normalizeString(
    value
) {
    if (
        typeof value !== "string"
    ) {
        return "";
    }

    return value.trim();
}

function normalizeStringArray(
    value
) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (item) =>
                typeof item ===
                "string"
        )
        .map(
            (item) =>
                item.trim()
        )
        .filter(Boolean);
}

function normalizeBoolean(
    value
) {
    return value === true;
}

function normalizeNumber(
    value
) {
    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}

function normalizeServices(
    value
) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((service) => {
            if (
                !service ||
                typeof service !==
                    "object" ||
                Array.isArray(service)
            ) {
                return null;
            }

            return {
                id:
                    typeof service.id ===
                        "string"
                        ? service.id
                        : "",

                name:
                    typeof service.name ===
                        "string"
                        ? service.name.trim()
                        : "",

                description:
                    typeof service.description ===
                        "string"
                        ? service.description.trim()
                        : "",

                price:
                    service.price !==
                        undefined &&
                    service.price !==
                        null
                        ? String(
                              service.price
                          )
                        : "",

                image:
                    typeof service.image ===
                        "string"
                        ? service.image
                        : "",
            };
        })
        .filter(
            (service) =>
                service &&
                service.name
        );
}

/*
 * --------------------------------------------------
 * CATEGORY
 * --------------------------------------------------
 */

function getCategory(
    categoryId
) {
    const normalizedId =
        normalizeString(
            categoryId
        );

    if (!normalizedId) {
        return null;
    }

    const category =
        categories.find(
            (item) =>
                item.id ===
                normalizedId
        );

    if (!category) {
        return null;
    }

    return {
        id: category.id,

        name:
            normalizeString(
                category.name
            ),
    };
}

/*
 * --------------------------------------------------
 * SERIALIZERS
 * --------------------------------------------------
 */

function serializeProfile(
    profile
) {
    if (!profile) {
        return null;
    }

    return {
        id:
            normalizeString(
                profile.id ||
                    profile.uid
            ),

        uid:
            normalizeString(
                profile.uid
            ),

        username:
            normalizeString(
                profile.username
            ),

        displayName:
            normalizeString(
                profile.displayName
            ),

        email:
            normalizeString(
                profile.email
            ),

        role:
            normalizeString(
                profile.role
            ),

        categoryId:
            normalizeString(
                profile.categoryId
            ),

        category:
            normalizeString(
                profile.category
            ),

        province:
            normalizeString(
                profile.province
            ),

        district:
            normalizeString(
                profile.district
            ),

        bio:
            normalizeString(
                profile.bio
            ),

        phone:
            normalizeString(
                profile.phone
            ),

        whatsapp:
            normalizeString(
                profile.whatsapp
            ),

        available:
            normalizeBoolean(
                profile.available
            ),

        avatar:
            typeof profile.avatar ===
                "string"
                ? profile.avatar
                : null,

        skills:
            normalizeStringArray(
                profile.skills
            ),

        services:
            normalizeServices(
                profile.services
            ),

        verified:
            normalizeBoolean(
                profile.verified
            ),

        likes:
            normalizeNumber(
                profile.likes
            ),

        workCount:
            normalizeNumber(
                profile.workCount
            ),
    };
}

function serializePublicProfile(
    profile
) {
    if (!profile) {
        return null;
    }

    return {
        id:
            normalizeString(
                profile.id ||
                    profile.uid
            ),

        uid:
            normalizeString(
                profile.uid
            ),

        username:
            normalizeString(
                profile.username
            ),

        displayName:
            normalizeString(
                profile.displayName
            ),

        role:
            normalizeString(
                profile.role
            ),

        categoryId:
            normalizeString(
                profile.categoryId
            ),

        category:
            normalizeString(
                profile.category
            ),

        province:
            normalizeString(
                profile.province
            ),

        district:
            normalizeString(
                profile.district
            ),

        bio:
            normalizeString(
                profile.bio
            ),

        phone:
            normalizeString(
                profile.phone
            ),

        whatsapp:
            normalizeString(
                profile.whatsapp
            ),

        available:
            normalizeBoolean(
                profile.available
            ),

        avatar:
            typeof profile.avatar ===
                "string"
                ? profile.avatar
                : null,

        skills:
            normalizeStringArray(
                profile.skills
            ),

        services:
            normalizeServices(
                profile.services
            ),

        verified:
            normalizeBoolean(
                profile.verified
            ),

        likes:
            normalizeNumber(
                profile.likes
            ),

        workCount:
            normalizeNumber(
                profile.workCount
            ),
    };
}

function serializeUsernameRecord(
    profile
) {
    if (!profile) {
        return null;
    }

    return {
        id:
            normalizeString(
                profile.id ||
                    profile.uid
            ),

        uid:
            normalizeString(
                profile.uid
            ),

        username:
            normalizeString(
                profile.username
            ),
    };
}

/*
 * --------------------------------------------------
 * CREATE PROFILE
 * --------------------------------------------------
 */

export async function createProfile(
    profileData
) {
    const user =
        getCurrentUser();

    const username =
        usernameSchema.parse(
            profileData?.username
        );

    const categoryId =
        normalizeString(
            profileData?.categoryId
        );

    if (!categoryId) {
        throw new Error(
            "CATEGORY_REQUIRED"
        );
    }

    const category =
        getCategory(
            categoryId
        );

    if (!category) {
        throw new Error(
            "CATEGORY_NOT_FOUND"
        );
    }

    const existingProfile =
        getTalentById(
            user.uid
        );

    /*
     * Our test user already has a
     * generated profile.
     *
     * This prevents accidentally
     * creating a duplicate profile.
     */

    if (existingProfile) {
        throw new Error(
            "PROFILE_EXISTS"
        );
    }

    const usernameExists =
        getTalentByUsername(
            username
        );

    if (usernameExists) {
        throw new Error(
            "USERNAME_TAKEN"
        );
    }

    const newProfile = {
        id: user.uid,

        uid: user.uid,

        username,

        displayName:
            normalizeString(
                user.displayName
            ),

        email:
            normalizeString(
                user.email
            ),

        role:
            normalizeString(
                profileData?.role
            ),

        categoryId:
            category.id,

        category:
            category.name,

        province:
            normalizeString(
                profileData?.province
            ),

        district:
            normalizeString(
                profileData?.district
            ),

        bio:
            normalizeString(
                profileData?.bio
            ),

        phone:
            normalizeString(
                profileData?.phone
            ),

        whatsapp:
            normalizeString(
                profileData?.whatsapp
            ),

        available:
            normalizeBoolean(
                profileData?.available
            ),

        avatar:
            typeof profileData?.avatar ===
                "string"
                ? profileData.avatar
                : null,

        skills:
            normalizeStringArray(
                profileData?.skills
            ),

        services:
            normalizeServices(
                profileData?.services
            ),

        verified: false,

        likes: 0,

        workCount: 0,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),
    };

    talents.push(
        newProfile
    );

    category.totalTalents =
        normalizeNumber(
            category.totalTalents
        ) + 1;

    return serializeProfile(
        newProfile
    );
}

/*
 * --------------------------------------------------
 * GET MY PROFILE
 * --------------------------------------------------
 */

export async function getMyProfile() {
    const user =
        getCurrentUser();

    const profile =
        getTalentById(
            user.uid
        );

    return serializeProfile(
        profile
    );
}

/*
 * --------------------------------------------------
 * GET PROFILE BY UID
 * --------------------------------------------------
 */

export async function getProfileByUid(
    uid
) {
    const normalizedUid =
        normalizeString(
            uid
        );

    if (!normalizedUid) {
        return null;
    }

    const profile =
        getTalentById(
            normalizedUid
        );

    return serializeProfile(
        profile
    );
}

/*
 * --------------------------------------------------
 * GET PROFILE BY USERNAME
 * --------------------------------------------------
 */

export async function getProfileByUsername(
    username
) {
    const normalizedUsername =
        usernameSchema.parse(
            username
        );

    const profile =
        getTalentByUsername(
            normalizedUsername
        );

    return serializePublicProfile(
        profile
    );
}

/*
 * --------------------------------------------------
 * GET USERNAME RECORD
 * --------------------------------------------------
 */

export async function getUsernameRecord(
    username
) {
    const normalizedUsername =
        usernameSchema.parse(
            username
        );

    const profile =
        getTalentByUsername(
            normalizedUsername
        );

    return serializeUsernameRecord(
        profile
    );
}

/*
 * --------------------------------------------------
 * CHECK USERNAME
 * --------------------------------------------------
 */

export async function isUsernameAvailable(
    username
) {
    const normalizedUsername =
        usernameSchema.parse(
            username
        );

    const profile =
        getTalentByUsername(
            normalizedUsername
        );

    return !profile;
}

/*
 * --------------------------------------------------
 * BUILD PROFILE UPDATES
 * --------------------------------------------------
 */

function buildProfileUpdates(
    updates,
    category
) {
    const clean = {};

    if (
        updates.role !==
        undefined
    ) {
        clean.role =
            normalizeString(
                updates.role
            );
    }

    if (
        updates.province !==
        undefined
    ) {
        clean.province =
            normalizeString(
                updates.province
            );
    }

    if (
        updates.district !==
        undefined
    ) {
        clean.district =
            normalizeString(
                updates.district
            );
    }

    if (
        updates.bio !==
        undefined
    ) {
        clean.bio =
            normalizeString(
                updates.bio
            );
    }

    if (
        updates.phone !==
        undefined
    ) {
        clean.phone =
            normalizeString(
                updates.phone
            );
    }

    if (
        updates.whatsapp !==
        undefined
    ) {
        clean.whatsapp =
            normalizeString(
                updates.whatsapp
            );
    }

    if (
        updates.available !==
        undefined
    ) {
        clean.available =
            updates.available === true;
    }

    if (
        updates.avatar !==
        undefined
    ) {
        clean.avatar =
            typeof updates.avatar ===
                "string"
                ? updates.avatar
                : null;
    }

    if (
        updates.skills !==
        undefined
    ) {
        clean.skills =
            normalizeStringArray(
                updates.skills
            );
    }

    if (
        updates.services !==
        undefined
    ) {
        clean.services =
            normalizeServices(
                updates.services
            );
    }

    if (category) {
        clean.categoryId =
            category.id;

        clean.category =
            category.name;
    }

    clean.updatedAt =
        new Date().toISOString();

    return clean;
}

/*
 * --------------------------------------------------
 * UPDATE PROFILE
 * --------------------------------------------------
 */

export async function updateProfile(
    updates
) {
    const user =
        getCurrentUser();

    const validation =
        profileUpdateSchema.safeParse(
            updates ?? {}
        );

    if (!validation.success) {
        throw new Error(
            "INVALID_PROFILE_DATA"
        );
    }

    const data =
        validation.data;

    const profile =
        getTalentById(
            user.uid
        );

    if (!profile) {
        throw new Error(
            "PROFILE_NOT_FOUND"
        );
    }

    const requestedUsername =
        data.username ??
        profile.username;

    const usernameChanged =
        requestedUsername !==
        profile.username;

    const requestedCategoryId =
        data.categoryId ??
        profile.categoryId;

    const categoryChanged =
        requestedCategoryId !==
        profile.categoryId;

    let newCategory = null;

    if (categoryChanged) {
        newCategory =
            getCategory(
                requestedCategoryId
            );

        if (!newCategory) {
            throw new Error(
                "CATEGORY_NOT_FOUND"
            );
        }
    }

    /*
     * Check username uniqueness.
     */

    if (usernameChanged) {
        const usernameOwner =
            getTalentByUsername(
                requestedUsername
            );

        if (
            usernameOwner &&
            usernameOwner.uid !==
                user.uid
        ) {
            throw new Error(
                "USERNAME_TAKEN"
            );
        }
    }

    /*
     * Update category counts.
     */

    if (categoryChanged) {
        const oldCategory =
            getCategory(
                profile.categoryId
            );

        if (oldCategory) {
            oldCategory.totalTalents =
                Math.max(
                    0,
                    normalizeNumber(
                        oldCategory.totalTalents
                    ) - 1
                );
        }

        newCategory.totalTalents =
            normalizeNumber(
                newCategory.totalTalents
            ) + 1;
    }

    const cleanUpdates =
        buildProfileUpdates(
            data,
            categoryChanged
                ? newCategory
                : null
        );

    Object.assign(
        profile,
        cleanUpdates
    );

    if (usernameChanged) {
        profile.username =
            requestedUsername;
    }

    return serializeProfile(
        profile
    );
}

/*
 * --------------------------------------------------
 * UPDATE USERNAME
 * --------------------------------------------------
 */

export async function updateUsername(
    username
) {
    return updateProfile({
        username,
    });
}

/*
 * --------------------------------------------------
 * UPDATE PROFILE + USERNAME
 * --------------------------------------------------
 */

export async function updateProfileWithUsername(
    updates
) {
    return updateProfile(
        updates
    );
}

/*
 * --------------------------------------------------
 * DELETE PROFILE
 * --------------------------------------------------
 */

export async function deleteProfile() {
    const user =
        getCurrentUser();

    const profile =
        getTalentById(
            user.uid
        );

    if (!profile) {
        throw new Error(
            "PROFILE_NOT_FOUND"
        );
    }

    const category =
        getCategory(
            profile.categoryId
        );

    if (category) {
        category.totalTalents =
            Math.max(
                0,
                normalizeNumber(
                    category.totalTalents
                ) - 1
            );
    }

    const profileIndex =
        talents.findIndex(
            (talent) =>
                talent.uid ===
                user.uid
        );

    if (
        profileIndex === -1
    ) {
        throw new Error(
            "PROFILE_NOT_FOUND"
        );
    }

    talents.splice(
        profileIndex,
        1
    );

    return {
        success: true,
    };
}

/*
 * --------------------------------------------------
 * EXPORTS
 * --------------------------------------------------
 */

export {
    serializeProfile,
    serializePublicProfile,
    serializeUsernameRecord,
};