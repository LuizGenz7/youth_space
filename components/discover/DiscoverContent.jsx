import { BriefcaseBusiness, MapPin, Sparkles, Users } from "lucide-react";

import { talents } from "@/data/talents";
import { categories } from "@/data/categories";
import { works } from "@/data/works";

import StatCard from "./StatCard";
import TopCategoriesSection from "./TopCategoriesSection";
import TalentSection from "./TalentSection";
import TrendingWorksSection from "./TrendingWorksSection";
import DiscoverBanner from "./DiscoverBanner";
import DiscoverPoster from "./DiscoverPoster";

const TOP_CATEGORIES_COUNT = 10;
const TOP_TALENTS_COUNT = 10;
const NEW_TALENTS_COUNT = 6;
const TRENDING_WORKS_COUNT = 10;

export default function DiscoverContent() {
  const categoriesWithCounts = categories.map((category) => ({
    ...category,

    count: talents.filter(
      (talent) =>
        talent.category?.trim().toLowerCase() ===
        category.name?.trim().toLowerCase(),
    ).length,
  }));

  const topCategories = [...categoriesWithCounts]
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_CATEGORIES_COUNT);

  const topTalents = [...talents]
    .sort((a, b) => {
      const scoreA = Number(a.likes || 0) + Number(a.workCount || 0);
      const scoreB = Number(b.likes || 0) + Number(b.workCount || 0);

      return scoreB - scoreA;
    })
    .slice(0, TOP_TALENTS_COUNT);

  const newTalents = [...talents]
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) {
        return 0;
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    })
    .slice(0, NEW_TALENTS_COUNT);

  const trendingWorks = [...works]
    .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
    .slice(0, TRENDING_WORKS_COUNT);

  const totalTalents = talents.length;
  const totalCategories = categories.length;
  const totalWorks = works.length;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Discovery intro */}

        <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Explore Youth Space
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              There&apos;s talent everywhere.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Take a look around and discover someone who can do something
              amazing.
            </p>
          </div>

          <div className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">
            <MapPin size={16} />
            Zambia
          </div>
        </div>

        {/* Stats */}

        <div className="mt-7 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
          <div className="min-w-[160px] flex-1 sm:min-w-0">
            <StatCard
              icon={Users}
              value={totalTalents}
              label="Talents"
            />
          </div>

          <div className="min-w-[160px] flex-1 sm:min-w-0">
            <StatCard
              icon={BriefcaseBusiness}
              value={totalCategories}
              label="Categories"
            />
          </div>

          <div className="min-w-[160px] flex-1 sm:min-w-0">
            <StatCard
              icon={Sparkles}
              value={totalWorks}
              label="Works"
            />
          </div>
        </div>

        {/* Top categories */}

        <TopCategoriesSection
          categories={topCategories}
          className="mt-12 sm:mt-16"
        />

        {/* Banner */}

        <DiscoverBanner
          eyebrow="Every skill has a story"
          title="Someone out there is good at what you need."
          description="Explore the community and discover young people turning their skills into something meaningful."
          actionLabel="Explore all talents"
          actionHref="/talents"
          image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85"
          imageAlt="Young people connecting and building together"
          className="mt-12 sm:mt-16"
        />

        {/* Top talents */}

        <TalentSection
          eyebrow="Community favourites"
          title="Top 10 talents"
          description="Meet some of the talents getting the most attention."
          talents={topTalents}
          href="/talents"
          className="mt-12 sm:mt-16"
        />

        {/* New talents poster */}

        <DiscoverPoster
          eyebrow="Fresh faces"
          title="There is always someone new to discover."
          description="Meet young people who are bringing their skills and ideas to Youth Space."
          actionLabel="Discover more talents"
          actionHref="/talents"
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85"
          imageAlt="Young people working together"
          className="mt-12 sm:mt-16"
        />

        {/* New talents */}

        <TalentSection
          eyebrow="Just joined"
          title="New talents"
          description="Discover some of the newest people in the community."
          talents={newTalents}
          href="/talents"
          className="mt-12 sm:mt-16"
        />

        {/* Trending works */}

        <TrendingWorksSection
          works={trendingWorks}
          className="mt-12 sm:mt-20"
        />

        {/* Bottom CTA */}

        <DiscoverPoster
          eyebrow="Youth Space"
          title="Your skill could be someone else's opportunity."
          description="Put your talent out there and let people discover what you can do."
          actionLabel="View talents"
          actionHref="/talents"
          image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85"
          imageAlt="Young people collaborating"
          className="mt-12 sm:mt-20"
        />
      </div>
    </section>
  );
}