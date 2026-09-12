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
  increment,
  limit as firestoreLimit,
  orderBy,
  query,
  runTransaction,
  setDoc,
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
  `talent-username:${String(username || "").trim().toLowerCase()}`;

export const categoryTalentsCacheTag = (categoryId) =>
  `category-talents:${String(categoryId || "").trim().toLowerCase()}`;

/*
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
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

  return Number.isFinite(number) ? number : fallback;
}

function safeLimit(value, fallback, maximum) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return fallback;
  }

  return Math.min(number, maximum);
}

function safeCursor(value) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    return 0;
  }

  return number;
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

      if (!service || typeof service !== "object") {
        return null;
      }

      return {
        id: normalizeString(service.id),
        name: normalizeString(service.name),
        description: normalizeString(service.description),
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

export function serializeTalent(data, id = "") {
  const talentId = normalizeString(data?.uid || data?.id || id);

  return {
    id: talentId,
    uid: talentId,

    username: normalizeString(data?.username),
    displayName: normalizeString(data?.displayName),
    role: normalizeString(data?.role),

    categoryId: normalizeString(data?.categoryId),
    category: normalizeString(data?.category),

    province: normalizeString(data?.province),
    district: normalizeString(data?.district),

    bio: normalizeString(data?.bio),

    phone: normalizeString(data?.phone),
    whatsapp: normalizeString(data?.whatsapp),

    avatar: normalizeString(data?.avatar),

    skills: normalizeArray(data?.skills),
    services: normalizeServices(data?.services),

    likes: Math.max(0, normalizeNumber(data?.likes)),
    workCount: Math.max(0, normalizeNumber(data?.workCount)),

    available: normalizeBoolean(data?.available),
    verified: normalizeBoolean(data?.verified),
  };
}

function serializeTalentDocument(snapshot) {
  if (!snapshot.exists()) {
    return null;
  }

  return serializeTalent(snapshot.data(), snapshot.id);
}

/*
 * --------------------------------------------------
 * CATEGORY COUNT
 * --------------------------------------------------
 */

async function getCategoryTalentCount(db, categoryId) {
  const normalizedCategoryId = normalizeString(categoryId);

  if (!normalizedCategoryId) {
    return 0;
  }

  const categoryRef = doc(
    db,
    CATEGORIES_COLLECTION,
    normalizedCategoryId,
  );

  const snapshot = await getDoc(categoryRef);

  if (!snapshot.exists()) {
    return 0;
  }

  return Math.max(
    0,
    normalizeNumber(snapshot.data()?.totalTalents),
  );
}

/*
 * --------------------------------------------------
 * CATEGORY QUERY
 * --------------------------------------------------
 */

async function queryCategoryTalents(
  db,
  categoryId,
  limitCount = TALENTS_PER_LOAD,
) {
  const normalizedCategoryId = normalizeString(categoryId);

  if (!normalizedCategoryId) {
    return [];
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

  const talentsQuery = query(
    talentsRef,
    where("categoryId", "==", normalizedCategoryId),
    orderBy("createdAt", "desc"),
    firestoreLimit(safeCount),
  );

  const snapshot = await getDocs(talentsQuery);

  return snapshot.docs
    .map((document) =>
      serializeTalentDocument(document),
    )
    .filter(Boolean);
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

  const categories = await getCategories();

  if (!categories.length) {
    return {
      categories: [],
      talents: [],
    };
  }

  const topCategories = [...categories]
    .sort(
      (a, b) =>
        normalizeNumber(b.totalTalents) -
        normalizeNumber(a.totalTalents),
    )
    .slice(0, INITIAL_CATEGORIES_LIMIT);

  const categoryResults = await Promise.all(
    topCategories.map(async (category) => {
      const talents = await queryCategoryTalents(
        (
          await getPublicServerFirebase()
        ).db,
        category.id,
        TALENTS_PER_LOAD,
      );

      return {
        ...category,
        talents,
      };
    }),
  );

  const talents = categoryResults.flatMap(
    (category) => category.talents,
  );

  return {
    categories: categoryResults,
    talents,
  };
}

/*
 * --------------------------------------------------
 * CATEGORY TALENTS
 * --------------------------------------------------
 */

export async function getCategoryTalents(categoryId) {
  "use cache";

  const normalizedCategoryId =
    normalizeString(categoryId);

  if (!normalizedCategoryId) {
    return emptyTalentResult();
  }

  cacheLife("minutes");
  cacheTag(TALENTS_CACHE_TAG);
  cacheTag(
    categoryTalentsCacheTag(normalizedCategoryId),
  );

  const { db } = await getPublicServerFirebase();

  const talents = await queryCategoryTalents(
    db,
    normalizedCategoryId,
    TALENTS_PER_LOAD,
  );

  const total = await getCategoryTalentCount(
    db,
    normalizedCategoryId,
  );

  return {
    talents,
    nextCursor:
      talents.length < TALENTS_PER_LOAD
        ? null
        : talents.length,
    hasMore: talents.length < total,
  };
}

/*
 * --------------------------------------------------
 * TALENTS BY CATEGORY
 * --------------------------------------------------
 */

export async function getTalentsByCategory({
  categoryId,
  cursor = 0,
  limit = TALENTS_PER_LOAD,
}) {
  "use cache";

  const normalizedCategoryId =
    normalizeString(categoryId);

  if (!normalizedCategoryId) {
    return emptyTalentResult();
  }

  const safeCursorValue = safeCursor(cursor);

  const safeLimitValue = safeLimit(
    limit,
    TALENTS_PER_LOAD,
    TALENTS_PER_LOAD,
  );

  cacheLife("minutes");
  cacheTag(TALENTS_CACHE_TAG);
  cacheTag(
    categoryTalentsCacheTag(normalizedCategoryId),
  );

  const { db } = await getPublicServerFirebase();

  const talentsRef = collection(
    db,
    TALENTS_COLLECTION,
  );

  const talentsQuery = query(
    talentsRef,
    where(
      "categoryId",
      "==",
      normalizedCategoryId,
    ),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(talentsQuery);

  const allTalents = snapshot.docs
    .map((document) =>
      serializeTalentDocument(document),
    )
    .filter(Boolean);

  const talents = allTalents.slice(
    safeCursorValue,
    safeCursorValue + safeLimitValue,
  );

  const nextCursor =
    safeCursorValue + talents.length <
    allTalents.length
      ? safeCursorValue + talents.length
      : null;

  return {
    talents,
    nextCursor,
    hasMore: nextCursor !== null,
  };
}

/*
 * --------------------------------------------------
 * MORE TALENTS
 * --------------------------------------------------
 */

export async function getMoreTalents({
  categoryId,
  cursor = 0,
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

  const safeLimitValue = safeLimit(
    limit,
    DISCOVER_TALENTS_LIMIT,
    DISCOVER_TALENTS_LIMIT,
  );

  cacheLife("minutes");
  cacheTag(TALENTS_CACHE_TAG);

  const { db } = await getPublicServerFirebase();

  const talentsRef = collection(
    db,
    TALENTS_COLLECTION,
  );

  const talentsQuery = query(
    talentsRef,
    orderBy("likes", "desc"),
    firestoreLimit(safeLimitValue),
  );

  const snapshot = await getDocs(talentsQuery);

  return snapshot.docs
    .map((document) =>
      serializeTalentDocument(document),
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

  const safeLimitValue = safeLimit(
    limit,
    DISCOVER_TALENTS_LIMIT,
    DISCOVER_TALENTS_LIMIT,
  );

  cacheLife("minutes");
  cacheTag(TALENTS_CACHE_TAG);

  const { db } = await getPublicServerFirebase();

  const talentsRef = collection(
    db,
    TALENTS_COLLECTION,
  );

  const talentsQuery = query(
    talentsRef,
    orderBy("createdAt", "desc"),
    firestoreLimit(safeLimitValue),
  );

  const snapshot = await getDocs(talentsQuery);

  return snapshot.docs
    .map((document) =>
      serializeTalentDocument(document),
    )
    .filter(Boolean);
}

/*
 * --------------------------------------------------
 * GET TALENT BY ID
 * --------------------------------------------------
 */

export async function getTalentById(id) {
  "use cache";

  const normalizedId = normalizeString(id);

  if (!normalizedId) {
    return null;
  }

  cacheLife("minutes");
  cacheTag(talentCacheTag(normalizedId));

  const { db } = await getPublicServerFirebase();

  const talentRef = doc(
    db,
    TALENTS_COLLECTION,
    normalizedId,
  );

  const snapshot = await getDoc(talentRef);

  return serializeTalentDocument(snapshot);
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
    normalizeLowercase(username);

  if (!normalizedUsername) {
    return null;
  }

  cacheLife("minutes");
  cacheTag(
    usernameCacheTag(normalizedUsername),
  );

  const { db } = await getPublicServerFirebase();

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

  const uid = normalizeString(
    usernameData?.uid,
  );

  if (!uid) {
    return null;
  }

  cacheTag(talentCacheTag(uid));

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
 * Returns whether the authenticated user has
 * already liked a specific talent.
 *
 * Document:
 *
 * talentLikes/{userId}_{talentId}
 *
 * Only ONE document can exist for this
 * user/talent combination.
 */

export async function getTalentLikeStatus(
  talentId,
) {
  const normalizedTalentId =
    normalizeString(talentId);

  if (!normalizedTalentId) {
    return false;
  }

  const { db, auth } =
    await getServerFirebase();

  const currentUser = auth?.currentUser;

  if (!currentUser) {
    return false;
  }

  const userId =
    normalizeString(currentUser.uid);

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

  const snapshot = await getDoc(likeRef);

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
 * LIKE:
 *   create like document
 *   increment talent.likes
 *
 * UNLIKE:
 *   delete same like document
 *   decrement talent.likes
 *
 * The transaction makes the operation safe
 * against duplicate/concurrent requests.
 */

export async function toggleTalentLike({
  talentId,
  liked,
}) {
  const normalizedTalentId =
    normalizeString(talentId);

  const desiredLiked = liked === true;

  if (!normalizedTalentId) {
    throw new Error(
      "Talent ID is required.",
    );
  }

  const { db, auth } =
    await getServerFirebase();

  const currentUser = auth?.currentUser;

  if (!currentUser) {
    throw new Error(
      "You must be signed in to like a talent.",
    );
  }

  const userId =
    normalizeString(currentUser.uid);

  if (!userId) {
    throw new Error(
      "Authenticated user ID is missing.",
    );
  }

  /*
   * One deterministic document ID.
   *
   * Example:
   * user123_talent456
   */
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

  const result = await runTransaction(
    db,
    async (transaction) => {
      /*
       * Reads first.
       */
      const talentSnapshot =
        await transaction.get(talentRef);

      const likeSnapshot =
        await transaction.get(likeRef);

      if (!talentSnapshot.exists()) {
        throw new Error(
          "Talent profile not found.",
        );
      }

      const talentData =
        talentSnapshot.data();

      const currentLikes = Math.max(
        0,
        normalizeNumber(talentData?.likes),
      );

      const alreadyLiked =
        likeSnapshot.exists();

      /*
       * ------------------------------------------------
       * LIKE
       * ------------------------------------------------
       */

      if (desiredLiked && !alreadyLiked) {
        transaction.set(likeRef, {
          userId,
          talentId: normalizedTalentId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        transaction.update(talentRef, {
          likes: increment(1),
        });

        return {
          liked: true,
          likes: currentLikes + 1,
        };
      }

      /*
       * ------------------------------------------------
       * UNLIKE
       * ------------------------------------------------
       */

      if (!desiredLiked && alreadyLiked) {
        transaction.delete(likeRef);

        transaction.update(talentRef, {
          likes: increment(-1),
        });

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
       *
       * Already liked + like requested
       * OR
       * already unliked + unlike requested.
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
   *
   * Likes affect:
   *
   * - Individual talent profile
   * - Category talent lists
   * - Top talents
   * - Global talent lists
   */

  revalidateTag(
    talentCacheTag(normalizedTalentId),
    "max",
  );

  revalidateTag(
    TALENTS_CACHE_TAG,
    "max",
  );

  /*
   * Category-specific caches also carry the
   * global TALENTS_CACHE_TAG, so invalidating
   * the global tag invalidates those cached
   * reads as well.
   */

  return result;
}
