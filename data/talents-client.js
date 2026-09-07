import {
    doc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { z } from "zod";

import { db } from "@/lib/firebase";

const TALENTS_COLLECTION = "talents";

/*
 * --------------------------------------------------
 * VALIDATION
 * --------------------------------------------------
 */

const talentProfileSchema = z.object({
    username: z
        .string()
        .trim()
        .toLowerCase()
        .regex(
            /^[a-z0-9_]{3,30}$/,
            "Username must be 3–30 characters and contain only letters, numbers, and underscores."
        ),

    role: z
        .string()
        .trim()
        .min(1, "Role is required.")
        .max(60, "Role must be 60 characters or less."),

    categoryId: z
        .string()
        .trim()
        .min(1, "Category is required."),

    category: z
        .string()
        .trim()
        .min(1, "Category is required."),

    province: z
        .string()
        .trim()
        .min(1, "Province is required."),

    district: z
        .string()
        .trim()
        .min(1, "District is required."),

    bio: z
        .string()
        .trim()
        .min(20, "Bio must be at least 20 characters.")
        .max(500, "Bio must be 500 characters or less."),

    phone: z
        .string()
        .trim()
        .regex(
            /^[0-9+\-\s()]{7,20}$/,
            "Enter a valid phone number."
        ),

    whatsapp: z
        .string()
        .trim()
        .regex(
            /^[0-9+\-\s()]{7,20}$/,
            "Enter a valid WhatsApp number."
        ),

    available: z.boolean(),
});

/*
 * --------------------------------------------------
 * CREATE TALENT PROFILE
 * --------------------------------------------------
 */

export async function createTalentProfile(user, profile) {
    if (!user?.uid) {
        throw new Error("You must be authenticated.");
    }

    const result = talentProfileSchema.safeParse(profile);

    if (!result.success) {
        const firstError =
            result.error.issues[0]?.message ||
            "Invalid profile information.";

        throw new Error(firstError);
    }

    const validatedProfile = result.data;

    const talentRef = doc(
        db,
        TALENTS_COLLECTION,
        user.uid
    );

    await setDoc(talentRef, {
        uid: user.uid,

        email: user.email || null,

        displayName:
            user.displayName?.trim() || "",

        ...validatedProfile,

        avatar: user.photoURL || "",

        skills: [],

        services: [],

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        likes: 0,
        workCount: 0,
        verified: false,
    });
}