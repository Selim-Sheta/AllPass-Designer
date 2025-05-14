// S. Sheta 2025

import React, { useState } from 'react';
import UnitCircle from './UnitCircle';
import PoleHandle from './PoleHandle';
import PoleTable from './PoleTable';
import PhasePlot from './PhasePlot';

let idCounter = 0;

export default function FilterDesigner() {
    const [poles, setPoles] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [unitRadius, setUnitRadius] = useState(null);

    // HANDLERS FOR POLE MANAGEMENT
    const addPole = (pixelPos) => {
        if (unitRadius === null) return null;
        const real = pixelPos.x / unitRadius;
        const imag = -pixelPos.y / unitRadius;
        const newPole = { id: idCounter++, pos: { real, imag } };
        setPoles((prev) => [...prev, newPole]);
        return newPole.id;
    };

    const updatePole = (id, updates) => {
        setPoles((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, pos: { ...p.pos, ...updates } } : p
            )
        );
    };

    const removePole = (id) => {
        setPoles((prev) => prev.filter((p) => p.id !== id));
        if (id === activeId) setActiveId(null);
    };

    const startImmediateDrag = (id) => {
        setActiveId(id);
    };

    return (
        <div className="app-container">
            <div className="options-panel">
                <h2>Options (Coming Soon)</h2>
            </div>
            <div className="filter-design-panel">
                <UnitCircle
                    onAddPole={addPole}
                    onStartImmediateDrag={startImmediateDrag}
                    onResize={setUnitRadius}
                >
                    {poles.map((p) => (
                        <PoleHandle
                            key={p.id}
                            id={p.id}
                            x={p.pos.real * unitRadius}
                            y={-p.pos.imag * unitRadius}
                            radius={unitRadius}
                            isActive={activeId === p.id}
                            onDragStart={setActiveId}
                            onDrag={(id, pixelPos) => {
                                const real = pixelPos.x / unitRadius;
                                const imag = -pixelPos.y / unitRadius;
                                updatePole(id, { real, imag });
                            }}
                            onDragEnd={() => setActiveId(null)}
                            diameter={30}
                        />
                    ))}
                </UnitCircle>
                <PoleTable
                    poles={poles}
                    onAddPole={addPole}
                    onEdit={updatePole}
                    onDelete={removePole}
                />
            </div>
            <PhasePlot poles={poles} />
            <button className="download-btn" onClick={() => {/* TBD */ }}>
                Download Coefficients
            </button>
        </div>
    );
}
