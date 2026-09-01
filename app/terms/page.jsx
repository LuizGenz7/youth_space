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
            <FileText size={22} />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Terms of Use
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            Simple rules for a better community.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            These terms explain the basic rules for using Youth Space,
            creating a profile, sharing work and connecting with other people.
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
                By using Youth Space, you agree to follow these Terms of Use
                and our Community Guidelines.
              </p>

              <p>
                If you do not agree with these terms, please do not use the
                platform.
              </p>
            </TermsSection>

            <TermsSection number="02" title="Using Youth Space">
              <p>
                Youth Space is a platform designed to help people discover
                young talent, skills, creative work and local services.
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
                personal information, use your own judgment and take
                appropriate safety precautions.
              </p>
            </TermsSection>

            <TermsSection number="08" title="Services and transactions">
              <p>
                Youth Space may help users discover people offering services,
                but it does not necessarily provide, guarantee or endorse
                those services.
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
                You may not copy, reproduce or misuse Youth Space&apos;s branding
                or platform without permission.
              </p>
            </TermsSection>

            <TermsSection number="10" title="Platform availability">
              <p>
                We aim to keep Youth Space available and reliable, but we
                cannot guarantee that the platform will always be available,
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
                Where appropriate, we may also take action to protect users,
                the community or the security of the platform.
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

              <p>
                The latest version will always be published on this page.
              </p>
            </TermsSection>
          </div>

          {/* =================================================
              COMMUNITY CTA
          ================================================= */}

          <div className="mt-14 overflow-hidden rounded-3xl bg-slate-950 p-6 sm:mt-20 sm:p-8">
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

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
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