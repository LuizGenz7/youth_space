import { Suspense } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoriesHero from "@/components/categories/CategoriesHero";
import CategoriesClient from "@/components/categories/CategoriesClient";
import CategoriesSkeleton from "@/components/categories/CategoriesSkeleton";

import { getCategories } from "@/data/categories";
import CategoriesHeroSkeleton from "@/components/categories/CategoriesHeroSkeleton";

async function CategoriesContent() {
  const categories = await getCategories();
  return <CategoriesClient categories={categories} />;
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

      <Footer />
    </main>
  );
}
