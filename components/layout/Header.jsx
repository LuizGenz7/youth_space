"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MapPin, Menu, User, X } from "lucide-react";

import YouthSpaceBrand from "@/components/brand/YouthSpaceBrand";

export default function Header({ noChange = false }) {
  const pathname = usePathname();

  /*
   * =========================================================
   * TEST AUTH STATE
   * =========================================================
   */

  const isLoggedIn = false;

  const currentUser = {
    id: "pi1eux",
    name: "John Mwale",
    location: "Lusaka",
    role: "Fresh Cuts & Grooming",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [transparent, setTransparent] = useState(true);

  /*
   * =========================================================
   * SCROLL BEHAVIOUR
   * =========================================================
   */

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setTransparent(currentScrollY < 300);

      if (currentScrollY <= 20) {
        setVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (menuOpen) {
        setVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY) {
        setVisible(false);
      }

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

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  /*
   * noChange controls whether the header is allowed
   * to become transparent at the top of the page.
   *
   * true  -> normal transparent-on-top behaviour
   * false -> always solid header
   */
  const isTransparent = !noChange && transparent && !menuOpen;

  const initials = currentUser.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

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
            : "border-slate-200/80 bg-white backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
          {/* =================================================
    BRAND
================================================= */}

          <Link href="/" onClick={closeMenu} className="group">
            <div className="transition-transform duration-300 group-hover:scale-105">
              <YouthSpaceBrand
                size={38}
                priority
                transparent={isTransparent}
                showTitle={true}
              />
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
            {isLoggedIn ? (
              <ProfileButton
                user={currentUser}
                initials={initials}
                transparent={isTransparent}
              />
            ) : (
              <GuestActions transparent={isTransparent} />
            )}
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
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
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        <div
          className={`overflow-hidden border-t border-slate-100 bg-white transition-[max-height,opacity] duration-200 md:hidden ${
            menuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
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

            <div className="mt-4 border-t border-slate-100 pt-4">
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className={`group flex items-center gap-3 rounded-2xl border p-3 transition ${
                    isActive("/profile")
                      ? "border-slate-300 bg-slate-100"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <ProfileAvatar
                    image={currentUser.image}
                    initials={initials}
                    name={currentUser.name}
                    size="sm"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-950">
                      {currentUser.name}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <MapPin size={11} />

                      <span className="truncate">{currentUser.location}</span>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              ) : (
                <div className="grid gap-2">
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
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   GUEST ACTIONS
========================================================= */

function GuestActions({ transparent }) {
  return (
    <>
      <Link
        href="/login"
        className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
          transparent
            ? "text-white hover:bg-white/10"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        }`}
      >
        Sign in
      </Link>

      <Link
        href="/register"
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
          transparent
            ? "bg-white text-slate-950 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-lg"
            : "bg-slate-950 text-white hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
        }`}
      >
        Join Youth Space
        <ArrowRight size={15} />
      </Link>
    </>
  );
}

/* =========================================================
   PROFILE BUTTON
========================================================= */

function ProfileButton({ user, initials, transparent }) {
  return (
    <Link
      href="/profile"
      aria-label={`Open ${user.name}'s profile`}
      className={`group flex items-center gap-2 rounded-2xl p-1.5 transition ${
        transparent ? "hover:bg-white/10" : "hover:bg-slate-100"
      }`}
    >
      <ProfileAvatar image={user.image} initials={initials} name={user.name} />

      <div className="hidden text-left lg:block">
        <p
          className={`max-w-[120px] truncate text-xs font-black ${
            transparent ? "text-white" : "text-slate-950"
          }`}
        >
          {user.name}
        </p>

        <div
          className={`mt-0.5 flex max-w-[120px] items-center gap-1 text-[10px] font-medium ${
            transparent ? "text-white/60" : "text-slate-400"
          }`}
        >
          <MapPin size={10} />

          <span className="truncate">{user.location}</span>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   PROFILE AVATAR
========================================================= */

function ProfileAvatar({ image, initials, name, size = "md" }) {
  const [imageError, setImageError] = useState(false);

  const sizeClass = size === "sm" ? "h-10 w-10" : "h-10 w-10";

  if (image && !imageError) {
    return (
      <div
        className={`${sizeClass} relative shrink-0 overflow-hidden rounded-xl bg-slate-100`}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="40px"
          onError={() => setImageError(true)}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-xl bg-slate-950 font-black text-white`}
    >
      {initials || <User size={16} />}
    </div>
  );
}

/* =========================================================
   MOBILE NAV LINK
========================================================= */

function MobileNavLink({ href, children, onClick, active = false }) {
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

function NavLink({ href, children, active = false, transparent = false }) {
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
