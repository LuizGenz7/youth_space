import { Suspense } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import TalentsHero from "@/components/talents/TalentsHero";
import TalentsHeroLoading from "@/components/talents/TalentsHeroLoading";
import TalentsBrowser from "@/components/talents/TalentsBrowser";
import TalentsLoading from "@/components/talents/TalentsLoading";

import { getInitialTalentsData } from "@/data/talents";

export default function TalentsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <Suspense fallback={<TalentsHeroLoading />}>
        <TalentsHero />
      </Suspense>

      <Suspense fallback={<TalentsLoading />}>
        <TalentsBrowserData />
      </Suspense>

      <Footer />
    </main>
  );
}

async function TalentsBrowserData() {
  const { talents, categories } = await getInitialTalentsData();
  console.log(`TALENTS: ${talents.length}`);
  return <TalentsBrowser talents={talents} categories={categories} />;
}
