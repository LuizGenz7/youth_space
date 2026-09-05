// app/guidelines/page.js

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

export default function GuidelinesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        {/* Background */}

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

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/4 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/3 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          {/* Header */}

          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950 transition group-hover:scale-105">
                Y
              </div>

              <div className="leading-none">
                <p className="text-[15px] font-black tracking-tight text-white">
                  Youth Space
                </p>

                <p className="mt-1 text-[9px] text-white/40">
                  A TechGU product
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={13} />
              Back home
            </Link>
          </div>

          {/* Hero content */}

          <div className="mt-20 max-w-3xl sm:mt-24 lg:mt-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
                <ShieldCheck size={11} />
              </span>

              <span className="text-[10px] font-bold text-white/70">
                Community guidelines
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
              Build a community
              <br />
              worth being part of.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Youth Space is built to help young people discover talent,
              showcase their work and connect with opportunities. These
              guidelines help us keep it useful, respectful and safe.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950 shadow-sm">
              <Heart size={18} />
            </div>

            <div>
              <h2 className="text-lg font-black">The simple rule</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Treat people, their work and their opportunities with the same
                respect you would expect from others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          GUIDELINES
      ===================================================== */}

      <section>
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="space-y-12 sm:space-y-16">
            {/* Respect */}

            <GuidelineSection
              number="01"
              icon={Users}
              title="Respect other people"
              description="Youth Space is a community. Keep interactions constructive and respectful."
              items={[
                "Do not harass, threaten, bully or intimidate other users.",
                "Do not target people because of who they are or where they come from.",
                "Respect other people's boundaries and personal space.",
                "Keep disagreements respectful and focused on the issue.",
              ]}
            />

            {/* Authentic work */}

            <GuidelineSection
              number="02"
              icon={Sparkles}
              title="Show authentic work"
              description="Your profile should accurately represent you and what you can offer."
              items={[
                "Only showcase work that you created or have permission to share.",
                "Do not pretend to be another person, business or organization.",
                "Do not use misleading information to attract customers or opportunities.",
                "Be honest about your skills, experience and services.",
              ]}
            />

            {/* Content */}

            <GuidelineSection
              number="03"
              icon={ImageIcon}
              title="Share useful content"
              description="Posts should contribute something meaningful to the Youth Space community."
              items={[
                "Share your projects, skills, creative work, services and achievements.",
                "Use clear images and descriptions when showcasing your work.",
                "Avoid spam, repetitive promotional content and unrelated posts.",
                "Do not upload content that violates someone else's copyright or privacy.",
              ]}
            />

            {/* Safety */}

            <GuidelineSection
              number="04"
              icon={ShieldCheck}
              title="Keep the community safe"
              description="Some content and behavior has no place on Youth Space."
              items={[
                "Do not use Youth Space to facilitate illegal activities.",
                "Do not share malicious links, scams, phishing attempts or fraudulent offers.",
                "Do not publish another person's private or sensitive information without permission.",
                "Do not use the platform to threaten or encourage harm.",
              ]}
            />

            {/* Services */}

            <GuidelineSection
              number="05"
              icon={CheckCircle2}
              title="Be responsible with services"
              description="Youth Space helps people discover talent, but users are responsible for their own agreements."
              items={[
                "Clearly describe what you offer before accepting work.",
                "Discuss prices, deadlines and expectations before starting a project.",
                "Do not make promises you cannot keep.",
                "Use good judgment when communicating with people you meet through the platform.",
              ]}
            />

            {/* Messaging */}

            <GuidelineSection
              number="06"
              icon={MessageCircle}
              title="Communicate responsibly"
              description="Direct communication should remain professional and respectful."
              items={[
                "Do not spam people with unwanted messages.",
                "Respect someone's decision if they do not want to continue a conversation.",
                "Do not request unnecessary personal information.",
                "Keep business and service conversations clear and professional.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          REPORTING
      ===================================================== */}

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
              <TriangleAlert size={19} />
            </div>

            <h2 className="mt-6 text-2xl font-black tracking-tight">
              See something that breaks the rules?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Help us keep Youth Space safe. If you encounter harmful,
              misleading, abusive or inappropriate content, report it through
              the available reporting tools or contact TechGU.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Contact TechGU
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Youth Space
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK REMINDER
      ===================================================== */}

      <section>
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Reminder
              title="Be respectful"
              description="Treat people and their work with respect."
            />

            <Reminder
              title="Be authentic"
              description="Represent yourself and your work honestly."
            />

            <Reminder
              title="Stay safe"
              description="Protect yourself and respect other people's privacy."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </main>
  );
}

/* =========================================================
   GUIDELINE SECTION
========================================================= */

function GuidelineSection({ number, icon: Icon, title, description, items }) {
  return (
    <section>
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black tracking-[0.18em] text-slate-400">
              {number}
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
              Youth Space
            </span>
          </div>

          <h2 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6 ml-0 border-l border-slate-200 pl-14 sm:ml-[60px]">
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm leading-6 text-slate-600"
            >
              <CheckCircle2
                size={15}
                className="mt-1 shrink-0 text-slate-400"
              />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* =========================================================
   REMINDER
========================================================= */

function Reminder({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
        <CheckCircle2 size={15} />
      </div>

      <h3 className="mt-5 text-sm font-black">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}
