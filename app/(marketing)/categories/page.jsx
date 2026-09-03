import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoriesClient from "@/components/categories/CategoriesClient";

import { categories } from "@/data/categories";
import { talents } from "@/data/talents";

export default function CategoriesPage() {
  const categoriesWithCounts = categories.map((category) => {
    const count = talents.filter(
      (talent) =>
        talent.category?.trim().toLowerCase() ===
        category.name.trim().toLowerCase(),
    ).length;

    return {
      ...category,
      count,
    };
  });

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <CategoriesClient categories={categoriesWithCounts} />

      <Footer />
    </main>
  );
}
