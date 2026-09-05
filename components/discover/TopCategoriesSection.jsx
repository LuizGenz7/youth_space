import Link from "next/link";

import SectionHeading from "./SectionHeading";
import CategoryIcon from "@/components/categories/CategoryIcon";

import { getTopCategoriesAction } from "@/actions/categories";

const TOP_CATEGORIES_COUNT = 10;

export default async function TopCategoriesSection({ className = "" }) {
  let categories = [];

  try {
    const result = await getTopCategoriesAction({
      limit: TOP_CATEGORIES_COUNT,
    });

    if (result?.success && Array.isArray(result.categories)) {
      categories = result.categories;
    }
  } catch {
    categories = [];
  }

  /*
   * No data / failed request
   */
  if (categories.length === 0) {
    return (
      <section className={className}>
        <SectionHeading
          eyebrow="Explore"
          title="Top categories"
          description="Browse the skills and services available in the community."
          href="/categories"
          linkLabel="View all"
        />

        <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
          <p className="text-sm font-bold text-slate-700">
            No categories available yet.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Categories will appear here as they become available.
          </p>
        </div>
      </section>
    );
  }

  /*
   * Categories loaded successfully
   */
  return (
    <section className={className}>
      <SectionHeading
        eyebrow="Explore"
        title="Top 10 categories"
        description="Browse the skills and services available in the community."
        href="/categories"
        linkLabel="View all"
      />

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category, index) => {
          const totalTalents = Number(category.totalTalents ?? 0);

          return (
            <Link
              key={category.id}
              href={`/talents?category=${encodeURIComponent(category.name)}`}
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
                  <CategoryIcon icon={category.icon} size={19} />
                </div>

                <span className="text-[10px] font-black text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 truncate text-sm font-black text-slate-950">
                {category.name}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {totalTalents} {totalTalents === 1 ? "talent" : "talents"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
