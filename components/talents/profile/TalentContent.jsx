import TalentAbout from "./TalentAbout";
import TalentSkills from "./TalentSkills";
import TalentServices from "./TalentServices";
import TalentPortfolio from "./TalentPortfolio";
import TalentAvailability from "./TalentAvailability";
import ContactCard from "./ContactCard";

export default function TalentContent({
  talent,
  services,
  works,
}) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div className="min-w-0">
            <TalentAbout talent={talent} />

            <TalentSkills talent={talent} />

            <TalentServices services={services} />

            <TalentPortfolio
              talent={talent}
              works={works}
            />

            <TalentAvailability talent={talent} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ContactCard talent={talent} />
          </aside>
        </div>
      </div>
    </section>
  );
}