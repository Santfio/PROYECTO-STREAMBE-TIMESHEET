import React, { useState } from 'react';
import { login } from '../api';

/**
 * Login behavior updates:
 * - Removed any visible publishing of the demo password.
 * - Added 'Autocompletar demo' button that fills fields (password not shown).
 * - Added show/hide toggle next to the password input.
 */

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const data = await login(email, password);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  function fillDemo() {
    // We don't display the demo password in plain text anywhere.
    setEmail('demo@example.com');
    setPassword('password');
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h2 style={{marginTop:0}}>Iniciar sesión</h2>
        <form onSubmit={submit}>
          <div style={{marginBottom:12}}>
            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@ejemplo.com" />
          </div>

          <div style={{marginBottom:8}}>
            <label>Contraseña</label>
            <div className="input-row">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e=>setPassword(e.target.value)}
                placeholder="Tu contraseña"
                style={{flex:1}}
              />
              <button type="button" className="pw-toggle" onClick={()=>setShowPwd(s=>!s)}>{showPwd ? 'Ocultar' : 'Mostrar'}</button>
            </div>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
            <button className='btn' type='submit' disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <button type="button" className="btn small" onClick={fillDemo} title="Autocompleta la cuenta de prueba">Autocompletar demo</button>
            </div>
          </div>

          {error && <div style={{color:'#9b1c1c', marginTop:10}}>{error}</div>}
        </form>
        <p style={{marginTop:12, color:'#6b7280', fontSize:13}}>Si necesitás acceder con la cuenta demo, usá el botón <em>Autocompletar demo</em>.</p>
      </div>
    </div>
  );
}