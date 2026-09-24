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

import { getCategories } from "@/data/categories";

/*
 * =========================================================
 * CONFIG
 * =========================================================
 */

const TALENTS_COLLECTION = "talents";
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
  categoryId,
  likes,
  createdAt,
  id,
}) {
  if (
    typeof categoryId !== "string" ||
    !categoryId
  ) {
    throw new Error(
      "Cannot create pagination cursor.",
    );
  }

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

function decodeCursor(
  cursor,
  expectedCategoryId,
) {
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
      typeof payload?.categoryId !== "string" ||
      payload.categoryId !==
      expectedCategoryId ||
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
      categoryId:
        payload.categoryId,

      likes:
        payload.likes,

      createdAt:
        Timestamp.fromMillis(
          payload.createdAt,
        ),

      id:
        payload.id,
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
 * TALENT SERIALIZATION
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
 * =========================================================
 */

function serializeTalent(snapshot) {
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

    uid:
      data.uid ??
      snapshot.id,

    username:
      data.username ??
      "",

    displayName:
      data.displayName ??
      "",

    email:
      data.email ??
      "",

    role:
      data.role ??
      "",

    categoryId:
      data.categoryId ??
      "",

    category:
      data.category ??
      "",

    province:
      data.province ??
      "",

    district:
      data.district ??
      "",

    bio:
      data.bio ??
      "",

    phone:
      data.phone ??
      "",

    whatsapp:
      data.whatsapp ??
      "",

    available:
      Boolean(
        data.available,
      ),

    avatar:
      data.avatar ??
      "",

    skills:
      Array.isArray(
        data.skills,
      )
        ? data.skills
        : [],

    services:
      Array.isArray(
        data.services,
      )
        ? data.services
        : [],

    verified:
      Boolean(
        data.verified,
      ),

    likes:
      likeCount,

    /*
     * This is replaced by the authenticated overlay.
     */
    likedByMe:
      false,

    workCount:
      Number.isFinite(
        data.workCount,
      )
        ? Math.max(
          0,
          Math.floor(
            data.workCount,
          ),
        )
        : 0,

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
 * This is the important part.
 *
 * Public talent data can be cached.
 *
 * User-specific like state CANNOT be cached globally.
 *
 * We therefore:
 *
 * 1. Get the current authenticated user.
 * 2. Get the talent documents.
 * 3. Check:
 *
 *    likes.some(
 *      like => like.userId === currentUser.uid
 *    )
 *
 * 4. Return the talent with likedByMe.
 *
 * The full likes array is NEVER returned to the client.
 * =========================================================
 */

async function addCurrentUserLikeState(
  talents,
) {
  if (
    !Array.isArray(talents) ||
    !talents.length
  ) {
    return talents ?? [];
  }

  const { auth, db } =
    await getServerFirebase();

  await auth.authStateReady();

  const user =
    auth.currentUser;

  /*
   * No authenticated user.
   *
   * Public talent data remains available.
   */

  if (!user) {
    return talents.map(
      (talent) => ({
        ...talent,
        likedByMe: false,
      }),
    );
  }

  const talentIds = [
    ...new Set(
      talents
        .map(
          (talent) =>
            talent?.id,
        )
        .filter(
          (id) =>
            typeof id ===
            "string" &&
            id.trim(),
        ),
    ),
  ];

  if (!talentIds.length) {
    return talents;
  }

  /*
   * Read the actual Firestore documents.
   *
   * We need the likes array because the public cached
   * serializer intentionally does not expose it.
   */

  const snapshots =
    await Promise.all(
      talentIds.map(
        (talentId) =>
          getDoc(
            doc(
              db,
              TALENTS_COLLECTION,
              talentId,
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
       * THIS IS THE ACTUAL CHECK:
       *
       * Does the likes array contain the
       * current authenticated user's UID?
       */

      if (
        hasUserLiked(
          likes,
          user.uid,
        )
      ) {
        likedIds.add(
          talentIds[index],
        );
      }
    },
  );

  /*
   * Add the user-specific state.
   */

  return talents.map(
    (talent) => ({
      ...talent,

      likedByMe:
        likedIds.has(
          talent.id,
        ),
    }),
  );
}

/*
 * =========================================================
 * SINGLE TALENT LIKE STATE
 * =========================================================
 */

async function addCurrentUserLikeStateToTalent(
  talent,
) {
  if (!talent) {
    return null;
  }

  const result =
    await addCurrentUserLikeState([
      talent,
    ]);

  return result[0] ?? null;
}

/*
 * =========================================================
 * CATEGORY PAGE QUERY
 * =========================================================
 */

async function queryCategoryTalentsPage(
  db,
  categoryId,
  {
    limitCount =
    TALENTS_PER_LOAD,

    cursor = null,
  } = {},
) {
  const normalizedCategoryId =
    normalizeCategoryId(
      categoryId,
    );

  const safeLimit =
    Math.min(
      Math.max(
        Number(limitCount) ||
        TALENTS_PER_LOAD,
        1,
      ),
      TALENTS_PER_LOAD,
    );

  const decodedCursor =
    decodeCursor(
      cursor,
      normalizedCategoryId,
    );

  const constraints = [
    where(
      "categoryId",
      "==",
      normalizedCategoryId,
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
    firestoreLimit(
      safeLimit,
    ),
  );

  const talentsQuery =
    query(
      collection(
        db,
        TALENTS_COLLECTION,
      ),
      ...constraints,
    );

  const snapshot =
    await getDocs(
      talentsQuery,
    );

  const talents =
    snapshot.docs.map(
      serializeTalent,
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
      Number.isFinite(
        lastData.likeCount,
      )
        ? Math.max(
          0,
          Math.floor(
            lastData.likeCount,
          ),
        )
        : getLikeCount(
          lastData.likes,
        );

    const createdAt =
      lastData.createdAt instanceof
        Timestamp
        ? lastData.createdAt
        : null;

    if (createdAt) {
      nextCursor =
        encodeCursor({
          categoryId:
            normalizedCategoryId,

          likes,

          createdAt,

          id:
            lastDocument.id,
        });

      lastItemId =
        lastDocument.id;
    }
  }

  return {
    talents,

    nextCursor,

    lastItemId,

    hasMore:
      snapshot.docs.length ===
      safeLimit,
  };
}

/*
 * =========================================================
 * CACHED CATEGORY PAGE
 * =========================================================
 *
 * PUBLIC DATA ONLY.
 *
 * Do not access auth here.
 * =========================================================
 */

async function getCachedCategoryTalents(
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
        TALENTS_PER_LOAD,

      cursor,
    },
  );
}

/*
 * =========================================================
 * INITIAL TALENTS DATA
 * =========================================================
 */

async function getCachedInitialTalentsData() {
  "use cache";

  cacheLife(
    "minutes",
  );

  cacheTag(
    TALENTS_CACHE_TAG,
  );

  const categories =
    await getCategories();

  if (!categories.length) {
    return {
      categories: [],
      talents: [],
    };
  }

  const sortedCategories =
    [...categories]
      .filter(
        (category) =>
          Number(
            category.totalTalents,
          ) > 0,
      )
      .sort(
        (a, b) =>
          Number(
            b.totalTalents ??
            0,
          ) -
          Number(
            a.totalTalents ??
            0,
          ),
      );

  const initialCategories =
    sortedCategories.slice(
      0,
      INITIAL_CATEGORIES_LIMIT,
    );

  const { db } =
    await getPublicServerFirebase();

  const initialResults =
    await Promise.all(
      initialCategories.map(
        async (
          category,
        ) => {
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
            categoryId:
              category.id,

            page,
          };
        },
      ),
    );

  const resultMap =
    new Map(
      initialResults.map(
        (result) => [
          result.categoryId,
          result.page,
        ],
      ),
    );

  const categoriesWithTalents =
    sortedCategories.map(
      (category) => {
        const result =
          resultMap.get(
            category.id,
          );

        return {
          ...category,

          talents:
            result?.talents ??
            [],

          nextCursor:
            result?.nextCursor ??
            null,

          lastItemId:
            result?.lastItemId ??
            null,

          hasMore:
            result?.hasMore ??
            Number(
              category.totalTalents,
            ) > 0,
        };
      },
    );

  const talents =
    categoriesWithTalents.flatMap(
      (category) =>
        category.talents,
    );

  return {
    categories:
      categoriesWithTalents,

    talents,
  };
}

/*
 * =========================================================
 * PUBLIC INITIAL TALENTS DATA
 * =========================================================
 *
 * Cached public data is loaded first.
 *
 * Then current-user like state is added.
 * =========================================================
 */

export async function getInitialTalentsData() {
  const data =
    await getCachedInitialTalentsData();

  /*
   * Remove duplicate talents before checking
   * their like state.
   */

  const uniqueTalents =
    [
      ...new Map(
        data.talents.map(
          (talent) => [
            talent.id,
            talent,
          ],
        ),
      ).values(),
    ];

  const talentsWithLikeState =
    await addCurrentUserLikeState(
      uniqueTalents,
    );

  const likeStateMap =
    new Map(
      talentsWithLikeState.map(
        (talent) => [
          talent.id,
          talent.likedByMe,
        ],
      ),
    );

  /*
   * Apply likedByMe to both the flat talents array
   * and each category's talents.
   */

  return {
    ...data,

    talents:
      data.talents.map(
        (talent) => ({
          ...talent,

          likedByMe:
            likeStateMap.get(
              talent.id,
            ) ?? false,
        }),
      ),

    categories:
      data.categories.map(
        (category) => ({
          ...category,

          talents:
            category.talents.map(
              (talent) => ({
                ...talent,

                likedByMe:
                  likeStateMap.get(
                    talent.id,
                  ) ?? false,
              }),
            ),
        }),
      ),
  };
}

/*
 * =========================================================
 * GET CATEGORY TALENTS
 * =========================================================
 */

export async function getCategoryTalents(
  categoryId,
) {
  const data =
    await getCachedCategoryTalents(
      categoryId,
      null,
    );

  return {
    ...data,

    talents:
      await addCurrentUserLikeState(
        data.talents,
      ),
  };
}

/*
 * =========================================================
 * LOAD MORE TALENTS
 * =========================================================
 *
 * Public query first.
 * Current-user state afterward.
 * =========================================================
 */

export async function getMoreTalents({
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
    await queryCategoryTalentsPage(
      db,
      normalizedCategoryId,
      {
        limitCount:
          TALENTS_PER_LOAD,

        cursor:
          normalizedCursor,
      },
    );

  return {
    ...data,

    talents:
      await addCurrentUserLikeState(
        data.talents,
      ),
  };
}

/*
 * =========================================================
 * GENERIC CATEGORY PAGE
 * =========================================================
 */

export async function getTalentsByCategory({
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
 * CACHED TOP TALENTS
 * =========================================================
 */

async function getCachedTopTalents() {
  "use cache";

  cacheLife(
    "minutes",
  );

  cacheTag(
    TALENTS_CACHE_TAG,
  );

  const { db } =
    await getPublicServerFirebase();

  const talentsQuery =
    query(
      collection(
        db,
        TALENTS_COLLECTION,
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
        DISCOVER_TALENTS_LIMIT,
      ),
    );

  const snapshot =
    await getDocs(
      talentsQuery,
    );

  return snapshot.docs.map(
    serializeTalent,
  );
}

/*
 * =========================================================
 * TOP TALENTS
 * =========================================================
 */

export async function getTopTalents() {
  const talents =
    await getCachedTopTalents();

  return addCurrentUserLikeState(
    talents,
  );
}

/*
 * =========================================================
 * CACHED NEW TALENTS
 * =========================================================
 */

async function getCachedNewTalents() {
  "use cache";

  cacheLife(
    "minutes",
  );

  cacheTag(
    TALENTS_CACHE_TAG,
  );

  const { db } =
    await getPublicServerFirebase();

  const talentsQuery =
    query(
      collection(
        db,
        TALENTS_COLLECTION,
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
        DISCOVER_TALENTS_LIMIT,
      ),
    );

  const snapshot =
    await getDocs(
      talentsQuery,
    );

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
  const talents =
    await getCachedNewTalents();

  return addCurrentUserLikeState(
    talents,
  );
}

/*
 * =========================================================
 * CACHED TALENT BY ID
 * =========================================================
 */

async function getCachedTalentById(
  talentId,
) {
  "use cache";

  const normalizedId =
    talentId?.trim();

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
    talentCacheTag(
      normalizedId,
    ),
  );

  const { db } =
    await getPublicServerFirebase();

  const talentRef =
    doc(
      db,
      TALENTS_COLLECTION,
      normalizedId,
    );

  const snapshot =
    await getDoc(
      talentRef,
    );

  if (!snapshot.exists()) {
    return null;
  }

  return serializeTalent(
    snapshot,
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
  const talent =
    await getCachedTalentById(
      talentId,
    );

  return addCurrentUserLikeStateToTalent(
    talent,
  );
}

/*
 * =========================================================
 * CACHED TALENT BY USERNAME
 * =========================================================
 */

async function getCachedTalentByUsername(
  username,
) {
  "use cache";

  if (
    typeof username !==
    "string"
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

  cacheLife(
    "minutes",
  );

  cacheTag(
    `talent-username:${normalizedUsername}`,
  );

  const { db } =
    await getPublicServerFirebase();

  const usernameRef =
    doc(
      db,
      USERNAMES_COLLECTION,
      normalizedUsername,
    );

  const usernameSnapshot =
    await getDoc(
      usernameRef,
    );

  if (
    !usernameSnapshot.exists()
  ) {
    return null;
  }

  const usernameData =
    usernameSnapshot.data();

  const uid =
    usernameData.uid;

  if (
    typeof uid !==
    "string" ||
    !uid
  ) {
    return null;
  }

  cacheTag(
    talentCacheTag(uid),
  );

  const talentRef =
    doc(
      db,
      TALENTS_COLLECTION,
      uid,
    );

  const talentSnapshot =
    await getDoc(
      talentRef,
    );

  if (
    !talentSnapshot.exists()
  ) {
    return null;
  }

  return serializeTalent(
    talentSnapshot,
  );
}

/*
 * =========================================================
 * GET TALENT BY USERNAME
 * =========================================================
 */

export async function getTalentByUsername(
  username,
) {
  const talent =
    await getCachedTalentByUsername(
      username,
    );

  return addCurrentUserLikeStateToTalent(
    talent,
  );
}

/*
 * =========================================================
 * GET CURRENT USER LIKE STATUS
 * =========================================================
 */

export async function getTalentLikeStatus(
  talentId,
) {
  const normalizedTalentId =
    normalizeTalentId(
      talentId,
    );

  const { auth, db } =
    await getServerFirebase();

  await auth.authStateReady();

  const talentRef =
    doc(
      db,
      TALENTS_COLLECTION,
      normalizedTalentId,
    );

  const talentSnapshot =
    await getDoc(
      talentRef,
    );

  if (
    !talentSnapshot.exists()
  ) {
    throw new Error(
      "Talent not found.",
    );
  }

  const talentData =
    talentSnapshot.data();

  const likesArray =
    normalizeLikesArray(
      talentData.likes,
    );

  const likes =
    Number.isFinite(
      talentData.likeCount,
    )
      ? Math.max(
        0,
        Math.floor(
          talentData.likeCount,
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
 * TOGGLE TALENT LIKE
 * =========================================================
 */

export async function toggleTalentLike({
  talentId,
  liked,
}) {
  const normalizedTalentId =
    normalizeTalentId(
      talentId,
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

  const talentRef =
    doc(
      db,
      TALENTS_COLLECTION,
      normalizedTalentId,
    );

  const result =
    await runTransaction(
      db,
      async (
        transaction,
      ) => {
        const talentSnapshot =
          await transaction.get(
            talentRef,
          );

        if (
          !talentSnapshot.exists()
        ) {
          throw new Error(
            "Talent not found.",
          );
        }

        const talentData =
          talentSnapshot.data();

        const categoryId =
          talentData.categoryId ??
          null;

        const currentLikes =
          normalizeLikesArray(
            talentData.likes,
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
          if (
            alreadyLiked
          ) {
            return {
              liked: true,

              likes:
                Number.isFinite(
                  talentData.likeCount,
                )
                  ? Math.max(
                    0,
                    Math.floor(
                      talentData.likeCount,
                    ),
                  )
                  : currentLikes.length,

              categoryId,
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

          const nextLikes =
            [
              ...currentLikes,
              newLike,
            ];

          transaction.update(
            talentRef,
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

            categoryId,
          };
        }

        /*
         * ===================================================
         * UNLIKE
         * ===================================================
         */

        if (
          !alreadyLiked
        ) {
          return {
            liked: false,

            likes:
              Number.isFinite(
                talentData.likeCount,
              )
                ? Math.max(
                  0,
                  Math.floor(
                    talentData.likeCount,
                  ),
                )
                : currentLikes.length,

            categoryId,
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
          talentRef,
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

          categoryId,
        };
      },
    );

  /*
   * =======================================================
   * CACHE INVALIDATION
   * =======================================================
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
    success: true,

    liked:
      result.liked,

    likes:
      result.likes,
  };
}

/*
 * =========================================================
 * GET CURRENT USER TALENT LIKES
 * =========================================================
 *
 * Returns a Set of talent IDs that the current user
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
 * Set(["talent-id"])
 * =========================================================
 */

export async function getCurrentUserTalentLikes(
  talentIds = [],
) {
  if (
    !Array.isArray(talentIds) ||
    !talentIds.length
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
      talentIds
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

  const talentSnapshots =
    await Promise.all(
      normalizedIds.map(
        (talentId) =>
          getDoc(
            doc(
              db,
              TALENTS_COLLECTION,
              talentId,
            ),
          ),
      ),
    );

  const likedIds =
    new Set();

  talentSnapshots.forEach(
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
       *
       * This checks whether one of the like objects
       * contains the authenticated user's UID.
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