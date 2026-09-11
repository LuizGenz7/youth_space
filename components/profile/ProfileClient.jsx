"use client";

import { useState } from "react";
import Link from "next/link";

import {
ArrowLeft,
BriefcaseBusiness,
Check,
Edit3,
MapPin,
Phone,
Plus,
Settings,
ShieldCheck,
User,
} from "lucide-react";

export default function ProfileClient({
profile,
works = [],
}) {
const [showContact, setShowContact] = useState(false);

const skills = Array.isArray(profile.skills)
? profile.skills
: [];

const services = Array.isArray(profile.services)
? profile.services
: [];

return (
<main className="min-h-screen bg-slate-50">
{/* Header */}
<header className="border-b border-slate-200 bg-white">
<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
<Link
href="/"
className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
>
<ArrowLeft size={18} />
Back
</Link>

      <Link
        href="/profile/edit"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <Edit3 size={16} />
        Edit profile
      </Link>
    </div>
  </header>

  <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
    {/* Profile header */}
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.displayName || profile.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <User
              size={38}
              className="text-slate-400"
            />
          )}
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-950">
              {profile.displayName || "Unnamed talent"}
            </h1>

            {profile.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                <ShieldCheck size={14} />
                Verified
              </span>
            )}
          </div>

          <p className="mt-1 text-slate-500">
            @{profile.username}
          </p>

          {profile.role && (
            <p className="mt-3 font-medium text-slate-700">
              {profile.role}
            </p>
          )}

          {(profile.province || profile.district) && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={16} />

              <span>
                {[profile.district, profile.province]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Availability */}
        <div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
              profile.available
                ? "bg-green-50 text-green-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                profile.available
                  ? "bg-green-500"
                  : "bg-slate-400"
              }`}
            />

            {profile.available
              ? "Available"
              : "Unavailable"}
          </span>
        </div>
      </div>
    </section>

    {/* About */}
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">
          About
        </h2>

        <Link
          href="/profile/edit"
          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Edit
        </Link>
      </div>

      <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
        {profile.bio || "No bio added yet."}
      </p>
    </section>

    {/* Skills */}
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">
          Skills
        </h2>

        <Link
          href="/profile/edit"
          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Manage
        </Link>
      </div>

      {skills.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No skills added yet.
        </p>
      )}
    </section>

    {/* Services */}
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">
          Services
        </h2>

        <Link
          href="/profile/edit"
          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Manage
        </Link>
      </div>

      {services.length > 0 ? (
        <div className="mt-4 space-y-3">
          {services.map((service, index) => {
            const title =
              typeof service === "string"
                ? service
                : service?.title;

            const description =
              typeof service === "string"
                ? null
                : service?.description;

            return (
              <div
                key={`${title}-${index}`}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="font-semibold text-slate-900">
                  {title}
                </p>

                {description && (
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No services added yet.
        </p>
      )}
    </section>

    {/* Contact */}
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">
          Contact
        </h2>

        <button
          type="button"
          onClick={() =>
            setShowContact((value) => !value)
          }
          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          {showContact ? "Hide" : "Show"}
        </button>
      </div>

      {showContact ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Phone
              size={18}
              className="text-slate-500"
            />

            <div>
              <p className="text-xs font-medium text-slate-500">
                Phone
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {profile.phone || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Phone
              size={18}
              className="text-slate-500"
            />

            <div>
              <p className="text-xs font-medium text-slate-500">
                WhatsApp
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {profile.whatsapp || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          Contact information is hidden.
        </p>
      )}
    </section>

    {/* Works */}
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            My works
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {works.length}{" "}
            {works.length === 1 ? "work" : "works"}
          </p>
        </div>

        <Link
          href="/profile/works/new"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Add work
        </Link>
      </div>

      {works.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {works.map((work) => (
            <article
              key={work.id}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              {work.image && (
                <img
                  src={work.image}
                  alt={work.title || "Work"}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="font-semibold text-slate-950">
                  {work.title || "Untitled work"}
                </h3>

                {work.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {work.description}
                  </p>
                )}

                <Link
                  href={`/profile/works/${work.id}/edit`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  <Edit3 size={15} />
                  Manage
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center">
          <BriefcaseBusiness
            size={32}
            className="mx-auto text-slate-400"
          />

          <p className="mt-3 font-semibold text-slate-800">
            No works yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Add your first work to showcase your talent.
          </p>

          <Link
            href="/profile/works/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Add your first work
          </Link>
        </div>
      )}
    </section>

    {/* Account */}
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Settings
          size={20}
          className="text-slate-500"
        />

        <h2 className="text-lg font-bold text-slate-950">
          Account
        </h2>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Email
          </p>

          <p className="mt-1 text-sm font-medium text-slate-800">
            {profile.email || "No email"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Category
          </p>

          <p className="mt-1 text-sm font-medium text-slate-800">
            {profile.category || "No category"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Username
          </p>

          <p className="mt-1 text-sm font-medium text-slate-800">
            @{profile.username}
          </p>
        </div>

        {profile.emailVerified && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
            <Check size={17} />
            Email verified
          </div>
        )}
      </div>
    </section>
  </div>
</main>

);
}