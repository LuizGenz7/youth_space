import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./client";


/*
 * --------------------------------------------------
 * GOOGLE PROVIDER
 * --------------------------------------------------
 */

const googleProvider =
  new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

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
 */

export async function signInWithGoogle() {
  const result =
    await signInWithPopup(
      auth,
      googleProvider,
    );

  return {
    uid: result.user.uid,
    email: result.user.email,
    displayName:
      result.user.displayName,
    photoURL:
      result.user.photoURL,
    emailVerified:
      result.user.emailVerified,
  };
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