// S. Sheta 2025

import React, { useState, useEffect } from 'react';
import OptionsPanel from './OptionsPanel';
import UnitCircle from './UnitCircle';
import PoleHandle from './PoleHandle';
import PoleTable from './PoleTable';
import CoeffTable from './CoeffTable';
import PhasePlot from './PhasePlot';
import {saveToFile,loadFromFile,getURLState,loadFromURL,updateURL} from '../utils/stateIO';

const POLE_DIAMETER = 30;
export default function FilterDesigner() {
    const [idCounter, setIDCounter] = useState(1);
    const [poles, setPoles] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [unitRadius, setUnitRadius] = useState(null);
    const [options, setOptions] = useState({
        enforceRealOutput: true,
        coordSystem: 'polar',
        displayTheme: 'light',
        plotOptions: {
            display: 'phase-delay',
            logScale: false,
            xUnits: 'rads-per-sample',
            yUnits: 'rads'
        },
        sampleRate: 48000
    });

    // Set state
    function hydrateState(data) {
        if (data.poles) setPoles(data.poles);
        if (data.options) setOptions(prev => ({ ...prev, ...data.options }));
        if (data.idCounter) setIDCounter(data.idCounter);
    }

    // Load initial state from URL
    useEffect(() => {
        const state = loadFromURL();
        if (state) hydrateState(state);
    }, []);

    // Apply theme
    useEffect(() => {
        document.body.classList.toggle('dark', options.displayTheme === 'dark');
    }, [options.displayTheme]);

    // Periodically update URL
    useEffect(() => {
        const intervalId = setInterval(() => {
            updateURL({ poles, options, idCounter });
        }, 60000);
        // clean up interval when state changes
        return () => clearInterval(intervalId);
    }, [poles, options, idCounter]);

    const addPole = (pixelPos) => {
        if (unitRadius === null) return null;
        const real = pixelPos.x / unitRadius;
        const imag = -pixelPos.y / unitRadius;
        const newPole = { id: idCounter, pos: { real, imag } };
        setIDCounter(idCounter+1);
        setPoles((prev) => [...prev, newPole]);
        setTimeout(() => updateURL({ poles, options, idCounter }), 0);
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
        setPoles((prev) => {
            const filtered = prev.filter((p) => p.id !== id);
            const reassigned = filtered.map((p, index) => ({
                ...p,
                id: index + 1
            }));
            setIDCounter(1 + reassigned.length);
            return reassigned;
        });
        if (id === activeId) setActiveId(null);
        setTimeout(() => updateURL({ poles, options, idCounter }), 0);
    };

    const startImmediateDrag = (id) => {
        setActiveId(id);
    };

    const clearAll = () => {
        setPoles([]);
        setActiveId(null);
        setIDCounter(1);
    }

    const updateGlobalOptions = (key, value) => {
        setOptions((prev) => ({ ...prev, [key]: value }));
    };

    const updatePlotOptions = (key, value) => {
        setOptions(prev => ({
            ...prev,
            plotOptions: {
                ...prev.plotOptions,
                [key]: value
            }
        }));
    };

    return (
        <div className="app-container">
            <OptionsPanel 
            options={options} 
                updateOption={updateGlobalOptions}
                onSave={() => saveToFile({ poles, options, idCounter })}
                onLoad={() => loadFromFile(hydrateState)}
                onCopyLink={() => {
                    const url = `${window.location.origin}${window.location.pathname}?state=${getURLState({ poles, options, idCounter })}`;
                    navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
                }}
                onClearAll={clearAll}
            />
            <div className="main-grid">
                <div className="unit-circle-container">
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
                                onDelete={removePole}
                                diameter={30}
                                enforceRealOutput={options.enforceRealOutput}
                                imagValue={p.pos.imag}
                            />
                        ))}
                    </UnitCircle>
                </div>
                <div className="pole-table-container">
                    <PoleTable
                        poles={poles}
                        onAdd={addPole}
                        onEdit={updatePole}
                        onDelete={removePole}
                        coordSystem={options.coordSystem}
                        enforceRealOutput={options.enforceRealOutput}
                    />
                </div>
                <div className="phase-plot-container">
                    <PhasePlot
                        poles={poles}
                        enforceRealOutput={options.enforceRealOutput}
                        sampleRate={options.sampleRate}
                        plotOptions={options.plotOptions}
                        updatePlotOptions={updatePlotOptions}
                    />
                </div>
                <div className='coeff-table-container'>
                    <CoeffTable
                        poles={poles}
                        enforceRealOutput={options.enforceRealOutput}
                    />
                </div>
            </div>
        </div>
    );
}
