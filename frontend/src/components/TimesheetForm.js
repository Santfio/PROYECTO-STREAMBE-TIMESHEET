import React, { useState, useEffect } from 'react';
import { createEntry } from '../api';

export default function TimesheetForm({ projects = [], onSaved }) {
  const today = new Date().toISOString().slice(0,10);
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [projectId, setProjectId] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(()=>{
    if(projects.length) setProjectId(projects[0]?.id || '');
  }, [projects]);

  async function submit(e){
    e.preventDefault();
    setLoading(true); setMsg(null);
    try{
      await createEntry({ date, startTime, endTime, projectId: projectId || null, description: desc });
      setMsg('Entrada guardada');
      setDesc('');
      if(onSaved) onSaved();
    } catch(err) {
      setMsg(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="card">
      <h3>Cargar horas</h3>
      <form className="form-grid" onSubmit={submit}>
        <div>
          <label>Fecha</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <div>
          <label>Proyecto</label>
          <select value={projectId} onChange={e=>setProjectId(e.target.value)}>
            <option value=''>-- Ninguno --</option>
            {projects.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label>Hora inicio</label>
          <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} />
        </div>
        <div>
          <label>Hora fin</label>
          <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} />
        </div>
        <div style={{gridColumn:'1 / -1'}}>
          <label>Descripción</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} style={{width:'100%', minHeight:70, padding:8, borderRadius:8, border:'1px solid #e6e9ef'}} />
        </div>
        <div style={{gridColumn:'1 / -1', display:'flex', justifyContent:'flex-end'}}>
          <button className='btn' type='submit' disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
      {msg && <div style={{marginTop:8}}>{msg}</div>}
    </div>
  );
}