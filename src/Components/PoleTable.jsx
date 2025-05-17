// S. Sheta 2025
// Editable table component for pole data

import React from 'react';
import { LuCirclePlus } from "react-icons/lu";

export default function PoleTable({ poles, onAdd, onEdit, onDelete, coordSystem, enforceRealOutput }) {

    const addPole = () => {
        onAdd({ x: 0, y: 0 });
    }

    function onUserInput(poleId, input1, input2) {
        if (isNaN(input1) || isNaN(input2)) return;
        let real, imag;

        if (coordSystem === 'rect') {
            real = input1;
            imag = input2;
        } else {
            const angleRad = (input2 * Math.PI) / 180;
            real = input1 * Math.cos(angleRad);
            imag = input1 * Math.sin(angleRad);
        }

        const mag = Math.sqrt(real * real + imag * imag);
        if (mag >= 1) {
            const scale = 0.9999 / mag;
            real *= scale;
            imag *= scale;
        }

        onEdit(poleId, { real, imag });
    }

    function renderPoleRow(pole, isGhost = false) {
        const { id, pos } = pole;
        const displayId = isGhost ? `${id}*` : id;
        const readOnly = isGhost;

        const makeInput = (value, onChangeFn, step = '0.01', min = '-1', max = '1') => (
            <input
                className="table-cell"
                type="number"
                step={step}
                value={value}
                min={min}
                max={max}
                readOnly={readOnly}
                onChange={(e) => !readOnly && onChangeFn(parseFloat(e.target.value))}
                onBlur={(e) => !readOnly && onChangeFn(parseFloat(e.target.value))}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !readOnly) {
                        onChangeFn(parseFloat(e.target.value));
                    }
                }}
            />
        );

        let inputs;
        if (coordSystem === 'rect') {
            inputs = [
                makeInput(pos.real.toFixed(4), val => onUserInput(id, val, pos.imag)), // real
                makeInput(pos.imag.toFixed(4), val => onUserInput(id, pos.real, val)), // imag
            ];
        } else {
            const mag = Math.sqrt(pos.real ** 2 + pos.imag ** 2);
            const angle = Math.atan2(pos.imag, pos.real) * (180 / Math.PI);
            inputs = [
                makeInput(mag.toFixed(4), val => onUserInput(id, val, angle), '0.01', '0', '1'), // mag
                makeInput(angle.toFixed(2), val => onUserInput(id, mag, val), '0.1', '-180', '180'), // angle
            ];
        }

        return (
            <div key={`${id}-${isGhost ? 'ghost' : 'real'}`} className={`table-row${isGhost ? ' ghost' : ''}`}>
                <span className="table-cell">{displayId}</span>
                {inputs}
                {!readOnly ? <button className="icon-button small" onClick={() => onDelete(id)}>X</button> : <span></span>}
            </div>
        );
    }

    return (
        <div className="filter-design-element">
            <button title="Add a pole" className="icon-button" onClick={addPole}><LuCirclePlus /></button>
            <div id="poles-table" className="scrollable-table">
                <div className="table-row table-headers">
                    {coordSystem === 'rect' ? (
                        <>
                            <span className="table-cell">ID</span>
                            <span className="table-cell">Real</span>
                            <span className="table-cell">Imag</span>
                        </>
                    ) : (
                        <>
                            <span className="table-cell">ID</span>
                            <span className="table-cell">Mag</span>
                            <span className="table-cell">Angle</span>
                        </>
                    )}
                </div>
                {poles.flatMap((p) => {
                    const rows = [renderPoleRow(p, false)];
                    if (enforceRealOutput && Math.abs(p.pos.imag) > 1e-6) {
                        const ghost = {
                            ...p,
                            pos: {
                                real: p.pos.real,
                                imag: -p.pos.imag
                            }
                        };
                        rows.push(renderPoleRow(ghost, true));
                    }
                    return rows;
                })}
            </div>
        </div>
    );
}
