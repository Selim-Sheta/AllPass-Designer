// S. Sheta 2025

import React, { useState, useEffect } from 'react';
import UnitCircle from './UnitCircle';
import PoleHandle from './PoleHandle';
import PoleTable from './PoleTable';
import CoeffTable from './CoeffTable';
import PhasePlot from './PhasePlot';
import OptionsPanel from './OptionsPanel';
import {saveToFile,loadFromFile,getURLState,loadFromURL} from '../utils/stateIO';

let idCounter = 0;

export default function FilterDesigner() {
    const [poles, setPoles] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [unitRadius, setUnitRadius] = useState(null);

    //Apply loaded state
    function hydrateState(data) {
        if (data.poles) setPoles(data.poles);
        if (data.options) setOptions(prev => ({ ...prev, ...data.options }));
    }

    // Load from URL on mount
    useEffect(() => {
        const state = loadFromURL();
        if (state) hydrateState(state);
    }, []);

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
            <OptionsPanel 
            options={options} 
                updateOption={updateOption}
                onSave={() => saveToFile({ poles, options })}
                onLoad={() => loadFromFile(hydrateState)}
                onCopyLink={() => {
                    const url = `${window.location.origin}${window.location.pathname}?state=${getURLState({ poles, options })}`;
                    navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
                }}
            />
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
                            enforceRealOutput={options.enforceRealOutput}
                            imagValue={p.pos.imag}
                        />
                    ))}
                </UnitCircle>
                <PoleTable
                    poles={poles}
                    onAdd={addPole}
                    onEdit={updatePole}
                    onDelete={removePole}
                    coordSystem={options.coordSystem}
                    enforceRealOutput={options.enforceRealOutput}
                />
            </div>
            <div className='filter-design-panel'>
                <PhasePlot 
                    poles={poles} 
                    enforceRealOutput={options.enforceRealOutput}
                />
                <CoeffTable
                    poles={poles}
                    enforceRealOutput={options.enforceRealOutput}
                />
            </div>
        </div>
    );
}
