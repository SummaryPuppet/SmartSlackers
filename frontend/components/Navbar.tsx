"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/src/firebase/config";
import { logout } from "@/src/services/authService";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Test Vocacional", href: "/test" },
  { label: "Explorar Carreras", href: "/carreras" },
  { label: "Simular Carrera", href: "/simular", badge: "NEW" },
  { label: "Comunidad", href: "/comunidad" },
  { label: "Laboratorios", href: "/laboratorios" },
  { label: "Mentor IA", href: "/mentor" },
  { label: "Recursos", href: "/recursos" },
];

type NavbarProps = {
  // "light" = white glass (main pages), "dark" = black glass (game pages)
  variant?: "light" | "dark";
  // When set: hides nav links and shows this text as the page title (game mode)
  title?: string;
  // Back link shown to the left of the logo when in game/sub-page mode
  backHref?: string;
  // Right-side slot for game-specific content (score bar, etc.)
  rightSlot?: React.ReactNode;
};

export default function Navbar({
  variant = "light",
  title,
  backHref,
  rightSlot,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "Usuarios", user.uid));
        if (snap.exists()) setUserName(snap.data().nombre || "");
      } catch {
        // graceful — user info is display-only
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isDark = variant === "dark";

  // ── style tokens ──────────────────────────────────────────
  const wrapBg = isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.80)";
  const wrapBorder = isDark ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.55)";
  const linkBase = isDark ? "text-white/55" : "text-slate-600";
  const linkHover = isDark ? "hover:text-white" : "hover:text-red-600";
  const linkActive = isDark ? "text-white font-semibold" : "text-red-600 font-semibold";
  const brandName = isDark ? "text-white" : "text-slate-900";
  const brandSub = isDark ? "text-white/40" : "text-slate-400";
  const iconBar = isDark ? "bg-white/70" : "bg-slate-700";
  const logoutStyle = isDark
    ? "text-white/50 hover:text-white border-white/20 hover:border-white/50"
    : "text-slate-500 hover:text-red-600 border-slate-200 hover:border-red-200";
  const mobileMenuBg = isDark ? "rgba(10,10,10,0.97)" : "rgba(255,255,255,0.97)";
  const mobileItemActive = isDark ? "bg-white/10 text-white" : "bg-red-50 text-red-600";
  const mobileItemDefault = isDark
    ? "text-white/70 hover:bg-white/10"
    : "text-slate-700 hover:bg-slate-50";

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: wrapBg,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: `1px solid ${wrapBorder}`,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        {/* ── Left: brand + optional back arrow ── */}
        <div className="flex items-center gap-2 shrink-0">
          {backHref && (
            <a
              href={backHref}
              className={`${linkBase} ${linkHover} transition-colors text-lg mr-0.5`}
            >
              ←
            </a>
          )}
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-500 text-white text-xs font-black shadow shadow-red-500/30">
              VT
            </div>
            <div className="hidden sm:block leading-none">
              <p className={`text-sm font-extrabold leading-tight ${brandName}`}>Vocatio</p>
              <p className={`text-[10px] leading-none ${brandSub}`}>Tu camino, tu futuro.</p>
            </div>
          </a>
        </div>

        {/* ── Center: nav links OR page title ── */}
        {title ? (
          <span className="flex-1 text-center text-sm font-bold text-white px-4 truncate">
            {title}
          </span>
        ) : (
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative transition-colors ${
                  isActive(link.href) ? linkActive : `${linkBase} ${linkHover}`
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="absolute -top-2 -right-5 rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-bold text-white leading-none">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>
        )}

        {/* ── Right: rightSlot (game) OR user info (main) ── */}
        <div className="flex items-center gap-2 shrink-0">
          {rightSlot !== undefined ? (
            rightSlot
          ) : loading ? (
            /* ── Skeleton while Firebase resolves ── */
            <div className="hidden sm:flex items-center gap-2 animate-pulse">
              <div className={`hidden md:block h-3 w-20 rounded-full ${isDark ? "bg-white/15" : "bg-slate-200"}`} />
              <div className={`h-8 w-8 rounded-full ${isDark ? "bg-white/15" : "bg-slate-200"}`} />
              <div className={`h-7 w-12 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-100"}`} />
            </div>
          ) : (
            <>
              {userName && (
                <>
                  <div className="hidden md:flex flex-col text-right leading-none">
                    <span className={`text-xs font-semibold ${brandName}`}>{userName}</span>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-rose-500 text-white text-xs font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`hidden sm:inline-flex text-xs transition border rounded-lg px-2.5 py-1.5 ${logoutStyle}`}
                  >
                    Salir
                  </button>
                </>
              )}
            </>
          )}

          {/* Hamburger — only in nav-link mode (not game title mode) */}
          {!title && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`lg:hidden p-2 rounded-lg transition ${
                isDark ? "hover:bg-white/10" : "hover:bg-slate-100"
              }`}
              aria-label="Menú"
            >
              <span
                className={`block h-0.5 w-5 transition-all duration-200 ${iconBar} ${
                  menuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 mt-1.5 transition-all duration-200 ${iconBar} ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 mt-1.5 transition-all duration-200 ${iconBar} ${
                  menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {menuOpen && !title && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{
              background: mobileMenuBg,
              backdropFilter: "blur(18px)",
              borderTop: `1px solid ${wrapBorder}`,
            }}
          >
            <nav className="flex flex-col px-4 py-3 gap-0.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href) ? mobileItemActive : mobileItemDefault
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-bold text-white leading-none">
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
              {userName && (
                <button
                  onClick={handleLogout}
                  className={`flex rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                    isDark ? "text-white/50 hover:bg-white/10" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Cerrar sesión
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
