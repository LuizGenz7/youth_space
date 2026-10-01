import {
  cacheLife,
  cacheTag,
  revalidateTag,
} from "next/cache";

import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  runTransaction,
  startAfter,
  Timestamp,
  where,
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

const WORKS_PER_LOAD = 8;
const DISCOVER_WORKS_LIMIT = 10;

const MAX_CATEGORY_ID_LENGTH = 128;
const MAX_CURSOR_LENGTH = 1000;

/*
 * =========================================================
 * CACHE TAGS
 * =========================================================
 */

const WORKS_CACHE_TAG = "works";

function categoryWorksCacheTag(categoryId) {
  return `category-works:${categoryId}`;
}

function talentWorksCacheTag(talentId) {
  return `talent-works:${talentId}`;
}

function workCacheTag(workId) {
  return `work:${workId}`;
}

/*
 * =========================================================
 * VALIDATION
 * =========================================================
 */

function normalizeCategoryId(categoryId) {
  if (typeof categoryId !== "string") {
    throw new Error("Invalid category ID.");
  }

  const normalized = categoryId.trim();

  if (
    !normalized ||
    normalized.length > MAX_CATEGORY_ID_LENGTH
  ) {
    throw new Error("Invalid category ID.");
  }

  return normalized;
}

function normalizeWorkId(workId) {
  if (
    typeof workId !== "string" ||
    !workId.trim()
  ) {
    throw new Error("Invalid work ID.");
  }

  return workId.trim();
}

function normalizeTalentId(talentId) {
  if (
    typeof talentId !== "string" ||
    !talentId.trim()
  ) {
    throw new Error("Invalid talent ID.");
  }

  return talentId.trim();
}

function normalizeCursor(cursor) {
  if (
    cursor === null ||
    cursor === undefined ||
    cursor === ""
  ) {
    return null;
  }

  if (typeof cursor !== "string") {
    throw new Error("Invalid pagination cursor.");
  }

  const normalized = cursor.trim();

  if (
    !normalized ||
    normalized.length > MAX_CURSOR_LENGTH
  ) {
    throw new Error("Invalid pagination cursor.");
  }

  return normalized;
}

/*
 * =========================================================
 * CURSOR HELPERS
 * =========================================================
 */

function encodeCursor({
  likes,
  createdAt,
  id,
}) {
  if (!Number.isFinite(likes)) {
    throw new Error(
      "Cannot create pagination cursor.",
    );
  }

  if (!(createdAt instanceof Timestamp)) {
    throw new Error(
      "Cannot create pagination cursor.",
    );
  }

  if (
    typeof id !== "string" ||
    !id
  ) {
    throw new Error(
      "Cannot create pagination cursor.",
    );
  }

  const payload = {
    version: 1,
    likes,
    createdAt: createdAt.toMillis(),
    id,
  };

  return Buffer.from(
    JSON.stringify(payload),
    "utf8",
  ).toString("base64url");
}

function decodeCursor(cursor) {
  const normalizedCursor =
    normalizeCursor(cursor);

  if (!normalizedCursor) {
    return null;
  }

  try {
    const decoded = Buffer.from(
      normalizedCursor,
      "base64url",
    ).toString("utf8");

    const payload = JSON.parse(decoded);

    if (
      payload?.version !== 1 ||
      !Number.isFinite(payload?.likes) ||
      !Number.isFinite(payload?.createdAt) ||
      typeof payload?.id !== "string" ||
      !payload.id
    ) {
      throw new Error(
        "Invalid pagination cursor.",
      );
    }

    return {
      likes: payload.likes,

      createdAt:
        Timestamp.fromMillis(
          payload.createdAt,
        ),

      id: payload.id,
    };
  } catch {
    throw new Error(
      "Invalid pagination cursor.",
    );
  }
}

/*
 * =========================================================
 * LIKE HELPERS
 * =========================================================
 */

function normalizeLikesArray(likes) {
  if (!Array.isArray(likes)) {
    return [];
  }

  return likes.filter(
    (like) =>
      like &&
      typeof like === "object" &&
      typeof like.userId === "string" &&
      like.userId.trim(),
  );
}

function getLikeCount(likes) {
  return normalizeLikesArray(likes).length;
}

function getStoredLikeCount(data) {
  if (
    Number.isFinite(data?.likeCount)
  ) {
    return Math.max(
      0,
      Math.floor(data.likeCount),
    );
  }

  return getLikeCount(
    data?.likes,
  );
}

function hasUserLiked(
  likes,
  userId,
) {
  if (
    !Array.isArray(likes) ||
    !userId
  ) {
    return false;
  }

  return likes.some(
    (like) =>
      like &&
      like.userId === userId,
  );
}

/*
 * =========================================================
 * WORK SERIALIZATION
 * =========================================================
 *
 * IMPORTANT:
 *
 * This function is public/cache-safe.
 *
 * It does NOT access the current authenticated user.
 *
 * likedByMe starts as false and is populated later by
 * addCurrentUserLikeState().
 *
 * Public work data does NOT expose:
 *
 * - categoryId
 * - likeCount
 * - raw likes[]
 * - nested talent document
 * =========================================================
 */

function serializeWork(snapshot) {
  const data = snapshot.data();

  const storedLikes =
    normalizeLikesArray(
      data.likes,
    );

  const likeCount =
    Number.isFinite(
      data.likeCount,
    )
      ? Math.max(
        0,
        Math.floor(
          data.likeCount,
        ),
      )
      : getLikeCount(
        storedLikes,
      );

  return {
    id:
      snapshot.id,

    talentId:
      data.talentId ??
      "",

    talentName:
      data.talentName ??
      "",

    talentUsername:
      data.talentUsername ??
      "",

    title:
      data.title ??
      "",

    category:
      data.category ??
      "",

    description:
      data.description ??
      "",

    image:
      data.image ??
      "",

    likes:
      likeCount,

    /*
     * This is replaced by the authenticated overlay.
     */
    likedByMe:
      false,

    createdAt:
      data.createdAt instanceof
        Timestamp
        ? data.createdAt.toMillis()
        : null,

    updatedAt:
      data.updatedAt instanceof
        Timestamp
        ? data.updatedAt.toMillis()
        : null,
  };
}

/*
 * =========================================================
 * ADD CURRENT USER LIKE STATE
 * =========================================================
 *
 * Same pattern used by talents.js.
 *
 * Public work data can be cached.
 *
 * User-specific like state cannot be cached globally.
 *
 * Therefore:
 *
 * 1. Get current authenticated user.
 * 2. Read the actual work documents.
 * 3. Check the likes[] array.
 * 4. Add likedByMe.
 *
 * The raw likes[] array is never returned to the client.
 * =========================================================
 */

async function addCurrentUserLikeState(
  works,
) {
  if (
    !Array.isArray(works) ||
    !works.length
  ) {
    return works ?? [];
  }

  const { auth, db } =
    await getServerFirebase();

  await auth.authStateReady();

  const user =
    auth.currentUser;

  /*
   * No authenticated user.
   */

  if (!user) {
    return works.map(
      (work) => ({
        ...work,
        likedByMe: false,
      }),
    );
  }

  const workIds = [
    ...new Set(
      works
        .map(
          (work) =>
            work?.id,
        )
        .filter(
          (id) =>
            typeof id ===
              "string" &&
            id.trim(),
        ),
    ),
  ];

  if (!workIds.length) {
    return works;
  }

  /*
   * Read the actual Firestore documents because
   * the cached public serializer does not expose likes[].
   */

  const snapshots =
    await Promise.all(
      workIds.map(
        (workId) =>
          getDoc(
            doc(
              db,
              WORKS_COLLECTION,
              workId,
            ),
          ),
      ),
    );

  const likedIds =
    new Set();

  snapshots.forEach(
    (
      snapshot,
      index,
    ) => {
      if (
        !snapshot.exists()
      ) {
        return;
      }

      const data =
        snapshot.data();

      const likes =
        normalizeLikesArray(
          data.likes,
        );

      /*
       * ACTUAL CURRENT USER CHECK
       */

      if (
        hasUserLiked(
          likes,
          user.uid,
        )
      ) {
        likedIds.add(
          workIds[index],
        );
      }
    },
  );

  return works.map(
    (work) => ({
      ...work,

      likedByMe:
        likedIds.has(
          work.id,
        ),
    }),
  );
}

/*
 * =========================================================
 * SINGLE WORK LIKE STATE
 * =========================================================
 */

async function addCurrentUserLikeStateToWork(
  work,
) {
  if (!work) {
    return null;
  }

  const result =
    await addCurrentUserLikeState([
      work,
    ]);

  return result[0] ?? null;
}

/*
 * =========================================================
 * QUERY WORKS
 * =========================================================
 */

async function queryWorksPage(
  db,
  {
    talentId = null,
    categoryId = null,
    limitCount = WORKS_PER_LOAD,
    cursor = null,
  } = {},
) {
  const safeLimit =
    Math.min(
      Math.max(
        Number(limitCount) ||
          WORKS_PER_LOAD,
        1,
      ),
      WORKS_PER_LOAD,
    );

  const normalizedTalentId =
    talentId
      ? normalizeTalentId(
        talentId,
      )
      : null;

  const normalizedCategoryId =
    categoryId
      ? normalizeCategoryId(
        categoryId,
      )
      : null;

  const decodedCursor =
    decodeCursor(cursor);

  const constraints = [];

  if (normalizedTalentId) {
    constraints.push(
      where(
        "talentId",
        "==",
        normalizedTalentId,
      ),
    );
  }

  if (normalizedCategoryId) {
    constraints.push(
      where(
        "categoryId",
        "==",
        normalizedCategoryId,
      ),
    );
  }

  constraints.push(
    orderBy(
      "likeCount",
      "desc",
    ),
  );

  constraints.push(
    orderBy(
      "createdAt",
      "desc",
    ),
  );

  constraints.push(
    orderBy(
      documentId(),
      "desc",
    ),
  );

  if (decodedCursor) {
    constraints.push(
      startAfter(
        decodedCursor.likes,
        decodedCursor.createdAt,
        decodedCursor.id,
      ),
    );
  }

  constraints.push(
    firestoreLimit(
      safeLimit,
    ),
  );

  const worksQuery =
    query(
      collection(
        db,
        WORKS_COLLECTION,
      ),
      ...constraints,
    );

  const snapshot =
    await getDocs(
      worksQuery,
    );

  const works =
    snapshot.docs.map(
      serializeWork,
    );

  const lastDocument =
    snapshot.docs.at(-1) ??
    null;

  let nextCursor =
    null;

  let lastItemId =
    null;

  if (lastDocument) {
    const lastData =
      lastDocument.data();

    const likes =
      getStoredLikeCount(
        lastData,
      );

    const createdAt =
      lastData.createdAt instanceof
        Timestamp
        ? lastData.createdAt
        : null;

    if (createdAt) {
      nextCursor =
        encodeCursor({
          likes,
          createdAt,
          id: lastDocument.id,
        });

      lastItemId =
        lastDocument.id;
    }
  }

  return {
    works,

    nextCursor,

    lastItemId,

    hasMore:
      snapshot.docs.length ===
      safeLimit,
  };
}

/*
 * =========================================================
 * CACHED CATEGORY WORKS
 * =========================================================
 */

async function getCachedCategoryWorks(
  categoryId,
  cursor = null,
) {
  "use cache";

  const normalizedCategoryId =
    normalizeCategoryId(
      categoryId,
    );

  cacheLife(
    "minutes",
  );

  cacheTag(
    categoryWorksCacheTag(
      normalizedCategoryId,
    ),
  );

  const { db } =
    await getPublicServerFirebase();

  return queryWorksPage(
    db,
    {
      categoryId:
        normalizedCategoryId,

      limitCount:
        WORKS_PER_LOAD,

      cursor,
    },
  );
}

/*
 * =========================================================
 * GET CATEGORY WORKS
 * =========================================================
 */

export async function getWorksByCategory(
  categoryId,
) {
  const data =
    await getCachedCategoryWorks(
      categoryId,
      null,
    );

  return {
    ...data,

    works:
      await addCurrentUserLikeState(
        data.works,
      ),
  };
}

/*
 * =========================================================
 * GET MORE CATEGORY WORKS
 * =========================================================
 */

export async function getMoreWorks({
  categoryId,
  cursor,
}) {
  const normalizedCategoryId =
    normalizeCategoryId(
      categoryId,
    );

  const normalizedCursor =
    normalizeCursor(
      cursor,
    );

  if (!normalizedCursor) {
    throw new Error(
      "A pagination cursor is required.",
    );
  }

  const { db } =
    await getPublicServerFirebase();

  const data =
    await queryWorksPage(
      db,
      {
        categoryId:
          normalizedCategoryId,

        limitCount:
          WORKS_PER_LOAD,

        cursor:
          normalizedCursor,
      },
    );

  return {
    ...data,

    works:
      await addCurrentUserLikeState(
        data.works,
      ),
  };
}

/*
 * =========================================================
 * GENERIC CATEGORY WORKS
 * =========================================================
 */

export async function getWorksByCategoryPage({
  categoryId,
  cursor = null,
}) {
  const normalizedCategoryId =
    normalizeCategoryId(
      categoryId,
    );

  const normalizedCursor =
    normalizeCursor(
      cursor,
    );

  if (normalizedCursor) {
    return getMoreWorks({
      categoryId:
        normalizedCategoryId,

      cursor:
        normalizedCursor,
    });
  }

  return getWorksByCategory(
    normalizedCategoryId,
  );
}

/*
 * =========================================================
 * CACHED WORKS BY TALENT
 * =========================================================
 */

async function getCachedWorksByTalent(
  talentId,
) {
  "use cache";

  const normalizedTalentId =
    normalizeTalentId(
      talentId,
    );

  cacheLife(
    "minutes",
  );

  cacheTag(
    talentWorksCacheTag(
      normalizedTalentId,
    ),
  );

  const { db } =
    await getPublicServerFirebase();

  return queryWorksPage(
    db,
    {
      talentId:
        normalizedTalentId,

      limitCount:
        WORKS_PER_LOAD,
    },
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
  const data =
    await getCachedWorksByTalent(
      talentId,
    );

  return {
    ...data,

    works:
      await addCurrentUserLikeState(
        data.works,
      ),
  };
}

/*
 * =========================================================
 * CACHED TOP WORKS
 * =========================================================
 */

async function getCachedTopWorks() {
  "use cache";

  cacheLife(
    "minutes",
  );

  cacheTag(
    WORKS_CACHE_TAG,
  );

  const { db } =
    await getPublicServerFirebase();

  const worksQuery =
    query(
      collection(
        db,
        WORKS_COLLECTION,
      ),

      orderBy(
        "likeCount",
        "desc",
      ),

      orderBy(
        "createdAt",
        "desc",
      ),

      orderBy(
        documentId(),
        "desc",
      ),

      firestoreLimit(
        DISCOVER_WORKS_LIMIT,
      ),
    );

  const snapshot =
    await getDocs(
      worksQuery,
    );

  return snapshot.docs.map(
    serializeWork,
  );
}

/*
 * =========================================================
 * TOP WORKS
 * =========================================================
 */

export async function getTrendingWorks() {
  const works =
    await getCachedTopWorks();

  return addCurrentUserLikeState(
    works,
  );
}

/*
 * =========================================================
 * CACHED NEW WORKS
 * =========================================================
 */

async function getCachedNewWorks() {
  "use cache";

  cacheLife(
    "minutes",
  );

  cacheTag(
    WORKS_CACHE_TAG,
  );

  const { db } =
    await getPublicServerFirebase();

  const worksQuery =
    query(
      collection(
        db,
        WORKS_COLLECTION,
      ),

      orderBy(
        "createdAt",
        "desc",
      ),

      orderBy(
        documentId(),
        "desc",
      ),

      firestoreLimit(
        DISCOVER_WORKS_LIMIT,
      ),
    );

  const snapshot =
    await getDocs(
      worksQuery,
    );

  return snapshot.docs.map(
    serializeWork,
  );
}

/*
 * =========================================================
 * NEW WORKS
 * =========================================================
 */

export async function getNewWorks() {
  const works =
    await getCachedNewWorks();

  return addCurrentUserLikeState(
    works,
  );
}

/*
 * =========================================================
 * CACHED WORK BY ID
 * =========================================================
 */

async function getCachedWorkById(
  workId,
) {
  "use cache";

  const normalizedId =
    workId?.trim();

  if (
    typeof normalizedId !==
      "string" ||
    !normalizedId
  ) {
    return null;
  }

  cacheLife(
    "minutes",
  );

  cacheTag(
    workCacheTag(
      normalizedId,
    ),
  );

  const { db } =
    await getPublicServerFirebase();

  const workRef =
    doc(
      db,
      WORKS_COLLECTION,
      normalizedId,
    );

  const snapshot =
    await getDoc(
      workRef,
    );

  if (!snapshot.exists()) {
    return null;
  }

  return serializeWork(
    snapshot,
  );
}

/*
 * =========================================================
 * GET WORK BY ID
 * =========================================================
 */

export async function getWorkById(
  workId,
) {
  const work =
    await getCachedWorkById(
      workId,
    );

  return addCurrentUserLikeStateToWork(
    work,
  );
}

/*
 * =========================================================
 * GET WORK LIKE STATUS
 * =========================================================
 *
 * Same pattern as getTalentLikeStatus().
 * =========================================================
 */

export async function getWorkLikeStatus(
  workId,
) {
  const normalizedWorkId =
    normalizeWorkId(
      workId,
    );

  const { auth, db } =
    await getServerFirebase();

  await auth.authStateReady();

  const workRef =
    doc(
      db,
      WORKS_COLLECTION,
      normalizedWorkId,
    );

  const workSnapshot =
    await getDoc(
      workRef,
    );

  if (
    !workSnapshot.exists()
  ) {
    throw new Error(
      "Work not found.",
    );
  }

  const workData =
    workSnapshot.data();

  const likesArray =
    normalizeLikesArray(
      workData.likes,
    );

  const likes =
    Number.isFinite(
      workData.likeCount,
    )
      ? Math.max(
        0,
        Math.floor(
          workData.likeCount,
        ),
      )
      : getLikeCount(
        likesArray,
      );

  const user =
    auth.currentUser;

  if (!user) {
    return {
      liked: false,
      likes,
    };
  }

  return {
    liked:
      hasUserLiked(
        likesArray,
        user.uid,
      ),

    likes,
  };
}

/*
 * =========================================================
 * TOGGLE WORK LIKE
 * =========================================================
 *
 * Same pattern as toggleTalentLike().
 *
 * The client tells us the desired state:
 *
 * liked: true
 * liked: false
 * =========================================================
 */

export async function toggleWorkLike({
  workId,
  liked,
}) {
  const normalizedWorkId =
    normalizeWorkId(
      workId,
    );

  if (
    typeof liked !==
    "boolean"
  ) {
    throw new Error(
      "Invalid like state.",
    );
  }

  const { auth, db } =
    await getServerFirebase();

  await auth.authStateReady();

  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "Authentication required.",
    );
  }

  const userId =
    user.uid;

  const workRef =
    doc(
      db,
      WORKS_COLLECTION,
      normalizedWorkId,
    );

  const result =
    await runTransaction(
      db,
      async (
        transaction,
      ) => {
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

        const workData =
          workSnapshot.data();

        const talentId =
          workData.talentId ??
          null;

        const currentLikes =
          normalizeLikesArray(
            workData.likes,
          );

        const alreadyLiked =
          hasUserLiked(
            currentLikes,
            userId,
          );

        /*
         * ===================================================
         * LIKE
         * ===================================================
         */

        if (liked) {
          if (alreadyLiked) {
            return {
              liked: true,

              likes:
                Number.isFinite(
                  workData.likeCount,
                )
                  ? Math.max(
                    0,
                    Math.floor(
                      workData.likeCount,
                    ),
                  )
                  : currentLikes.length,

              talentId,
            };
          }

          const now =
            Timestamp.now();

          const newLike = {
            userId,

            createdAt:
              now,

            updatedAt:
              now,
          };

          const nextLikes = [
            ...currentLikes,
            newLike,
          ];

          transaction.update(
            workRef,
            {
              likes:
                nextLikes,

              likeCount:
                nextLikes.length,

              updatedAt:
                now,
            },
          );

          return {
            liked: true,

            likes:
              nextLikes.length,

            talentId,
          };
        }

        /*
         * ===================================================
         * UNLIKE
         * ===================================================
         */

        if (!alreadyLiked) {
          return {
            liked: false,

            likes:
              Number.isFinite(
                workData.likeCount,
              )
                ? Math.max(
                  0,
                  Math.floor(
                    workData.likeCount,
                  ),
                )
                : currentLikes.length,

            talentId,
          };
        }

        const now =
          Timestamp.now();

        const nextLikes =
          currentLikes.filter(
            (like) =>
              like.userId !==
              userId,
          );

        transaction.update(
          workRef,
          {
            likes:
              nextLikes,

            likeCount:
              nextLikes.length,

            updatedAt:
              now,
          },
        );

        return {
          liked: false,

          likes:
            nextLikes.length,

          talentId,
        };
      },
    );

  /*
   * =======================================================
   * CACHE INVALIDATION
   * =======================================================
   */

  revalidateTag(
    workCacheTag(
      normalizedWorkId,
    ),
    "max",
  );

  revalidateTag(
    WORKS_CACHE_TAG,
    "max",
  );

  if (result.talentId) {
    revalidateTag(
      talentWorksCacheTag(
        result.talentId,
      ),
      "max",
    );
  }

  return {
    success: true,

    liked:
      result.liked,

    likes:
      result.likes,
  };
}

/*
 * =========================================================
 * GET CURRENT USER WORK LIKES
 * =========================================================
 *
 * Returns a Set of work IDs that the current user
 * has liked.
 *
 * Example:
 *
 * Firestore:
 *
 * likes: [
 *   { userId: "ABC" },
 *   { userId: "XYZ" },
 * ]
 *
 * Current user:
 *
 * user.uid === "XYZ"
 *
 * Result:
 *
 * Set(["work-id"])
 * =========================================================
 */

export async function getCurrentUserWorkLikes(
  workIds = [],
) {
  if (
    !Array.isArray(workIds) ||
    !workIds.length
  ) {
    return new Set();
  }

  const { auth, db } =
    await getServerFirebase();

  await auth.authStateReady();

  const user =
    auth.currentUser;

  if (!user) {
    return new Set();
  }

  const normalizedIds = [
    ...new Set(
      workIds
        .filter(
          (id) =>
            typeof id ===
              "string" &&
            id.trim(),
        )
        .map(
          (id) =>
            id.trim(),
        ),
    ),
  ];

  if (
    !normalizedIds.length
  ) {
    return new Set();
  }

  const workSnapshots =
    await Promise.all(
      normalizedIds.map(
        (workId) =>
          getDoc(
            doc(
              db,
              WORKS_COLLECTION,
              workId,
            ),
          ),
      ),
    );

  const likedIds =
    new Set();

  workSnapshots.forEach(
    (
      snapshot,
      index,
    ) => {
      if (
        !snapshot.exists()
      ) {
        return;
      }

      const data =
        snapshot.data();

      const likes =
        normalizeLikesArray(
          data.likes,
        );

      /*
       * CURRENT USER CHECK
       */

      const liked =
        hasUserLiked(
          likes,
          user.uid,
        );

      if (liked) {
        likedIds.add(
          normalizedIds[index],
        );
      }
    },
  );

  return likedIds;
}

/*
 * =========================================================
 * CREATE WORK
 * =========================================================
 */

export async function createWork({
  talentId,
  talentName,
  talentUsername,
  title,
  description,
  category,
  categoryId,
  image,
}) {
  const normalizedTalentId =
    normalizeTalentId(
      talentId,
    );

  const normalizedTitle =
    typeof title === "string"
      ? title.trim()
      : "";

  const normalizedDescription =
    typeof description === "string"
      ? description.trim()
      : "";

  const normalizedCategory =
    typeof category === "string"
      ? category.trim()
      : "";

  const normalizedCategoryId =
    normalizeCategoryId(
      categoryId,
    );

  const normalizedImage =
    typeof image === "string"
      ? image.trim()
      : "";

  if (!normalizedTitle) {
    throw new Error(
      "Work title is required.",
    );
  }

  if (!normalizedDescription) {
    throw new Error(
      "Work description is required.",
    );
  }

  const { auth, db } =
    await getServerFirebase();

  await auth.authStateReady();

  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "Authentication required.",
    );
  }

  if (
    user.uid !==
    normalizedTalentId
  ) {
    throw new Error(
      "You can only create work for your own talent profile.",
    );
  }

  const now =
    Timestamp.now();

  const workRef =
    doc(
      collection(
        db,
        WORKS_COLLECTION,
      ),
    );

  const workData = {
    id:
      workRef.id,

    talentId:
      normalizedTalentId,

    talentName:
      typeof talentName ===
        "string"
        ? talentName.trim()
        : "",

    talentUsername:
      typeof talentUsername ===
        "string"
        ? talentUsername
          .trim()
          .toLowerCase()
        : "",

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

    likeCount:
      0,

    likes:
      [],

    createdAt:
      now,

    updatedAt:
      now,
  };

  await runTransaction(
    db,
    async (
      transaction,
    ) => {
      const talentRef =
        doc(
          db,
          TALENTS_COLLECTION,
          normalizedTalentId,
        );

      const talentSnapshot =
        await transaction.get(
          talentRef,
        );

      if (
        !talentSnapshot.exists()
      ) {
        throw new Error(
          "Talent profile not found.",
        );
      }

      const talentData =
        talentSnapshot.data();

      const currentWorkCount =
        Number.isFinite(
          talentData.workCount,
        )
          ? Math.max(
            0,
            Math.floor(
              talentData.workCount,
            ),
          )
          : 0;

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
            now,
        },
      );
    },
  );

  revalidateTag(
    WORKS_CACHE_TAG,
    "max",
  );

  revalidateTag(
    categoryWorksCacheTag(
      normalizedCategoryId,
    ),
    "max",
  );

  revalidateTag(
    talentWorksCacheTag(
      normalizedTalentId,
    ),
    "max",
  );

  revalidateTag(
    `talent:${normalizedTalentId}`,
    "max",
  );

  return {
    id:
      workRef.id,

    talentId:
      workData.talentId,

    talentName:
      workData.talentName,

    talentUsername:
      workData.talentUsername,

    title:
      workData.title,

    category:
      workData.category,

    description:
      workData.description,

    image:
      workData.image,

    likes:
      0,

    likedByMe:
      false,

    createdAt:
      now.toMillis(),

    updatedAt:
      now.toMillis(),
  };
}

/*
 * =========================================================
 * UPDATE WORK
 * =========================================================
 */

export async function updateWork({
  workId,
  title,
  description,
  category,
  categoryId,
  image,
}) {
  const normalizedWorkId =
    normalizeWorkId(
      workId,
    );

  const normalizedTitle =
    typeof title === "string"
      ? title.trim()
      : "";

  const normalizedDescription =
    typeof description === "string"
      ? description.trim()
      : "";

  const normalizedCategory =
    typeof category === "string"
      ? category.trim()
      : "";

  const normalizedCategoryId =
    normalizeCategoryId(
      categoryId,
    );

  const normalizedImage =
    typeof image === "string"
      ? image.trim()
      : "";

  if (!normalizedTitle) {
    throw new Error(
      "Work title is required.",
    );
  }

  if (!normalizedDescription) {
    throw new Error(
      "Work description is required.",
    );
  }

  const { auth, db } =
    await getServerFirebase();

  await auth.authStateReady();

  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "Authentication required.",
    );
  }

  const workRef =
    doc(
      db,
      WORKS_COLLECTION,
      normalizedWorkId,
    );

  const workSnapshot =
    await getDoc(
      workRef,
    );

  if (
    !workSnapshot.exists()
  ) {
    throw new Error(
      "Work not found.",
    );
  }

  const workData =
    workSnapshot.data();

  if (
    workData.talentId !==
    user.uid
  ) {
    throw new Error(
      "You can only update your own work.",
    );
  }

  const previousCategoryId =
    workData.categoryId ??
    "";

  const now =
    Timestamp.now();

  await runTransaction(
    db,
    async (
      transaction,
    ) => {
      const currentSnapshot =
        await transaction.get(
          workRef,
        );

      if (
        !currentSnapshot.exists()
      ) {
        throw new Error(
          "Work not found.",
        );
      }

      const currentData =
        currentSnapshot.data();

      transaction.update(
        workRef,
        {
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

          /*
           * Preserve the existing likes.
           */
          likes:
            normalizeLikesArray(
              currentData.likes,
            ),

          likeCount:
            getStoredLikeCount(
              currentData,
            ),

          updatedAt:
            now,
        },
      );
    },
  );

  revalidateTag(
    workCacheTag(
      normalizedWorkId,
    ),
    "max",
  );

  revalidateTag(
    WORKS_CACHE_TAG,
    "max",
  );

  revalidateTag(
    categoryWorksCacheTag(
      previousCategoryId,
    ),
    "max",
  );

  revalidateTag(
    categoryWorksCacheTag(
      normalizedCategoryId,
    ),
    "max",
  );

  if (workData.talentId) {
    revalidateTag(
      talentWorksCacheTag(
        workData.talentId,
      ),
      "max",
    );
  }

  const updatedSnapshot =
    await getDoc(
      workRef,
    );

  const updatedWork =
    serializeWork(
      updatedSnapshot,
    );

  return addCurrentUserLikeStateToWork(
    updatedWork,
  );
}

/*
 * =========================================================
 * DELETE WORK
 * =========================================================
 */

export async function deleteWork(
  workId,
) {
  const normalizedWorkId =
    normalizeWorkId(
      workId,
    );

  const { auth, db } =
    await getServerFirebase();

  await auth.authStateReady();

  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "Authentication required.",
    );
  }

  const workRef =
    doc(
      db,
      WORKS_COLLECTION,
      normalizedWorkId,
    );

  const result =
    await runTransaction(
      db,
      async (
        transaction,
      ) => {
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

        const workData =
          workSnapshot.data();

        if (
          workData.talentId !==
          user.uid
        ) {
          throw new Error(
            "You can only delete your own work.",
          );
        }

        const talentId =
          workData.talentId ??
          null;

        const categoryId =
          workData.categoryId ??
          null;

        const talentRef =
          talentId
            ? doc(
              db,
              TALENTS_COLLECTION,
              talentId,
            )
            : null;

        let currentWorkCount =
          0;

        if (talentRef) {
          const talentSnapshot =
            await transaction.get(
              talentRef,
            );

          if (
            talentSnapshot.exists()
          ) {
            const talentData =
              talentSnapshot.data();

            currentWorkCount =
              Number.isFinite(
                talentData.workCount,
              )
                ? Math.max(
                  0,
                  Math.floor(
                    talentData.workCount,
                  ),
                )
                : 0;
          }
        }

        transaction.delete(
          workRef,
        );

        if (talentRef) {
          transaction.update(
            talentRef,
            {
              workCount:
                Math.max(
                  0,
                  currentWorkCount - 1,
                ),

              updatedAt:
                Timestamp.now(),
            },
          );
        }

        return {
          talentId,
          categoryId,
        };
      },
    );

  revalidateTag(
    workCacheTag(
      normalizedWorkId,
    ),
    "max",
  );

  revalidateTag(
    WORKS_CACHE_TAG,
    "max",
  );

  if (result.talentId) {
    revalidateTag(
      talentWorksCacheTag(
        result.talentId,
      ),
      "max",
    );

    revalidateTag(
      `talent:${result.talentId}`,
      "max",
    );
  }

  if (result.categoryId) {
    revalidateTag(
      categoryWorksCacheTag(
        result.categoryId,
      ),
      "max",
    );
  }

  return {
    success: true,
    workId:
      normalizedWorkId,
  };
}

/*
 * =========================================================
 * NORMALIZE WORK
 * =========================================================
 */

export function normalizeWork(
  work,
) {
  if (!work) {
    return null;
  }

  /*
   * Already serialized public work.
   */
  if (
    typeof work.id === "string" &&
    !work.data
  ) {
    return {
      id:
        work.id,

      talentId:
        work.talentId ??
        "",

      talentName:
        work.talentName ??
        "",

      talentUsername:
        work.talentUsername ??
        "",

      title:
        work.title ??
        "",

      category:
        work.category ??
        "",

      description:
        work.description ??
        "",

      image:
        work.image ??
        "",

      likes:
        Number(
          work.likes ??
          0,
        ),

      likedByMe:
        Boolean(
          work.likedByMe,
        ),

      createdAt:
        work.createdAt ??
        null,

      updatedAt:
        work.updatedAt ??
        null,
    };
  }

  /*
   * Firestore snapshot.
   */
  if (
    typeof work.data ===
    "function"
  ) {
    return serializeWork(
      work,
    );
  }

  return null;
}