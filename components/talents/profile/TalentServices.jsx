import { Sparkles } from "lucide-react";

import SectionHeading from "./SectionHeading";

export default function TalentServices({ services }) {
  if (!services.length) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">
      <SectionHeading
        eyebrow="Services"
        title="What I offer"
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Sparkles size={16} />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-black">
                  {service.name}
                </h3>

                {service.description && (
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {service.description}
                  </p>
                )}

                {service.price !== undefined &&
                  service.price !== null && (
                    <p className="mt-2 text-xs font-bold text-slate-950">
                      From K
                      {Number(
                        service.price,
                      ).toLocaleString()}
                    </p>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}