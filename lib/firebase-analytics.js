"use client";

import { getAnalytics, isSupported } from "firebase/analytics";
import { firebaseApp } from "@/lib/firebase";

export async function getFirebaseAnalytics() {
    const supported = await isSupported();

    if (!supported) {
        return null;
    }

    return getAnalytics(firebaseApp);
}