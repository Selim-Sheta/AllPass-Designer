import React, { useState } from 'react';
import { UnitCircle } from './UnitCircle';
import Pole from './Pole';
import '../styles.css';

let idCounter = 0;

export default function InteractivePlot() {
    const [poles, setPoles] = useState([]);
    const [activeId, setActiveId] = useState(null);

    const addPole = (pos) => {
        const newPole = {
            id: idCounter++,
            pos
        };
        setPoles([...poles, newPole]);
    };

    const updatePole = (id, pos) => {
        setPoles(poles.map(p => p.id === id ? { ...p, pos } : p));
    };

    const removePole = (id) => {
        setPoles(poles.filter(p => p.id !== id));
        if (activeId === id) setActiveId(null);
    };

    return (
        <div className="interactive-plot">
            <UnitCircle onClick={addPole}>
                {poles.map(p => (
                    <Pole
                        key={p.id}
                        x={p.pos.x}
                        y={p.pos.y}
                        radius={135} // 150 - pole radius; adapt if needed
                        isActive={activeId === p.id}
                        onDrag={(newPos) => updatePole(p.id, newPos)}
                        onDragStart={() => setActiveId(p.id)}
                        onDragEnd={() => setActiveId(null)}
                    />
                ))}
            </UnitCircle>
            <div className="pole-list">
                <h3>Poles</h3>
                {poles.map(p => (
                    <div key={p.id} className="pole-row">
                        <span>ID: {p.id}</span>
                        <span>Real: {p.pos.x.toFixed(1)}</span>
                        <span>Imag: {-p.pos.y.toFixed(1)}</span>
                        <button onClick={() => removePole(p.id)}>X</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
