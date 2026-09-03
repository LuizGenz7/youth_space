import { Suspense } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import TalentsHero from "@/components/talents/TalentsHero";
import TalentsBrowser from "@/components/talents/TalentsBrowser";
import TalentsLoading from "@/components/talents/TalentsLoading";

import { talents } from "@/data/talents";
import { categories } from "@/data/categories";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function TalentsData() {
  await delay(2000);

  return (
    <TalentsBrowser
      talents={talents}
      categories={categories}
    />
  );
}

export default function TalentsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      {/* Renders immediately */}
      <TalentsHero />

      {/* Streams after data is ready */}
      <Suspense fallback={<TalentsLoading />}>
        <TalentsData />
      </Suspense>

      <Footer />
    </main>
  );
}