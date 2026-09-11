import {
  getApps,
  initializeApp,
} from "firebase/app";

import {
  getAuth,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyASTiSjHiaz0yTdmVJulD3n8pHiCTETyyM",
    authDomain: "youthspace-217a0.firebaseapp.com",
    projectId: "youthspace-217a0",
    storageBucket: "youthspace-217a0.firebasestorage.app",
    messagingSenderId: "1027625418113",
    appId: "1:1027625418113:web:f0b3ce146eafac0090bc80",
    measurementId: "G-2P888QPL72",
};
export const clientApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig);

export const auth = getAuth(clientApp);