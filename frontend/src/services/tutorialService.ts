import { db } from "@/src/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const TUTORIAL_STEP_KEYS = ["test", "avatar", "careers", "mentor", "community"] as const;
export type TutorialStep = typeof TUTORIAL_STEP_KEYS[number];
export type TutorialProgress = Record<TutorialStep, boolean>;

const EMPTY_PROGRESS: TutorialProgress = {
  test: false, avatar: false, careers: false, mentor: false, community: false,
};

export async function loadTutorialProgress(uid: string): Promise<TutorialProgress> {
  try {
    const snap = await getDoc(doc(db, "tutorialProgress", uid));
    if (!snap.exists()) return { ...EMPTY_PROGRESS };
    const d = snap.data();
    return {
      test:      !!d.test,
      avatar:    !!d.avatar,
      careers:   !!d.careers,
      mentor:    !!d.mentor,
      community: !!d.community,
    };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export async function markTutorialStep(uid: string, step: TutorialStep): Promise<void> {
  try {
    await setDoc(doc(db, "tutorialProgress", uid), { [step]: true }, { merge: true });
  } catch { /* silent */ }
}

export function syncProgressToLocalStorage(progress: TutorialProgress): void {
  TUTORIAL_STEP_KEYS.forEach((key) => {
    if (progress[key]) localStorage.setItem(`vocatio_step_${key}`, "1");
    else localStorage.removeItem(`vocatio_step_${key}`);
  });
}

export function clearTutorialLocalStorage(): void {
  TUTORIAL_STEP_KEYS.forEach((key) => localStorage.removeItem(`vocatio_step_${key}`));
}
