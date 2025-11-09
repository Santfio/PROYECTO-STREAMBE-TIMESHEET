const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Datos simulados en memoria ---
const USERS = [{ email: "demo@example.com", password: "password" }];
let TIMESHEETS = [];

// --- Rutas ---
app.get("/", (req, res) => {
  res.send("✅ Backend Timesheet funcionando correctamente.");
});

// Login de prueba
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Credenciales no válidas" });
  }

  res.json({ message: "Login exitoso", user: { email } });
});

// Agregar registro de horas
app.post("/timesheet", (req, res) => {
  const { email, date, hours, project, description } = req.body;

  if (!email || !date || !hours || !project) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  const entry = { id: Date.now(), email, date, hours, project, description };
  TIMESHEETS.push(entry);

  res.json({ message: "Registro guardado", entry });
});

// Obtener registros
app.get("/timesheet", (req, res) => {
  res.json(TIMESHEETS);
});

// Borrar un registro
app.delete("/timesheet/:id", (req, res) => {
  const { id } = req.params;
  TIMESHEETS = TIMESHEETS.filter((e) => e.id != id);
  res.json({ message: "Registro eliminado" });
});

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
});
