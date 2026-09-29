import {
  cacheLife,
  cacheTag,
  revalidateTag,
} from "next/cache";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  Timestamp,
  updateDoc,
  where,
  limit as firestoreLimit,
} from "firebase/firestore";

import {
  getPublicServerFirebase,
  getServerFirebase,
} from "@/lib/server";

/*
 * =========================================================
 * CONFIG
 * =========================================================
 */

const WORKS_COLLECTION = "works";
const TALENTS_COLLECTION = "talents";

const TRENDING_WORKS_LIMIT = 10;

/*
 * =========================================================
 * CACHE TAGS
 * =========================================================
 */

const WORKS_CACHE_TAG = "works";
const TRENDING_WORKS_CACHE_TAG = "trending-works";

function workCacheTag(workId) {
  return `work:${String(workId).trim()}`;
}

function talentWorksCacheTag(talentId) {
  return `talent-works:${String(talentId).trim()}`;
}

function talentCacheTag(talentId) {
  return `talent:${String(talentId).trim()}`;
}

/*
 * =========================================================
 * CACHE INVALIDATION
 * =========================================================
 */

function invalidateWorkCache(workId) {
  revalidateTag(WORKS_CACHE_TAG, "max");

  revalidateTag(
    TRENDING_WORKS_CACHE_TAG,
    "max",
  );

  revalidateTag(
    workCacheTag(workId),
    "max",
  );
}

function invalidateTalentWorksCache(talentId) {
  revalidateTag(WORKS_CACHE_TAG, "max");

  revalidateTag(
    talentWorksCacheTag(talentId),
    "max",
  );

  revalidateTag(
    talentCacheTag(talentId),
    "max",
  );
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}

function normalizeLikes(value) {
  const number = normalizeNumber(value);

  return Math.max(
    0,
    Math.floor(number),
  );
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

function normalizeLimit(
  limit,
  defaultLimit = TRENDING_WORKS_LIMIT,
) {
  const value = Number(limit);

  if (!Number.isFinite(value)) {
    return defaultLimit;
  }

  return Math.min(
    Math.max(Math.floor(value), 1),
    TRENDING_WORKS_LIMIT,
  );
}

/*
 * =========================================================
 * NORMALIZE WORK
 * =========================================================
 *
 * Public/cache-safe.
 *
 * IMPORTANT:
 *
 * The actual likes subcollection is never returned.
 *
 * `likes` is only the numeric count stored on the work
 * document.
 * =========================================================
 */

function normalizeWork(work) {
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
        work.talentId,
      ),

    talentName:
      normalizeString(
        work.talentName,
      ),

    talentUsername:
      normalizeString(
        work.talentUsername,
      ),

    title:
      normalizeString(
        work.title,
      ),

    categoryId:
      normalizeString(
        work.categoryId,
      ),

    category:
      normalizeString(
        work.category,
      ),

    description:
      normalizeString(
        work.description,
      ),

    image:
      typeof work.image === "string"
        ? work.image.trim()
        : "",

    likes:
      normalizeLikes(
        work.likes,
      ),

    createdAt:
      work.createdAt instanceof Timestamp
        ? work.createdAt.toMillis()
        : typeof work.createdAt === "number"
          ? work.createdAt
          : null,

    updatedAt:
      work.updatedAt instanceof Timestamp
        ? work.updatedAt.toMillis()
        : typeof work.updatedAt === "number"
          ? work.updatedAt
          : null,
  };
}

/*
 * =========================================================
 * SERIALIZE FIRESTORE WORK
 * =========================================================
 */

function serializeWorkDocument(document) {
  if (!document.exists()) {
    return null;
  }

  return normalizeWork({
    id: document.id,
    ...document.data(),
  });
}

/*
 * =========================================================
 * GET ALL WORKS
 * =========================================================
 */

export async function getWorks() {
  "use cache";

  cacheLife("minutes");

  cacheTag(WORKS_CACHE_TAG);

  const { db } =
    await getPublicServerFirebase();

  const worksQuery = query(
    collection(
      db,
      WORKS_COLLECTION,
    ),
    orderBy(
      "createdAt",
      "desc",
    ),
  );

  const snapshot =
    await getDocs(worksQuery);

  return snapshot.docs
    .map(serializeWorkDocument)
    .filter(Boolean);
}

/*
 * =========================================================
 * GET WORK BY ID
 * =========================================================
 */

export async function getWorkById(workId) {
  const normalizedWorkId =
    normalizeString(workId);

  if (!normalizedWorkId) {
    return null;
  }

  /*
   * Public/cache-safe lookup.
   */

  return getCachedWorkById(
    normalizedWorkId,
  );
}

async function getCachedWorkById(workId) {
  "use cache";

  cacheLife("minutes");

  cacheTag(WORKS_CACHE_TAG);

  cacheTag(
    workCacheTag(workId),
  );

  const { db } =
    await getPublicServerFirebase();

  const workRef = doc(
    db,
    WORKS_COLLECTION,
    workId,
  );

  const snapshot =
    await getDoc(workRef);

  return serializeWorkDocument(
    snapshot,
  );
}

/*
 * =========================================================
 * GET WORKS BY TALENT
 * =========================================================
 */

export async function getWorksByTalent(
  talentId,
) {
  const normalizedTalentId =
    normalizeString(talentId);

  if (!normalizedTalentId) {
    return [];
  }

  return getCachedWorksByTalent(
    normalizedTalentId,
  );
}

async function getCachedWorksByTalent(
  talentId,
) {
  "use cache";

  cacheLife("minutes");

  cacheTag(WORKS_CACHE_TAG);

  cacheTag(
    talentWorksCacheTag(talentId),
  );

  const { db } =
    await getPublicServerFirebase();

  const worksQuery = query(
    collection(
      db,
      WORKS_COLLECTION,
    ),
    where(
      "talentId",
      "==",
      talentId,
    ),
    orderBy(
      "createdAt",
      "desc",
    ),
  );

  const snapshot =
    await getDocs(worksQuery);

  return snapshot.docs
    .map(serializeWorkDocument)
    .filter(Boolean);
}

/*
 * =========================================================
 * GET TRENDING WORKS
 * =========================================================
 */

export async function getTrendingWorks(
  limit = TRENDING_WORKS_LIMIT,
) {
  "use cache";

  cacheLife("minutes");

  cacheTag(WORKS_CACHE_TAG);

  cacheTag(
    TRENDING_WORKS_CACHE_TAG,
  );

  const safeLimit =
    normalizeLimit(limit);

  const { db } =
    await getPublicServerFirebase();

  const worksQuery = query(
    collection(
      db,
      WORKS_COLLECTION,
    ),
    orderBy(
      "likes",
      "desc",
    ),
    orderBy(
      "createdAt",
      "desc",
    ),
    firestoreLimit(safeLimit),
  );

  const snapshot =
    await getDocs(worksQuery);

  const works =
    snapshot.docs
      .map(serializeWorkDocument)
      .filter(Boolean);

  /*
   * -------------------------------------------------------
   * Attach public talent information
   * -------------------------------------------------------
   */

  const result =
    await Promise.all(
      works.map(async (work) => {
        if (!work?.talentId) {
          return null;
        }

        const talentRef = doc(
          db,
          TALENTS_COLLECTION,
          work.talentId,
        );

        const talentSnapshot =
          await getDoc(talentRef);

        if (
          !talentSnapshot.exists()
        ) {
          return null;
        }

        const talent =
          talentSnapshot.data();

        return {
          ...work,

          talent: {
            id:
              talentSnapshot.id,

            uid:
              typeof talent.uid ===
              "string"
                ? talent.uid
                : talentSnapshot.id,

            username:
              normalizeString(
                talent.username,
              ),

            displayName:
              normalizeString(
                talent.displayName,
              ),

            role:
              normalizeString(
                talent.role,
              ),

            categoryId:
              normalizeString(
                talent.categoryId,
              ),

            category:
              normalizeString(
                talent.category,
              ),

            province:
              normalizeString(
                talent.province,
              ),

            district:
              normalizeString(
                talent.district,
              ),

            bio:
              normalizeString(
                talent.bio,
              ),

            avatar:
              typeof talent.avatar ===
              "string"
                ? talent.avatar
                : "",

            skills:
              normalizeStringArray(
                talent.skills,
              ),

            services:
              Array.isArray(
                talent.services,
              )
                ? talent.services
                : [],

            available:
              normalizeBoolean(
                talent.available,
              ),

            verified:
              normalizeBoolean(
                talent.verified,
              ),

            workCount:
              normalizeNumber(
                talent.workCount,
              ),
          },
        };
      }),
    );

  return result.filter(Boolean);
}

/*
 * =========================================================
 * CREATE WORK
 * =========================================================
 *
 * AUTHENTICATION:
 *
 * The caller must provide the authenticated user's UID.
 *
 * SECURITY:
 *
 * The talent document must exist and belong to that UID.
 *
 * TRANSACTION:
 *
 * Work creation + talent workCount increment happen
 * atomically.
 * =========================================================
 */

export async function createWork({
  userId,
  title,
  description = "",
  category = "",
  categoryId = "",
  image = "",
}) {
  const normalizedUserId =
    normalizeString(userId);

  const normalizedTitle =
    normalizeString(title);

  const normalizedDescription =
    normalizeString(description);

  const normalizedCategory =
    normalizeString(category);

  const normalizedCategoryId =
    normalizeString(categoryId);

  const normalizedImage =
    normalizeString(image);

  if (!normalizedUserId) {
    throw new Error(
      "User ID is required.",
    );
  }

  if (!normalizedTitle) {
    throw new Error(
      "Work title is required.",
    );
  }

  const { db } =
    await getServerFirebase();

  const talentRef = doc(
    db,
    TALENTS_COLLECTION,
    normalizedUserId,
  );

  const workRef = doc(
    collection(
      db,
      WORKS_COLLECTION,
    ),
  );

  const createdAt =
    Timestamp.now();

  let createdWork = null;

  await runTransaction(
    db,
    async (transaction) => {
      const talentSnapshot =
        await transaction.get(
          talentRef,
        );

      if (
        !talentSnapshot.exists()
      ) {
        throw new Error(
          "Profile not found.",
        );
      }

      const talent =
        talentSnapshot.data();

      const talentUid =
        normalizeString(
          talent?.uid,
        );

      if (
        talentUid &&
        talentUid !==
          normalizedUserId
      ) {
        throw new Error(
          "You do not own this profile.",
        );
      }

      const currentWorkCount =
        normalizeNumber(
          talent?.workCount,
        );

      const workData = {
        talentId:
          normalizedUserId,

        talentName:
          normalizeString(
            talent?.displayName,
          ),

        talentUsername:
          normalizeString(
            talent?.username,
          ),

        title:
          normalizedTitle,

        description:
          normalizedDescription,

        category:
          normalizedCategory,

        categoryId:
          normalizedCategoryId,

        image:
          normalizedImage,

        likes: 0,

        createdAt,

        updatedAt:
          createdAt,
      };

      transaction.set(
        workRef,
        workData,
      );

      transaction.update(
        talentRef,
        {
          workCount:
            currentWorkCount + 1,

          updatedAt:
            createdAt,
        },
      );

      createdWork =
        normalizeWork({
          id:
            workRef.id,

          ...workData,
        });
    },
  );

  invalidateWorkCache(
    workRef.id,
  );

  invalidateTalentWorksCache(
    normalizedUserId,
  );

  return createdWork;
}

/*
 * =========================================================
 * UPDATE WORK
 * =========================================================
 *
 * AUTHENTICATED USER ONLY.
 *
 * SECURITY:
 *
 * The authenticated UID is compared with work.talentId.
 *
 * The client cannot change talentId.
 *
 * Ownership remains attached to the original owner.
 * =========================================================
 */

export async function updateWork({
  workId,
  userId,
  title,
  description = "",
  category = "",
  categoryId = "",
  image = "",
}) {
  const normalizedWorkId =
    normalizeString(workId);

  const normalizedUserId =
    normalizeString(userId);

  const normalizedTitle =
    normalizeString(title);

  const normalizedDescription =
    normalizeString(description);

  const normalizedCategory =
    normalizeString(category);

  const normalizedCategoryId =
    normalizeString(categoryId);

  const normalizedImage =
    normalizeString(image);

  if (!normalizedWorkId) {
    throw new Error(
      "Work ID is required.",
    );
  }

  if (!normalizedUserId) {
    throw new Error(
      "User ID is required.",
    );
  }

  if (!normalizedTitle) {
    throw new Error(
      "Work title is required.",
    );
  }

  const { db } =
    await getServerFirebase();

  const workRef = doc(
    db,
    WORKS_COLLECTION,
    normalizedWorkId,
  );

  let updatedWork = null;
  let ownerTalentId =
    normalizedUserId;

  const updatedAt =
    Timestamp.now();

  await runTransaction(
    db,
    async (transaction) => {
      const workSnapshot =
        await transaction.get(
          workRef,
        );

      if (
        !workSnapshot.exists()
      ) {
        throw new Error(
          "Work not found.",
        );
      }

      const currentWork =
        workSnapshot.data();

      const ownerId =
        normalizeString(
          currentWork?.talentId,
        );

      if (
        ownerId !==
        normalizedUserId
      ) {
        throw new Error(
          "You do not own this work.",
        );
      }

      ownerTalentId =
        ownerId ||
        normalizedUserId;

      const workData = {
        title:
          normalizedTitle,

        description:
          normalizedDescription,

        category:
          normalizedCategory,

        categoryId:
          normalizedCategoryId,

        image:
          normalizedImage,

        updatedAt,
      };

      transaction.update(
        workRef,
        workData,
      );

      updatedWork =
        normalizeWork({
          id:
            workSnapshot.id,

          ...currentWork,

          ...workData,
        });
    },
  );

  invalidateWorkCache(
    normalizedWorkId,
  );

  invalidateTalentWorksCache(
    ownerTalentId,
  );

  return updatedWork;
}

/*
 * =========================================================
 * TOGGLE WORK LIKE
 * =========================================================
 *
 * LIKE STORAGE:
 *
 * works/{workId}/likes/{userId}
 *
 * WORK DOCUMENT:
 *
 * likes: number
 *
 * This avoids storing an ever-growing array of user IDs
 * inside the work document.
 *
 * The transaction guarantees that the like state and
 * numeric counter are changed together.
 * =========================================================
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
      "Work ID is required.",
    );
  }

  if (!normalizedUserId) {
    throw new Error(
      "User ID is required.",
    );
  }

  const { db } =
    await getServerFirebase();

  const workRef = doc(
    db,
    WORKS_COLLECTION,
    normalizedWorkId,
  );

  const likeRef = doc(
    db,
    WORKS_COLLECTION,
    normalizedWorkId,
    "likes",
    normalizedUserId,
  );

  const result =
    await runTransaction(
      db,
      async (transaction) => {
        /*
         * All reads happen before writes.
         */

        const workSnapshot =
          await transaction.get(
            workRef,
          );

        const likeSnapshot =
          await transaction.get(
            likeRef,
          );

        if (
          !workSnapshot.exists()
        ) {
          throw new Error(
            "Work not found.",
          );
        }

        const currentLikes =
          normalizeLikes(
            workSnapshot.data()
              ?.likes,
          );

        /*
         * ---------------------------------------------------
         * UNLIKE
         * ---------------------------------------------------
         */

        if (
          likeSnapshot.exists()
        ) {
          const likes =
            Math.max(
              currentLikes - 1,
              0,
            );

          transaction.delete(
            likeRef,
          );

          transaction.update(
            workRef,
            {
              likes,
              updatedAt:
                Timestamp.now(),
            },
          );

          return {
            liked: false,
            likes,
          };
        }

        /*
         * ---------------------------------------------------
         * LIKE
         * ---------------------------------------------------
         */

        const likes =
          currentLikes + 1;

        const now =
          Timestamp.now();

        transaction.set(
          likeRef,
          {
            userId:
              normalizedUserId,

            createdAt:
              now,
          },
        );

        transaction.update(
          workRef,
          {
            likes,
            updatedAt:
              now,
          },
        );

        return {
          liked: true,
          likes,
        };
      },
    );

  invalidateWorkCache(
    normalizedWorkId,
  );

  return result;
}

/*
 * =========================================================
 * GET WORK LIKE STATUS
 * =========================================================
 *
 * Returns:
 *
 * {
 *   liked: boolean,
 *   likes: number
 * }
 *
 * Useful when a page needs the current user's like state.
 * =========================================================
 */

export async function getWorkLikeStatus({
  workId,
  userId,
}) {
  const normalizedWorkId =
    normalizeString(workId);

  const normalizedUserId =
    normalizeString(userId);

  if (!normalizedWorkId) {
    throw new Error(
      "Work ID is required.",
    );
  }

  if (!normalizedUserId) {
    return {
      liked: false,
      likes: 0,
    };
  }

  const { db } =
    await getServerFirebase();

  const workRef = doc(
    db,
    WORKS_COLLECTION,
    normalizedWorkId,
  );

  const likeRef = doc(
    db,
    WORKS_COLLECTION,
    normalizedWorkId,
    "likes",
    normalizedUserId,
  );

  const [
    workSnapshot,
    likeSnapshot,
  ] = await Promise.all([
    getDoc(workRef),
    getDoc(likeRef),
  ]);

  if (
    !workSnapshot.exists()
  ) {
    throw new Error(
      "Work not found.",
    );
  }

  return {
    liked:
      likeSnapshot.exists(),

    likes:
      normalizeLikes(
        workSnapshot.data()
          ?.likes,
      ),
  };
}

/*
 * =========================================================
 * GET CURRENT USER WORK LIKES
 * =========================================================
 *
 * Returns:
 *
 * Set(["workId1", "workId2"])
 *
 * This is useful when rendering a list of works and the
 * client needs likedByMe without exposing like documents.
 * =========================================================
 */

export async function getCurrentUserWorkLikes(
  workIds = [],
  userId,
) {
  const normalizedUserId =
    normalizeString(userId);

  if (
    !normalizedUserId ||
    !Array.isArray(workIds) ||
    !workIds.length
  ) {
    return new Set();
  }

  const normalizedWorkIds = [
    ...new Set(
      workIds
        .filter(
          (id) =>
            typeof id === "string" &&
            id.trim(),
        )
        .map((id) =>
          id.trim(),
        ),
    ),
  ];

  if (!normalizedWorkIds.length) {
    return new Set();
  }

  const { db } =
    await getServerFirebase();

  const snapshots =
    await Promise.all(
      normalizedWorkIds.map(
        (workId) =>
          getDoc(
            doc(
              db,
              WORKS_COLLECTION,
              workId,
              "likes",
              normalizedUserId,
            ),
          ),
      ),
    );

  const likedIds = new Set();

  snapshots.forEach(
    (snapshot, index) => {
      if (
        snapshot.exists()
      ) {
        likedIds.add(
          normalizedWorkIds[index],
        );
      }
    },
  );

  return likedIds;
}

/*
 * =========================================================
 * DELETE WORK
 * =========================================================
 *
 * SECURITY:
 *
 * Ownership is checked inside the transaction.
 *
 * The authenticated user's UID must equal work.talentId.
 *
 * The talent workCount is decremented atomically.
 * =========================================================
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
      "Work ID is required.",
    );
  }

  if (!normalizedUserId) {
    throw new Error(
      "User ID is required.",
    );
  }

  const { db } =
    await getServerFirebase();

  const workRef = doc(
    db,
    WORKS_COLLECTION,
    normalizedWorkId,
  );

  const talentRef = doc(
    db,
    TALENTS_COLLECTION,
    normalizedUserId,
  );

  let talentId =
    normalizedUserId;

  await runTransaction(
    db,
    async (transaction) => {
      /*
       * All reads happen before writes.
       */

      const workSnapshot =
        await transaction.get(
          workRef,
        );

      const talentSnapshot =
        await transaction.get(
          talentRef,
        );

      if (
        !workSnapshot.exists()
      ) {
        throw new Error(
          "Work not found.",
        );
      }

      const work =
        workSnapshot.data();

      const ownerId =
        normalizeString(
          work?.talentId,
        );

      if (
        ownerId !==
        normalizedUserId
      ) {
        throw new Error(
          "You do not own this work.",
        );
      }

      talentId =
        ownerId ||
        normalizedUserId;

      transaction.delete(
        workRef,
      );

      if (
        talentSnapshot.exists()
      ) {
        const currentWorkCount =
          normalizeNumber(
            talentSnapshot.data()
              ?.workCount,
          );

        transaction.update(
          talentRef,
          {
            workCount:
              Math.max(
                currentWorkCount - 1,
                0,
              ),

            updatedAt:
              Timestamp.now(),
          },
        );
      }
    },
  );

  /*
   * -------------------------------------------------------
   * IMPORTANT
   * -------------------------------------------------------
   *
   * Deleting a Firestore document does NOT automatically
   * delete its subcollections.
   *
   * Therefore:
   *
   * works/{workId}/likes/*
   *
   * can remain as orphaned documents.
   *
   * The application no longer references them because the
   * parent work is gone.
   *
   * If you later want physical cleanup of every like
   * document, use a trusted backend cleanup process.
   */

  invalidateWorkCache(
    normalizedWorkId,
  );

  invalidateTalentWorksCache(
    talentId,
  );

  return {
    success: true,
  };
}

/*
 * =========================================================
 * EXPORTS
 * =========================================================
 */

export {
  WORKS_COLLECTION,
  TALENTS_COLLECTION,

  TRENDING_WORKS_LIMIT,

  WORKS_CACHE_TAG,
  TRENDING_WORKS_CACHE_TAG,

  workCacheTag,
  talentWorksCacheTag,
  talentCacheTag,

  normalizeWork,
};