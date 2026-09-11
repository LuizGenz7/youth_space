import {
  cacheLife,
  cacheTag,
} from "next/cache";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit as firestoreLimit,
  orderBy,
  query,
  runTransaction,
  where,
} from "firebase/firestore";

import {
  getPublicServerFirebase,
  getServerFirebase,
} from "@/lib/server";

const WORKS_COLLECTION =
  "works";

const TALENTS_COLLECTION =
  "talents";

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
 * SERIALIZE FIRESTORE WORK
 * --------------------------------------------------
 */

function serializeWorkDocument(
  document
) {
  if (!document.exists()) {
    return null;
  }

  return normalizeWork({
    id: document.id,
    ...document.data(),
  });
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

  const {
    db,
  } =
    getPublicServerFirebase();

  const worksQuery =
    query(
      collection(
        db,
        WORKS_COLLECTION
      ),
      orderBy(
        "createdAt",
        "desc"
      )
    );

  const snapshot =
    await getDocs(
      worksQuery
    );

  return snapshot.docs
    .map(
      serializeWorkDocument
    )
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

  const {
    db,
  } =
    getPublicServerFirebase();

  const workRef =
    doc(
      db,
      WORKS_COLLECTION,
      normalizedWorkId
    );

  const snapshot =
    await getDoc(
      workRef
    );

  return serializeWorkDocument(
    snapshot
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

  const {
    db,
  } =
    getPublicServerFirebase();

  const worksQuery =
    query(
      collection(
        db,
        WORKS_COLLECTION
      ),
      where(
        "talentId",
        "==",
        normalizedTalentId
      ),
      orderBy(
        "createdAt",
        "desc"
      )
    );

  const snapshot =
    await getDocs(
      worksQuery
    );

  return snapshot.docs
    .map(
      serializeWorkDocument
    )
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

  const {
    db,
  } =
    getPublicServerFirebase();

  const worksQuery =
    query(
      collection(
        db,
        WORKS_COLLECTION
      ),
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
      worksQuery
    );

  const works =
    snapshot.docs
      .map(
        (document) => ({
          id: document.id,
          ...document.data(),
        })
      );

  /*
   * ------------------------------------------------
   * GET TALENTS
   * ------------------------------------------------
   *
   * The work stores talentId.
   * We then fetch the corresponding
   * talents/{uid} document.
   */

  const talentResults =
    await Promise.all(
      works.map(
        async (work) => {
          const talentId =
            normalizeString(
              work.talentId
            );

          if (!talentId) {
            return null;
          }

          const talentRef =
            doc(
              db,
              TALENTS_COLLECTION,
              talentId
            );

          const talentSnapshot =
            await getDoc(
              talentRef
            );

          if (
            !talentSnapshot.exists()
          ) {
            return null;
          }

          return {
            ...normalizeWork(
              work
            ),

            talent:
              normalizeTalent({
                id:
                  talentSnapshot.id,
                ...talentSnapshot.data(),
              }),
          };
        }
      )
    );

  return talentResults.filter(
    Boolean
  );
}

/*
 * --------------------------------------------------
 * TOGGLE WORK LIKE
 * --------------------------------------------------
 *
 * Firebase transaction.
 *
 * The caller must already be authenticated
 * through the actions layer.
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

  const {
    db,
  } =
    await getServerFirebase();

  const workRef =
    doc(
      db,
      WORKS_COLLECTION,
      normalizedWorkId
    );

  const likeRef =
    doc(
      db,
      WORKS_COLLECTION,
      normalizedWorkId,
      "likes",
      normalizedUserId
    );

  return runTransaction(
    db,
    async (transaction) => {
      const [
        workSnapshot,
        likeSnapshot,
      ] =
        await Promise.all([
          transaction.get(
            workRef
          ),
          transaction.get(
            likeRef
          ),
        ]);

      if (
        !workSnapshot.exists()
      ) {
        throw new Error(
          "Work not found."
        );
      }

      const currentLikes =
        normalizeNumber(
          workSnapshot.data()
            ?.likes
        );

      if (
        likeSnapshot.exists()
      ) {
        const likes =
          Math.max(
            currentLikes - 1,
            0
          );

        transaction.delete(
          likeRef
        );

        transaction.update(
          workRef,
          {
            likes,
          }
        );

        return {
          liked: false,
          likes,
        };
      }

      const likes =
        currentLikes + 1;

      transaction.set(
        likeRef,
        {
          userId:
            normalizedUserId,
          createdAt:
            new Date(),
        }
      );

      transaction.update(
        workRef,
        {
          likes,
        }
      );

      return {
        liked: true,
        likes,
      };
    }
  );
}

/*
 * --------------------------------------------------
 * DELETE WORK
 * --------------------------------------------------
 *
 * Ownership is verified inside the transaction.
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

  const {
    db,
  } =
    await getServerFirebase();

  const workRef =
    doc(
      db,
      WORKS_COLLECTION,
      normalizedWorkId
    );

  const talentRef =
    doc(
      db,
      TALENTS_COLLECTION,
      normalizedUserId
    );

  await runTransaction(
    db,
    async (transaction) => {
      const [
        workSnapshot,
        talentSnapshot,
      ] =
        await Promise.all([
          transaction.get(
            workRef
          ),
          transaction.get(
            talentRef
          ),
        ]);

      if (
        !workSnapshot.exists()
      ) {
        throw new Error(
          "Work not found."
        );
      }

      const work =
        workSnapshot.data();

      const ownerId =
        normalizeString(
          work?.talentId
        );

      if (
        ownerId !==
        normalizedUserId
      ) {
        throw new Error(
          "You do not own this work."
        );
      }

      transaction.delete(
        workRef
      );

      if (
        talentSnapshot.exists()
      ) {
        const currentWorkCount =
          normalizeNumber(
            talentSnapshot.data()
              ?.workCount
          );

        transaction.update(
          talentRef,
          {
            workCount:
              Math.max(
                currentWorkCount - 1,
                0
              ),
          }
        );
      }
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
  WORKS_COLLECTION,
  TRENDING_WORKS_LIMIT,
  WORKS_CACHE_TAG,
  TRENDING_WORKS_CACHE_TAG,
  workCacheTag,
  talentWorksCacheTag,
  talentCacheTag,
  normalizeWork,
  normalizeTalent,
};