import { MapPin } from "lucide-react";

import SectionHeading from "./SectionHeading";
import CategoryCard from "./CategoryCard";
import CategoryDirectory from "./CategoryDirectory";
import FeaturedCategory from "./FeaturedCategory";
import CommunityBanner from "./CommunityBanner";
import EmptySearch from "./EmptySearch";
import JoinCTA from "./JoinCTA";

export default function CategoriesContent({
  categories,
  isSearching,
}) {
  if (isSearching) {
    return (
      <section>
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Search results"
            title={
              categories.length
                ? `${categories.length} ${
                    categories.length === 1
                      ? "category"
                      : "categories"
                  } found`
                : "No categories found"
            }
            description={
              categories.length
                ? "Choose a category to discover talented people offering those services."
                : "Try searching for another service or skill."
            }
          />

          {categories.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          ) : (
            <EmptySearch />
          )}
        </div>
      </section>
    );
  }

  const popularCategories = [...categories]
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const featuredCategory =
    categories.find(
      (category) => category.id === "hair-beauty"
    ) ||
    categories.find(
      (category) =>
        category.name.trim().toLowerCase() === "hair & beauty"
    ) ||
    categories.find((category) => category.count > 0);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Discover locally
            </p>

            <h2 className="mt-2 text-xl font-black sm:text-2xl">
              Services across Zambia
            </h2>
          </div>

          <div className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 sm:px-4 sm:text-sm">
            <MapPin size={14} />
            Zambia
          </div>
        </div>

        <section className="mt-10">
          <SectionHeading
            eyebrow="Popular"
            title="What are you looking for?"
            description="Start with the services people discover most."
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </section>

        <CommunityBanner
          eyebrow="Skills connect people"
          title="One skill can open a new door."
          description="Find young people with the skills, creativity and services you need."
          actionLabel="Discover talents"
          actionHref="/talents"
          image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=85"
          imageAlt="Young people connecting and building together"
          className="mt-12 sm:mt-16"
        />

        {featuredCategory && (
          <section className="mt-16 sm:mt-20">
            <FeaturedCategory category={featuredCategory} />
          </section>
        )}

        <CommunityBanner
          eyebrow="Built around people"
          title="Every category has someone behind it."
          description="From creative work to practical services, discover young people turning their abilities into opportunities."
          actionLabel="Meet the community"
          actionHref="/discover"
          image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2000&q=85"
          imageAlt="Young people collaborating on a project"
          className="mt-12 sm:mt-16"
        />

        <section className="mt-16 sm:mt-20">
          <SectionHeading
            eyebrow="Explore everything"
            title="All categories"
            description="Browse the full range of services and skills available."
          />

          <div className="mt-8">
            <CategoryDirectory categories={categories} />
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <JoinCTA />
        </section>
      </div>
    </section>
  );
}