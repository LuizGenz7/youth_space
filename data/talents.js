import {
  cacheLife,
  cacheTag,
} from "next/cache";

import {
  categories,
} from "./categories";

import {
  talents,
} from "./talents_data";

/*
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

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
    Math.max(Math.floor(value), 1),
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

/*
 * --------------------------------------------------
 * CATEGORIES
 * --------------------------------------------------
 */

/**
 * Get all categories.
 *
 * Cached.
 */
export async function getCategories() {
  "use cache";

  cacheLife("hours");

  cacheTag(
    CATEGORIES_CACHE_TAG
  );

  return categories
    .map((category) => ({
      id:
        typeof category.id === "string"
          ? category.id
          : "",

      name:
        normalizeString(
          category.name
        ),

      icon:
        typeof category.icon === "string"
          ? category.icon
          : "circle",

      description:
        normalizeString(
          category.description
        ),

      totalTalents:
        normalizeNumber(
          category.totalTalents
        ),
    }))
    .filter(
      (category) =>
        category.id
    );
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

              /*
               * Offset cursor.
               *
               * After loading 8 talents,
               * the next cursor is 8.
               */
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
   * Add the pagination information
   * to the initial categories.
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
 *
 * First page:
 *
 * cursor = 0
 * results = 0 - 7
 * nextCursor = 8
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

  /*
   * Get talents belonging to
   * this category.
   */
  const categoryTalents =
    talents
      .filter(
        (talent) =>
          talent.categoryId ===
          normalizedCategoryId
      )
      .sort(
        (a, b) =>
          String(
            b.createdAt || ""
          ).localeCompare(
            String(
              a.createdAt || ""
            )
          )
      );

  /*
   * First page always starts
   * from index 0.
   */
  const results =
    categoryTalents.slice(
      0,
      safeLimit
    );

  const normalizedTalents =
    results
      .map(
        serializeTalent
      )
      .filter(Boolean);

  const hasMore =
    categoryTalents.length >
    safeLimit;

  /*
   * The next cursor is simply
   * the number of talents already loaded.
   */
  const nextCursor =
    hasMore
      ? safeLimit
      : null;

  return {
    talents:
      normalizedTalents,

    nextCursor,

    hasMore,

    totalTalents:
      categoryTalents.length,
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
 * Example:
 *
 * cursor = 8
 *
 * startIndex = 8
 *
 * fetch:
 *   8, 9, 10, 11, 12, 13, 14, 15
 *
 * nextCursor = 16
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

  /*
   * ------------------------------------------------
   * GET CATEGORY TALENTS
   * ------------------------------------------------
   */

  const categoryTalents =
    talents
      .filter(
        (talent) =>
          talent.categoryId ===
          normalizedCategoryId
      )
      .sort(
        (a, b) =>
          String(
            b.createdAt || ""
          ).localeCompare(
            String(
              a.createdAt || ""
            )
          )
      );

  /*
   * ------------------------------------------------
   * PROTECT AGAINST INVALID OFFSET
   * ------------------------------------------------
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
   * ------------------------------------------------
   * FETCH NEXT PAGE
   * ------------------------------------------------
   */

  const results =
    categoryTalents.slice(
      safeCursor,
      safeCursor +
        safeLimit
    );

  const normalizedTalents =
    results
      .map(
        serializeTalent
      )
      .filter(Boolean);

  /*
   * Calculate how many talents
   * have been loaded after this request.
   */
  const nextOffset =
    safeCursor +
    results.length;

  const hasMore =
    nextOffset <
    categoryTalents.length;

  return {
    talents:
      normalizedTalents,

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

  return [...talents]
    .sort(
      (a, b) =>
        normalizeNumber(
          b.likes
        ) -
        normalizeNumber(
          a.likes
        )
    )
    .slice(
      0,
      safeLimit
    )
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
 * Get newest talents.
 *
 * createdAt is used internally
 * and is never returned.
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

  return [...talents]
    .sort(
      (a, b) =>
        String(
          b.createdAt || ""
        ).localeCompare(
          String(
            a.createdAt || ""
          )
        )
    )
    .slice(
      0,
      safeLimit
    )
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
 * Get a talent by ID or UID.
 *
 * Cached.
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

  const talent =
    talents.find(
      (item) =>
        item.id ===
          normalizedId ||
        item.uid ===
          normalizedId
    );

  return serializeTalent(
    talent
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

  const talent =
    talents.find(
      (item) =>
        normalizeString(
          item.username
        ).toLowerCase() ===
        normalizedUsername
    );

  return serializeTalent(
    talent
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