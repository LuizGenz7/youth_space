import {
  cacheLife,
  cacheTag,
} from "next/cache";

import {
  FieldValue,
  getFirestore,
} from "firebase-admin/firestore";

import { adminApp } from "@/lib/firebase-admin";

const db = getFirestore(adminApp);

const WORKS_COLLECTION = "works";
const TALENTS_COLLECTION = "talents";

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
  return `work:${String(workId).trim()}`;
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
 * IMPORTANT:
 *
 * We intentionally DO NOT spread:
 *
 * ...doc.data()
 *
 * Only fields explicitly listed below can
 * leave Firestore.
 *
 * createdAt / updatedAt are NOT returned.
 * --------------------------------------------------
 */

function normalizeWork(doc) {
  if (!doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    id: doc.id,

    talentId:
      normalizeString(
        data.talentId
      ),

    title:
      normalizeString(
        data.title
      ),

    categoryId:
      normalizeString(
        data.categoryId
      ),

    category:
      normalizeString(
        data.category
      ),

    description:
      normalizeString(
        data.description
      ),

    image:
      typeof data.image === "string"
        ? data.image
        : "",

    likes:
      normalizeNumber(
        data.likes
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

function normalizeTalent(doc) {
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

    avatar:
      typeof data.avatar ===
      "string"
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
 * GET ALL WORKS
 * --------------------------------------------------
 *
 * createdAt is used only for sorting.
 *
 * It is NEVER returned to the app.
 * --------------------------------------------------
 */

export async function getWorks() {
  "use cache";

  cacheLife("minutes");

  cacheTag(
    WORKS_CACHE_TAG
  );

  const snapshot =
    await db
      .collection(
        WORKS_COLLECTION
      )
      .orderBy(
        "createdAt",
        "desc"
      )
      .get();

  return snapshot.docs
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

  const snapshot =
    await db
      .collection(
        WORKS_COLLECTION
      )
      .doc(
        normalizedWorkId
      )
      .get();

  return normalizeWork(
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

  const snapshot =
    await db
      .collection(
        WORKS_COLLECTION
      )
      .where(
        "talentId",
        "==",
        normalizedTalentId
      )
      .orderBy(
        "createdAt",
        "desc"
      )
      .get();

  return snapshot.docs
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

  const snapshot =
    await db
      .collection(
        WORKS_COLLECTION
      )
      .orderBy(
        "likes",
        "desc"
      )
      .limit(
        safeLimit
      )
      .get();

  const works =
    snapshot.docs
      .map(normalizeWork)
      .filter(Boolean);

  /*
   * ------------------------------------------------
   * FIND TALENT IDS
   * ------------------------------------------------
   */

  const talentIds = [
    ...new Set(
      works
        .map(
          (work) =>
            work.talentId
        )
        .filter(Boolean)
        .map(String)
    ),
  ];

  if (!talentIds.length) {
    return works;
  }

  /*
   * ------------------------------------------------
   * LOAD TALENTS
   * ------------------------------------------------
   */

  const talentRefs =
    talentIds.map(
      (talentId) =>
        db
          .collection(
            TALENTS_COLLECTION
          )
          .doc(talentId)
    );

  const talentDocs =
    await db.getAll(
      ...talentRefs
    );

  const talentMap =
    new Map();

  talentDocs.forEach(
    (doc) => {
      const talent =
        normalizeTalent(doc);

      if (!talent) {
        return;
      }

      talentMap.set(
        doc.id,
        talent
      );
    }
  );

  /*
   * ------------------------------------------------
   * COMBINE WORK + TALENT
   * ------------------------------------------------
   */

  return works
    .map((work) => {
      const talent =
        talentMap.get(
          String(
            work.talentId
          )
        );

      if (!talent) {
        return null;
      }

      return {
        ...work,
        talent,
      };
    })
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * TOGGLE WORK LIKE
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

  const workRef =
    db
      .collection(
        WORKS_COLLECTION
      )
      .doc(
        normalizedWorkId
      );

  const likeRef =
    workRef
      .collection("likes")
      .doc(
        normalizedUserId
      );

  const result =
    await db.runTransaction(
      async (transaction) => {
        const workSnapshot =
          await transaction.get(
            workRef
          );

        if (
          !workSnapshot.exists
        ) {
          throw new Error(
            "Work not found."
          );
        }

        const likeSnapshot =
          await transaction.get(
            likeRef
          );

        const alreadyLiked =
          likeSnapshot.exists;

        const workData =
          workSnapshot.data();

        const currentLikes =
          normalizeNumber(
            workData?.likes
          );

        /*
         * --------------------------------------------
         * REMOVE LIKE
         * --------------------------------------------
         */

        if (alreadyLiked) {
          transaction.delete(
            likeRef
          );

          const likes =
            Math.max(
              currentLikes - 1,
              0
            );

          transaction.update(
            workRef,
            {
              likes,

              updatedAt:
                FieldValue.serverTimestamp(),
            }
          );

          return {
            liked: false,
            likes,
          };
        }

        /*
         * --------------------------------------------
         * ADD LIKE
         * --------------------------------------------
         */

        transaction.set(
          likeRef,
          {
            userId:
              normalizedUserId,

            workId:
              normalizedWorkId,

            createdAt:
              FieldValue.serverTimestamp(),
          }
        );

        const likes =
          currentLikes + 1;

        transaction.update(
          workRef,
          {
            likes,

            updatedAt:
              FieldValue.serverTimestamp(),
          }
        );

        return {
          liked: true,
          likes,
        };
      }
    );

  return {
    liked:
      result?.liked === true,

    likes:
      normalizeNumber(
        result?.likes
      ),
  };
}

/*
 * --------------------------------------------------
 * DELETE WORK
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

  const workRef =
    db
      .collection(
        WORKS_COLLECTION
      )
      .doc(
        normalizedWorkId
      );

  /*
   * ------------------------------------------------
   * GET WORK
   * ------------------------------------------------
   */

  const workSnapshot =
    await workRef.get();

  if (!workSnapshot.exists) {
    throw new Error(
      "Work not found."
    );
  }

  const work =
    workSnapshot.data();

  /*
   * ------------------------------------------------
   * OWNERSHIP
   * ------------------------------------------------
   */

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

  /*
   * ------------------------------------------------
   * TALENT REFERENCE
   * ------------------------------------------------
   */

  const talentRef =
    db
      .collection(
        TALENTS_COLLECTION
      )
      .doc(
        normalizedUserId
      );

  /*
   * ------------------------------------------------
   * DELETE LIKES
   * ------------------------------------------------
   */

  const likesSnapshot =
    await workRef
      .collection("likes")
      .get();

  const batch =
    db.batch();

  likesSnapshot.docs.forEach(
    (likeDoc) => {
      batch.delete(
        likeDoc.ref
      );
    }
  );

  /*
   * ------------------------------------------------
   * DELETE WORK
   * ------------------------------------------------
   */

  batch.delete(
    workRef
  );

  /*
   * ------------------------------------------------
   * UPDATE TALENT WORK COUNT
   * ------------------------------------------------
   *
   * Keep the denormalized workCount
   * synchronized when possible.
   * ------------------------------------------------
   */

  const talentSnapshot =
    await talentRef.get();

  if (talentSnapshot.exists) {
    const talentData =
      talentSnapshot.data();

    const currentWorkCount =
      normalizeNumber(
        talentData?.workCount
      );

    batch.update(
      talentRef,
      {
        workCount:
          Math.max(
            currentWorkCount - 1,
            0
          ),

        updatedAt:
          FieldValue.serverTimestamp(),
      }
    );
  }

  await batch.commit();

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