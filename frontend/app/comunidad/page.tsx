"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, addDoc, getDocs, query, where, orderBy, limit,
  serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove,
  increment, Timestamp, getDoc,
} from "firebase/firestore";
import { auth, db } from "@/src/firebase/config";
import Navbar from "@/components/Navbar";

// ── Constants ────────────────────────────────────────────────────────────────

const CAREER_TABS = [
  { value: "general",          label: "🌐 General",       color: "#4f46e5" },
  { value: "software",         label: "💻 Software",       color: "#166534" },
  { value: "medicina",         label: "🏥 Medicina",       color: "#0369a1" },
  { value: "derecho",          label: "⚖️ Derecho",        color: "#b45309" },
  { value: "arquitectura",     label: "🏛️ Arquitectura",   color: "#1d4ed8" },
  { value: "ingenieria-civil", label: "🏗️ Ing. Civil",    color: "#92400e" },
  { value: "psicologia",       label: "🧠 Psicología",     color: "#6d28d9" },
  { value: "marketing",        label: "📣 Marketing",      color: "#be185d" },
  { value: "gastronomia",      label: "🍳 Gastronomía",    color: "#c2410c" },
];

const CAREER_META = Object.fromEntries(
  CAREER_TABS.map((t) => [t.value, { label: t.label, color: t.color }]),
);

// ── Types ─────────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  career: string;
  createdAt: Date;
  likeCount: number;
  likedBy: string[];
  commentCount: number;
};

type Comment = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDate(val: unknown): Date {
  if (!val) return new Date();
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val === "object" && val !== null && "seconds" in val)
    return new Date((val as { seconds: number }).seconds * 1000);
  return new Date(val as string);
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)     return "hace unos segundos";
  if (diff < 3600)   return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400)  return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} d`;
  return date.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold text-white flex-shrink-0 select-none"
      style={{
        width: size, height: size, fontSize: size * 0.38,
        background: "linear-gradient(135deg,#dc2626,#f87171)",
      }}
    >
      {name?.charAt(0).toUpperCase() ?? "?"}
    </div>
  );
}

// ── Comment Section ───────────────────────────────────────────────────────────

function CommentSection({
  postId, initialCount, currentUserId, currentUserName, onCountChange,
}: {
  postId: string;
  initialCount: number;
  currentUserId: string;
  currentUserName: string;
  onCountChange: (n: number) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded]     = useState(false);
  const [open, setOpen]         = useState(false);
  const [text, setText]         = useState("");
  const [sending, setSending]   = useState(false);

  const loadComments = useCallback(async () => {
    if (loaded) return;
    try {
      const snap = await getDocs(
        query(collection(db, "Posts", postId, "Comentarios"), orderBy("createdAt", "asc"), limit(100)),
      );
      setComments(snap.docs.map((d) => {
        const data = d.data();
        return { id: d.id, userId: data.userId, userName: data.userName, text: data.text, createdAt: toDate(data.createdAt) };
      }));
    } catch {
      const snap = await getDocs(collection(db, "Posts", postId, "Comentarios"));
      const list = snap.docs.map((d) => {
        const data = d.data();
        return { id: d.id, userId: data.userId, userName: data.userName, text: data.text, createdAt: toDate(data.createdAt) };
      });
      list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      setComments(list);
    }
    setLoaded(true);
  }, [postId, loaded]);

  const toggle = () => {
    setOpen((v) => !v);
    if (!loaded) loadComments();
  };

  const submit = async () => {
    if (!text.trim() || !currentUserId || sending) return;
    setSending(true);
    try {
      const ref = await addDoc(collection(db, "Posts", postId, "Comentarios"), {
        userId: currentUserId,
        userName: currentUserName,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "Posts", postId), { commentCount: increment(1) });
      setComments((p) => [...p, { id: ref.id, userId: currentUserId, userName: currentUserName, text: text.trim(), createdAt: new Date() }]);
      onCountChange(comments.length + 1);
      setText("");
    } finally {
      setSending(false);
    }
  };

  const count = loaded ? comments.length : initialCount;

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {count > 0 ? `${count} comentario${count !== 1 ? "s" : ""}` : "Comentar"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
              {!loaded ? (
                <div className="flex gap-2 items-center animate-pulse">
                  <div className="h-3 w-3 rounded-full bg-slate-200" />
                  <div className="h-3 w-32 rounded-full bg-slate-100" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">Sé el primero en comentar ✨</p>
              ) : (
                comments.map((c) => (
                  <motion.div key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2.5">
                    <Avatar name={c.userName} size={28} />
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-50 rounded-2xl rounded-tl-sm px-3 py-2">
                        <span className="text-xs font-bold text-slate-800 mr-1.5">{c.userName}</span>
                        <span className="text-sm text-slate-700 break-words">{c.text}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 ml-2">{timeAgo(c.createdAt)}</p>
                    </div>
                  </motion.div>
                ))
              )}

              {currentUserId ? (
                <div className="flex gap-2.5 items-start">
                  <Avatar name={currentUserName} size={28} />
                  <div className="flex-1 flex items-end gap-2">
                    <textarea
                      rows={1}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
                      placeholder="Escribe un comentario..."
                      className="flex-1 resize-none rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:bg-white transition-colors"
                      style={{ minHeight: 36 }}
                    />
                    <button
                      onClick={submit}
                      disabled={!text.trim() || sending}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-40 flex-shrink-0"
                    >
                      {sending
                        ? <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      }
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center">
                  <a href="/login" className="text-indigo-600 hover:underline font-medium">Inicia sesión</a> para comentar
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────────

function PostCard({
  post, currentUserId, currentUserName, onLikeToggle, onCommentCountChange,
}: {
  post: Post;
  currentUserId: string;
  currentUserName: string;
  onLikeToggle: (id: string) => void;
  onCommentCountChange: (id: string, n: number) => void;
}) {
  const isLiked = post.likedBy?.includes(currentUserId);
  const meta = CAREER_META[post.career] ?? CAREER_META.general;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <Avatar name={post.userName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900 text-sm">{post.userName}</span>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ background: meta.color }}
            >
              {meta.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Text */}
      <p className="px-4 pb-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
        {post.text}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-slate-50">
        <button
          onClick={() => currentUserId && onLikeToggle(post.id)}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            isLiked ? "text-rose-600" : "text-slate-500 hover:text-rose-600"
          }`}
        >
          <motion.span key={isLiked ? "on" : "off"} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-base leading-none">
            {isLiked ? "❤️" : "🤍"}
          </motion.span>
          {post.likeCount > 0 && <span>{post.likeCount}</span>}
          <span>Me gusta</span>
        </button>

        <CommentSection
          postId={post.id}
          initialCount={post.commentCount ?? 0}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onCountChange={(n) => onCommentCountChange(post.id, n)}
        />
      </div>
    </motion.div>
  );
}

// ── Post Composer ─────────────────────────────────────────────────────────────

function PostComposer({
  currentUserId, currentUserName, onPosted,
}: {
  currentUserId: string;
  currentUserName: string;
  onPosted: (post: Post) => void;
}) {
  const [text, setText]           = useState("");
  const [career, setCareer]       = useState("general");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!currentUserId || !text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const ref = await addDoc(collection(db, "Posts"), {
        userId: currentUserId,
        userName: currentUserName,
        text: text.trim(),
        career,
        createdAt: serverTimestamp(),
        likeCount: 0,
        likedBy: [],
        commentCount: 0,
      });
      onPosted({
        id: ref.id,
        userId: currentUserId,
        userName: currentUserName,
        text: text.trim(),
        career,
        createdAt: new Date(),
        likeCount: 0,
        likedBy: [],
        commentCount: 0,
      });
      setText("");
      setCareer("general");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUserId) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
        <p className="text-slate-500 text-sm mb-3">Únete a la conversación de la comunidad Vocatio</p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:brightness-110 transition"
        >
          Iniciar sesión para publicar
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex gap-3">
        <Avatar name={currentUserName} />
        <div className="flex-1 min-w-0">
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué quieres compartir con la comunidad?"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:bg-white transition-colors"
          />
          <div className="mt-3 flex items-center justify-between gap-2">
            <select
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              disabled={submitting}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:border-indigo-300 cursor-pointer disabled:opacity-40"
            >
              {CAREER_TABS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={submit}
              disabled={submitting || !text.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-xs font-bold text-white shadow hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? <><div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />Publicando...</>
                : "Publicar"
              }
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ComunidadPage() {
  const [activeCareer, setActiveCareer]       = useState("general");
  const [posts, setPosts]                     = useState<Post[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [currentUserId, setCurrentUserId]     = useState("");
  const [currentUserName, setCurrentUserName] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { setCurrentUserId(""); setCurrentUserName(""); return; }
      setCurrentUserId(user.uid);
      try {
        const snap = await getDoc(doc(db, "Usuarios", user.uid));
        setCurrentUserName(
          snap.exists()
            ? snap.data().nombre || user.email?.split("@")[0] || "Usuario"
            : user.email?.split("@")[0] || "Usuario",
        );
      } catch {
        setCurrentUserName(user.email?.split("@")[0] || "Usuario");
      }
    });
  }, []);

  const loadPosts = useCallback(async (career: string) => {
    setLoading(true);
    try {
      const col = collection(db, "Posts");
      let snap;
      try {
        const q = career === "general"
          ? query(col, orderBy("createdAt", "desc"), limit(60))
          : query(col, where("career", "==", career), orderBy("createdAt", "desc"), limit(60));
        snap = await getDocs(q);
      } catch {
        const q = career === "general"
          ? query(col, limit(60))
          : query(col, where("career", "==", career), limit(60));
        snap = await getDocs(q);
      }

      const list: Post[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId ?? "",
          userName: data.userName ?? "",
          text: data.text ?? "",
          career: data.career ?? "general",
          createdAt: toDate(data.createdAt),
          likeCount: data.likeCount ?? 0,
          likedBy: data.likedBy ?? [],
          commentCount: data.commentCount ?? 0,
        };
      });
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setPosts(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(activeCareer); }, [activeCareer, loadPosts]);

  const handleLike = async (postId: string) => {
    if (!currentUserId) return;
    const isLiked = posts.find((p) => p.id === postId)?.likedBy.includes(currentUserId);
    setPosts((prev) => prev.map((p) => p.id !== postId ? p : {
      ...p,
      likeCount: isLiked ? p.likeCount - 1 : p.likeCount + 1,
      likedBy: isLiked ? p.likedBy.filter((id) => id !== currentUserId) : [...p.likedBy, currentUserId],
    }));
    await updateDoc(doc(db, "Posts", postId), isLiked
      ? { likedBy: arrayRemove(currentUserId), likeCount: increment(-1) }
      : { likedBy: arrayUnion(currentUserId), likeCount: increment(1) },
    );
  };

  const handlePosted = (newPost: Post) => {
    if (activeCareer === "general" || newPost.career === activeCareer)
      setPosts((prev) => [newPost, ...prev]);
  };

  const handleCommentCount = (postId: string, n: number) =>
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, commentCount: n } : p));

  const activeMeta = CAREER_META[activeCareer] ?? CAREER_META.general;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4f46e5 100%)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-indigo-300 text-xs uppercase tracking-widest font-semibold mb-2">Vocatio · Red Social</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Comunidad Vocatio 🎓</h1>
            <p className="text-indigo-200 text-sm max-w-md mx-auto">
              Comparte experiencias, consejos y momentos con estudiantes de todas las carreras.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-indigo-300">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Comunidad activa
              </span>
              <span>·</span>
              <span>{posts.length} publicaciones</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky career tabs */}
      <div className="sticky top-[57px] z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {CAREER_TABS.map((tab) => {
              const active = activeCareer === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveCareer(tab.value)}
                  className="flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
                  style={active
                    ? { background: tab.color, color: "white", boxShadow: `0 4px 12px ${tab.color}55` }
                    : { background: "transparent", color: "#64748b" }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: activeMeta.color }} />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {activeMeta.label}{activeCareer === "general" ? " — todos los posts" : ""}
          </span>
        </div>

        <PostComposer currentUserId={currentUserId} currentUserName={currentUserName} onPosted={handlePosted} />

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="h-3 w-28 rounded-full bg-slate-200" />
                    <div className="h-2.5 w-16 rounded-full bg-slate-100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate-100" />
                  <div className="h-3 w-4/5 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <span className="text-5xl block mb-4">🌱</span>
            <p className="text-slate-600 font-semibold">
              {activeCareer === "general" ? "La comunidad está creciendo..." : `No hay posts en ${activeMeta.label} todavía.`}
            </p>
            <p className="text-slate-400 text-sm mt-1">¡Sé el primero en publicar!</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                onLikeToggle={handleLike}
                onCommentCountChange={handleCommentCount}
              />
            ))}
          </AnimatePresence>
        )}

        {posts.length > 0 && !loading && (
          <p className="text-center text-xs text-slate-400 py-4">
            Has visto todos los posts de {activeMeta.label} ✓
          </p>
        )}
      </div>
    </main>
  );
}
