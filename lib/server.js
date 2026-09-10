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
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


/*
 * --------------------------------------------------
 * SERVER FIREBASE
 * --------------------------------------------------
 */

export async function getServerFirebase() {
  const headersObj =
    await headers();


  /*
   * --------------------------------------------------
   * AUTHORIZATION HEADER
   * --------------------------------------------------
   */

  const authorization =
    headersObj.get(
      "Authorization",
    );

  console.log(
    "[SERVER FIREBASE] Authorization header:",
    authorization
      ? "PRESENT"
      : "MISSING",
  );


  /*
   * --------------------------------------------------
   * FIREBASE ID TOKEN
   * --------------------------------------------------
   */

  const authIdToken =
    authorization?.startsWith(
      "Bearer ",
    )
      ? authorization.slice(7)
      : undefined;

  console.log(
    "[SERVER FIREBASE] ID token:",
    authIdToken
      ? "PRESENT"
      : "MISSING",
  );


  /*
   * --------------------------------------------------
   * FIREBASE SERVER APP
   * --------------------------------------------------
   */

  const serverApp =
    initializeServerApp(
      firebaseConfig,
      {
        authIdToken,

        releaseOnDeref:
          headersObj,
      },
    );


  /*
   * --------------------------------------------------
   * FIREBASE SERVICES
   * --------------------------------------------------
   */

  const auth =
    getAuth(serverApp);

  const db =
    getFirestore(serverApp);


  /*
   * --------------------------------------------------
   * RETURN
   * --------------------------------------------------
   */

  return {
    app: serverApp,
    auth,
    db,
  };
}