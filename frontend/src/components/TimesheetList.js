import React from 'react';

export default function TimesheetList({ entries = [] }){
  if(!entries.length) return <div className="card"><em>No hay entradas aún</em></div>;
  return (
    <div className="card">
      <table>
        <thead>
          <tr><th>Fecha</th><th>Usuario</th><th>Proyecto</th><th>Inicio</th><th>Fin</th><th>Horas</th><th>Descripción</th></tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.id}>
              <td>{e.date}</td>
              <td>{e.userName}</td>
              <td>{e.projectName || '-'}</td>
              <td>{e.startTime}</td>
              <td>{e.endTime}</td>
              <td>{Number(e.totalHours).toFixed(2)}</td>
              <td>{e.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}