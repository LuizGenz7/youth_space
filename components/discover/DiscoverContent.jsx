import { Suspense } from "react";
import { MapPin } from "lucide-react";

import StatsSection from "./StatsSection";
import TopCategoriesSection from "./TopCategoriesSection";
import TalentSection from "./TalentSection";
import TrendingWorksSection from "./TrendingWorksSection";
import DiscoverBanner from "./DiscoverBanner";
import DiscoverPoster from "./DiscoverPoster";

import StatsLoading from "./StatsLoading";
import TopCategoriesLoading from "./TopCategoriesLoading";
import TalentSectionLoading from "./TalentSectionLoading";
import TrendingWorksLoading from "./TrendingWorksLoading";

export default function DiscoverContent() {
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

        <Suspense fallback={<StatsLoading className="mt-7" />}>
          <StatsSection className="mt-7" />
        </Suspense>

        {/* Top categories */}

        <Suspense
          fallback={<TopCategoriesLoading className="mt-12 sm:mt-16" />}
        >
          <TopCategoriesSection className="mt-12 sm:mt-16" />
        </Suspense>

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

        <Suspense
          fallback={<TalentSectionLoading className="mt-12 sm:mt-16" />}
        >
          <TalentSection
            type="top"
            eyebrow="Community favourites"
            title="Top 10 talents"
            description="Meet some of the talents getting the most attention."
            href="/talents"
            className="mt-12 sm:mt-16"
          />
        </Suspense>

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

        <Suspense
          fallback={<TalentSectionLoading className="mt-12 sm:mt-16" />}
        >
          <TalentSection
            type="new"
            eyebrow="Just joined"
            title="New talents"
            description="Discover some of the newest people in the community."
            href="/talents"
            className="mt-12 sm:mt-16"
          />
        </Suspense>

        {/* Trending works */}

        <Suspense
          fallback={<TrendingWorksLoading className="mt-12 sm:mt-20" />}
        >
          <TrendingWorksSection className="mt-12 sm:mt-20" />
        </Suspense>

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
