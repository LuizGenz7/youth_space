export default function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            How it works
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Discover. Connect. Get it done.
          </h2>

          <p className="mt-5 leading-7 text-slate-500">
            Whether you are looking for a service or showcasing your skills,
            Youth Space keeps the process simple.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          <Step
            number="01"
            title="Search"
            description="Search for the skill, service or type of person you need."
          />

          <Step
            number="02"
            title="Discover"
            description="Explore profiles and work from young people across Zambia."
          />

          <Step
            number="03"
            title="Connect"
            description="Contact the person directly through WhatsApp."
          />
        </div>
      </div>
    </section>
  );
}



/* =========================================================
   STEP
========================================================= */

function Step({ number, title, description }) {
  return (
    <div>
      <span className="text-sm font-black text-slate-400">{number}</span>

      <h3 className="mt-5 text-xl font-black">{title}</h3>

      <p className="mt-3 max-w-sm leading-7 text-slate-500">{description}</p>
    </div>
  );
}


