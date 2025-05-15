// S. Sheta 2025

import React, { useState, useEffect } from 'react';
import UnitCircle from './UnitCircle';
import PoleHandle from './PoleHandle';
import PoleTable from './PoleTable';
import PhasePlot from './PhasePlot';
import OptionsPanel from './OptionsPanel';
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

    // OPTIONS HANDLER
    const [options, setOptions] = useState({
        enforceRealOutput: false,
        coordSystem: 'rect',
        displayTheme: 'light'
    });

    const updateOption = (key, value) => {
        setOptions((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        document.body.classList.toggle('dark', options.displayTheme === 'dark');
    }, [options.displayTheme]);


    return (
        <div className="app-container">
            <OptionsPanel options={options} updateOption={updateOption} />
            <div className="filter-design-panel">
                <UnitCircle
                    onAddPole={addPole}
                    onStartImmediateDrag={startImmediateDrag}
                    onResize={setUnitRadius}
                    coordSystem={options.coordSystem}
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
                <div className = "table-container">
                    <button onClick={() => addPole({ x: 0, y: 0 })}>+</button>
                    <PoleTable
                        poles={poles}
                        onEdit={updatePole}
                        onDelete={removePole}
                        coordSystem={options.coordSystem}
                    />
                </div>
            </div>
            <PhasePlot poles={poles} />
            <button className="download-btn" onClick={() => {/* TBD */ }}>
                Download Coefficients
            </button>
        </div>
    );
}
