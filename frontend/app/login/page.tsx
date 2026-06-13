"use client";

import { useState } from "react";
import { login, register } from "../../src/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await register(email, password);

      console.log("Usuario registrado:", userCredential.user);

      alert("Usuario registrado correctamente");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await login(email, password);

      console.log("Usuario logueado:", userCredential.user);

      alert("Inicio de sesión exitoso");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>JourneyAI Login</h1>

      <div>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <br />

      <div>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <br />

      <button onClick={handleLogin}>
        Iniciar Sesión
      </button>

      <button
        onClick={handleRegister}
        style={{ marginLeft: "10px" }}
      >
        Registrarse
      </button>
    </div>
  );
}