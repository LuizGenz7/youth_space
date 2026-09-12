import { z } from "zod";

import {
    cacheLife,
    cacheTag,
    revalidateTag,
} from "next/cache";

import {
    doc,
    getDoc,
    increment,
    runTransaction,
    serverTimestamp,
} from "firebase/firestore";

import {
    getServerFirebase,
    getPublicServerFirebase,
} from "@/lib/server";

import {
    getCategoryById,
} from "@/data/categories";

/*
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

const PROFILES_COLLECTION =
    "talents";

const USERNAMES_COLLECTION =
    "usernames";

const CATEGORIES_COLLECTION =
    "categories";

const USERNAME_REGEX =
    /^[a-z0-9_]{3,30}$/;

/*
 * --------------------------------------------------
 * CACHE TAGS
 * --------------------------------------------------
 */

const PROFILES_CACHE_TAG =
    "profiles";

const TALENTS_CACHE_TAG =
    "talents";

const CATEGORIES_CACHE_TAG =
    "categories";

function profileCacheTag(
    uid
) {
    return `profile:${String(
        uid
    ).trim()}`;
}

function talentCacheTag(
    uid
) {
    return `talent:${String(
        uid
    ).trim()}`;
}

function usernameCacheTag(
    username
) {
    return `username:${String(
        username
    )
        .trim()
        .toLowerCase()}`;
}

function profileUsernameCacheTag(
    username
) {
    return `profile-username:${String(
        username
    )
        .trim()
        .toLowerCase()}`;
}

function usernameAvailabilityCacheTag(
    username
) {
    return `username-availability:${String(
        username
    )
        .trim()
        .toLowerCase()}`;
}

function categoryCacheTag(
    categoryId
) {
    return `category:${String(
        categoryId
    )
        .trim()
        .toLowerCase()}`;
}

function categoryTalentsCacheTag(
    categoryId
) {
    return `category-talents:${String(
        categoryId
    )
        .trim()
        .toLowerCase()}`;
}

/*
 * --------------------------------------------------
 * CACHE INVALIDATION
 * --------------------------------------------------
 */

/**
 * Invalidate everything directly related
 * to one profile.
 */
function invalidateProfileCache(
    uid
) {
    const normalizedUid =
        normalizeString(uid);

    if (!normalizedUid) {
        return;
    }

    revalidateTag(
        PROFILES_CACHE_TAG,
        "max"
    );

    revalidateTag(
        TALENTS_CACHE_TAG,
        "max"
    );

    revalidateTag(
        profileCacheTag(
            normalizedUid
        ),
        "max"
    );

    revalidateTag(
        talentCacheTag(
            normalizedUid
        ),
        "max"
    );
}

/**
 * Invalidate username-related caches.
 */
function invalidateUsernameCache(
    username
) {
    const normalizedUsername =
        normalizeUsername(
            username
        );

    if (!normalizedUsername) {
        return;
    }

    revalidateTag(
        usernameCacheTag(
            normalizedUsername
        ),
        "max"
    );

    revalidateTag(
        profileUsernameCacheTag(
            normalizedUsername
        ),
        "max"
    );

    revalidateTag(
        usernameAvailabilityCacheTag(
            normalizedUsername
        ),
        "max"
    );
}

/**
 * Invalidate one category and its
 * category talent listing.
 */
function invalidateCategoryCache(
    categoryId
) {
    const normalizedCategoryId =
        normalizeString(
            categoryId
        );

    if (!normalizedCategoryId) {
        return;
    }

    revalidateTag(
        categoryCacheTag(
            normalizedCategoryId
        ),
        "max"
    );

    revalidateTag(
        categoryTalentsCacheTag(
            normalizedCategoryId
        ),
        "max"
    );

    /*
     * Category counters are part of:
     *
     * getCategories()
     * getTopCategories()
     *
     * Therefore their collection cache
     * must also be marked stale.
     */
    revalidateTag(
        CATEGORIES_CACHE_TAG,
        "max"
    );
}

/*
 * --------------------------------------------------
 * VALIDATION
 * --------------------------------------------------
 */

const usernameSchema =
    z
        .string()
        .trim()
        .toLowerCase()
        .regex(
            USERNAME_REGEX,
            "Username must be 3-30 characters and contain only lowercase letters, numbers, and underscores."
        );

const profileUpdateSchema =
    z
        .object({
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
        })
        .strict();

/*
 * --------------------------------------------------
 * NORMALIZATION
 * --------------------------------------------------
 */

function normalizeString(
    value
) {
    if (
        typeof value !==
        "string"
    ) {
        return "";
    }

    return value.trim();
}

function normalizeUsername(
    value
) {
    if (
        typeof value !==
        "string"
    ) {
        return "";
    }

    return value
        .trim()
        .toLowerCase();
}

function normalizeStringArray(
    value
) {
    if (
        !Array.isArray(value)
    ) {
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

    return Number.isFinite(
        number
    )
        ? number
        : 0;
}

function normalizeServices(
    value
) {
    if (
        !Array.isArray(value)
    ) {
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
                        ? service.id.trim()
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
                        ).trim()
                        : "",

                image:
                    typeof service.image ===
                    "string"
                        ? service.image.trim()
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

async function getCategory(
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
        await getCategoryById(
            normalizedId
        );

    if (!category) {
        return null;
    }

    return {
        id:
            normalizeString(
                category.id
            ),

        name:
            normalizeString(
                category.name
            ),
    };
}

/*
 * --------------------------------------------------
 * AUTH
 * --------------------------------------------------
 */

async function getCurrentUser() {
    const {
        auth,
    } =
        await getServerFirebase();

    await auth.authStateReady();

    const user =
        auth.currentUser;

    if (!user) {
        throw new Error(
            "AUTH_REQUIRED"
        );
    }

    return {
        uid:
            user.uid,

        displayName:
            normalizeString(
                user.displayName
            ),

        email:
            normalizeString(
                user.email
            ),

        photoURL:
            user.photoURL ||
            null,

        emailVerified:
            user.emailVerified ===
            true,
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
    record
) {
    if (!record) {
        return null;
    }

    return {
        id:
            normalizeString(
                record.id ||
                    record.username
            ),

        uid:
            normalizeString(
                record.uid
            ),

        username:
            normalizeString(
                record.username
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
        await getCurrentUser();

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
        await getCategory(
            categoryId
        );

    if (!category) {
        throw new Error(
            "CATEGORY_NOT_FOUND"
        );
    }

    const {
        db,
    } =
        await getServerFirebase();

    const profileRef =
        doc(
            db,
            PROFILES_COLLECTION,
            user.uid
        );

    const usernameRef =
        doc(
            db,
            USERNAMES_COLLECTION,
            username
        );

    const categoryRef =
        doc(
            db,
            CATEGORIES_COLLECTION,
            category.id
        );

    const profile =
        await runTransaction(
            db,
            async (transaction) => {
                /*
                 * READS FIRST
                 */

                const profileSnapshot =
                    await transaction.get(
                        profileRef
                    );

                if (
                    profileSnapshot.exists()
                ) {
                    throw new Error(
                        "PROFILE_EXISTS"
                    );
                }

                const usernameSnapshot =
                    await transaction.get(
                        usernameRef
                    );

                if (
                    usernameSnapshot.exists()
                ) {
                    throw new Error(
                        "USERNAME_TAKEN"
                    );
                }

                const categorySnapshot =
                    await transaction.get(
                        categoryRef
                    );

                if (
                    !categorySnapshot.exists()
                ) {
                    throw new Error(
                        "CATEGORY_NOT_FOUND"
                    );
                }

                const newProfile = {
                    id:
                        user.uid,

                    uid:
                        user.uid,

                    username,

                    displayName:
                        user.displayName,

                    email:
                        user.email,

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
                            ? profileData.avatar.trim()
                            : null,

                    skills:
                        normalizeStringArray(
                            profileData?.skills
                        ),

                    services:
                        normalizeServices(
                            profileData?.services
                        ),

                    verified:
                        false,

                    likes:
                        0,

                    workCount:
                        0,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),
                };

                const usernameRecord = {
                    id:
                        username,

                    uid:
                        user.uid,

                    username,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),
                };

                /*
                 * WRITES
                 */

                transaction.set(
                    profileRef,
                    newProfile
                );

                transaction.set(
                    usernameRef,
                    usernameRecord
                );

                transaction.update(
                    categoryRef,
                    {
                        totalTalents:
                            increment(1),

                        updatedAt:
                            serverTimestamp(),
                    }
                );

                return newProfile;
            }
        );

    /*
     * CACHE INVALIDATION
     *
     * Only the affected profile,
     * username and category are touched.
     */

    invalidateProfileCache(
        user.uid
    );

    invalidateUsernameCache(
        username
    );

    invalidateCategoryCache(
        category.id
    );

    return serializeProfile(
        profile
    );
}

/*
 * --------------------------------------------------
 * GET MY PROFILE
 * --------------------------------------------------
 */

export async function getMyProfile() {
    const user =
        await getCurrentUser();

    const {
        db,
    } =
        await getServerFirebase();

    const profileRef =
        doc(
            db,
            PROFILES_COLLECTION,
            user.uid
        );

    const profileSnapshot =
        await getDoc(
            profileRef
        );

    if (
        !profileSnapshot.exists()
    ) {
        return null;
    }

    return serializeProfile({
        id:
            profileSnapshot.id,

        ...profileSnapshot.data(),
    });
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

    const {
        db,
    } =
        await getServerFirebase();

    const profileRef =
        doc(
            db,
            PROFILES_COLLECTION,
            normalizedUid
        );

    const profileSnapshot =
        await getDoc(
            profileRef
        );

    if (
        !profileSnapshot.exists()
    ) {
        return null;
    }

    return serializeProfile({
        id:
            profileSnapshot.id,

        ...profileSnapshot.data(),
    });
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

    return getCachedProfileByUsername(
        normalizedUsername
    );
}

async function getCachedProfileByUsername(
    username
) {
    "use cache";

    cacheLife("hours");

    cacheTag(
        PROFILES_CACHE_TAG,
        profileUsernameCacheTag(
            username
        ),
        usernameCacheTag(
            username
        )
    );

    const {
        db,
    } =
        getPublicServerFirebase();

    const usernameRef =
        doc(
            db,
            USERNAMES_COLLECTION,
            username
        );

    const usernameSnapshot =
        await getDoc(
            usernameRef
        );

    if (
        !usernameSnapshot.exists()
    ) {
        return null;
    }

    const usernameData =
        usernameSnapshot.data();

    const uid =
        normalizeString(
            usernameData?.uid
        );

    if (!uid) {
        return null;
    }

    const profileRef =
        doc(
            db,
            PROFILES_COLLECTION,
            uid
        );

    const profileSnapshot =
        await getDoc(
            profileRef
        );

    if (
        !profileSnapshot.exists()
    ) {
        return null;
    }

    /*
     * IMPORTANT:
     *
     * This username cache is also tagged
     * with the user's UID.
     *
     * Therefore changing the profile
     * invalidates the public username page.
     */

    cacheTag(
        profileCacheTag(uid),
        talentCacheTag(uid)
    );

    return serializePublicProfile({
        id:
            profileSnapshot.id,

        ...profileSnapshot.data(),
    });
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

    return getCachedUsernameRecord(
        normalizedUsername
    );
}

async function getCachedUsernameRecord(
    username
) {
    "use cache";

    cacheLife("minutes");

    cacheTag(
        PROFILES_CACHE_TAG,
        usernameCacheTag(
            username
        )
    );

    const {
        db,
    } =
        getPublicServerFirebase();

    const usernameRef =
        doc(
            db,
            USERNAMES_COLLECTION,
            username
        );

    const snapshot =
        await getDoc(
            usernameRef
        );

    if (
        !snapshot.exists()
    ) {
        return null;
    }

    return serializeUsernameRecord({
        id:
            snapshot.id,

        ...snapshot.data(),
    });
}

/*
 * --------------------------------------------------
 * CHECK USERNAME AVAILABILITY
 * --------------------------------------------------
 */

export async function isUsernameAvailable(
    username
) {
    const normalizedUsername =
        usernameSchema.parse(
            username
        );

    return checkCachedUsernameAvailability(
        normalizedUsername
    );
}

async function checkCachedUsernameAvailability(
    username
) {
    "use cache";

    cacheLife("seconds");

    cacheTag(
        PROFILES_CACHE_TAG,
        usernameCacheTag(
            username
        ),
        usernameAvailabilityCacheTag(
            username
        )
    );

    const {
        db,
    } =
        getPublicServerFirebase();

    const usernameRef =
        doc(
            db,
            USERNAMES_COLLECTION,
            username
        );

    const snapshot =
        await getDoc(
            usernameRef
        );

    return !snapshot.exists();
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
            updates.available ===
            true;
    }

    if (
        updates.avatar !==
        undefined
    ) {
        clean.avatar =
            typeof updates.avatar ===
                "string"
                ? updates.avatar.trim()
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
        serverTimestamp();

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
        await getCurrentUser();

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

    const {
        db,
    } =
        await getServerFirebase();

    const profileRef =
        doc(
            db,
            PROFILES_COLLECTION,
            user.uid
        );

    let affectedCategories = [];

    let oldUsername = "";

    let newUsername = "";

    await runTransaction(
        db,
        async (transaction) => {
            /*
             * ------------------------------------------------
             * READ PROFILE
             * ------------------------------------------------
             */

            const profileSnapshot =
                await transaction.get(
                    profileRef
                );

            if (
                !profileSnapshot.exists()
            ) {
                throw new Error(
                    "PROFILE_NOT_FOUND"
                );
            }

            const profile =
                profileSnapshot.data();

            const currentUsername =
                usernameSchema.safeParse(
                    profile?.username
                ).success
                    ? profile.username
                    : "";

            const requestedUsername =
                data.username ??
                currentUsername;

            const usernameChanged =
                requestedUsername !==
                currentUsername;

            oldUsername =
                currentUsername;

            newUsername =
                requestedUsername;

            const currentCategoryId =
                normalizeString(
                    profile?.categoryId
                );

            const requestedCategoryId =
                data.categoryId ??
                currentCategoryId;

            const categoryChanged =
                requestedCategoryId !==
                currentCategoryId;

            let oldCategoryRef =
                null;

            let newCategoryRef =
                null;

            let newCategory =
                null;

            /*
             * ------------------------------------------------
             * CATEGORY READS
             * ------------------------------------------------
             */

            if (
                categoryChanged
            ) {
                if (
                    !currentCategoryId
                ) {
                    throw new Error(
                        "CURRENT_CATEGORY_NOT_FOUND"
                    );
                }

                /*
                 * Read the requested category
                 * directly through Firestore.
                 *
                 * This avoids using a potentially
                 * stale category cache for the
                 * transaction's source of truth.
                 */

                newCategoryRef =
                    doc(
                        db,
                        CATEGORIES_COLLECTION,
                        requestedCategoryId
                    );

                oldCategoryRef =
                    doc(
                        db,
                        CATEGORIES_COLLECTION,
                        currentCategoryId
                    );

                const [
                    oldCategorySnapshot,
                    newCategorySnapshot,
                ] =
                    await Promise.all([
                        transaction.get(
                            oldCategoryRef
                        ),

                        transaction.get(
                            newCategoryRef
                        ),
                    ]);

                if (
                    !oldCategorySnapshot.exists()
                ) {
                    throw new Error(
                        "CURRENT_CATEGORY_NOT_FOUND"
                    );
                }

                if (
                    !newCategorySnapshot.exists()
                ) {
                    throw new Error(
                        "CATEGORY_NOT_FOUND"
                    );
                }

                const categoryData =
                    newCategorySnapshot.data();

                newCategory = {
                    id:
                        newCategorySnapshot.id,

                    name:
                        normalizeString(
                            categoryData?.name
                        ),
                };

                affectedCategories = [
                    currentCategoryId,
                    requestedCategoryId,
                ];
            }

            /*
             * ------------------------------------------------
             * USERNAME READS
             * ------------------------------------------------
             */

            let oldUsernameRef =
                null;

            let newUsernameRef =
                null;

            let oldUsernameSnapshot =
                null;

            let newUsernameSnapshot =
                null;

            if (
                usernameChanged
            ) {
                newUsernameRef =
                    doc(
                        db,
                        USERNAMES_COLLECTION,
                        requestedUsername
                    );

                newUsernameSnapshot =
                    await transaction.get(
                        newUsernameRef
                    );

                if (
                    newUsernameSnapshot.exists()
                ) {
                    const ownerUid =
                        normalizeString(
                            newUsernameSnapshot
                                .data()
                                ?.uid
                        );

                    if (
                        ownerUid !==
                        user.uid
                    ) {
                        throw new Error(
                            "USERNAME_TAKEN"
                        );
                    }
                }

                if (
                    currentUsername
                ) {
                    oldUsernameRef =
                        doc(
                            db,
                            USERNAMES_COLLECTION,
                            currentUsername
                        );

                    oldUsernameSnapshot =
                        await transaction.get(
                            oldUsernameRef
                        );
                }
            }

            /*
             * ------------------------------------------------
             * PROFILE UPDATE
             * ------------------------------------------------
             */

            const cleanUpdates =
                buildProfileUpdates(
                    data,
                    categoryChanged
                        ? newCategory
                        : null
                );

            if (
                usernameChanged
            ) {
                cleanUpdates.username =
                    requestedUsername;
            }

            transaction.update(
                profileRef,
                cleanUpdates
            );

            /*
             * ------------------------------------------------
             * NEW USERNAME
             * ------------------------------------------------
             */

            if (
                usernameChanged &&
                newUsernameRef
            ) {
                const usernameRecord = {
                    id:
                        requestedUsername,

                    uid:
                        user.uid,

                    username:
                        requestedUsername,

                    updatedAt:
                        serverTimestamp(),
                };

                if (
                    newUsernameSnapshot?.exists()
                ) {
                    const createdAt =
                        newUsernameSnapshot
                            .data()
                            ?.createdAt;

                    if (
                        createdAt
                    ) {
                        usernameRecord.createdAt =
                            createdAt;
                    }
                } else {
                    usernameRecord.createdAt =
                        serverTimestamp();
                }

                transaction.set(
                    newUsernameRef,
                    usernameRecord
                );
            }

            /*
             * ------------------------------------------------
             * OLD USERNAME
             * ------------------------------------------------
             */

            if (
                usernameChanged &&
                oldUsernameRef &&
                oldUsernameSnapshot?.exists()
            ) {
                const ownerUid =
                    normalizeString(
                        oldUsernameSnapshot
                            .data()
                            ?.uid
                    );

                if (
                    ownerUid ===
                    user.uid
                ) {
                    transaction.delete(
                        oldUsernameRef
                    );
                }
            }

            /*
             * ------------------------------------------------
             * CATEGORY COUNTERS
             * ------------------------------------------------
             */

            if (
                categoryChanged &&
                oldCategoryRef &&
                newCategoryRef
            ) {
                transaction.update(
                    oldCategoryRef,
                    {
                        totalTalents:
                            increment(-1),

                        updatedAt:
                            serverTimestamp(),
                    }
                );

                transaction.update(
                    newCategoryRef,
                    {
                        totalTalents:
                            increment(1),

                        updatedAt:
                            serverTimestamp(),
                    }
                );
            }
        }
    );

    /*
     * --------------------------------------------------
     * CACHE INVALIDATION
     * --------------------------------------------------
     */

    /*
     * The profile itself changed.
     */
    invalidateProfileCache(
        user.uid
    );

    /*
     * If username changed:
     *
     * old URL → stale
     * new URL → fresh on next request
     */
    if (
        oldUsername
    ) {
        invalidateUsernameCache(
            oldUsername
        );
    }

    if (
        newUsername
    ) {
        invalidateUsernameCache(
            newUsername
        );
    }

    /*
     * If category changed:
     *
     * old category count/list → stale
     * new category count/list → stale
     */
    for (
        const categoryId of
        affectedCategories
    ) {
        invalidateCategoryCache(
            categoryId
        );
    }

    /*
     * Return the actual updated profile.
     */

    const updatedSnapshot =
        await getDoc(
            profileRef
        );

    if (
        !updatedSnapshot.exists()
    ) {
        throw new Error(
            "PROFILE_UPDATE_FAILED"
        );
    }

    return serializeProfile({
        id:
            updatedSnapshot.id,

        ...updatedSnapshot.data(),
    });
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
        await getCurrentUser();

    const {
        db,
    } =
        await getServerFirebase();

    const profileRef =
        doc(
            db,
            PROFILES_COLLECTION,
            user.uid
        );

    let deletedUsername = "";
    let deletedCategory = "";

    await runTransaction(
        db,
        async (transaction) => {
            /*
             * ------------------------------------------------
             * PROFILE
             * ------------------------------------------------
             */

            const profileSnapshot =
                await transaction.get(
                    profileRef
                );

            if (
                !profileSnapshot.exists()
            ) {
                throw new Error(
                    "PROFILE_NOT_FOUND"
                );
            }

            const profile =
                profileSnapshot.data();

            const username =
                usernameSchema.safeParse(
                    profile?.username
                ).success
                    ? profile.username
                    : "";

            const categoryId =
                normalizeString(
                    profile?.categoryId
                );

            deletedUsername =
                username;

            deletedCategory =
                categoryId;

            /*
             * ------------------------------------------------
             * USERNAME
             * ------------------------------------------------
             */

            const usernameRef =
                username
                    ? doc(
                        db,
                        USERNAMES_COLLECTION,
                        username
                    )
                    : null;

            let usernameSnapshot =
                null;

            if (
                usernameRef
            ) {
                usernameSnapshot =
                    await transaction.get(
                        usernameRef
                    );
            }

            /*
             * ------------------------------------------------
             * CATEGORY
             * ------------------------------------------------
             */

            let categoryRef =
                null;

            let categorySnapshot =
                null;

            if (
                categoryId
            ) {
                categoryRef =
                    doc(
                        db,
                        CATEGORIES_COLLECTION,
                        categoryId
                    );

                categorySnapshot =
                    await transaction.get(
                        categoryRef
                    );

                if (
                    !categorySnapshot.exists()
                ) {
                    throw new Error(
                        "CATEGORY_NOT_FOUND"
                    );
                }
            }

            /*
             * ------------------------------------------------
             * DELETE PROFILE
             * ------------------------------------------------
             */

            transaction.delete(
                profileRef
            );

            /*
             * ------------------------------------------------
             * DELETE USERNAME
             * ------------------------------------------------
             */

            if (
                usernameRef &&
                usernameSnapshot?.exists()
            ) {
                const ownerUid =
                    normalizeString(
                        usernameSnapshot
                            .data()
                            ?.uid
                    );

                if (
                    ownerUid ===
                    user.uid
                ) {
                    transaction.delete(
                        usernameRef
                    );
                }
            }

            /*
             * ------------------------------------------------
             * CATEGORY -1
             * ------------------------------------------------
             */

            if (
                categoryRef &&
                categorySnapshot?.exists()
            ) {
                transaction.update(
                    categoryRef,
                    {
                        totalTalents:
                            increment(-1),

                        updatedAt:
                            serverTimestamp(),
                    }
                );
            }
        }
    );

    /*
     * --------------------------------------------------
     * CACHE INVALIDATION
     * --------------------------------------------------
     */

    invalidateProfileCache(
        user.uid
    );

    if (
        deletedUsername
    ) {
        invalidateUsernameCache(
            deletedUsername
        );
    }

    if (
        deletedCategory
    ) {
        invalidateCategoryCache(
            deletedCategory
        );
    }

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