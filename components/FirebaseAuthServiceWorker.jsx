"use client";

import { useEffect } from "react";

export default function FirebaseAuthServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/firebase-auth-sw.js", {
        scope: "/",
        type: "module",
      })
      .then((registration) => {
        console.log(
          "Firebase Auth Service Worker registered:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error(
          "Firebase Auth Service Worker registration failed:",
          error,
        );
      });
  }, []);

  return null;
}