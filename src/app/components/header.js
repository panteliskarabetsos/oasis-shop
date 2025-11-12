"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  UserCircle,
  ChevronDown,
  LogIn,
  User,
  ShieldCheck,
  ShoppingCart,
  Heart,
  Search,
  Tag,
  Truck,
  Package,
} from "lucide-react";
import { useRouteLoader } from "./RouteLoader";
import { useAuth } from "./SessionWrapper";

/* ---------------------------------- UI ---------------------------------- */
const ui = {
  bg: "bg-[#f4f1ec]",
  bgSoft: "bg-[#fdfaf5]",
  bgElevated: "bg-white",
  bgHover: "hover:bg-[#eee6da]",
  bgChip: "bg-[#fbf7ef]",
  text: "text-[#5a4a3f]",
  textSoft: "text-[#7a6a5f]",
  textAccent: "text-[#8b6f47]",
  brand: "text-[#5a4a3f]",
  border: "border-[#eae6e0]",
  borderSoft: "border-[#efe7d9]",
  borderMuted: "border-[#e0dcd4]",
  cta: "bg-[#8b6f47] text-white hover:bg-[#7a5f3a]",
};

/* ------------------------------- helpers -------------------------------- */
function safeTitle(str = "") {
  return String(str)
    .toLowerCase()
    .replace(/(^.|[\s-].)/g, (m) => m.toUpperCase())
    .trim();
}
function initialsFrom(first = "", last = "") {
  const a = (first || "").trim()[0];
  const b = (last || "").trim()[0];
  return [a, b].filter(Boolean).join("").toUpperCase() || "•";
}
function useClickOutside(ref, onClose) {
  useEffect(() => {
    function handler(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onClose?.();
    }
    document.addEventListener("pointerdown", handler, { passive: true });
    return () => document.removeEventListener("pointerdown", handler);
  }, [ref, onClose]);
}
function useBodyScrollLock(locked) {
  useEffect(() => {
    const { body, documentElement } = document;
    const prev = body.style.overflow;
    const prevTouch = documentElement.style.touchAction;
    if (locked) {
      body.style.overflow = "hidden";
      documentElement.style.touchAction = "none";
    } else {
      body.style.overflow = prev || "";
      documentElement.style.touchAction = prevTouch || "";
    }
    return () => {
      body.style.overflow = prev || "";
      documentElement.style.touchAction = prevTouch || "";
    };
  }, [locked]);
}

/* ---------------------------- cart badge hook --------------------------- */
function useCartCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let cancelled = false;

    async function read() {
      try {
        const res = await fetch("/api/cart/count", { credentials: "include" });
        if (res.ok) {
          const { count: c = 0 } = await res.json();
          if (!cancelled) setCount(Number(c) || 0);
          return;
        }
      } catch (_) {}

      try {
        const raw =
          localStorage.getItem("cart") ||
          localStorage.getItem("oasis-cart") ||
          "[]";
        const arr = JSON.parse(raw);
        const c = Array.isArray(arr)
          ? arr.reduce(
              (s, it) => s + (Number(it?.qty || it?.quantity || 1) || 1),
              0
            )
          : 0;
        if (!cancelled) setCount(c);
      } catch {
        if (!cancelled) setCount(0);
      }
    }

    read();
    const onStorage = (e) => {
      if (!e.key || e.key.includes("cart")) read();
    };
    window.addEventListener("storage", onStorage);
    const id = setInterval(read, 4000);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
      clearInterval(id);
    };
  }, []);
  return count;
}

/* ------------------------------------------------------------------ */
/* Wrapper: show only on public routes + dynamic body padding         */
/* ------------------------------------------------------------------ */
export default function Header() {
  const pathname = usePathname();
  const isAdminRoute =
    pathname === "/admin" || (pathname?.startsWith("/admin/") ?? false);

  // Dynamically pad body so content never hides under fixed header
  useEffect(() => {
    const b = document?.body;
    if (!b) return;
    const applyPad = () => {
      if (isAdminRoute) {
        b.style.paddingTop = "";
        return;
      }
      const h = document.getElementById("site-header")?.offsetHeight || 72;
      b.style.paddingTop = h + "px";
    };
    applyPad();
    window.addEventListener("resize", applyPad);
    return () => {
      window.removeEventListener("resize", applyPad);
      b.style.paddingTop = "";
    };
  }, [isAdminRoute]);

  if (isAdminRoute) return null;
  return <PublicHeader />;
}

/* ------------------------------------------------------------------ */
/* Public e-shop header                                               */
/* ------------------------------------------------------------------ */
function PublicHeader() {
  const pathname = usePathname();
  const routeLoader = useRouteLoader();
  const { user, supabase } = useAuth();
  const cartCount = useCartCount();

  const [isOpen, setIsOpen] = useState(false);
  const [menuSection, setMenuSection] = useState("nav");
  const [hasShadow, setHasShadow] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dbProfile, setDbProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [routeBusy, setRouteBusy] = useState(false);

  const [q, setQ] = useState("");
  const [catsOpen, setCatsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const catsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleBtnRef = useRef(null);
  const mobileFirstFocusRef = useRef(null);
  const [headerH, setHeaderH] = useState(56);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));
  useClickOutside(catsRef, () => setCatsOpen(false));

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setHasShadow(window.scrollY > 4);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setCatsOpen(false);
        setIsOpen(false);
        mobileToggleBtnRef.current?.focus?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
    setCatsOpen(false);
    setRouteBusy(false);
  }, [pathname]);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => e.matches && setIsOpen(false);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else if (mq.removeListener) mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById("site-header");
    const setH = () => setHeaderH(el?.offsetHeight || 56);
    setH();
    window.addEventListener("resize", setH);
    return () => window.removeEventListener("resize", setH);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setDbProfile(null);
        setProfileLoading(false);
        return;
      }
      setProfileLoading(true);
      try {
        const res = await fetch("/api/me", {
          cache: "no-store",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setDbProfile(data || null);
      } catch {
        if (!cancelled) setDbProfile(null);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const finalProfile = useMemo(() => {
    const md = user?.user_metadata || {};
    const rawFull = (
      md.firstName ??
      md.given_name ??
      md.name ??
      md.full_name ??
      ""
    ).trim();
    const rawLast = (md.lastName ?? md.family_name ?? md.surname ?? "").trim();
    const firstFromFull = rawFull.split(/\s+/)[0] || "";
    const metaFirst = safeTitle(md.firstName ?? firstFromFull);
    let metaLastSource = md.lastName;
    if (!metaLastSource) {
      metaLastSource =
        rawLast ||
        (rawFull.includes(" ") ? rawFull.split(/\s+/).slice(1).join(" ") : "");
    }
    const metaLast = safeTitle(metaLastSource);
    const first = dbProfile?.name?.trim?.() || metaFirst;
    const last = dbProfile?.surname?.trim?.() || metaLast;

    return {
      first: first ? safeTitle(first) : "",
      last: last ? safeTitle(last) : "",
      email: dbProfile?.email || user?.email || "",
      badge:
        dbProfile?.badge || dbProfile?.role || md.badge || md.role || "Shopper",
      isAdmin:
        (dbProfile?.badge || dbProfile?.role || md.badge || md.role) ===
        "admin",
    };
  }, [dbProfile, user]);

  const displayName =
    [finalProfile.first, finalProfile.last].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Account";
  const avatar = initialsFrom(finalProfile.first, finalProfile.last);
  const isAuthed = !!user;

  const navLinks = useMemo(
    () => [
      { name: "All Products", href: "/products" },
      { name: "New", href: "/new" },
      { name: "Sale", href: "/sale", badge: true },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    []
  );

  const categories = useMemo(
    () => [
      {
        title: "Tea & Herbal",
        items: [
          { name: "Herbal Teas", href: "/c/teas" },
          { name: "Single Herbs", href: "/c/herbs" },
          { name: "Bundles & Gifts", href: "/c/gifts" },
        ],
      },
      {
        title: "Body & Home",
        items: [
          { name: "Skincare", href: "/c/skincare" },
          { name: "Essential Oils", href: "/c/aromatics" },
          { name: "Home Scents", href: "/c/home" },
        ],
      },
    ],
    []
  );

  const go = useCallback(
    (href) => {
      setRouteBusy(true);
      routeLoader?.triggerRouteChange(href);
    },
    [routeLoader]
  );

  async function handleSignOut() {
    await supabase?.auth.signOut();
    setDropdownOpen(false);
    setIsOpen(false);
    go("/");
  }

  function submitSearch(e) {
    e.preventDefault();
    const query = (q || "").trim();
    if (!query) return;
    setIsOpen(false);
    go(`/search?q=${encodeURIComponent(query)}`);
  }

  /* ------------------------------- RENDER ------------------------------- */
  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 print:hidden isolate ${
        hasShadow ? "shadow-[...]" : "shadow-none"
      } ${ui.bg}/85 backdrop-blur-md border-b ${
        ui.border
      } pt-[env(safe-area-inset-top)]`}
      role="banner"
    >
      {/* Announcement bar */}
      <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] py-1 border-b border-[#ede7df]">
        <span className={`${ui.textSoft} inline-flex items-center gap-1`}>
          <Truck size={13} /> Free shipping over €49
        </span>
        <span className={`${ui.textSoft} inline-flex items-center gap-1`}>
          <Package size={13} /> Easy returns
        </span>
        <span className={`${ui.textSoft} inline-flex items-center gap-1`}>
          <Tag size={13} /> Seasonal sale
        </span>
      </div>

      {/* Thin progress bar on route changes */}
      <div
        className={`h-0.5 w-full origin-left scale-x-0 bg-[linear-gradient(90deg,#8b6f47,#b89a6b)] transition-transform duration-500 ${
          routeBusy ? "scale-x-100" : "scale-x-0"
        }`}
        aria-hidden="true"
      />

      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] rounded px-3 py-2 bg-white text-[#5a4a3f]"
      >
        Skip to content
      </a>

      {/* ROW 1: brand + categories | search | icons */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 sm:py-3.5 grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-4 items-center">
        {/* Brand */}
        <button
          onClick={() => go("/")}
          className="group inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6] rounded"
          aria-label="Go to homepage"
        >
          <span
            className={`text-2xl sm:text-3xl font-serif tracking-tight ${ui.brand} group-hover:${ui.textAccent} transition-colors`}
            style={{ fontFamily: "Noto Serif, ui-serif, Georgia, serif" }}
          >
            Oasis e-shop
          </span>
        </button>

        {/* Center: categories + search (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Categories dropdown */}
          <div className="relative z-20" ref={catsRef}>
            <button
              onClick={() => setCatsOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border ${ui.borderSoft} ${ui.bgSoft} px-3 py-2 text-sm ${ui.text} hover:bg-[#f1ede7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6]`}
              aria-haspopup="menu"
              aria-expanded={catsOpen}
            >
              Categories <ChevronDown size={16} />
            </button>
            {catsOpen && (
              <div
                className={`absolute left-0 mt-2 w-[560px] max-w-[min(90vw,720px)] z-[70] rounded-2xl border ${ui.border} ${ui.bgElevated} shadow-2xl p-4 grid grid-cols-2 gap-4`}
                style={{ pointerEvents: "auto" }}
              >
                {categories.map((col) => (
                  <div key={col.title}>
                    <p
                      className={`mb-2 text-xs uppercase tracking-wide ${ui.textSoft}`}
                    >
                      {col.title}
                    </p>
                    <div className="flex flex-col">
                      {col.items.map((it) => (
                        <button
                          key={it.href}
                          onClick={() => {
                            setCatsOpen(false);
                            go(it.href);
                          }}
                          className={`text-sm text-left rounded-lg px-2 py-1.5 ${ui.text} ${ui.bgHover}`}
                        >
                          {it.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="col-span-2 border-t pt-3">
                  <button
                    onClick={() => {
                      setCatsOpen(false);
                      go("/products");
                    }}
                    className={`rounded-full px-3 py-2 text-sm ${ui.cta}`}
                  >
                    View all products
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <form onSubmit={submitSearch} className="flex-1 relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border px-10 py-2.5 text-sm outline-none placeholder-[#a2917f] bg-white border-[#e8e2d9] focus:ring-2 focus:ring-[#d7cbb6]"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full"
              aria-label="Search"
            >
              <Search size={18} className={ui.textSoft} />
            </button>
          </form>
        </div>

        {/* Right icons (desktop) + mobile menu */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Wishlist */}
          <button
            onClick={() => go("/wishlist")}
            className={`hidden md:inline-flex rounded-full p-2 ${ui.text} ${ui.bgHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6]`}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={20} />
          </button>

          {/* Cart */}
          <button
            onClick={() => go("/cart")}
            className={`relative hidden md:inline-flex rounded-full p-2 ${ui.text} ${ui.bgHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6]`}
            aria-label="Cart"
            title="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8b6f47] text-white text-[11px] grid place-items-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Account */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <AccountButton
              isAuthed={!!user}
              finalProfile={finalProfile}
              displayName={displayName}
              avatar={avatar}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              go={go}
              handleSignOut={handleSignOut}
            />
          </div>

          {/* Mobile: search, wishlist, cart, menu */}
          <button
            onClick={() => go("/search")}
            className={`md:hidden rounded-full p-2 ${ui.text} ${ui.bgHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6]`}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => go("/wishlist")}
            className={`md:hidden rounded-full p-2 ${ui.text} ${ui.bgHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6]`}
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </button>
          <button
            onClick={() => go("/cart")}
            className={`relative md:hidden rounded-full p-2 ${ui.text} ${ui.bgHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6]`}
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8b6f47] text-white text-[11px] grid place-items-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
          <button
            ref={mobileToggleBtnRef}
            onClick={() => {
              setMenuSection(user ? "account" : "nav");
              setIsOpen((v) => !v);
            }}
            className={`md:hidden rounded-full p-2 ${ui.text} ${ui.bgHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6]`}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ROW 2: primary nav (desktop) */}
      <div
        className={`hidden md:block border-t border-[#ece6dd] relative z-10 ${
          catsOpen ? "pointer-events-none" : ""
        }`}
      >
        <nav
          className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex items-center justify-center gap-1.5 text-sm"
          aria-label="Primary"
        >
          {navLinks.map((l) => {
            const active = pathname?.startsWith(l.href);
            return (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className={`relative rounded-full px-3 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6] ${
                  active
                    ? `bg-white ${ui.text} border ${ui.borderMuted}`
                    : `${ui.text} ${ui.bgHover}`
                }`}
                aria-current={active ? "page" : undefined}
              >
                {l.name}
                {l.badge && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#efe6d7] px-2 py-0.5 text-[11px] text-[#8b6f47]">
                    <Tag size={12} /> Off
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile sheet */}
      <MobileSheet
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        menuSection={menuSection}
        setMenuSection={setMenuSection}
        headerH={headerH}
        mobileMenuRef={mobileMenuRef}
        mobileFirstFocusRef={mobileFirstFocusRef}
        q={q}
        setQ={setQ}
        submitSearch={submitSearch}
        categories={categories}
        navLinks={navLinks}
        isAuthed={isAuthed}
        displayName={displayName}
        finalProfile={finalProfile}
        avatar={avatar}
        go={go}
        handleSignOut={handleSignOut}
      />

      {/* polite live region */}
      <p className="sr-only" aria-live="polite">
        {routeBusy ? "Loading page…" : ""}
      </p>
    </header>
  );
}

/* -------------------------- Extracted subparts -------------------------- */

function AccountButton({
  isAuthed,
  finalProfile,
  displayName,
  avatar,
  dropdownOpen,
  setDropdownOpen,
  go,
  handleSignOut,
}) {
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setDropdownOpen(false));
  if (!isAuthed) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => go("/login")}
          className={`flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm ${ui.textAccent} ${ui.bgHover} hover:${ui.text}`}
        >
          <LogIn size={16} />
          Log In
        </button>
        <button
          onClick={() => go("/sign-up")}
          className={`flex items-center gap-2 rounded-full border ${ui.borderMuted} ${ui.bgElevated} px-3 py-2 text-sm ${ui.text} hover:bg-[#faf7f1]`}
        >
          <User size={16} />
          Register
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full border ${ui.borderSoft} ${ui.bgSoft} px-3 py-2 text-sm ${ui.text} hover:bg-[#f1ede7] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6]`}
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
        aria-controls="account-menu"
      >
        <span
          className={`inline-grid h-6 w-6 place-items-center rounded-full bg-[#e8dfcf] text-[10px] font-semibold ${ui.text}`}
        >
          {initialsFrom(finalProfile.first, finalProfile.last)}
        </span>
        <span className="max-w-40 truncate">
          {finalProfile.first || displayName}
        </span>
        <ChevronDown size={16} />
      </button>

      {dropdownOpen && (
        <div
          id="account-menu"
          role="menu"
          className={`absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border ${ui.border} ${ui.bgElevated} shadow-xl`}
        >
          <div className="border-b border-[#eee] px-4 py-3">
            <p className={`truncate text-sm font-medium ${ui.text}`}>
              {displayName}
            </p>
            <p className={`truncate text-xs ${ui.textSoft}`}>
              {finalProfile.email}
            </p>
            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full border ${ui.borderSoft} ${ui.bgChip} px-2 py-0.5 text-[11px] ${ui.text}`}
            >
              <ShieldCheck size={12} /> {safeTitle(finalProfile.badge)}
            </span>
          </div>

          <button
            role="menuitem"
            onClick={() => go("/orders")}
            className={`block w-full px-4 py-2 text-left text-sm ${ui.text} hover:${ui.bgSoft}`}
          >
            My Orders
          </button>
          <button
            role="menuitem"
            onClick={() => go("/account")}
            className={`block w-full px-4 py-2 text-left text-sm ${ui.text} hover:${ui.bgSoft}`}
          >
            Account
          </button>
          <button
            role="menuitem"
            onClick={() => go("/wishlist")}
            className={`block w-full px-4 py-2 text-left text-sm ${ui.text} hover:${ui.bgSoft}`}
          >
            Wishlist
          </button>
          <button
            role="menuitem"
            onClick={() => go("/admin")}
            className={`${
              finalProfile.isAdmin ? "" : "hidden"
            } block w-full px-4 py-2 text-left text-sm ${ui.text} hover:${
              ui.bgSoft
            }`}
          >
            Admin Dashboard
          </button>
          <button
            role="menuitem"
            onClick={handleSignOut}
            className="block w-full px-4 py-2 text-left text-sm text-[#b44d4d] hover:bg-[#fdfaf5]"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function MobileSheet({
  isOpen,
  setIsOpen,
  menuSection,
  setMenuSection,
  headerH,
  mobileMenuRef,
  mobileFirstFocusRef,
  q,
  setQ,
  submitSearch,
  categories,
  navLinks,
  isAuthed,
  displayName,
  finalProfile,
  avatar,
  go,
  handleSignOut,
}) {
  return (
    <div
      className={`md:hidden ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`fixed inset-0 z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        } bg-black/30`}
        onPointerDown={() => setIsOpen(false)}
      />
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`fixed left-0 right-0 z-50 origin-top transform-gpu transition-transform duration-200 ease-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        } border-t ${ui.border} ${ui.bgSoft} shadow-xl rounded-b-2xl`}
        style={{ top: headerH }}
        role="dialog"
        aria-modal="true"
        aria-label={menuSection === "account" ? "Account" : "Navigation"}
      >
        <div className="px-4 sm:px-6 py-4">
          <div className="mb-3 flex items-center gap-2">
            <form onSubmit={submitSearch} className="flex-1 relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-full border px-10 py-2 text-sm outline-none placeholder-[#a2917f] bg-white/80 border-[#e8e2d9] focus:ring-2 focus:ring-[#d7cbb6]"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full"
                aria-label="Search"
              >
                <Search size={18} className={ui.textSoft} />
              </button>
            </form>

            <button
              onClick={() => setIsOpen(false)}
              className={`rounded-full p-2 ${ui.text} ${ui.bgHover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d7cbb6]`}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {isAuthed && (
            <div className="mb-3 flex items-center gap-2 text-sm">
              <button
                onClick={() => setMenuSection("nav")}
                className={`rounded-full px-3 py-1.5 ${
                  menuSection === "nav"
                    ? `bg-[#e8e2d9] ${ui.text}`
                    : `${ui.textSoft} hover:bg-[#f3efe8]`
                }`}
              >
                Browse
              </button>
              <button
                onClick={() => setMenuSection("account")}
                className={`rounded-full px-3 py-1.5 ${
                  menuSection === "account"
                    ? `bg-[#e8e2d9] ${ui.text}`
                    : `${ui.textSoft} hover:bg-[#f3efe8]`
                }`}
              >
                Account
              </button>
            </div>
          )}

          <div className="max-h-[calc(100dvh-140px)] overflow-y-auto px-0 py-2">
            {menuSection === "nav" && (
              <nav className="flex flex-col gap-2" aria-label="Mobile">
                <p
                  className={`px-2 pb-2 text-xs uppercase tracking-wide ${ui.textSoft}`}
                >
                  Shop
                </p>
                {categories
                  .flatMap((c) => c.items)
                  .map((it, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <button
                        key={it.href}
                        ref={isFirst ? mobileFirstFocusRef : undefined}
                        onClick={() => {
                          setIsOpen(false);
                          go(it.href);
                        }}
                        className={`rounded-xl px-4 py-3 text-left text-base ${ui.text} ${ui.bgHover}`}
                      >
                        {it.name}
                      </button>
                    );
                  })}
                <div className="mt-3 h-px bg-[#e7e2da]" />
                {navLinks.map((l) => (
                  <button
                    key={l.href}
                    onClick={() => {
                      setIsOpen(false);
                      go(l.href);
                    }}
                    className={`rounded-xl px-4 py-3 text-left text-base ${ui.text} ${ui.bgHover}`}
                  >
                    {l.name}
                  </button>
                ))}
              </nav>
            )}

            {menuSection === "account" && isAuthed && (
              <div aria-label="Account" className="flex flex-col">
                <div
                  className={`mb-3 flex items-center gap-3 rounded-xl border ${ui.borderSoft} ${ui.bgChip} p-3`}
                >
                  <div
                    className={`inline-grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e8dfcf] text-sm font-semibold ${ui.text}`}
                  >
                    {avatar}
                  </div>
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-medium ${ui.text}`}>
                      {displayName}
                    </p>
                    <p className={`truncate text-xs ${ui.textSoft}`}>
                      {finalProfile.email}
                    </p>
                  </div>
                  <span
                    className={`ml-auto inline-flex items-center gap-1 rounded-full border ${ui.borderSoft} ${ui.bgElevated} px-2 py-0.5 text-[11px] ${ui.text}`}
                  >
                    <ShieldCheck size={12} /> {safeTitle(finalProfile.badge)}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    ref={mobileFirstFocusRef}
                    onClick={() => {
                      setIsOpen(false);
                      go("/orders");
                    }}
                    className={`rounded-xl px-4 py-3 text-left text-base ${ui.text} ${ui.bgHover}`}
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      go("/account");
                    }}
                    className={`rounded-xl px-4 py-3 text-left text-base ${ui.text} ${ui.bgHover}`}
                  >
                    Account
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      go("/wishlist");
                    }}
                    className={`rounded-xl px-4 py-3 text-left text-base ${ui.text} ${ui.bgHover}`}
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      go("/admin");
                    }}
                    className={`${
                      finalProfile.isAdmin ? "" : "hidden"
                    } rounded-xl px-4 py-3 text-left text-base ${ui.text} ${
                      ui.bgHover
                    }`}
                  >
                    Admin Dashboard
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="mt-2 rounded-xl px-4 py-3 text-left text-base text-[#b44d4d] hover:bg-[#faecea]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
