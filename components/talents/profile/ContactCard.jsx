"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import { useState } from "react";

export default function ContactCard({ talent }) {
  const [copied, setCopied] = useState(false);

  const phone = talent.phone || talent.whatsapp;

  async function handleShare() {
    const profileUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "";

    const shareTitle = `${talent.name} on Youth Space`;

    const shareText = `Check out ${talent.name}'s profile on Youth Space.`;

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: profileUrl,
        });

        return;
      }

      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        profileUrl
      ) {
        await navigator.clipboard.writeText(profileUrl);

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      /*
       * AbortError means the user simply closed the
       * native share dialog. We do not need to show an error.
       */
      if (error?.name === "AbortError") {
        return;
      }

      try {
        if (
          typeof navigator !== "undefined" &&
          navigator.clipboard &&
          profileUrl
        ) {
          await navigator.clipboard.writeText(profileUrl);

          setCopied(true);

          window.setTimeout(() => {
            setCopied(false);
          }, 2000);
        }
      } catch {
        // Clipboard may be unavailable in some browsers.
      }
    }
  }

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
      {/* ================================================================ */}
      {/* Header                                                           */}
      {/* ================================================================ */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
          <MessageCircle
            size={19}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        {talent.available && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
              Available
            </span>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* Introduction                                                     */}
      {/* ================================================================ */}

      <div className="mt-6">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
          Get in touch
        </p>

        <h2 className="mt-2 text-xl font-black tracking-[-0.025em] text-slate-950 sm:text-2xl">
          Interested in working together?
        </h2>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          Contact{" "}
          <span className="font-bold text-slate-700">
            {talent.name}
          </span>{" "}
          directly to ask about their services, pricing,
          or availability.
        </p>
      </div>

      {/* ================================================================ */}
      {/* Contact Actions                                                  */}
      {/* ================================================================ */}

      <div className="mt-6 space-y-3">
        {talent.whatsapp && (
          <a
            href={`https://wa.me/${cleanPhoneNumber(
              talent.whatsapp,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm outline-none transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md focus:ring-4 focus:ring-slate-950/[0.08] active:translate-y-0"
          >
            <MessageCircle
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />

            <span>Message on WhatsApp</span>
          </a>
        )}

        {phone && (
          <a
            href={`tel:${cleanPhoneNumber(phone)}`}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 outline-none transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.06] active:translate-y-0"
          >
            <Phone
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />

            <span>Call {talent.name}</span>
          </a>
        )}

        {/* ============================================================ */}
        {/* Share                                                         */}
        {/* ============================================================ */}

        <button
          type="button"
          onClick={handleShare}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 outline-none transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/[0.06] active:translate-y-0"
        >
          {copied ? (
            <>
              <Check
                size={16}
                strokeWidth={2.5}
                aria-hidden="true"
              />

              <span>Profile link copied</span>
            </>
          ) : (
            <>
              <Share2
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />

              <span>Share profile</span>
            </>
          )}
        </button>
      </div>

      {/* ================================================================ */}
      {/* Trust / Availability                                             */}
      {/* ================================================================ */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200">
            {talent.available ? (
              <Check
                size={16}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            ) : (
              <MessageCircle
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black text-slate-950">
              {talent.available
                ? "Currently available"
                : "Contact for availability"}
            </p>

            <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
              Ask about services, pricing, and the best
              way to work together.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* Explore                                                          */}
      {/* ================================================================ */}

      <div className="mt-6 border-t border-slate-100 pt-5">
        <Link
          href="/talents"
          className="group flex items-center justify-between rounded-xl px-1 py-1 text-xs font-bold text-slate-500 outline-none transition hover:text-slate-950 focus:ring-4 focus:ring-slate-950/[0.04]"
        >
          <span>Explore other talents</span>

          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </aside>
  );
}

/* ========================================================================== */
/* Phone                                                                      */
/* ========================================================================== */

function cleanPhoneNumber(phone = "") {
  return String(phone).replace(/\D/g, "");
}
