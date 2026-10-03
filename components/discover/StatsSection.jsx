import {
  Compass,
  BriefcaseBusiness,
  MessageCircle,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsSection({
  className = "",
}) {
  return (
    <div
      className={`flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 ${className}`}
    >
      <div className="min-w-[160px] flex-1 sm:min-w-0">
        <StatCard
          icon={Compass}
          value="Discover"
          label="Talents"
        />
      </div>

      <div className="min-w-[160px] flex-1 sm:min-w-0">
        <StatCard
          icon={BriefcaseBusiness}
          value="Showcase"
          label="Their work"
        />
      </div>

      <div className="min-w-[160px] flex-1 sm:min-w-0">
        <StatCard
          icon={MessageCircle}
          value="Connect"
          label="With talents"
        />
      </div>
    </div>
  );
}