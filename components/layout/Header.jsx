"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [transparent, setTransparent] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Transparent only within the first 300px.
      setTransparent(currentScrollY < 300);

      // Always show near the top.
      if (currentScrollY <= 20) {
        setVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Keep the header visible while the mobile menu is open.
      if (menuOpen) {
        setVisible(true);
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

  /*
   * Mobile menu always forces the header to white.
   * Otherwise the header can become transparent over the hero.
   */
  const isTransparent = transparent && !menuOpen;

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* =====================================================
          HEADER SURFACE
      ===================================================== */}

      <div
        className={`border-b transition-all duration-300 ${
          isTransparent
            ? "border-transparent bg-transparent"
            : "border-slate-200/80 bg-white/95 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">

          {/* =================================================
              BRAND
          ================================================= */}

          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-2.5"
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black transition-all duration-300 group-hover:scale-105 sm:h-10 sm:w-10 ${
                isTransparent
                  ? "bg-white text-slate-950 shadow-sm"
                  : "bg-slate-950 text-white"
              }`}
            >
              Y
            </div>

            <div className="leading-none">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[14px] font-black tracking-tight transition-colors duration-300 sm:text-[15px] ${
                    isTransparent
                      ? "text-white"
                      : "text-slate-950"
                  }`}
                >
                  Youth Space
                </span>

                <span
                  className={`hidden rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider transition-colors duration-300 sm:inline-flex ${
                    isTransparent
                      ? "bg-white/15 text-white/80"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Zambia
                </span>
              </div>

              <p
                className={`mt-1 text-[9px] transition-colors duration-300 sm:text-[10px] ${
                  isTransparent
                    ? "text-white/60"
                    : "text-slate-400"
                }`}
              >
                by{" "}
                <span
                  className={`font-bold ${
                    isTransparent
                      ? "text-white/80"
                      : "text-slate-600"
                  }`}
                >
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
              transparent={isTransparent}
            >
              Home
            </NavLink>

            <NavLink
              href="/discover"
              active={isActive("/discover")}
              transparent={isTransparent}
            >
              Discover
            </NavLink>

            <NavLink
              href="/talents"
              active={isActive("/talents")}
              transparent={isTransparent}
            >
              Talents
            </NavLink>

            <NavLink
              href="/categories"
              active={isActive("/categories")}
              transparent={isTransparent}
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
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : isActive("/login")
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                isTransparent
                  ? "bg-white text-slate-950 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-lg"
                  : isActive("/register")
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
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition active:scale-95 md:hidden ${
              menuOpen
                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                : isTransparent
                  ? "border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {menuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        <div
          className={`overflow-hidden border-t border-slate-100 bg-white transition-[max-height,opacity] duration-200 md:hidden ${
            menuOpen
              ? "max-h-105 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
          >
            {/* Navigation links */}

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

            {/* Actions */}

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
  transparent = false,
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
        active
          ? transparent
            ? "bg-white/15 text-white"
            : "bg-slate-100 text-slate-950"
          : transparent
            ? "text-white/70 hover:bg-white/10 hover:text-white"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      {children}
    </Link>
  );
}
