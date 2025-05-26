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

    const makeInputField = (value, onChangeFn, step, min, max, key, label) => (
        <td key={key}>
            <input
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
        </td>
    );

    function renderPoleRow(pole, enforceRealOutput = false) {
        const { id, pos } = pole;
        const hasGhost = enforceRealOutput && Math.abs(pos.imag) > 1e-7;

        const makeSingleRow = (p, isGhost = false) => {
            let inputFields;
            if (coordSystem === 'rect') {
                inputFields = [
                    makeInputField(
                        p.pos.real.toFixed(4),
                        val => !isGhost && onUserInput(p.id, val, p.pos.imag),
                        '0.01', '-1', '1',
                        `${p.id}-real`,
                        `Real part for pole ${p.id}`
                    ),
                    makeInputField(
                        p.pos.imag.toFixed(4),
                        val => !isGhost && onUserInput(p.id, p.pos.real, val),
                        '0.01', '-1', '1',
                        `${p.id}-imag`,
                        `Imaginary part for pole ${p.id}`
                    ),
                ];
            } else {
                const mag = Math.hypot(p.pos.real, p.pos.imag);
                const angle = Math.atan2(p.pos.imag, p.pos.real) * (180 / Math.PI);
                inputFields = [
                    makeInputField(
                        mag.toFixed(4),
                        val => !isGhost && onUserInput(p.id, val, angle),
                        '0.01', '0', '1',
                        `${p.id}-mag`,
                        `Magnitude for pole ${p.id}`
                    ),
                    makeInputField(
                        angle.toFixed(2),
                        val => !isGhost && onUserInput(p.id, mag, val),
                        '0.1', '-180', '180',
                        `${p.id}-angle`,
                        `Angle (deg) for pole ${p.id}`
                    ),
                ];
            }

            return (
                <tr
                    key={`${p.id}-${isGhost ? 'ghost' : 'real'}`}
                    className={isGhost ? 'ghost' : ''}
                >
                    <td className={isGhost ? 'ghost' : ''}>{p.id}</td>
                    {inputFields}
                    {!isGhost && (
                        <td rowSpan={hasGhost ? 2 : 1}>
                            <button className="icon-button small" onClick={() => onDelete(p.id)}>×</button>
                        </td>
                    )}
                </tr>
            );
        };

        const rows = [makeSingleRow(pole, false)];

        if (hasGhost) {
            const ghost = {
                ...pole,
                pos: { real: pos.real, imag: -pos.imag }
            };
            rows.push(makeSingleRow(ghost, true));
        }

        return rows;
    }

    return (
        <div className="section-container">
            <div className="scrollable-table">
                <table>
                    <colgroup>
                        <col />
                        <col style={{ width: '35%' }} />
                        <col style={{ width: '35%' }} />
                        <col />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{coordSystem === 'rect' ? 'Real' : 'Mag'}</th>
                            <th>{coordSystem === 'rect' ? 'Imag' : 'Angle'}</th>
                            <th><button title="Add a pole" className="icon-button" onClick={addPole}><LuCirclePlus></LuCirclePlus></button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {poles.flatMap(p => renderPoleRow(p, enforceRealOutput))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
