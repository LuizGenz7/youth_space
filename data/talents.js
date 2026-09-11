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
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

const TALENTS_COLLECTION =
  "talents";

const INITIAL_CATEGORIES_LIMIT = 6;
const TALENTS_PER_LOAD = 8;
const DISCOVER_TALENTS_LIMIT = 10;

/*
 * --------------------------------------------------
 * CACHE TAGS
 * --------------------------------------------------
 */

export const TALENTS_CACHE_TAG =
  "talents";

export const CATEGORIES_CACHE_TAG =
  "categories";

export function talentCacheTag(uid) {
  return `talent:${String(uid).trim()}`;
}

export function usernameCacheTag(username) {
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
  ).trim()}`;
}

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

function getSafeLimit(
  limit,
  fallback,
  maximum
) {
  const value = Number(limit);

  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(
    Math.max(
      Math.floor(value),
      1
    ),
    maximum
  );
}

function getSafeCursor(cursor) {
  const value = Number(cursor);

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  return Math.floor(value);
}

function emptyTalentResult() {
  return {
    talents: [],
    nextCursor: null,
    hasMore: false,
    totalTalents: 0,
  };
}

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
    .map(
      (item) =>
        item.trim()
    )
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
 * PUBLIC TALENT SERIALIZER
 * --------------------------------------------------
 */

function serializeTalent(talent) {
  if (!talent) {
    return null;
  }

  return {
    id:
      typeof talent.id === "string"
        ? talent.id
        : "",

    uid:
      typeof talent.uid === "string"
        ? talent.uid
        : talent.id || "",

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
      typeof talent.avatar === "string"
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

/**
 * Convert a Firestore talent document
 * into the public talent shape.
 */
function serializeTalentDocument(
  document
) {
  if (!document?.exists()) {
    return null;
  }

  return serializeTalent({
    id: document.id,
    ...document.data(),
  });
}

/*
 * --------------------------------------------------
 * INITIAL TALENTS DATA
 * --------------------------------------------------
 */

/**
 * Get the initial categories and
 * their first batch of talents.
 *
 * The first six categories are loaded
 * with eight talents each.
 */
export async function getInitialTalentsData() {
  "use cache";

  cacheLife("minutes");

  cacheTag(
    TALENTS_CACHE_TAG
  );

  cacheTag(
    CATEGORIES_CACHE_TAG
  );

  const allCategories =
    await getCategories();

  /*
   * Select the first six categories
   * by total talent count.
   */
  const initialCategories =
    [...allCategories]
      .sort(
        (a, b) =>
          b.totalTalents -
          a.totalTalents
      )
      .slice(
        0,
        INITIAL_CATEGORIES_LIMIT
      );

  /*
   * Fetch the first eight talents
   * for each initial category.
   */
  const talentResults =
    await Promise.all(
      initialCategories.map(
        (category) =>
          getCategoryTalents({
            categoryId:
              category.id,

            limit:
              TALENTS_PER_LOAD,
          })
      )
    );

  /*
   * Create a lookup containing
   * pagination information.
   */
  const paginationMap =
    new Map(
      initialCategories.map(
        (category, index) => {
          const result =
            talentResults[index] ??
            emptyTalentResult();

          return [
            category.id,
            {
              talents:
                result.talents,

              nextCursor:
                result.nextCursor,

              hasMore:
                result.hasMore,

              totalTalents:
                result.totalTalents,
            },
          ];
        }
      )
    );

  /*
   * Add pagination information
   * to the categories.
   */
  const enrichedCategories =
    allCategories.map(
      (category) => {
        const pagination =
          paginationMap.get(
            category.id
          );

        if (!pagination) {
          return category;
        }

        return {
          ...category,

          talents:
            pagination.talents,

          nextCursor:
            pagination.nextCursor,

          hasMore:
            pagination.hasMore,

          totalTalents:
            pagination.totalTalents,
        };
      }
    );

  /*
   * Keep a flat array because the
   * browser/filtering layer uses it.
   */
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
 * --------------------------------------------------
 * CATEGORY TALENTS
 * --------------------------------------------------
 */

/**
 * Get the first batch of talents
 * for a category.
 *
 * Cursor is an OFFSET.
 */
export async function getCategoryTalents({
  categoryId,
  limit = TALENTS_PER_LOAD,
} = {}) {
  "use cache";

  const normalizedCategoryId =
    normalizeString(
      categoryId
    );

  if (!normalizedCategoryId) {
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

  /*
   * Query talents belonging to
   * this category.
   */
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
      ),

      firestoreLimit(
        safeLimit
      )
    );

  const snapshot =
    await getDocs(
      talentsQuery
    );

  const normalizedTalents =
    snapshot.docs
      .map(
        serializeTalentDocument
      )
      .filter(Boolean);

  /*
   * Firestore only returned the
   * requested batch.
   *
   * We need the category count
   * separately for pagination.
   */
  const countQuery =
    query(
      talentsRef,

      where(
        "categoryId",
        "==",
        normalizedCategoryId
      )
    );

  const countSnapshot =
    await getDocs(
      countQuery
    );

  const totalTalents =
    countSnapshot.size;

  const hasMore =
    totalTalents >
    safeLimit;

  const nextCursor =
    hasMore
      ? safeLimit
      : null;

  return {
    talents:
      normalizedTalents,

    nextCursor,

    hasMore,

    totalTalents,
  };
}

/*
 * --------------------------------------------------
 * CATEGORY PAGINATION
 * --------------------------------------------------
 */

/**
 * Load talents after an OFFSET cursor.
 *
 * NOTE:
 *
 * This keeps the existing application
 * cursor contract.
 */
async function getTalentsByCategory({
  categoryId,
  limit = TALENTS_PER_LOAD,
  cursor = 0,
} = {}) {
  "use cache";

  const normalizedCategoryId =
    normalizeString(
      categoryId
    );

  if (!normalizedCategoryId) {
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

  const safeCursor =
    getSafeCursor(
      cursor
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

  /*
   * Get all category talents ordered
   * newest first.
   *
   * The offset is applied in memory
   * to preserve the existing cursor API.
   */
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

  const categoryTalents =
    snapshot.docs
      .map(
        serializeTalentDocument
      )
      .filter(Boolean);

  /*
   * Protect against an invalid cursor.
   */
  if (
    safeCursor >=
    categoryTalents.length
  ) {
    return {
      talents: [],
      nextCursor: null,
      hasMore: false,
      totalTalents:
        categoryTalents.length,
    };
  }

  /*
   * Fetch the next page.
   */
  const results =
    categoryTalents.slice(
      safeCursor,
      safeCursor +
        safeLimit
    );

  const nextOffset =
    safeCursor +
    results.length;

  const hasMore =
    nextOffset <
    categoryTalents.length;

  return {
    talents:
      results,

    nextCursor:
      hasMore
        ? nextOffset
        : null,

    hasMore,

    totalTalents:
      categoryTalents.length,
  };
}

/*
 * --------------------------------------------------
 * LOAD MORE TALENTS
 * --------------------------------------------------
 */

/**
 * Load the next batch of talents
 * using an offset cursor.
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
 * --------------------------------------------------
 * DISCOVER — TOP TALENTS
 * --------------------------------------------------
 */

/**
 * Get top talents ordered by likes.
 *
 * Cached.
 */
export async function getTopTalents(
  limit = DISCOVER_TALENTS_LIMIT
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
 * --------------------------------------------------
 * DISCOVER — NEW TALENTS
 * --------------------------------------------------
 */

/**
 * Get newest talents.
 */
export async function getNewTalents(
  limit = DISCOVER_TALENTS_LIMIT
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
 * --------------------------------------------------
 * TALENT BY ID
 * --------------------------------------------------
 */

/**
 * Get a talent by ID or UID.
 *
 * Since talent document IDs are UIDs,
 * the document ID is checked first.
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
    TALENTS_CACHE_TAG
  );

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
 * --------------------------------------------------
 * TALENT BY USERNAME
 * --------------------------------------------------
 */

/**
 * Get a talent by username.
 *
 * Used for:
 *
 * /talents/[username]
 *
 * Cached.
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
    TALENTS_CACHE_TAG
  );

  cacheTag(
    usernameCacheTag(
      normalizedUsername
    )
  );

  const {
    db,
  } =
    getPublicServerFirebase();

  const usernamesRef =
    collection(
      db,
      "usernames"
    );

  const usernameQuery =
    query(
      usernamesRef,

      where(
        "username",
        "==",
        normalizedUsername
      ),

      firestoreLimit(1)
    );

  const usernameSnapshot =
    await getDocs(
      usernameQuery
    );

  if (
    usernameSnapshot.empty
  ) {
    return null;
  }

  const usernameData =
    usernameSnapshot.docs[0].data();

  const uid =
    normalizeString(
      usernameData.uid
    );

  if (!uid) {
    return null;
  }

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
 * --------------------------------------------------
 * EXPORTS
 * --------------------------------------------------
 */

export {
  TALENTS_COLLECTION,
  serializeTalent,
};