"use client";

import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { logoutAction } from "@/actions/auth";
import { auth } from "@/lib/client";

export default function FooterLogout() {
    const router = useRouter();

    async function handleLogout() {
        try {
            /*
             * --------------------------------------------------
             * LOG OUT OF FIREBASE CLIENT
             * --------------------------------------------------
             */

            await signOut(auth);

            /*
             * --------------------------------------------------
             * DELETE SERVER SESSION
             * --------------------------------------------------
             */

            const result =
                await logoutAction();

            if (!result?.success) {
                throw new Error(
                    result?.error ||
                        "Unable to log out."
                );
            }

            /*
             * --------------------------------------------------
             * REFRESH SERVER COMPONENTS
             * --------------------------------------------------
             */

            router.refresh();
        } catch (error) {
            console.error(
                "[FooterLogout]",
                error
            );
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
            <LogOut size={16} />
            Log out
        </button>
    );
}