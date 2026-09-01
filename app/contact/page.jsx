// app/contact/page.js

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        {/* Decorative background */}

        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24 xl:px-14">
          {/* Top */}

          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950 transition group-hover:scale-105">
                Y
              </div>

              <div className="leading-none">
                <p className="text-[15px] font-black tracking-tight text-white">
                  Youth Space
                </p>

                <p className="mt-1 text-[9px] text-white/40">
                  Discover. Connect. Create.
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-xs font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Back home
            </Link>
          </div>

          {/* Hero content */}

          <div className="mt-20 max-w-3xl sm:mt-24 lg:mt-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-md">
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

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              Whether you have a question about Youth Space, want to report
              something, need help with your profile or simply want to share
              an idea, we&apos;re here to listen.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20 xl:px-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Left */}

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
              Contact Youth Space
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Start a conversation.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
              Tell us what you need help with, what you&apos;re building, or
              how we can make Youth Space better.
            </p>

            {/* Quick response */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black text-slate-950">
                Prefer a direct conversation?
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                WhatsApp us for a quick conversation with the Youth Space
                team.
              </p>

              <a
                href="https://wa.me/260962063468"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-black text-slate-950 hover:underline"
              >
                Chat on WhatsApp
                <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* Contact cards */}

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

            {/* TechGU */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
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
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Visit TechGU
                <Globe size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10 xl:px-14">
          <p className="text-[10px] font-medium text-slate-400">
            © {new Date().getFullYear()} Youth Space. All rights reserved.
          </p>

          <a
            href="https://techgu.com"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-bold text-slate-400 transition hover:text-slate-950"
          >
            A TechGU product
          </a>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   CONTACT CARD
========================================================= */

function ContactCard({
  icon,
  label,
  title,
  description,
  href,
  action,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
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

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

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