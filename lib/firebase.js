import {
    getApp,
    getApps,
    initializeApp,
} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyASTiSjHiaz0yTdmVJulD3n8pHiCTETyyM",
    authDomain: "youthspace-217a0.firebaseapp.com",
    projectId: "youthspace-217a0",
    storageBucket: "youthspace-217a0.firebasestorage.app",
    messagingSenderId: "1027625418113",
    appId: "1:1027625418113:web:f0b3ce146eafac0090bc80",
    measurementId: "G-2P888QPL72"
};

export const firebaseApp =
    getApps().length > 0
        ? getApp()
        : initializeApp(firebaseConfig);



