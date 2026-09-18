import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./client";

/*
 * --------------------------------------------------
 * EMAIL SIGN UP
 * --------------------------------------------------
 */

export async function signUpWithEmail(
  email,
  password,
  displayName,
) {
  const result =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

  if (displayName) {
    await updateProfile(
      result.user,
      {
        displayName,
      },
    );
  }

  await sendEmailVerification(
    result.user,
  );

  return {
    uid: result.user.uid,
    email: result.user.email,
    displayName:
      result.user.displayName,
    emailVerified:
      result.user.emailVerified,
  };
}

/*
 * --------------------------------------------------
 * EMAIL SIGN IN
 * --------------------------------------------------
 */

export async function signInWithEmail(
  email,
  password,
) {
  const result =
    await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

  return {
    uid: result.user.uid,
    email: result.user.email,
    displayName:
      result.user.displayName,
    emailVerified:
      result.user.emailVerified,
  };
}

/*
 * --------------------------------------------------
 * GOOGLE SIGN IN
 * --------------------------------------------------
 *
 * Google authentication is currently disabled.
 * This placeholder keeps existing imports/UI safe.
 * --------------------------------------------------
 */

export async function signInWithGoogle() {
  return "Google sign-in is coming soon.";
}

/*
 * --------------------------------------------------
 * PASSWORD RESET
 * --------------------------------------------------
 */

export async function sendPasswordReset(
  email,
) {
  await sendPasswordResetEmail(
    auth,
    email,
  );

  return {
    success: true,
  };
}

/*
 * --------------------------------------------------
 * RESEND EMAIL VERIFICATION
 * --------------------------------------------------
 */

export async function resendEmailVerification() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "You must be signed in.",
    );
  }

  await sendEmailVerification(user);

  return {
    success: true,
  };
}

/*
 * --------------------------------------------------
 * RE-AUTHENTICATE WITH PASSWORD
 * --------------------------------------------------
 *
 * Confirms the user's current password before
 * performing sensitive account operations.
 * --------------------------------------------------
 */

export async function reauthenticateWithPassword(
  password,
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "You must be signed in.",
    );
  }

  if (!user.email) {
    throw new Error(
      "This account does not have an email/password login.",
    );
  }

  if (!password?.trim()) {
    throw new Error(
      "Please enter your current password.",
    );
  }

  const credential =
    EmailAuthProvider.credential(
      user.email,
      password,
    );

  await reauthenticateWithCredential(
    user,
    credential,
  );

  return {
    success: true,
  };
}

/*
 * --------------------------------------------------
 * DELETE CURRENT FIREBASE AUTH USER
 * --------------------------------------------------
 *
 * IMPORTANT:
 * This permanently deletes the Firebase
 * Authentication account.
 *
 * Firestore profile deletion is handled separately
 * by the server action.
 * --------------------------------------------------
 */

export async function deleteCurrentAuthUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "You must be signed in.",
    );
  }

  await deleteUser(user);

  return {
    success: true,
  };
}

/*
 * --------------------------------------------------
 * SIGN OUT
 * --------------------------------------------------
 */

export async function logout() {
  await signOut(auth);

  return {
    success: true,
  };
}

/*
 * --------------------------------------------------
 * CURRENT USER
 * --------------------------------------------------
 */

export function getClientUser() {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName:
      user.displayName,
    photoURL:
      user.photoURL,
    emailVerified:
      user.emailVerified,
  };
}