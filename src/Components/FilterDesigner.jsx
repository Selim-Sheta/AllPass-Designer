// S. Sheta 2025
// Main layout wrapper for the 3-pane view

import React, { useState } from 'react';
import UnitCircle from './UnitCircle';
import PoleHandle from './PoleHandle';
import PoleTable from './PoleTable';
import PhasePlot from './PhasePlot';

let idCounter = 0;

export default function FilterDesigner() {
  const [poles, setPoles] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const addPole = (pos) => {
    const newPole = { id: idCounter++, pos };
    setPoles((prev) => [...prev, newPole]);
  };

  const updatePole = (id, pos) => {
    setPoles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, pos } : p))
    );
  };

  const removePole = (id) => {
    setPoles((prev) => prev.filter((p) => p.id !== id));
    if (id === activeId) setActiveId(null);
  };

  return (
    <div className="filter-designer-container">
      <div className="top-row">
        <UnitCircle onAddPole={addPole}>
          {poles.map((p) => (
            <PoleHandle
              key={p.id}
              id={p.id}
              x={p.pos.x}
              y={p.pos.y}
              radius={135}
              isActive={activeId === p.id}
              onDragStart={setActiveId}
              onDrag={updatePole}
              onDragEnd={() => setActiveId(null)}
              className="inner-circle"
            />
          ))}
        </UnitCircle>
        <PoleTable
          poles={poles}
          onEdit={updatePole}
          onDelete={removePole}
        />
      </div>
      <PhasePlot poles={poles} />
      <button className="download-btn" onClick={() => {/* TBD */}}>
        Download Coefficients
      </button>
    </div>
  );
}
