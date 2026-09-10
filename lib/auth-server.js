import {
  redirect,
} from "next/navigation";

import {
  getServerFirebase,
} from "./server";


/*
 * ==================================================
 * GET CURRENT AUTHENTICATED USER
 * ==================================================
 *
 * Server-side only.
 *
 * Returns:
 *
 * user object
 * OR
 * null
 *
 * No redirect.
 */

export async function getAuthUser() {
  const {
    auth,
  } = await getServerFirebase();


  /*
   * --------------------------------------------------
   * WAIT FOR FIREBASE AUTH INITIALIZATION
   * --------------------------------------------------
   *
   * FirebaseServerApp receives the ID token from
   * the Authorization header.
   *
   * Wait until Firebase Auth has processed that
   * authentication state before reading currentUser.
   */

  await auth.authStateReady();


  /*
   * --------------------------------------------------
   * GET CURRENT USER
   * --------------------------------------------------
   */

  const user =
    auth.currentUser;


  if (!user) {
    return null;
  }


  /*
   * --------------------------------------------------
   * RETURN PLAIN OBJECT
   * --------------------------------------------------
   *
   * Never return the Firebase User object directly
   * from a Server Function.
   */

  return {
    uid:
      user.uid,

    email:
      user.email,

    displayName:
      user.displayName,

    photoURL:
      user.photoURL,

    emailVerified:
      user.emailVerified,
  };
}


/*
 * ==================================================
 * REQUIRE AUTH
 * ==================================================
 *
 * Use this for protected pages.
 *
 * If there is no authenticated
 * user, redirect to /login.
 */

export async function requireAuth() {
  const user =
    await getAuthUser();


  if (!user) {
    redirect("/login");
  }


  return user;
}


/*
 * ==================================================
 * REQUIRE AUTH — SERVER ACTION
 * ==================================================
 *
 * Use this inside Server Actions.
 *
 * NEVER redirects.
 *
 * Server Actions should return
 * structured errors instead of
 * redirecting the request.
 */

export async function requireAuthAction() {
  const user =
    await getAuthUser();


  if (!user) {
    const error =
      new Error(
        "AUTH_REQUIRED",
      );

    error.code =
      "AUTH_REQUIRED";

    throw error;
  }


  return user;
}