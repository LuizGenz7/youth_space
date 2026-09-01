"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show at the top.
      if (currentScrollY <= 20) {
        setVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Keep header visible while mobile menu is open.
      if (menuOpen) {
        lastScrollY = currentScrollY;
        return;
      }

      // Scrolling down → hide.
      if (currentScrollY > lastScrollY) {
        setVisible(false);
      }

      // Scrolling up → show.
      if (currentScrollY < lastScrollY) {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-transform duration-300 ease-out ${
        visible
          ? "translate-y-0"
          : "-translate-y-full"
      }`}
    >
      {/* =====================================================
          HEADER SURFACE
      ===================================================== */}

      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">

          {/* =================================================
              BRAND
          ================================================= */}

          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
              Y
            </div>

            <div className="leading-none">
              <div className="flex items-center gap-2">

                <span className="text-[14px] font-black tracking-tight text-slate-950 sm:text-[15px]">
                  Youth Space
                </span>

                <span className="hidden rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500 sm:inline-flex">
                  Zambia
                </span>

              </div>

              <p className="mt-1 text-[9px] text-slate-400 sm:text-[10px]">
                by{" "}
                <span className="font-bold text-slate-600">
                  TechGU
                </span>
              </p>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            <NavLink
              href="/"
              active={isActive("/")}
            >
              Home
            </NavLink>

            <NavLink
              href="/discover"
              active={isActive("/discover")}
            >
              Discover
            </NavLink>

            <NavLink
              href="/talents"
              active={isActive("/talents")}
            >
              Talents
            </NavLink>

            <NavLink
              href="/categories"
              active={isActive("/categories")}
            >
              Categories
            </NavLink>
          </nav>

          {/* =================================================
              DESKTOP ACTIONS
          ================================================= */}

          <div className="hidden items-center gap-2 md:flex">

            <Link
              href="/login"
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                isActive("/login")
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                isActive("/register")
                  ? "bg-slate-800 text-white"
                  : "bg-slate-950 text-white hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
              }`}
            >
              Join Youth Space
              <ArrowRight size={15} />
            </Link>

          </div>

          {/* =================================================
              MOBILE BUTTON
          ================================================= */}

          <button
            type="button"
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen((open) => !open)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 active:scale-95 md:hidden"
          >
            {menuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        <div
          className={`overflow-hidden border-t border-slate-100 bg-white transition-[max-height,opacity] duration-200 md:hidden ${
            menuOpen
              ? "max-h-[420px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
          >

            <div className="space-y-1">

              <MobileNavLink
                href="/"
                onClick={closeMenu}
                active={isActive("/")}
              >
                Home
              </MobileNavLink>

              <MobileNavLink
                href="/discover"
                onClick={closeMenu}
                active={isActive("/discover")}
              >
                Discover
              </MobileNavLink>

              <MobileNavLink
                href="/talents"
                onClick={closeMenu}
                active={isActive("/talents")}
              >
                Talents
              </MobileNavLink>

              <MobileNavLink
                href="/categories"
                onClick={closeMenu}
                active={isActive("/categories")}
              >
                Categories
              </MobileNavLink>

            </div>

            <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4">

              <Link
                href="/login"
                onClick={closeMenu}
                className={`flex h-11 items-center justify-center rounded-xl border text-sm font-bold transition ${
                  isActive("/login")
                    ? "border-slate-300 bg-slate-100 text-slate-950"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Sign in
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Join Youth Space
                <ArrowRight size={15} />
              </Link>

            </div>

          </nav>
        </div>

      </div>
    </header>
  );
}

/* =========================================================
   MOBILE NAV LINK
========================================================= */

function MobileNavLink({
  href,
  children,
  onClick,
  active = false,
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 items-center rounded-xl px-3 text-sm font-bold transition ${
        active
          ? "bg-slate-100 text-slate-950"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      {children}
    </Link>
  );
}

/* =========================================================
   DESKTOP NAV LINK
========================================================= */

function NavLink({
  href,
  children,
  active = false,
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-slate-100 text-slate-950"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      {children}
    </Link>
  );
}