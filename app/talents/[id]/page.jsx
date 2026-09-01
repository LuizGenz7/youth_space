// app/talents/[id]/page.js

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Sparkles,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* =========================================================
   PAGE
========================================================= */

export default async function TalentPage({ params }) {
  const { id } = await params;

  const talent = getTalent(id);

  if (!talent) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <TalentHero talent={talent} />

      <TalentContent talent={talent} />

      <Footer />
    </main>
  );
}

/* =========================================================
   TEST DATA
========================================================= */

const TEST_TALENTS = [
  {
    id: "1",
    name: "Chanda Banda",
    role: "Graphic Designer",
    location: "Lusaka, Zambia",
    initials: "CB",
    verified: true,

    bio: "I'm a creative graphic designer helping individuals, businesses and organizations turn their ideas into clean and memorable visual designs.",

    phone: "+260962123456",
    whatsapp: "+260962123456",

    services: [
      {
        id: "service-1",
        name: "Logo Design",
        description: "Modern and professional logos for brands and businesses.",
        price: "From K250",
      },
      {
        id: "service-2",
        name: "Social Media Designs",
        description: "Eye-catching posts, banners and promotional graphics.",
        price: "From K100",
      },
      {
        id: "service-3",
        name: "Poster Design",
        description: "Professional posters for events, campaigns and businesses.",
        price: "From K150",
      },
      {
        id: "service-4",
        name: "Brand Identity",
        description: "Complete visual identity systems for growing brands.",
        price: "From K800",
      },
    ],

    portfolio: [
      {
        id: "work-1",
        image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
      },
      {
        id: "work-2",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
      },
      {
        id: "work-3",
        image: "https://images.unsplash.com/photo-1542744094-3a31f272c490",
      },
      {
        id: "work-4",
        image: "https://images.unsplash.com/photo-1561070791-2c1c8b8b6f8b",
      },
      {
        id: "work-5",
        image: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
      },
      {
        id: "work-6",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766",
      },
      {
        id: "work-7",
        image: "https://images.unsplash.com/photo-1553484771-371a605b060b",
      },
    ],

    availability: {
      status: "Available for bookings",
      note: "Usually responds within a few hours.",
    },
  },

  {
    id: "2",
    name: "Brian Phiri",
    role: "Photographer",
    location: "Kitwe, Zambia",
    initials: "BP",
    verified: true,

    bio: "Professional photographer specializing in portraits, events, products and creative photography.",

    phone: "+260977654321",
    whatsapp: "+260977654321",

    services: [
      {
        id: "service-1",
        name: "Portrait Photography",
        description: "Professional individual and creative portrait sessions.",
        price: "From K500",
      },
      {
        id: "service-2",
        name: "Event Photography",
        description: "Photography coverage for weddings, parties and events.",
        price: "From K1,000",
      },
      {
        id: "service-3",
        name: "Product Photography",
        description: "Clean and professional photography for products and businesses.",
        price: "From K300",
      },
    ],

    portfolio: [
      {
        id: "work-1",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
      },
      {
        id: "work-2",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
      },
      {
        id: "work-3",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      },
      {
        id: "work-4",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
      },
    ],

    availability: {
      status: "Available this week",
      note: "Contact me to discuss your project.",
    },
  },
];

/* =========================================================
   GET TALENT
========================================================= */

function getTalent(id) {
  return TEST_TALENTS.find((talent) => talent.id === id) || null;
}

/* =========================================================
   HERO
========================================================= */

function TalentHero({ talent }) {
  const {
    name,
    role,
    location,
    image,
    initials,
    verified,
  } = talent;

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:px-8">

        {/* Back */}

        <Link
          href="/talents"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to talents
        </Link>

        {/* Profile */}

        <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-end">

          {/* Avatar */}

          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:h-36 sm:w-36">
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-2xl font-black">
                {initials || getInitials(name)}
              </div>
            )}
          </div>

          {/* Info */}

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {name}
              </h1>

              {verified && (
                <CheckCircle2
                  size={21}
                  className="fill-slate-950 text-white"
                />
              )}
            </div>

            <p className="mt-2 text-base font-bold text-slate-600">
              {role}
            </p>

            {location && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin size={15} />
                {location}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTENT
========================================================= */

function TalentContent({ talent }) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">

        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">

          {/* Main */}

          <div className="min-w-0">

            <TalentAbout talent={talent} />

            <TalentServices talent={talent} />

            <TalentPortfolio talent={talent} />

            <TalentAvailability talent={talent} />

          </div>

          {/* Sidebar */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ContactCard talent={talent} />
          </aside>

        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ABOUT
========================================================= */

function TalentAbout({ talent }) {
  return (
    <section>

      <SectionHeading
        eyebrow="About"
        title="About this talent"
      />

      <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        {talent.bio ||
          `I'm ${talent.name}, offering ${
            talent.role || "professional services"
          } in ${talent.location || "Zambia"}.`}
      </p>

    </section>
  );
}

/* =========================================================
   SERVICES
========================================================= */

function TalentServices({ talent }) {
  const services = talent.services || [];

  if (!services.length) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">

      <SectionHeading
        eyebrow="Services"
        title="What I offer"
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">

        {services.map((service, index) => {

          const item =
            typeof service === "string"
              ? { name: service }
              : service;

          return (
            <div
              key={item.id || index}
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
            >

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <Sparkles size={16} />
                </div>

                <div className="min-w-0">

                  <h3 className="text-sm font-black">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  )}

                  {item.price && (
                    <p className="mt-2 text-xs font-bold text-slate-950">
                      {item.price}
                    </p>
                  )}

                </div>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}

/* =========================================================
   PORTFOLIO
========================================================= */

function TalentPortfolio({ talent }) {
  const portfolio = talent.portfolio || [];

  if (!portfolio.length) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">

      <div className="flex items-end justify-between gap-4">

        <SectionHeading
          eyebrow="Work"
          title="Recent work"
        />

        {portfolio.length > 6 && (
          <Link
            href={`/talents/${talent.id}/portfolio`}
            className="hidden items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-950 sm:flex"
          >
            View all
            <ChevronRight size={15} />
          </Link>
        )}

      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

        {portfolio.slice(0, 6).map((item, index) => {

          const image =
            typeof item === "string"
              ? item
              : item.image;

          if (!image) {
            return null;
          }

          return (
            <div
              key={item.id || index}
              className="group aspect-square overflow-hidden rounded-2xl bg-slate-100"
            >
              <img
                src={image}
                alt={`${talent.name} portfolio work ${index + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          );
        })}

      </div>

      {portfolio.length > 6 && (
        <Link
          href={`/talents/${talent.id}/portfolio`}
          className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-slate-600 sm:hidden"
        >
          View all work
          <ChevronRight size={15} />
        </Link>
      )}

    </section>
  );
}

/* =========================================================
   AVAILABILITY
========================================================= */

function TalentAvailability({ talent }) {

  if (!talent.availability) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-14">

      <SectionHeading
        eyebrow="Availability"
        title="When I'm available"
      />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
            <Clock3 size={18} />
          </div>

          <div>

            <p className="text-sm font-black">
              {talent.availability.status ||
                "Available for bookings"}
            </p>

            {talent.availability.note && (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {talent.availability.note}
              </p>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTACT CARD
========================================================= */

function ContactCard({ talent }) {

  const whatsapp =
    talent.whatsapp ||
    talent.phone;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        Get in touch
      </p>

      <h2 className="mt-2 text-xl font-black">
        Interested in working together?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Contact {talent.name} directly to ask about their services,
        pricing or availability.
      </p>

      <div className="mt-6 space-y-3">

        {whatsapp && (
          <a
            href={`https://wa.me/${cleanPhoneNumber(whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
        )}

        {talent.phone && (
          <a
            href={`tel:${talent.phone}`}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Phone size={16} />
            Call
          </a>
        )}

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
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

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ eyebrow, title }) {
  return (
    <div>

      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function cleanPhoneNumber(phone = "") {
  return phone.replace(/\D/g, "");
}