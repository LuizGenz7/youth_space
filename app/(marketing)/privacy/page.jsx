import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronRight,
  Flag,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        {/* Background grid */}

        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        {/* Soft glows */}

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/4 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/3 blur-3xl" />

        {/* Hero content */}

        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
          {/* Back */}

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/45 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back home
          </Link>

          {/* Icon */}

          <div className="mt-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
            <ShieldCheck size={22} />
          </div>

          {/* Eyebrow */}

          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Community & Safety Policy
          </p>

          {/* Heading */}

          <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
            Keep Youth Space safe for everyone.
          </h1>

          {/* Description */}

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            Our community policy explains the content and behaviour we allow,
            what is not permitted and how we work to keep Youth Space useful,
            respectful and safe.
          </p>

          {/* Date */}

          <p className="mt-6 text-xs font-medium text-white/30">
            Last updated: September 24, 2026
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section>
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16 lg:py-20">
          {/* Highlights */}

          <div className="grid gap-5 sm:grid-cols-3">
            <PolicyHighlight
              icon={HeartHandshake}
              title="Respect people"
              description="Treat other members with dignity and respect."
            />

            <PolicyHighlight
              icon={ShieldCheck}
              title="Keep it safe"
              description="Use Youth Space in a lawful and responsible way."
            />

            <PolicyHighlight
              icon={Flag}
              title="Report problems"
              description="Help us identify content that breaks our rules."
            />
          </div>

          {/* Sections */}

          <div className="mt-12 space-y-10 sm:mt-16">
            <PolicySection number="01" title="Our purpose">
              <p>
                Youth Space exists to help people discover talent, skills,
                creative work and local services while creating opportunities
                for people to connect.
              </p>

              <p>
                Our community policies are designed to help keep that experience
                useful, respectful and safe.
              </p>
            </PolicySection>

            <PolicySection number="02" title="What we expect">
              <p>
                We expect everyone using Youth Space to communicate honestly,
                respect other people and use the platform for lawful purposes.
              </p>

              <p>
                Profiles, services, portfolio work and other information should
                represent what you actually offer or do.
              </p>

              <p>
                Do not use Youth Space to deliberately deceive, exploit,
                threaten or harm another person.
              </p>
            </PolicySection>

            <PolicySection number="03" title="Illegal drugs and controlled substances">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <Ban size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-950">
                      Illegal drug activity is not allowed.
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Youth Space must not be used to sell, buy, distribute,
                      advertise, promote, source or facilitate illegal drugs or
                      controlled substances.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                This includes using a talent profile, service, portfolio item,
                description, image, contact information or any other Youth
                Space feature to arrange or facilitate illegal drug-related
                activity.
              </p>

              <p>
                Examples of prohibited activity include offering illegal drugs
                for sale, requesting illegal drugs, advertising drug-related
                sales or providing contact information intended to facilitate
                such activity.
              </p>

              <p>
                Educational, awareness, prevention, health and recovery-related
                content may be allowed when it does not facilitate illegal drug
                activity.
              </p>
            </PolicySection>

            <PolicySection number="04" title="Scams and deceptive activity">
              <p>
                Do not use Youth Space to scam people, impersonate others,
                intentionally provide false information or create misleading
                offers.
              </p>

              <p>
                Services and professional information should be represented
                honestly. Do not claim qualifications, experience or services
                that you do not have or provide.
              </p>
            </PolicySection>

            <PolicySection number="05" title="Harassment and abuse">
              <p>
                Youth Space does not allow threats, targeted harassment,
                intimidation, bullying or abusive behaviour directed at other
                users.
              </p>

              <p>
                Disagreements are allowed. Personal attacks, threats and
                behaviour intended to make another person feel unsafe are not.
              </p>
            </PolicySection>

            <PolicySection number="06" title="Hateful or discriminatory content">
              <p>
                Do not use Youth Space to attack, threaten or encourage
                discrimination or harm against people or groups based on
                protected characteristics.
              </p>

              <p>
                Content that encourages hostility or violence toward people is
                not permitted.
              </p>
            </PolicySection>

            <PolicySection number="07" title="Sexual and exploitative content">
              <p>
                Youth Space is not a platform for sexual services, sexual
                exploitation or sexually explicit content.
              </p>

              <p>
                Content involving the sexual exploitation of minors is strictly
                prohibited and may be reported to the appropriate authorities
                where required.
              </p>
            </PolicySection>

            <PolicySection number="08" title="Violence and dangerous activity">
              <p>
                Do not use Youth Space to threaten people, encourage violence or
                facilitate dangerous or unlawful activities.
              </p>

              <p>
                Content involving legitimate education, news, awareness or
                safety information may be treated differently when it does not
                encourage or facilitate harmful activity.
              </p>
            </PolicySection>

            <PolicySection number="09" title="Spam and platform abuse">
              <p>
                Do not use automated systems, fake accounts or repetitive
                activity to manipulate Youth Space, disrupt the platform or
                mislead other users.
              </p>

              <p>
                Do not upload large amounts of irrelevant content, repeatedly
                contact people without a legitimate reason or attempt to
                circumvent platform restrictions.
              </p>
            </PolicySection>

            <PolicySection number="10" title="Content and intellectual property">
              <p>
                Only upload images, work and other material that you own or have
                permission to use.
              </p>

              <p>
                Do not upload another person&apos;s private information or content
                with the intention of harming, exposing or impersonating them.
              </p>
            </PolicySection>

            <PolicySection number="11" title="Safety when connecting">
              <p>
                Youth Space helps people discover and connect with others, but
                you should take appropriate precautions when communicating,
                meeting or doing business with someone you discovered through
                the platform.
              </p>

              <p>
                Avoid sharing sensitive personal information unnecessarily and
                be cautious when someone asks for money, personal documents or
                information that does not appear necessary for the interaction.
              </p>
            </PolicySection>

            <PolicySection number="12" title="How we enforce these rules">
              <p>
                We may review content and activity when necessary to protect
                users, investigate reports, enforce our policies or comply with
                applicable law.
              </p>

              <p>
                Depending on the situation, we may remove content, restrict
                features, temporarily suspend an account or permanently remove
                an account from Youth Space.
              </p>

              <p>
                We may also take additional action where necessary to protect
                the community or platform.
              </p>
            </PolicySection>

            <PolicySection number="13" title="Automated safety checks">
              <p>
                Youth Space may use automated systems to help identify content
                that may violate our policies.
              </p>

              <p>
                These systems may look for signals associated with prohibited
                activity, including attempts to facilitate illegal drug
                distribution, scams, harassment or other harmful behaviour.
              </p>

              <p>
                Automated systems may make mistakes. Where appropriate, content
                or account decisions may be reviewed before further action is
                taken.
              </p>
            </PolicySection>

            <PolicySection number="14" title="Reporting content">
              <p>
                If you see content or behaviour that you believe violates these
                policies, please report it through the available reporting
                tools.
              </p>

              <p>
                Reports help us identify problems and take appropriate action to
                protect the community.
              </p>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-950">
                    <Flag size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-black">
                      See something that breaks the rules?
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Report it so the Youth Space team can review it.
                    </p>
                  </div>
                </div>
              </div>
            </PolicySection>

            <PolicySection number="15" title="Policy updates">
              <p>
                As Youth Space develops, we may update this policy to address
                new features, risks and community needs.
              </p>

              <p>
                The latest version will always be published on this page.
              </p>
            </PolicySection>
          </div>

          {/* =================================================
              FINAL CTA
          ================================================= */}

          <div className="relative mt-14 overflow-hidden bg-slate-950 p-6 sm:mt-20 sm:p-8">
            {/* Subtle glow */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                Community first
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Help keep Youth Space safe.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                Share your talent, discover opportunities and treat the people
                around you with respect.
              </p>

              <Link
                href="/terms"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Read Terms of Use
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* =========================================================
   POLICY HIGHLIGHT
========================================================= */

function PolicyHighlight({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-950">
        <Icon size={18} />
      </div>

      <h3 className="mt-5 text-sm font-black">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

/* =========================================================
   POLICY SECTION
========================================================= */

function PolicySection({ number, title, children }) {
  return (
    <section className="border-b border-slate-100 pb-10 last:border-0">
      <div className="flex gap-4">
        <span className="shrink-0 pt-1 text-[10px] font-black tracking-wider text-slate-300">
          {number}
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            {title}
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}