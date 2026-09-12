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

import { getCategories } from "@/data/categories";

/*
 * =========================================================
 * CONFIG
 * =========================================================
 */

const TALENTS_COLLECTION = "talents";
const TALENT_LIKES_COLLECTION = "talentLikes";
const CATEGORIES_COLLECTION = "categories";
const USERNAMES_COLLECTION = "usernames";

const INITIAL_CATEGORIES_LIMIT = 6;
const TALENTS_PER_LOAD = 8;
const DISCOVER_TALENTS_LIMIT = 10;

const MAX_CATEGORY_ID_LENGTH = 128;
const MAX_CURSOR_LENGTH = 1000;
const MAX_USERNAME_LENGTH = 30;

/*
 * =========================================================
 * CACHE TAGS
 * =========================================================
 */

const TALENTS_CACHE_TAG = "talents";

function categoryTalentsCacheTag(categoryId) {
  return `category-talents:${categoryId}`;
}

function talentCacheTag(talentId) {
  return `talent:${talentId}`;
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

function normalizeCursor(cursor) {
  if (cursor === null || cursor === undefined || cursor === "") {
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
 *
 * Cursor format:
 *
 * {
 *   version: 1,
 *   categoryId,
 *   likes,
 *   createdAt,
 *   id
 * }
 *
 * The cursor is NOT a secret.
 * It only represents the position of the last Firestore
 * document from the previous page.
 *
 * IMPORTANT:
 * These helpers are only used by uncached pagination
 * requests for load-more.
 * =========================================================
 */

function encodeCursor({
  categoryId,
  likes,
  createdAt,
  id,
}) {
  if (
    typeof categoryId !== "string" ||
    !categoryId
  ) {
    throw new Error("Cannot create pagination cursor.");
  }

  if (!Number.isFinite(likes)) {
    throw new Error("Cannot create pagination cursor.");
  }

  if (!(createdAt instanceof Timestamp)) {
    throw new Error("Cannot create pagination cursor.");
  }

  if (typeof id !== "string" || !id) {
    throw new Error("Cannot create pagination cursor.");
  }

  const payload = {
    version: 1,
    categoryId,
    likes,
    createdAt: createdAt.toMillis(),
    id,
  };

  return Buffer.from(
    JSON.stringify(payload),
    "utf8",
  ).toString("base64url");
}

function decodeCursor(cursor, expectedCategoryId) {
  const normalizedCursor = normalizeCursor(cursor);

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
      typeof payload?.categoryId !== "string" ||
      payload.categoryId !== expectedCategoryId ||
      !Number.isFinite(payload?.likes) ||
      !Number.isFinite(payload?.createdAt) ||
      typeof payload?.id !== "string" ||
      !payload.id
    ) {
      throw new Error("Invalid pagination cursor.");
    }

    return {
      categoryId: payload.categoryId,
      likes: payload.likes,
      createdAt: Timestamp.fromMillis(
        payload.createdAt,
      ),
      id: payload.id,
    };
  } catch {
    throw new Error("Invalid pagination cursor.");
  }
}

/*
 * =========================================================
 * TALENT SERIALIZATION
 * =========================================================
 */

function serializeTalent(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,

    uid: data.uid ?? snapshot.id,

    username: data.username ?? "",
    displayName: data.displayName ?? "",
    email: data.email ?? "",

    role: data.role ?? "",
    categoryId: data.categoryId ?? "",
    category: data.category ?? "",

    province: data.province ?? "",
    district: data.district ?? "",

    bio: data.bio ?? "",

    phone: data.phone ?? "",
    whatsapp: data.whatsapp ?? "",

    available: Boolean(data.available),
    avatar: data.avatar ?? "",

    skills: Array.isArray(data.skills)
      ? data.skills
      : [],

    services: Array.isArray(data.services)
      ? data.services
      : [],

    verified: Boolean(data.verified),

    likes: Number.isFinite(data.likes)
      ? data.likes
      : 0,

    workCount: Number.isFinite(data.workCount)
      ? data.workCount
      : 0,

    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toMillis()
        : null,

    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toMillis()
        : null,
  };
}

/*
 * =========================================================
 * CATEGORY PAGE QUERY
 * =========================================================
 *
 * This is the actual Firestore pagination query.
 *
 * It does NOT use "use cache".
 *
 * Therefore:
 *
 * - cursor is not cached
 * - nextCursor is not cached
 * - every load-more request gets a fresh Firestore result
 *
 * =========================================================
 */

async function queryCategoryTalentsPage(
  db,
  categoryId,
  {
    limitCount = TALENTS_PER_LOAD,
    cursor = null,
  } = {},
) {
  const normalizedCategoryId =
    normalizeCategoryId(categoryId);

  const safeLimit = Math.min(
    Math.max(Number(limitCount) || TALENTS_PER_LOAD, 1),
    TALENTS_PER_LOAD,
  );

  const decodedCursor = decodeCursor(
    cursor,
    normalizedCategoryId,
  );

  const constraints = [
    where(
      "categoryId",
      "==",
      normalizedCategoryId,
    ),

    orderBy("likes", "desc"),

    orderBy("createdAt", "desc"),

    orderBy(documentId(), "desc"),
  ];

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
    firestoreLimit(safeLimit),
  );

  const talentsQuery = query(
    collection(db, TALENTS_COLLECTION),
    ...constraints,
  );

  const snapshot = await getDocs(talentsQuery);

  const talents = snapshot.docs.map(
    serializeTalent,
  );

  const lastDocument =
    snapshot.docs.at(-1) ?? null;

  let nextCursor = null;
  let lastItemId = null;

  if (lastDocument) {
    const lastData = lastDocument.data();

    const likes = Number.isFinite(lastData.likes)
      ? lastData.likes
      : 0;

    const createdAt =
      lastData.createdAt instanceof Timestamp
        ? lastData.createdAt
        : null;

    if (createdAt) {
      nextCursor = encodeCursor({
        categoryId: normalizedCategoryId,
        likes,
        createdAt,
        id: lastDocument.id,
      });

      lastItemId = lastDocument.id;
    }
  }

  /*
   * With a page size of 8:
   *
   * 8 results means there MAY be another page.
   * The next request will confirm whether anything remains.
   *
   * 0 results means pagination is finished.
   */

  const hasMore =
    snapshot.docs.length === safeLimit;

  return {
    talents,
    nextCursor,
    lastItemId,
    hasMore,
  };
}

/*
 * =========================================================
 * INITIAL TALENTS DATA
 * =========================================================
 *
 * CACHED.
 *
 * Loads:
 * - all categories
 * - first 8 talents for the first 6 categories
 *
 * Other categories remain unloaded until requested.
 * =========================================================
 */

export async function getInitialTalentsData() {
  "use cache";

  cacheLife("minutes");
  cacheTag(TALENTS_CACHE_TAG);

  const categories =
    await getCategories();

  if (!categories.length) {
    return {
      categories: [],
      talents: [],
    };
  }

  const sortedCategories = [...categories]
    .filter(
      (category) =>
        Number(category.totalTalents) > 0,
    )
    .sort(
      (a, b) =>
        Number(b.totalTalents ?? 0) -
        Number(a.totalTalents ?? 0),
    );

  const initialCategories =
    sortedCategories.slice(
      0,
      INITIAL_CATEGORIES_LIMIT,
    );

  const { db } =
    getPublicServerFirebase();

  const initialResults =
    await Promise.all(
      initialCategories.map(
        async (category) => {
          const page =
            await queryCategoryTalentsPage(
              db,
              category.id,
              {
                limitCount:
                  TALENTS_PER_LOAD,
              },
            );

          return {
            categoryId: category.id,
            page,
          };
        },
      ),
    );

  const resultMap = new Map(
    initialResults.map((result) => [
      result.categoryId,
      result.page,
    ]),
  );

  const categoriesWithTalents =
    sortedCategories.map(
      (category) => {
        const result =
          resultMap.get(category.id);

        return {
          ...category,

          talents:
            result?.talents ?? [],

          nextCursor:
            result?.nextCursor ?? null,

          lastItemId:
            result?.lastItemId ?? null,

          hasMore:
            result?.hasMore ??
            Number(category.totalTalents) > 0,
        };
      },
    );

  const talents =
    categoriesWithTalents.flatMap(
      (category) => category.talents,
    );

  return {
    categories: categoriesWithTalents,
    talents,
  };
}

/*
 * =========================================================
 * GET CATEGORY TALENTS
 * =========================================================
 *
 * CACHED FIRST PAGE.
 *
 * No cursor is accepted here.
 * =========================================================
 */

export async function getCategoryTalents(
  categoryId,
) {
  "use cache";

  const normalizedCategoryId =
    normalizeCategoryId(categoryId);

  cacheLife("minutes");

  cacheTag(
    categoryTalentsCacheTag(
      normalizedCategoryId,
    ),
  );

  const { db } =
    getPublicServerFirebase();

  return queryCategoryTalentsPage(
    db,
    normalizedCategoryId,
    {
      limitCount:
        TALENTS_PER_LOAD,
      cursor: null,
    },
  );
}

/*
 * =========================================================
 * LOAD MORE TALENTS
 * =========================================================
 *
 * IMPORTANT:
 *
 * NO "use cache".
 *
 * This function is intentionally dynamic.
 *
 * The cursor is therefore:
 *
 * - NOT cached
 * - NOT stored in Next.js Data Cache
 * - NOT reused automatically
 *
 * Every call goes to Firestore using the cursor
 * supplied by the client.
 * =========================================================
 */

export async function getMoreTalents({
  categoryId,
  cursor,
}) {
  const normalizedCategoryId =
    normalizeCategoryId(categoryId);

  const normalizedCursor =
    normalizeCursor(cursor);

  if (!normalizedCursor) {
    throw new Error(
      "A pagination cursor is required.",
    );
  }

  const { db } =
    getPublicServerFirebase();

  return queryCategoryTalentsPage(
    db,
    normalizedCategoryId,
    {
      limitCount:
        TALENTS_PER_LOAD,
      cursor: normalizedCursor,
    },
  );
}

/*
 * =========================================================
 * GENERIC CATEGORY PAGE
 * =========================================================
 *
 * This is intentionally NOT cached when a cursor is used.
 *
 * First page:
 *     getTalentsByCategory({
 *       categoryId
 *     })
 *
 * Load more:
 *     getTalentsByCategory({
 *       categoryId,
 *       cursor
 *     })
 *
 * =========================================================
 */

export async function getTalentsByCategory({
  categoryId,
  cursor = null,
}) {
  const normalizedCategoryId =
    normalizeCategoryId(categoryId);

  const normalizedCursor =
    normalizeCursor(cursor);

  if (normalizedCursor) {
    return getMoreTalents({
      categoryId:
        normalizedCategoryId,
      cursor:
        normalizedCursor,
    });
  }

  return getCategoryTalents(
    normalizedCategoryId,
  );
}

/*
 * =========================================================
 * TOP TALENTS
 * =========================================================
 */

export async function getTopTalents() {
  "use cache";

  cacheLife("minutes");
  cacheTag(TALENTS_CACHE_TAG);

  const { db } =
    getPublicServerFirebase();

  const talentsQuery = query(
    collection(db, TALENTS_COLLECTION),
    orderBy("likes", "desc"),
    orderBy("createdAt", "desc"),
    orderBy(documentId(), "desc"),
    firestoreLimit(DISCOVER_TALENTS_LIMIT),
  );

  const snapshot =
    await getDocs(talentsQuery);

  return snapshot.docs.map(
    serializeTalent,
  );
}

/*
 * =========================================================
 * NEW TALENTS
 * =========================================================
 */

export async function getNewTalents() {
  "use cache";

  cacheLife("minutes");
  cacheTag(TALENTS_CACHE_TAG);

  const { db } =
    getPublicServerFirebase();

  const talentsQuery = query(
    collection(db, TALENTS_COLLECTION),
    orderBy("createdAt", "desc"),
    orderBy(documentId(), "desc"),
    firestoreLimit(DISCOVER_TALENTS_LIMIT),
  );

  const snapshot =
    await getDocs(talentsQuery);

  return snapshot.docs.map(
    serializeTalent,
  );
}

/*
 * =========================================================
 * GET TALENT BY ID
 * =========================================================
 */

export async function getTalentById(
  talentId,
) {
  "use cache";

  if (
    typeof talentId !== "string" ||
    !talentId.trim()
  ) {
    return null;
  }

  const normalizedId =
    talentId.trim();

  cacheLife("minutes");
  cacheTag(
    talentCacheTag(normalizedId),
  );

  const { db } =
    getPublicServerFirebase();

  const talentRef = doc(
    db,
    TALENTS_COLLECTION,
    normalizedId,
  );

  const snapshot =
    await getDoc(talentRef);

  if (!snapshot.exists()) {
    return null;
  }

  return serializeTalent(snapshot);
}

/*
 * =========================================================
 * GET TALENT BY USERNAME
 * =========================================================
 */

export async function getTalentByUsername(
  username,
) {
  "use cache";

  if (
    typeof username !== "string"
  ) {
    return null;
  }

  const normalizedUsername =
    username
      .trim()
      .toLowerCase();

  if (
    !normalizedUsername ||
    normalizedUsername.length >
      MAX_USERNAME_LENGTH
  ) {
    return null;
  }

  cacheLife("minutes");

  const { db } =
    getPublicServerFirebase();

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
    usernameData.uid;

  if (
    typeof uid !== "string" ||
    !uid
  ) {
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

  if (!talentSnapshot.exists()) {
    return null;
  }

  return serializeTalent(
    talentSnapshot,
  );
}

/*
 * =========================================================
 * GET CURRENT USER'S LIKE STATUS
 * =========================================================
 */

export async function getTalentLikeStatus(
  talentId,
) {
  if (
    typeof talentId !== "string" ||
    !talentId.trim()
  ) {
    throw new Error(
      "Invalid talent ID.",
    );
  }

  const normalizedTalentId =
    talentId.trim();

  const { auth, db } =
    getServerFirebase();

  const user = auth.currentUser;

  if (!user) {
    return {
      liked: false,
      likes: null,
    };
  }

  const likeId =
    `${user.uid}_${normalizedTalentId}`;

  const likeRef = doc(
    db,
    TALENT_LIKES_COLLECTION,
    likeId,
  );

  const talentRef = doc(
    db,
    TALENTS_COLLECTION,
    normalizedTalentId,
  );

  const [
    likeSnapshot,
    talentSnapshot,
  ] = await Promise.all([
    getDoc(likeRef),
    getDoc(talentRef),
  ]);

  if (!talentSnapshot.exists()) {
    throw new Error(
      "Talent not found.",
    );
  }

  const talentData =
    talentSnapshot.data();

  return {
    liked: likeSnapshot.exists(),
    likes: Math.max(
      0,
      Number.isFinite(talentData.likes)
        ? talentData.likes
        : 0,
    ),
  };
}

/*
 * =========================================================
 * TOGGLE TALENT LIKE
 * =========================================================
 *
 * Rules:
 *
 * 1. User must be authenticated.
 * 2. User ID comes from server authentication.
 * 3. Client cannot choose userId.
 * 4. One user can have one like per talent.
 * 5. Self-likes are allowed.
 * 6. Repeating an existing like does not increment.
 * 7. Unliking removes the like.
 * 8. Re-liking creates it again.
 * 9. Likes cannot become negative.
 * =========================================================
 */

export async function toggleTalentLike({
  talentId,
  liked,
}) {
  if (
    typeof talentId !== "string" ||
    !talentId.trim()
  ) {
    throw new Error(
      "Invalid talent ID.",
    );
  }

  if (typeof liked !== "boolean") {
    throw new Error(
      "Invalid like state.",
    );
  }

  const normalizedTalentId =
    talentId.trim();

  const { auth, db } =
    getServerFirebase();

  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "Authentication required.",
    );
  }

  const userId = user.uid;

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
        const talentSnapshot =
          await transaction.get(
            talentRef,
          );

        if (!talentSnapshot.exists()) {
          throw new Error(
            "Talent not found.",
          );
        }

        const likeSnapshot =
          await transaction.get(
            likeRef,
          );

        const talentData =
          talentSnapshot.data();

        const categoryId =
          talentData.categoryId ?? null;

        const currentLikes =
          Math.max(
            0,
            Number.isFinite(
              talentData.likes,
            )
              ? talentData.likes
              : 0,
          );

        const alreadyLiked =
          likeSnapshot.exists();

        /*
         * -----------------------------------------------
         * LIKE
         * -----------------------------------------------
         */

        if (liked) {
          if (alreadyLiked) {
            return {
              liked: true,
              likes: currentLikes,
              categoryId,
            };
          }

          const now =
            Timestamp.now();

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
                currentLikes + 1,
              updatedAt: now,
            },
          );

          return {
            liked: true,
            likes:
              currentLikes + 1,
            categoryId,
          };
        }

        /*
         * -----------------------------------------------
         * UNLIKE
         * -----------------------------------------------
         */

        if (!alreadyLiked) {
          return {
            liked: false,
            likes: currentLikes,
            categoryId,
          };
        }

        const now =
          Timestamp.now();

        transaction.delete(
          likeRef,
        );

        transaction.update(
          talentRef,
          {
            likes: Math.max(
              0,
              currentLikes - 1,
            ),
            updatedAt: now,
          },
        );

        return {
          liked: false,
          likes: Math.max(
            0,
            currentLikes - 1,
          ),
          categoryId,
        };
      },
    );

  /*
   * -----------------------------------------------
   * CACHE INVALIDATION
   * -----------------------------------------------
   *
   * Likes affect:
   *
   * - individual talent
   * - category ordering
   * - global talent lists
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

  if (result.categoryId) {
    revalidateTag(
      categoryTalentsCacheTag(
        result.categoryId,
      ),
      "max",
    );
  }

  return {
    liked: result.liked,
    likes: result.likes,
  };
}