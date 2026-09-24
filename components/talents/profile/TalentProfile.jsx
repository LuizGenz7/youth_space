import TalentHero from "./TalentHero";
import TalentContent from "./TalentContent";

export default function TalentProfile({
  talent,
  works,
}) {
  return (
    <>
      <TalentHero talent={talent} />

      <TalentContent
        talent={talent}
        services={talent.services || []}
        works={works}
      />
    </>
  );
}