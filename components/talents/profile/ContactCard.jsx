import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";

export default function ContactCard({ talent }) {

  const phone = talent.phone || talent.whatsapp;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
        <MessageCircle size={18} />
      </div>

      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        Get in touch
      </p>

      <h2 className="mt-2 text-xl font-black tracking-tight">
        Interested in working together?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Contact {talent.name} directly to ask about their
        services, pricing or availability.
      </p>

      <div className="mt-6 space-y-3">
        {talent.whatsapp && (
          <a
            href={`https://wa.me/${cleanPhoneNumber(
              talent.whatsapp,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
        )}

        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            <Phone size={16} />
            Call
          </a>
        )}

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
        >
          <Share2 size={16} />
          Share profile
        </button>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <Link
          href="/talents"
          className="flex items-center justify-between text-xs font-bold text-slate-500 transition hover:text-slate-950"
        >
          <span>Explore other talents</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function cleanPhoneNumber(phone = "") {
  return String(phone).replace(/\D/g, "");
}