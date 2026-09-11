import { requireAuth } from "@/lib/auth-server";
import { getMyProfile } from "@/data/profile";
import { getWorksByTalent } from "@/data/works";

import ProfileClient from "@/components/profile/ProfileClient";

export const instant = false;

export default async function ProfilePage() {
  const user = await requireAuth();

  const profile = await getMyProfile();

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-950">
            Profile not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your account is signed in, but your Youth Space profile could not be
            found.
          </p>
        </div>
      </main>
    );
  }

  const works = await getWorksByTalent(user.uid);

  return <ProfileClient profile={profile} works={works} />;
}
