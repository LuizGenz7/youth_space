// actions/auth.js

"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";

import { adminApp } from "@/lib/firebase-admin";
import {
    SESSION_COOKIE_NAME,
    SESSION_DURATION,
} from "@/lib/auth-config";

/*
 * --------------------------------------------------
 * VALIDATION
 * --------------------------------------------------
 */

const createSessionSchema = z
    .object({
        idToken: z
            .string()
            .trim()
            .min(
                1,
                "Authentication token is required."
            ),

        rememberMe: z.boolean().default(false),
    })
    .strict();

/*
 * --------------------------------------------------
 * CREATE SESSION
 * --------------------------------------------------
 */

export async function createSessionAction(
    input = {}
) {
    /*
     * --------------------------------------------------
     * VALIDATE INPUT
     * --------------------------------------------------
     */

    const validation =
        createSessionSchema.safeParse(input);

    if (!validation.success) {
        return {
            success: false,
            error: "Invalid authentication request.",
        };
    }

    const {
        idToken,
        rememberMe,
    } = validation.data;

    try {
        const auth = getAuth(adminApp);

        /*
         * --------------------------------------------------
         * VERIFY FIREBASE ID TOKEN
         * --------------------------------------------------
         */

        const decodedToken =
            await auth.verifyIdToken(idToken);

        /*
         * --------------------------------------------------
         * CREATE SERVER SESSION
         * --------------------------------------------------
         */

        const sessionCookie =
            await auth.createSessionCookie(
                idToken,
                {
                    expiresIn: SESSION_DURATION,
                }
            );

        /*
         * --------------------------------------------------
         * STORE HTTP-ONLY COOKIE
         * --------------------------------------------------
         */

        const cookieStore = await cookies();

        const cookieOptions = {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite: "lax",

            path: "/",
        };

        /*
         * --------------------------------------------------
         * REMEMBER ME
         *
         * Persistent cookie when enabled.
         * Session cookie when disabled.
         * --------------------------------------------------
         */

        if (rememberMe) {
            cookieOptions.maxAge =
                SESSION_DURATION / 1000;
        }

        cookieStore.set(
            SESSION_COOKIE_NAME,
            sessionCookie,
            cookieOptions
        );

        /*
         * --------------------------------------------------
         * SUCCESS
         * --------------------------------------------------
         */

        return {
            success: true,
            error: null,
            uid: decodedToken.uid,
        };
    } catch (error) {
        console.error(
            "[createSessionAction]",
            error
        );

        return {
            success: false,
            error:
                getAuthErrorMessage(error),
        };
    }
}

/*
 * --------------------------------------------------
 * LOGOUT
 * --------------------------------------------------
 */

export async function logoutAction() {
    try {
        const cookieStore = await cookies();

        cookieStore.delete(
            SESSION_COOKIE_NAME
        );

        return {
            success: true,
            error: null,
        };
    } catch (error) {
        console.error(
            "[logoutAction]",
            error
        );

        return {
            success: false,
            error: "Unable to log out.",
        };
    }
}

/*
 * --------------------------------------------------
 * AUTH ERROR MESSAGE
 * --------------------------------------------------
 *
 * Never expose raw Firebase/server errors to users.
 * --------------------------------------------------
 */

function getAuthErrorMessage(error) {
    const code = error?.code;

    switch (code) {
        case "auth/id-token-expired":
            return "Your login session has expired. Please sign in again.";

        case "auth/id-token-revoked":
            return "Your login session is no longer valid. Please sign in again.";

        case "auth/invalid-id-token":
            return "Your authentication request is invalid. Please sign in again.";

        case "auth/argument-error":
            return "Invalid authentication request.";

        case "auth/session-cookie-expired":
            return "Your login session has expired. Please sign in again.";

        case "auth/session-cookie-revoked":
            return "Your login session is no longer valid. Please sign in again.";

        default:
            return "Unable to create authentication session. Please try again.";
    }
}