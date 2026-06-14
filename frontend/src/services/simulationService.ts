import { db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const saveSimulationResult = async (
  userId: string,
  simulationId: string,
  totalScore: number,
  rank: string,
  phaseScores: Record<string, number>
) => {
  const docId = `${userId}_${simulationId}`;
  const docRef = doc(db, "SimulationResults", docId);
  await setDoc(docRef, {
    userId,
    simulationId,
    totalScore,
    rank,
    phaseScores,
    completedAt: serverTimestamp(),
  });
};
