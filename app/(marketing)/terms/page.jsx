import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Handshake,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
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
            <FileText size={22} />
          </div>

          {/* Eyebrow */}

          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Terms of Use
          </p>

          {/* Heading */}

          <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
            Simple rules for a better community.
          </h1>

          {/* Description */}

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            These terms explain the basic rules for using Youth Space, creating
            a profile, sharing work and connecting with other people.
          </p>

          {/* Date */}

          <p className="mt-6 text-xs font-medium text-white/30">
            Last updated: September 1, 2026
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
            <TermsHighlight
              icon={UserCheck}
              title="Use responsibly"
              description="Create accurate profiles and use the platform respectfully."
            />

            <TermsHighlight
              icon={Handshake}
              title="Respect others"
              description="Treat other members and their work with respect."
            />

            <TermsHighlight
              icon={ShieldCheck}
              title="Stay safe"
              description="Protect your personal information and account."
            />
          </div>

          {/* Sections */}

          <div className="mt-12 space-y-10 sm:mt-16">
            <TermsSection number="01" title="Accepting these terms">
              <p>
                By using Youth Space, you agree to follow these Terms of Use and
                our Community Guidelines.
              </p>

              <p>
                If you do not agree with these terms, please do not use the
                platform.
              </p>
            </TermsSection>

            <TermsSection number="02" title="Using Youth Space">
              <p>
                Youth Space is a platform designed to help people discover young
                talent, skills, creative work and local services.
              </p>

              <p>
                You agree to use the platform for lawful purposes and in a way
                that does not harm other users or the platform itself.
              </p>
            </TermsSection>

            <TermsSection number="03" title="Your account">
              <p>
                If you create an account, you are responsible for keeping your
                account information accurate and protecting your login
                credentials.
              </p>

              <p>
                You should not share your password or allow another person to
                use your account.
              </p>
            </TermsSection>

            <TermsSection number="04" title="Talent profiles">
              <p>
                If you create a talent profile, the information you provide
                should be accurate and represent the skills, services or work
                you actually offer.
              </p>

              <p>
                Do not impersonate another person, organization or business.
              </p>
            </TermsSection>

            <TermsSection number="05" title="Your content">
              <p>
                You retain responsibility for the images, posts, descriptions
                and other content you upload to Youth Space.
              </p>

              <p>
                Only upload content that you own or have permission to share.
              </p>

              <p>
                By posting content on Youth Space, you allow the platform to
                display that content as necessary to provide its services.
              </p>
            </TermsSection>

            <TermsSection number="06" title="Prohibited content and behaviour">
              <p>
                You must not use Youth Space to publish or distribute content
                that is illegal, abusive, threatening, deceptive, hateful or
                intended to harm others.
              </p>

              <p>
                You must not use the platform to scam, harass, impersonate,
                exploit or deliberately mislead other users.
              </p>
            </TermsSection>

            <TermsSection number="07" title="Connecting with other users">
              <p>
                Youth Space helps people discover and connect with talent, but
                users are responsible for their own interactions and
                transactions.
              </p>

              <p>
                Before meeting someone, hiring a service provider or sharing
                personal information, use your own judgment and take appropriate
                safety precautions.
              </p>
            </TermsSection>

            <TermsSection number="08" title="Services and transactions">
              <p>
                Youth Space may help users discover people offering services,
                but it does not necessarily provide, guarantee or endorse those
                services.
              </p>

              <p>
                Any agreement, payment or transaction between users is between
                the people involved unless Youth Space explicitly states
                otherwise.
              </p>
            </TermsSection>

            <TermsSection number="09" title="Intellectual property">
              <p>
                Youth Space and its underlying platform, branding, design and
                original materials remain the property of their respective
                owners.
              </p>

              <p>
                You may not copy, reproduce or misuse Youth Space&apos;s
                branding or platform without permission.
              </p>
            </TermsSection>

            <TermsSection number="10" title="Platform availability">
              <p>
                We aim to keep Youth Space available and reliable, but we cannot
                guarantee that the platform will always be available,
                uninterrupted or completely error-free.
              </p>

              <p>
                Features may change, be improved, temporarily unavailable or
                removed as Youth Space develops.
              </p>
            </TermsSection>

            <TermsSection number="11" title="Account restrictions">
              <p>
                We may restrict, suspend or remove accounts or content that
                violate these terms, our guidelines or applicable laws.
              </p>

              <p>
                Where appropriate, we may also take action to protect users, the
                community or the security of the platform.
              </p>
            </TermsSection>

            <TermsSection number="12" title="Privacy">
              <p>
                Your use of Youth Space is also subject to our Privacy Policy,
                which explains how information is collected and used.
              </p>

              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 font-bold text-slate-950 hover:underline"
              >
                Read our Privacy Policy
                <ChevronRight size={14} />
              </Link>
            </TermsSection>

            <TermsSection number="13" title="Changes to these terms">
              <p>
                As Youth Space grows, we may update these Terms of Use to
                reflect new features, services or requirements.
              </p>

              <p>The latest version will always be published on this page.</p>
            </TermsSection>
          </div>

          {/* =================================================
              COMMUNITY CTA
          ================================================= */}

          <div className="relative mt-14 overflow-hidden bg-slate-950 p-6 sm:mt-20 sm:p-8">
            {/* Subtle glow */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                Be part of it
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Build a better Youth Space.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                Discover talent, share your work and connect with people in a
                respectful and responsible way.
              </p>

              <Link
                href="/guidelines"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Read community guidelines
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
   TERMS HIGHLIGHT
========================================================= */

function TermsHighlight({ icon: Icon, title, description }) {
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
   TERMS SECTION
========================================================= */

function TermsSection({ number, title, children }) {
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
