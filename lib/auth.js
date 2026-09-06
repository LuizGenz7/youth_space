import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";

import { adminApp } from "@/lib/firebase-admin";
import {
    SESSION_COOKIE_NAME,
} from "@/lib/auth-config";

/*
 * --------------------------------------------------
 * GET CURRENT USER
 * --------------------------------------------------
 */

export async function getCurrentUser() {
    const cookieStore =
        await cookies();

    const sessionCookie =
        cookieStore.get(
            SESSION_COOKIE_NAME
        )?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedToken =
            await getAuth(
                adminApp
            ).verifySessionCookie(
                sessionCookie,
                true
            );

        return decodedToken;
    } catch {
        return null;
    }
}

/*
 * --------------------------------------------------
 * REQUIRE AUTH
 * --------------------------------------------------
 */

export async function requireAuth() {
    const user =
        await getCurrentUser();

    if (!user) {
        throw new Error(
            "You must be logged in."
        );
    }

    return user;
}

/*
 * --------------------------------------------------
 * GET USER ID
 * --------------------------------------------------
 */

export async function getCurrentUserId() {
    const user =
        await getCurrentUser();

    return user?.uid || null;
}

export async function requireUserId() {
    const user =
        await requireAuth();

    return user.uid;
}

/*
 * --------------------------------------------------
 * ADMIN
 * --------------------------------------------------
 */

export function isAdmin(user) {
    return user?.admin === true;
}

export async function requireAdmin() {
    const user =
        await requireAuth();

    if (!isAdmin(user)) {
        throw new Error(
            "Admin access required."
        );
    }

    return user;
}