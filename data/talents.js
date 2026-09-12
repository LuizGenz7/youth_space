import {
    cacheLife,
    cacheTag,
} from "next/cache";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit as firestoreLimit,
    orderBy,
    query,
    where,
} from "firebase/firestore";

import {
    getPublicServerFirebase,
} from "@/lib/server";

import {
    getCategories,
} from "@/data/categories";

/*
 * ==================================================
 * CONSTANTS
 * ==================================================
 */

const TALENTS_COLLECTION =
    "talents";

const CATEGORIES_COLLECTION =
    "categories";

const USERNAMES_COLLECTION =
    "usernames";

const INITIAL_CATEGORIES_LIMIT =
    6;

const TALENTS_PER_LOAD =
    8;

const DISCOVER_TALENTS_LIMIT =
    10;

/*
 * ==================================================
 * CACHE TAGS
 * ==================================================
 *
 * General talent collection cache.
 *
 * Individual talent:
 *
 * talent:{uid}
 *
 * Category talent list:
 *
 * category-talents:{categoryId}
 *
 * Username lookup:
 *
 * talent-username:{username}
 * ==================================================
 */

export const TALENTS_CACHE_TAG =
    "talents";

export function talentCacheTag(
    uid
) {
    return `talent:${String(
        uid
    ).trim()}`;
}

export function usernameCacheTag(
    username
) {
    return `talent-username:${String(
        username
    )
        .trim()
        .toLowerCase()}`;
}

export function categoryTalentsCacheTag(
    categoryId
) {
    return `category-talents:${String(
        categoryId
    )
        .trim()
        .toLowerCase()}`;
}

/*
 * ==================================================
 * HELPERS
 * ==================================================
 */

function normalizeString(
    value
) {
    return typeof value ===
        "string"
        ? value.trim()
        : "";
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

function getSafeLimit(
    value,
    fallback,
    maximum
) {
    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {
        return fallback;
    }

    return Math.min(
        Math.max(
            Math.floor(number),
            1
        ),
        maximum
    );
}

function getSafeCursor(
    value
) {
    const number =
        Number(value);

    if (
        !Number.isFinite(number) ||
        number < 0
    ) {
        return 0;
    }

    return Math.floor(number);
}

function emptyTalentResult() {
    return {
        talents: [],
        nextCursor: null,
        hasMore: false,
        totalTalents: 0,
    };
}

/*
 * ==================================================
 * SERVICES
 * ==================================================
 */

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
 * ==================================================
 * SERIALIZATION
 * ==================================================
 *
 * Always return plain serializable
 * JavaScript objects.
 * ==================================================
 */

export function serializeTalent(
    talent
) {
    if (!talent) {
        return null;
    }

    return {
        id:
            normalizeString(
                talent.id
            ),

        uid:
            normalizeString(
                talent.uid ||
                    talent.id
            ),

        username:
            normalizeString(
                talent.username
            ),

        displayName:
            normalizeString(
                talent.displayName
            ),

        role:
            normalizeString(
                talent.role
            ),

        categoryId:
            normalizeString(
                talent.categoryId
            ),

        category:
            normalizeString(
                talent.category
            ),

        province:
            normalizeString(
                talent.province
            ),

        district:
            normalizeString(
                talent.district
            ),

        bio:
            normalizeString(
                talent.bio
            ),

        phone:
            normalizeString(
                talent.phone
            ),

        whatsapp:
            normalizeString(
                talent.whatsapp
            ),

        avatar:
            typeof talent.avatar ===
                "string"
                ? talent.avatar
                : null,

        skills:
            normalizeStringArray(
                talent.skills
            ),

        services:
            normalizeServices(
                talent.services
            ),

        likes:
            normalizeNumber(
                talent.likes
            ),

        workCount:
            normalizeNumber(
                talent.workCount
            ),

        available:
            normalizeBoolean(
                talent.available
            ),

        verified:
            normalizeBoolean(
                talent.verified
            ),
    };
}

function serializeTalentDocument(
    snapshot
) {
    if (
        !snapshot?.exists()
    ) {
        return null;
    }

    return serializeTalent({
        id: snapshot.id,
        ...snapshot.data(),
    });
}

/*
 * ==================================================
 * CATEGORY COUNT
 * ==================================================
 *
 * Reads the authoritative totalTalents
 * maintained on the category document.
 * ==================================================
 */

async function getCategoryTalentCount(
    db,
    categoryId
) {
    const categoryRef =
        doc(
            db,
            CATEGORIES_COLLECTION,
            categoryId
        );

    const snapshot =
        await getDoc(
            categoryRef
        );

    if (!snapshot.exists()) {
        return 0;
    }

    return normalizeNumber(
        snapshot.data()
            ?.totalTalents
    );
}

/*
 * ==================================================
 * CATEGORY QUERY
 * ==================================================
 */

async function queryCategoryTalents(
    db,
    categoryId,
    limit
) {
    const talentsRef =
        collection(
            db,
            TALENTS_COLLECTION
        );

    const talentsQuery =
        query(
            talentsRef,

            where(
                "categoryId",
                "==",
                categoryId
            ),

            orderBy(
                "createdAt",
                "desc"
            ),

            firestoreLimit(
                limit
            )
        );

    const snapshot =
        await getDocs(
            talentsQuery
        );

    return snapshot.docs
        .map(
            serializeTalentDocument
        )
        .filter(Boolean);
}

/*
 * ==================================================
 * INITIAL TALENTS DATA
 * ==================================================
 *
 * First loads the cached categories.
 *
 * Then selects the first six categories
 * by totalTalents.
 *
 * Then loads eight talents for each
 * selected category.
 * ==================================================
 */

export async function getInitialTalentsData() {
    "use cache";

    cacheLife("minutes");

    cacheTag(
        TALENTS_CACHE_TAG
    );

    const allCategories =
        await getCategories();

    const initialCategories =
        [...allCategories]
            .sort(
                (a, b) =>
                    normalizeNumber(
                        b.totalTalents
                    ) -
                    normalizeNumber(
                        a.totalTalents
                    )
            )
            .slice(
                0,
                INITIAL_CATEGORIES_LIMIT
            );

    const talentResults =
        await Promise.all(
            initialCategories.map(
                async (category) =>
                    getCategoryTalents({
                        categoryId:
                            category.id,

                        limit:
                            TALENTS_PER_LOAD,
                    })
            )
        );

    const paginationMap =
        new Map();

    initialCategories.forEach(
        (category, index) => {
            const result =
                talentResults[index] ??
                emptyTalentResult();

            paginationMap.set(
                category.id,
                result
            );
        }
    );

    const enrichedCategories =
        allCategories.map(
            (category) => {
                const result =
                    paginationMap.get(
                        category.id
                    );

                if (!result) {
                    return category;
                }

                return {
                    ...category,

                    talents:
                        result.talents,

                    nextCursor:
                        result.nextCursor,

                    hasMore:
                        result.hasMore,

                    totalTalents:
                        result.totalTalents,
                };
            }
        );

    const initialTalents =
        talentResults.flatMap(
            (result) =>
                result?.talents ?? []
        );

    return {
        categories:
            enrichedCategories,

        talents:
            initialTalents,
    };
}

/*
 * ==================================================
 * CATEGORY TALENTS
 * ==================================================
 *
 * Cached independently per category.
 *
 * Example:
 *
 * category-talents:art
 * category-talents:music
 *
 * Updating Art does not require the Music
 * category cache to become stale.
 * ==================================================
 */

export async function getCategoryTalents({
    categoryId,
    limit =
        TALENTS_PER_LOAD,
} = {}) {
    "use cache";

    const normalizedCategoryId =
        normalizeString(
            categoryId
        ).toLowerCase();

    if (
        !normalizedCategoryId
    ) {
        return emptyTalentResult();
    }

    cacheLife("minutes");

    cacheTag(
        TALENTS_CACHE_TAG
    );

    cacheTag(
        categoryTalentsCacheTag(
            normalizedCategoryId
        )
    );

    const safeLimit =
        getSafeLimit(
            limit,
            TALENTS_PER_LOAD,
            TALENTS_PER_LOAD
        );

    const {
        db,
    } =
        getPublicServerFirebase();

    const [
        talents,
        totalTalents,
    ] =
        await Promise.all([
            queryCategoryTalents(
                db,
                normalizedCategoryId,
                safeLimit
            ),

            getCategoryTalentCount(
                db,
                normalizedCategoryId
            ),
        ]);

    const hasMore =
        totalTalents >
        talents.length;

    const nextCursor =
        hasMore
            ? talents.length
            : null;

    return {
        talents,

        nextCursor,

        hasMore,

        totalTalents,
    };
}

/*
 * ==================================================
 * CATEGORY PAGINATION
 * ==================================================
 *
 * Keeps the current frontend offset
 * contract:
 *
 * 0  → 1-8
 * 8  → 9-16
 * 16 → 17-24
 *
 * NOTE:
 * This currently reads the category's
 * complete ordered result before slicing.
 *
 * It preserves the current API contract,
 * but cursor pagination with Firestore
 * document snapshots can be introduced
 * later for large categories.
 * ==================================================
 */

async function getTalentsByCategory({
    categoryId,
    limit =
        TALENTS_PER_LOAD,
    cursor = 0,
} = {}) {
    "use cache";

    const normalizedCategoryId =
        normalizeString(
            categoryId
        ).toLowerCase();

    if (
        !normalizedCategoryId
    ) {
        return emptyTalentResult();
    }

    const safeLimit =
        getSafeLimit(
            limit,
            TALENTS_PER_LOAD,
            TALENTS_PER_LOAD
        );

    const safeCursor =
        getSafeCursor(
            cursor
        );

    cacheLife("minutes");

    cacheTag(
        TALENTS_CACHE_TAG
    );

    cacheTag(
        categoryTalentsCacheTag(
            normalizedCategoryId
        )
    );

    const {
        db,
    } =
        getPublicServerFirebase();

    const talentsRef =
        collection(
            db,
            TALENTS_COLLECTION
        );

    const talentsQuery =
        query(
            talentsRef,

            where(
                "categoryId",
                "==",
                normalizedCategoryId
            ),

            orderBy(
                "createdAt",
                "desc"
            )
        );

    const snapshot =
        await getDocs(
            talentsQuery
        );

    const allTalents =
        snapshot.docs
            .map(
                serializeTalentDocument
            )
            .filter(Boolean);

    const totalTalents =
        await getCategoryTalentCount(
            db,
            normalizedCategoryId
        );

    if (
        safeCursor >=
        allTalents.length
    ) {
        return {
            talents: [],
            nextCursor: null,
            hasMore: false,
            totalTalents,
        };
    }

    const results =
        allTalents.slice(
            safeCursor,
            safeCursor +
                safeLimit
        );

    const nextOffset =
        safeCursor +
        results.length;

    const hasMore =
        nextOffset <
        allTalents.length;

    return {
        talents:
            results,

        nextCursor:
            hasMore
                ? nextOffset
                : null,

        hasMore,

        totalTalents,
    };
}

/*
 * ==================================================
 * LOAD MORE TALENTS
 * ==================================================
 */

export async function getMoreTalents({
    categoryId,
    cursor = 0,
} = {}) {
    return getTalentsByCategory({
        categoryId,

        limit:
            TALENTS_PER_LOAD,

        cursor,
    });
}

/*
 * ==================================================
 * TOP TALENTS
 * ==================================================
 *
 * Cached as the general talent discovery
 * result.
 * ==================================================
 */

export async function getTopTalents(
    limit =
        DISCOVER_TALENTS_LIMIT
) {
    "use cache";

    cacheLife("minutes");

    cacheTag(
        TALENTS_CACHE_TAG
    );

    const safeLimit =
        getSafeLimit(
            limit,
            DISCOVER_TALENTS_LIMIT,
            DISCOVER_TALENTS_LIMIT
        );

    const {
        db,
    } =
        getPublicServerFirebase();

    const talentsRef =
        collection(
            db,
            TALENTS_COLLECTION
        );

    const talentsQuery =
        query(
            talentsRef,

            orderBy(
                "likes",
                "desc"
            ),

            firestoreLimit(
                safeLimit
            )
        );

    const snapshot =
        await getDocs(
            talentsQuery
        );

    return snapshot.docs
        .map(
            serializeTalentDocument
        )
        .filter(Boolean);
}

/*
 * ==================================================
 * NEW TALENTS
 * ==================================================
 */

export async function getNewTalents(
    limit =
        DISCOVER_TALENTS_LIMIT
) {
    "use cache";

    cacheLife("minutes");

    cacheTag(
        TALENTS_CACHE_TAG
    );

    const safeLimit =
        getSafeLimit(
            limit,
            DISCOVER_TALENTS_LIMIT,
            DISCOVER_TALENTS_LIMIT
        );

    const {
        db,
    } =
        getPublicServerFirebase();

    const talentsRef =
        collection(
            db,
            TALENTS_COLLECTION
        );

    const talentsQuery =
        query(
            talentsRef,

            orderBy(
                "createdAt",
                "desc"
            ),

            firestoreLimit(
                safeLimit
            )
        );

    const snapshot =
        await getDocs(
            talentsQuery
        );

    return snapshot.docs
        .map(
            serializeTalentDocument
        )
        .filter(Boolean);
}

/*
 * ==================================================
 * TALENT BY ID
 * ==================================================
 *
 * Individual talent cache.
 *
 * talent:{uid}
 * ==================================================
 */

export async function getTalentById(
    id
) {
    "use cache";

    const normalizedId =
        normalizeString(id);

    if (!normalizedId) {
        return null;
    }

    cacheLife("minutes");

    cacheTag(
        talentCacheTag(
            normalizedId
        )
    );

    const {
        db,
    } =
        getPublicServerFirebase();

    const talentRef =
        doc(
            db,
            TALENTS_COLLECTION,
            normalizedId
        );

    const snapshot =
        await getDoc(
            talentRef
        );

    return serializeTalentDocument(
        snapshot
    );
}

/*
 * ==================================================
 * TALENT BY USERNAME
 * ==================================================
 *
 * usernames/{username}
 *        ↓
 *       uid
 *        ↓
 * talents/{uid}
 *
 * Cached independently by username.
 * ==================================================
 */

export async function getTalentByUsername(
    username
) {
    "use cache";

    const normalizedUsername =
        normalizeString(
            username
        ).toLowerCase();

    if (!normalizedUsername) {
        return null;
    }

    cacheLife("minutes");

    cacheTag(
        usernameCacheTag(
            normalizedUsername
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
            normalizedUsername
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

    /*
     * Add the individual talent tag
     * after resolving the UID.
     *
     * This lets a profile mutation
     * invalidate the talent itself.
     */

    cacheTag(
        talentCacheTag(uid)
    );

    const talentRef =
        doc(
            db,
            TALENTS_COLLECTION,
            uid
        );

    const talentSnapshot =
        await getDoc(
            talentRef
        );

    return serializeTalentDocument(
        talentSnapshot
    );
}

/*
 * ==================================================
 * EXPORTS
 * ==================================================
 */

export {
    TALENTS_COLLECTION,
};