import { z } from "zod";

import {
  cacheLife,
  cacheTag,
} from "next/cache";

import {
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import {
  getServerFirebase,
  getPublicServerFirebase,
} from "@/lib/server";

import {
  categories,
} from "./categories";

/*
 * --------------------------------------------------
 * CONSTANTS
 * --------------------------------------------------
 */

const PROFILES_COLLECTION =
  "talents";

const USERNAMES_COLLECTION =
  "usernames";

const USERNAME_REGEX =
  /^[a-z0-9_]{3,30}$/;

/*
 * --------------------------------------------------
 * VALIDATION
 * --------------------------------------------------
 */

const usernameSchema =
  z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      USERNAME_REGEX,
      "Username must be 3-30 characters and contain only lowercase letters, numbers, and underscores."
    );

const profileUpdateSchema =
  z
    .object({
      username:
        usernameSchema.optional(),

      role:
        z
          .string()
          .trim()
          .max(100)
          .optional(),

      categoryId:
        z
          .string()
          .trim()
          .max(100)
          .optional(),

      province:
        z
          .string()
          .trim()
          .max(100)
          .optional(),

      district:
        z
          .string()
          .trim()
          .max(100)
          .optional(),

      bio:
        z
          .string()
          .trim()
          .max(1000)
          .optional(),

      phone:
        z
          .string()
          .trim()
          .max(30)
          .optional(),

      whatsapp:
        z
          .string()
          .trim()
          .max(30)
          .optional(),

      available:
        z
          .boolean()
          .optional(),

      avatar:
        z
          .string()
          .trim()
          .url()
          .nullable()
          .optional(),

      skills:
        z
          .array(
            z
              .string()
              .trim()
              .min(1)
              .max(100)
          )
          .max(20)
          .optional(),

      services:
        z
          .array(
            z.object({
              id:
                z.string(),

              name:
                z
                  .string()
                  .trim()
                  .min(1)
                  .max(150),

              description:
                z
                  .string()
                  .trim()
                  .max(1000)
                  .optional()
                  .default(""),

              price:
                z
                  .string()
                  .max(50)
                  .optional()
                  .default(""),

              image:
                z
                  .string()
                  .trim()
                  .url()
                  .or(
                    z.literal("")
                  )
                  .optional()
                  .default(""),
            })
          )
          .max(20)
          .optional(),
    })
    .strict();

/*
 * --------------------------------------------------
 * NORMALIZATION
 * --------------------------------------------------
 */

function normalizeString(
  value
) {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value.trim();
}

function normalizeStringArray(
  value
) {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (item) =>
        typeof item ===
        "string"
    )
    .map(
      (item) =>
        item.trim()
    )
    .filter(Boolean);
}

function normalizeBoolean(
  value
) {
  return value === true;
}

function normalizeNumber(
  value
) {
  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : 0;
}

function normalizeServices(
  value
) {
  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .map((service) => {
      if (
        !service ||
        typeof service !==
          "object" ||
        Array.isArray(service)
      ) {
        return null;
      }

      return {
        id:
          typeof service.id ===
          "string"
            ? service.id.trim()
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
          service.price !==
            null
            ? String(
                service.price
              ).trim()
            : "",

        image:
          typeof service.image ===
          "string"
            ? service.image.trim()
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
 * CATEGORY
 * --------------------------------------------------
 */

function getCategory(
  categoryId
) {
  const normalizedId =
    normalizeString(
      categoryId
    );

  if (!normalizedId) {
    return null;
  }

  const category =
    categories.find(
      (item) =>
        item.id ===
        normalizedId
    );

  if (!category) {
    return null;
  }

  return {
    id:
      category.id,

    name:
      normalizeString(
        category.name
      ),
  };
}

/*
 * --------------------------------------------------
 * AUTH
 * --------------------------------------------------
 */

async function getCurrentUser() {
  const {
    auth,
  } = await getServerFirebase();

  await auth.authStateReady();

  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "AUTH_REQUIRED"
    );
  }

  return {
    uid:
      user.uid,

    displayName:
      normalizeString(
        user.displayName
      ),

    email:
      normalizeString(
        user.email
      ),

    photoURL:
      user.photoURL ||
      null,

    emailVerified:
      user.emailVerified ===
      true,
  };
}

/*
 * --------------------------------------------------
 * SERIALIZERS
 * --------------------------------------------------
 */

function serializeProfile(
  profile
) {
  if (!profile) {
    return null;
  }

  return {
    id:
      normalizeString(
        profile.id ||
          profile.uid
      ),

    uid:
      normalizeString(
        profile.uid
      ),

    username:
      normalizeString(
        profile.username
      ),

    displayName:
      normalizeString(
        profile.displayName
      ),

    email:
      normalizeString(
        profile.email
      ),

    role:
      normalizeString(
        profile.role
      ),

    categoryId:
      normalizeString(
        profile.categoryId
      ),

    category:
      normalizeString(
        profile.category
      ),

    province:
      normalizeString(
        profile.province
      ),

    district:
      normalizeString(
        profile.district
      ),

    bio:
      normalizeString(
        profile.bio
      ),

    phone:
      normalizeString(
        profile.phone
      ),

    whatsapp:
      normalizeString(
        profile.whatsapp
      ),

    available:
      normalizeBoolean(
        profile.available
      ),

    avatar:
      typeof profile.avatar ===
        "string"
        ? profile.avatar
        : null,

    skills:
      normalizeStringArray(
        profile.skills
      ),

    services:
      normalizeServices(
        profile.services
      ),

    verified:
      normalizeBoolean(
        profile.verified
      ),

    likes:
      normalizeNumber(
        profile.likes
      ),

    workCount:
      normalizeNumber(
        profile.workCount
      ),
  };
}

function serializePublicProfile(
  profile
) {
  if (!profile) {
    return null;
  }

  return {
    id:
      normalizeString(
        profile.id ||
          profile.uid
      ),

    uid:
      normalizeString(
        profile.uid
      ),

    username:
      normalizeString(
        profile.username
      ),

    displayName:
      normalizeString(
        profile.displayName
      ),

    role:
      normalizeString(
        profile.role
      ),

    categoryId:
      normalizeString(
        profile.categoryId
      ),

    category:
      normalizeString(
        profile.category
      ),

    province:
      normalizeString(
        profile.province
      ),

    district:
      normalizeString(
        profile.district
      ),

    bio:
      normalizeString(
        profile.bio
      ),

    phone:
      normalizeString(
        profile.phone
      ),

    whatsapp:
      normalizeString(
        profile.whatsapp
      ),

    available:
      normalizeBoolean(
        profile.available
      ),

    avatar:
      typeof profile.avatar ===
        "string"
        ? profile.avatar
        : null,

    skills:
      normalizeStringArray(
        profile.skills
      ),

    services:
      normalizeServices(
        profile.services
      ),

    verified:
      normalizeBoolean(
        profile.verified
      ),

    likes:
      normalizeNumber(
        profile.likes
      ),

    workCount:
      normalizeNumber(
        profile.workCount
      ),
  };
}

function serializeUsernameRecord(
  record
) {
  if (!record) {
    return null;
  }

  return {
    id:
      normalizeString(
        record.id ||
          record.username
      ),

    uid:
      normalizeString(
        record.uid
      ),

    username:
      normalizeString(
        record.username
      ),
  };
}

/*
 * --------------------------------------------------
 * CREATE PROFILE
 * --------------------------------------------------
 *
 * Creates atomically:
 *
 * talents/{uid}
 * usernames/{username}
 * --------------------------------------------------
 */

export async function createProfile(
  profileData
) {
  const user =
    await getCurrentUser();

  const username =
    usernameSchema.parse(
      profileData?.username
    );

  const categoryId =
    normalizeString(
      profileData?.categoryId
    );

  if (!categoryId) {
    throw new Error(
      "CATEGORY_REQUIRED"
    );
  }

  const category =
    getCategory(
      categoryId
    );

  if (!category) {
    throw new Error(
      "CATEGORY_NOT_FOUND"
    );
  }

  const {
    db,
  } = await getServerFirebase();

  const profileRef =
    doc(
      db,
      PROFILES_COLLECTION,
      user.uid
    );

  const usernameRef =
    doc(
      db,
      USERNAMES_COLLECTION,
      username
    );

  const profile =
    await runTransaction(
      db,
      async (transaction) => {
        /*
         * ALL READS FIRST.
         */

        const profileSnapshot =
          await transaction.get(
            profileRef
          );

        if (
          profileSnapshot.exists()
        ) {
          throw new Error(
            "PROFILE_EXISTS"
          );
        }

        const usernameSnapshot =
          await transaction.get(
            usernameRef
          );

        if (
          usernameSnapshot.exists()
        ) {
          throw new Error(
            "USERNAME_TAKEN"
          );
        }

        /*
         * PROFILE
         */

        const newProfile = {
          id:
            user.uid,

          uid:
            user.uid,

          username,

          displayName:
            user.displayName,

          email:
            user.email,

          role:
            normalizeString(
              profileData?.role
            ),

          categoryId:
            category.id,

          category:
            category.name,

          province:
            normalizeString(
              profileData?.province
            ),

          district:
            normalizeString(
              profileData?.district
            ),

          bio:
            normalizeString(
              profileData?.bio
            ),

          phone:
            normalizeString(
              profileData?.phone
            ),

          whatsapp:
            normalizeString(
              profileData?.whatsapp
            ),

          available:
            normalizeBoolean(
              profileData?.available
            ),

          avatar:
            typeof profileData?.avatar ===
              "string"
              ? profileData.avatar.trim()
              : null,

          skills:
            normalizeStringArray(
              profileData?.skills
            ),

          services:
            normalizeServices(
              profileData?.services
            ),

          verified:
            false,

          likes:
            0,

          workCount:
            0,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        };

        /*
         * USERNAME REGISTRY
         */

        const usernameRecord = {
          id:
            username,

          uid:
            user.uid,

          username,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        };

        /*
         * WRITES AFTER ALL READS.
         */

        transaction.set(
          profileRef,
          newProfile
        );

        transaction.set(
          usernameRef,
          usernameRecord
        );

        return newProfile;
      }
    );

  return serializeProfile(
    profile
  );
}

/*
 * --------------------------------------------------
 * GET MY PROFILE
 * --------------------------------------------------
 *
 * Authenticated.
 * NOT CACHED.
 * --------------------------------------------------
 */

export async function getMyProfile() {
  const user =
    await getCurrentUser();

  const {
    db,
  } = await getServerFirebase();

  const profileRef =
    doc(
      db,
      PROFILES_COLLECTION,
      user.uid
    );

  const profileSnapshot =
    await getDoc(
      profileRef
    );

  if (
    !profileSnapshot.exists()
  ) {
    return null;
  }

  return serializeProfile({
    id:
      profileSnapshot.id,

    ...profileSnapshot.data(),
  });
}

/*
 * --------------------------------------------------
 * GET PROFILE BY UID
 * --------------------------------------------------
 *
 * Authenticated/private usage.
 * NOT CACHED.
 * --------------------------------------------------
 */

export async function getProfileByUid(
  uid
) {
  const normalizedUid =
    normalizeString(
      uid
    );

  if (!normalizedUid) {
    return null;
  }

  const {
    db,
  } = await getServerFirebase();

  const profileRef =
    doc(
      db,
      PROFILES_COLLECTION,
      normalizedUid
    );

  const profileSnapshot =
    await getDoc(
      profileRef
    );

  if (
    !profileSnapshot.exists()
  ) {
    return null;
  }

  return serializeProfile({
    id:
      profileSnapshot.id,

    ...profileSnapshot.data(),
  });
}

/*
 * --------------------------------------------------
 * GET PROFILE BY USERNAME
 * --------------------------------------------------
 *
 * Public + cached.
 *
 * usernames/{username}
 *        ↓
 *       uid
 *        ↓
 * talents/{uid}
 *
 * IMPORTANT:
 *
 * This cached function uses
 * getPublicServerFirebase().
 *
 * It MUST NOT use getServerFirebase()
 * because getServerFirebase() reads
 * request headers.
 * --------------------------------------------------
 */

export async function getProfileByUsername(
  username
) {
  const normalizedUsername =
    usernameSchema.parse(
      username
    );

  return getCachedProfileByUsername(
    normalizedUsername
  );
}

async function getCachedProfileByUsername(
  username
) {
  "use cache";

  cacheLife("hours");

  cacheTag(
    "profiles",
    `profile-username:${username}`,
    `username:${username}`
  );

  const {
    db,
  } = getPublicServerFirebase();

  /*
   * USERNAME → UID
   */

  const usernameRef =
    doc(
      db,
      USERNAMES_COLLECTION,
      username
    );

  const usernameSnapshot =
    await getDoc(
      usernameRef
    );

  if (
    !usernameSnapshot.exists()
  ) {
    return null;
  }

  const usernameData =
    usernameSnapshot.data();

  const uid =
    normalizeString(
      usernameData?.uid
    );

  if (!uid) {
    return null;
  }

  /*
   * UID → PROFILE
   */

  const profileRef =
    doc(
      db,
      PROFILES_COLLECTION,
      uid
    );

  const profileSnapshot =
    await getDoc(
      profileRef
    );

  if (
    !profileSnapshot.exists()
  ) {
    return null;
  }

  return serializePublicProfile({
    id:
      profileSnapshot.id,

    ...profileSnapshot.data(),
  });
}

/*
 * --------------------------------------------------
 * GET USERNAME RECORD
 * --------------------------------------------------
 *
 * Public + cached.
 *
 * usernames/{username}
 * --------------------------------------------------
 */

export async function getUsernameRecord(
  username
) {
  const normalizedUsername =
    usernameSchema.parse(
      username
    );

  return getCachedUsernameRecord(
    normalizedUsername
  );
}

async function getCachedUsernameRecord(
  username
) {
  "use cache";

  cacheLife("minutes");

  cacheTag(
    "profiles",
    `username:${username}`
  );

  const {
    db,
  } = getPublicServerFirebase();

  const usernameRef =
    doc(
      db,
      USERNAMES_COLLECTION,
      username
    );

  const snapshot =
    await getDoc(
      usernameRef
    );

  if (
    !snapshot.exists()
  ) {
    return null;
  }

  return serializeUsernameRecord({
    id:
      snapshot.id,

    ...snapshot.data(),
  });
}

/*
 * --------------------------------------------------
 * CHECK USERNAME AVAILABILITY
 * --------------------------------------------------
 *
 * Public + cached.
 *
 * Direct lookup:
 *
 * usernames/{username}
 *
 * No query.
 * No authentication required.
 * --------------------------------------------------
 */

export async function isUsernameAvailable(
  username
) {
  const normalizedUsername =
    usernameSchema.parse(
      username
    );

  return checkCachedUsernameAvailability(
    normalizedUsername
  );
}

async function checkCachedUsernameAvailability(
  username
) {
  "use cache";

  cacheLife("seconds");

  cacheTag(
    "profiles",
    `username:${username}`,
    `username-availability:${username}`
  );

  const {
    db,
  } = getPublicServerFirebase();

  const usernameRef =
    doc(
      db,
      USERNAMES_COLLECTION,
      username
    );

  const snapshot =
    await getDoc(
      usernameRef
    );

  return !snapshot.exists();
}

/*
 * --------------------------------------------------
 * BUILD PROFILE UPDATES
 * --------------------------------------------------
 */

function buildProfileUpdates(
  updates,
  category
) {
  const clean = {};

  if (
    updates.role !==
    undefined
  ) {
    clean.role =
      normalizeString(
        updates.role
      );
  }

  if (
    updates.province !==
    undefined
  ) {
    clean.province =
      normalizeString(
        updates.province
      );
  }

  if (
    updates.district !==
    undefined
  ) {
    clean.district =
      normalizeString(
        updates.district
      );
  }

  if (
    updates.bio !==
    undefined
  ) {
    clean.bio =
      normalizeString(
        updates.bio
      );
  }

  if (
    updates.phone !==
    undefined
  ) {
    clean.phone =
      normalizeString(
        updates.phone
      );
  }

  if (
    updates.whatsapp !==
    undefined
  ) {
    clean.whatsapp =
      normalizeString(
        updates.whatsapp
      );
  }

  if (
    updates.available !==
    undefined
  ) {
    clean.available =
      updates.available ===
      true;
  }

  if (
    updates.avatar !==
    undefined
  ) {
    clean.avatar =
      typeof updates.avatar ===
        "string"
        ? updates.avatar.trim()
        : null;
  }

  if (
    updates.skills !==
    undefined
  ) {
    clean.skills =
      normalizeStringArray(
        updates.skills
      );
  }

  if (
    updates.services !==
    undefined
  ) {
    clean.services =
      normalizeServices(
        updates.services
      );
  }

  if (category) {
    clean.categoryId =
      category.id;

    clean.category =
      category.name;
  }

  clean.updatedAt =
    serverTimestamp();

  return clean;
}

/*
 * --------------------------------------------------
 * UPDATE PROFILE
 * --------------------------------------------------
 */

export async function updateProfile(
  updates
) {
  const user =
    await getCurrentUser();

  const validation =
    profileUpdateSchema.safeParse(
      updates ?? {}
    );

  if (!validation.success) {
    throw new Error(
      "INVALID_PROFILE_DATA"
    );
  }

  const data =
    validation.data;

  const {
    db,
  } = await getServerFirebase();

  const profileRef =
    doc(
      db,
      PROFILES_COLLECTION,
      user.uid
    );

  const profileSnapshot =
    await getDoc(
      profileRef
    );

  if (
    !profileSnapshot.exists()
  ) {
    throw new Error(
      "PROFILE_NOT_FOUND"
    );
  }

  const profile = {
    id:
      profileSnapshot.id,

    ...profileSnapshot.data(),
  };

  const currentUsername =
    usernameSchema.safeParse(
      profile.username
    ).success
      ? profile.username
      : "";

  const requestedUsername =
    data.username ??
    currentUsername;

  const usernameChanged =
    requestedUsername !==
    currentUsername;

  const requestedCategoryId =
    data.categoryId ??
    profile.categoryId;

  const categoryChanged =
    requestedCategoryId !==
    profile.categoryId;

  let newCategory = null;

  if (categoryChanged) {
    newCategory =
      getCategory(
        requestedCategoryId
      );

    if (!newCategory) {
      throw new Error(
        "CATEGORY_NOT_FOUND"
      );
    }
  }

  /*
   * ------------------------------------------------
   * NORMAL PROFILE UPDATE
   * ------------------------------------------------
   */

  if (!usernameChanged) {
    const cleanUpdates =
      buildProfileUpdates(
        data,
        categoryChanged
          ? newCategory
          : null
      );

    await updateDoc(
      profileRef,
      cleanUpdates
    );

    const updatedSnapshot =
      await getDoc(
        profileRef
      );

    return serializeProfile({
      id:
        updatedSnapshot.id,

      ...updatedSnapshot.data(),
    });
  }

  /*
   * ------------------------------------------------
   * USERNAME CHANGE
   * ------------------------------------------------
   */

  const oldUsernameRef =
    currentUsername
      ? doc(
          db,
          USERNAMES_COLLECTION,
          currentUsername
        )
      : null;

  const newUsernameRef =
    doc(
      db,
      USERNAMES_COLLECTION,
      requestedUsername
    );

  await runTransaction(
    db,
    async (transaction) => {
      /*
       * ALL READS FIRST.
       */

      const profileSnapshot =
        await transaction.get(
          profileRef
        );

      if (
        !profileSnapshot.exists()
      ) {
        throw new Error(
          "PROFILE_NOT_FOUND"
        );
      }

      const newUsernameSnapshot =
        await transaction.get(
          newUsernameRef
        );

      if (
        newUsernameSnapshot.exists()
      ) {
        const ownerUid =
          normalizeString(
            newUsernameSnapshot
              .data()
              ?.uid
          );

        if (
          ownerUid !==
          user.uid
        ) {
          throw new Error(
            "USERNAME_TAKEN"
          );
        }
      }

      let oldUsernameSnapshot =
        null;

      if (oldUsernameRef) {
        oldUsernameSnapshot =
          await transaction.get(
            oldUsernameRef
          );
      }

      /*
       * BUILD UPDATE
       */

      const cleanUpdates =
        buildProfileUpdates(
          data,
          categoryChanged
            ? newCategory
            : null
        );

      cleanUpdates.username =
        requestedUsername;

      /*
       * PROFILE
       */

      transaction.update(
        profileRef,
        cleanUpdates
      );

      /*
       * NEW USERNAME
       */

      const usernameRecord = {
        id:
          requestedUsername,

        uid:
          user.uid,

        username:
          requestedUsername,

        updatedAt:
          serverTimestamp(),
      };

      if (
        newUsernameSnapshot.exists()
      ) {
        const existingCreatedAt =
          newUsernameSnapshot
            .data()
            ?.createdAt;

        if (
          existingCreatedAt
        ) {
          usernameRecord.createdAt =
            existingCreatedAt;
        }
      } else {
        usernameRecord.createdAt =
          serverTimestamp();
      }

      transaction.set(
        newUsernameRef,
        usernameRecord
      );

      /*
       * DELETE OLD USERNAME
       */

      if (
        oldUsernameRef &&
        oldUsernameSnapshot?.exists()
      ) {
        const oldOwnerUid =
          normalizeString(
            oldUsernameSnapshot
              .data()
              ?.uid
          );

        if (
          oldOwnerUid ===
          user.uid
        ) {
          transaction.delete(
            oldUsernameRef
          );
        }
      }
    }
  );

  const updatedSnapshot =
    await getDoc(
      profileRef
    );

  if (
    !updatedSnapshot.exists()
  ) {
    throw new Error(
      "PROFILE_UPDATE_FAILED"
    );
  }

  return serializeProfile({
    id:
      updatedSnapshot.id,

    ...updatedSnapshot.data(),
  });
}

/*
 * --------------------------------------------------
 * UPDATE USERNAME
 * --------------------------------------------------
 */

export async function updateUsername(
  username
) {
  return updateProfile({
    username,
  });
}

/*
 * --------------------------------------------------
 * UPDATE PROFILE + USERNAME
 * --------------------------------------------------
 */

export async function updateProfileWithUsername(
  updates
) {
  return updateProfile(
    updates
  );
}

/*
 * --------------------------------------------------
 * DELETE PROFILE
 * --------------------------------------------------
 */

export async function deleteProfile() {
  const user =
    await getCurrentUser();

  const {
    db,
  } = await getServerFirebase();

  const profileRef =
    doc(
      db,
      PROFILES_COLLECTION,
      user.uid
    );

  const profileSnapshot =
    await getDoc(
      profileRef
    );

  if (
    !profileSnapshot.exists()
  ) {
    throw new Error(
      "PROFILE_NOT_FOUND"
    );
  }

  const profile =
    profileSnapshot.data();

  const username =
    usernameSchema.safeParse(
      profile?.username
    ).success
      ? profile.username
      : null;

  const usernameRef =
    username
      ? doc(
          db,
          USERNAMES_COLLECTION,
          username
        )
      : null;

  await runTransaction(
    db,
    async (transaction) => {
      /*
       * ALL READS FIRST.
       */

      const currentProfileSnapshot =
        await transaction.get(
          profileRef
        );

      if (
        !currentProfileSnapshot.exists()
      ) {
        throw new Error(
          "PROFILE_NOT_FOUND"
        );
      }

      let usernameSnapshot =
        null;

      if (usernameRef) {
        usernameSnapshot =
          await transaction.get(
            usernameRef
          );
      }

      /*
       * WRITES
       */

      transaction.delete(
        profileRef
      );

      if (
        usernameRef &&
        usernameSnapshot?.exists()
      ) {
        const ownerUid =
          normalizeString(
            usernameSnapshot
              .data()
              ?.uid
          );

        if (
          ownerUid ===
          user.uid
        ) {
          transaction.delete(
            usernameRef
          );
        }
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
  serializeProfile,
  serializePublicProfile,
  serializeUsernameRecord,
};