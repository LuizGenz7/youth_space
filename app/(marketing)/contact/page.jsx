// app/contact/page.js

import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        {/* Decorative background */}

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

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/[0.03] blur-3xl" />

        <Header />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-24 lg:px-10 lg:pb-24 lg:pt-28 xl:px-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/45 transition hover:text-white"
          >
            <ArrowRight size={14} className="rotate-180" />
            Back home
          </Link>

          <div className="mt-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
                <Sparkles size={10} />
              </span>

              <span className="text-[10px] font-bold text-white/70">
                We&apos;d love to hear from you
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Have a question?
              <br />
              Let&apos;s talk.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Whether you have a question about Youth Space, want to report
              something, need help with your profile or simply want to share an
              idea, we&apos;re here to listen.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20 xl:px-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* LEFT */}

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
              Contact Youth Space
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Start a conversation.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
              Tell us what you need help with, what you&apos;re building, or how
              we can make Youth Space better.
            </p>

            {/* Quick response */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black text-slate-950">
                Prefer a direct conversation?
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                WhatsApp us for a quick conversation with the Youth Space team.
              </p>

              <a
                href="https://wa.me/260962063468"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-black text-slate-950 transition hover:gap-2.5 hover:underline"
              >
                Chat on WhatsApp
                <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* RIGHT */}

          <div className="grid gap-4 sm:grid-cols-2">
            <ContactCard
              icon={<MessageCircle size={20} />}
              label="WhatsApp"
              title="0962 063 468"
              description="Chat with the Youth Space team directly."
              href="https://wa.me/260962063468"
              action="Message us"
            />

            <ContactCard
              icon={<Mail size={20} />}
              label="Email"
              title="techgu@gmail.com"
              description="Send us your question, idea or enquiry."
              href="mailto:techgu@gmail.com"
              action="Send email"
            />

            {/* TECHGU */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:col-span-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Globe size={19} />
              </div>

              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                A TechGU product
              </p>

              <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-slate-950">
                Youth Space is built by TechGU.
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                TechGU is the technology company behind Youth Space. We build
                digital products and experiences that turn ideas into
                innovation.
              </p>

              <a
                href="https://techgu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Visit TechGU
                <ArrowRight size={15} />
              </a>
            </div>
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
   CONTACT CARD
========================================================= */

function ContactCard({ icon, label, title, description, href, action }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-950/[0.05]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-950 transition group-hover:bg-slate-950 group-hover:text-white">
        {icon}
      </div>

      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <h3 className="mt-2 break-words text-lg font-black tracking-tight text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>

      <div className="mt-5 flex items-center gap-2 text-xs font-black text-slate-950">
        {action}

        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </a>
  );
}