import {
  cacheLife,
  cacheTag,
} from "next/cache";

import { getFirestore } from "firebase-admin/firestore";

import { adminApp } from "@/lib/firebase-admin";

const db = getFirestore(adminApp);

const TALENTS_COLLECTION = "talents";
const CATEGORIES_COLLECTION = "categories";

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
  return `talent-username:${String(username)
    .trim()
    .toLowerCase()}`;
}

export function categoryTalentsCacheTag(categoryId) {
  return `category-talents:${String(categoryId).trim()}`;
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
    Math.max(Math.floor(value), 1),
    maximum
  );
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
          service.price !== undefined &&
            service.price !== null
            ? String(service.price)
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
 * PUBLIC TALENT SERIALIZER
 * --------------------------------------------------
 *
 * Phone and WhatsApp are intentionally public
 * on Youth Space talent profiles.
 *
 * We still explicitly select fields instead of
 * spreading Firestore data.
 * --------------------------------------------------
 */

function serializeTalent(doc) {
  if (!doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    id: doc.id,

    uid:
      typeof data.uid === "string"
        ? data.uid
        : doc.id,

    username:
      normalizeString(
        data.username
      ),

    displayName:
      normalizeString(
        data.displayName
      ),

    role:
      normalizeString(
        data.role
      ),

    categoryId:
      normalizeString(
        data.categoryId
      ),

    category:
      normalizeString(
        data.category
      ),

    province:
      normalizeString(
        data.province
      ),

    district:
      normalizeString(
        data.district
      ),

    bio:
      normalizeString(
        data.bio
      ),

    phone:
      normalizeString(
        data.phone
      ),

    whatsapp:
      normalizeString(
        data.whatsapp
      ),

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

    likes:
      normalizeNumber(
        data.likes
      ),

    workCount:
      normalizeNumber(
        data.workCount
      ),

    available:
      normalizeBoolean(
        data.available
      ),

    verified:
      normalizeBoolean(
        data.verified
      ),
  };
}

/*
 * --------------------------------------------------
 * CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get all categories.
 *
 * Cached.
 *
 * No Firestore timestamps are returned.
 */
export async function getCategories() {
  "use cache";

  cacheLife("hours");

  cacheTag(
    CATEGORIES_CACHE_TAG
  );

  const snapshot =
    await db
      .collection(
        CATEGORIES_COLLECTION
      )
      .get();

  return snapshot.docs
    .map((doc) => {
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();

      return {
        id: doc.id,

        name:
          normalizeString(
            data.name
          ),

        icon:
          typeof data.icon ===
            "string"
            ? data.icon
            : "circle",

        description:
          normalizeString(
            data.description
          ),

        totalTalents:
          normalizeNumber(
            data.totalTalents
          ),
      };
    })
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * INITIAL TALENTS DATA
 * --------------------------------------------------
 */

/**
 * Get the initial categories and their
 * first batch of talents.
 *
 * Cached.
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

  const initialCategories =
    allCategories
      .sort(
        (a, b) =>
          (b.totalTalents ?? 0) -
          (a.totalTalents ?? 0)
      )
      .slice(
        0,
        INITIAL_CATEGORIES_LIMIT
      );

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

  const initialTalents =
    talentResults.flatMap(
      (result) =>
        result.talents
    );

  return {
    categories:
      allCategories,

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
 * Cached.
 */
export async function getCategoryTalents({
  categoryId,
  limit = TALENTS_PER_LOAD,
} = {}) {
  "use cache";

  cacheLife("minutes");

  cacheTag(
    TALENTS_CACHE_TAG
  );

  cacheTag(
    categoryTalentsCacheTag(
      categoryId
    )
  );

  if (!categoryId) {
    return emptyTalentResult();
  }

  const normalizedCategoryId =
    normalizeString(
      categoryId
    );

  if (!normalizedCategoryId) {
    return emptyTalentResult();
  }

  const safeLimit =
    getSafeLimit(
      limit,
      TALENTS_PER_LOAD,
      TALENTS_PER_LOAD
    );

  const snapshot =
    await db
      .collection(
        TALENTS_COLLECTION
      )
      .where(
        "categoryId",
        "==",
        normalizedCategoryId
      )
      .orderBy(
        "createdAt",
        "desc"
      )
      .limit(
        safeLimit + 1
      )
      .get();

  const docs =
    snapshot.docs;

  const hasMore =
    docs.length > safeLimit;

  const results =
    hasMore
      ? docs.slice(0, safeLimit)
      : docs;

  const talents =
    results
      .map(
        serializeTalent
      )
      .filter(Boolean);

  const lastDoc =
    results[
      results.length - 1
    ];

  return {
    talents,

    nextCursor:
      hasMore && lastDoc
        ? lastDoc.id
        : null,

    hasMore,

    totalTalents:
      null,
  };
}

/*
 * --------------------------------------------------
 * CATEGORY PAGINATION
 * --------------------------------------------------
 */

/**
 * Load more talents for a category.
 *
 * The cursor is the document ID.
 *
 * Cached by category + cursor.
 */
async function getTalentsByCategory({
  categoryId,
  limit = TALENTS_PER_LOAD,
  cursor = null,
} = {}) {
  "use cache";

  cacheLife("minutes");

  cacheTag(
    TALENTS_CACHE_TAG
  );

  cacheTag(
    categoryTalentsCacheTag(
      categoryId
    )
  );

  if (!categoryId) {
    return emptyTalentResult();
  }

  const normalizedCategoryId =
    normalizeString(
      categoryId
    );

  if (!normalizedCategoryId) {
    return emptyTalentResult();
  }

  const safeLimit =
    getSafeLimit(
      limit,
      TALENTS_PER_LOAD,
      TALENTS_PER_LOAD
    );

  let query =
    db
      .collection(
        TALENTS_COLLECTION
      )
      .where(
        "categoryId",
        "==",
        normalizedCategoryId
      )
      .orderBy(
        "createdAt",
        "desc"
      );

  /*
   * ------------------------------------------------
   * CURSOR
   * ------------------------------------------------
   */

  if (cursor) {
    const normalizedCursor =
      normalizeString(
        cursor
      );

    if (!normalizedCursor) {
      return emptyTalentResult();
    }

    const cursorDoc =
      await db
        .collection(
          TALENTS_COLLECTION
        )
        .doc(normalizedCursor)
        .get();

    if (!cursorDoc.exists) {
      return emptyTalentResult();
    }

    query =
      query.startAfter(
        cursorDoc
      );
  }

  /*
   * ------------------------------------------------
   * FETCH
   * ------------------------------------------------
   */

  const snapshot =
    await query
      .limit(
        safeLimit + 1
      )
      .get();

  const docs =
    snapshot.docs;

  const hasMore =
    docs.length > safeLimit;

  const results =
    hasMore
      ? docs.slice(0, safeLimit)
      : docs;

  const talents =
    results
      .map(
        serializeTalent
      )
      .filter(Boolean);

  const lastDoc =
    results[
      results.length - 1
    ];

  return {
    talents,

    nextCursor:
      hasMore && lastDoc
        ? lastDoc.id
        : null,

    hasMore,

    totalTalents:
      null,
  };
}

/*
 * --------------------------------------------------
 * LOAD MORE TALENTS
 * --------------------------------------------------
 */

/**
 * Load the next batch of talents
 * for a category.
 */
export async function getMoreTalents({
  categoryId,
  cursor = null,
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
 * Get top talents for Discover.
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

  const snapshot =
    await db
      .collection(
        TALENTS_COLLECTION
      )
      .orderBy(
        "likes",
        "desc"
      )
      .limit(
        safeLimit
      )
      .get();

  return snapshot.docs
    .map(
      serializeTalent
    )
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * DISCOVER — NEW TALENTS
 * --------------------------------------------------
 */

/**
 * Get newest talents for Discover.
 *
 * Cached.
 *
 * createdAt is used internally only
 * for sorting and is NOT returned.
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

  const snapshot =
    await db
      .collection(
        TALENTS_COLLECTION
      )
      .orderBy(
        "createdAt",
        "desc"
      )
      .limit(
        safeLimit
      )
      .get();

  return snapshot.docs
    .map(
      serializeTalent
    )
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * TALENT BY ID
 * --------------------------------------------------
 */

/**
 * Get a talent by Firebase UID.
 *
 * Cached.
 */
export async function getTalentById(
  id
) {
  "use cache";

  cacheLife("minutes");

  const normalizedId =
    normalizeString(id);

  if (!normalizedId) {
    return null;
  }

  cacheTag(
    TALENTS_CACHE_TAG
  );

  cacheTag(
    talentCacheTag(
      normalizedId
    )
  );

  const snapshot =
    await db
      .collection(
        TALENTS_COLLECTION
      )
      .doc(normalizedId)
      .get();

  return serializeTalent(
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

  cacheLife("minutes");

  const normalizedUsername =
    normalizeString(
      username
    ).toLowerCase();

  if (!normalizedUsername) {
    return null;
  }

  cacheTag(
    TALENTS_CACHE_TAG
  );

  cacheTag(
    usernameCacheTag(
      normalizedUsername
    )
  );

  const snapshot =
    await db
      .collection(
        TALENTS_COLLECTION
      )
      .where(
        "username",
        "==",
        normalizedUsername
      )
      .limit(1)
      .get();

  if (snapshot.empty) {
    return null;
  }

  return serializeTalent(
    snapshot.docs[0]
  );
}

/*
 * --------------------------------------------------
 * EXPORTS
 * --------------------------------------------------
 */

export {
  serializeTalent,
};