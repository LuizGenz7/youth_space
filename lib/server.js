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