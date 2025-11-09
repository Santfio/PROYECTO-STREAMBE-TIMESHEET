import React from 'react';

export default function Metrics({ data = [] }){
  return (
    <div className="card" style={{width:320}}>
      <h3>Métricas</h3>
      <ul>
        {data.length===0 && <li>No hay datos</li>}
        {data.map(d => <li key={d.project}>{d.project || 'Sin proyecto'}: <strong>{Number(d.totalHours).toFixed(2)} hrs</strong></li>)}
      </ul>
    </div>
  );
}