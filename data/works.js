import {
  cacheLife,
  cacheTag,
} from "next/cache";

import {
  works,
} from "./works_data";

import {
  talents,
} from "./talents_data";

const TRENDING_WORKS_LIMIT = 10;

/*
 * --------------------------------------------------
 * CACHE TAGS
 * --------------------------------------------------
 */

const WORKS_CACHE_TAG =
  "works";

const TRENDING_WORKS_CACHE_TAG =
  "trending-works";

function workCacheTag(workId) {
  return `work:${String(
    workId
  ).trim()}`;
}

function talentWorksCacheTag(
  talentId
) {
  return `talent-works:${String(
    talentId
  ).trim()}`;
}

function talentCacheTag(
  talentId
) {
  return `talent:${String(
    talentId
  ).trim()}`;
}

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
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
        typeof item === "string"
    )
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeBoolean(value) {
  return value === true;
}

function normalizeLimit(
  limit,
  defaultLimit
) {
  const value = Number(limit);

  if (!Number.isFinite(value)) {
    return defaultLimit;
  }

  return Math.min(
    Math.max(
      Math.floor(value),
      1
    ),
    TRENDING_WORKS_LIMIT
  );
}

function emptyWorkResult() {
  return {
    works: [],
    nextCursor: null,
    hasMore: false,
  };
}

/*
 * --------------------------------------------------
 * SERVICES
 * --------------------------------------------------
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
        typeof service !== "object" ||
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
 * NORMALIZE WORK
 * --------------------------------------------------
 *
 * Only public fields are returned.
 *
 * createdAt / updatedAt are used internally
 * for test-data sorting but are NOT returned.
 * --------------------------------------------------
 */

function normalizeWork(
  work
) {
  if (!work) {
    return null;
  }

  return {
    id:
      typeof work.id === "string"
        ? work.id
        : "",

    talentId:
      normalizeString(
        work.talentId
      ),

    title:
      normalizeString(
        work.title
      ),

    categoryId:
      normalizeString(
        work.categoryId
      ),

    category:
      normalizeString(
        work.category
      ),

    description:
      normalizeString(
        work.description
      ),

    image:
      typeof work.image ===
      "string"
        ? work.image
        : "",

    likes:
      normalizeNumber(
        work.likes
      ),
  };
}

/*
 * --------------------------------------------------
 * NORMALIZE TALENT
 * --------------------------------------------------
 *
 * Used when trending works include
 * their owner.
 *
 * Public fields only.
 *
 * No:
 *
 * email
 * phone
 * whatsapp
 * createdAt
 * updatedAt
 * --------------------------------------------------
 */

function normalizeTalent(
  talent
) {
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

/*
 * --------------------------------------------------
 * GET ALL WORKS
 * --------------------------------------------------
 */

export async function getWorks() {
  "use cache";

  cacheLife("minutes");

  cacheTag(
    WORKS_CACHE_TAG
  );

  return [...works]
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
    .map(normalizeWork)
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * GET WORK BY ID
 * --------------------------------------------------
 */

export async function getWorkById(
  workId
) {
  "use cache";

  cacheLife("minutes");

  const normalizedWorkId =
    normalizeString(workId);

  if (!normalizedWorkId) {
    return null;
  }

  cacheTag(
    WORKS_CACHE_TAG
  );

  cacheTag(
    workCacheTag(
      normalizedWorkId
    )
  );

  const work =
    works.find(
      (item) =>
        item.id ===
        normalizedWorkId
    );

  return normalizeWork(
    work
  );
}

/*
 * --------------------------------------------------
 * GET WORKS BY TALENT
 * --------------------------------------------------
 */

export async function getWorksByTalent(
  talentId
) {
  "use cache";

  cacheLife("minutes");

  const normalizedTalentId =
    normalizeString(
      talentId
    );

  if (!normalizedTalentId) {
    return [];
  }

  cacheTag(
    WORKS_CACHE_TAG
  );

  cacheTag(
    talentWorksCacheTag(
      normalizedTalentId
    )
  );

  return [...works]
    .filter(
      (work) =>
        normalizeString(
          work.talentId
        ) ===
        normalizedTalentId
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
    )
    .map(normalizeWork)
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * GET TRENDING WORKS
 * --------------------------------------------------
 */

export async function getTrendingWorks(
  limit = TRENDING_WORKS_LIMIT
) {
  "use cache";

  cacheLife("minutes");

  cacheTag(
    WORKS_CACHE_TAG
  );

  cacheTag(
    TRENDING_WORKS_CACHE_TAG
  );

  const safeLimit =
    normalizeLimit(
      limit,
      TRENDING_WORKS_LIMIT
    );

  const topWorks =
    [...works]
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
      );

  /*
   * ------------------------------------------------
   * COMBINE WORK + TALENT
   * ------------------------------------------------
   */

  return topWorks
    .map((work) => {
      const talent =
        talents.find(
          (item) =>
            String(
              item.id
            ) ===
              String(
                work.talentId
              ) ||
            String(
              item.uid
            ) ===
              String(
                work.talentId
              )
        );

      if (!talent) {
        return null;
      }

      return {
        ...normalizeWork(
          work
        ),

        talent:
          normalizeTalent(
            talent
          ),
      };
    })
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * TOGGLE WORK LIKE
 * --------------------------------------------------
 *
 * TEST DATA ONLY
 *
 * No Firebase.
 *
 * This mutates the in-memory test work.
 * --------------------------------------------------
 */

export async function toggleWorkLike({
  workId,
  userId,
}) {
  const normalizedWorkId =
    normalizeString(workId);

  const normalizedUserId =
    normalizeString(userId);

  if (!normalizedWorkId) {
    throw new Error(
      "Work ID is required."
    );
  }

  if (!normalizedUserId) {
    throw new Error(
      "User ID is required."
    );
  }

  const work =
    works.find(
      (item) =>
        item.id ===
        normalizedWorkId
    );

  if (!work) {
    throw new Error(
      "Work not found."
    );
  }

  /*
   * ------------------------------------------------
   * TEST LIKE STATE
   * ------------------------------------------------
   *
   * Store liked user IDs directly on the
   * test work object.
   */

  if (!Array.isArray(
    work.likedBy
  )) {
    work.likedBy = [];
  }

  const alreadyLiked =
    work.likedBy.includes(
      normalizedUserId
    );

  const currentLikes =
    normalizeNumber(
      work.likes
    );

  /*
   * ------------------------------------------------
   * REMOVE LIKE
   * ------------------------------------------------
   */

  if (alreadyLiked) {
    work.likedBy =
      work.likedBy.filter(
        (id) =>
          id !==
          normalizedUserId
      );

    const likes =
      Math.max(
        currentLikes - 1,
        0
      );

    work.likes =
      likes;

    return {
      liked: false,
      likes,
    };
  }

  /*
   * ------------------------------------------------
   * ADD LIKE
   * ------------------------------------------------
   */

  work.likedBy.push(
    normalizedUserId
  );

  const likes =
    currentLikes + 1;

  work.likes =
    likes;

  return {
    liked: true,
    likes,
  };
}

/*
 * --------------------------------------------------
 * DELETE WORK
 * --------------------------------------------------
 *
 * TEST DATA ONLY
 *
 * No Firebase.
 * --------------------------------------------------
 */

export async function deleteWork({
  workId,
  userId,
}) {
  const normalizedWorkId =
    normalizeString(workId);

  const normalizedUserId =
    normalizeString(userId);

  if (!normalizedWorkId) {
    throw new Error(
      "Work ID is required."
    );
  }

  if (!normalizedUserId) {
    throw new Error(
      "User ID is required."
    );
  }

  const workIndex =
    works.findIndex(
      (item) =>
        item.id ===
        normalizedWorkId
    );

  if (workIndex === -1) {
    throw new Error(
      "Work not found."
    );
  }

  const work =
    works[workIndex];

  /*
   * ------------------------------------------------
   * OWNERSHIP
   * ------------------------------------------------
   */

  const ownerId =
    normalizeString(
      work.talentId
    );

  if (
    ownerId !==
    normalizedUserId
  ) {
    throw new Error(
      "You do not own this work."
    );
  }

  /*
   * ------------------------------------------------
   * DELETE WORK
   * ------------------------------------------------
   */

  works.splice(
    workIndex,
    1
  );

  /*
   * ------------------------------------------------
   * UPDATE TALENT WORK COUNT
   * ------------------------------------------------
   */

  const talent =
    talents.find(
      (item) =>
        String(
          item.id
        ) ===
          normalizedUserId ||
        String(
          item.uid
        ) ===
          normalizedUserId
    );

  if (talent) {
    const currentWorkCount =
      normalizeNumber(
        talent.workCount
      );

    talent.workCount =
      Math.max(
        currentWorkCount - 1,
        0
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
  TRENDING_WORKS_LIMIT,
  WORKS_CACHE_TAG,
  TRENDING_WORKS_CACHE_TAG,
  workCacheTag,
  talentWorksCacheTag,
  talentCacheTag,
  normalizeWork,
  normalizeTalent,
};