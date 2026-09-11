import {
  initializeServerApp,
} from "firebase/app";

import {
  getAuth,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

import {
  headers,
} from "next/headers";

/*
 * --------------------------------------------------
 * FIREBASE CONFIG
 * --------------------------------------------------
 */

const firebaseConfig = {
    apiKey: "AIzaSyASTiSjHiaz0yTdmVJulD3n8pHiCTETyyM",
    authDomain: "youthspace-217a0.firebaseapp.com",
    projectId: "youthspace-217a0",
    storageBucket: "youthspace-217a0.firebasestorage.app",
    messagingSenderId: "1027625418113",
    appId: "1:1027625418113:web:f0b3ce146eafac0090bc80",
    measurementId: "G-2P888QPL72",
};

/*
 * --------------------------------------------------
 * AUTHENTICATED SERVER FIREBASE
 * --------------------------------------------------
 *
 * Uses the request Authorization header.
 *
 * Use this for:
 *
 * - authenticated Server Actions
 * - private profile reads
 * - authenticated Firestore operations
 *
 * DO NOT use inside "use cache".
 * --------------------------------------------------
 */

export async function getServerFirebase() {
  const headersObj =
    await headers();

  const authorization =
    headersObj.get(
      "Authorization",
    );

  const authIdToken =
    authorization?.startsWith(
      "Bearer ",
    )
      ? authorization.slice(7)
      : undefined;

  const serverApp =
    initializeServerApp(
      firebaseConfig,
      {
        authIdToken,

        releaseOnDeref:
          headersObj,
      },
    );

  const auth =
    getAuth(serverApp);

  const db =
    getFirestore(serverApp);

  return {
    app: serverApp,
    auth,
    db,
  };
}

/*
 * --------------------------------------------------
 * PUBLIC SERVER FIREBASE
 * --------------------------------------------------
 *
 * Request-independent FirebaseServerApp.
 *
 * Use this inside "use cache".
 *
 * This is for public Firestore reads such as:
 *
 * usernames/{username}
 * talents/{uid}
 *
 * Firestore Security Rules still apply.
 * --------------------------------------------------
 */

export function getPublicServerFirebase() {
  const serverApp =
    initializeServerApp(
      firebaseConfig,
      {},
    );

  const db =
    getFirestore(serverApp);

  return {
    app: serverApp,
    db,
  };
}