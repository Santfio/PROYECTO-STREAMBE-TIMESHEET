const API = 'http://localhost:4000';

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.json();
}

export function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function getProjects() {
  const res = await fetch(`${API}/projects`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener proyectos');
  return res.json();
}

export async function createEntry(payload) {
  const res = await fetch(`${API}/entries`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Error al crear entrada');
  return res.json();
}

export async function listEntries() {
  const res = await fetch(`${API}/entries`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al listar entradas');
  return res.json();
}

export async function getMetrics() {
  const res = await fetch(`${API}/metrics/hours-by-project`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener métricas');
  return res.json();
}