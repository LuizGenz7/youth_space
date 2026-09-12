import {
  initializeApp,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  getIdToken,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


/*
 * --------------------------------------------------
 * FIREBASE CONFIG
 * --------------------------------------------------
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
 * --------------------------------------------------
 * FIREBASE
 * --------------------------------------------------
 */

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);


/*
 * --------------------------------------------------
 * CURRENT ID TOKEN
 * --------------------------------------------------
 */

let currentIdToken = null;


/*
 * --------------------------------------------------
 * AUTH STATE
 * --------------------------------------------------
 */

onAuthStateChanged(
  auth,
  async (user) => {
   

    if (!user) {
      currentIdToken = null;

    
      return;
    }

    try {
      currentIdToken =
        await getIdToken(user);

    
    } catch (error) {


      currentIdToken = null;
    }
  },
);


/*
 * --------------------------------------------------
 * ACTIVATE
 * --------------------------------------------------
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
 * --------------------------------------------------
 * FETCH
 * --------------------------------------------------
 */

self.addEventListener(
  "fetch",
  (event) => {
    const request =
      event.request;

    const url =
      new URL(request.url);


    /*
     * --------------------------------------------------
     * DEBUG
     * --------------------------------------------------
     */



    /*
     * --------------------------------------------------
     * SAME ORIGIN ONLY
     * --------------------------------------------------
     */

    if (
      url.origin !==
      self.location.origin
    ) {
      return;
    }


    /*
     * --------------------------------------------------
     * HTTPS / LOCALHOST ONLY
     * --------------------------------------------------
     */

    if (
      self.location.protocol !==
        "https:" &&
      self.location.hostname !==
        "localhost"
    ) {
      return;
    }


    /*
     * --------------------------------------------------
     * NO TOKEN
     * --------------------------------------------------
     */

    if (!currentIdToken) {
    
      return;
    }


    /*
     * --------------------------------------------------
     * COPY REQUEST HEADERS
     * --------------------------------------------------
     */

    const headers =
      new Headers(
        request.headers,
      );


    /*
     * --------------------------------------------------
     * ATTACH FIREBASE ID TOKEN
     * --------------------------------------------------
     */

    headers.set(
      "Authorization",
      `Bearer ${currentIdToken}`,
    );




    /*
     * --------------------------------------------------
     * CREATE AUTHENTICATED REQUEST
     * --------------------------------------------------
     */

    const authenticatedRequest =
      new Request(request, {
        headers,
      });


    /*
     * --------------------------------------------------
     * SEND REQUEST
     * --------------------------------------------------
     */

    event.respondWith(
      fetch(
        authenticatedRequest,
      ),
    );
  },
);