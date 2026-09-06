import {
    cacheLife,
    cacheTag,
} from "next/cache";

import {
    FieldValue,
    getFirestore,
} from "firebase-admin/firestore";

import { adminApp } from "@/lib/firebase-admin";
import { getCategoryById } from "@/data/categories";

/*
 * --------------------------------------------------
 * FIRESTORE
 * --------------------------------------------------
 */

const db = getFirestore(adminApp);

const PROFILES_COLLECTION = "talents";
const USERNAMES_COLLECTION = "usernames";
const CATEGORIES_COLLECTION = "categories";

const PROFILE_CACHE_TAG = "profiles";

/*
 * --------------------------------------------------
 * REFERENCES
 * --------------------------------------------------
 */

function getProfileRef(uid) {
    return db
        .collection(PROFILES_COLLECTION)
        .doc(String(uid).trim());
}

function getUsernameRef(username) {
    return db
        .collection(USERNAMES_COLLECTION)
        .doc(
            String(username)
                .trim()
                .toLowerCase()
        );
}

function getCategoryRef(categoryId) {
    return db
        .collection(CATEGORIES_COLLECTION)
        .doc(String(categoryId).trim());
}

/*
 * --------------------------------------------------
 * NORMALIZATION
 * --------------------------------------------------
 */

function normalizeString(value) {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function normalizeStringArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (item) =>
                typeof item === "string"
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

/*
 * --------------------------------------------------
 * SERVICES
 * --------------------------------------------------
 */

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
                        ? service.id
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
                        ? String(service.price)
                        : "",

                image:
                    typeof service.image === "string"
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
 * PRIVATE PROFILE SERIALIZER
 *
 * Used for the logged-in user's own profile.
 *
 * Phone and WhatsApp are included because they
 * are also public profile information.
 *
 * No Firestore timestamps are exposed.
 * --------------------------------------------------
 */

function serializePrivateProfile(snapshot) {
    if (!snapshot.exists) {
        return null;
    }

    const data = snapshot.data();

    return {
        id: snapshot.id,

        uid:
            typeof data.uid === "string"
                ? data.uid
                : snapshot.id,

        username:
            normalizeString(data.username),

        displayName:
            normalizeString(data.displayName),

        email:
            normalizeString(data.email),

        role:
            normalizeString(data.role),

        categoryId:
            normalizeString(data.categoryId),

        category:
            normalizeString(data.category),

        province:
            normalizeString(data.province),

        district:
            normalizeString(data.district),

        bio:
            normalizeString(data.bio),

        phone:
            normalizeString(data.phone),

        whatsapp:
            normalizeString(data.whatsapp),

        available:
            normalizeBoolean(data.available),

        avatar:
            typeof data.avatar === "string"
                ? data.avatar
                : null,

        skills:
            normalizeStringArray(
                data.skills
            ),

        services:
            normalizeServices(
                data.services
            ),

        verified:
            normalizeBoolean(data.verified),

        likes:
            normalizeNumber(data.likes),

        workCount:
            normalizeNumber(data.workCount),
    };
}

/*
 * --------------------------------------------------
 * PUBLIC PROFILE SERIALIZER
 *
 * Used by:
 *
 * /talents/[username]
 *
 * Phone and WhatsApp are intentionally PUBLIC
 * on Youth Space.
 *
 * Email remains private.
 *
 * Timestamps are excluded.
 * --------------------------------------------------
 */

function serializePublicProfile(snapshot) {
    if (!snapshot.exists) {
        return null;
    }

    const data = snapshot.data();

    return {
        id: snapshot.id,

        uid:
            typeof data.uid === "string"
                ? data.uid
                : snapshot.id,

        username:
            normalizeString(data.username),

        displayName:
            normalizeString(data.displayName),

        role:
            normalizeString(data.role),

        categoryId:
            normalizeString(data.categoryId),

        category:
            normalizeString(data.category),

        province:
            normalizeString(data.province),

        district:
            normalizeString(data.district),

        bio:
            normalizeString(data.bio),

        /*
         * PUBLIC CONTACT
         */

        phone:
            normalizeString(data.phone),

        whatsapp:
            normalizeString(data.whatsapp),

        available:
            normalizeBoolean(data.available),

        avatar:
            typeof data.avatar === "string"
                ? data.avatar
                : null,

        skills:
            normalizeStringArray(
                data.skills
            ),

        services:
            normalizeServices(
                data.services
            ),

        verified:
            normalizeBoolean(data.verified),

        likes:
            normalizeNumber(data.likes),

        workCount:
            normalizeNumber(data.workCount),
    };
}

/*
 * --------------------------------------------------
 * USERNAME SERIALIZER
 *
 * No timestamps exposed.
 * --------------------------------------------------
 */

function serializeUsernameRecord(snapshot) {
    if (!snapshot.exists) {
        return null;
    }

    const data = snapshot.data();

    return {
        id: snapshot.id,

        uid:
            normalizeString(data.uid),

        username:
            normalizeString(data.username),
    };
}

/*
 * --------------------------------------------------
 * CATEGORY
 * --------------------------------------------------
 */

async function resolveCategory(categoryId) {
    const normalizedCategoryId =
        normalizeString(categoryId);

    if (!normalizedCategoryId) {
        return null;
    }

    return getCategoryById(
        normalizedCategoryId
    );
}

/*
 * --------------------------------------------------
 * CREATE PROFILE
 * --------------------------------------------------
 */

export async function createProfile(
    profileData
) {
    const uid =
        normalizeString(
            profileData?.uid
        );

    const username =
        normalizeString(
            profileData?.username
        ).toLowerCase();

    if (!uid) {
        throw new Error(
            "UID_REQUIRED"
        );
    }

    if (!username) {
        throw new Error(
            "USERNAME_REQUIRED"
        );
    }

    const categoryId =
        normalizeString(
            profileData?.categoryId
        );

    const category =
        await resolveCategory(
            categoryId
        );

    if (!category) {
        throw new Error(
            "CATEGORY_NOT_FOUND"
        );
    }

    const profileRef =
        getProfileRef(uid);

    const usernameRef =
        getUsernameRef(username);

    const categoryRef =
        getCategoryRef(
            category.id
        );

    const result =
        await db.runTransaction(
            async (transaction) => {
                const [
                    profileSnapshot,
                    usernameSnapshot,
                    categorySnapshot,
                ] = await Promise.all([
                    transaction.get(
                        profileRef
                    ),
                    transaction.get(
                        usernameRef
                    ),
                    transaction.get(
                        categoryRef
                    ),
                ]);

                if (
                    profileSnapshot.exists
                ) {
                    throw new Error(
                        "PROFILE_EXISTS"
                    );
                }

                if (
                    usernameSnapshot.exists
                ) {
                    throw new Error(
                        "USERNAME_TAKEN"
                    );
                }

                if (
                    !categorySnapshot.exists
                ) {
                    throw new Error(
                        "CATEGORY_NOT_FOUND"
                    );
                }

                const profile = {
                    uid,

                    username,

                    displayName:
                        normalizeString(
                            profileData?.displayName
                        ),

                    email:
                        normalizeString(
                            profileData?.email
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
                        FieldValue.serverTimestamp(),

                    updatedAt:
                        FieldValue.serverTimestamp(),
                };

                const usernameRecord = {
                    uid,

                    username,

                    createdAt:
                        FieldValue.serverTimestamp(),

                    updatedAt:
                        FieldValue.serverTimestamp(),
                };

                transaction.set(
                    profileRef,
                    profile
                );

                transaction.set(
                    usernameRef,
                    usernameRecord
                );

                transaction.update(
                    categoryRef,
                    {
                        totalTalents:
                            FieldValue.increment(
                                1
                            ),

                        updatedAt:
                            FieldValue.serverTimestamp(),
                    }
                );

                return profile;
            }
        );

    return {
        id: uid,

        uid,

        username:
            result.username,

        displayName:
            result.displayName,

        email:
            result.email,

        role:
            result.role,

        categoryId:
            result.categoryId,

        category:
            result.category,

        province:
            result.province,

        district:
            result.district,

        bio:
            result.bio,

        phone:
            result.phone,

        whatsapp:
            result.whatsapp,

        available:
            result.available,

        avatar:
            result.avatar,

        skills:
            result.skills,

        services:
            result.services,

        verified: false,

        likes: 0,

        workCount: 0,
    };
}

/*
 * --------------------------------------------------
 * GET PROFILE BY UID
 * --------------------------------------------------
 */

export async function getProfileByUid(
    uid
) {
    "use cache";

    cacheLife("minutes");

    cacheTag(
        PROFILE_CACHE_TAG
    );

    const normalizedUid =
        normalizeString(uid);

    if (!normalizedUid) {
        return null;
    }

    cacheTag(
        `profile:${normalizedUid}`
    );

    const snapshot =
        await getProfileRef(
            normalizedUid
        ).get();

    return serializePrivateProfile(
        snapshot
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
    "use cache";

    cacheLife("minutes");

    const normalizedUsername =
        normalizeString(
            username
        ).toLowerCase();

    if (!normalizedUsername) {
        return null;
    }

    cacheTag(
        PROFILE_CACHE_TAG
    );

    cacheTag(
        `profile-username:${normalizedUsername}`
    );

    const usernameSnapshot =
        await getUsernameRef(
            normalizedUsername
        ).get();

    if (
        !usernameSnapshot.exists
    ) {
        return null;
    }

    const usernameData =
        usernameSnapshot.data();

    const uid =
        normalizeString(
            usernameData.uid
        );

    if (!uid) {
        return null;
    }

    const profileSnapshot =
        await getProfileRef(
            uid
        ).get();

    return serializePublicProfile(
        profileSnapshot
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
    "use cache";

    cacheLife("minutes");

    const normalizedUsername =
        normalizeString(
            username
        ).toLowerCase();

    if (!normalizedUsername) {
        return null;
    }

    cacheTag(
        `profile-username:${normalizedUsername}`
    );

    const snapshot =
        await getUsernameRef(
            normalizedUsername
        ).get();

    return serializeUsernameRecord(
        snapshot
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
        normalizeString(
            username
        ).toLowerCase();

    if (!normalizedUsername) {
        return false;
    }

    const snapshot =
        await getUsernameRef(
            normalizedUsername
        ).get();

    return !snapshot.exists;
}

/*
 * --------------------------------------------------
 * UPDATE PROFILE
 * --------------------------------------------------
 */

export async function updateProfile(
    uid,
    updates
) {
    const normalizedUid =
        normalizeString(uid);

    if (!normalizedUid) {
        throw new Error(
            "UID_REQUIRED"
        );
    }

    const profileRef =
        getProfileRef(
            normalizedUid
        );

    const currentSnapshot =
        await profileRef.get();

    if (!currentSnapshot.exists) {
        throw new Error(
            "PROFILE_NOT_FOUND"
        );
    }

    const currentData =
        currentSnapshot.data();

    const currentCategoryId =
        normalizeString(
            currentData.categoryId
        );

    const requestedCategoryId =
        updates.categoryId !== undefined
            ? normalizeString(
                updates.categoryId
            )
            : currentCategoryId;

    const categoryChanged =
        requestedCategoryId !==
        currentCategoryId;

    let newCategory = null;

    if (
        updates.categoryId !==
        undefined
    ) {
        newCategory =
            await resolveCategory(
                requestedCategoryId
            );

        if (!newCategory) {
            throw new Error(
                "CATEGORY_NOT_FOUND"
            );
        }
    }

    const cleanUpdates = {};

    if (
        updates.role !== undefined
    ) {
        cleanUpdates.role =
            normalizeString(
                updates.role
            );
    }

    if (
        updates.province !== undefined
    ) {
        cleanUpdates.province =
            normalizeString(
                updates.province
            );
    }

    if (
        updates.district !== undefined
    ) {
        cleanUpdates.district =
            normalizeString(
                updates.district
            );
    }

    if (
        updates.bio !== undefined
    ) {
        cleanUpdates.bio =
            normalizeString(
                updates.bio
            );
    }

    if (
        updates.phone !== undefined
    ) {
        cleanUpdates.phone =
            normalizeString(
                updates.phone
            );
    }

    if (
        updates.whatsapp !== undefined
    ) {
        cleanUpdates.whatsapp =
            normalizeString(
                updates.whatsapp
            );
    }

    if (
        updates.available !== undefined
    ) {
        cleanUpdates.available =
            updates.available === true;
    }

    if (
        updates.avatar !== undefined
    ) {
        cleanUpdates.avatar =
            typeof updates.avatar ===
                "string"
                ? updates.avatar
                : null;
    }

    if (
        updates.skills !== undefined
    ) {
        cleanUpdates.skills =
            normalizeStringArray(
                updates.skills
            );
    }

    if (
        updates.services !== undefined
    ) {
        cleanUpdates.services =
            normalizeServices(
                updates.services
            );
    }

    if (
        updates.categoryId !==
        undefined
    ) {
        cleanUpdates.categoryId =
            newCategory.id;

        cleanUpdates.category =
            newCategory.name;
    }

    cleanUpdates.updatedAt =
        FieldValue.serverTimestamp();

    await db.runTransaction(
        async (transaction) => {
            const profileSnapshot =
                await transaction.get(
                    profileRef
                );

            if (
                !profileSnapshot.exists
            ) {
                throw new Error(
                    "PROFILE_NOT_FOUND"
                );
            }

            const databaseProfile =
                profileSnapshot.data();

            const databaseCategoryId =
                normalizeString(
                    databaseProfile.categoryId
                );

            if (
                !categoryChanged
            ) {
                transaction.update(
                    profileRef,
                    cleanUpdates
                );

                return;
            }

            const oldCategoryRef =
                currentCategoryId
                    ? getCategoryRef(
                        currentCategoryId
                    )
                    : null;

            const newCategoryRef =
                getCategoryRef(
                    newCategory.id
                );

            const categoryRefs = [];

            if (
                oldCategoryRef
            ) {
                categoryRefs.push(
                    oldCategoryRef
                );
            }

            if (
                !currentCategoryId ||
                currentCategoryId !==
                newCategory.id
            ) {
                categoryRefs.push(
                    newCategoryRef
                );
            }

            const categorySnapshots =
                await Promise.all(
                    categoryRefs.map(
                        (ref) =>
                            transaction.get(
                                ref
                            )
                    )
                );

            const categoryMap =
                new Map();

            categoryRefs.forEach(
                (
                    ref,
                    index
                ) => {
                    categoryMap.set(
                        ref.id,
                        categorySnapshots[
                        index
                        ]
                    );
                }
            );

            if (
                oldCategoryRef
            ) {
                const oldCategorySnapshot =
                    categoryMap.get(
                        oldCategoryRef.id
                    );

                if (
                    !oldCategorySnapshot ||
                    !oldCategorySnapshot.exists
                ) {
                    throw new Error(
                        "CATEGORY_NOT_FOUND"
                    );
                }
            }

            const newCategorySnapshot =
                categoryMap.get(
                    newCategoryRef.id
                );

            if (
                !newCategorySnapshot ||
                !newCategorySnapshot.exists
            ) {
                throw new Error(
                    "CATEGORY_NOT_FOUND"
                );
            }

            if (
                databaseCategoryId !==
                currentCategoryId
            ) {
                throw new Error(
                    "PROFILE_CHANGED"
                );
            }

            if (
                oldCategoryRef &&
                oldCategoryRef.id !==
                newCategoryRef.id
            ) {
                transaction.update(
                    oldCategoryRef,
                    {
                        totalTalents:
                            FieldValue.increment(
                                -1
                            ),

                        updatedAt:
                            FieldValue.serverTimestamp(),
                    }
                );
            }

            if (
                oldCategoryRef?.id !==
                newCategoryRef.id
            ) {
                transaction.update(
                    newCategoryRef,
                    {
                        totalTalents:
                            FieldValue.increment(
                                1
                            ),

                        updatedAt:
                            FieldValue.serverTimestamp(),
                    }
                );
            }

            transaction.update(
                profileRef,
                cleanUpdates
            );
        }
    );

    return getProfileByUid(
        normalizedUid
    );
}

/*
 * --------------------------------------------------
 * UPDATE USERNAME
 * --------------------------------------------------
 */

export async function updateUsername(
    uid,
    username
) {
    const normalizedUid =
        normalizeString(uid);

    const newUsername =
        normalizeString(
            username
        ).toLowerCase();

    if (!normalizedUid) {
        throw new Error(
            "UID_REQUIRED"
        );
    }

    if (!newUsername) {
        throw new Error(
            "USERNAME_REQUIRED"
        );
    }

    const profileRef =
        getProfileRef(
            normalizedUid
        );

    const newUsernameRef =
        getUsernameRef(
            newUsername
        );

    const result =
        await db.runTransaction(
            async (transaction) => {
                const profileSnapshot =
                    await transaction.get(
                        profileRef
                    );

                if (
                    !profileSnapshot.exists
                ) {
                    throw new Error(
                        "PROFILE_NOT_FOUND"
                    );
                }

                const profileData =
                    profileSnapshot.data();

                const currentUsername =
                    normalizeString(
                        profileData.username
                    ).toLowerCase();

                if (
                    currentUsername ===
                    newUsername
                ) {
                    return serializePrivateProfile(
                        profileSnapshot
                    );
                }

                const newUsernameSnapshot =
                    await transaction.get(
                        newUsernameRef
                    );

                if (
                    newUsernameSnapshot.exists
                ) {
                    throw new Error(
                        "USERNAME_TAKEN"
                    );
                }

                const oldUsernameRef =
                    currentUsername
                        ? getUsernameRef(
                            currentUsername
                        )
                        : null;

                transaction.set(
                    newUsernameRef,
                    {
                        uid:
                            normalizedUid,

                        username:
                            newUsername,

                        createdAt:
                            FieldValue.serverTimestamp(),

                        updatedAt:
                            FieldValue.serverTimestamp(),
                    }
                );

                if (
                    oldUsernameRef
                ) {
                    transaction.delete(
                        oldUsernameRef
                    );
                }

                transaction.update(
                    profileRef,
                    {
                        username:
                            newUsername,

                        updatedAt:
                            FieldValue.serverTimestamp(),
                    }
                );

                return {
                    ...serializePrivateProfile(
                        profileSnapshot
                    ),

                    username:
                        newUsername,
                };
            }
        );

    return result;
}

/*
 * --------------------------------------------------
 * UPDATE PROFILE + USERNAME
 * --------------------------------------------------
 */

export async function updateProfileWithUsername(
    uid,
    updates
) {
    const normalizedUid =
        normalizeString(uid);

    if (!normalizedUid) {
        throw new Error(
            "UID_REQUIRED"
        );
    }

    const profileRef =
        getProfileRef(
            normalizedUid
        );

    const currentSnapshot =
        await profileRef.get();

    if (!currentSnapshot.exists) {
        throw new Error(
            "PROFILE_NOT_FOUND"
        );
    }

    const currentProfile =
        serializePrivateProfile(
            currentSnapshot
        );

    const requestedUsername =
        updates.username !== undefined
            ? normalizeString(
                updates.username
            ).toLowerCase()
            : currentProfile.username;

    if (
        requestedUsername ===
        currentProfile.username
    ) {
        const {
            username,
            ...profileUpdates
        } = updates;

        return updateProfile(
            normalizedUid,
            profileUpdates
        );
    }

    const currentCategoryId =
        currentProfile.categoryId;

    const requestedCategoryId =
        updates.categoryId !==
            undefined
            ? normalizeString(
                updates.categoryId
            )
            : currentCategoryId;

    const categoryChanged =
        requestedCategoryId !==
        currentCategoryId;

    let newCategory = null;

    if (
        categoryChanged
    ) {
        newCategory =
            await resolveCategory(
                requestedCategoryId
            );

        if (!newCategory) {
            throw new Error(
                "CATEGORY_NOT_FOUND"
            );
        }
    }

    if (
        updates.categoryId !==
        undefined &&
        !newCategory
    ) {
        newCategory =
            await resolveCategory(
                requestedCategoryId
            );

        if (!newCategory) {
            throw new Error(
                "CATEGORY_NOT_FOUND"
            );
        }
    }

    const newUsernameRef =
        getUsernameRef(
            requestedUsername
        );

    const result =
        await db.runTransaction(
            async (transaction) => {
                const profileSnapshot =
                    await transaction.get(
                        profileRef
                    );

                if (
                    !profileSnapshot.exists
                ) {
                    throw new Error(
                        "PROFILE_NOT_FOUND"
                    );
                }

                const profileData =
                    profileSnapshot.data();

                const databaseUsername =
                    normalizeString(
                        profileData.username
                    ).toLowerCase();

                const databaseCategoryId =
                    normalizeString(
                        profileData.categoryId
                    );

                if (
                    databaseUsername !==
                    currentProfile.username
                ) {
                    throw new Error(
                        "PROFILE_CHANGED"
                    );
                }

                if (
                    databaseCategoryId !==
                    currentCategoryId
                ) {
                    throw new Error(
                        "PROFILE_CHANGED"
                    );
                }

                const newUsernameSnapshot =
                    await transaction.get(
                        newUsernameRef
                    );

                if (
                    newUsernameSnapshot.exists
                ) {
                    throw new Error(
                        "USERNAME_TAKEN"
                    );
                }

                const cleanUpdates = {};

                if (
                    updates.role !==
                    undefined
                ) {
                    cleanUpdates.role =
                        normalizeString(
                            updates.role
                        );
                }

                if (
                    updates.province !==
                    undefined
                ) {
                    cleanUpdates.province =
                        normalizeString(
                            updates.province
                        );
                }

                if (
                    updates.district !==
                    undefined
                ) {
                    cleanUpdates.district =
                        normalizeString(
                            updates.district
                        );
                }

                if (
                    updates.bio !==
                    undefined
                ) {
                    cleanUpdates.bio =
                        normalizeString(
                            updates.bio
                        );
                }

                if (
                    updates.phone !==
                    undefined
                ) {
                    cleanUpdates.phone =
                        normalizeString(
                            updates.phone
                        );
                }

                if (
                    updates.whatsapp !==
                    undefined
                ) {
                    cleanUpdates.whatsapp =
                        normalizeString(
                            updates.whatsapp
                        );
                }

                if (
                    updates.available !==
                    undefined
                ) {
                    cleanUpdates.available =
                        updates.available ===
                        true;
                }

                if (
                    updates.avatar !==
                    undefined
                ) {
                    cleanUpdates.avatar =
                        typeof updates.avatar ===
                            "string"
                            ? updates.avatar
                            : null;
                }

                if (
                    updates.skills !==
                    undefined
                ) {
                    cleanUpdates.skills =
                        normalizeStringArray(
                            updates.skills
                        );
                }

                if (
                    updates.services !==
                    undefined
                ) {
                    cleanUpdates.services =
                        normalizeServices(
                            updates.services
                        );
                }

                if (
                    updates.categoryId !==
                    undefined
                ) {
                    cleanUpdates.categoryId =
                        newCategory.id;

                    cleanUpdates.category =
                        newCategory.name;
                }

                cleanUpdates.username =
                    requestedUsername;

                cleanUpdates.updatedAt =
                    FieldValue.serverTimestamp();

                if (
                    categoryChanged
                ) {
                    const oldCategoryRef =
                        currentCategoryId
                            ? getCategoryRef(
                                currentCategoryId
                            )
                            : null;

                    const newCategoryRef =
                        getCategoryRef(
                            newCategory.id
                        );

                    const categoryRefs = [];

                    if (
                        oldCategoryRef
                    ) {
                        categoryRefs.push(
                            oldCategoryRef
                        );
                    }

                    if (
                        !oldCategoryRef ||
                        oldCategoryRef.id !==
                        newCategoryRef.id
                    ) {
                        categoryRefs.push(
                            newCategoryRef
                        );
                    }

                    const categorySnapshots =
                        await Promise.all(
                            categoryRefs.map(
                                (ref) =>
                                    transaction.get(
                                        ref
                                    )
                            )
                        );

                    const categoryMap =
                        new Map();

                    categoryRefs.forEach(
                        (
                            ref,
                            index
                        ) => {
                            categoryMap.set(
                                ref.id,
                                categorySnapshots[
                                index
                                ]
                            );
                        }
                    );

                    if (
                        oldCategoryRef
                    ) {
                        const oldCategorySnapshot =
                            categoryMap.get(
                                oldCategoryRef.id
                            );

                        if (
                            !oldCategorySnapshot ||
                            !oldCategorySnapshot.exists
                        ) {
                            throw new Error(
                                "CATEGORY_NOT_FOUND"
                            );
                        }
                    }

                    const newCategorySnapshot =
                        categoryMap.get(
                            newCategoryRef.id
                        );

                    if (
                        !newCategorySnapshot ||
                        !newCategorySnapshot.exists
                    ) {
                        throw new Error(
                            "CATEGORY_NOT_FOUND"
                        );
                    }

                    if (
                        oldCategoryRef &&
                        oldCategoryRef.id !==
                        newCategoryRef.id
                    ) {
                        transaction.update(
                            oldCategoryRef,
                            {
                                totalTalents:
                                    FieldValue.increment(
                                        -1
                                    ),

                                updatedAt:
                                    FieldValue.serverTimestamp(),
                            }
                        );
                    }

                    if (
                        !oldCategoryRef ||
                        oldCategoryRef.id !==
                        newCategoryRef.id
                    ) {
                        transaction.update(
                            newCategoryRef,
                            {
                                totalTalents:
                                    FieldValue.increment(
                                        1
                                    ),

                                updatedAt:
                                    FieldValue.serverTimestamp(),
                            }
                        );
                    }
                }

                transaction.update(
                    profileRef,
                    cleanUpdates
                );

                const oldUsernameRef =
                    databaseUsername
                        ? getUsernameRef(
                            databaseUsername
                        )
                        : null;

                if (
                    oldUsernameRef
                ) {
                    transaction.delete(
                        oldUsernameRef
                    );
                }

                transaction.set(
                    newUsernameRef,
                    {
                        uid:
                            normalizedUid,

                        username:
                            requestedUsername,

                        createdAt:
                            FieldValue.serverTimestamp(),

                        updatedAt:
                            FieldValue.serverTimestamp(),
                    }
                );

                return {
                    ...currentProfile,

                    ...cleanUpdates,

                    id:
                        profileSnapshot.id,

                    uid:
                        normalizedUid,

                    username:
                        requestedUsername,

                    categoryId:
                        cleanUpdates.categoryId ??
                        currentProfile.categoryId,

                    category:
                        cleanUpdates.category ??
                        currentProfile.category,

                    skills:
                        cleanUpdates.skills ??
                        currentProfile.skills,

                    services:
                        cleanUpdates.services ??
                        currentProfile.services,

                    available:
                        cleanUpdates.available ??
                        currentProfile.available,

                    avatar:
                        cleanUpdates.avatar ??
                        currentProfile.avatar,
                };
            }
        );

    return {
        id:
            result.id,

        uid:
            result.uid,

        username:
            result.username,

        displayName:
            result.displayName,

        email:
            result.email,

        role:
            result.role,

        categoryId:
            result.categoryId,

        category:
            result.category,

        province:
            result.province,

        district:
            result.district,

        bio:
            result.bio,

        phone:
            result.phone,

        whatsapp:
            result.whatsapp,

        available:
            result.available,

        avatar:
            result.avatar,

        skills:
            normalizeStringArray(
                result.skills
            ),

        services:
            normalizeServices(
                result.services
            ),

        verified:
            result.verified,

        likes:
            normalizeNumber(
                result.likes
            ),

        workCount:
            normalizeNumber(
                result.workCount
            ),
    };
}

/*
 * --------------------------------------------------
 * DELETE PROFILE
 * --------------------------------------------------
 */

export async function deleteProfile(
    uid
) {
    const normalizedUid =
        normalizeString(uid);

    if (!normalizedUid) {
        throw new Error(
            "UID_REQUIRED"
        );
    }

    const profileRef =
        getProfileRef(
            normalizedUid
        );

    const profileSnapshot =
        await profileRef.get();

    if (!profileSnapshot.exists) {
        throw new Error(
            "PROFILE_NOT_FOUND"
        );
    }

    const profileData =
        profileSnapshot.data();

    const username =
        normalizeString(
            profileData.username
        ).toLowerCase();

    const categoryId =
        normalizeString(
            profileData.categoryId
        );

    const usernameRef =
        username
            ? getUsernameRef(
                username
            )
            : null;

    const categoryRef =
        categoryId
            ? getCategoryRef(
                categoryId
            )
            : null;

    await db.runTransaction(
        async (transaction) => {
            const reads = [
                transaction.get(
                    profileRef
                ),
            ];

            if (categoryRef) {
                reads.push(
                    transaction.get(
                        categoryRef
                    )
                );
            }

            const snapshots =
                await Promise.all(
                    reads
                );

            const currentProfileSnapshot =
                snapshots[0];

            if (
                !currentProfileSnapshot.exists
            ) {
                throw new Error(
                    "PROFILE_NOT_FOUND"
                );
            }

            const currentProfileData =
                currentProfileSnapshot.data();

            const currentCategoryId =
                normalizeString(
                    currentProfileData.categoryId
                );

            if (
                currentCategoryId !==
                categoryId
            ) {
                throw new Error(
                    "PROFILE_CHANGED"
                );
            }

            if (
                categoryRef
            ) {
                const categorySnapshot =
                    snapshots[1];

                if (
                    !categorySnapshot.exists
                ) {
                    throw new Error(
                        "CATEGORY_NOT_FOUND"
                    );
                }

                transaction.update(
                    categoryRef,
                    {
                        totalTalents:
                            FieldValue.increment(
                                -1
                            ),

                        updatedAt:
                            FieldValue.serverTimestamp(),
                    }
                );
            }

            if (
                usernameRef
            ) {
                transaction.delete(
                    usernameRef
                );
            }

            transaction.delete(
                profileRef
            );
        }
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
    PROFILE_CACHE_TAG,
    serializePrivateProfile,
    serializePublicProfile,
    serializeUsernameRecord,
};