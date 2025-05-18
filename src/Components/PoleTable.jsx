// S. Sheta 2025
// Editable table for managing poles (real/imag or mag/angle depending on coordSystem)

import React from 'react';
import { LuCirclePlus } from "react-icons/lu";

export default function PoleTable({ poles, onAdd, onEdit, onDelete, coordSystem, enforceRealOutput }) {

    const addPole = () => {
        // Prevent rendering bugs with exact (0, 0)
        onAdd({ x: 0.0001, y: 0 });
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

        // Clamp magnitude to just inside unit circle
        const mag = Math.hypot(real, imag);
        if (mag >= 1) {
            const scale = 0.9999 / mag;
            real *= scale;
            imag *= scale;
        }

        onEdit(poleId, { real, imag });
    }

    const makeInput = (value, onChangeFn, step, min, max, key, label) => (
        <input
            key={key}
            className="table-cell"
            type="number"
            step={step}
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChangeFn(parseFloat(e.target.value))}
            onBlur={(e) => onChangeFn(parseFloat(e.target.value))}
            onKeyDown={(e) => {
                if (e.key === 'Enter') onChangeFn(parseFloat(e.target.value));
            }}
            aria-label={label}
        />
    );

    function renderPoleRow(pole, isGhost = false) {
        const { id, pos } = pole;
        const readOnly = isGhost;

        let inputs;

        if (coordSystem === 'rect') {
            inputs = [
                makeInput(
                    pos.real.toFixed(4),
                    val => !readOnly && onUserInput(id, val, pos.imag),
                    '0.01', '-1', '1',
                    `${id}-real`,
                    `Real part for pole ${id}`
                ),
                makeInput(
                    pos.imag.toFixed(4),
                    val => !readOnly && onUserInput(id, pos.real, val),
                    '0.01', '-1', '1',
                    `${id}-imag`,
                    `Imaginary part for pole ${id}`
                ),
            ];
        } else {
            const mag = Math.hypot(pos.real, pos.imag);
            const angle = Math.atan2(pos.imag, pos.real) * (180 / Math.PI);
            inputs = [
                makeInput(
                    mag.toFixed(4),
                    val => !readOnly && onUserInput(id, val, angle),
                    '0.01', '0', '1',
                    `${id}-mag`,
                    `Magnitude for pole ${id}`
                ),
                makeInput(
                    angle.toFixed(2),
                    val => !readOnly && onUserInput(id, mag, val),
                    '0.1', '-180', '180',
                    `${id}-angle`,
                    `Angle (deg) for pole ${id}`
                ),
            ];
        }

        return (
            <div 
                key={`${id}-${isGhost ? 'ghost' : 'real'}`} 
                className={`table-row${isGhost ? ' ghost' : ''}`}
            >
                <span className={`table-cell${isGhost ? ' ghost' : ''} first-col`}>{id}</span>
                {inputs}
                {!readOnly ? (<button className="icon-button small table-cell" onClick={() => onDelete(id)}>X</button>) : <span/>}
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
                            <span className="table-cell first-col">ID</span>
                            <span className="table-cell">Real</span>
                            <span className="table-cell">Imag</span>
                        </>
                    ) : (
                        <>
                            <span className="table-cell first-col">ID</span>
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
                            pos: { real: p.pos.real, imag: -p.pos.imag }
                        };
                        rows.push(renderPoleRow(ghost, true));
                    }
                    return rows;
                })}
            </div>
        </div>
    );
}
