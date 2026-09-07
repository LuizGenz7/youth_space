"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import YouthSpaceBrand from "@/components/brand/YouthSpaceBrand";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Brand */}

          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <YouthSpaceBrand  size={40} />
            </Link>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              A Zambian platform connecting people with young talent, skills and
              local services.
            </p>
          </div>

          {/* Footer navigation */}

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <FooterColumn
              title="Discover"
              links={[
                ["Discover", "/discover"],
                ["Talents", "/talents"],
                ["Categories", "/categories"],
              ]}
              pathname={pathname}
            />

            <FooterColumn
              title="Youth Space"
              links={[
                ["About", "/about"],
                ["Guidelines", "/guidelines"],
                ["Contact", "/contact"],
              ]}
              pathname={pathname}
            />

            <FooterColumn
              title="Legal"
              links={[
                ["Privacy", "/privacy"],
                ["Terms", "/terms"],
              ]}
              pathname={pathname}
            />
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© 2026 Youth Space. A TechGU product.</p>

          <p>Zambia</p>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({ title, links, pathname }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <div className="mt-4 space-y-3">
        {links.map(([label, href]) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`block text-sm transition ${
                isActive
                  ? "font-bold text-slate-950"
                  : "font-medium text-slate-600 hover:text-slate-950"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
