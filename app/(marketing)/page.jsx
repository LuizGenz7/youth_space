import { Suspense } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import PopularCategories from "@/components/home/PopularCategories";
import LocalServices from "@/components/home/LocalServices";
import ForBusinesses from "@/components/home/ForBusiness";
import HowItWorks from "@/components/home/HowItWorks";
import CreatorCTA from "@/components/home/CreatorCTA";
import FeaturedTalents from "@/components/home/FeaturedTalents";
import LatestWork from "@/components/home/LatestWork";

import PopularCategoriesLoading from "@/components/home/PopularCategoriesLoading";
import LocalServicesLoading from "@/components/home/LocalServicesLoading";
import FeaturedTalentsLoading from "@/components/home/FeaturedTalentsLoading";
import LatestWorkLoading from "@/components/home/LatestWorkLoading";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <Hero />

      <Suspense fallback={<PopularCategoriesLoading />}>
        <PopularCategories />
      </Suspense>

      <Suspense fallback={<LocalServicesLoading />}>
        <LocalServices />
      </Suspense>

      <Suspense fallback={<FeaturedTalentsLoading />}>
        <FeaturedTalents />
      </Suspense>

      <Suspense fallback={<LatestWorkLoading />}>
        <LatestWork />
      </Suspense>

      <ForBusinesses />

      <HowItWorks />

      <CreatorCTA />

      <Footer />
    </main>
  );
}
