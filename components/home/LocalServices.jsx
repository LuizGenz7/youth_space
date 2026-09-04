import SectionHeading from "./SectionHeading";
import CategoryCard from "@/components/categories/CategoryCard";

export default async function LocalServices({ categories }) {
  const popularCategories = categories;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Find someone who can do it."
          description="Discover talented young people offering skills and services in your community."
          href="/categories"
          link="Explore categories"
        />

        {popularCategories.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <EmptyCategories />
        )}
      </div>
    </section>
  );
}

function EmptyCategories() {
  return (
    <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      <p className="text-sm font-bold text-slate-600">
        No categories available yet.
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Check back soon to discover available skills and services.
      </p>
    </div>
  );
}
