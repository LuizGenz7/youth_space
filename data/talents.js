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
  increment,
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

import {
  getCategories,
} from "@/data/categories";

/*
 * --------------------------------------------------
 * COLLECTIONS
 * --------------------------------------------------
 */

export const TALENTS_COLLECTION = "talents";
export const TALENT_LIKES_COLLECTION = "talentLikes";
export const CATEGORIES_COLLECTION = "categories";
export const USERNAMES_COLLECTION = "usernames";

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

export const TALENTS_CACHE_TAG = "talents";

export const talentCacheTag = (uid) =>
  `talent:${String(uid || "").trim()}`;

export const usernameCacheTag = (username) =>
  `talent-username:${String(username || "")
    .trim()
    .toLowerCase()}`;

export const categoryTalentsCacheTag = (categoryId) =>
  `category-talents:${String(categoryId || "")
    .trim()
    .toLowerCase()}`;

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeLowercase(value) {
  return normalizeString(value).toLowerCase();
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeBoolean(value) {
  return value === true;
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function safeLimit(
  value,
  fallback,
  maximum,
) {
  const number = Number(value);

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {
    return fallback;
  }

  return Math.min(number, maximum);
}

function emptyTalentResult() {
  return {
    talents: [],
    nextCursor: null,
    hasMore: false,
  };
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
      if (typeof service === "string") {
        return service.trim();
      }

      if (
        !service ||
        typeof service !== "object"
      ) {
        return null;
      }

      return {
        id: normalizeString(service.id),
        name: normalizeString(service.name),
        description: normalizeString(
          service.description,
        ),
        price: normalizeString(service.price),
      };
    })
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * SERIALIZATION
 * --------------------------------------------------
 */

export function serializeTalent(
  data,
  id = "",
) {
  const talentId = normalizeString(
    data?.uid ||
    data?.id ||
    id,
  );

  return {
    id: talentId,
    uid: talentId,

    username: normalizeString(
      data?.username,
    ),

    displayName: normalizeString(
      data?.displayName,
    ),

    role: normalizeString(
      data?.role,
    ),

    categoryId: normalizeString(
      data?.categoryId,
    ),

    category: normalizeString(
      data?.category,
    ),

    province: normalizeString(
      data?.province,
    ),

    district: normalizeString(
      data?.district,
    ),

    bio: normalizeString(
      data?.bio,
    ),

    phone: normalizeString(
      data?.phone,
    ),

    whatsapp: normalizeString(
      data?.whatsapp,
    ),

    avatar: normalizeString(
      data?.avatar,
    ),

    skills: normalizeArray(
      data?.skills,
    ),

    services: normalizeServices(
      data?.services,
    ),

    likes: Math.max(
      0,
      normalizeNumber(data?.likes),
    ),

    workCount: Math.max(
      0,
      normalizeNumber(data?.workCount),
    ),

    available: normalizeBoolean(
      data?.available,
    ),

    verified: normalizeBoolean(
      data?.verified,
    ),
  };
}

function serializeTalentDocument(
  snapshot,
) {
  if (!snapshot.exists()) {
    return null;
  }

  return serializeTalent(
    snapshot.data(),
    snapshot.id,
  );
}

/*
 * --------------------------------------------------
 * CATEGORY TALENTS
 * --------------------------------------------------
 *
 * Real Firestore cursor pagination.
 *
 * Cursor format:
 *
 * {
 *   likes: number,
 *   createdAt: number,
 *   id: string
 * }
 *
 * Talents are ordered by:
 *
 *   1. likes DESC
 *   2. createdAt DESC
 *   3. document ID DESC
 *
 * We encode the cursor before returning it so
 * Firebase Timestamp objects never cross the
 * Server Component / Client Component boundary.
 *
 * --------------------------------------------------
 */

function encodeCursor(
  likes,
  createdAt,
  id,
) {
  if (
    !Number.isFinite(
      Number(likes),
    ) ||
    !(createdAt instanceof Timestamp) ||
    !normalizeString(id)
  ) {
    return null;
  }

  return Buffer.from(
    JSON.stringify({
      likes: Number(likes),
      createdAt:
        createdAt.toMillis(),
      id: normalizeString(id),
    }),
  ).toString("base64url");
}

function decodeCursor(cursor) {
  if (
    !normalizeString(cursor)
  ) {
    return null;
  }

  try {
    const decoded =
      JSON.parse(
        Buffer.from(
          cursor,
          "base64url",
        ).toString("utf8"),
      );

    const likes =
      Number(decoded?.likes);

    const createdAt =
      Number(decoded?.createdAt);

    const id =
      normalizeString(decoded?.id);

    if (
      !Number.isFinite(likes) ||
      !Number.isFinite(createdAt) ||
      !id
    ) {
      return null;
    }

    return {
      likes,
      createdAt,
      id,
    };
  } catch {
    return null;
  }
}

async function queryCategoryTalentsPage(
  db,
  categoryId,
  {
    limitCount = TALENTS_PER_LOAD,
    cursor = null,
  } = {},
) {
  const normalizedCategoryId =
    normalizeString(categoryId);

  if (!normalizedCategoryId) {
    return emptyTalentResult();
  }

  const safeCount = safeLimit(
    limitCount,
    TALENTS_PER_LOAD,
    TALENTS_PER_LOAD,
  );

  const talentsRef = collection(
    db,
    TALENTS_COLLECTION,
  );

  const decodedCursor =
    decodeCursor(cursor);

  const queryConstraints = [
    where(
      "categoryId",
      "==",
      normalizedCategoryId,
    ),
    orderBy(
      "likes",
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
  ];

  if (decodedCursor) {
    queryConstraints.push(
      startAfter(
        decodedCursor.likes,

        Timestamp.fromMillis(
          decodedCursor.createdAt,
        ),

        decodedCursor.id,
      ),
    );
  }

  queryConstraints.push(
    firestoreLimit(safeCount),
  );

  const talentsQuery = query(
    talentsRef,
    ...queryConstraints,
  );

  const snapshot =
    await getDocs(talentsQuery);

  const talents =
    snapshot.docs
      .map((document) =>
        serializeTalentDocument(
          document,
        ),
      )
      .filter(Boolean);

  const lastDocument =
    snapshot.docs[
      snapshot.docs.length - 1
    ];

  const nextCursor =
    lastDocument
      ? encodeCursor(
          lastDocument.data()?.likes,
          lastDocument.data()?.createdAt,
          lastDocument.id,
        )
      : null;

  return {
    talents,
    nextCursor,
    hasMore:
      snapshot.docs.length ===
      safeCount,
  };
}

/*
 * --------------------------------------------------
 * INITIAL TALENTS
 * --------------------------------------------------
 */

export async function getInitialTalentsData() {
  "use cache";

  cacheLife("minutes");
  cacheTag(TALENTS_CACHE_TAG);

  /*
   * --------------------------------------------------
   * GET ALL CATEGORIES
   * --------------------------------------------------
   */

  const categories =
    await getCategories();

  if (!categories.length) {
    return {
      categories: [],
      talents: [],
    };
  }

  /*
   * --------------------------------------------------
   * SORT ALL CATEGORIES
   * --------------------------------------------------
   *
   * Categories with the most talents come first.
   */

  const sortedCategories =
    [...categories].sort(
      (a, b) =>
        normalizeNumber(
          b.totalTalents,
        ) -
        normalizeNumber(
          a.totalTalents,
        ),
    );

  /*
   * --------------------------------------------------
   * TOP 6 CATEGORIES
   * --------------------------------------------------
   *
   * Only these categories will fetch talents.
   */

  const topCategories =
    sortedCategories.slice(
      0,
      INITIAL_CATEGORIES_LIMIT,
    );

  /*
   * --------------------------------------------------
   * REMAINING CATEGORIES
   * --------------------------------------------------
   *
   * These categories will still be returned,
   * but their talents will NOT be fetched.
   */

  const remainingCategories =
    sortedCategories.slice(
      INITIAL_CATEGORIES_LIMIT,
    );

  /*
   * --------------------------------------------------
   * PUBLIC FIREBASE
   * --------------------------------------------------
   *
   * This function intentionally uses only the
   * public Firebase instance.
   *
   * No current user is required.
   * No authenticated user is read.
   */

  const { db } =
    await getPublicServerFirebase();

  /*
   * --------------------------------------------------
   * FETCH TOP TALENTS FOR TOP 6 CATEGORIES
   * --------------------------------------------------
   *
   * Each category gets up to 8 talents ordered by:
   *
   * likes DESC
   * createdAt DESC
   * document ID DESC
   *
   * Maximum:
   *
   * 6 × 8 = 48 talents
   */

  const topCategoryResults =
    await Promise.all(
      topCategories.map(
        async (category) => {
          const result =
            await queryCategoryTalentsPage(
              db,
              category.id,
              {
                limitCount:
                  TALENTS_PER_LOAD,
              },
            );

          return {
            ...category,

            talents:
              result.talents,

            nextCursor:
              result.nextCursor,

            hasMore:
              result.hasMore,
          };
        },
      ),
    );

  /*
   * --------------------------------------------------
   * REMAINING CATEGORIES
   * --------------------------------------------------
   *
   * Keep all category information, including
   * totalTalents, but don't fetch talents.
   */

  const remainingCategoryResults =
    remainingCategories.map(
      (category) => ({
        ...category,

        talents: [],

        nextCursor: null,

        hasMore:
          normalizeNumber(
            category.totalTalents,
          ) > 0,
      }),
    );

  /*
   * --------------------------------------------------
   * ALL CATEGORIES
   * --------------------------------------------------
   */

  const categoryResults = [
    ...topCategoryResults,
    ...remainingCategoryResults,
  ];

  /*
   * --------------------------------------------------
   * FLAT TALENTS
   * --------------------------------------------------
   *
   * Only talents from the first 6 categories
   * are included here.
   *
   * Maximum:
   *
   * 6 categories × 8 talents = 48 talents
   */

  const talents =
    topCategoryResults.flatMap(
      (category) =>
        category.talents,
    );

  /*
   * --------------------------------------------------
   * RETURN
   * --------------------------------------------------
   */

  return {
    categories:
      categoryResults,

    talents,
  };
}

/*
 * --------------------------------------------------
 * CATEGORY TALENTS
 * --------------------------------------------------
 */

export async function getCategoryTalents(
  categoryId,
) {
  "use cache";

  const normalizedCategoryId =
    normalizeString(categoryId);

  if (!normalizedCategoryId) {
    return emptyTalentResult();
  }

  cacheLife("minutes");

  cacheTag(
    TALENTS_CACHE_TAG,
  );

  cacheTag(
    categoryTalentsCacheTag(
      normalizedCategoryId,
    ),
  );

  const { db } =
    await getPublicServerFirebase();

  const result =
    await queryCategoryTalentsPage(
      db,
      normalizedCategoryId,
      {
        limitCount:
          TALENTS_PER_LOAD,
      },
    );

  return result;
}

/*
 * --------------------------------------------------
 * TALENTS BY CATEGORY
 * --------------------------------------------------
 */

export async function getTalentsByCategory({
  categoryId,
  cursor = null,
  limit = TALENTS_PER_LOAD,
}) {
  "use cache";

  const normalizedCategoryId =
    normalizeString(categoryId);

  if (!normalizedCategoryId) {
    return emptyTalentResult();
  }

  const safeLimitValue =
    safeLimit(
      limit,
      TALENTS_PER_LOAD,
      TALENTS_PER_LOAD,
    );

  cacheLife("minutes");

  cacheTag(
    TALENTS_CACHE_TAG,
  );

  cacheTag(
    categoryTalentsCacheTag(
      normalizedCategoryId,
    ),
  );

  const { db } =
    await getPublicServerFirebase();

  return queryCategoryTalentsPage(
    db,
    normalizedCategoryId,
    {
      limitCount:
        safeLimitValue,

      cursor,
    },
  );
}

/*
 * --------------------------------------------------
 * MORE TALENTS
 * --------------------------------------------------
 */

export async function getMoreTalents({
  categoryId,
  cursor = null,
}) {
  return getTalentsByCategory({
    categoryId,
    cursor,
    limit: TALENTS_PER_LOAD,
  });
}

/*
 * --------------------------------------------------
 * TOP TALENTS
 * --------------------------------------------------
 */

export async function getTopTalents(
  limit = DISCOVER_TALENTS_LIMIT,
) {
  "use cache";

  const safeLimitValue =
    safeLimit(
      limit,
      DISCOVER_TALENTS_LIMIT,
      DISCOVER_TALENTS_LIMIT,
    );

  cacheLife("minutes");

  cacheTag(
    TALENTS_CACHE_TAG,
  );

  const { db } =
    await getPublicServerFirebase();

  const talentsRef = collection(
    db,
    TALENTS_COLLECTION,
  );

  const talentsQuery = query(
    talentsRef,

    orderBy(
      "likes",
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
      safeLimitValue,
    ),
  );

  const snapshot =
    await getDocs(talentsQuery);

  return snapshot.docs
    .map((document) =>
      serializeTalentDocument(
        document,
      ),
    )
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * NEW TALENTS
 * --------------------------------------------------
 */

export async function getNewTalents(
  limit = DISCOVER_TALENTS_LIMIT,
) {
  "use cache";

  const safeLimitValue =
    safeLimit(
      limit,
      DISCOVER_TALENTS_LIMIT,
      DISCOVER_TALENTS_LIMIT,
    );

  cacheLife("minutes");

  cacheTag(
    TALENTS_CACHE_TAG,
  );

  const { db } =
    await getPublicServerFirebase();

  const talentsRef = collection(
    db,
    TALENTS_COLLECTION,
  );

  const talentsQuery = query(
    talentsRef,

    orderBy(
      "createdAt",
      "desc",
    ),

    orderBy(
      documentId(),
      "desc",
    ),

    firestoreLimit(
      safeLimitValue,
    ),
  );

  const snapshot =
    await getDocs(talentsQuery);

  return snapshot.docs
    .map((document) =>
      serializeTalentDocument(
        document,
      ),
    )
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * GET TALENT BY ID
 * --------------------------------------------------
 */

export async function getTalentById(
  id,
) {
  "use cache";

  const normalizedId =
    normalizeString(id);

  if (!normalizedId) {
    return null;
  }

  cacheLife("minutes");

  cacheTag(
    TALENTS_CACHE_TAG,
  );

  cacheTag(
    talentCacheTag(
      normalizedId,
    ),
  );

  const { db } =
    await getPublicServerFirebase();

  const talentRef = doc(
    db,
    TALENTS_COLLECTION,
    normalizedId,
  );

  const snapshot =
    await getDoc(talentRef);

  return serializeTalentDocument(
    snapshot,
  );
}

/*
 * --------------------------------------------------
 * GET TALENT BY USERNAME
 * --------------------------------------------------
 */

export async function getTalentByUsername(
  username,
) {
  "use cache";

  const normalizedUsername =
    normalizeLowercase(
      username,
    );

  if (!normalizedUsername) {
    return null;
  }

  cacheLife("minutes");

  cacheTag(
    TALENTS_CACHE_TAG,
  );

  cacheTag(
    usernameCacheTag(
      normalizedUsername,
    ),
  );

  const { db } =
    await getPublicServerFirebase();

  const usernameRef = doc(
    db,
    USERNAMES_COLLECTION,
    normalizedUsername,
  );

  const usernameSnapshot =
    await getDoc(usernameRef);

  if (!usernameSnapshot.exists()) {
    return null;
  }

  const usernameData =
    usernameSnapshot.data();

  const uid =
    normalizeString(
      usernameData?.uid,
    );

  if (!uid) {
    return null;
  }

  cacheTag(
    talentCacheTag(uid),
  );

  const talentRef = doc(
    db,
    TALENTS_COLLECTION,
    uid,
  );

  const talentSnapshot =
    await getDoc(talentRef);

  return serializeTalentDocument(
    talentSnapshot,
  );
}

/*
 * --------------------------------------------------
 * GET CURRENT USER LIKE
 * --------------------------------------------------
 *
 * talentLikes/{userId}_{talentId}
 *
 * This function intentionally does NOT use
 * "use cache" because the result depends on
 * the currently authenticated user.
 *
 * --------------------------------------------------
 */

export async function getTalentLikeStatus(
  talentId,
) {
  const normalizedTalentId =
    normalizeString(talentId);

  if (!normalizedTalentId) {
    return false;
  }

  const {
    db,
    auth,
  } = await getServerFirebase();

  const currentUser =
    auth?.currentUser;

  if (!currentUser) {
    return false;
  }

  const userId =
    normalizeString(
      currentUser.uid,
    );

  if (!userId) {
    return false;
  }

  const likeId =
    `${userId}_${normalizedTalentId}`;

  const likeRef = doc(
    db,
    TALENT_LIKES_COLLECTION,
    likeId,
  );

  const snapshot =
    await getDoc(likeRef);

  return snapshot.exists();
}

/*
 * --------------------------------------------------
 * TOGGLE TALENT LIKE
 * --------------------------------------------------
 *
 * One document per user/talent:
 *
 * talentLikes/{userId}_{talentId}
 *
 * The transaction guarantees that:
 *
 * LIKE:
 *   - like document is created
 *   - likes is incremented
 *
 * UNLIKE:
 *   - like document is deleted
 *   - likes is decremented
 *
 * --------------------------------------------------
 */

export async function toggleTalentLike({
  talentId,
  liked,
}) {
  const normalizedTalentId =
    normalizeString(talentId);

  const desiredLiked =
    liked === true;

  if (!normalizedTalentId) {
    throw new Error(
      "Talent ID is required.",
    );
  }

  const {
    db,
    auth,
  } = await getServerFirebase();

  const currentUser =
    auth?.currentUser;

  if (!currentUser) {
    throw new Error(
      "You must be signed in to like a talent.",
    );
  }

  const userId =
    normalizeString(
      currentUser.uid,
    );

  if (!userId) {
    throw new Error(
      "Authenticated user ID is missing.",
    );
  }

  const likeId =
    `${userId}_${normalizedTalentId}`;

  const talentRef = doc(
    db,
    TALENTS_COLLECTION,
    normalizedTalentId,
  );

  const likeRef = doc(
    db,
    TALENT_LIKES_COLLECTION,
    likeId,
  );

  const result =
    await runTransaction(
      db,
      async (transaction) => {
        /*
         * ALL reads happen before writes.
         */

        const [
          talentSnapshot,
          likeSnapshot,
        ] = await Promise.all([
          transaction.get(
            talentRef,
          ),

          transaction.get(
            likeRef,
          ),
        ]);

        if (
          !talentSnapshot.exists()
        ) {
          throw new Error(
            "Talent profile not found.",
          );
        }

        const talentData =
          talentSnapshot.data();

        const currentLikes =
          Math.max(
            0,
            normalizeNumber(
              talentData?.likes,
            ),
          );

        const alreadyLiked =
          likeSnapshot.exists();

        /*
         * ------------------------------------------------
         * LIKE
         * ------------------------------------------------
         */

        if (
          desiredLiked &&
          !alreadyLiked
        ) {
          const now =
            new Date();

          transaction.set(
            likeRef,
            {
              userId,
              talentId:
                normalizedTalentId,
              createdAt: now,
              updatedAt: now,
            },
          );

          transaction.update(
            talentRef,
            {
              likes:
                increment(1),
            },
          );

          return {
            liked: true,
            likes:
              currentLikes + 1,
          };
        }

        /*
         * ------------------------------------------------
         * UNLIKE
         * ------------------------------------------------
         */

        if (
          !desiredLiked &&
          alreadyLiked
        ) {
          transaction.delete(
            likeRef,
          );

          transaction.update(
            talentRef,
            {
              likes:
                increment(-1),
            },
          );

          return {
            liked: false,
            likes: Math.max(
              0,
              currentLikes - 1,
            ),
          };
        }

        /*
         * ------------------------------------------------
         * NO CHANGE
         * ------------------------------------------------
         */

        return {
          liked: alreadyLiked,
          likes: currentLikes,
        };
      },
    );

  /*
   * ------------------------------------------------
   * CACHE INVALIDATION
   * ------------------------------------------------
   */

  revalidateTag(
    talentCacheTag(
      normalizedTalentId,
    ),
    "max",
  );

  revalidateTag(
    TALENTS_CACHE_TAG,
    "max",
  );

  return result;
}