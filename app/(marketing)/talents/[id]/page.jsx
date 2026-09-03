import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TalentProfile from "@/components/talents/profile/TalentProfile";

import { talents } from "@/data/talents";
import { services } from "@/data/services";
import { works } from "@/data/works";

export default async function TalentPage({ params }) {
  const { id } = await params;

  const talent = talents.find((item) => String(item.id) === String(id));

  if (!talent) {
    notFound();
  }

  const talentServices = services.filter(
    (service) => String(service.talentId) === String(talent.id),
  );

  const talentWorks = works.filter(
    (work) => String(work.talentId) === String(talent.id),
  );

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <TalentProfile
        talent={talent}
        services={talentServices}
        works={talentWorks}
      />

      <Footer />
    </main>
  );
}
