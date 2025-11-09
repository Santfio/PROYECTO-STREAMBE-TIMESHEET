import React, { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleDemo = () => {
    setEmail("demo@example.com");
    setPassword("123456");
  };

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "5rem" }}>
      <h1>Timesheet App</h1>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.5rem", width: "250px" }}
        />
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "0.5rem", width: "180px" }}
          />
          <button onClick={() => setShowPassword(!showPassword)} style={{ marginLeft: "8px" }}>
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
        <button onClick={handleDemo}>Autocompletar demo</button>
        <button>Ingresar</button>
      </div>
    </div>
  );
}
