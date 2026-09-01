import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  Lock,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition hover:text-slate-950"
          >
            <ArrowLeft size={14} />
            Back home
          </Link>

          <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <ShieldCheck size={22} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Privacy
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            Your privacy matters.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            This page explains how Youth Space collects, uses and protects
            information when you use our platform.
          </p>

          <p className="mt-5 text-xs font-medium text-slate-400">
            Last updated: September 1, 2026
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section>
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="grid gap-5 sm:grid-cols-3">
            <PrivacyHighlight
              icon={Lock}
              title="Protected"
              description="We take reasonable steps to protect your information."
            />

            <PrivacyHighlight
              icon={Eye}
              title="Transparent"
              description="We explain what information we collect and why."
            />

            <PrivacyHighlight
              icon={UserRound}
              title="Your information"
              description="Your information is used to provide and improve Youth Space."
            />
          </div>

          <div className="mt-12 space-y-10 sm:mt-16">
            <PrivacySection number="01" title="Information we collect">
              <p>
                Youth Space may collect information you provide when creating an
                account, creating a talent profile, sharing work or contacting
                us.
              </p>

              <p>
                This may include your name, profile information, location,
                skills, services, images and contact information that you choose
                to make available.
              </p>
            </PrivacySection>

            <PrivacySection number="02" title="How we use your information">
              <p>
                We use information to operate Youth Space and help people
                discover talent, skills, creative work and local services.
              </p>

              <p>
                Information may also be used to improve the platform, provide
                support, maintain security and communicate important service
                updates.
              </p>
            </PrivacySection>

            <PrivacySection number="03" title="Public profiles">
              <p>
                Youth Space is a discovery platform. Information you choose to
                include in your public talent profile may be visible to other
                users.
              </p>

              <p>
                Before publishing information, consider whether you are
                comfortable making it publicly available.
              </p>
            </PrivacySection>

            <PrivacySection number="04" title="Images and creative work">
              <p>
                When you upload images or other work to your profile or posts,
                you understand that this content may be displayed to other Youth
                Space users.
              </p>

              <p>Only upload content that you have the right to share.</p>
            </PrivacySection>

            <PrivacySection number="05" title="Contact information">
              <p>
                If you choose to provide contact information such as a WhatsApp
                number or other communication method, it may be used by people
                who want to connect with you.
              </p>

              <p>
                Do not publish sensitive information that you do not want others
                to see.
              </p>
            </PrivacySection>

            <PrivacySection number="06" title="Data security">
              <p>
                We take reasonable technical and organizational measures to
                protect information from unauthorized access, alteration,
                disclosure or destruction.
              </p>

              <p>
                However, no internet service can guarantee complete security.
              </p>
            </PrivacySection>

            <PrivacySection number="07" title="Third-party services">
              <p>
                Youth Space may rely on third-party services to operate parts of
                the platform, such as authentication, database storage, hosting
                and other infrastructure.
              </p>

              <p>
                These services may process information as necessary to provide
                their functionality.
              </p>
            </PrivacySection>

            <PrivacySection number="08" title="Your choices">
              <p>
                You should be able to review and update information associated
                with your account where the platform provides those features.
              </p>

              <p>
                If you need help with your information or account, contact the
                Youth Space team.
              </p>
            </PrivacySection>

            <PrivacySection number="09" title="Children and young users">
              <p>
                Youth Space is intended to be used responsibly by young people
                and the wider community. Users should only provide information
                that they are permitted to share.
              </p>

              <p>
                We encourage young users to avoid publishing sensitive personal
                information publicly.
              </p>
            </PrivacySection>

            <PrivacySection number="10" title="Changes to this policy">
              <p>
                We may update this Privacy Policy as Youth Space develops. When
                changes are made, the updated version will be published on this
                page.
              </p>
            </PrivacySection>
          </div>

          {/* =================================================
              CONTACT CTA
          ================================================= */}

          <div className="mt-14 overflow-hidden rounded-3xl bg-slate-950 p-6 sm:mt-20 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
              Questions?
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Need help with your privacy?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
              If you have questions about this policy or your information, we're
              happy to help.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Contact Youth Space
              <ChevronRight size={15} />
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

/* =========================================================
   PRIVACY HIGHLIGHT
========================================================= */

function PrivacyHighlight({ icon: Icon, title, description }) {
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
   PRIVACY SECTION
========================================================= */

function PrivacySection({ number, title, children }) {
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
