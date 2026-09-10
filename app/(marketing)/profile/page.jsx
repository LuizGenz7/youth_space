import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth-server";

import { getProfileByUid } from "@/data/profile";
import { getWorksByTalent } from "@/data/works";
import { getAllCategories } from "@/data/categories";

import ProfileContent from "@/components/profile/ProfileContent";

export default async function ProfilePage() {
  const user = await requireAuth();

  const [
    profile,
    works,
    categories,
  ] = await Promise.all([
    getProfileByUid(user.uid),
    getWorksByTalent(user.uid),
    getAllCategories(),
  ]);

  if (!profile) {
    redirect("/register");
  }

  return (
    <ProfileContent
      profile={profile}
      works={works}
      categories={categories}
    />
  );
}