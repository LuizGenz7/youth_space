import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Brand */}

          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                Y
              </div>

              <div>
                <p className="font-black">Youth Space</p>

                <p className="text-xs text-slate-400">by TechGU</p>
              </div>
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
            />

            <FooterColumn
              title="Youth Space"
              links={[
                ["About", "/about"],
                ["Guidelines", "/guidelines"],
                ["Contact", "/contact"],
              ]}
            />

            <FooterColumn
              title="Legal"
              links={[
                ["Privacy", "/privacy"],
                ["Terms", "/terms"],
              ]}
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

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <div className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="block text-sm text-slate-600 transition hover:text-slate-950"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
