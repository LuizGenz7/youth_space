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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <Hero />

      <PopularCategories />

      <LocalServices />

      <FeaturedTalents />

      <LatestWork />

      <ForBusinesses />

      <HowItWorks />

      <CreatorCTA />

      <Footer />
    </main>
  );
}
