import TalentHero from "./TalentHero";
import TalentContent from "./TalentContent";

export default function TalentProfile({
  talent,
  services,
  works,
}) {
  return (
    <>
      <TalentHero talent={talent} />

      <TalentContent
        talent={talent}
        services={services}
        works={works}
      />
    </>
  );
}