import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/config";
import { db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const register = async (
  email: string,
  password: string,
  nombre: string
) => {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  await setDoc(
    doc(db, "Usuarios", userCredential.user.uid),
    {
      nombre,
      email,
      rol: "estudiante",
      fechaRegistro: serverTimestamp(),
    }
  );

  return userCredential;
};

export const login = async (
  email: string,
  password: string
) => {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};

export const logout = async () => {
  return await signOut(auth);
};