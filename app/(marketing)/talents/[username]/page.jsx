import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TalentProfile from "@/components/talents/profile/TalentProfile";

import { getTalentByUsername } from "@/data/talents";
import { getWorksByTalent } from "@/data/works";

export const instant = false;

export default async function TalentPage({ params }) {
  const { username } = await params;

  const talent = await getTalentByUsername(username);

  if (!talent) {
    notFound();
  }

  const works = await getWorksByTalent(talent.uid);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <TalentProfile
        talent={talent}
        services={talent.services || []}
        works={works}
      />

      <Footer />
    </main>
  );
}