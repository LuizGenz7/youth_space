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

import { getCategoryById } from "@/data/categories";

/* ========================================================================== */
/* Constants                                                                  */
/* ========================================================================== */

const PROFILES_COLLECTION = "talents";
const USERNAMES_COLLECTION = "usernames";
const CATEGORIES_COLLECTION = "categories";

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

const DISPLAY_NAME_MIN = 2;
const DISPLAY_NAME_MAX = 80;

/* ========================================================================== */
/* Cache Tags                                                                 */
/* ========================================================================== */

const PROFILES_CACHE_TAG = "profiles";
const TALENTS_CACHE_TAG = "talents";
const CATEGORIES_CACHE_TAG = "categories";

function profileCacheTag(uid) {
    const value = normalizeString(uid);
    return value ? `profile:${value}` : "";
}

function talentCacheTag(uid) {
    const value = normalizeString(uid);
    return value ? `talent:${value}` : "";
}

function usernameCacheTag(username) {
    const value = normalizeUsername(username);
    return value ? `username:${value}` : "";
}

function profileUsernameCacheTag(username) {
    const value = normalizeUsername(username);
    return value ? `profile-username:${value}` : "";
}

function usernameAvailabilityCacheTag(username) {
    const value = normalizeUsername(username);
    return value
        ? `username-availability:${value}`
        : "";
}

function categoryCacheTag(categoryId) {
    const value = normalizeString(categoryId);
    return value ? `category:${value}` : "";
}

function categoryTalentsCacheTag(categoryId) {
    const value = normalizeString(categoryId);
    return value ? `category-talents:${value}` : "";
}

/* ========================================================================== */
/* Cache Invalidation                                                         */
/* ========================================================================== */

function invalidateProfileCache(uid) {
    const value = normalizeString(uid);

    if (!value) {
        return;
    }

    revalidateTag(PROFILES_CACHE_TAG, "max");
    revalidateTag(TALENTS_CACHE_TAG, "max");

    const profileTag = profileCacheTag(value);
    const talentTag = talentCacheTag(value);

    if (profileTag) {
        revalidateTag(profileTag, "max");
    }

    if (talentTag) {
        revalidateTag(talentTag, "max");
    }
}

function invalidateUsernameCache(username) {
    const value = normalizeUsername(username);

    if (!value) {
        return;
    }

    const usernameTag = usernameCacheTag(value);
    const profileUsernameTag =
        profileUsernameCacheTag(value);
    const availabilityTag =
        usernameAvailabilityCacheTag(value);

    if (usernameTag) {
        revalidateTag(usernameTag, "max");
    }

    if (profileUsernameTag) {
        revalidateTag(profileUsernameTag, "max");
    }

    if (availabilityTag) {
        revalidateTag(availabilityTag, "max");
    }
}

function invalidateCategoryCache(categoryId) {
    const value = normalizeString(categoryId);

    if (!value) {
        return;
    }

    const categoryTag = categoryCacheTag(value);
    const talentsTag = categoryTalentsCacheTag(value);

    if (categoryTag) {
        revalidateTag(categoryTag, "max");
    }

    if (talentsTag) {
        revalidateTag(talentsTag, "max");
    }

    revalidateTag(CATEGORIES_CACHE_TAG, "max");
}

/* ========================================================================== */
/* Validation                                                                 */
/* ========================================================================== */

const usernameSchema = z
    .string()
    .trim()
    .toLowerCase()
    .regex(
        USERNAME_REGEX,
        "Username must be 3-30 characters and contain only lowercase letters, numbers, and underscores.",
    );

const displayNameSchema = z
    .string()
    .trim()
    .min(DISPLAY_NAME_MIN)
    .max(DISPLAY_NAME_MAX);

const profileUpdateSchema = z
    .object({
        /* Identity */
        displayName: displayNameSchema.optional(),

        username: usernameSchema.optional(),

        /* Professional */
        role: z
            .string()
            .trim()
            .max(100)
            .optional(),

        categoryId: z
            .string()
            .trim()
            .max(100)
            .optional(),

        province: z
            .string()
            .trim()
            .max(100)
            .optional(),

        district: z
            .string()
            .trim()
            .max(100)
            .optional(),

        bio: z
            .string()
            .trim()
            .max(1000)
            .optional(),

        phone: z
            .string()
            .trim()
            .max(30)
            .optional(),

        whatsapp: z
            .string()
            .trim()
            .max(30)
            .optional(),

        available: z
            .boolean()
            .optional(),

        /* Avatar */
        avatar: z
            .string()
            .trim()
            .url()
            .nullable()
            .optional(),

        /* Skills */
        skills: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1)
                    .max(100),
            )
            .max(20)
            .optional(),

        /* Services */
        services: z
            .array(
                z
                    .object({
                        id: z
                            .string()
                            .trim(),

                        name: z
                            .string()
                            .trim()
                            .min(1)
                            .max(150),

                        description: z
                            .string()
                            .trim()
                            .max(1000)
                            .optional()
                            .default(""),

                        price: z
                            .union([
                                z.string(),
                                z.number(),
                            ])
                            .optional()
                            .default(""),

                        image: z
                            .string()
                            .trim()
                            .url()
                            .or(z.literal(""))
                            .optional()
                            .default(""),
                    })
                    .strict(),
            )
            .max(20)
            .optional(),
    })
    .strict();

/* ========================================================================== */
/* Normalization                                                              */
/* ========================================================================== */

function normalizeString(value) {
    return typeof value === "string"
        ? value.trim()
        : "";
}

function normalizeUsername(value) {
    return typeof value === "string"
        ? value.trim().toLowerCase()
        : "";
}

function normalizeStringArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (item) =>
                typeof item === "string",
        )
        .map((item) => item.trim())
        .filter(Boolean);
}

function normalizeBoolean(value) {
    return value === true;
}

function normalizeNumber(value) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}

function normalizeServices(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((service) => {
            if (
                !service ||
                typeof service !== "object" ||
                Array.isArray(service)
            ) {
                return null;
            }

            return {
                id:
                    typeof service.id === "string"
                        ? service.id.trim()
                        : "",

                name:
                    typeof service.name === "string"
                        ? service.name.trim()
                        : "",

                description:
                    typeof service.description ===
                    "string"
                        ? service.description.trim()
                        : "",

                price:
                    service.price !== undefined &&
                    service.price !== null
                        ? String(
                              service.price,
                          ).trim()
                        : "",

                image:
                    typeof service.image === "string"
                        ? service.image.trim()
                        : "",
            };
        })
        .filter(
            (service) =>
                service &&
                service.name,
        );
}

/* ========================================================================== */
/* Category                                                                   */
/* ========================================================================== */

async function getCategory(categoryId) {
    const id = normalizeString(categoryId);

    if (!id) {
        return null;
    }

    const category =
        await getCategoryById(id);

    if (!category) {
        return null;
    }

    return {
        id: normalizeString(category.id),
        name: normalizeString(category.name),
    };
}

/* ========================================================================== */
/* Authentication                                                             */
/* ========================================================================== */

async function getCurrentUser() {
    const { auth } =
        await getServerFirebase();

    await auth.authStateReady();

    const user = auth.currentUser;

    if (!user) {
        throw new Error("AUTH_REQUIRED");
    }

    return {
        uid: user.uid,

        displayName:
            normalizeString(
                user.displayName,
            ),

        email:
            normalizeString(user.email),

        photoURL:
            typeof user.photoURL === "string"
                ? user.photoURL
                : null,

        emailVerified:
            user.emailVerified === true,
    };
}

/* ========================================================================== */
/* Serializers                                                                */
/* ========================================================================== */

function serializeProfile(profile) {
    if (!profile) {
        return null;
    }

    return {
        id: normalizeString(
            profile.id || profile.uid,
        ),

        uid: normalizeString(profile.uid),

        username:
            normalizeUsername(
                profile.username,
            ),

        displayName:
            normalizeString(
                profile.displayName,
            ),

        email:
            normalizeString(profile.email),

        role:
            normalizeString(profile.role),

        categoryId:
            normalizeString(
                profile.categoryId,
            ),

        category:
            normalizeString(
                profile.category,
            ),

        province:
            normalizeString(profile.province),

        district:
            normalizeString(profile.district),

        bio:
            normalizeString(profile.bio),

        phone:
            normalizeString(profile.phone),

        whatsapp:
            normalizeString(profile.whatsapp),

        available:
            normalizeBoolean(
                profile.available,
            ),

        avatar:
            typeof profile.avatar === "string"
                ? profile.avatar
                : null,

        skills:
            normalizeStringArray(
                profile.skills,
            ),

        services:
            normalizeServices(
                profile.services,
            ),

        verified:
            normalizeBoolean(
                profile.verified,
            ),

        likes:
            normalizeNumber(profile.likes),

        workCount:
            normalizeNumber(
                profile.workCount,
            ),
    };
}

function serializePublicProfile(profile) {
    if (!profile) {
        return null;
    }

    const serialized =
        serializeProfile(profile);

    if (!serialized) {
        return null;
    }

    const {
        email,
        ...publicProfile
    } = serialized;

    return publicProfile;
}

function serializeUsernameRecord(record) {
    if (!record) {
        return null;
    }

    return {
        id: normalizeString(
            record.id || record.username,
        ),

        uid: normalizeString(
            record.uid,
        ),

        username:
            normalizeUsername(
                record.username,
            ),
    };
}

/* ========================================================================== */
/* Create Profile                                                             */
/* ========================================================================== */

export async function createProfile(
    profileData = {},
) {
    const user =
        await getCurrentUser();

    const username =
        usernameSchema.parse(
            profileData.username,
        );

    const displayName =
        normalizeString(
            profileData.displayName,
        ) || user.displayName;

    const categoryId =
        normalizeString(
            profileData.categoryId,
        );

    if (!categoryId) {
        throw new Error(
            "CATEGORY_REQUIRED",
        );
    }

    const category =
        await getCategory(categoryId);

    if (!category) {
        throw new Error(
            "CATEGORY_NOT_FOUND",
        );
    }

    const { db } =
        await getServerFirebase();

    const profileRef = doc(
        db,
        PROFILES_COLLECTION,
        user.uid,
    );

    const usernameRef = doc(
        db,
        USERNAMES_COLLECTION,
        username,
    );

    const categoryRef = doc(
        db,
        CATEGORIES_COLLECTION,
        category.id,
    );

    const profile =
        await runTransaction(
            db,
            async (transaction) => {
                const profileSnapshot =
                    await transaction.get(
                        profileRef,
                    );

                if (profileSnapshot.exists()) {
                    throw new Error(
                        "PROFILE_EXISTS",
                    );
                }

                const usernameSnapshot =
                    await transaction.get(
                        usernameRef,
                    );

                if (usernameSnapshot.exists()) {
                    throw new Error(
                        "USERNAME_TAKEN",
                    );
                }

                const categorySnapshot =
                    await transaction.get(
                        categoryRef,
                    );

                if (!categorySnapshot.exists()) {
                    throw new Error(
                        "CATEGORY_NOT_FOUND",
                    );
                }

                const newProfile = {
                    id: user.uid,
                    uid: user.uid,
                    username,
                    displayName,

                    email: user.email,

                    role:
                        normalizeString(
                            profileData.role,
                        ),

                    categoryId:
                        category.id,

                    category:
                        category.name,

                    province:
                        normalizeString(
                            profileData.province,
                        ),

                    district:
                        normalizeString(
                            profileData.district,
                        ),

                    bio:
                        normalizeString(
                            profileData.bio,
                        ),

                    phone:
                        normalizeString(
                            profileData.phone,
                        ),

                    whatsapp:
                        normalizeString(
                            profileData.whatsapp,
                        ),

                    available:
                        normalizeBoolean(
                            profileData.available,
                        ),

                    avatar:
                        typeof profileData.avatar ===
                        "string"
                            ? profileData.avatar.trim()
                            : null,

                    skills:
                        normalizeStringArray(
                            profileData.skills,
                        ),

                    services:
                        normalizeServices(
                            profileData.services,
                        ),

                    verified: false,
                    likes: 0,
                    workCount: 0,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),
                };

                const usernameRecord = {
                    id: username,
                    uid: user.uid,
                    username,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),
                };

                transaction.set(
                    profileRef,
                    newProfile,
                );

                transaction.set(
                    usernameRef,
                    usernameRecord,
                );

                transaction.update(
                    categoryRef,
                    {
                        totalTalents:
                            increment(1),

                        updatedAt:
                            serverTimestamp(),
                    },
                );

                return newProfile;
            },
        );

    invalidateProfileCache(user.uid);
    invalidateUsernameCache(username);
    invalidateCategoryCache(
        category.id,
    );

    return serializeProfile(profile);
}

/* ========================================================================== */
/* Get My Profile                                                             */
/* ========================================================================== */

export async function getMyProfile() {
    const user =
        await getCurrentUser();

    const { db } =
        await getServerFirebase();

    const profileRef = doc(
        db,
        PROFILES_COLLECTION,
        user.uid,
    );

    const snapshot =
        await getDoc(profileRef);

    if (!snapshot.exists()) {
        return null;
    }

    return serializeProfile({
        id: snapshot.id,
        ...snapshot.data(),
    });
}

/* ========================================================================== */
/* Get Profile By UID                                                         */
/* ========================================================================== */

export async function getProfileByUid(uid) {
    const normalizedUid =
        normalizeString(uid);

    if (!normalizedUid) {
        return null;
    }

    const { db } =
        await getServerFirebase();

    const profileRef = doc(
        db,
        PROFILES_COLLECTION,
        normalizedUid,
    );

    const snapshot =
        await getDoc(profileRef);

    if (!snapshot.exists()) {
        return null;
    }

    return serializeProfile({
        id: snapshot.id,
        ...snapshot.data(),
    });
}

/* ========================================================================== */
/* Get Profile By Username                                                    */
/* ========================================================================== */

export async function getProfileByUsername(
    username,
) {
    const normalizedUsername =
        usernameSchema.parse(username);

    return getCachedProfileByUsername(
        normalizedUsername,
    );
}

async function getCachedProfileByUsername(
    username,
) {
    "use cache";

    cacheLife("hours");

    cacheTag(PROFILES_CACHE_TAG);
    cacheTag(
        profileUsernameCacheTag(username),
    );
    cacheTag(
        usernameCacheTag(username),
    );

    const { db } =
        getPublicServerFirebase();

    const usernameRef = doc(
        db,
        USERNAMES_COLLECTION,
        username,
    );

    const usernameSnapshot =
        await getDoc(usernameRef);

    if (!usernameSnapshot.exists()) {
        return null;
    }

    const usernameData =
        usernameSnapshot.data();

    const uid =
        normalizeString(
            usernameData?.uid,
        );

    if (!uid) {
        return null;
    }

    const profileRef = doc(
        db,
        PROFILES_COLLECTION,
        uid,
    );

    const profileSnapshot =
        await getDoc(profileRef);

    if (!profileSnapshot.exists()) {
        return null;
    }

    cacheTag(
        profileCacheTag(uid),
    );

    cacheTag(
        talentCacheTag(uid),
    );

    return serializePublicProfile({
        id: profileSnapshot.id,
        ...profileSnapshot.data(),
    });
}

/* ========================================================================== */
/* Username Record                                                            */
/* ========================================================================== */

export async function getUsernameRecord(
    username,
) {
    const normalizedUsername =
        usernameSchema.parse(username);

    return getCachedUsernameRecord(
        normalizedUsername,
    );
}

async function getCachedUsernameRecord(
    username,
) {
    "use cache";

    cacheLife("minutes");

    cacheTag(PROFILES_CACHE_TAG);
    cacheTag(
        usernameCacheTag(username),
    );

    const { db } =
        getPublicServerFirebase();

    const usernameRef = doc(
        db,
        USERNAMES_COLLECTION,
        username,
    );

    const snapshot =
        await getDoc(usernameRef);

    if (!snapshot.exists()) {
        return null;
    }

    return serializeUsernameRecord({
        id: snapshot.id,
        ...snapshot.data(),
    });
}

/* ========================================================================== */
/* Username Availability                                                      */
/* ========================================================================== */

export async function isUsernameAvailable(
    username,
) {
    const normalizedUsername =
        usernameSchema.parse(username);

    return checkCachedUsernameAvailability(
        normalizedUsername,
    );
}

async function checkCachedUsernameAvailability(
    username,
) {
    "use cache";

    cacheLife("seconds");

    cacheTag(PROFILES_CACHE_TAG);
    cacheTag(
        usernameCacheTag(username),
    );
    cacheTag(
        usernameAvailabilityCacheTag(
            username,
        ),
    );

    const { db } =
        getPublicServerFirebase();

    const usernameRef = doc(
        db,
        USERNAMES_COLLECTION,
        username,
    );

    const snapshot =
        await getDoc(usernameRef);

    return !snapshot.exists();
}

/* ========================================================================== */
/* Build Profile Updates                                                      */
/* ========================================================================== */

function buildProfileUpdates(
    updates,
    category,
) {
    const clean = {};

    /*
     * IMPORTANT:
     *
     * Only fields that were actually supplied are
     * written to Firestore.
     *
     * displayName is explicitly persisted here.
     */

    if (
        updates.displayName !==
        undefined
    ) {
        clean.displayName =
            normalizeString(
                updates.displayName,
            );
    }

    if (
        updates.role !==
        undefined
    ) {
        clean.role =
            normalizeString(
                updates.role,
            );
    }

    if (
        updates.province !==
        undefined
    ) {
        clean.province =
            normalizeString(
                updates.province,
            );
    }

    if (
        updates.district !==
        undefined
    ) {
        clean.district =
            normalizeString(
                updates.district,
            );
    }

    if (
        updates.bio !==
        undefined
    ) {
        clean.bio =
            normalizeString(
                updates.bio,
            );
    }

    if (
        updates.phone !==
        undefined
    ) {
        clean.phone =
            normalizeString(
                updates.phone,
            );
    }

    if (
        updates.whatsapp !==
        undefined
    ) {
        clean.whatsapp =
            normalizeString(
                updates.whatsapp,
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
                ? updates.avatar.trim()
                : null;
    }

    if (
        updates.skills !==
        undefined
    ) {
        clean.skills =
            normalizeStringArray(
                updates.skills,
            );
    }

    if (
        updates.services !==
        undefined
    ) {
        clean.services =
            normalizeServices(
                updates.services,
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

/* ========================================================================== */
/* Update Profile                                                             */
/* ========================================================================== */

export async function updateProfile(
    updates = {},
) {

    console.log(
        "updateProfile called with updates:",
        updates,
    );
    const user =
        await getCurrentUser();

    const validation =
        profileUpdateSchema.safeParse(
            updates,
        );

    if (!validation.success) {
        console.error(
            "updateProfile validation failed:",
            validation.error.flatten(),
        );

        throw new Error(
            "INVALID_PROFILE_DATA",
        );
    }

    const data =
        validation.data;

    const { db } =
        await getServerFirebase();

    const profileRef = doc(
        db,
        PROFILES_COLLECTION,
        user.uid,
    );

    let oldUsername = "";
    let newUsername = "";
    let affectedCategories = [];

    await runTransaction(
        db,
        async (transaction) => {
            /* -------------------------------------------------------------- */
            /* Read profile                                                   */
            /* -------------------------------------------------------------- */

            const profileSnapshot =
                await transaction.get(
                    profileRef,
                );

            if (!profileSnapshot.exists()) {
                throw new Error(
                    "PROFILE_NOT_FOUND",
                );
            }

            const profile =
                profileSnapshot.data();

            /* -------------------------------------------------------------- */
            /* Username                                                       */
            /* -------------------------------------------------------------- */

            const currentUsername =
                usernameSchema.safeParse(
                    profile?.username,
                ).success
                    ? normalizeUsername(
                          profile.username,
                      )
                    : "";

            const requestedUsername =
                data.username !== undefined
                    ? normalizeUsername(
                          data.username,
                      )
                    : currentUsername;

            const usernameChanged =
                requestedUsername !==
                currentUsername;

            oldUsername =
                currentUsername;

            newUsername =
                requestedUsername;

            /* -------------------------------------------------------------- */
            /* Category                                                       */
            /* -------------------------------------------------------------- */

            const currentCategoryId =
                normalizeString(
                    profile?.categoryId,
                );

            const requestedCategoryId =
                data.categoryId !== undefined
                    ? normalizeString(
                          data.categoryId,
                      )
                    : currentCategoryId;

            const categoryChanged =
                requestedCategoryId !==
                currentCategoryId;

            let oldCategoryRef = null;
            let newCategoryRef = null;
            let newCategory = null;

            if (categoryChanged) {
                if (!currentCategoryId) {
                    throw new Error(
                        "CURRENT_CATEGORY_NOT_FOUND",
                    );
                }

                if (!requestedCategoryId) {
                    throw new Error(
                        "CATEGORY_REQUIRED",
                    );
                }

                oldCategoryRef = doc(
                    db,
                    CATEGORIES_COLLECTION,
                    currentCategoryId,
                );

                newCategoryRef = doc(
                    db,
                    CATEGORIES_COLLECTION,
                    requestedCategoryId,
                );

                const [
                    oldCategorySnapshot,
                    newCategorySnapshot,
                ] = await Promise.all([
                    transaction.get(
                        oldCategoryRef,
                    ),
                    transaction.get(
                        newCategoryRef,
                    ),
                ]);

                if (
                    !oldCategorySnapshot.exists()
                ) {
                    throw new Error(
                        "CURRENT_CATEGORY_NOT_FOUND",
                    );
                }

                if (
                    !newCategorySnapshot.exists()
                ) {
                    throw new Error(
                        "CATEGORY_NOT_FOUND",
                    );
                }

                const categoryData =
                    newCategorySnapshot.data();

                newCategory = {
                    id:
                        newCategorySnapshot.id,

                    name:
                        normalizeString(
                            categoryData?.name,
                        ),
                };

                if (!newCategory.name) {
                    throw new Error(
                        "CATEGORY_INVALID",
                    );
                }

                affectedCategories = [
                    currentCategoryId,
                    requestedCategoryId,
                ];
            }

            /* -------------------------------------------------------------- */
            /* Username records                                               */
            /* -------------------------------------------------------------- */

            let oldUsernameRef = null;
            let newUsernameRef = null;

            let oldUsernameSnapshot = null;
            let newUsernameSnapshot = null;

            if (usernameChanged) {
                newUsernameRef = doc(
                    db,
                    USERNAMES_COLLECTION,
                    requestedUsername,
                );

                newUsernameSnapshot =
                    await transaction.get(
                        newUsernameRef,
                    );

                if (
                    newUsernameSnapshot.exists()
                ) {
                    const ownerUid =
                        normalizeString(
                            newUsernameSnapshot
                                .data()
                                ?.uid,
                        );

                    if (
                        ownerUid !==
                        user.uid
                    ) {
                        throw new Error(
                            "USERNAME_TAKEN",
                        );
                    }
                }

                if (currentUsername) {
                    oldUsernameRef = doc(
                        db,
                        USERNAMES_COLLECTION,
                        currentUsername,
                    );

                    oldUsernameSnapshot =
                        await transaction.get(
                            oldUsernameRef,
                        );
                }
            }

            /* -------------------------------------------------------------- */
            /* Build Firestore update                                         */
            /* -------------------------------------------------------------- */

            const cleanUpdates =
                buildProfileUpdates(
                    data,
                    categoryChanged
                        ? newCategory
                        : null,
                );

            if (usernameChanged) {
                cleanUpdates.username =
                    requestedUsername;
            }

            /*
             * Debug-safe server log.
             *
             * This lets you verify that displayName is
             * actually reaching the Firestore write.
             */
            console.log(
                "Youth Space profile update:",
                {
                    uid: user.uid,
                    displayName:
                        cleanUpdates.displayName,
                    username:
                        cleanUpdates.username,
                    fields:
                        Object.keys(
                            cleanUpdates,
                        ),
                },
            );

            /* -------------------------------------------------------------- */
            /* Write profile                                                   */
            /* -------------------------------------------------------------- */

            transaction.update(
                profileRef,
                cleanUpdates,
            );

            /* -------------------------------------------------------------- */
            /* Create/update username record                                  */
            /* -------------------------------------------------------------- */

            if (
                usernameChanged &&
                newUsernameRef
            ) {
                const usernameRecord = {
                    id: requestedUsername,
                    uid: user.uid,
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

                    if (createdAt) {
                        usernameRecord.createdAt =
                            createdAt;
                    }
                } else {
                    usernameRecord.createdAt =
                        serverTimestamp();
                }

                transaction.set(
                    newUsernameRef,
                    usernameRecord,
                );
            }

            /* -------------------------------------------------------------- */
            /* Delete old username                                            */
            /* -------------------------------------------------------------- */

            if (
                usernameChanged &&
                oldUsernameRef &&
                oldUsernameSnapshot?.exists()
            ) {
                const ownerUid =
                    normalizeString(
                        oldUsernameSnapshot
                            .data()
                            ?.uid,
                    );

                if (
                    ownerUid ===
                    user.uid
                ) {
                    transaction.delete(
                        oldUsernameRef,
                    );
                }
            }

            /* -------------------------------------------------------------- */
            /* Category counters                                              */
            /* -------------------------------------------------------------- */

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
                    },
                );

                transaction.update(
                    newCategoryRef,
                    {
                        totalTalents:
                            increment(1),

                        updatedAt:
                            serverTimestamp(),
                    },
                );
            }
        },
    );

    /* ====================================================================== */
    /* Cache Invalidation                                                     */
    /* ====================================================================== */

    invalidateProfileCache(
        user.uid,
    );

    if (oldUsername) {
        invalidateUsernameCache(
            oldUsername,
        );
    }

    if (newUsername) {
        invalidateUsernameCache(
            newUsername,
        );
    }

    for (
        const categoryId of
        affectedCategories
    ) {
        invalidateCategoryCache(
            categoryId,
        );
    }

    /* ====================================================================== */
    /* Return Fresh Profile                                                   */
    /* ====================================================================== */

    const updatedSnapshot =
        await getDoc(profileRef);

    if (!updatedSnapshot.exists()) {
        throw new Error(
            "PROFILE_UPDATE_FAILED",
        );
    }

    const updatedProfile =
        serializeProfile({
            id: updatedSnapshot.id,
            ...updatedSnapshot.data(),
        });

    console.log(
        "Youth Space profile updated:",
        {
            uid: user.uid,
            displayName:
                updatedProfile.displayName,
        },
    );

    return updatedProfile;
}

/* ========================================================================== */
/* Update Username                                                            */
/* ========================================================================== */

export async function updateUsername(
    username,
) {
    return updateProfile({
        username,
    });
}

/* ========================================================================== */
/* Update Profile With Username                                              */
/* ========================================================================== */

export async function updateProfileWithUsername(
    updates,
) {
    return updateProfile(
        updates,
    );
}

/* ========================================================================== */
/* Delete Profile                                                             */
/* ========================================================================== */

export async function deleteProfile() {
    const user =
        await getCurrentUser();

    const { db } =
        await getServerFirebase();

    const profileRef = doc(
        db,
        PROFILES_COLLECTION,
        user.uid,
    );

    let deletedUsername = "";
    let deletedCategory = "";

    await runTransaction(
        db,
        async (transaction) => {
            const profileSnapshot =
                await transaction.get(
                    profileRef,
                );

            if (!profileSnapshot.exists()) {
                throw new Error(
                    "PROFILE_NOT_FOUND",
                );
            }

            const profile =
                profileSnapshot.data();

            const username =
                usernameSchema.safeParse(
                    profile?.username,
                ).success
                    ? normalizeUsername(
                          profile.username,
                      )
                    : "";

            const categoryId =
                normalizeString(
                    profile?.categoryId,
                );

            deletedUsername =
                username;

            deletedCategory =
                categoryId;

            let usernameRef = null;
            let usernameSnapshot = null;

            if (username) {
                usernameRef = doc(
                    db,
                    USERNAMES_COLLECTION,
                    username,
                );

                usernameSnapshot =
                    await transaction.get(
                        usernameRef,
                    );
            }

            let categoryRef = null;
            let categorySnapshot = null;

            if (categoryId) {
                categoryRef = doc(
                    db,
                    CATEGORIES_COLLECTION,
                    categoryId,
                );

                categorySnapshot =
                    await transaction.get(
                        categoryRef,
                    );

                if (
                    !categorySnapshot.exists()
                ) {
                    throw new Error(
                        "CATEGORY_NOT_FOUND",
                    );
                }
            }

            transaction.delete(
                profileRef,
            );

            if (
                usernameRef &&
                usernameSnapshot?.exists()
            ) {
                const ownerUid =
                    normalizeString(
                        usernameSnapshot
                            .data()
                            ?.uid,
                    );

                if (
                    ownerUid ===
                    user.uid
                ) {
                    transaction.delete(
                        usernameRef,
                    );
                }
            }

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
                    },
                );
            }
        },
    );

    invalidateProfileCache(
        user.uid,
    );

    if (deletedUsername) {
        invalidateUsernameCache(
            deletedUsername,
        );
    }

    if (deletedCategory) {
        invalidateCategoryCache(
            deletedCategory,
        );
    }

    return {
        success: true,
    };
}

/* ========================================================================== */
/* Exports                                                                    */
/* ========================================================================== */

export {
    serializeProfile,
    serializePublicProfile,
    serializeUsernameRecord,
};