import { BriefcaseBusiness, Sparkles, Users } from "lucide-react";

import { talents } from "@/data/talents";
import { categories } from "@/data/categories";
import { works } from "@/data/works";

import StatCard from "./StatCard";

export default function StatsSection({ className = "" }) {
  const totalTalents = talents.length;
  const totalCategories = categories.length;
  const totalWorks = works.length;

  return (
    <div
      className={`flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 ${className}`}
    >
      <div className="min-w-[160px] flex-1 sm:min-w-0">
        <StatCard icon={Users} value={totalTalents} label="Talents" />
      </div>

      <div className="min-w-[160px] flex-1 sm:min-w-0">
        <StatCard
          icon={BriefcaseBusiness}
          value={totalCategories}
          label="Categories"
        />
      </div>

      <div className="min-w-[160px] flex-1 sm:min-w-0">
        <StatCard icon={Sparkles} value={totalWorks} label="Works" />
      </div>
    </div>
  );
}
