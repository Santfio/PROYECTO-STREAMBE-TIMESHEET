import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TimesheetForm from './components/TimesheetForm';
import TimesheetList from './components/TimesheetList';
import Metrics from './components/Metrics';
import { listEntries, getProjects, getMetrics } from './api';

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [entries, setEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [e, p, m] = await Promise.all([listEntries(), getProjects(), getMetrics()]);
      setEntries(e);
      setProjects(p);
      setMetrics(m);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(data) {
    // data: { token, user }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setEntries([]);
    setProjects([]);
    setMetrics([]);
  }

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="container">
      <header className="header">
        <h1>Timesheet</h1>
        <div className="header-right">
          <span>Hola, <strong>{user.name}</strong></span>
          <button className="btn small" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main>
        {error && <div className="alert">{error}</div>}
        <TimesheetForm projects={projects} onSaved={fetchAll} />
        <section className="columns">
          <Metrics data={metrics} />
          <div style={{flex:1}}>
            <h3>Entradas</h3>
            {loading ? <p>Cargando...</p> : <TimesheetList entries={entries} />}
          </div>
        </section>
      </main>

      <footer className="footer">
        <small>Proyecto Timesheet - Demo</small>
      </footer>
    </div>
  );
}