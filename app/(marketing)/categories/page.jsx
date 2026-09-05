import { Suspense } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoriesHero from "@/components/categories/CategoriesHero";
import CategoriesClient from "@/components/categories/CategoriesClient";
import CategoriesSkeleton from "@/components/categories/CategoriesSkeleton";
import CategoriesHeroSkeleton from "@/components/categories/CategoriesHeroSkeleton";
import { YouthSpaceBanner } from "@/components/categories/CategoriesContent";

import { getAllCategoriesAction } from "@/actions/categories";

async function CategoriesContent() {
  try {
    const result = await getAllCategoriesAction();

    const categories =
      result?.success && Array.isArray(result.categories)
        ? result.categories
        : [];

    return <CategoriesClient categories={categories} />;
  } catch {
    return <CategoriesClient categories={[]} />;
  }
}

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <Suspense fallback={<CategoriesHeroSkeleton />}>
        <CategoriesHero />
      </Suspense>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesContent />
      </Suspense>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <YouthSpaceBanner />
      </div>

      <Footer />
    </main>
  );
}
