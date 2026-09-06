import TalentCard from "@/components/talents/TalentCard";
import SectionHeading from "./SectionHeading";

import {
  getTopTalentsAction,
  getNewTalentsAction,
} from "@/actions/talents";

const TALENTS_COUNT = 10;

const TALENT_SECTION_CONFIG = {
  top: {
    emptyTitle: "No top talents yet.",
    emptyDescription:
      "Top talents will appear here as the community grows.",
  },

  new: {
    emptyTitle: "No new talents yet.",
    emptyDescription:
      "New talents will appear here as young people join Youth Space.",
  },
};

export default async function TalentSection({
  type = "top",
  eyebrow,
  title,
  description,
  href,
  className = "",
}) {
  const config =
    TALENT_SECTION_CONFIG[type] ??
    TALENT_SECTION_CONFIG.top;

  let result = null;

  try {
    result =
      type === "new"
        ? await getNewTalentsAction({
            limit: TALENTS_COUNT,
          })
        : await getTopTalentsAction({
            limit: TALENTS_COUNT,
          });
  } catch {
    result = null;
  }

  /*
   * --------------------------------------------------
   * FAILED
   * --------------------------------------------------
   */

  if (!result?.success) {
    return (
      <section className={className}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description="We couldn't load this section right now."
          href={href}
          linkLabel={href ? "View all" : undefined}
        />

        <TalentState
          title="Talents are temporarily unavailable."
          description="Please try again later."
        />
      </section>
    );
  }

  const talents = Array.isArray(result.talents)
  ? result.talents
  : [];

console.log("TalentSection talents:", talents);
  /*
   * --------------------------------------------------
   * EMPTY
   * --------------------------------------------------
   */

  if (talents.length === 0) {
    return (
      <section className={className}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          href={href}
          linkLabel={href ? "View all" : undefined}
        />

        <TalentState
          title={config.emptyTitle}
          description={config.emptyDescription}
          dashed
        />
      </section>
    );
  }

  /*
   * --------------------------------------------------
   * SUCCESS
   * --------------------------------------------------
   */

  return (
    <section className={className}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        href={href}
        linkLabel={href ? "View all" : undefined}
      />

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {talents.map((talent) => (
          <TalentCard
            key={talent.id}
            username={talent.username}
            avatar={talent.avatar}
            displayName={talent.displayName}
            role={talent.role}
            category={talent.category}
            province={talent.province}
            district={talent.district}
            skills={talent.skills}
            likes={talent.likes}
            workCount={talent.workCount}
            verified={talent.verified}
            available={talent.available}
          />
        ))}
      </div>
    </section>
  );
}

/*
 * --------------------------------------------------
 * TALENT STATE
 * --------------------------------------------------
 */

function TalentState({
  title,
  description,
  dashed = false,
}) {
  return (
    <div
      className={[
        "mt-7 rounded-2xl bg-white px-5 py-10 text-center",
        dashed
          ? "border border-dashed border-slate-200"
          : "border border-slate-200",
      ].join(" ")}
    >
      <p className="text-sm font-bold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}