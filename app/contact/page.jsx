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
                T
              </div>

              <div className="leading-none">
                <p className="text-[15px] font-black tracking-tight text-white">
                  TechGU
                </p>

                <p className="mt-1 text-[9px] text-white/40">
                  Tech Generative Universe
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
                Let's build something
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Have an idea?
              <br />
              Let's talk.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
              Whether you need a website, mobile application, digital
              product or simply want to discuss an idea, the TechGU
              team would love to hear from you.
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
              Contact TechGU
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Start a conversation.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
              Tell us what you're building, what you're trying to
              solve, or what you need help with. We'll take it from
              there.
            </p>

            {/* Quick response */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black text-slate-950">
                Prefer a direct conversation?
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                WhatsApp us and we'll get back to you as soon as
                possible.
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
              description="Chat with TechGU directly."
              href="https://wa.me/260962063468"
              action="Message us"
            />

            <ContactCard
              icon={<Mail size={20} />}
              label="Email"
              title="techgu@gmail.com"
              description="Send us your idea or enquiry."
              href="mailto:techgu@gmail.com"
              action="Send email"
            />

            <ContactCard
              icon={<Globe size={20} />}
              label="Website"
              title="techgu.com"
              description="Explore TechGU and our products."
              href="https://techgu.com"
              action="Visit website"
            />

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                TechGU
              </p>

              <h3 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
                Turning Ideas Into Innovation.
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                We build digital experiences, products and
                technology that turn ideas into something real.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Explore TechGU
                <ArrowRight size={15} />
              </Link>
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
            © {new Date().getFullYear()} TechGU. All rights reserved.
          </p>

          <p className="text-[10px] font-medium text-slate-400">
            Tech Generative Universe
          </p>
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