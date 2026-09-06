import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TalentProfile from "@/components/talents/profile/TalentProfile";

import { getProfileByUsername } from "@/data/profile";
import { getWorksByTalent } from "@/data/works";

export const instant = false;

export default async function TalentPage({ params }) {
  const { username } = await params;

  const profile =
    await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const works =
    await getWorksByTalent(profile.uid);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <TalentProfile
        talent={profile}
        services={profile.services || []}
        works={works}
      />

      <Footer />
    </main>
  );
}