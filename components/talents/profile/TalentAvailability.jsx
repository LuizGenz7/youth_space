import { Clock3 } from "lucide-react";

import SectionHeading from "./SectionHeading";

export default function TalentAvailability({ talent }) {
  const isAvailable = Boolean(talent.available);

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <SectionHeading eyebrow="Availability" title="Work availability" />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
            <Clock3 size={18} />
          </div>

          <div>
            <p className="text-sm font-black">
              {isAvailable ? "Available for work" : "Currently unavailable"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {isAvailable
                ? "Contact this talent to discuss your project, service and availability."
                : "This talent is currently unavailable, but you can still explore their profile and work."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
