// public/firebase-auth-sw.js

import {
  initializeApp,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  getIdToken,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

/*
 * ==================================================
 * FIREBASE CONFIG
 * ==================================================
 */

const firebaseConfig = {
  apiKey:
    "AIzaSyASTiSjHiaz0yTdmVJulD3n8pHiCTETyyM",

  authDomain:
    "youthspace-217a0.firebaseapp.com",

  projectId:
    "youthspace-217a0",

  storageBucket:
    "youthspace-217a0.firebasestorage.app",

  messagingSenderId:
    "1027625418113",

  appId:
    "1:1027625418113:web:f0b3ce146eafac0090bc80",

  measurementId:
    "G-2P888QPL72",
};

/*
 * ==================================================
 * FIREBASE
 * ==================================================
 */

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

/*
 * ==================================================
 * AUTH STATE
 * ==================================================
 *
 * currentUser:
 *   User discovered by Firebase Auth.
 *
 * currentIdToken:
 *   Token explicitly synchronized from the
 *   application OR obtained from Firebase Auth.
 *
 * The explicit token is important because the
 * browser may be using browserSessionPersistence,
 * which is not something the service worker should
 * depend on for authentication.
 * ==================================================
 */

let currentUser = null;

let currentIdToken = null;

let authInitialized = false;

let authReadyResolve;

const authReady =
  new Promise((resolve) => {
    authReadyResolve = resolve;
  });

/*
 * ==================================================
 * FIREBASE AUTH STATE
 * ==================================================
 */

onAuthStateChanged(
  auth,
  async (user) => {
    currentUser = user;

    /*
     * ------------------------------------------------
     * LOGGED OUT
     * ------------------------------------------------
     */

    if (!user) {
      currentIdToken = null;
    }

    /*
     * ------------------------------------------------
     * LOGGED IN
     * ------------------------------------------------
     *
     * Try to obtain a token from Firebase Auth.
     *
     * This is useful for persistent sessions.
     *
     * The explicit SET_AUTH_TOKEN message below is
     * still the source that guarantees immediate
     * login synchronization.
     * ------------------------------------------------
     */

    if (user) {
      try {
        currentIdToken =
          await getIdToken(
            user,
            false,
          );
      } catch (error) {
        console.error(
          "Firebase Auth SW: Failed to initialize ID token.",
          error,
        );
      }
    }

    /*
     * ------------------------------------------------
     * INITIAL AUTH READY
     * ------------------------------------------------
     */

    if (!authInitialized) {
      authInitialized = true;

      authReadyResolve();
    }
  },
);

/*
 * ==================================================
 * INSTALL
 * ==================================================
 */

self.addEventListener(
  "install",
  (event) => {
    /*
     * Activate the new service worker immediately.
     */
    event.waitUntil(
      self.skipWaiting(),
    );
  },
);

/*
 * ==================================================
 * ACTIVATE
 * ==================================================
 */

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      self.clients.claim(),
    );
  },
);

/*
 * ==================================================
 * MESSAGE
 * ==================================================
 *
 * The application uses these messages to explicitly
 * synchronize authentication.
 *
 * SET_AUTH_TOKEN
 *     Login / token refresh
 *
 * CLEAR_AUTH_TOKEN
 *     Logout
 * ==================================================
 */

self.addEventListener(
  "message",
  (event) => {
    const data =
      event.data;

    if (
      !data ||
      typeof data !== "object"
    ) {
      return;
    }

    /*
     * ------------------------------------------------
     * SET AUTH TOKEN
     * ------------------------------------------------
     */

    if (
      data.type ===
      "SET_AUTH_TOKEN"
    ) {
      const token =
        typeof data.token === "string"
          ? data.token.trim()
          : "";

      currentIdToken =
        token || null;

      /*
       * Tell the client that the token is now
       * available to the service worker.
       */

      if (event.ports?.[0]) {
        event.ports[0].postMessage({
          type:
            "AUTH_TOKEN_SYNCED",
        });
      }

      return;
    }

    /*
     * ------------------------------------------------
     * CLEAR AUTH TOKEN
     * ------------------------------------------------
     */

    if (
      data.type ===
      "CLEAR_AUTH_TOKEN"
    ) {
      currentIdToken = null;

      currentUser = null;

      if (event.ports?.[0]) {
        event.ports[0].postMessage({
          type:
            "AUTH_TOKEN_CLEARED",
        });
      }
    }
  },
);

/*
 * ==================================================
 * FETCH
 * ==================================================
 */

self.addEventListener(
  "fetch",
  (event) => {
    event.respondWith(
      handleFetch(
        event.request,
      ),
    );
  },
);

/*
 * ==================================================
 * HANDLE FETCH
 * ==================================================
 */

async function handleFetch(
  request,
) {
  const url =
    new URL(request.url);

  /*
   * ------------------------------------------------
   * SAME ORIGIN ONLY
   * ------------------------------------------------
   */

  if (
    url.origin !==
    self.location.origin
  ) {
    return fetch(request);
  }

  /*
   * ------------------------------------------------
   * HTTPS / LOCALHOST ONLY
   * ------------------------------------------------
   */

  if (
    self.location.protocol !==
      "https:" &&
    self.location.hostname !==
      "localhost"
  ) {
    return fetch(request);
  }

  /*
   * ------------------------------------------------
   * NEVER REPLACE AN EXISTING AUTHORIZATION HEADER
   * ------------------------------------------------
   */

  if (
    request.headers.has(
      "Authorization",
    )
  ) {
    return fetch(request);
  }

  /*
   * ------------------------------------------------
   * WAIT FOR INITIAL AUTH STATE
   * ------------------------------------------------
   */

  if (!authInitialized) {
    try {
      await authReady;
    } catch {
      return fetch(request);
    }
  }

  /*
   * ------------------------------------------------
   * REFRESH / RECOVER TOKEN FROM FIREBASE AUTH
   * ------------------------------------------------
   *
   * If an explicitly synchronized token exists,
   * use it.
   *
   * If it does not, try Firebase Auth.
   * ------------------------------------------------
   */

  let idToken =
    currentIdToken;

  if (
    !idToken &&
    currentUser
  ) {
    try {
      idToken =
        await getIdToken(
          currentUser,
          false,
        );

      currentIdToken =
        idToken;
    } catch (error) {
      console.error(
        "Firebase Auth SW: Failed to get ID token.",
        error,
      );

      return fetch(request);
    }
  }

  /*
   * ------------------------------------------------
   * LOGGED OUT
   * ------------------------------------------------
   */

  if (!idToken) {
    return fetch(request);
  }

  /*
   * ------------------------------------------------
   * COPY ORIGINAL HEADERS
   * ------------------------------------------------
   */

  const headers =
    new Headers(
      request.headers,
    );

  /*
   * ------------------------------------------------
   * ATTACH FIREBASE AUTHORIZATION
   * ------------------------------------------------
   */

  headers.set(
    "Authorization",
    `Bearer ${idToken}`,
  );

  /*
   * ------------------------------------------------
   * CREATE AUTHENTICATED REQUEST
   * ------------------------------------------------
   */

  const authenticatedRequest =
    new Request(
      request,
      {
        headers,
      },
    );

  /*
   * ------------------------------------------------
   * SEND REQUEST
   * ------------------------------------------------
 */

  try {
    return await fetch(
      authenticatedRequest,
    );
  } catch (error) {
    console.error(
      "Firebase Auth SW: Authenticated request failed.",
      error,
    );

    /*
     * Never break the application simply because
     * authentication forwarding failed.
     */

    return fetch(request);
  }
}