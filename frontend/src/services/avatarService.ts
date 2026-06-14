// Ajustado al path de Firebase de SmartSlackers:
// src/firebase/config.ts exporta { auth, db }
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import type { AvatarConfig, Career, SavedAvatar } from "@/types/avatar";

const COLLECTION = "avatars";

/**
 * Guarda o actualiza el avatar del usuario en Firestore.
 * Se usa el UID como ID del documento (un avatar por usuario).
 */
export async function saveAvatar(
  uid: string,
  config: AvatarConfig
): Promise<void> {
  const ref = doc(db, COLLECTION, uid);
  await setDoc(
    ref,
    {
      uid,
      config,
      career: config.careerCosmetic?.career ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Carga el avatar del usuario desde Firestore.
 * Retorna null si el usuario aún no ha guardado un avatar.
 */
export async function loadAvatar(uid: string): Promise<SavedAvatar | null> {
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    uid: data.uid,
    config: data.config as AvatarConfig,
    career: data.career as Career | null,
    updatedAt: (data.updatedAt as Timestamp)?.toMillis() ?? Date.now(),
  };
}

export async function hasAvatar(uid: string): Promise<boolean> {
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  return snap.exists();
}

/**
 * Aplica el cosmético de carrera al avatar del usuario.
 * Llama esto al terminar el test con el careerKey del resultado.
 * 
 * Ejemplo de uso en ResultScreen:
 *   const { currentUser } = useAuth(); // o useAuthState(auth)
 *   await applyCareerCosmetic(currentUser.uid, result.careerKey, currentConfig);
 */
export async function applyCareerCosmetic(
  uid: string,
  career: Career,
  currentConfig: AvatarConfig
): Promise<void> {
  const { CAREER_COSMETICS } = await import("@/lib/careerCosmetics");
  const cosmetic = CAREER_COSMETICS[career];
  if (!cosmetic) return;

  const updatedConfig: AvatarConfig = {
    ...currentConfig,
    background: cosmetic.background,
    careerCosmetic: cosmetic,
  };
  await saveAvatar(uid, updatedConfig);
}