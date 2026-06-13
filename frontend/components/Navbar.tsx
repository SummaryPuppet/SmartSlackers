"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  doc, getDoc, collection, query, orderBy, limit, onSnapshot, writeBatch,
} from "firebase/firestore";
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
  variant?: "light" | "dark";
  title?: string;
  backHref?: string;
  rightSlot?: React.ReactNode;
};

type Notif = {
  id: string;
  commenterName: string;
  commentText: string;
  postId: string;
  read: boolean;
  createdAt: { seconds: number } | null;
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
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
<<<<<<< Updated upstream
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
=======
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
>>>>>>> Stashed changes

  const displayName = userName || user?.displayName || user?.email?.split("@")[0] || "Usuario";
  const unreadCount = notifs.filter((n) => !n.read).length;

  // Cached count from localStorage — shown instantly before Firebase resolves
  const [cachedCount, setCachedCount] = useState(0);
  useEffect(() => {
    const stored = localStorage.getItem("vocatio_notif_count");
    if (stored) setCachedCount(parseInt(stored, 10));
  }, []);
  useEffect(() => {
    localStorage.setItem("vocatio_notif_count", String(unreadCount));
    setCachedCount(unreadCount);
  }, [unreadCount]);

  const displayUnread = loading ? cachedCount : unreadCount;

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (!fbUser) {
        setLoading(false);
        return;
      }
      setUserEmail(fbUser.email || "");
      try {
        // Busca en ambas colecciones por compatibilidad
        for (const col of ["Usuarios", "usuarios"]) {
          const snap = await getDoc(doc(db, col, fbUser.uid));
          if (snap.exists()) {
            setUserName(snap.data().nombre || "");
            break;
          }
        }
      } catch {
        // graceful — user info is display-only
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

<<<<<<< Updated upstream
  // Cierra el menú del avatar al hacer clic fuera
  useEffect(() => {
    if (!avatarMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarMenuOpen]);

  const handleLogout = async () => {
    setAvatarMenuOpen(false);
=======
  // Notifications real-time listener
  useEffect(() => {
    if (!user?.uid) { setNotifs([]); return; }
    let unsub: (() => void) | undefined;
    const q = query(
      collection(db, "Notificaciones", user.uid, "items"),
      orderBy("createdAt", "desc"),
      limit(20),
    );
    unsub = onSnapshot(
      q,
      (snap) => setNotifs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notif))),
      () => {
        // Composite index not ready yet — fetch without orderBy
        const q2 = query(collection(db, "Notificaciones", user.uid!, "items"), limit(20));
        unsub = onSnapshot(q2, (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notif));
          setNotifs(items.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
        });
      },
    );
    return () => unsub?.();
  }, [user?.uid]);

  const handleLogout = async () => {
    localStorage.setItem("vocatio_notif_count", "0");
    setCachedCount(0);
>>>>>>> Stashed changes
    await logout();
    router.push("/login");
  };

  const markAllRead = async () => {
    if (!user?.uid || unreadCount === 0) return;
    localStorage.setItem("vocatio_notif_count", "0");
    setCachedCount(0);
    const batch = writeBatch(db);
    notifs
      .filter((n) => !n.read)
      .forEach((n) =>
        batch.update(doc(db, "Notificaciones", user.uid!, "items", n.id), { read: true }),
      );
    await batch.commit();
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
      {/* Click-outside overlay closes notification dropdown */}
      {notifOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
      )}

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
            <div className="hidden sm:flex items-center gap-2">
              {/* Show bell with cached count while Firebase resolves */}
              {cachedCount > 0 && (
                <div className="relative">
                  <button
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full transition ${
                      isDark ? "text-white/70" : "text-slate-500"
                    }`}
                    aria-label="Notificaciones"
                    disabled
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-0.5 text-[9px] font-bold text-white leading-none">
                      {cachedCount > 9 ? "9+" : cachedCount}
                    </span>
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 animate-pulse">
                <div className={`hidden md:block h-3 w-20 rounded-full ${isDark ? "bg-white/15" : "bg-slate-200"}`} />
                <div className={`h-8 w-8 rounded-full ${isDark ? "bg-white/15" : "bg-slate-200"}`} />
                <div className={`h-7 w-12 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-100"}`} />
              </div>
            </div>
          ) : (
            <>
              {user ? (
                <>
                  {/* Texto "Bienvenido / email" — igual al diseño original pero con más info */}
                  <div className="hidden md:flex flex-col text-right leading-none mr-1">
                    <span className={`text-xs font-semibold ${brandName}`}>
                      Bienvenido
                    </span>
                    <span className={`text-[10px] ${brandSub}`}>{userEmail}</span>
                  </div>

<<<<<<< Updated upstream
                  {/* Círculo rojo con inicial — al presionar abre el menú */}
                  <div className="relative" ref={avatarRef}>
                    <button
                      type="button"
                      onClick={() => setAvatarMenuOpen((v) => !v)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-rose-500 text-white text-xs font-bold shadow shadow-red-500/30 transition-transform hover:scale-105"
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </button>

                    {/* Menú desplegable del avatar */}
                    <AnimatePresence>
                      {avatarMenuOpen && (
=======
                  {/* ── Notification bell ── */}
                  <div className="relative z-50">
                    <button
                      onClick={() => {
                        const opening = !notifOpen;
                        setNotifOpen(opening);
                        if (opening && displayUnread > 0) markAllRead();
                      }}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full transition ${
                        isDark ? "hover:bg-white/15 text-white/70" : "hover:bg-slate-100 text-slate-500"
                      }`}
                      aria-label="Notificaciones"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <AnimatePresence>
                        {displayUnread > 0 && (
                          <motion.span
                            key="badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-0.5 text-[9px] font-bold text-white leading-none"
                          >
                            {displayUnread > 9 ? "9+" : displayUnread}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    {/* Notification dropdown */}
                    <AnimatePresence>
                      {notifOpen && (
>>>>>>> Stashed changes
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.15 }}
<<<<<<< Updated upstream
                          className="absolute right-0 top-11 z-50 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl"
                        >
                          <button
                            type="button"
                            className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            onClick={() => {
                              setAvatarMenuOpen(false);
                              router.push("/perfil");
                            }}
                          >
                            Ver perfil
                          </button>
                          <button
                            type="button"
                            className="mt-1 w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                            onClick={handleLogout}
                          >
                            Cerrar sesión
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
=======
                          className="absolute right-0 top-10 w-72 rounded-2xl border border-slate-100 bg-white shadow-xl overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                            <span className="text-sm font-bold text-slate-800">Notificaciones</span>
                            {displayUnread > 0 && (
                              <button
                                onClick={markAllRead}
                                className="text-[11px] text-indigo-600 hover:underline"
                              >
                                Marcar todo leído
                              </button>
                            )}
                          </div>

                          <div className="max-h-72 overflow-y-auto">
                            {notifs.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400">
                                <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <p className="text-xs">Sin notificaciones aún</p>
                              </div>
                            ) : (
                              notifs.map((n) => (
                                <a
                                  key={n.id}
                                  href="/comunidad"
                                  onClick={() => setNotifOpen(false)}
                                  className={`flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${
                                    !n.read ? "bg-indigo-50/60" : ""
                                  }`}
                                >
                                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">
                                    {n.commenterName?.charAt(0)?.toUpperCase() ?? "?"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                                      <span className="text-indigo-600">{n.commenterName}</span>{" "}
                                      comentó en tu publicación
                                    </p>
                                    {n.commentText && (
                                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                        &ldquo;{n.commentText}&rdquo;
                                      </p>
                                    )}
                                  </div>
                                  {!n.read && (
                                    <div className="mt-1 flex-shrink-0">
                                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                    </div>
                                  )}
                                </a>
                              ))
                            )}
                          </div>

                          {notifs.length > 0 && (
                            <div className="border-t border-slate-100 px-4 py-2.5">
                              <a
                                href="/comunidad"
                                onClick={() => setNotifOpen(false)}
                                className="block text-center text-[11px] font-medium text-indigo-600 hover:underline"
                              >
                                Ver comunidad →
                              </a>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-rose-500 text-white text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
>>>>>>> Stashed changes
                  </div>
                </>
              ) : null}
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
                  {link.href === "/comunidad" && displayUnread > 0 && (
                    <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[8px] font-bold text-white leading-none">
                      {displayUnread > 9 ? "9+" : displayUnread}
                    </span>
                  )}
                </a>
              ))}
              {user && (
                <>
                  <a
                    href="/perfil"
                    onClick={() => setMenuOpen(false)}
                    className={`flex rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${mobileItemDefault}`}
                  >
                    Ver perfil
                  </a>
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className={`flex rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                      isDark ? "text-white/50 hover:bg-white/10" : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}